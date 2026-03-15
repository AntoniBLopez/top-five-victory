import { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type Achievement, TIER_STYLES, markAchievementSeen } from "@/lib/achievements";

interface Props {
  achievements: Achievement[];
  onClose: () => void;
}

const CONFETTI_COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE", "#82E0AA"];

const AchievementUnlockPopup = ({ achievements, onClose }: Props) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showReveal, setShowReveal] = useState(false);

  const current = achievements[currentIdx];
  const tier = current ? TIER_STYLES[current.tier] : TIER_STYLES.bronze;
  const isLast = currentIdx >= achievements.length - 1;

  useEffect(() => {
    setShowReveal(false);
    const t = setTimeout(() => setShowReveal(true), 400);
    return () => clearTimeout(t);
  }, [currentIdx]);

  useEffect(() => {
    // Mark all as seen when popup closes
    return () => {
      achievements.forEach((a) => markAchievementSeen(a.id));
    };
  }, [achievements]);

  if (!current) return null;

  const confetti = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    duration: `${1.5 + Math.random() * 1.2}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 4 + Math.random() * 5,
  }));

  const handleNext = () => {
    markAchievementSeen(current.id);
    if (isLast) {
      onClose();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const tierGradients: Record<string, string> = {
    bronze: "from-orange-500 to-amber-400",
    silver: "from-slate-400 to-slate-300",
    gold: "from-yellow-500 to-amber-400",
    diamond: "from-cyan-400 to-blue-500",
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none bg-card p-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Logro desbloqueado</DialogTitle>

        {/* Gradient header */}
        <div className={`relative flex flex-col items-center bg-gradient-to-br ${tierGradients[current.tier]} px-6 pb-8 pt-10 overflow-hidden`}>
          {/* Confetti */}
          {confetti.map((p) => (
            <div
              key={p.id}
              className="absolute top-0 animate-[confetti-fall_var(--dur)_ease-out_var(--delay)_forwards] opacity-0"
              style={{
                left: p.left,
                "--delay": p.delay,
                "--dur": p.duration,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                transform: `rotate(${Math.random() * 360}deg)`,
              } as React.CSSProperties}
            />
          ))}

          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badge */}
          <div className="mb-3 flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
            <Trophy className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">¡Logro desbloqueado!</span>
          </div>

          <div
            className={`mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl backdrop-blur-sm ring-4 ring-white/30 transition-all duration-700 ${
              showReveal ? "scale-110 ring-8 ring-white/50 shadow-[0_0_40px_rgba(255,255,255,0.4)]" : "scale-75 opacity-0"
            }`}
          >
            {current.emoji}
          </div>

          <h2 className={`text-xl font-extrabold text-white transition-all duration-500 ${showReveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {current.title}
          </h2>
          <p className={`mt-1 text-sm font-medium text-white/80 transition-all duration-500 delay-100 ${showReveal ? "opacity-100" : "opacity-0"}`}>
            {current.description}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 pb-6 pt-5">
          {/* Tier badge */}
          <div className="flex justify-center">
            <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider border ${tier.bg} ${tier.border} ${tier.text}`}>
              {current.tier === "bronze" ? "Bronce" : current.tier === "silver" ? "Plata" : current.tier === "gold" ? "Oro" : "Diamante"}
            </span>
          </div>

          {/* Counter */}
          {achievements.length > 1 && (
            <p className="text-center text-xs text-muted-foreground">
              {currentIdx + 1} de {achievements.length} logros nuevos
            </p>
          )}

          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {isLast ? "¡Genial! 🎉" : "Siguiente logro →"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementUnlockPopup;
