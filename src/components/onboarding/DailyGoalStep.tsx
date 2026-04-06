import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DAILY_GOALS = [
  { cards: 10, label: "Relajado", emoji: "🌿", desc: "10 cards/día", minutes: 5 },
  { cards: 20, label: "Regular", emoji: "📚", desc: "20 cards/día", minutes: 10 },
  { cards: 40, label: "Intenso", emoji: "🔥", desc: "40 cards/día", minutes: 20 },
  { cards: 60, label: "Hardcore", emoji: "⚡", desc: "60 cards/día", minutes: 30 },
];

interface DailyGoalStepProps {
  selected: number;
  onSelect: (cards: number, minutes: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const DailyGoalStep = ({ selected, onSelect, onNext, onBack }: DailyGoalStepProps) => (
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

export default DailyGoalStep;
