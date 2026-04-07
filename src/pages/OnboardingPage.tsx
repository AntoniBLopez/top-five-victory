import { useState, useMemo, useCallback, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CONJUGATION_BY_TENSE } from "@/data/mockConjugations";
import { WordsArray } from "@/types/game";

import WelcomeStep from "@/components/onboarding/WelcomeStep";
import MotivationStep, { type MotivationId } from "@/components/onboarding/MotivationStep";
import SelfAssessmentStep, { type SelfAssessmentId } from "@/components/onboarding/SelfAssessmentStep";
import PromisesStep from "@/components/onboarding/PromisesStep";
import DailyGoalStep from "@/components/onboarding/DailyGoalStep";
import NotificationsStep from "@/components/onboarding/NotificationsStep";
import CalibrationStep, { type CalibrationCard } from "@/components/onboarding/CalibrationStep";
import ResultsStep from "@/components/onboarding/ResultsStep";

// ── Types ──
type CalibrationMode = "completed" | "skipped" | "quick_completed";

interface OnboardingState {
  motivation: MotivationId | null;
  selfAssessment: SelfAssessmentId | null;
  dailyGoal: number;
  dailyMinutes: number;
  level: "beginner" | "intermediate" | "advanced" | null;
  calibrationMode: CalibrationMode;
  calibrationResults: { correct: boolean; card: CalibrationCard }[];
  notificationPermission: string | null;
}

type Step =
  | "welcome"
  | "motivation"
  | "self-assessment"
  | "promises"
  | "daily-goal"
  | "notifications"
  | "calibration"
  | "results";

const ALL_STEPS: Step[] = [
  "welcome",
  "motivation",
  "self-assessment",
  "promises",
  "daily-goal",
  "notifications",
  "calibration",
  "results",
];

