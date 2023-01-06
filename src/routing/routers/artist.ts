import Logger from "../../lib/util/logger";
import { RouterInfo } from "../routerInfo";
import { ExtendedReq, ExtendedRes } from "../../lib/middlewares/override";

import Artist from "../../lib/structures/artist";
import { Status, Availability } from "../../lib/structures/artist";



function validateFields(against = [], object) {
    object.__missing = [];

    for (const key of against) {
        if (!object[key])
            object.__missing.push(key);
    }

    return object.__missing.length === 0;
}


export default () => {
    const routerInfo = new RouterInfo("/api/artist");

    routerInfo.router.post("/", async (req: ExtendedReq, res: ExtendedRes) => {
        if (!await req.validate())
            return res.message(403, { message: "You do not have permissions to add an artist." });

        if (req.headers["content-type"] === undefined)
            return res.message(400, { message: "Missing content-type header parameter." })

        if (!req.expect("content-type", ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]))
            return;

        if (!validateFields(["name", "status", "availability"], req.body)) {
            return res.message(400, {
                message: "A few fields were missing from this request.",
                data: {
                    missing: req.body.__missing
                }
            })
        }

        if (Status[req.body.status] === undefined)
            return res.message(400, { message: `Status is invalid. List of possible values: ${Object.values(Status).join(", ")}` });

        if (Availability[req.body.availability] === undefined)
            return res.message(400, { message: `Availability is invalid. List of possible values: ${Object.values(Availability).join(", ")}` });

        let existingArtist = await Artist.FetchByName(req.body.name);

        if (existingArtist !== null)
            return res.message(409, { message: `Artist with this name already exists. (${existingArtist.id} | ${existingArtist.safeName}: ${existingArtist.name})` });

        let artist = await Artist.Create(req.body);

        Logger.Log(`${artist.name} successfully created.`, "/api/artists : POST");

        return res.message(201, {
            message: `${artist.name} has been successfully added to the database.`,
            data: artist
        })
    });

    routerInfo.router.patch("/:id", async (req: ExtendedReq, res: ExtendedRes) => {
        if (!await req.validate())
            return res.message(403, { message: "You do not have permission to add an artist." });

        if (req.headers["content-type"] === undefined)
            return res.message(400, { message: "Missing content-type header parameter." })

        if (!req.expect("content-type", ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]))
            return;

        Logger.Log("Attempting to update artist...", "/api/artists/:id : PATCH");

        let artist = await Artist.FetchById(parseInt(req.params.id));

        if (artist === null)
            return res.message(404, { message: "This artist does not exist in the database." });

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

        Logger.Log(`${artist.name} successfully updated.`, "/api/artists/:id : PATCH");

        return res.code(200, changed)
    });


    return routerInfo;
}
