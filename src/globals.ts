import fs from "fs";
import Path from "path";
import toml from "toml";
import prisma, { PrismaClient } from "@prisma/client";

import Logger from "./old_code/lib/logger";



declare global {
    var Package: {
        "name": string,
        "version": string,
        "description": string,
        "main": string,
        "scripts": {[scriptName: string]: string},
        "keywords": [],
        "author": string,
        "license": string,
        "dependencies": {[package: string]: string},
        "devDependencies": {[devPackage: string]: string},
        "repository": {
            "type": string,
            "url": string
        },
        "bugs": {
            "url": string
        },
        "homepage": string
    }

    var Config: {
        port: number,
        development: boolean,
        log_level: string[],
        auth_header: string
    }
    var Prisma: PrismaClient
}

const prismaClient = new prisma.PrismaClient(
    {
        log: [
            { emit: "event", level: "query" },
            { emit: "event", level: "info" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "error" }
        ]
    }
);



function cleanup() {
    prismaClient.$disconnect();
}

function setupLogger() {
    let isDebug = global.Config["log_level"].indexOf("debug") !== -1;

    if (isDebug) {
        prismaClient.$on("query", (e) => {
            Logger.Debug(e.query, "PRISMA")
        });

        prismaClient.$on("info", (e) => {
            Logger.Info(e.message, "PRISMA")
        });
    }

    prismaClient.$on("warn", (e) => {
        Logger.Warn(e.message, "PRISMA");
    })

    prismaClient.$on("error", (e) => {
        Logger.Error(e.message, "PRISMA");
    })
}


export default () => {
    global.glob = {};
    global.Package = require("../package.json");
    global.Config = toml.parse(
        fs.readFileSync(
            Path.join(__dirname, "..", "config.toml"),
            "utf-8"
        )
    );

    global.Prisma = prismaClient;

    setupLogger();

    // closing handler
    process.on("exit", cleanup.bind(null, { cleanup: true }))
}
