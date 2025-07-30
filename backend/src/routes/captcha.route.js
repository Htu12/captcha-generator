const express = require("express");
const { CaptchaController } = require("../controllers/index");
const { asyncHandler } = require("../utils")

const router = express.Router();

router.get("/get-captcha-image", asyncHandler(CaptchaController.getCaptchaImage));
router.post("/verify-captcha", asyncHandler(CaptchaController.verifyCaptcha));

module.exports = router;