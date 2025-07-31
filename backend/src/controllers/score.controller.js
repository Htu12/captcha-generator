const { ScoreService } = require('../services');
const { BadRequestError } = require('../utils/response/error.response');
const { OK, NO_CONTENT } = require("../utils/response/success.response");

class ScoreController {
    static async getScores(req, res) {
        const { SBD, CaptchaValue } = req.query;

        const captchaToken = req.cookies?.captcha_token;

        if (!captchaToken) {
            throw new BadRequestError("Missing captcha token")
        }

        let data = await ScoreService.searchScore(SBD, CaptchaValue, captchaToken);

        if (!data) {
            return new NO_CONTENT().send(res);
        }

        new OK({
            message: "Score retrieved successfully",
            data: data
        }).send(res);

    }
}


module.exports = ScoreController;