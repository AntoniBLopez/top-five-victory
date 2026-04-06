import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface CalibrationCard {
  id: number;
  verb: string;
  pronoun: string;
  tense: string;
  answer: string;
  prompt: string;
}

interface CalibrationStepProps {
  cards: CalibrationCard[];
  currentIndex: number;
  userAnswer: string;
  showFeedback: boolean;
  isCorrect: boolean | null;
  onAnswer: () => void;
  onChange: (val: string) => void;
  onSkip: () => void;
  onBack: () => void;
  onSkipAll: () => void;
  totalCards: number;
}

const CalibrationStep = ({
  cards,
  currentIndex,
  userAnswer,
  showFeedback,
  isCorrect,
  onAnswer,
  onChange,
  onSkip,
  onBack,
  onSkipAll,
  totalCards,
}: CalibrationStepProps) => {
  const card = cards[currentIndex];
  if (!card) return null;
  const progress = (currentIndex / totalCards) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6"
    >
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentIndex === 0 && !showFeedback && (
              <button
                onClick={onBack}
                className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <span className="text-xs font-bold text-muted-foreground">
              {currentIndex + 1} / {totalCards}
            </span>
          </div>
          <span className="text-xs font-bold text-primary">Test de calibración</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {card.tense}
            </span>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-foreground">{card.verb}</p>
            <p className="mt-2 text-lg text-muted-foreground">{card.pronoun}</p>
          </div>

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

          {!showFeedback && (
            <button
              onClick={onSkipAll}
              className="mx-auto mt-4 block text-xs text-muted-foreground/70 underline-offset-2 transition-colors hover:text-muted-foreground hover:underline"
            >
              Omitir test de calibración
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default CalibrationStep;
