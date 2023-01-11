/** Represents an allowed song that can be used for Project Arrhythmia. */
export class Song {
    title: string;
    aliases: string[];
    audioPath: string;
}



/** Contains additional metadata for the artist. */
export class ArtistMetadata {
    aliases: string[];
    description?: string;
    notes?: string;

    genre?: string;
    songs: Song[];
    socials: string[];

    constructor(
        aliases: string[] = [],
        description?: string,
        notes?: string,
        genre?: string,
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



/** Contains all the possible availability states. */
export const AvailabilityValues = Object.freeze({
    ALLOWED: "Allowed",
    DISALLOWED: "Disallowed",
    VARIES: "Verified",
    UNKNOWN: "Unknown",
});




/** Contains information about a specific verified or disallowed song or set of songs. */
export class Right {
    identifier: string;
    isAllowed: boolean;

    constructor(identifier: string, isAllowed: boolean) {
        this.identifier = identifier;
        this.isAllowed = isAllowed;
    };
};



export class Artist {
    id: number;

    name: string;
    metadata: ArtistMetadata;

    availability: string;
    rights: Right[];

    addedAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number,
        name: string,
        metadata: ArtistMetadata,
        availability: string,
        rights: Right[],
        addedAt?: Date,
        updatedAt?: Date
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
