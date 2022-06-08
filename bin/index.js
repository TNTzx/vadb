"use strict";
require("./scripts/globals")(); // Setup globals.
(new (require("./src/vadb"))).Start(Config.port);
