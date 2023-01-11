/**
 * Contains information about the artist's availability.
 */
export class Availability {
    tag: string;
    description: string;

    constructor(tag: string, description: string) {
        this.tag = tag;
        this.description = description;
    }
};

/**
 * Contains all the possible availability states.
 */
export const AvailabilityValues = Object.freeze({
    NONE: new Availability("None", "The artist isn't sure that their music can be used."),
    VERIFIED: new Availability("Verified", "All music from the artist can be used."),
    DISALLOWED: new Availability("Disallowed", "All of the artist's music can't be used."),
    CONTACT_REQUIRED: new Availability("Contact Required", "The artist needs to be contacted."),
    VARIES: new Availability("Verified", "Some music from the artist can be used.")
});



export class Artist {
    id: number;
    name: string;
    aliases: string[];
    description: string;
    notes: string;
    genre: string;
    tracks: number;
    status: states.Status;
    availability
    addedAt
    updatedAt
    rights
    socials

    constructor(id, name, aliases, description, notes, genre, tracks, status, availability, addedAt, updatedAt, rights, socials) {
        this.id = id
        this.name = name
        this.aliases = aliases
        this.description = description
        this.notes = notes
        this.genre = genre
        this.tracks = tracks
        this.status = status
        this.availability = availability
        this.addedAt = addedAt
        this.updatedAt = updatedAt
        this.rights = rights
        this.socials = socials
    }
}
