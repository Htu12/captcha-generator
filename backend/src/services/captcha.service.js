'use strict';
const CaptchaGeneratorService = require('./captcha-generator.service');
const EncryptCaptchaService = require('./encrypt-captcha.service');
const { BadRequestError } = require('../utils/response/error.response');
const { app } = require("../config/index")

const captchaGen = new CaptchaGeneratorService();
class CaptchaService {
    /**
     * @returns an object containing the captcha image buffer and encrypted solution
     * @throws BadRequestError if the captcha solution is invalid
     */
    static async createCaptchaImage() {
        const options = app.captcha_level;
        const result = captchaGen.generate(options);

        // Encrypt the captcha solution
        let encryptedData = EncryptCaptchaService.encrypt(result.solution);

        return {
            imageBuffer: result.imageBuffer,
            encryptedSolution: encryptedData
        };
    }
    /**
     * Verifies the captcha solution against the encrypted token.
     * @param {string} encryptedToken - The encrypted captcha solution.
     * @param {string} captchaInput - The user input for the captcha.
     * @returns {boolean} - Returns true if the captcha is valid.
     * @throws BadRequestError if the captcha solution is invalid.
     */
    static async verifyCaptcha(encryptedToken, captchaInput) {
        let isValid = await EncryptCaptchaService.verify(encryptedToken, captchaInput);

        if (!isValid) {
            throw new BadRequestError("Invalid captcha solution");
        }

        return isValid;
    }
}

module.exports = CaptchaService;