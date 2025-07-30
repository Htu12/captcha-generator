const express = require("express");
const router = express.Router();
const routerCaptcha = require("./captcha.route");
const routerSearchScore = require("./search-score.route");

router.use("/captcha", routerCaptcha);
router.use("/search-score", routerSearchScore);

module.exports = router;