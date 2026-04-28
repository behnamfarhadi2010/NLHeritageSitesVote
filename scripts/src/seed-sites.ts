import { db, sitesTable } from "@workspace/db";
import sites from "./data/nl-historic-sites.json" with { type: "json" };

type SiteSeed = {
  name: string;
  designated: number | null;
  location: string;
  summary: string;
  imageUrl: string | null;
};

async function main() {
  const data = sites as SiteSeed[];
  const existing = await db.select().from(sitesTable);

  if (existing.length === data.length) {
    console.log(
      `Sites table already has ${existing.length} rows matching seed — nothing to do.`,
    );
    return;
  }

  if (existing.length > 0) {
    console.log(
      `Replacing ${existing.length} existing sites with ${data.length} from Wikipedia source...`,
    );
    await db.delete(sitesTable);
  }

  await db.insert(sitesTable).values(
    data.map((s) => ({
      name: s.name,
      designated: s.designated,
      location: s.location,
      summary: s.summary,
      imageUrl: s.imageUrl,
    })),
  );
  console.log(`Inserted ${data.length} historic sites.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  });
