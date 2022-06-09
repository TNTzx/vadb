const fs = require("fs");
const path = require("path");
const Logger = require("../util/Logger");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

module.exports = (app, routerPath) => {
    (function read(dirPath, router = "") {
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

                app.use("/graphql" + route, async (req, res) => {
                    let isAdmin = await req.validate();
                    
                    graphqlHTTP({
                        schema: schema,
                        rootValue: resolver,
                        graphiql: Config.development,
                        context: { isAdmin }
                    })(req, res);
                });

                Logger.Debug(`Registered graphql router: ${route}`);
            }
        }
    })(routerPath);
};