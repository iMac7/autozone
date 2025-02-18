import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  user: 'leaderboard_user',
  password: 'leaderboard_password',
  host: 'localhost',
  database: 'leaderboard_db',
  port: 5432,
});

export const db = drizzle(pool, { schema });
export type DbClient = typeof db; 

