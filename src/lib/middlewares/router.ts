import Express from "express";
import CreateRouters from "../../routing/createRouters";

import Logger from "../util/logger";



export default function routerMidware(app: Express.Express) {
    // function read(dirPath: string, router: string = "") {
    //     let files = readdirSync(dirPath);

    //     for (const file of files) {
    //         let stat = lstatSync(join(dirPath, file));

    //         if (stat.isDirectory()) {
    //             read(join(dirPath, file), router + "/" + file);
    //         } else {
    //             let route = `${router}/${file.slice(0, -3)}`;
    //             let routerType: Express.Router = require(join(dirPath, file));
    //             let routerAliases = routerType.aliases || [];
    //             let aliases = [route, ...routerAliases];

    //             for (const alias of aliases) {
    //                 app.use(alias, routerType);
    //             }
    //
    //         }
    //     }
    // };

    // read(routerPath);

    let routerInfos = CreateRouters();
    for (const routerInfo of routerInfos) {
        let routerNames = routerInfo.getNames();
        for (const routerPath of routerNames) {
            app.use(routerPath, routerInfo.router)
        }

        Logger.Debug(
            `Registered router: ${routerInfo.baseSitePath} ` +
            `${
                routerInfo.aliases.length > 0
                    ? `With ${routerInfo.aliases.length} aliases: (${routerInfo.aliases.join(", ")})`
                    : ""
            }`
        );
    };
};
