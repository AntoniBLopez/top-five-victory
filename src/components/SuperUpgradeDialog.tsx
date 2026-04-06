import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Check, Crown, Lock, Bell, CheckCircle2 } from "lucide-react";

interface SuperUpgradeDialogProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  { name: "Contenido de aprendizaje", free: true, super: true },
  { name: "Vidas ilimitadas", free: false, super: true },
  { name: "Práctica avanzada", free: false, super: true },
  { name: "Repaso de errores", free: false, super: true },
  { name: "Desafíos exclusivos", free: false, super: true },
  { name: "Sin anuncios", free: false, super: true },
];

const TIMELINE = [
  {
    icon: Lock,
    title: "Hoy",
    desc: "Desbloquea acceso completo a todas las funciones Super",
  },
  {
    icon: Bell,
    title: "Día 5",
    desc: "Te avisaremos antes de que termine tu prueba",
  },
  {
    icon: CheckCircle2,
    title: "Día 7",
    desc: "Se activa tu suscripción. Cancela en cualquier momento",
  },
];

type PlanId = "family" | "annual" | "monthly";

interface Plan {
  id: PlanId;
  badge?: string;
  badgeColor?: string;
  name: string;
  duration: string;
  price: string;
}

const PLANS_DEFAULT: Plan[] = [
  {
    id: "family",
    badge: "2-6 MIEMBROS",
    badgeColor: "bg-primary text-white",
    name: "Plan Familiar",
    duration: "12 meses",
    price: "€10,25 / mes",
  },
  {
    id: "annual",
    badge: "MÁS POPULAR",
    badgeColor: "bg-gradient-to-r from-primary to-accent text-white",
    name: "12 meses",
    duration: "",
    price: "€8,49 / mes",
  },
];

const MONTHLY_PLAN: Plan = {
  id: "monthly",
  name: "1 mes",
  duration: "",
  price: "€18,49 / mes",
};

const PLAN_DETAILS: Record<PlanId, string> = {
  family: "7 días gratis, después €123,00 al año (€10,25/mes, facturado anualmente) + impuestos aplicables",
  annual: "7 días gratis, después €101,99 al año (€8,49/mes, facturado anualmente) + impuestos aplicables",
  monthly: "3 días gratis, después €18,49 al mes + impuestos aplicables",
};

const TRIAL_DAYS: Record<PlanId, number> = {
  family: 7,
  annual: 7,
  monthly: 3,
};

type Step = "compare" | "reminder" | "plans";

