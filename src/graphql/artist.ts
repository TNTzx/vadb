import Artist, { Status, Availability } from "../lib/structures/artist";
import { PrismaClient } from "@prisma/client";
import Logger from "../lib/util/Logger";



declare var Prisma: PrismaClient;

export var schema = `
type Query {
    artist(id: Int!): Artist!
    artists(name: String): [Artist]
}

type Mutation {
    createArtist(data: ArtistCreateInput): Artist!
    updateArtist(id: Int!, data: ArtistUpdateInput): Artist
    deleteArtist(id: Int!): Artist
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

input ArtistUpdateInput {
    name: String
    status: Status
    availability: Availability
    aliases: [String]
    description: String
    notes: String
    genre: String
    tracks: Int
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
    Artist: Artist
}

type Social {
    id: Int
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
            where: { id: args.id }
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
            throw new Error("You do not have permissions to create an artist.");

        let data = args.data;
        let existingArtist = await Artist.FetchByName(data.name);

        if (existingArtist !== null)
            throw new Error(`Artist with this name already exists. (${existingArtist.id} | ${existingArtist.safeName}: ${existingArtist.name})`);

        let artist = await Artist.Create(data);

        Logger.Log(`${artist.name} successfully created.`, "/graphql/artists : GraphQL");

        return artist;
    },
    async updateArtist(args: { id, data: ArtistUpdateInput }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to update an artist.");

        let data = args.data;
        let newName = data.name;
        
        if (newName) {
            let existingArtist = await Artist.FetchByName(newName);

            if (existingArtist !== null)
                throw new Error(`Artist with this name already exists. (${existingArtist.id} | ${existingArtist.safeName}: ${existingArtist.name})`);
        }

        let artist = await Artist.Update(args.id, data);

        Logger.Log(`${artist.name} successfully updated.`, "/graphql/artists : GraphQL");

        return artist;
    },
    async deleteArtist(args: { id }, context) {
        if (!context.isAdmin)
            throw new Error("You do not have permissions to delete an artist.");

        let artist = await Artist.Delete(args.id);

        if (artist === null)
            throw new Error(`Artist with this id does not exist.`);

        Logger.Log(`${artist.name} successfully deleted.`, "/graphql/artists : GraphQL");
        return artist;
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

interface ArtistUpdateInput {
    name?: string
    status?: Status
    availability?: Availability
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