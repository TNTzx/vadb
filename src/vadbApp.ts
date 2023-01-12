/** @module VADBApp Contains the application. */


import * as fs from "fs"
import express from "express"

import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import logger from "./logger"

import expressMidware from "./middlewares/express";
import routerMidware from "./middlewares/router";



class VADB {
    static app: express.Express;

    constructor() {
        VADB.#ensureLogsDirectoryExists();
        logger.WriteFileInstance(logger.GetCurrentFileName());

        VADB.app = express();

        VADB.#setup(VADB.app);
    }

    Start(port: number) {
        VADB.app.listen(port, () => {
            logger.Info(`App listening on ${port}`);
        });
    }


    static #setup(app: express.Express) {
        logger.Log("Setting up server.");

        // MIDDLEWARE //
        logger.Debug("Setting up middlewares.");
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
        logger.Debug("Setting up custom middlewares.");
        app.use("*", expressMidware);

        // LOADERS //
        logger.Debug("Kick starting loaders");
        // TODO GraphQLMidware(app, join(__dirname, "../", "routers"));
        routerMidware(app);


        // SETTINGS //
        app.set("json-spaces", 4);
        app.disable("x-powered-by")

        logger.Log("Setup complete!")
    }

    static #ensureLogsDirectoryExists() {
        let logs = logger.GetLogsDirectory();

        if (!fs.existsSync(logs))
        fs.mkdirSync(logs);
    }
}

export default VADB;
