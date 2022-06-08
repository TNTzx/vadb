require("./scripts/globals")(); // Setup globals.
(new (require("./lib/vadb"))).Start(Config.port);