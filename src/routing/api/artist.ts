import express from "express";

import logger from "../../logger";
import { ExtendedReq, ExtendedRes } from "../../middlewares/express";

import * as artist from "../../structs/artist";



function getMissingFields(json: {}, against: []) {
    var missing = []
    for (const key of against) {
        if (!json[key]) missing.push(key);
    }

    return missing;
}


const router = express.Router();

router.post("/", async (req: ExtendedReq, res: ExtendedRes) => {
    if (!await req.expectAdmin())
        return res.addMessage(403, "You do not have permissions to add an artist." );

    if (req.headers["content-type"] === undefined)
        return res.addMessage(400, "Missing content-type header parameter.")

    if (!req.expectHeader("content-type", ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]))
        return;

    var missingFields = getMissingFields(["name", "status", "availability"], req.body)
    if (missingFields.length > 0) {
        return res.addMessage(400, "A few fields were missing from this request.", missingFields)
    }

    if (Status[req.body.status] === undefined)
        return res.addMessage(400, `Status is invalid. List of possible values: ${Object.values(Status).join(", ")}` );

    if (Availability[req.body.availability] === undefined)
        return res.addMessage(400, `Availability is invalid. List of possible values: ${Object.values(Availability).join(", ")}`);

    let existingArtist = await Artist.FetchByName(req.body.name);

    if (existingArtist !== null)
        return res.addMessage(409, `Artist with this name already exists. (${existingArtist.id} | ${existingArtist.safeName}: ${existingArtist.name})`);

    let artist = await Artist.Create(req.body);

    logger.Log(`${artist.name} successfully created.`, "/api/artists : POST");

    return res.addMessage(201,
        `${artist.name} has been successfully added to the database.`,
        artist
    )
});


router.patch("/:id", async (req: ExtendedReq, res: ExtendedRes) => {
    if (!await req.expectAdmin())
        return res.addMessage(403, "You do not have permission to edit an artist." );

    if (req.headers["content-type"] === undefined)
        return res.addMessage(400, "Missing content-type header parameter.")

    if (!req.expectHeader("content-type", ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]))
        return;

    logger.Log("Attempting to update artist...", "/api/artists/:id : PATCH");

    let artist = await Artist.FetchById(parseInt(req.params.id));

    if (artist === null)
        return res.addMessage(404, "This artist does not exist in the database.");

    let allowedChanges: any = {
        name: req.body.name,
        aliases: req.body.aliases,
        description: req.body.description,
        status: req.body.status,
        availability: req.body.availability,
        tracks: req.body.tracks,
        genre: req.body.genre,
        notes: req.body.notes,
    }

    if (allowedChanges.name !== undefined && allowedChanges.name !== artist.name) {
        allowedChanges.safeName = Artist.GetSafeName(allowedChanges.name);
    }

    let changed: any = await Artist.Update(artist.id, allowedChanges);
    changed.aliases = JSON.parse(changed.aliases);

    logger.Log(`${artist.name} successfully updated.`, "/api/artists/:id : PATCH");

    return res.code(200, changed)
});


export default router;
