import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, BrainCircuit, TrendingUp, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemoryScienceStepProps {
  onNext: () => void;
  onBack: () => void;
}

const FORGETTING_CURVE = [
  { day: "Hoy", retention: 100 },
  { day: "1d", retention: 42 },
  { day: "3d", retention: 28 },
  { day: "7d", retention: 18 },
  { day: "14d", retention: 12 },
  { day: "30d", retention: 8 },
];

const FSRS_CURVE = [
  { day: "Hoy", retention: 100 },
  { day: "1d", retention: 95 },
  { day: "3d", retention: 92 },
  { day: "7d", retention: 90 },
  { day: "14d", retention: 89 },
  { day: "30d", retention: 88 },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Algoritmo FSRS",
    desc: "El mismo motor de memoria usado por millones de estudiantes. Predice exactamente cuándo vas a olvidar.",
  },
  {
    icon: RefreshCw,
    title: "Repaso en el momento justo",
    desc: "Te pregunta justo antes de que olvides. Cada repaso refuerza la memoria y extiende el intervalo.",
  },
  {
    icon: TrendingUp,
    title: "Se adapta a ti",
    desc: "Analiza tus aciertos, errores y tiempos para crear un modelo único de tu memoria.",
  },
  {
    icon: Zap,
    title: "Contexto real, no listas",
    desc: "Practica conjugaciones dentro de frases reales para transferencia directa al habla.",
  },
];

const MemoryScienceStep = ({ onNext, onBack }: MemoryScienceStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    {/* Header */}
    <div className="mb-2 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10"
      >
        <BrainCircuit className="h-10 w-10 text-primary" />
      </motion.div>
      <h2 className="text-xl font-extrabold text-foreground">
        Memoria que perdura a largo plazo
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No es memorización bruta. Es ciencia aplicada a tu aprendizaje.
      </p>
    </div>

    {/* Forgetting curve visualization */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-5 rounded-2xl border border-border bg-card p-4"
    >
      <p className="mb-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Curva del olvido vs Smart Review
      </p>
      <div className="flex items-end justify-between gap-1 h-28">
        {FORGETTING_CURVE.map((point, i) => (
          <div key={`forget-${i}`} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full gap-0.5 items-end justify-center" style={{ height: '80px' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${point.retention}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                className="w-3 rounded-t-sm bg-destructive/30"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${FSRS_CURVE[i].retention}%` }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                className="w-3 rounded-t-sm bg-primary"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{point.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-destructive/30" />
          <span className="text-[10px] text-muted-foreground">Sin repaso</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground">Con Smart Review</span>
        </div>
      </div>
    </motion.div>

    {/* Key features */}
    <div className="mt-4 space-y-2.5">
      {FEATURES.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
          className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <feature.icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground">{feature.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Stat pill */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="mt-4 text-center"
    >
      <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        Retención &gt;88% comprobada · Basado en +200 estudios científicos
      </span>
    </motion.div>

    {/* Navigation */}
    <div className="mt-6 flex gap-3">
      <Button variant="outline" onClick={onBack} className="h-12 flex-1 rounded-2xl font-bold gap-1">
        <ArrowLeft className="h-4 w-4" /> Atrás
      </Button>
      <Button onClick={onNext} className="h-12 flex-[2] rounded-2xl font-extrabold gap-1">
        Siguiente <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

export default MemoryScienceStep;
