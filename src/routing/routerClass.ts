import Express from "express"



export class RouterInfo {
    static routers: RouterInfo[] = [];

    sitePath: string;
    aliases: string[];
    router: Express.Router;
    schema: string;

    constructor(sitePath: string, aliases: string[] = [], router: Express.Router = Express.Router(), schema: string = "") {
        this.sitePath = sitePath;
        this.aliases = aliases;
        this.router = router;
        this.schema = schema;

        RouterInfo.routers.push(this);
    }
}