// ── Build calibration deck ──
function buildCalibrationDeck(): CalibrationCard[] {
  const allCards: CalibrationCard[] = [];
  let id = 0;

  const tenseKeys = ["prasens", "prateritum", "perfekt"] as const;
  const tenseLabels: Record<string, string> = {
    prasens: "Präsens",
    prateritum: "Präteritum",
    perfekt: "Perfekt",
  };

  for (const tenseKey of tenseKeys) {
    const words: WordsArray[] = CONJUGATION_BY_TENSE[tenseKey] || [];
    for (const [prompt, form] of words) {
      const match = prompt.match(/^(.+?)\s*—\s*(.+?)\s*\(/);
      if (!match) continue;
      allCards.push({
        id: id++,
        verb: match[1].trim(),
        pronoun: match[2].trim(),
        tense: tenseLabels[tenseKey],
        answer: form,
        prompt,
      });
    }
  }

  return allCards.sort(() => Math.random() - 0.5).slice(0, 24);
}

// ── Analytics helpers (stub — replace with real analytics later) ──
function trackEvent(event: string, props?: Record<string, unknown>) {
  console.log(`[analytics] ${event}`, props);
}

// ── Main Onboarding Page ──
const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [state, setState] = useState<OnboardingState>({
    motivation: null,
    selfAssessment: null,
    dailyGoal: 20,
    dailyMinutes: 10,
    level: null,
    calibrationMode: "completed",
    calibrationResults: [],
    notificationPermission: null,
  });

  const calibrationDeck = useMemo(buildCalibrationDeck, []);
  const [cardIndex, setCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdvancingRef = useRef(false);

  // Track onboarding start
  useState(() => {
    trackEvent("smart_review_started");
  });

  const stepIndex = ALL_STEPS.indexOf(step);

  // ── Calibration handlers ──
  const advanceCard = useCallback(() => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    // Clear any pending timeout
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }

    setCardIndex((prevIndex) => {
      if (prevIndex + 1 >= calibrationDeck.length) {
        // Final card — compute results from latest state
        setState((prev) => {
          const results = prev.calibrationResults;
          const correctCount = results.filter((r) => r.correct).length;
          const pct = results.length > 0 ? (correctCount / results.length) * 100 : 0;
          const level = pct >= 70 ? "advanced" : pct >= 40 ? "intermediate" : "beginner";

          const tenseMap: Record<string, { correct: number; total: number }> = {};
          const pronounMap: Record<string, { correct: number; total: number }> = {};
          for (const r of results) {
            const t = r.card.tense;
            const p = r.card.pronoun;
            if (!tenseMap[t]) tenseMap[t] = { correct: 0, total: 0 };
            if (!pronounMap[p]) pronounMap[p] = { correct: 0, total: 0 };
            tenseMap[t].total++;
            pronounMap[p].total++;
            if (r.correct) {
              tenseMap[t].correct++;
              pronounMap[p].correct++;
            }
          }
          const weakTenses = Object.entries(tenseMap)
            .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.5)
            .map(([t]) => t);
          const weakPronouns = Object.entries(pronounMap)
            .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.5)
            .map(([p]) => p);

          const existing = JSON.parse(localStorage.getItem("onboarding") || "{}");
          localStorage.setItem(
            "onboarding",
            JSON.stringify({
              ...existing,
              smartReview: {
                calibration: {
                  mode: "completed",
                  weakTenses,
                  weakPronouns,
                  level,
                  completedAt: new Date().toISOString(),
                },
              },
            })
          );

          trackEvent("smart_review_step_completed", { step: "calibration", mode: "completed" });
          setTimeout(() => setStep("results"), 0);

          return { ...prev, level, calibrationMode: "completed" as CalibrationMode };
        });

        return prevIndex; // don't increment past end
      } else {
        setUserAnswer("");
        setShowFeedback(false);
        setIsCorrect(null);
        isAdvancingRef.current = false;
        return prevIndex + 1;
      }
    });
  }, [calibrationDeck.length]);

  const handleAnswer = useCallback(() => {
    if (showFeedback) return;
    const card = calibrationDeck[cardIndex];
    const correct = userAnswer.trim().toLowerCase() === card.answer.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);

    setState((prev) => ({
      ...prev,
      calibrationResults: [...prev.calibrationResults, { correct, card }],
    }));

    isAdvancingRef.current = false;
    feedbackTimerRef.current = setTimeout(() => advanceCard(), 1500);
  }, [userAnswer, cardIndex, calibrationDeck, showFeedback, advanceCard]);

  const handleSkip = useCallback(() => {
    if (showFeedback) {
      advanceCard();
      return;
    }
    const card = calibrationDeck[cardIndex];
    setState((prev) => ({
      ...prev,
      calibrationResults: [...prev.calibrationResults, { correct: false, card }],
    }));
    setIsCorrect(false);
    setShowFeedback(true);
    isAdvancingRef.current = false;
    feedbackTimerRef.current = setTimeout(() => advanceCard(), 1200);
  }, [showFeedback, cardIndex, calibrationDeck, advanceCard]);

  const handleSkipCalibration = useCallback(() => {
    setState((prev) => ({
      ...prev,
      level: "beginner",
      calibrationMode: "skipped",
      calibrationResults: [],
    }));

    const existing = JSON.parse(localStorage.getItem("onboarding") || "{}");
    localStorage.setItem(
      "onboarding",
      JSON.stringify({
        ...existing,
        smartReview: {
          calibration: {
            mode: "skipped",
            weakTenses: [],
            weakPronouns: [],
            completedAt: new Date().toISOString(),
          },
        },
      })
    );

    trackEvent("smart_review_calibration_skipped");
    setStep("results");
  }, []);

  // ── Finish ──
  const handleFinish = () => {
    const payload = {
      motivation: state.motivation,
      selfAssessment: state.selfAssessment,
      dailyGoal: state.dailyGoal,
      dailyMinutes: state.dailyMinutes,
      level: state.level || "beginner",
      calibrationMode: state.calibrationMode,
      notificationPermission: state.notificationPermission,
      completedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("onboarding") || "{}");
    localStorage.setItem(
      "onboarding",
      JSON.stringify({
        ...existing,
        ...payload,
      })
    );

    trackEvent("smart_review_step_completed", { step: "results" });
    sessionStorage.removeItem("streak_shown_conj");
    navigate(`/conjugations?source=smart_review&onboardingMode=${state.calibrationMode}`, {
      replace: true,
    });
  };

  // ── Step navigation helpers ──
  const goTo = (s: Step) => {
    trackEvent("smart_review_step_completed", { step });
    setStep(s);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Step indicators */}
      {step !== "welcome" && (
        <div className="flex items-center gap-3 px-6 pt-6 pb-2">
          <button
            onClick={() => {
              const prevIndex = stepIndex - 1;
              if (prevIndex >= 0) setStep(ALL_STEPS[prevIndex]);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 gap-2">
            {ALL_STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= stepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <WelcomeStep key="welcome" onNext={() => goTo("motivation")} />
          )}
          {step === "motivation" && (
            <MotivationStep
              key="motivation"
              selected={state.motivation}
              onSelect={(id) => setState((p) => ({ ...p, motivation: id }))}
              onNext={() => goTo("self-assessment")}
              onBack={() => setStep("welcome")}
            />
          )}
          {step === "self-assessment" && (
            <SelfAssessmentStep
              key="self-assessment"
              selected={state.selfAssessment}
              onSelect={(id) => setState((p) => ({ ...p, selfAssessment: id }))}
              onNext={() => goTo("promises")}
              onBack={() => setStep("motivation")}
            />
          )}
          {step === "promises" && (
            <PromisesStep
              key="promises"
              onNext={() => goTo("daily-goal")}
              onBack={() => setStep("self-assessment")}
            />
          )}
          {step === "daily-goal" && (
            <DailyGoalStep
              key="daily-goal"
              selected={state.dailyGoal}
              onSelect={(cards, minutes) =>
                setState((p) => ({ ...p, dailyGoal: cards, dailyMinutes: minutes }))
              }
              onNext={() => goTo("notifications")}
              onBack={() => setStep("promises")}
            />
          )}
          {step === "notifications" && (
            <NotificationsStep
              key="notifications"
              onNext={(permission) => {
                setState((p) => ({ ...p, notificationPermission: permission }));
                goTo("calibration");
              }}
              onBack={() => setStep("daily-goal")}
              onSkip={() => {
                setState((p) => ({ ...p, notificationPermission: "declined" }));
                goTo("calibration");
              }}
            />
          )}
          {step === "calibration" && (
            <CalibrationStep
              key="calibration"
              cards={calibrationDeck}
              currentIndex={cardIndex}
              userAnswer={userAnswer}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
              onAnswer={handleAnswer}
              onChange={setUserAnswer}
              onSkip={handleSkip}
              onBack={() => setStep("notifications")}
              onSkipAll={handleSkipCalibration}
              totalCards={calibrationDeck.length}
            />
          )}
          {step === "results" && (
            <ResultsStep
              key="results"
              results={state.calibrationResults}
              level={state.level || "beginner"}
              dailyGoal={state.dailyGoal}
              calibrationMode={state.calibrationMode}
              onFinish={handleFinish}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
