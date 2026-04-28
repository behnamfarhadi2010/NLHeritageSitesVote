import React from "react";
import { motion } from "framer-motion";
import { useListSites } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, MapPin, Trophy } from "lucide-react";

export default function RankingsList() {
  const { data: sites, isLoading } = useListSites();

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {sites.map((site) => (
        <motion.div 
          key={site.id} 
          variants={item}
          className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-secondary/50 transition-colors shadow-sm"
        >
          <div className="w-12 text-center flex-shrink-0">
            <span className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
              {site.rank}
            </span>
          </div>

          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/50">
            {site.imageUrl ? (
              <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-muted-foreground">
                {site.name[0]}
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <h4 className="font-bold text-foreground text-lg truncate font-serif">{site.name}</h4>
            <div className="flex items-center text-xs text-muted-foreground gap-3">
              <span className="flex items-center gap-1 truncate"><MapPin size={12} /> {site.location}</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-muted">Est. {site.designated}</span>
              <span>{site.matchesPlayed} matches</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right flex-shrink-0 w-24">
            <span className="font-mono font-bold text-lg">{site.score}</span>
            <div className="flex items-center gap-1 text-xs font-medium">
              {site.change > 0 ? (
                <span className="text-green-600 flex items-center"><TrendingUp size={12} className="mr-0.5" /> +{site.change}</span>
              ) : site.change < 0 ? (
                <span className="text-destructive flex items-center"><TrendingDown size={12} className="mr-0.5" /> {Math.abs(site.change)}</span>
              ) : (
                <span className="text-muted-foreground flex items-center"><Minus size={12} className="mr-0.5" /> -</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
