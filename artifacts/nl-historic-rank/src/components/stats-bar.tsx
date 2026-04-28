import React from "react";
import { useGetStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Landmark, Users, Flame, TrendingUp } from "lucide-react";

export default function StatsBar() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-2xl" />;
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-secondary/5 border border-secondary/20 p-6 rounded-2xl">
      <StatItem 
        icon={<Users size={20} className="text-primary" />} 
        label="Total Votes Cast" 
        value={stats.totalVotes.toLocaleString()} 
      />
      <StatItem 
        icon={<Landmark size={20} className="text-secondary" />} 
        label="Heritage Sites" 
        value={stats.totalSites.toString()} 
      />
      <StatItem 
        icon={<Flame size={20} className="text-orange-500" />} 
        label="Current Leader" 
        value={stats.topSite?.name || "—"} 
        subValue={stats.topSite ? `${stats.topSite.score} ELO` : undefined}
      />
      <StatItem 
        icon={<TrendingUp size={20} className="text-green-600" />} 
        label="Biggest Mover" 
        value={stats.biggestMover?.name || "—"} 
        subValue={stats.biggestMover ? `${stats.biggestMover.change > 0 ? "+" : ""}${stats.biggestMover.change} places` : undefined}
      />
    </div>
  );
}

function StatItem({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1.5 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className="font-serif font-bold text-xl md:text-2xl text-foreground truncate">
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-muted-foreground mt-0.5 font-mono">
          {subValue}
        </div>
      )}
    </div>
  );
}
