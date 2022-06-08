"use strict";
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const dateFormat = require("dateformat");
const Colours = {
    ERROR: "#FF0040",
    WARNING: "#FFC400",
    INFO: "#00FF7F",
    LOG: "#00AAFF",
    DEBUG: "#808080"
};
class Logger {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }
    static Error(message, type = this.#getCallerType()) {
        this.#logBackground(message, type, "ERROR", Colours.ERROR, "#FFF");
    }
    static Warn(message, type = this.#getCallerType()) {
        this.#logBackground(message, type, "WARNING", Colours.WARNING, "#000");
    }
    static Info(message, type = this.#getCallerType()) {
        this.#log(message, type, "INFO", Colours.INFO);
    }
    static Log(message, type = this.#getCallerType()) {
        this.#log(message, type, "LOG", Colours.LOG);
    }
    static Debug(message, type = this.#getCallerType()) {
        this.#log(message, type, "DEBUG", Colours.DEBUG);
    }
    static Empty() {
        console.log("");
    }
    static #log(message, type, verbosity, colour) {
        if (Config["log_level"].indexOf(verbosity.toLowerCase()) === -1)
            return;
        this.#logToFile(`[${dateFormat(Date.now(), "HH:MM:ss")}] [${type}] [${verbosity}]: ${message}`);
        console.log(`${chalk.hex(colour)("•")} [${dateFormat(Date.now(), "HH:MM:ss")}] [${type}] ${chalk.hex(colour)(chalk.bold(`[${verbosity}]`))}: ${message}`);
    }
    static #logBackground(message, type, verbosity, colour, textColour) {
        if (Config["log_level"].indexOf(verbosity.toLowerCase()) === -1)
            return;
        this.#logToFile(`[${dateFormat(Date.now(), "HH:MM:ss")}] [${type}] [${verbosity}]: ${message}`);
        console.log(`${chalk.hex(colour)("•")} [${dateFormat(Date.now(), "HH:MM:ss")}] [${type}] ${chalk.bgHex(colour)(chalk.hex(textColour)(chalk.bold(`[${verbosity}]`)))}: ${message}`);
    }
    static #logToFile(message) {
        let filePath = this.GetCurrentFileName();
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, "");
            this.#writeFileHeader(filePath);
        }
        fs.appendFileSync(filePath, message + "\n");
    }
    static #writeFileHeader(filepath) {
        fs.appendFileSync(filepath, `--- ${Package.name} v${Package.version} ---\n`);
    }
    static WriteFileInstance(filepath) {
        if (!fs.existsSync(filepath))
            fs.writeFileSync(filepath, "");
        fs.appendFileSync(filepath, `--- ${Package.name} v${Package.version} ---\n`);
        fs.appendFileSync(filepath, `--- ${dateFormat(Date.now(), 'dddd, mmmm d, yyyy h:MM:ss TT Z')} ---\n`);
    }
    static GetLogsDirectory() {
        return path.join(__dirname, "../../", "logs");
    }
    static GetCurrentFileName() {
        return path.join(this.GetLogsDirectory(), dateFormat(Date.now(), "isoDate") + ".txt");
    }
    // Copied from https://github.com/stefanpenner/get-caller-file
    static #getCallerType(position = 3) {
        if (position >= Error.stackTraceLimit) {
            throw new TypeError('getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' + position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`');
        }
        const oldPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = new Error().stack;
        Error.prepareStackTrace = oldPrepareStackTrace;
        if (stack !== null && typeof stack === 'object') {
            // stack[0] holds this file
            // stack[1] holds where this function was called
            // stack[2] holds the file we're interested in
            return stack[position] ? path.basename((stack[position]).getFileName()).slice(0, -3) : undefined;
        }
    }
}
module.exports = Logger;
