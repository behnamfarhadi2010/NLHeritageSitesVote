import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, sitesTable } from "@workspace/db";
import { ListSitesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/sites", async (req, res): Promise<void> => {
  const sites = await db
    .select()
    .from(sitesTable)
    .orderBy(desc(sitesTable.score), sitesTable.id);

  const ranked = sites.map((site, index) => {
    const currentRank = index + 1;
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
  });

  req.log.info({ count: ranked.length }, "Listed sites");
  res.json(ListSitesResponse.parse(ranked));
});

export default router;
