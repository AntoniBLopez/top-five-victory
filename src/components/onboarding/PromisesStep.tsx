import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, BarChart3, Brain, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromisesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PROMISES = [
  {
    icon: Brain,
    title: "Repaso inteligente",
    desc: "Nuestro algoritmo adapta las tarjetas a tu nivel y refuerza lo que más necesitas.",
  },
  {
    icon: BarChart3,
    title: "Progreso medible",
    desc: "Estadísticas detalladas para que veas cómo mejoras día a día.",
  },
  {
    icon: Sparkles,
    title: "Aprendizaje en contexto",
    desc: "Aprende conjugaciones dentro de frases reales, no listas aisladas.",
  },
  {
    icon: Shield,
    title: "Sin presión",
    desc: "Avanza a tu ritmo. Puedes cambiar tus objetivos cuando quieras.",
  },
];

const PromisesStep = ({ onNext, onBack }: PromisesStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    <div className="mb-2 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
      >
        <span className="text-4xl">🚀</span>
      </motion.div>
      <h2 className="text-xl font-extrabold text-foreground">Lo que Smart Review hará por ti</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tu camino al dominio del español, paso a paso.
      </p>
    </div>

    <div className="mt-6 space-y-3">
      {PROMISES.map((promise, i) => (
        <motion.div
          key={promise.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1 }}
          className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <promise.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground">{promise.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{promise.desc}</p>
          </div>
        </motion.div>
      ))}
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

export default PromisesStep;
