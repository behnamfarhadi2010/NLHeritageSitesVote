import React from "react";
import { useListRecentVotes } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function RecentVotesFeed() {
  const { data: votes, isLoading } = useListRecentVotes({ limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!votes || votes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-4 py-2">
        No votes have been cast yet. Be the first to make history.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-4 w-px bg-border/50 z-0"></div>
      <div className="space-y-6 relative z-10">
        <AnimatePresence initial={false}>
          {votes.map((vote) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className="flex gap-4 items-start group"
            >
              <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary flex-shrink-0 mt-0.5 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="font-mono text-[10px] font-bold">+{vote.eloDelta}</span>
              </div>
              
              <div className="bg-card border border-border p-3 rounded-lg shadow-sm flex-grow group-hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                  <span className="font-bold text-foreground font-serif">{vote.winnerName}</span>
                  <span className="text-xs text-muted-foreground">defeated</span>
                  <span className="text-sm text-foreground/80 line-through decoration-destructive/40">{vote.loserName}</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
