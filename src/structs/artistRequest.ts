/** @module ArtistRequest Contains structures that make up an artist request. */


import * as tag from "./tag"
import * as artist from "./artist"



/** Represents the artist request's contact status. */
export class ContactStatusTag extends tag.Tag {};

/** Contains all possible contact states. */
export const ContactStatusValues = {
    NOT_CONTACTED: new ContactStatusTag("Not Contacted", "Artist hasn't been contacted yet"), 
    NO_RESPONSE: new ContactStatusTag("No Response", "Artist contacted but no response after criteria has been met."), 
    PENDING_RESPONSE: new ContactStatusTag("Pending Response", "Artist contacted but response from artist is pending."),
    COMPLETED_CONTACT: new ContactStatusTag("Completed Contact", "Artist contacted and has responded.")
};



/** Represents the artist request's approval status. */
export class ApprovalStatusTag extends tag.Tag {};

/** Represents the artist's status in the approval process */
export const ApprovalStatusValues = {
    PENDING_APPROVAL: new ApprovalStatusTag("Pending Approval", "The request requires approval by mods"),
    COMPLETED_APPROVAL: new ApprovalStatusTag("Completed Approval", "The approval process is complete for this request.")
};



export type CreateArtistRequestDatatype = {
    id: number,
    artist: artist.ArtistDatatype,
    requestorUserId: number,
    proofPaths: string[],
    contactStatus: tag.TagDatatype,
    approvalStatus?: tag.TagDatatype
}
/** Represents a request to add an artist to the database. */
export class CreateArtistRequest {
    id: number;
    artist: artist.Artist;
    requestorUserId: number;
    proofPaths: string[];
    contactStatus: ContactStatusTag;
    approvalStatus?: ApprovalStatusTag; // none if ContactStatus is anything other than COMPLETED_CONTACT

    constructor(
        id: number,
        artist: artist.Artist,
        requestorUserId: number,
        proofPaths: string[] = [],
        contactStatus: ContactStatusTag = ContactStatusValues.NOT_CONTACTED,
        approvalStatus?: ApprovalStatusTag
    ) {
        this.id = id
        this.artist = artist
        this.requestorUserId = requestorUserId
        this.proofPaths = proofPaths
        this.contactStatus = contactStatus
        this.approvalStatus = approvalStatus
    }


    toData(): CreateArtistRequestDatatype {
        return {
            id: this.id,
            artist: this.artist.toData(),
            requestorUserId: this.requestorUserId,
            proofPaths: this.proofPaths,
            contactStatus: this.contactStatus,
            approvalStatus: this.approvalStatus,
        }
    }

    static fromData(data: CreateArtistRequestDatatype) {
        return new this(
            data.id,
            artist.Artist.fromData(data.artist),
            data.requestorUserId,
            data.proofPaths,
            data.contactStatus,
            data.approvalStatus
        );
    }
}


// TODO add update request
