import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalibrationCard } from "./CalibrationStep";

interface ResultsStepProps {
  results: { correct: boolean; card: CalibrationCard }[];
  level: string;
  dailyGoal: number;
  calibrationMode: "completed" | "skipped" | "quick_completed";
  onFinish: () => void;
}

const ResultsStep = ({ results, level, dailyGoal, calibrationMode, onFinish }: ResultsStepProps) => {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const tenseBreakdown = useMemo(() => {
    if (calibrationMode === "skipped") return [];
    const map: Record<string, { correct: number; total: number }> = {};
    for (const r of results) {
      const t = r.card.tense;
      if (!map[t]) map[t] = { correct: 0, total: 0 };
      map[t].total++;
      if (r.correct) map[t].correct++;
    }
    return Object.entries(map);
  }, [results, calibrationMode]);

  const weakPoints = useMemo(() => {
    if (calibrationMode === "skipped" || total === 0) return null;

    // Find weak tenses (< 50% accuracy)
    const tenseMap: Record<string, { correct: number; total: number }> = {};
    const pronounMap: Record<string, { correct: number; total: number }> = {};

    for (const r of results) {
      const t = r.card.tense;
      const p = r.card.pronoun;
      if (!tenseMap[t]) tenseMap[t] = { correct: 0, total: 0 };
      if (!pronounMap[p]) pronounMap[p] = { correct: 0, total: 0 };
      tenseMap[t].total++;
      pronounMap[p].total++;
      if (r.correct) {
        tenseMap[t].correct++;
        pronounMap[p].correct++;
      }
    }

    const weakTenses = Object.entries(tenseMap)
      .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.5)
      .map(([name]) => name);

    const weakPronouns = Object.entries(pronounMap)
      .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.5)
      .map(([name]) => name);

    if (weakTenses.length === 0 && weakPronouns.length === 0) return null;

    return { weakTenses, weakPronouns };
  }, [results, calibrationMode, total]);

  const levelEmoji = level === "advanced" ? "🏆" : level === "intermediate" ? "📈" : "🌱";
  const levelLabel = level === "advanced" ? "Avanzado" : level === "intermediate" ? "Intermedio" : "Principiante";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6"
    >
      <div className="mb-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
        >
          <span className="text-5xl">{levelEmoji}</span>
        </motion.div>

        {calibrationMode === "skipped" ? (
          <>
            <h2 className="text-2xl font-extrabold text-foreground">¡Todo listo!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Empezarás desde el nivel principiante. El sistema se adaptará a ti.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-foreground">Tu nivel: {levelLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {correct}/{total} correctas
            </p>
          </>
        )}
      </div>

      {calibrationMode !== "skipped" && (
        <>
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-card">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">{pct}%</p>
              <p className="text-[10px] font-bold text-muted-foreground">PRECISIÓN</p>
            </div>
          </div>

          {tenseBreakdown.length > 0 && (
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-extrabold text-foreground">Por tiempo verbal</h3>
              {tenseBreakdown.map(([tense, data]) => {
                const tensePct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={tense} className="rounded-2xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">{tense}</span>
                      <span className="text-xs font-bold text-muted-foreground">
                        {data.correct}/{data.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tensePct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {weakPoints && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 rounded-2xl border border-border bg-card p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-foreground">Puntos a reforzar</h3>
              </div>

              <div className="space-y-3">
                {weakPoints.weakTenses.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Tiempos débiles
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {weakPoints.weakTenses.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {weakPoints.weakPronouns.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Pronombres débiles
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {weakPoints.weakPronouns.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </>
      )}

      {weakPoints && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Recomendaciones</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {weakPoints.weakTenses.length > 0 && (
                  <>Empieza reforzando <span className="font-semibold text-foreground">{weakPoints.weakTenses[0]}</span>. </>
                )}
                {weakPoints.weakPronouns.length > 0 && (
                  <>Dedica 3 minutos extra a <span className="font-semibold text-foreground">{weakPoints.weakPronouns[0]}</span>.</>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mb-8 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Objetivo: {dailyGoal} cards/día</p>
            <p className="text-xs text-muted-foreground">
              Tu repaso se adaptará a tu nivel automáticamente
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onFinish}
        className="h-14 w-full rounded-2xl text-base font-extrabold gap-2"
      >
        <Sparkles className="h-5 w-5" /> Empezar a aprender
      </Button>
    </motion.div>
  );
};

export default ResultsStep;
