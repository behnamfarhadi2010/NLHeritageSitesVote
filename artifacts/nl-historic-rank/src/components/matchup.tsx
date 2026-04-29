import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetMatchup, 
  useCastVote, 
  getGetMatchupQueryKey, 
  getListSitesQueryKey, 
  getListRecentVotesQueryKey, 
  getGetStatsQueryKey 
} from "@workspace/api-client-react";
import type { RankedSite } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Swords, AlertCircle, RefreshCw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchupHero() {
  const queryClient = useQueryClient();
  const { data: matchup, isLoading, isError, refetch } = useGetMatchup();
  const castVote = useCastVote();
  
  const [animatingWinner, setAnimatingWinner] = useState<number | null>(null);
  const [animatingLoser, setAnimatingLoser] = useState<number | null>(null);
  const [scoreDelta, setScoreDelta] = useState<number>(0);

  const handleSkip = () => {
    if (castVote.isPending || animatingWinner !== null) return;
    queryClient.invalidateQueries({ queryKey: getGetMatchupQueryKey() });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!matchup || castVote.isPending || animatingWinner !== null) return;
      if (e.key === "ArrowLeft" || e.key === "1" || e.key.toLowerCase() === "a") {
        e.preventDefault();
        handleVote(matchup.siteA.id, matchup.siteB.id);
      } else if (e.key === "ArrowRight" || e.key === "2" || e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleVote(matchup.siteB.id, matchup.siteA.id);
      } else if (e.key.toLowerCase() === "s" || e.key === " ") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchup, castVote.isPending, animatingWinner]);

  const handleVote = (winnerId: number, loserId: number) => {
    if (castVote.isPending) return;

    setAnimatingWinner(winnerId);
    setAnimatingLoser(loserId);

    castVote.mutate(
      { data: { winnerId, loserId } },
      {
        onSuccess: (result) => {
          setScoreDelta(result.eloDelta);
          
          // Wait briefly to show the animation before swapping
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: getGetMatchupQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListSitesQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListRecentVotesQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
            
            // The invalidate will trigger a refetch, but we can also explicitly refetch if needed
            // Reset animation state
            setAnimatingWinner(null);
            setAnimatingLoser(null);
            setScoreDelta(0);
          }, 1200);
        },
        onError: () => {
          setAnimatingWinner(null);
          setAnimatingLoser(null);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-12 min-h-[400px]">
        <Skeleton className="w-full md:w-[45%] h-[400px] md:h-[500px] rounded-xl" />
        <div className="flex items-center justify-center"><Swords className="text-muted opacity-20" size={48} /></div>
        <Skeleton className="w-full md:w-[45%] h-[400px] md:h-[500px] rounded-xl" />
      </div>
    );
  }

  if (isError || !matchup) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-12 text-center text-destructive flex flex-col items-center justify-center">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">Could not load matchup</h3>
        <p className="mb-6 opacity-80">The heritage sites are currently resting.</p>
        <Button variant="outline" onClick={() => refetch()}><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-background p-4 rounded-full shadow-xl border-4 border-background hidden md:flex items-center justify-center text-muted-foreground font-serif italic font-bold">
        <span className="text-xl">VS</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`${matchup.siteA.id}-${matchup.siteB.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 lg:gap-12"
        >
          <SiteCard 
            site={matchup.siteA} 
            opponent={matchup.siteB}
            onVote={() => handleVote(matchup.siteA.id, matchup.siteB.id)}
            isWinner={animatingWinner === matchup.siteA.id}
            isLoser={animatingLoser === matchup.siteA.id}
            delta={animatingWinner === matchup.siteA.id ? scoreDelta : (animatingLoser === matchup.siteA.id ? -scoreDelta : null)}
            disabled={castVote.isPending || animatingWinner !== null}
          />
          
          <div className="md:hidden flex items-center justify-center font-serif italic text-muted-foreground font-bold text-xl py-2">
            VS
          </div>
          
          <SiteCard 
            site={matchup.siteB} 
            opponent={matchup.siteA}
            onVote={() => handleVote(matchup.siteB.id, matchup.siteA.id)}
            isWinner={animatingWinner === matchup.siteB.id}
            isLoser={animatingLoser === matchup.siteB.id}
            delta={animatingWinner === matchup.siteB.id ? scoreDelta : (animatingLoser === matchup.siteB.id ? -scoreDelta : null)}
            disabled={castVote.isPending || animatingWinner !== null}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <Button
          variant="ghost"
          onClick={handleSkip}
          disabled={castVote.isPending || animatingWinner !== null}
          className="text-muted-foreground hover:text-foreground gap-2"
        >
          <SkipForward size={16} />
          Skip this matchup
        </Button>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Keyboard:</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">A</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">←</kbd>
          <span>left</span>
          <span className="opacity-50">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">B</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">→</kbd>
          <span>right</span>
          <span className="opacity-50">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-[10px]">S</kbd>
          <span>skip</span>
        </div>
      </div>
    </div>
  );
}

function SiteCard({ 
  site, 
  opponent,
  onVote, 
  isWinner, 
  isLoser, 
  delta,
  disabled 
}: { 
  site: RankedSite; 
  opponent: RankedSite;
  onVote: () => void; 
  isWinner: boolean; 
  isLoser: boolean;
  delta: number | null;
  disabled: boolean;
}) {
  return (
    <motion.button
      onClick={onVote}
      disabled={disabled}
      className={`
        w-full md:w-1/2 relative group text-left transition-all duration-300 ease-out
        rounded-2xl overflow-hidden border-2 flex flex-col bg-card
        ${isWinner ? 'border-primary ring-4 ring-primary/20 scale-[1.02] z-20 shadow-2xl' : ''}
        ${isLoser ? 'border-border/50 opacity-50 scale-[0.98] grayscale-[50%]' : ''}
        ${!isWinner && !isLoser && !disabled ? 'border-border hover:border-secondary hover:shadow-xl hover:-translate-y-1' : ''}
        ${disabled && !isWinner && !isLoser ? 'border-border opacity-80 cursor-not-allowed' : ''}
      `}
      style={{ minHeight: "450px" }}
    >
      <div className="h-64 w-full relative bg-muted overflow-hidden flex-shrink-0">
        {site.imageUrl ? (
          <img 
            src={site.imageUrl} 
            alt={site.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
            <span className="font-serif italic text-2xl opacity-50">{site.name[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Badge: Designation Year */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          EST. {site.designated}
        </div>
        
        {/* Current Rank Badge */}
        <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Trophy size={14} /> Rank #{site.rank}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white font-serif leading-tight drop-shadow-md">
            {site.name}
          </h3>
          <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            {site.location}
          </p>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          {site.summary}
        </p>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm">
            <span className="block text-muted-foreground font-medium mb-1">ELO Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground font-mono">{site.score}</span>
              <AnimatePresence>
                {delta !== null && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`font-bold font-mono text-sm ${delta > 0 ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {delta > 0 ? '+' : ''}{delta}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="text-right text-sm">
            <span className="block text-muted-foreground font-medium mb-1">Matches</span>
            <span className="text-lg font-bold text-foreground">{site.matchesPlayed}</span>
          </div>
        </div>
      </div>
      
      {/* Selection Overlay during interaction */}
      {!disabled && !isWinner && !isLoser && (
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
      )}
    </motion.button>
  );
}
