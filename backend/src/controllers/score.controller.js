const { ScoreService } = require('../services');
const { BadRequestError } = require('../utils/response/error.response');
const { OK } = require("../utils/response/success.response");

class ScoreController {
    static async getScores(req, res) {
        const { SBD, CaptchaValue } = req.query;

        const captchaToken = req.cookies?.captcha_token;

        if (!captchaToken) {
            throw new BadRequestError("Missing captcha token")
        }

        new OK({
            message: "Scores retrieved successfully",
            data: await ScoreService.searchScore(SBD, CaptchaValue, captchaToken)
        }).send(res);
    }
}


module.exports = ScoreController;