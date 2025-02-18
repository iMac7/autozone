import { pgTable, serial, varchar, timestamp, integer, numeric } from 'drizzle-orm/pg-core';

export const speedRecords = pgTable('speed_records', {
  id: serial('id').primaryKey(),
  lensAddress: varchar('lens_address', { length: 255 }).notNull(),
  tokenId: integer('token_id').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  speed: numeric('speed').notNull(),
  createdAt: timestamp('created_at').defaultNow()
}); 