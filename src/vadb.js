const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const Logger = require("./util/Logger");
const path = require("path");

class VADB {
    static app;

    constructor() {
        VADB.#ensureLogsDirectoryExists();
        Logger.WriteFileInstance(Logger.GetCurrentFileName());

        VADB.app = express();

        VADB.#setup(VADB.app);
    }

    Start(port) {
        VADB.app.listen(port, () => {
            Logger.Info(`App listening on ${port}`);
        })
    }

    /**
     * @param {import("express").Express} app
     */
    static #setup(app) {
        Logger.Log("Setting up server.");

        // MIDDLEWARE //
        Logger.Debug("Setting up middlewares.");
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());
        app.use(cors());
        app.use(multer({
            limits: {
                fileSize: 10 * 1024 ** 2 // 10 mb
            }
        }).any());

        // CUSTOM MIDDLEWARES //
        Logger.Debug("Setting up custom middlewares.");
        // rate limit
        // override

        // LOADERS //
        Logger.Debug("Kick starting loaders");
        require("./middlewares/RouterMiddleware")(app, path.join(__dirname, "../", "routers"));

        // SETTINGS //
        app.set("json-spaces", 4);
        app.disable("x-powered-by")

        Logger.Log("Setup complete!")
    }

    static #ensureLogsDirectoryExists() {
        let logs = Logger.GetLogsDirectory();

        if (!fs.existsSync(logs))
            fs.mkdirSync(logs);
    }
}

module.exports = VADB;