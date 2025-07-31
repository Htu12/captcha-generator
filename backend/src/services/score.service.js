const { ScoreModel } = require('../models/');
const { BadRequestError } = require('../utils/response/error.response');
const EncryptCaptchaService = require('./encrypt-captcha.service');
const pool = require('../db');

class ScoreService {
    static async searchScore(sbd, captchaValue, captchaToken) {
        let status = await EncryptCaptchaService.verify(captchaToken, captchaValue);

        if (!status) {
            throw new BadRequestError("Invalid captcha");
        }

        let poolInstance = new ScoreModel(pool);
        return await poolInstance.getScoreBySBD(sbd);
    }
}

module.exports = ScoreService;