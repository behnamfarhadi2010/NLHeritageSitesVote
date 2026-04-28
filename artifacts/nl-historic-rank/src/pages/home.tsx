import React from "react";
import MatchupHero from "@/components/matchup";
import RankingsList from "@/components/rankings";
import RecentVotesFeed from "@/components/recent-votes";
import StatsBar from "@/components/stats-bar";
import { Anchor } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4 text-primary">
          <Anchor size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          NL Historic Rank
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
          A gauntlet of heritage. Settle the score between the lighthouses, fortresses, and outports of Newfoundland & Labrador.
        </p>
      </header>

      <main className="container mx-auto px-4 lg:px-8">
        <div className="mb-16">
          <StatsBar />
        </div>

        {/* Hero Matchup Section */}
        <section className="mb-24">
          <MatchupHero />
        </section>

        {/* Rankings & Recent Activity Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="bg-foreground text-background w-8 h-8 rounded-full flex items-center justify-center text-lg">
                R
              </span>
              The Rankings
            </h2>
            <RankingsList />
          </div>
          
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-8">Recent Votes</h2>
            <RecentVotesFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