const SuperUpgradeDialog = ({ open, onClose }: SuperUpgradeDialogProps) => {
  const [step, setStep] = useState<Step>("compare");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("annual");
  const [showAllPlans, setShowAllPlans] = useState(false);

  const handleClose = () => {
    setStep("compare");
    setSelectedPlan("annual");
    setShowAllPlans(false);
    onClose();
  };

  const visiblePlans = showAllPlans
    ? [...PLANS_DEFAULT, MONTHLY_PLAN]
    : PLANS_DEFAULT;

  const trialDays = TRIAL_DAYS[selectedPlan];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="fixed inset-0 max-w-none w-full h-full translate-x-0 translate-y-0 left-0 top-0 rounded-none border-none p-0 sm:rounded-none data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-top-0 overflow-auto">
        <div className="min-h-full w-full bg-gradient-to-b from-[hsl(210,60%,25%)] via-[hsl(240,40%,30%)] to-[hsl(270,40%,28%)] flex flex-col items-center justify-center px-4 py-12 relative">
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute left-4 top-4 z-10 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Super badge top-right */}
          <div className="absolute right-4 top-4 z-10">
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
              <Crown className="h-3.5 w-3.5" />
              Super
            </span>
          </div>

          {/* Step 1: Compare */}
          {step === "compare" && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                  ¡Progresa más rápido con
                </h2>
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                  SpanischMitBelu{" "}
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-xl md:text-2xl">
                    <Crown className="h-4 w-4" />
                    Super
                  </span>
                  !
                </h2>
              </div>

              <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-1 mb-8">
                <div className="grid grid-cols-[1fr_70px_70px] items-center px-4 py-3">
                  <div />
                  <div className="text-center text-xs font-bold uppercase tracking-wide text-white/80">Free</div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      <Crown className="h-3 w-3" />
                      Super
                    </span>
                  </div>
                </div>
                {FEATURES.map((feature, i) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-[1fr_70px_70px] items-center px-4 py-3 ${
                      i < FEATURES.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-white/90">{feature.name}</span>
                    <div className="flex justify-center">
                      {feature.free ? (
                        <Check className="h-4 w-4 text-white/60" />
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("reminder")}
                className="w-full max-w-md rounded-2xl bg-white py-4 text-center text-base font-extrabold uppercase tracking-wide text-[hsl(240,40%,30%)] shadow-xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Comenzar mi prueba gratis de 7 días
              </button>
            </>
          )}

          {/* Step 2: Reminder */}
          {step === "reminder" && (
            <>
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                  Te avisaremos{" "}
                  <span className="text-primary">2 días</span>
                </h2>
                <h2 className="text-2xl font-extrabold text-white md:text-3xl">
                  antes de que termine tu prueba
                </h2>
              </div>

              <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-6 py-6 mb-8">
                {TIMELINE.map((item, i) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className="w-px flex-1 min-h-[32px] border-l-2 border-dashed border-white/25 my-1" />
                      )}
                    </div>
                    <div className={`pt-1 ${i < TIMELINE.length - 1 ? "pb-4" : ""}`}>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep("plans")}
                className="w-full max-w-md rounded-2xl bg-white py-4 text-center text-base font-extrabold uppercase tracking-wide text-[hsl(240,40%,30%)] shadow-xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Comenzar mi prueba gratis de 7 días
              </button>
            </>
          )}

          {/* Step 3: Choose plan */}
          {step === "plans" && (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-white md:text-3xl italic">
                  Elige un plan para después
                </h2>
                <h2 className="text-2xl font-extrabold text-white md:text-3xl italic">
                  de tu prueba gratis de {trialDays} días
                </h2>
              </div>

              {/* Plan cards */}
              <div className="w-full max-w-md space-y-3 mb-6">
                {visiblePlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative w-full rounded-2xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-white shadow-lg"
                          : "border-white/20 bg-white/10 hover:border-white/40"
                      }`}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <span
                          className={`absolute -top-3 left-4 rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${plan.badgeColor}`}
                        >
                          {plan.badge}
                        </span>
                      )}

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-lg font-extrabold ${isSelected ? "text-[hsl(240,40%,30%)]" : "text-white"}`}>
                            {plan.name}
                          </p>
                          {plan.duration && (
                            <p className={`text-sm ${isSelected ? "text-primary" : "text-white/60"}`}>
                              {plan.duration}
                            </p>
                          )}
                        </div>
                        <p className={`text-base font-bold ${isSelected ? "text-[hsl(240,40%,30%)]" : "text-white/80"}`}>
                          {plan.price}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Plan detail text */}
              <p className="mb-6 text-center text-xs text-white/60 max-w-sm">
                {PLAN_DETAILS[selectedPlan]}
              </p>

              {/* CTA */}
              <button
                onClick={handleClose}
                className="w-full max-w-md rounded-2xl bg-white py-4 text-center text-base font-extrabold uppercase tracking-wide text-[hsl(240,40%,30%)] shadow-xl transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Comenzar mi prueba gratis de {trialDays} días
              </button>

              {/* View all plans */}
              {!showAllPlans && (
                <button
                  onClick={() => setShowAllPlans(true)}
                  className="mt-4 text-sm font-bold uppercase tracking-wide text-white/80 hover:text-white transition-colors"
                >
                  Ver todos los planes
                </button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuperUpgradeDialog;
