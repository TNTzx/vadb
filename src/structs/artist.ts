/** @module Artist Module containing structures regarding the artist. */


import * as tag from "./tag"



/** Represents an allowed song that can be used for Project Arrhythmia. */
export class Song {
    title: string;
    aliases: string[];
    audioPath: string;

    constructor(title: string = "Unnamed Song", aliases: string[] = [], audioPath: string) {
        this.title = title
        this.aliases = aliases
        this.audioPath = audioPath
    }
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
}


/** Represents the artist's availability. */
export class ArtistAvailabilityTag extends tag.Tag {}

/** Contains all the possible availability states. */
export const ArtistAvailabilityValues = Object.freeze({
    ALLOWED: new ArtistAvailabilityTag("Allowed", "The artist allows most of their songs for use."),
    DISALLOWED: new ArtistAvailabilityTag("Disallowed", "The artist disallows all of their songs for use."),
    VARIES: new ArtistAvailabilityTag("Varies", "The artist specifies certain rules for allowing or disallowing specific songs."),
    UNKNOWN: new ArtistAvailabilityTag("Unknown", "The artist's availability is not known."),
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
