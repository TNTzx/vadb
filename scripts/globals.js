const fs = require("fs");
const toml = require("toml");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = () => {
    global.glob = {};
    global.Package = require("../package.json");
    global.Config = toml.parse(fs.readFileSync("./config.toml", "utf-8"));

    global.Prisma = prisma;

    // closing handler
    process.on("exit", cleanup.bind(null, { cleanup: true }))
    process.on("SIGINT", cleanup.bind(null, { exit:true } ))
    process.on("SIGTERM", cleanup.bind(null, { exit:true } ))
    process.on("SIGUSR1", cleanup.bind(null, { exit:true }))
    process.on("SIGUSR2", cleanup.bind(null, { exit:true }))
    process.on("uncaughtException", cleanup.bind(null, { exit:true }))
}

function cleanup() {
    Prisma.$disconnect();
}