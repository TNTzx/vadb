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

    toData(): SongDatatype {
        return {
            audioPath: this.audioPath,
            title: this.title,
            romanizedTitle: this.romanizedTitle
        }
    }

    static fromData(data: SongDatatype) {
        return new this(data.audioPath, data.title, data.romanizedTitle);
    }
}



export type ArtistMetadataDatatype = {
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


    toData(): ArtistMetadataDatatype {
        return {
            aliases: this.aliases,
            description: this.description,
            notes: this.notes,
            genre: this.genre,
            songs: this.songs.map((song) => song.toData()),
            socials: this.socials
        }
    }

    static fromData(data: ArtistMetadataDatatype) {
        return new this(
            data.aliases,
            data.description,
            data.notes,
            data.genre,
            data.songs.map((songData) => Song.fromData(songData)),
            data.socials
        );
    }
}



/** Represents the artist's availability. */
export class ArtistAvailabilityTag extends tag.Tag {}

/** Contains all the possible availability states. */
export const ArtistAvailabilityValues = Object.freeze({
    ALLOWED: new ArtistAvailabilityTag("ALLOWED", "The artist allows most of their songs for use."),
    DISALLOWED: new ArtistAvailabilityTag("DISALLOWED", "The artist disallows all of their songs for use."),
    VARIES: new ArtistAvailabilityTag("VARIES", "The artist specifies certain rules for allowing or disallowing specific songs."),
    UNKNOWN: new ArtistAvailabilityTag("UNKNOWN", "The artist's availability is not known."),
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


    toData(): RightDatatype {
        return {identifier: this.identifier, isAllowed: this.isAllowed}
    }

    static fromData(data: RightDatatype) {
        return new this(data.identifier, data.isAllowed);
    }
};



export type ArtistDatatype = {
    id: number,
    name: string,
    metadata: ArtistMetadataDatatype,
    availability: tag.TagDatatype,
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


    toData(): ArtistDatatype {
        return {
            id: this.id,
            name: this.name,
            metadata: this.metadata.toData(),
            availability: this.availability.toData(),
            rights: this.rights.map((right) => right.toData()),
            addedAt: this.addedAt,
            updatedAt: this.updatedAt
        }
    }

    static fromData(data: ArtistDatatype) {
        return new this(
            data.id,
            data.name,
            ArtistMetadata.fromData(data.metadata),
            ArtistAvailabilityTag.fromData(data.availability),
            data.rights.map((rightData) => Right.fromData(rightData)),
            data.addedAt,
            data.updatedAt
        );
    }
}
