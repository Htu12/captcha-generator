const config = require("./src/config")
const PORT = config.app.port;
const app = require('./src/app');
const pool = require("./src/db");

function startServer() {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    try {
        await pool.end();
        console.log('Database pool has ended');
    } catch (e) {
        console.error('Error ending DB pool', e);
    } finally {
        process.exit(0);
    }
});

