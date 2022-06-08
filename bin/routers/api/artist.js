"use strict";
const Logger = require("../../src/util/Logger");
const Utilities = require("../../src/util/Utilities");
const Artist = require("../../src/structures/Artist");
const router = require("express").Router();
router.post("/", async (req, res) => {
    if (!await req.validate())
        return res.message(403, { message: "You do not have permission to add an artist." });
    if (req.headers["content-type"] === undefined)
        return res.message(400, { message: "Missing content-type header parameter." });
    if (!req.expect("content-type", ["application/x-www-form-urlencoded", "application/json", "multipart/form-data"]))
        return;
    Logger.Log("Attempting to create artist...", "/api/artists : POST");
    if (!Utilities.validate(["name", "status", "availability"], req.body)) {
        return res.message(400, {
            message: "A few fields were missing from this request.",
            data: {
                missing: req.body.__missing
            }
        });
    }
    let existingArtist = await Prisma.artist.findFirst({
        where: { name: req.body.name }
    });
    if (existingArtist !== null)
        return res.message(409, { message: "This artist already exists in the database." });
    let artist = await Artist.Create(req.body);
    Logger.Log(`${artist.name} successfully created.`, "/api/artists : POST");
    return res.message(201, {
        message: `${artist.name} has been successfully added to the database.`,
        data: artist
    });
});
module.exports = router;
