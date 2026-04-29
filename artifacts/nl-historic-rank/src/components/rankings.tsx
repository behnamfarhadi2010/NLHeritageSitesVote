import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useListSites } from "@workspace/api-client-react";
import type { RankedSite } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Minus, MapPin, Trophy, Search } from "lucide-react";
import SiteDetailDialog from "./site-detail-dialog";

export default function RankingsList() {
  const { data: sites, isLoading } = useListSites();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<RankedSite | null>(null);

  const filtered = useMemo(() => {
    if (!sites) return [];
    const q = query.trim().toLowerCase();
    if (!q) return sites;
    return sites.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q),
    );
  }, [sites, query]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!sites || sites.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-xl border border-border border-dashed">
        <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <p className="text-muted-foreground">No rankings established yet.</p>
      </div>
    );
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <>
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or location..."
          className="pl-9 bg-card"
        />
        {query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground tabular-nums">
            {filtered.length}/{sites.length}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground bg-muted/30 rounded-xl border border-border border-dashed">
          No sites match "{query}".
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
          className="space-y-3"
        >
          {filtered.map((site) => {
            const isPodium = site.rank <= 3;
            return (
              <motion.button
                type="button"
                key={site.id}
                variants={item}
                onClick={() => setSelected(site)}
                className={`group w-full text-left flex items-center gap-4 p-4 rounded-xl bg-card border transition-all shadow-sm hover:border-secondary hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                  isPodium ? "border-primary/40" : "border-border"
                }`}
              >
                <div className="w-12 text-center flex-shrink-0">
                  <span
                    className={`text-2xl font-serif font-bold transition-colors ${
                      isPodium
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {site.rank}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                  {site.imageUrl ? (
                    <img
                      src={site.imageUrl}
                      alt={site.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-muted-foreground">
                      {site.name[0]}
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-foreground text-lg truncate font-serif">
                    {site.name}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground gap-3">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={12} /> {site.location}
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-muted">
                      Est. {site.designated}
                    </span>
                    <span>{site.matchesPlayed} matches</span>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right flex-shrink-0 w-24">
                  <span className="font-mono font-bold text-lg">{site.score}</span>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    {site.change > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp size={12} className="mr-0.5" /> +{site.change}
                      </span>
                    ) : site.change < 0 ? (
                      <span className="text-destructive flex items-center">
                        <TrendingDown size={12} className="mr-0.5" /> {Math.abs(site.change)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center">
                        <Minus size={12} className="mr-0.5" /> -
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <SiteDetailDialog site={selected} onClose={() => setSelected(null)} />
    </>
  );
}
