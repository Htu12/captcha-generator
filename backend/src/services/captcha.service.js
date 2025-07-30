'use strict';
const CaptchaGeneratorService = require('./captcha-generator.service');
const EncryptCaptchaService = require('./encrypt-captcha.service');
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
        return EncryptCaptchaService.verify(encryptedToken, captchaInput);
    }
}

module.exports = CaptchaService;