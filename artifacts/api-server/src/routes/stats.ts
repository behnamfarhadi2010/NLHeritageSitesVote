import { Router, type IRouter } from "express";
import { desc, sql } from "drizzle-orm";
import { db, sitesTable, votesTable } from "@workspace/db";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const sites = await db
    .select()
    .from(sitesTable)
    .orderBy(desc(sitesTable.score), sitesTable.id);

  const [{ count: totalVotes }] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(votesTable);

  const buildRanked = (idx: number) => {
    const site = sites[idx];
    const currentRank = idx + 1;
    const change =
      site.previousRank == null ? 0 : site.previousRank - currentRank;
    return {
      id: site.id,
      name: site.name,
      designated: site.designated,
      location: site.location,
      summary: site.summary,
      imageUrl: site.imageUrl,
      score: site.score,
      rank: currentRank,
      change,
      matchesPlayed: site.matchesPlayed,
      wins: site.wins,
    };
  };

  const topSite = sites.length > 0 ? buildRanked(0) : null;

  let biggestMover: ReturnType<typeof buildRanked> | null = null;
  let bestMagnitude = 0;
  sites.forEach((site, idx) => {
    if (site.previousRank == null) return;
    const change = site.previousRank - (idx + 1);
    if (Math.abs(change) > bestMagnitude) {
      bestMagnitude = Math.abs(change);
      biggestMover = buildRanked(idx);
    }
  });

  res.json(
    GetStatsResponse.parse({
      totalVotes: totalVotes ?? 0,
      totalSites: sites.length,
      topSite,
      biggestMover,
    }),
  );
});

export default router;
