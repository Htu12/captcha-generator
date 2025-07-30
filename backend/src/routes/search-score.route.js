const express = require("express");
const { asyncHandler } = require("../utils/");
const { ScoreController } = require("../controllers");
const router = express.Router();

router.get("/get-student-mark", asyncHandler(ScoreController.getScores));

module.exports = router;