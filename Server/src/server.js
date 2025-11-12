import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

export const startServer = async () => {
  await connectDatabase();

  return app.listen(env.port, () => {
    console.log(`CampusConnect API running on port ${env.port}`);
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
}
