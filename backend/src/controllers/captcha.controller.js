const { CaptchaService } = require('../services/index');
const _constant = require('./_constant');

class CaptchaController {
    static async getCaptchaImage(req, res) {
        // Generate captcha image
        let { imageBuffer, encryptedSolution } = await CaptchaService.createCaptchaImage();

        // Set encrypted captcha in httpOnly cookie
        res.cookie('captcha_token', encryptedSolution, {
            httpOnly: true,
            secure: true,      
            sameSite: _constant.SAMESITE,
            maxAge: _constant.MAX_AGE,
        });

        // Set headers for image blob
        res.set(_constant.HEADER);

        res.send(imageBuffer);
    }

    static async verifyCaptcha(req, res) {
        // Get captcha token from cookies
        const captchaToken = req.cookies?.captcha_token;

        // Verify the captcha solution
        const isValid = await CaptchaService.verifyCaptcha(captchaToken, req.body.CaptchaValue);

        if (isValid) {
            res.status(200).json({ message: 'Captcha verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid captcha solution' });
        }
    }
}

module.exports = CaptchaController;