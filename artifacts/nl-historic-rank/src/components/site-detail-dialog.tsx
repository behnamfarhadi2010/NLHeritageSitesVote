import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, Swords, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import type { RankedSite } from "@workspace/api-client-react";
import { SiteImage } from "./site-image";

export default function SiteDetailDialog({
  site,
  onClose,
}: {
  site: RankedSite | null;
  onClose: () => void;
}) {
  const open = site !== null;
  const winRate =
    site && site.matchesPlayed > 0
      ? Math.round((site.wins / site.matchesPlayed) * 100)
      : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {site && (
          <>
            <div className="relative h-64 w-full bg-muted">
              <SiteImage
                src={site.imageUrl}
                alt={site.name}
                fallbackInitial={site.name[0]}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full flex items-center justify-center text-6xl text-muted-foreground font-serif italic opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                  <Trophy size={14} /> Rank #{site.rank}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-serif text-white drop-shadow-md text-left">
                    {site.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-white/85 text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {site.location}
                  </span>
                  {site.designated && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> Designated {site.designated}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pt-5 pb-6 space-y-5">
              <p className="text-foreground/80 leading-relaxed">{site.summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
                <Stat label="ELO Score" value={String(site.score)} mono />
                <Stat label="Matches" value={String(site.matchesPlayed)} icon={<Swords size={14} />} />
                <Stat label="Wins" value={`${site.wins}`} sub={site.matchesPlayed > 0 ? `${winRate}% win rate` : "—"} />
                <Stat
                  label="Trend"
                  value={
                    site.change > 0
                      ? `+${site.change}`
                      : site.change < 0
                      ? `${site.change}`
                      : "—"
                  }
                  icon={
                    site.change > 0 ? (
                      <TrendingUp size={14} className="text-green-600" />
                    ) : site.change < 0 ? (
                      <TrendingDown size={14} className="text-destructive" />
                    ) : (
                      <Minus size={14} className="text-muted-foreground" />
                    )
                  }
                  sub="vs. last vote"
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  label,
  value,
  sub,
  icon,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold mt-1 ${mono ? "font-mono" : ""}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
