const fs = require("fs");
const Logger = require("./util/Logger");

class VADB {
    constructor() {
        let logs = Logger.GetLogsDirectory();

        if (!fs.existsSync(logs))
            fs.mkdirSync(logs);

        Logger.WriteFileInstance(Logger.GetCurrentFileName());
    }

    Start(port) {
        Logger.Error("meow");
        Logger.Warn("meow");
        Logger.Info("meow");
        Logger.Log("meow");
        Logger.Debug("meow");
    }
}

module.exports = VADB;