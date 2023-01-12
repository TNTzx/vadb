import Fs from "fs"
import Path from "path";
import Express from "express";
import ExpressGraphQL from 'express-graphql';

import Logger from "../old_code/lib/logger";
import { ExtendedReq, ExtendedRes } from "./express"


// TODO
export default function graphqlMidware(app: Express.Express, routersPath: string) {
    function read(dirPath: string, router: string = "") {
        let files = Fs.readdirSync(dirPath);

        for (const file of files) {
            let stat = Fs.lstatSync(Path.join(dirPath, file));

            if (stat.isDirectory()) {
                read(Path.join(dirPath, file), router + "/" + file);
            } else {
                let route = `${router}/${file.slice(0, -3)}`;
                let routerType = require(Path.join(dirPath, file));

                let schema = global.GraphQL.buildSchema(routerType.schema);
                let resolver = routerType.resolver;

                app.use(
                    "/graphql" + route,
                    async (req: ExtendedReq, res: ExtendedRes) => {
                        let isAdmin = await req.expectAdmin();

                        ExpressGraphQL.graphqlHTTP(
                            {
                                schema: schema,
                                rootValue: resolver,
                                graphiql: global.Config.development,
                                context: { isAdmin }
                            }
                        )(req, res);
                    }
                );

                Logger.Debug(`Registered graphql router: ${route}`);
            }
        }
    };

    read(routersPath);
};