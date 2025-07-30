const crypto = require("crypto");

class EncryptCaptchaService {
    static encrypt(text) {
        // Encrypt the captcha solution
        const secretKey = process.env.CAPTCHA_SECRET;
        const algorithm = 'aes-256-cbc';

        // Ensure the secret key is provided
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
        const secretKey = process.env.CAPTCHA_SECRET;
        const algorithm = 'aes-256-cbc';

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