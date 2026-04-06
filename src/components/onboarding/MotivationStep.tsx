import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MotivationId = "education" | "career" | "travel" | "connect" | "fun" | "other";

export interface MotivationOption {
  id: MotivationId;
  label: string;
  emoji: string;
}

export const MOTIVATION_OPTIONS: MotivationOption[] = [
  { id: "education", label: "Apoyar mis estudios", emoji: "📚" },
  { id: "career", label: "Impulsar mi carrera", emoji: "💼" },
  { id: "travel", label: "Prepararme para viajar", emoji: "✈️" },
  { id: "connect", label: "Conectar con más personas", emoji: "🤝" },
  { id: "fun", label: "Aprender por diversión", emoji: "🎉" },
  { id: "other", label: "Otro", emoji: "💡" },
];

interface MotivationStepProps {
  selected: MotivationId | null;
  onSelect: (id: MotivationId) => void;
  onNext: () => void;
  onBack: () => void;
}

const MotivationStep = ({ selected, onSelect, onNext, onBack }: MotivationStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    <div className="mb-2 flex items-center gap-2">
      <span className="text-2xl">🎯</span>
      <h2 className="text-xl font-extrabold text-foreground">¿Para qué quieres aprender español?</h2>
    </div>
    <p className="mb-6 text-sm text-muted-foreground">
      Esto nos ayuda a personalizar tu experiencia.
    </p>

    <div className="space-y-3">
      {MOTIVATION_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.id)}
            className={`flex w-full items-center gap-4 rounded-2xl border-2 p-5 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-extrabold text-foreground">{opt.label}</p>
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
      <Button onClick={onNext} disabled={!selected} className="h-12 flex-[2] rounded-2xl font-extrabold gap-1">
        Siguiente <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

export default MotivationStep;
