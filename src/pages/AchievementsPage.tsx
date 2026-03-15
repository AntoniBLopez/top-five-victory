import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  getAchievementProgress,
  getUserLevel,
  loadContext,
  TIER_STYLES,
} from "@/lib/achievements";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  streak: { label: "Racha", emoji: "🔥" },
  volume: { label: "Volumen", emoji: "📚" },
  mastery: { label: "Maestría", emoji: "🌳" },
  accuracy: { label: "Precisión", emoji: "🎯" },
  speed: { label: "Sesiones", emoji: "⭐" },
};

const AchievementsPage = () => {
  const navigate = useNavigate();
  const progress = useMemo(() => getAchievementProgress(), []);
  const ctx = useMemo(() => loadContext(), []);
  const level = useMemo(() => getUserLevel(ctx), [ctx]);

  const unlockedCount = progress.filter((p) => p.unlocked).length;
  const totalCount = progress.length;

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof progress>();
    for (const p of progress) {
      const cat = p.achievement.category;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return Array.from(map.entries());
  }, [progress]);

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-foreground">Logros</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-6 pb-8 space-y-6">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground"
        >
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Star className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold">Nivel {level.level}</p>
                  <p className="text-sm font-medium text-white/80">{level.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold">{ctx.totalXP}</p>
                <p className="text-xs font-medium text-white/70">XP total</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-white/70">
                <span>Nivel {level.level}</span>
                <span>{level.xpInLevel}/{level.xpForNext} XP</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (level.xpInLevel / level.xpForNext) * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full bg-white/90"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-foreground">Logros desbloqueados</span>
          </div>
          <span className="text-sm font-extrabold text-primary">{unlockedCount}/{totalCount}</span>
        </motion.div>

        {/* Categories */}
        {grouped.map(([category, items], gi) => {
          const catInfo = CATEGORY_LABELS[category] || { label: category, emoji: "📋" };
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + gi * 0.05 }}
            >
              <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
                <span>{catInfo.emoji}</span> {catInfo.label}
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const tier = TIER_STYLES[item.achievement.tier];
                  return (
                    <div
                      key={item.achievement.id}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                        item.unlocked
                          ? `${tier.bg} ${tier.border}`
                          : "border-border bg-card opacity-60"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                          item.unlocked ? "bg-white/60 dark:bg-white/10" : "bg-muted"
                        }`}
                      >
                        {item.unlocked ? item.achievement.emoji : <Lock className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${item.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                            {item.achievement.title}
                          </p>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.border} ${tier.text}`}>
                            {item.achievement.tier === "bronze" ? "B" : item.achievement.tier === "silver" ? "S" : item.achievement.tier === "gold" ? "G" : "D"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.achievement.description}</p>
                        {!item.unlocked && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary/50 transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">{item.progress}%</span>
                          </div>
                        )}
                        {item.unlocked && item.unlockedAt && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Desbloqueado el {new Date(item.unlockedAt).toLocaleDateString("es")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default AchievementsPage;
