import { PrismaClient } from "@prisma/client";
import Logger from "../logger";



declare var Prisma: PrismaClient;

class Artist {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }

    static async FetchById(id: number) {
        return await Prisma.artist.findUnique({
            where: { id: id },
            include: { rights: true, socials: true }
        });
    }

    static async FetchByName(name: string) {
        let safe = this.GetSafeName(name);

        return await Prisma.artist.findFirst({
            where: { safeName: safe },
            include: { rights: true, socials: true }
        });
    }


    static async Create(data) {
        data.safeName = this.GetSafeName(data.name);

        let rights = data.rights;
        let socials = data.socials;

        delete data.rights;
        delete data.socials;

        if (data.aliases) {
            data.aliases = JSON.stringify(data.aliases);
        }

        try {
            return await Prisma.artist.create({
                data: {
                    ...data,
                    rights: { create: rights },
                    socials: { create: socials }
                },
                include: {
                    rights: true,
                    socials: true
                }
            });
        } catch (e) {
            Logger.Error(e);
        }
    }


    static async Update(id: number, data) {
        if (data.name) {
            data.safeName = this.GetSafeName(data.name);
        }

        if (data.aliases) {
            data.aliases = JSON.stringify(data.aliases);
        }

        return await Prisma.artist.update({
            where: { id: id },
            data
        })
    }


    static async Delete(id: number) {
        let artist = await this.FetchById(id);

        if (artist === null)
            return null;

        await Prisma.right.deleteMany({
            where: { id: { in: artist.rights.map(r => r.id) } }
        });

        await Prisma.social.deleteMany({
            where: { id: { in: artist.socials.map(r => r.id) } }
        });

        return await Prisma.artist.delete({
            where: { id: id },
        });
    }

    static GetSafeName(name: string) {
        return name.trim().replaceAll(" ", "_").toLowerCase();
    }
}


export default Artist;

export enum Status {
    NONE = "NONE",
    COMPLETED = "COMPLETED",
    NO_CONTACT = "NO_CONTACT",
    PENDING = "PENDING",
    REQUESTED = "REQUESTED"
}

export enum Availability {
    NONE = "NONE",
    VERIFIED = "VERIFIED",
    DISALLOWED = "DISALLOWED",
    CONTACT_REQUIRED = "CONTACT_REQUIRED",
    VARIES = "VARIES"
}