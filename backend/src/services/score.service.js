const { ScoreModel } = require('../models/');
const { BadRequestError } = require('../utils/response/error.response');
const EncryptCaptchaService = require('./encrypt-captcha.service');
const pool = require('../db');

class ScoreService {
    /**
     * Searches for a score by SBD with captcha verification.
     * @param {*} sbd 
     * @param {*} captchaValue 
     * @param {*} captchaToken 
     * @returns data from the ScoreModel if found.
     */
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