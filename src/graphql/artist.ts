import { PrismaClient } from "@prisma/client";

declare var Prisma: PrismaClient;

module.exports.schema = `
type Query {
    artist(id: ID!): Artist
    artists(name: String): [Artist]
    allArtists: [Artist]
}

type Artist {
    id: ID
    name: String
    safeName: String
    aliases: [String]
    description: String
    notes: String
    genre: String
    tracks: Int
    status: Status
    availability: Availability
    addedAt: String
    updatedAt: String
    rights: [Right]
    socials: [Social]
}

type Right {
    id: ID
    name: String
    value: Boolean
    Artist: Artist
}

type Social {
    id: ID
    link: String
    type: String
    icon: String
    Artist: Artist
}

enum Status {
    NONE
    COMPLETED
    NO_CONTACT
    PENDING
    REQUESTED
}

enum Availability {
    NONE
    VERIFIED
    DISALLOWED
    CONTACT_REQUIRED
    VARIES
}
`;

module.exports.resolver = {
    artist: (args) => {
        return Prisma.artist.findUnique({
            where: { id: parseInt(args.id) }
        });
    },
    artists: (args) => {
        return Prisma.artist.findMany({
            where: { name: { contains: args.name } }
        });
    },
    allArtists: () => {
        return Prisma.artist.findMany();
    }
};