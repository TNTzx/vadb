import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import Logger from "./logger";
import OverrideMidware from "./middlewares/express";
import GraphQLMidware from "./middlewares/graphql";
import RouterMidware from "./middlewares/router";

import createRouters from "../routing/createRouters";



class VADB {
    static app: express.Express;

    constructor() {
        VADB.#ensureLogsDirectoryExists();
        Logger.WriteFileInstance(Logger.GetCurrentFileName());

        VADB.app = express();

        VADB.#setup(VADB.app);
    }

    Start(port: number) {
        VADB.app.listen(port, () => {
            Logger.Info(`App listening on ${port}`);
        });
    }


    static #setup(app: express.Express) {
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
        app.use("*", OverrideMidware);

        // LOADERS //
        Logger.Debug("Kick starting loaders");
        // TODO GraphQLMidware(app, join(__dirname, "../", "routers"));
        RouterMidware(app);


        // SETTINGS //
        app.set("json-spaces", 4);
        app.disable("x-powered-by")

        Logger.Log("Setup complete!")
    }

    static #ensureLogsDirectoryExists() {
        let logs = Logger.GetLogsDirectory();

        if (!existsSync(logs))
            mkdirSync(logs);
    }
}

export default VADB;
