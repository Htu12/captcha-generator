'use strict';
const CaptchaGeneratorService = require('./captcha-generator.service');
const EncryptCaptchaService = require('./encrypt-captcha.service');
const { BadRequestError } = require('../utils/response/error.response');
const { app } = require("../config/index")

class CaptchaService {
    static async createCaptchaImage() {
        let captchaLevel = app.captcha_level;
        let cap = new CaptchaGeneratorService();
        let result = cap.generate(captchaLevel);

        // Encrypt the captcha solution
        let encryptedData = EncryptCaptchaService.encrypt(result.solution);

        return {
            imageBuffer: result.imageBuffer,
            encryptedSolution: encryptedData
        };
    }

    static async verifyCaptcha(encryptedToken, captchaInput) {
        let isValid = await EncryptCaptchaService.verify(encryptedToken, captchaInput);

        if (!isValid) {
            throw new BadRequestError("Invalid captcha solution");
        }

        return true;
    }
}

module.exports = CaptchaService;