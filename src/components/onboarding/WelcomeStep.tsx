import { motion } from "framer-motion";
import { ArrowRight, Target, Clock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => (
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
      Vamos a personalizar tu experiencia de aprendizaje en unos pocos pasos.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 w-full max-w-xs space-y-3"
    >
      {[
        { icon: Target, text: "Personalización inteligente" },
        { icon: Clock, text: "Configura tus objetivos" },
        { icon: Brain, text: "Repaso adaptado a tu nivel" },
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

export default WelcomeStep;
