import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Brain,
  Flame,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CONJUGATION_BY_TENSE } from "@/data/mockConjugations";
import { WordsArray } from "@/types/game";

// ── Types ──
interface CalibrationCard {
  id: number;
  verb: string;
  pronoun: string;
  tense: string;
  answer: string;
  prompt: string;
}

interface OnboardingState {
  dailyGoal: number;
  dailyMinutes: number;
  level: "beginner" | "intermediate" | "advanced" | null;
  calibrationResults: { correct: boolean; card: CalibrationCard }[];
  onboardingComplete: boolean;
}

type Step = "welcome" | "goals" | "calibration" | "results";

// ── Build calibration deck ──
function buildCalibrationDeck(): CalibrationCard[] {
  const allCards: CalibrationCard[] = [];
  let id = 0;

  const tenseKeys = ["prasens", "prateritum", "perfekt"] as const;
  const tenseLabels: Record<string, string> = {
    prasens: "Präsens",
    prateritum: "Präteritum",
    perfekt: "Perfekt",
  };

  for (const tenseKey of tenseKeys) {
    const words: WordsArray[] = CONJUGATION_BY_TENSE[tenseKey] || [];
    for (const [prompt, form] of words) {
      const match = prompt.match(/^(.+?)\s*—\s*(.+?)\s*\(/);
      if (!match) continue;
      allCards.push({
        id: id++,
        verb: match[1].trim(),
        pronoun: match[2].trim(),
        tense: tenseLabels[tenseKey],
        answer: form,
        prompt,
      });
    }
  }

  // Shuffle and take 24 cards (8 per tense ideally)
  const shuffled = allCards.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 24);
}

// ── Goal Options ──
const DAILY_GOALS = [
  { cards: 10, label: "Relajado", emoji: "🌿", desc: "10 cards/día", minutes: 5 },
  { cards: 20, label: "Regular", emoji: "📚", desc: "20 cards/día", minutes: 10 },
  { cards: 40, label: "Intenso", emoji: "🔥", desc: "40 cards/día", minutes: 20 },
  { cards: 60, label: "Hardcore", emoji: "⚡", desc: "60 cards/día", minutes: 30 },
];

// ── Step Components ──

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center px-6 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-primary/10"
    >
      <span className="text-6xl">🧠</span>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-3xl font-extrabold text-foreground"
    >
      ¡Bienvenido a{" "}
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Smart Review
      </span>
      !
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-4 max-w-sm text-base text-muted-foreground leading-relaxed"
    >
      Vamos a calibrar tu nivel con un test rápido y configurar tus objetivos
      diarios para maximizar tu aprendizaje.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 w-full max-w-xs space-y-3"
    >
      {[
        { icon: Target, text: "Test de calibración (~3 min)" },
        { icon: Clock, text: "Configura tus objetivos" },
        { icon: Brain, text: "Repaso inteligente personalizado" },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <item.icon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">{item.text}</span>
        </div>
      ))}
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="mt-10 w-full max-w-xs"
    >
      <Button
        onClick={onNext}
        className="h-14 w-full rounded-2xl text-base font-extrabold gap-2"
      >
        Comenzar <ArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  </motion.div>
);

