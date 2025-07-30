const { ScoreService } = require('../services/');

class ScoreController {
    static async getScores(req, res) {        
        const { SBD, CaptchaValue } = req.query;

        const captchaToken = req.cookies?.captcha_token;

        if (!captchaToken) {
            return res.status(400).json({
                message: "Missing captcha token"
            });
        }

        ScoreService.searchScore(SBD, CaptchaValue, captchaToken)
            .then(scoreData => {
                res.status(200).json({
                    message: "Score retrieved successfully",
                    data: scoreData
                });
            })
            .catch(error => {
                console.error("Error retrieving score:", error);
                if (error.message === "Invalid captcha") {
                    return res.status(400).json({
                        message: "Invalid captcha"
                    });
                }
                res.status(500).json({
                    message: "Internal server error"
                });
            });
    }
}


module.exports = ScoreController;