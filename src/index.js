require("./scripts/globals")(); // Setup globals.
(new (require("./lib/vadb").default)).Start(Config.port);