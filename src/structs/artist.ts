/** @module Artist Module containing structures regarding the artist. */


import * as tag from "./tag";



export type SongDataType = {
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

    toData(): SongDataType {
        return {
            audioPath: this.audioPath,
            title: this.title,
            romanizedTitle: this.romanizedTitle
        }
    }

    static fromData(data: SongDataType) {
        return new this(data.audioPath, data.title, data.romanizedTitle);
    }
}



export type ArtistMetadataDataType = {
    aliases: string[],
    description: string,
    notes: string,
    genre: string,
    songs: SongDataType[],
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


    toData(): ArtistMetadataDataType {
        return {
            aliases: this.aliases,
            description: this.description,
            notes: this.notes,
            genre: this.genre,
            songs: this.songs.map((value) => {return value.toData()}),
            socials: this.socials
        }
    }

    static fromData(data: ArtistMetadataDataType) {
        return new this(
            data.aliases,
            data.description,
            data.notes,
            data.genre,
            data.songs.map((value) => {return Song.fromData(value)}),
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




/** Contains information about a specific verified or disallowed song or set of songs. */
export class Right {
    identifier: string;
    isAllowed: boolean;

    constructor(identifier: string = "Unknown", isAllowed: boolean = true) {
        this.identifier = identifier;
        this.isAllowed = isAllowed;
    };
};



/** The artist itself. */
export class Artist {
    id: number;
    name: string;
    metadata: ArtistMetadata;
    availability: ArtistAvailabilityTag;
    rights: Right[];
    addedAt: Date;
    updatedAt: Date;

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
}
