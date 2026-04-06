import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsStepProps {
  onNext: (permission: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

const NotificationsStep = ({ onNext, onBack, onSkip }: NotificationsStepProps) => {
  const [requesting, setRequesting] = useState(false);

  const handleEnable = async () => {
    setRequesting(true);
    try {
      if ("Notification" in window) {
        const result = await Notification.requestPermission();
        localStorage.setItem("smart_review_notification_permission", result);
        onNext(result);
      } else {
        localStorage.setItem("smart_review_notification_permission", "error");
        onNext("error");
      }
    } catch {
      localStorage.setItem("smart_review_notification_permission", "error");
      onNext("error");
    } finally {
      setRequesting(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem("smart_review_notification_permission", "declined");
    onSkip();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="px-6"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
        >
          <Bell className="h-12 w-12 text-primary" />
        </motion.div>

        <h2 className="text-xl font-extrabold text-foreground">¿Activar recordatorios?</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
          Te enviaremos un recordatorio diario para que no pierdas tu racha de aprendizaje.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 w-full max-w-xs space-y-3"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Recordatorio de repaso diario</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <span className="text-lg">🔥</span>
            </div>
            <span className="text-sm font-medium text-foreground">Alertas para mantener tu racha</span>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          onClick={handleEnable}
          disabled={requesting}
          className="h-14 w-full rounded-2xl text-base font-extrabold gap-2"
        >
          <Bell className="h-5 w-5" /> Activar notificaciones
        </Button>
        <button
          onClick={handleDecline}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Ahora no
        </button>
      </div>

      <div className="mt-4 flex justify-start">
        <Button variant="ghost" onClick={onBack} className="h-10 rounded-2xl font-bold gap-1 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationsStep;
