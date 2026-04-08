import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotificationsStepProps {
  onNext: (permission: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

const NotificationsStep = ({ onNext, onBack, onSkip }: NotificationsStepProps) => {
  const [requesting, setRequesting] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const savePreferences = (browserPermission: string) => {
    localStorage.setItem("smart_review_notification_permission", browserPermission);
    localStorage.setItem("smart_review_email_reminders", emailOptIn ? "enabled" : "disabled");
  };

  const handleEnable = async () => {
    setRequesting(true);
    try {
      if ("Notification" in window) {
        const result = await Notification.requestPermission();
        savePreferences(result);
        onNext(result);
      } else {
        savePreferences("error");
        onNext("error");
      }
    } catch {
      savePreferences("error");
      onNext("error");
    } finally {
      setRequesting(false);
    }
  };

  const handleDecline = () => {
    savePreferences("declined");
    onSkip();
  };

  return (
    <>
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
            El sistema de repaso espaciado funciona mejor con práctica diaria. Te avisaremos para que no pierdas tu racha.
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
              <span className="text-sm font-medium text-foreground">Notificaciones en el navegador</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
                <span className="text-lg">🔥</span>
              </div>
              <span className="text-sm font-medium text-foreground">Alertas para mantener tu racha</span>
            </div>

            {/* Email opt-in */}
            <label
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 cursor-pointer select-none text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">Recordatorio diario por email</span>
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                  FSRS te notifica por email en el momento óptimo de repasar
                </p>
              </div>
              <Checkbox
                checked={emailOptIn}
                onCheckedChange={(v) => setEmailOptIn(v === true)}
                className="mt-2.5"
              />
            </label>
          </motion.div>

          {/* Upcoming mobile app teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2.5 max-w-xs"
          >
            <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-snug text-left">
              <span className="font-semibold text-foreground">Próximamente:</span> app móvil con notificaciones push directas, sin necesidad de email.
            </p>
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
            onClick={() => setShowConfirm(true)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Ahora no
          </button>
        </div>

      </motion.div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Saltar los recordatorios?</AlertDialogTitle>
            <AlertDialogDescription>
              Para que FSRS funcione bien, necesitamos avisarte cuando es el momento de repasar. ¿Quieres activar los recordatorios diarios?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDecline}>No, gracias</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnable}>Sí, activar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationsStep;
