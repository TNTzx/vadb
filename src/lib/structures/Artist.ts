import { PrismaClient } from "@prisma/client";
import Logger from "../util/Logger";

declare var Prisma: PrismaClient;

class Artist {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }

    static async FetchById(id) {
        return await Prisma.artist.findUnique({
            where: { id: id }
        });
    }

    static async FetchByName(name) {
        return await Prisma.artist.findFirst({
            where: { name: name }
        });
    }

    static async Create(data) {
        data.safeName = data.name.trim().replace(" ", "_").toLowerCase();
        delete data.__missing;

        let artist;

        try {
            artist = await Prisma.artist.create({ data });
        } catch (e) {
            Logger.Error(e);
        }

        return artist;
    }

    static async Update(id, data) {
        return await Prisma.artist.update({
            where: { id: id },
            data
        })
    }
}

module.exports = Artist;

module.exports.Status = {
    NONE: "NONE",
    COMPLETED: "COMPLETED",
    NO_CONTACT: "NO_CONTACT",
    PENDING: "PENDING",
    REQUESTED: "REQUESTED"
}

module.exports.Availability = {
    NONE: "NONE",
    VERIFIED: "VERIFIED",
    DISALLOWED: "DISALLOWED",
    CONTACT_REQUIRED: "CONTACT_REQUIRED",
    VARIES: "VARIES"
}