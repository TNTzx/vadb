import Artist, { Status, Availability } from "../lib/structures/Artist";
import { PrismaClient } from "@prisma/client";

declare var Prisma: PrismaClient;

module.exports.schema = `
type Query {
    artist(id: ID!): Artist!
    artists(name: String): [Artist]
}

type Mutation {
    createArtist(data: ArtistCreateInput): Artist!
}

input ArtistCreateInput {
    name: String!
    status: Status!
    availability: Availability!
    aliases: [String]
    description: String
    notes: String
    genre: String
    tracks: Int
    rights: [RightCreateInput]
    socials: [SocialCreateInput]
}

input RightCreateInput {
    name: String!
    value: Boolean!
}

input SocialCreateInput {
    link: String!
    type: String!
    icon: String
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
        if (args.name)
            return Prisma.artist.findMany({
                where: { name: { contains: args.name } }
            });
        else
            return Prisma.artist.findMany();
    },
    async createArtist(args: { data: ArtistCreateInput }, context) {
        if (!context.isAdmin)
            throw new Error("Insufficient permissions.");

        let data = args.data;

        if (await Artist.FetchByName(data.name) !== null)
            throw new Error("Artist with this name already exists.");

        return await Artist.Create(data);
    }
};

interface ArtistCreateInput {
    name: string
    status: Status
    availability: Availability
    aliases?: string[]
    description?: string
    notes?: string
    genre?: string
    tracks?: number
    rights?: Right[]
    socials?: Social[]
}

interface Right {
    name: string
    value: boolean
}

interface Social {
    link: string
    type: string
    icon?: string
}