const prisma = require("@prisma/client");

class Artist {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }

    static async FetchById(id) {
        return await Prisma.artist.findUnique({
            where: { id: id }
        });
    }

    static async FetchByUsername(username) {
        return await Prisma.artist.findUnique({
            where: { username: username }
        });
    }

    static async Create(data) {
        data.safeName = data.name.trim().replace(" ", "_").toLowerCase();
        
        let artist = await Prisma.artist.create({
            data
        });

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