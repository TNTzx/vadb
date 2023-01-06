import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import Express from "express";

import Logger from "../util/logger";



export default function routerMidware(app: Express.Express, routerPath: string) {
    function read(dirPath: string, router: string = "") {
        let files = readdirSync(dirPath);

        for (const file of files) {
            let stat = lstatSync(join(dirPath, file));

            if (stat.isDirectory()) {
                read(join(dirPath, file), router + "/" + file);
            } else {
                let route = `${router}/${file.slice(0, -3)}`;
                let routerType: Express.Router = require(join(dirPath, file));
                let routerAliases = routerType.aliases || [];
                let aliases = [route, ...routerAliases];

                for (const alias of aliases) {
                    app.use(alias, routerType.router);
                }

                app.use(route, routerType)
                Logger.Debug(`Registered router: ${route} ${aliases.length > 0 ? `With ${aliases.length} aliases (${aliases.slice(1, aliases.length).join(", ")})` : ""}`);
            }
        }
    };

    read(routerPath);
};