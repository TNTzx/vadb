import * as artist from "./artist"


/** Contains the artist's status on being contacted */
ContactStatus {
    NOT_CONTACTED, // artist hasn't been contacted yet
    NO_RESPONSE, // artist contacted but no response after some criteria (actually the criteria was already settled over at the pa server) 
    PENDING_RESPONSE, // artist contacted but response from artist is pending
    COMPLETED // artist contacted and has responded
}


/** Represents the artist's status in the approval process */
ApprovalStatus {
    PENDING, // pending approval by mods
    COMPLETED // completed approval process
}

// info about requesting the artist to be added to the database
ArtistRequest {
    id: number
    artist: Artist
    requestorUserId: number
    proof: Image[]
    contactStatus: ContactStatus
    approvalStatus?: ApprovalStatus // none if ContactStatus is anything other than COMPLETED
}