/** @module Tag Contains the parent class for all tags. */



export type TagDatatype = string
/** Represents a tag. */
export class Tag {
    tagName: string
    description: string

    constructor(tagName: string, description: string) {
        this.tagName = tagName
        this.description = description
    }


    toPrismaData(): TagDatatype {
        return this.tagName
    }
}


/** Represents a tag list. */
export function getTagList<T extends Tag, U>(partialTagList: U) {
    return Object.assign({
        getFromTagName(tagName: string): T {
            return this[tagName]
        },

        fromPrismaData(data: TagDatatype): T {
            return this.getFromTagName(data)
        }
    }, partialTagList)
}
