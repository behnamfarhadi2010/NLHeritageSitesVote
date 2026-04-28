import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, sitesTable } from "@workspace/db";
import { GetMatchupResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/matchup", async (req, res): Promise<void> => {
  const sites = await db
    .select()
    .from(sitesTable)
    .orderBy(desc(sitesTable.score), sitesTable.id);

  if (sites.length < 2) {
    req.log.warn({ count: sites.length }, "Not enough sites for a matchup");
    res.status(404).json({ error: "Not enough sites to form a matchup" });
    return;
  }

  // Pick first site uniformly at random.
  const aIdx = Math.floor(Math.random() * sites.length);

  // Pick second site weighted by ELO closeness for tighter matchups (~70% of the
  // time), otherwise choose any other site for variety.
  let bIdx: number;
  if (Math.random() < 0.7) {
    const a = sites[aIdx];
    const sortedByDistance = sites
      .map((s, i) => ({ i, dist: Math.abs(s.score - a.score) }))
      .filter((s) => s.i !== aIdx)
      .sort((x, y) => x.dist - y.dist)
      .slice(0, Math.min(6, sites.length - 1));
    bIdx = sortedByDistance[
      Math.floor(Math.random() * sortedByDistance.length)
    ].i;
  } else {
    do {
      bIdx = Math.floor(Math.random() * sites.length);
    } while (bIdx === aIdx);
  }

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

  res.json(
    GetMatchupResponse.parse({
      siteA: buildRanked(aIdx),
      siteB: buildRanked(bIdx),
    }),
  );
});

export default router;
