import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, RotateCcw, ArrowRight } from "lucide-react";
import { EndGameScreenProps, GAME_TYPE_LABELS, GAME_TYPE_XP_MULTIPLIER } from "@/types/game";

function calculateXp(knownCount: number, learningCount: number, totalWords: number, durationSeconds: number, multiplier: number) {
  let baseXp = knownCount * 10 + learningCount * 4;
  if (totalWords >= 10 && knownCount === totalWords) baseXp += 20;
  const timeBonus = Math.min(30, Math.floor(durationSeconds / 60) * 5);
  baseXp += timeBonus;
  return Math.round(baseXp * multiplier);
}

const EndGameScreen = ({
  knownCount,
  learningCount,
  topicWords,
  restart,
  gameType = "multiplechoice",
  onGoHome,
}: EndGameScreenProps) => {
  const navigate = useNavigate();
  const totalWords = topicWords.length;
  const percentage = Math.round((knownCount / totalWords) * 100);
  const multiplier = GAME_TYPE_XP_MULTIPLIER[gameType];
  const xpEarned = calculateXp(knownCount, learningCount, totalWords, 120, multiplier);
  const [animatedXp, setAnimatedXp] = useState(0);

  useEffect(() => {
    const steps = 30;
    const increment = xpEarned / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= xpEarned) { setAnimatedXp(xpEarned); clearInterval(interval); }
      else setAnimatedXp(Math.round(current));
    }, 40);
    return () => clearInterval(interval);
  }, [xpEarned]);

  const getMessage = () => {
    if (percentage === 100) return "¡Perfecto! 🎉";
    if (percentage >= 80) return "¡Excelente! 🌟";
    if (percentage >= 60) return "¡Muy bien! 💪";
    if (percentage >= 40) return "¡Sigue practicando! 📚";
    return "¡No te rindas! 🔥";
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto px-4 py-6 md:gap-6 md:py-8">
      {/* Confetti */}
      {percentage >= 80 && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="absolute animate-confetti-fall"
              style={{ left: `${Math.random() * 100}%`, top: `-${Math.random() * 20}px`, animationDelay: `${Math.random() * 1.5}s`, fontSize: `${12 + Math.random() * 12}px` }}>
              {["🎉", "⭐", "✨", "🌟"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="animate-scale-in text-center">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary mb-2 md:text-xs md:mb-3">
          {GAME_TYPE_LABELS[gameType]}
        </span>
        <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">{getMessage()}</h1>
      </div>

      {/* XP Card */}
      <div className="w-full animate-xp-count rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center md:p-6" style={{ animationDelay: "0.3s" }}>
        <div className="mb-1 flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 text-primary md:h-5 md:w-5" fill="currentColor" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary md:text-sm">XP Ganados</span>
        </div>
        <p className="text-4xl font-extrabold text-primary md:text-5xl">+{animatedXp}</p>
        <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">Multiplicador ×{multiplier}</p>
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-3 gap-2 md:gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center md:p-4">
          <p className="text-xl font-extrabold text-primary md:text-2xl">{knownCount}</p>
          <p className="text-[10px] text-muted-foreground md:text-xs">Conocidas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center md:p-4">
          <p className="text-xl font-extrabold text-accent-foreground md:text-2xl">{learningCount}</p>
          <p className="text-[10px] text-muted-foreground md:text-xs">Aprendiendo</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center md:p-4">
          <p className="text-xl font-extrabold text-foreground md:text-2xl">{percentage}%</p>
          <p className="text-[10px] text-muted-foreground md:text-xs">Precisión</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted md:h-3">
          <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex gap-3 pt-1 md:pt-2">
        <button onClick={restart}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-muted active:scale-[0.97] transition-all md:py-3.5">
          <RotateCcw className="h-4 w-4" /> Repetir
        </button>
        <button onClick={onGoHome || (() => navigate("/games"))}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all md:py-3.5">
          Continuar <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EndGameScreen;
