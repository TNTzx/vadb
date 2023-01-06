import Express from "express"



export class RouterInfo {
    siteBasePath: string;
    aliases: string[];
    router: Express.Router;
    schema: string;

    constructor(siteBasePath: string, aliases: string[] = [], router: Express.Router = Express.Router(), schema: string = "") {
        this.siteBasePath = siteBasePath;
        this.aliases = aliases;
        this.router = router;
        this.schema = schema;
    }


    /**
     * Gets all the names that the router has.
     */
    getNames() {
        return [this.router, ...this.aliases]
    }
}
