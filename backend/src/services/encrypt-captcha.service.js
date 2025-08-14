const crypto = require("crypto");

const secretKey = process.env.CAPTCHA_SECRET;
const algorithm = 'aes-256-cbc';
class EncryptCaptchaService {
    static encrypt(text) {
        if (!secretKey) {
            throw new Error("CAPTCHA_SECRET is not set in environment");
        }
        
        // Encrypt the captcha solution
        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = crypto.randomBytes(16);

        // Create cipher and encrypt the text
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const expireTimestamp = Math.floor(Date.now() / 1000) + 60 * 2; // 2 minutes expiration

        // Combine iv and encrypted data, and append expiration timestamp
        const token = `${encrypted}.${iv.toString('hex')}.${expireTimestamp}`;

        return token;
    }

    static verify(token, inputText) {
        if (!secretKey) {
            throw new Error("CAPTCHA_SECRET is not set in environment");
        }

        if (!token || !inputText) return false;

        // Token format: encryptedHex.ivHex.timestamp
        const [encryptedHex, ivHex, timestamp] = token.split('.');

        if (!encryptedHex || !ivHex || !timestamp) return false;

        // check if the token has expired
        const now = Math.floor(Date.now() / 1000);
        if (now > parseInt(timestamp)) {
            console.log('Captcha expired');
            return false;
        }

        const key = crypto.scryptSync(secretKey, 'salt', 32);
        const iv = Buffer.from(ivHex, 'hex');

        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // Compare decrypted text with input text
        return decrypted === inputText;
    }

}

module.exports = EncryptCaptchaService;