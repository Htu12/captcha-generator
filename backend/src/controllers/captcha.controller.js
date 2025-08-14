const { CaptchaService } = require('../services');
const { OK, SuccessResponse } = require("../utils/response/success.response")

const _constant = require('./_constant');

class CaptchaController {
    static async getCaptchaImage(req, res) {
        // Generate captcha image
        let { imageBuffer, encryptedSolution } = await CaptchaService.createCaptchaImage();

        let cookie = {
            key: _constant.COOKIE.key,
            value: encryptedSolution,
            options: { ..._constant.COOKIE.options }
        };

        // console.log(cookie);

        let obj = {
            headers: _constant.HEADER_IMAGE,
            cookie,
            contentType: _constant.TYPE_IMAGE,
            dataSend: imageBuffer
        }

        new SuccessResponse({
            message: 'Captcha generated successfully',
        }).send(res, obj)
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