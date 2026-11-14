import app from './app.js';
import env from './config/env.js';
import redis from './config/redis.js';
import { startCleanupJob } from './jobs/cleanup.js';

const server = app.listen(env.PORT, () => {
  console.log(`Sky Share server running on port ${env.PORT}`);
});

// Start cleanup job
startCleanupJob();

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await redis.quit();
      console.log('Redis disconnected');
    } catch (err) {
      console.error('Error disconnecting Redis:', err.message);
    }
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
