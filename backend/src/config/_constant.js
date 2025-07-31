const MEDIUM = {
    difficulty: 'medium',
    length: 5,
    width: 180,
    height: 50,
    format: 'jpeg',
    quality: 0.8,
    noiseLevel: 'high',
    fontFamily: 'random',
    fontStyle: 'random'
}

const EASY = {
    difficulty: 'easy',
    length: 4,
    width: 180,
    height: 50,
    format: 'jpeg',
    quality: 0.8,
    noiseLevel: 'low',
    fontFamily: 'random',
    fontStyle: 'random'
}

const HARD = {
    difficulty: 'hard',
    length: 5,
    width: 180,
    height: 50,
    format: 'jpeg',
    quality: 0.8,
    noiseLevel: 'high',
    fontFamily: 'random',
    fontStyle: 'random'
};

const CAPTCHA_LEVELS = {
    "easy": EASY,
    "medium": MEDIUM,
    "hard": HARD
}

module.exports = CAPTCHA_LEVELS;
