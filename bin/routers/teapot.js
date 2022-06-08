"use strict";
const router = require("express").Router();
router.all("/", (req, res) => {
    return res.message(418, { message: "I'm a teapot! However, I cannot brew you coffee." });
});
module.exports = router;
module.exports.aliases = ["/test", "/cock"];
