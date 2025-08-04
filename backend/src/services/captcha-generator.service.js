const { createCanvas } = require('canvas');
const { randomBytes } = require('crypto');

class CaptchaGeneratorService {
    constructor() {
        // Cache character sets for better performance
        this.charSets = {
            'easy': 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789',
            'medium': 'ABCDEFGHJKLMNPQRSTUVWXYabcdefghjkmnpqrstuvwxyz123456789',
            'hard': 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyzabcdefghjkmnpqrstuvwxyz123456789!@#$%&',
        };

        this.fonts = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Comic Sans MS'];
        this.styles = ['bold', 'italic', 'bold italic'];
        // Predefined colors for better performance
        this.colors = ['#2c3e50', '#e74c3c', '#3498db', '#27ae60', '#8e44ad', '#f39c12'];
    }
    /**
     * Get the character set based on difficulty level
     * @param {*} difficulty 
     * @returns the character set for the specified difficulty
     */
    getCharacterSet(difficulty) {
        return this.charSets[difficulty] || this.charSets['medium'];
    }

    /**
     * 
     * @param {*} length 
     * @param {*} charset 
     * @returns a random string of specified length from the charset
     */
    generateRandomString(length, charset) {
        const bytes = randomBytes(length);
        let result = '';

        for (let i = 0; i < length; i++) {
            result += charset[bytes[i] % charset.length];
        }

        return result;
    }

    /**
     * Adds noise to the captcha image
     * @param {*} ctx 
     * @param {*} width 
     * @param {*} height 
     * @param {*} intensity 
     */
    addNoise(ctx, width, height, intensity = 'medium') {
        const noiseConfig = {
            'low': { dots: 20, lines: 2 },
            'medium': { dots: 30, lines: 3 },
            'high': { dots: 50, lines: 5 }
        };

        const config = noiseConfig[intensity] || noiseConfig['medium'];

        // Batch random values for better performance
        const dotPositions = new Float32Array(config.dots * 3); // x, y, radius
        const linePositions = new Float32Array(config.lines * 4); // x1, y1, x2, y2

        // Generate all random values at once
        for (let i = 0; i < config.dots * 3; i += 3) {
            dotPositions[i] = Math.random() * width;     // x
            dotPositions[i + 1] = Math.random() * height; // y
            dotPositions[i + 2] = Math.random() * 2;      // radius
        }

        for (let i = 0; i < config.lines * 4; i += 4) {
            linePositions[i] = Math.random() * width;     // x1
            linePositions[i + 1] = Math.random() * height; // y1
            linePositions[i + 2] = Math.random() * width;   // x2
            linePositions[i + 3] = Math.random() * height; // y2
        }

        // Draw dots
        for (let i = 0; i < config.dots * 3; i += 3) {
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`;
            ctx.beginPath();
            ctx.arc(dotPositions[i], dotPositions[i + 1], dotPositions[i + 2], 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw lines
        for (let i = 0; i < config.lines * 4; i += 4) {
            ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`;
            ctx.lineWidth = Math.random() * 2 + 1.5; // Increased base width for bolder lines
            ctx.beginPath();
            ctx.moveTo(linePositions[i], linePositions[i + 1]);
            ctx.lineTo(linePositions[i + 2], linePositions[i + 3]);
            ctx.stroke();
        }
    }

    /**
     * Adds a background pattern to the captcha image
     * @param {*} ctx 
     * @param {*} width 
     * @param {*} height 
     */
    addBackgroundPattern(ctx, width, height) {
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Batch all line operations
        for (let i = 0; i < width; i += 10) {
            for (let j = 0; j < height; j += 10) {
                if (Math.random() > 0.5) {
                    ctx.moveTo(i, j);
                    ctx.lineTo(i + 5, j + 5);
                }
            }
        }
        ctx.stroke();
    }

/**
 * Adds text to the captcha image with distortion effects
 * @param {*} ctx 
 * @param {*} text 
 * @param {*} x 
 * @param {*} y 
 * @param {*} fontOptions 
 */
    addDistortion(ctx, text, x, y, fontOptions) {
        const { fontFamily, fontStyle } = fontOptions;
        const chars = text.split('');
        let currentX = x;

        chars.forEach((char) => {
            ctx.save();

            // Optimized transformations
            const rotation = (Math.random() - 0.5) * 0.4;
            const fontSize = 32 + Math.random() * 8;

            ctx.translate(currentX, y);
            ctx.rotate(rotation);
            ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)];

            // Determine font family to use
            let selectedFont = fontFamily;
            if (fontFamily === 'random') {
                selectedFont = this.fonts[Math.floor(Math.random() * this.fonts.length)];
            }

            // Determine font style to use
            let selectedStyle = fontStyle;
            if (fontStyle === 'random') {
                selectedStyle = this.styles[Math.floor(Math.random() * this.styles.length)];
            }

            // Set the font with dynamic family and style
            ctx.font = `${selectedStyle} ${fontSize}px "${selectedFont}"`;

            const textWidth = ctx.measureText(char).width;
            ctx.fillText(char, -textWidth / 2, 0);

            ctx.restore();

            currentX += textWidth + 2 + Math.random() * 5; // Add random spacing between characters
        });
    }

    /**
     * Generates a captcha image based on the provided options.
     * @param {*} options 
     * @returns object containing the image buffer, solution, format, size, and dimensions
     */
    generate(options) {
        // Generate solution text
        let { difficulty, length, width, height, format, quality, noiseLevel, fontFamily, fontStyle } = options;
        const charset = this.getCharacterSet(difficulty);
        const solution = this.generateRandomString(length, charset);

        // Create canvas with optimized settings
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Set image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background - white for JPEG compatibility
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Add optimized background pattern
        this.addBackgroundPattern(ctx, width, height);

        // Add noise before text
        this.addNoise(ctx, width, height, noiseLevel);

        // Add distorted text with better positioning
        const textY = height / 2 + 10;
        const textX = Math.max(10, (width - (solution.length * 25)) / 2);
        this.addDistortion(ctx, solution, textX, textY, { fontFamily, fontStyle });

        // Add more noise after text
        this.addNoise(ctx, width, height, noiseLevel);

        // Convert to buffer with format support
        let imageBuffer;
        if (format.toLowerCase() === 'jpeg' || format.toLowerCase() === 'jpg') {
            imageBuffer = canvas.toBuffer('image/jpeg', { quality });
        } else {
            imageBuffer = canvas.toBuffer('image/png');
        }

        return {
            imageBuffer,
            solution: solution,
            format: format,
            size: imageBuffer.length,
            dimensions: { width, height }
        };
    }

    /**
     * Generates image information from the provided parameters.
     * @param {*} imageBuffer 
     * @param {*} format 
     * @param {*} width 
     * @param {*} height 
     * @returns utils method to get image information
     */
    getImageInfo(imageBuffer, format, width, height) {
        const bytesPerPixel = imageBuffer.length / (width * height);

        return {
            format: format,
            size: `${imageBuffer.length} bytes`,
            dimensions: `${width}w x ${height}h`,
            bytesPerPixel: `${bytesPerPixel.toFixed(2)} bytes/px`,
            dpi: 96,
            compression: format === 'jpeg' ? 'Baseline, Subsample@4:2:0' : 'Lossless'
        };
    }
}

module.exports = CaptchaGeneratorService;