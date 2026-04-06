import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SelfAssessmentId =
  | "new_to_language"
  | "some_common_words"
  | "basic_conversations"
  | "various_topics"
  | "detailed_discussions";

export interface SelfAssessmentOption {
  id: SelfAssessmentId;
  label: string;
  emoji: string;
  desc: string;
}

export const SELF_ASSESSMENT_OPTIONS: SelfAssessmentOption[] = [
  { id: "new_to_language", label: "Soy nuevo en español", emoji: "🌱", desc: "No tengo conocimientos previos" },
  { id: "some_common_words", label: "Conozco algunas palabras comunes", emoji: "📝", desc: "Sé palabras básicas como hola, gracias..." },
  { id: "basic_conversations", label: "Puedo tener conversaciones básicas", emoji: "💬", desc: "Me presento y hago preguntas simples" },
  { id: "various_topics", label: "Puedo hablar de varios temas", emoji: "🗣️", desc: "Mantengo conversaciones cotidianas" },
  { id: "detailed_discussions", label: "Puedo hablar en detalle", emoji: "🎓", desc: "Discuto casi cualquier tema con fluidez" },
];

interface SelfAssessmentStepProps {
  selected: SelfAssessmentId | null;
  onSelect: (id: SelfAssessmentId) => void;
  onNext: () => void;
  onBack: () => void;
}

const SelfAssessmentStep = ({ selected, onSelect, onNext, onBack }: SelfAssessmentStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    <div className="mb-2 flex items-center gap-2">
      <span className="text-2xl">📊</span>
      <h2 className="text-xl font-extrabold text-foreground">¿Cuánto español sabes?</h2>
    </div>
    <p className="mb-6 text-sm text-muted-foreground">
      Selecciona el nivel que mejor te describa.
    </p>

    <div className="space-y-3">
      {SELF_ASSESSMENT_OPTIONS.map((opt) => {
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
            <span className="text-2xl">{opt.emoji}</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-extrabold text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
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

export default SelfAssessmentStep;
