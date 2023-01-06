import Artist from "../lib/structures/artist";
import { PrismaClient } from "@prisma/client";
import Logger from "../lib/logger";

declare var Prisma: PrismaClient;


export var schema = `
type Query {
    right(id: Int!): Right
    rights(artistId: Int!): [Right]
}

type Mutation {
    createRight(artistId: Int!, data: RightCreateInput): Right!
    createRights(artistId: Int!, data: [RightCreateInput]): Int
    updateRight(id: Int!, data: RightUpdateInput): Right
    deleteRight(id: Int!): Right
    deleteRights(id: [Int]!): Int
    deleteAllRights(artistId: Int!): Int
}

input RightCreateInput {
    name: String!
    value: Boolean!
}

input RightUpdateInput {
    name: String
    value: Boolean
}

type Artist {
    id: Int
    name: String
    safeName: String
    aliases: String
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
    id: Int
    name: String
    value: Boolean
    artist: Artist
}

type Social {
    id: Int
    link: String
    type: String
    icon: String
    artist: Artist
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
    async right(args) {
        return await Prisma.right.findUnique({
            where: { id: args.id },
            include: { artist: true }
        });
    },
    async rights(args) {
        return await Prisma.right.findMany({
            where: { artistId: args.artistId },
            include: { artist: true }
        })
    },
    async createRight(args: { artistId, data: RightCreateInput }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to create a right.");

        let data = args.data;
        let right = await Prisma.right.create({
            data: {
                ...data,
                artistId: args.artistId
            },
            include: { artist: true }
        });

        Logger.Log(`Created right "${right.name}" with value "${right.value}" for artist: ${right.artist.name}`, "/graphql/rights : GraphQL");
        return right;
    },
    async createRights(args: { artistId, data: RightCreateInput[] }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to create rights.");

        let count = await Prisma.right.createMany({
            skipDuplicates: true,
            data: args.data.map(data => ({ artistId: args.artistId, ...data })),
        });

        let artist = await Artist.FetchById(args.artistId);

        Logger.Log(`Created ${count.count} rights for artist: ${artist.name}`, "/graphql/rights : GraphQL");
        return count.count;
    },
    async updateRight(args: { id, data: RightUpdateInput }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to update a right.");

        let data = args.data;
        let right = await Prisma.right.update({
            where: { id: args.id },
            data: {
                ...data
            },
            include: { artist: true }
        });

        Logger.Log(`Updated right "${right.name}" with value "${right.value}" for artist: ${right.artist.name}`, "/graphql/rights : GraphQL");
        return right;
    },
    async deleteRight(args: { id: number }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to delete a right.");

        let deleted = await Prisma.right.delete({
            where: { id: args.id },
            include: { artist: true },
        });

        Logger.Log(`Deleted right with id: ${args.id} ("${deleted.name}": ${deleted.value})`, "/graphql/rights : GraphQL");
        return deleted;
    },
    async deleteRights(args: { id: number[] }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to delete rights.");

        let deleted = await Prisma.right.deleteMany({
            where: { id: { in: args.id } },
        });

        Logger.Log(`Deleted ${deleted.count} rights.`);
        return deleted.count;
    },
    async deleteAllRights(args: { artistId: number }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to delete rights.");

        let deleted = await Prisma.right.deleteMany({
            where: { artistId: args.artistId },
        });

        Logger.Log(`Deleted ${deleted.count} rights for artist with id: ${args.artistId}`, "/graphql/rights : GraphQL");
        return deleted.count;
    }
};

interface RightCreateInput {
    name: string;
    value: boolean;
}

interface RightUpdateInput {
    name?: string;
    value?: boolean;
}