/** @module Artist Module containing structures regarding the artist. */


import * as tag from "./tag";



export type SongDatatype = {
    audioPath: string;
    title: string;
    romanizedTitle?: string;
};
/** Represents an allowed song that can be used for Project Arrhythmia. */
export class Song {
    audioPath: string;
    title: string;
    romanizedTitle?: string;

    constructor(audioPath: string, title: string = "Unnamed Song", romanizedTitle?: string) {
        this.audioPath = audioPath
        this.title = title
        this.romanizedTitle = romanizedTitle
    }

    toPrismaData(): SongDatatype {
        return {
            audioPath: this.audioPath,
            title: this.title,
            romanizedTitle: this.romanizedTitle
        }
    }

    static fromPrismaData(data: SongDatatype) {
        return new this(data.audioPath, data.title, data.romanizedTitle);
    }
}



export type ArtistMetadataPDT = {
    aliases: string[],
    description: string,
    notes: string,
    genre: string,
    songs: SongDatatype[],
    socials: string[]
}
/** Contains additional metadata for the artist. */
export class ArtistMetadata {
    aliases: string[];
    description: string;
    notes: string;

    genre: string;
    songs: Song[];
    socials: string[];

    constructor(
        aliases: string[] = [],
        description: string = "",
        notes: string = "",
        genre: string = "",
        songs: Song[] = [],
        socials: string[] = []
    ) {
        this.aliases = aliases
        this.description = description
        this.notes = notes
        this.genre = genre
        this.songs = songs
        this.socials = socials
    }


    toPrismaData(): ArtistMetadataPDT {
        return {
            aliases: this.aliases,
            description: this.description,
            notes: this.notes,
            genre: this.genre,
            songs: this.songs.map((song) => song.toPrismaData()),
            socials: this.socials
        }
    }

    static fromPrismaData(data: ArtistMetadataPDT) {
        return new this(
            data.aliases,
            data.description,
            data.notes,
            data.genre,
            data.songs.map((songData) => Song.fromPrismaData(songData)),
            data.socials
        );
    }
}



/** Represents the artist's availability. */
export class ArtistAvailabilityTag extends tag.Tag {}

/** Contains all the possible availability states. */
export const ArtistAvailabilityValues = tag.getTagList({
    "ALLOWED": new ArtistAvailabilityTag("ALLOWED", "The artist allows most of their songs for use."),
    "DISALLOWED": new ArtistAvailabilityTag("DISALLOWED", "The artist disallows all of their songs for use."),
    "VARIES": new ArtistAvailabilityTag("VARIES", "The artist specifies certain rules for allowing or disallowing specific songs."),
    "UNKNOWN": new ArtistAvailabilityTag("UNKNOWN", "The artist's availability is not known."),
});



export type RightDatatype = {identifier: string, isAllowed: boolean}
/** Contains information about a specific verified or disallowed song or set of songs. */
export class Right {
    identifier: string;
    isAllowed: boolean;

    constructor(identifier: string = "Unknown", isAllowed: boolean = true) {
        this.identifier = identifier;
        this.isAllowed = isAllowed;
    };


    toPrismaData(): RightDatatype {
        return {identifier: this.identifier, isAllowed: this.isAllowed}
    }

    static fromPrismaData(data: RightDatatype) {
        return new this(data.identifier, data.isAllowed);
    }
};



export type ArtistPDT = {
    id: number,
    name: string,
    metadata: ArtistMetadataPDT,
    availability: string,
    rights: RightDatatype[],
    addedAt?: Date,
    updatedAt?: Date
}
/** The artist itself. */
export class Artist {
    id: number;
    name: string;
    metadata: ArtistMetadata;
    availability: ArtistAvailabilityTag;
    rights: Right[];
    addedAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number,
        name: string = "Unnamed Artist",
        metadata: ArtistMetadata = new ArtistMetadata(),
        availability: ArtistAvailabilityTag = ArtistAvailabilityValues.UNKNOWN,
        rights: Right[] = [],
        addedAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.name = name;
        this.metadata = metadata;
        this.availability = availability;
        this.rights = rights;
        this.addedAt = addedAt;
        this.updatedAt = updatedAt;
    }


    toPrismaData(): ArtistPDT {
        return {
            id: this.id,
            name: this.name,
            metadata: this.metadata.toPrismaData(),
            availability: this.availability.toPrismaData(),
            rights: this.rights.map((right) => right.toPrismaData()),
            addedAt: this.addedAt,
            updatedAt: this.updatedAt
        }
    }

    static fromPrismaData(data: ArtistPDT) {
        return new this(
            data.id,
            data.name,
            ArtistMetadata.fromPrismaData(data.metadata),
            ArtistAvailabilityValues.fromPrismaData(data.availability),
            data.rights.map((rightData) => Right.fromPrismaData(rightData)),
            data.addedAt,
            data.updatedAt
        );
    }
}
