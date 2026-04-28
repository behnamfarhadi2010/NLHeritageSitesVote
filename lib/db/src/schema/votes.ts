import {
  pgTable,
  serial,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { sitesTable } from "./sites";

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  winnerId: integer("winner_id")
    .notNull()
    .references(() => sitesTable.id, { onDelete: "cascade" }),
  loserId: integer("loser_id")
    .notNull()
    .references(() => sitesTable.id, { onDelete: "cascade" }),
  winnerScoreBefore: integer("winner_score_before").notNull(),
  winnerScoreAfter: integer("winner_score_after").notNull(),
  loserScoreBefore: integer("loser_score_before").notNull(),
  loserScoreAfter: integer("loser_score_after").notNull(),
  eloDelta: integer("elo_delta").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votesTable.$inferSelect;
