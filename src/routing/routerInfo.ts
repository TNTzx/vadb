import Express from "express"



export class RouterInfo {
    baseSitePath: string;
    aliases: string[];
    router: Express.Router;
    schema: string;

    constructor(baseSitePath: string, aliases: string[] = [], router: Express.Router = Express.Router(), schema: string = "") {
        this.baseSitePath = baseSitePath;
        this.aliases = aliases;
        this.router = router;
        this.schema = schema;
    }


    /**
     * Gets all the names that the router has.
     */
    getNames() {
        return [this.baseSitePath, ...this.aliases]
    }
}
