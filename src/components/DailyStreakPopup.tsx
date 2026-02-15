import { useState, useEffect } from "react";
import { X, Flame, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface DailyStreakPopupProps {
  streakDays: number;
  open: boolean;
  onClose: () => void;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365];

function getBadge(days: number): { emoji: string; label: string; color: string } {
  if (days >= 365) return { emoji: "💎", label: "Diamante", color: "from-cyan-400 to-blue-500" };
  if (days >= 100) return { emoji: "👑", label: "Leyenda", color: "from-yellow-400 to-amber-500" };
  if (days >= 60) return { emoji: "🔥", label: "Imparable", color: "from-orange-400 to-red-500" };
  if (days >= 30) return { emoji: "⚡", label: "Rayo", color: "from-primary to-emerald-400" };
  if (days >= 14) return { emoji: "🌟", label: "Estrella", color: "from-yellow-300 to-orange-400" };
  if (days >= 7) return { emoji: "🏅", label: "Constante", color: "from-amber-300 to-yellow-500" };
  if (days >= 3) return { emoji: "🔥", label: "En racha", color: "from-orange-300 to-red-400" };
  return { emoji: "✨", label: "Inicio", color: "from-primary to-teal-400" };
}

function getNextMilestone(days: number): number | null {
  return STREAK_MILESTONES.find((m) => m > days) ?? null;
}

const DailyStreakPopup = ({ streakDays, open, onClose }: DailyStreakPopupProps) => {
  const [animatedDays, setAnimatedDays] = useState(0);
  const badge = getBadge(streakDays);
  const nextMilestone = getNextMilestone(streakDays);

  useEffect(() => {
    if (!open) return;
    setAnimatedDays(0);
    const steps = Math.min(streakDays, 25);
    const increment = streakDays / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= streakDays) {
        setAnimatedDays(streakDays);
        clearInterval(interval);
      } else {
        setAnimatedDays(Math.round(current));
      }
    }, 40);
    return () => clearInterval(interval);
  }, [open, streakDays]);

  const shareText = `🔥 ¡Llevo ${streakDays} días seguidos aprendiendo español con SpanischMitBelu! ${badge.emoji} Badge: ${badge.label}. ¿Te animas?`;
  const shareUrl = "https://app.spanischmitbelu.com";

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "💬",
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank"),
    },
    {
      name: "Facebook",
      icon: "📘",
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank"),
    },
    {
      name: "X",
      icon: "𝕏",
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      name: "Copiar",
      icon: "📋",
      onClick: () => navigator.clipboard.writeText(shareText + " " + shareUrl),
    },
  ];

  // Streak dots (last 7 days visualization)
  const dots = Array.from({ length: 7 }, (_, i) => i < streakDays);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none bg-card p-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Racha diaria</DialogTitle>

        {/* Gradient header */}
        <div className={`relative flex flex-col items-center bg-gradient-to-br ${badge.color} px-6 pb-8 pt-10`}>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badge */}
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-5xl backdrop-blur-sm ring-4 ring-white/30">
            {badge.emoji}
          </div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/80">
            {badge.label}
          </p>

          {/* Animated day count */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl font-extrabold text-white drop-shadow-lg">
              {animatedDays}
            </span>
            <span className="text-lg font-semibold text-white/80">
              {streakDays === 1 ? "día" : "días"}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-white/70">de racha consecutiva</p>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 pb-6 pt-5">
          {/* Last 7 days dots */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground">Últimos 7 días</p>
            <div className="flex gap-2">
              {dots.map((active, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {active ? <Flame className="h-4 w-4" /> : i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Next milestone */}
          {nextMilestone && (
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Próximo badge en{" "}
                <span className="font-bold text-foreground">{nextMilestone - streakDays} días</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${Math.min((streakDays / nextMilestone) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Share section */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
              <Share2 className="h-4 w-4 text-primary" />
              Comparte tu racha
            </div>
            <div className="grid grid-cols-4 gap-2">
              {shareOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={opt.onClick}
                  className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <span className="text-xl">{opt.icon}</span>
                  {opt.name}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            ¡A seguir aprendiendo! 🚀
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyStreakPopup;
