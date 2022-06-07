const fs = require("fs");
const toml = require("toml");

module.exports = () => {
    global.glob = {};
    global.Package = require("../package.json");
    global.Config = toml.parse(fs.readFileSync("./config.toml", "utf-8"));
}