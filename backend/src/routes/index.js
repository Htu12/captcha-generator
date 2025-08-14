const express = require("express");
const router = express.Router();
const routerCaptcha = require("./captcha.route");
const { allowSearchTime } = require("../middleware");
const routerSearchScore = require("./search-score.route");

router.use("/captcha", routerCaptcha);
router.use("/search-score", allowSearchTime, routerSearchScore);

module.exports = router;