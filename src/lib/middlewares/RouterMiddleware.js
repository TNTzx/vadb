const fs = require("fs");
const path = require("path");
const Logger = require("../util/Logger");

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
                let routerAliases = routerType.aliases || [];
                let aliases = [route, ...routerAliases];

                for (const alias of aliases) {
                    app.use(alias, routerType);
                }

                app.use(route, routerType)
                Logger.Debug(`Registered router: ${route} ${aliases.length > 0 ? `With ${aliases.length} aliases (${aliases.slice(1, aliases.length).join(", ")})` : ""}`);
            }
        }
    })(routerPath);
};