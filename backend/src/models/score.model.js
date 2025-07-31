'use strict';
class ScoreModel {
    constructor(pool) {
        this.pool = pool;
    }

    async getScoreBySBD(sbd) {
        const result = await this.pool.query("SELECT * FROM score_2025_19 WHERE sbd = $1", [sbd]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
}

module.exports = ScoreModel;