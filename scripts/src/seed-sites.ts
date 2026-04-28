import { db, sitesTable } from "@workspace/db";

const sites = [
  {
    name: "L'Anse aux Meadows",
    designated: 1968,
    location: "Great Northern Peninsula",
    summary:
      "The only confirmed Norse settlement in North America, where Vikings built sod longhouses around 1000 CE — also a UNESCO World Heritage Site.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Authentic_Viking_recreation.jpg/640px-Authentic_Viking_recreation.jpg",
  },
  {
    name: "Signal Hill",
    designated: 1951,
    location: "St. John's",
    summary:
      "A storied military lookout above St. John's harbour where Marconi received the world's first transatlantic wireless signal in 1901.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Signal_Hill_-_2008.jpg/640px-Signal_Hill_-_2008.jpg",
  },
  {
    name: "Cape Spear Lighthouse",
    designated: 1962,
    location: "Cape Spear",
    summary:
      "The oldest surviving lighthouse in Newfoundland and Labrador, perched on the easternmost point of North America since 1836.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Cape_Spear_Lighthouse_Newfoundland_2005.jpg/640px-Cape_Spear_Lighthouse_Newfoundland_2005.jpg",
  },
  {
    name: "Castle Hill",
    designated: 1968,
    location: "Placentia",
    summary:
      "Stone ruins of the 17th-century French fortifications that once guarded Plaisance, France's principal North American fishing colony.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Castle_Hill_NHS.jpg/640px-Castle_Hill_NHS.jpg",
  },
  {
    name: "Port au Choix",
    designated: 1970,
    location: "Great Northern Peninsula",
    summary:
      "An archaeological landscape preserving 6,000 years of Indigenous Maritime Archaic and Dorset Palaeoeskimo culture along the Strait of Belle Isle.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Port_au_Choix_NHS.jpg/640px-Port_au_Choix_NHS.jpg",
  },
  {
    name: "Red Bay",
    designated: 1979,
    location: "Labrador",
    summary:
      "A 16th-century Basque whaling station on the Labrador coast — the largest pre-industrial whale rendering operation in the world and a UNESCO site.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Red_Bay_Labrador.jpg/640px-Red_Bay_Labrador.jpg",
  },
  {
    name: "Ryan Premises",
    designated: 1987,
    location: "Bonavista",
    summary:
      "A merchant's salt-cod compound of weathered white-and-ochre buildings on Bonavista Harbour, telling the story of the Atlantic fishery.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ryan_Premises_Bonavista.jpg/640px-Ryan_Premises_Bonavista.jpg",
  },
  {
    name: "Hawthorne Cottage",
    designated: 1978,
    location: "Brigus",
    summary:
      "The 19th-century picturesque cottage home of Arctic explorer Captain Bob Bartlett, who guided Peary toward the North Pole.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Hawthorne_Cottage.jpg/640px-Hawthorne_Cottage.jpg",
  },
  {
    name: "Hopedale Mission",
    designated: 1970,
    location: "Hopedale, Labrador",
    summary:
      "A 1782 Moravian mission complex in northern Labrador — the oldest wooden-frame structures east of Quebec, built by missionaries among the Inuit.",
    imageUrl: null,
  },
  {
    name: "Hebron Mission",
    designated: 1976,
    location: "Hebron, Labrador",
    summary:
      "An abandoned Moravian mission station above the treeline whose 1959 closure forcibly relocated its Inuit community — a place of memory and reckoning.",
    imageUrl: null,
  },
  {
    name: "Heart's Content Cable Station",
    designated: 1974,
    location: "Heart's Content",
    summary:
      "Where the first successful permanent transatlantic telegraph cable came ashore in 1866, instantly shrinking the distance between North America and Europe.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Heart%27s_Content_Cable_Station.jpg/640px-Heart%27s_Content_Cable_Station.jpg",
  },
  {
    name: "Cupids Cove Plantation",
    designated: 1975,
    location: "Cupids",
    summary:
      "The site of the first English settlement in what is now Canada, founded by John Guy in 1610 — predating the Mayflower by a decade.",
    imageUrl: null,
  },
  {
    name: "Cape Race Lighthouse",
    designated: 1974,
    location: "Cape Race",
    summary:
      "A landmark cast-iron tower on the foggy southeast cape that received the Titanic's distress calls in 1912 and saved countless mariners.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Cape_Race_Lighthouse.jpg/640px-Cape_Race_Lighthouse.jpg",
  },
  {
    name: "Battle Harbour",
    designated: 1996,
    location: "Battle Island, Labrador",
    summary:
      "A restored 19th-century saltfish capital of Labrador on a remote island, complete with merchant premises, fishing rooms, and a clapboard Anglican church.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Battle_Harbour_Labrador.jpg/640px-Battle_Harbour_Labrador.jpg",
  },
  {
    name: "Mockbeggar Plantation",
    designated: 1989,
    location: "Bonavista",
    summary:
      "The waterfront home and fishing premises of Confederation father F. Gordon Bradley, preserved as a snapshot of 19th-century outport life.",
    imageUrl: null,
  },
  {
    name: "Quidi Vidi Battery",
    designated: 1962,
    location: "St. John's",
    summary:
      "A small cliffside gun battery overlooking The Gut, captured and recaptured between French and British forces during the Seven Years' War.",
    imageUrl: null,
  },
  {
    name: "Colonial Building",
    designated: 1974,
    location: "St. John's",
    summary:
      "The neoclassical limestone seat of Newfoundland's legislature from 1850 to 1959 — and the centre of a riot that ended Responsible Government in 1932.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Colonial_Building_St._John%27s_Newfoundland.jpg/640px-Colonial_Building_St._John%27s_Newfoundland.jpg",
  },
  {
    name: "Government House",
    designated: 1982,
    location: "St. John's",
    summary:
      "The 1831 sandstone official residence of the Lieutenant Governor — surrounded by a defensive dry moat the Governor reportedly mistook for an English garden ditch.",
    imageUrl: null,
  },
  {
    name: "Commissariat House",
    designated: 1978,
    location: "St. John's",
    summary:
      "An 1820 Georgian residence built for the British military commissariat, lovingly restored to its 1830s appearance with period furnishings.",
    imageUrl: null,
  },
  {
    name: "Spaniard's Bay Wireless Station",
    designated: 1975,
    location: "Bay Roberts",
    summary:
      "An early 20th-century transatlantic cable and wireless relay station whose long brick hall once routed coded telegrams across the Atlantic.",
    imageUrl: null,
  },
];

async function main() {
  const existing = await db.select().from(sitesTable);
  if (existing.length > 0) {
    console.log(
      `Sites table already has ${existing.length} rows — skipping seed.`,
    );
    return;
  }

  await db.insert(sitesTable).values(sites);
  console.log(`Inserted ${sites.length} historic sites.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
  });
