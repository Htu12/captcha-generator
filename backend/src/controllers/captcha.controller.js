const { CaptchaService } = require('../services');
const { OK, SuccessResponse } = require("../utils/response/success.response")

const _constant = require('./_constant');

class CaptchaController {
    static async getCaptchaImage(req, res) {
        // Generate captcha image
        let { imageBuffer, encryptedSolution } = await CaptchaService.createCaptchaImage();

        // Set encrypted captcha in httpOnly cookie
        _constant.COOKIE["value"] = encryptedSolution;

        new SuccessResponse({
            message: 'Captcha generated successfully'
        }).send(res, _constant.HEADER, _constant.COOKIE, imageBuffer)
    }

    static async verifyCaptcha(req, res) {
        // Get captcha token from cookies
        const captchaToken = req.cookies?.captcha_token;

        new OK({
            message: "Captcha verified successfully",
            data: await CaptchaService.verifyCaptcha(captchaToken, req.body.CaptchaValue),
        }).send(res);
    }
}

module.exports = CaptchaController;