import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    user: 'leaderboard_user',
    password: 'leaderboard_password',
    database: 'leaderboard_db',
    port: 5432
  },
} satisfies Config;