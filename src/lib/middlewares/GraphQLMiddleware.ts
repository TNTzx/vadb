import fs from "fs"
import path from "path";
import Logger from "../util/Logger";
import express from "express";
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';


export default (app: express.Express, routerPath: string) => {
    function read(dirPath: string, router: string = "") {
        let files = fs.readdirSync(dirPath);

        for (const file of files) {
            let stat = fs.lstatSync(path.join(dirPath, file));

            if (stat.isDirectory()) {
                read(path.join(dirPath, file), router + "/" + file);
            } else {
                let route = `${router}/${file.slice(0, -3)}`;
                let routerType = require(path.join(dirPath, file));

                let schema = buildSchema(routerType.schema);
                let resolver = routerType.resolver;

                app.use(
                    "/graphql" + route,
                    async (req, res) => {
                        let isAdmin = await req.validate();

                        graphqlHTTP({
                            schema: schema,
                            rootValue: resolver,
                            graphiql: global.Config.development,
                            context: { isAdmin }
                        })(req, res);
                    }
                );

                Logger.Debug(`Registered graphql router: ${route}`);
            }
        }
    };
    read(routerPath);
};