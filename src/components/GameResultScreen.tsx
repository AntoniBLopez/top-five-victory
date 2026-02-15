import { Trophy, Star, Zap, ArrowRight, RotateCcw, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RankingEntry {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface GameResultScreenProps {
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  gameType: string;
  ranking: RankingEntry[];
  currentUserRank?: RankingEntry;
  onPlayAgain?: () => void;
  onContinue?: () => void;
}

const MEDAL_STYLES: Record<number, { bg: string; text: string; border: string; icon: string }> = {
  1: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/30", icon: "🥇" },
  2: { bg: "bg-silver/10", text: "text-silver", border: "border-silver/30", icon: "🥈" },
  3: { bg: "bg-bronze/10", text: "text-bronze", border: "border-bronze/30", icon: "🥉" },
};

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 604800000;
  return Math.ceil((diff / oneWeek) + 1);
}

const GameResultScreen = ({
  xpEarned,
  correctAnswers,
  totalQuestions,
  gameType,
  ranking,
  currentUserRank,
  onPlayAgain,
  onContinue,
}: GameResultScreenProps) => {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [showRanking, setShowRanking] = useState(false);
  const navigate = useNavigate();
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const weekNumber = getCurrentWeekNumber();

  useEffect(() => {
    const duration = 1200;
    const steps = 30;
    const increment = xpEarned / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setAnimatedXp(xpEarned);
        clearInterval(interval);
      } else {
        setAnimatedXp(Math.round(current));
      }
    }, duration / steps);
    const timer = setTimeout(() => setShowRanking(true), 800);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [xpEarned]);

  const getResultMessage = () => {
    if (percentage === 100) return "¡Perfecto! 🎉";
    if (percentage >= 80) return "¡Excelente! 🌟";
    if (percentage >= 60) return "¡Muy bien! 💪";
    if (percentage >= 40) return "¡Sigue practicando! 📚";
    return "¡No te rindas! 🔥";
  };

  const userInTop5 = ranking.some((e) => e.isCurrentUser);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      {percentage >= 80 && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}px`,
                animationDelay: `${Math.random() * 1.5}s`,
                fontSize: `${12 + Math.random() * 12}px`,
              }}
            >
              {["🎉", "⭐", "✨", "🌟"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="animate-scale-in text-center">
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {gameType}
          </p>
          <h1 className="text-3xl font-extrabold text-foreground">{getResultMessage()}</h1>
          <p className="mt-2 text-muted-foreground">
            {correctAnswers}/{totalQuestions} correctas
          </p>
        </div>

        {/* XP Card */}
        <div className="animate-xp-count rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center" style={{ animationDelay: "0.3s" }}>
          <div className="mb-1 flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 text-primary" fill="currentColor" />
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">XP Ganados</span>
          </div>
          <p className="text-5xl font-extrabold text-primary">+{animatedXp}</p>
        </div>

        {/* Progress */}
        <div className="animate-slide-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progreso</span>
            <span className="font-semibold text-foreground">{percentage}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        {/* Weekly Ranking Preview */}
        {showRanking && (
          <div className="animate-slide-up space-y-3" style={{ opacity: 0, animationDelay: "0s" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground">Top 5</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Semana {weekNumber}
              </span>
            </div>

            <div className="space-y-2">
              {ranking.slice(0, 5).map((entry, index) => {
                const medal = MEDAL_STYLES[entry.rank];
                const isTop3 = entry.rank <= 3;
                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      entry.isCurrentUser
                        ? "border-primary/30 bg-primary/5 shadow-sm shadow-primary/10"
                        : isTop3 && medal
                        ? `${medal.border} ${medal.bg}`
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                      {isTop3 && medal ? (
                        <span className="text-xl">{medal.icon}</span>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>
                      )}
                    </div>
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-lg">{entry.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`truncate text-sm font-semibold ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                        {entry.name}
                        {entry.isCurrentUser && <span className="ml-1.5 text-xs font-medium text-primary/70">(Tú)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" />
                      <span className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current user outside top 5 */}
            {!userInTop5 && currentUserRank && (
              <div className="relative mt-1">
                <div className="flex items-center justify-center gap-1 py-1 text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 shadow-sm shadow-primary/10">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                    <span className="text-sm font-bold text-primary">{currentUserRank.rank}</span>
                  </div>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">{currentUserRank.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">
                      {currentUserRank.name}
                      <span className="ml-1.5 text-xs font-medium text-primary/70">(Tú)</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" />
                    <span className="text-sm font-bold text-foreground">{currentUserRank.xp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Link to full ranking page */}
            <button
              onClick={() => navigate("/ranking")}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted group"
            >
              <span className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Ver ranking completo e historial
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 animate-slide-up" style={{ animationDelay: "1s", opacity: 0 }}>
          <button
            onClick={onPlayAgain}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
            Repetir
          </button>
          <button
            onClick={onContinue}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Continuar
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResultScreen;
