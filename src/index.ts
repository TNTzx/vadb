import globals from "./globals"
import vadb from "./lib/vadb"



globals()

var full_app = new vadb();
full_app.Start(global.Config.port);
