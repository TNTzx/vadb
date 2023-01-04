import fs from "fs";
import toml from "toml";
import { PrismaClient } from "@prisma/client";
import Logger from "../lib/util/Logger";



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
}

const prisma = new PrismaClient(
    {
        log: [
            { emit: "event", level: "query" },
            { emit: "event", level: "info" },
            { emit: "event", level: "warn" },
            { emit: "event", level: "error" }
        ]
    }
);


export default () => {
    global.glob = {};
    global.Package = require("../../package.json");
    global.Config = toml.parse(fs.readFileSync("../config.toml", "utf-8"));

    global.Prisma = prisma;

    setupLogger();

    // closing handler
    process.on("exit", cleanup.bind(null, { cleanup: true }))
}

function cleanup() {
    prisma.$disconnect();
}

function setupLogger() {
    let isDebug = global.Config["log_level"].indexOf("debug") !== -1;

    if (isDebug) {
        prisma.$on("query", (e) => {
            Logger.Debug(e.query, "PRISMA")
        });

        prisma.$on("info", (e) => {
            Logger.Info(e.message, "PRISMA")
        });
    }

    prisma.$on("warn", (e) => {
        Logger.Warn(e.message, "PRISMA");
    })

    prisma.$on("error", (e) => {
        Logger.Error(e.message, "PRISMA");
    })
}