/** @module ArtistRequest Contains structures that make up an artist request. */


import * as tag from "./tag"
import * as artist from "./artist"



/** Represents the artist request's contact status. */
export class ContactStatusTag extends tag.Tag {};

/** Contains all possible contact states. */
export const ContactStatusValues = tag.getTagList({
    NOT_CONTACTED: new ContactStatusTag("Not Contacted", "Artist hasn't been contacted yet"), 
    NO_RESPONSE: new ContactStatusTag("No Response", "Artist contacted but no response after criteria has been met."), 
    PENDING_RESPONSE: new ContactStatusTag("Pending Response", "Artist contacted but response from artist is pending."),
    COMPLETED_CONTACT: new ContactStatusTag("Completed Contact", "Artist contacted and has responded.")
});



/** Represents the artist request's approval status. */
export class ApprovalStatusTag extends tag.Tag {};

/** Represents the artist's status in the approval process */
export const ApprovalStatusValues = tag.getTagList({
    PENDING_APPROVAL: new ApprovalStatusTag("Pending Approval", "The request requires approval by mods"),
    COMPLETED_APPROVAL: new ApprovalStatusTag("Completed Approval", "The approval process is complete for this request.")
});



export type CreateArtistRequestPDT = {
    id: number,
    artist: artist.ArtistPDT,
    requestorUserId: number,
    proofPaths: string[],
    contactStatus: string,
    approvalStatus?: string
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


    toPrismaData(): CreateArtistRequestPDT {
        return {
            id: this.id,
            artist: this.artist.toPrismaData(),
            requestorUserId: this.requestorUserId,
            proofPaths: this.proofPaths,
            contactStatus: this.contactStatus.toPrismaData(),
            approvalStatus: this.approvalStatus.toPrismaData(),
        }
    }

    static fromPrismaData(data: CreateArtistRequestPDT) {
        return new this(
            data.id,
            artist.Artist.fromPrismaData(data.artist),
            data.requestorUserId,
            data.proofPaths,
            ContactStatusValues.fromPrismaData(data.contactStatus),
            ApprovalStatusValues.fromPrismaData(data.approvalStatus)
        );
    }
}


// TODO add update request
