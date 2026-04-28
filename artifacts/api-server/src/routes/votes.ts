import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, sitesTable, votesTable } from "@workspace/db";
import {
  CastVoteBody,
  ListRecentVotesQueryParams,
  ListRecentVotesResponse,
} from "@workspace/api-zod";
import { computeElo } from "../lib/elo";

const router: IRouter = Router();

router.post("/votes", async (req, res): Promise<void> => {
  const parsed = CastVoteBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid vote body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { winnerId, loserId } = parsed.data;
  if (winnerId === loserId) {
    res.status(400).json({ error: "Winner and loser must be different sites" });
    return;
  }

  const result = await db.transaction(async (tx) => {
    const before = await tx
      .select()
      .from(sitesTable)
      .orderBy(desc(sitesTable.score), sitesTable.id);

    const winnerIdx = before.findIndex((s) => s.id === winnerId);
    const loserIdx = before.findIndex((s) => s.id === loserId);

    if (winnerIdx === -1 || loserIdx === -1) {
      return null;
    }

    const winner = before[winnerIdx];
    const loser = before[loserIdx];
    const winnerRankBefore = winnerIdx + 1;
    const loserRankBefore = loserIdx + 1;

    const elo = computeElo(winner.score, loser.score);

    await tx
      .update(sitesTable)
      .set({
        score: elo.winnerScoreAfter,
        previousRank: winnerRankBefore,
        matchesPlayed: winner.matchesPlayed + 1,
        wins: winner.wins + 1,
      })
      .where(eq(sitesTable.id, winner.id));

    await tx
      .update(sitesTable)
      .set({
        score: elo.loserScoreAfter,
        previousRank: loserRankBefore,
        matchesPlayed: loser.matchesPlayed + 1,
      })
      .where(eq(sitesTable.id, loser.id));

    const [vote] = await tx
      .insert(votesTable)
      .values({
        winnerId: winner.id,
        loserId: loser.id,
        winnerScoreBefore: winner.score,
        winnerScoreAfter: elo.winnerScoreAfter,
        loserScoreBefore: loser.score,
        loserScoreAfter: elo.loserScoreAfter,
        eloDelta: elo.delta,
      })
      .returning();

    return vote;
  });

  if (!result) {
    res.status(404).json({ error: "Site not found" });
    return;
  }

  req.log.info(
    { voteId: result.id, winnerId, loserId, delta: result.eloDelta },
    "Vote recorded",
  );

  res.status(201).json({
    voteId: result.id,
    winnerId: result.winnerId,
    loserId: result.loserId,
    winnerScoreBefore: result.winnerScoreBefore,
    winnerScoreAfter: result.winnerScoreAfter,
    loserScoreBefore: result.loserScoreBefore,
    loserScoreAfter: result.loserScoreAfter,
    eloDelta: result.eloDelta,
    createdAt: result.createdAt.toISOString(),
  });
});

router.get("/votes/recent", async (req, res): Promise<void> => {
  const parsed = ListRecentVotesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const limit = parsed.data.limit ?? 10;

  const winners = sitesTable;
  const recent = await db
    .select({
      id: votesTable.id,
      winnerId: votesTable.winnerId,
      loserId: votesTable.loserId,
      eloDelta: votesTable.eloDelta,
      createdAt: votesTable.createdAt,
      winnerName: sql<string>`(SELECT name FROM ${sitesTable} WHERE id = ${votesTable.winnerId})`,
      loserName: sql<string>`(SELECT name FROM ${sitesTable} WHERE id = ${votesTable.loserId})`,
    })
    .from(votesTable)
    .innerJoin(winners, eq(winners.id, votesTable.winnerId))
    .orderBy(desc(votesTable.createdAt))
    .limit(limit);

  const items = recent.map((row) => ({
    id: row.id,
    winnerId: row.winnerId,
    winnerName: row.winnerName,
    loserId: row.loserId,
    loserName: row.loserName,
    eloDelta: row.eloDelta,
    createdAt: row.createdAt.toISOString(),
  }));

  res.json(ListRecentVotesResponse.parse(items));
});

export default router;