const GoalsStep = ({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: number;
  onSelect: (cards: number, minutes: number) => void;
  onNext: () => void;
  onBack: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    <div className="mb-2 flex items-center gap-2">
      <Clock className="h-5 w-5 text-primary" />
      <h2 className="text-xl font-extrabold text-foreground">Tu objetivo diario</h2>
    </div>
    <p className="mb-6 text-sm text-muted-foreground">
      ¿Cuánto tiempo quieres dedicar cada día?
    </p>

    <div className="space-y-3">
      {DAILY_GOALS.map((goal) => {
        const isSelected = selected === goal.cards;
        return (
          <motion.button
            key={goal.cards}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(goal.cards, goal.minutes)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <span className="text-3xl">{goal.emoji}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-extrabold text-foreground">{goal.label}</p>
              <p className="text-xs text-muted-foreground">{goal.desc} · ~{goal.minutes} min</p>
            </div>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary"
              >
                <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>

    <div className="mt-8 flex gap-3">
      <Button variant="outline" onClick={onBack} className="h-12 flex-1 rounded-2xl font-bold gap-1">
        <ArrowLeft className="h-4 w-4" /> Atrás
      </Button>
      <Button onClick={onNext} className="h-12 flex-[2] rounded-2xl font-extrabold gap-1">
        Siguiente <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

const CalibrationStep = ({
  cards,
  currentIndex,
  userAnswer,
  showFeedback,
  isCorrect,
  onAnswer,
  onChange,
  onSkip,
  totalCards,
}: {
  cards: CalibrationCard[];
  currentIndex: number;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean | null;
  onAnswer: () => void;
  onChange: (val: string) => void;
  onSkip: () => void;
  totalCards: number;
}) => {
  const card = cards[currentIndex];
  if (!card) return null;
  const progress = ((currentIndex) / totalCards) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6"
    >
      {/* Back + Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          {currentIndex === 0 && !showFeedback ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Atrás
            </button>
          ) : (
            <span className="text-xs font-bold text-muted-foreground">
              {currentIndex + 1} / {totalCards}
            </span>
          )}
          <span className="text-xs font-bold text-primary">Test de calibración</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Tense badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {card.tense}
            </span>
          </div>

          {/* Verb + pronoun */}
          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{card.verb}</p>
            <p className="mt-2 text-lg text-muted-foreground">{card.pronoun}</p>
          </div>

          {/* Input */}
          <div className="mx-auto max-w-sm">
            <div
              className={`relative rounded-2xl border-2 transition-all ${
                showFeedback
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-destructive bg-destructive/5"
                  : "border-border bg-card focus-within:border-primary"
              }`}
            >
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && userAnswer.trim()) onAnswer();
                }}
                placeholder="Escribe la conjugación…"
                disabled={showFeedback}
                autoFocus
                className="w-full rounded-2xl bg-transparent px-5 py-4 text-center text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-70"
              />
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-center"
                >
                  {isCorrect ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-bold">¡Correcto!</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-destructive">Incorrecto</p>
                      <p className="text-sm text-muted-foreground">
                        Respuesta correcta:{" "}
                        <span className="font-extrabold text-foreground">{card.answer}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              className="h-12 flex-1 rounded-2xl font-bold text-sm"
            >
              {showFeedback ? "Siguiente" : "No lo sé"}
            </Button>
            {!showFeedback && (
              <Button
                onClick={onAnswer}
                disabled={!userAnswer.trim()}
                className="h-12 flex-[2] rounded-2xl font-extrabold text-sm gap-1"
              >
                Comprobar <Zap className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const ResultsStep = ({
  results,
  level,
  dailyGoal,
  onFinish,
}: {
  results: { correct: boolean; card: CalibrationCard }[];
  level: string;
  dailyGoal: number;
  onFinish: () => void;
}) => {
  const correct = results.filter((r) => r.correct).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  const tenseBreakdown = useMemo(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    for (const r of results) {
      const t = r.card.tense;
      if (!map[t]) map[t] = { correct: 0, total: 0 };
      map[t].total++;
      if (r.correct) map[t].correct++;
    }
    return Object.entries(map);
  }, [results]);

  const levelEmoji = level === "advanced" ? "🏆" : level === "intermediate" ? "📈" : "🌱";
  const levelLabel = level === "advanced" ? "Avanzado" : level === "intermediate" ? "Intermedio" : "Principiante";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="px-6"
    >
      {/* Level badge */}
      <div className="mb-6 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
        >
          <span className="text-5xl">{levelEmoji}</span>
        </motion.div>
        <h2 className="text-2xl font-extrabold text-foreground">Tu nivel: {levelLabel}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {pct}% de precisión · {correct}/{total} correctas
        </p>
      </div>

      {/* Score ring */}
      <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-card">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-primary">{pct}%</p>
          <p className="text-[10px] font-bold text-muted-foreground">PRECISIÓN</p>
        </div>
      </div>

      {/* Tense breakdown */}
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

      {/* Settings summary */}
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

// ── Main Onboarding Page ──
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [state, setState] = useState<OnboardingState>({
    dailyGoal: 20,
    dailyMinutes: 10,
    level: null,
    calibrationResults: [],
    onboardingComplete: false,
  });

  const calibrationDeck = useMemo(buildCalibrationDeck, []);
  const [cardIndex, setCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = useCallback(() => {
    if (showFeedback) return;
    const card = calibrationDeck[cardIndex];
    const correct = userAnswer.trim().toLowerCase() === card.answer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);

    setState((prev) => ({
      ...prev,
      calibrationResults: [...prev.calibrationResults, { correct, card }],
    }));

    // Auto-advance after delay
    setTimeout(() => {
      advanceCard();
    }, 1500);
  }, [userAnswer, cardIndex, calibrationDeck, showFeedback]);

  const advanceCard = useCallback(() => {
    if (cardIndex + 1 >= calibrationDeck.length) {
      // Calculate level
      const results = [...state.calibrationResults];
      // Include current if not yet added
      const correctCount = results.filter((r) => r.correct).length;
      const pct = (correctCount / results.length) * 100;
      const level = pct >= 70 ? "advanced" : pct >= 40 ? "intermediate" : "beginner";
      setState((prev) => ({ ...prev, level }));
      setStep("results");
    } else {
      setCardIndex((i) => i + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(null);
    }
  }, [cardIndex, calibrationDeck.length, state.calibrationResults]);

  const handleSkip = useCallback(() => {
    if (showFeedback) {
      advanceCard();
      return;
    }
    const card = calibrationDeck[cardIndex];
    setState((prev) => ({
      ...prev,
      calibrationResults: [...prev.calibrationResults, { correct: false, card }],
    }));
    setIsCorrect(false);
    setShowFeedback(true);
    setTimeout(() => advanceCard(), 1200);
  }, [showFeedback, cardIndex, calibrationDeck, advanceCard]);

  const handleFinish = () => {
    localStorage.setItem(
      "onboarding",
      JSON.stringify({
        dailyGoal: state.dailyGoal,
        dailyMinutes: state.dailyMinutes,
        level: state.level,
        completedAt: new Date().toISOString(),
      })
    );
    // Clear streak session flag so it shows on first dashboard visit
    sessionStorage.removeItem("streak_shown_conj");
    navigate("/conjugations", { replace: true });
  };

  const STEPS: Step[] = ["welcome", "goals", "calibration", "results"];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Step indicators */}
      {step !== "welcome" && (
        <div className="flex justify-center gap-2 px-6 pt-6 pb-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= stepIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <WelcomeStep key="welcome" onNext={() => setStep("goals")} />
          )}
          {step === "goals" && (
            <GoalsStep
              key="goals"
              selected={state.dailyGoal}
              onSelect={(cards, minutes) =>
                setState((prev) => ({ ...prev, dailyGoal: cards, dailyMinutes: minutes }))
              }
              onNext={() => setStep("calibration")}
              onBack={() => setStep("welcome")}
            />
          )}
          {step === "calibration" && (
            <CalibrationStep
              key="calibration"
              cards={calibrationDeck}
              currentIndex={cardIndex}
              userAnswer={userAnswer}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onAnswer={handleAnswer}
              onChange={setUserAnswer}
              onSkip={handleSkip}
              onBack={() => setStep("goals")}
              totalCards={calibrationDeck.length}
            />
          )}
          {step === "results" && (
            <ResultsStep
              key="results"
              results={state.calibrationResults}
              level={state.level || "beginner"}
              dailyGoal={state.dailyGoal}
              onFinish={handleFinish}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
