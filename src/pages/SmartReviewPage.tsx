import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Volume2, Check, AlertCircle, Zap, Brain, Target, RotateCcw } from "lucide-react";
import { getStats } from "@/lib/fsrs";
import { updateContextFromStats, checkAchievements, recordPerfectSession, recordSession, type Achievement } from "@/lib/achievements";
import AchievementUnlockPopup from "@/components/AchievementUnlockPopup";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_SENTENCES, generateTableClozeCards, type SentenceCloze, type TableClozeCard } from "@/data/mockSentences";
import { Progress } from "@/components/ui/progress";
import {
  initializeCards,
  getDueCards,
  reviewCard,
  getNextIntervalLabel,
  type FSRSCard,
  type Rating,
} from "@/lib/fsrs";

// ── Types ──
type CardState = "answering" | "feedback";

interface ReviewCard {
  id: string;
  type: "sentence" | "table";
  fsrsCard: FSRSCard;
  sentenceData?: SentenceCloze;
  tableData?: TableClozeCard;
}

interface RatingOption {
  key: Rating;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const RATING_OPTIONS: RatingOption[] = [
  { key: "again", label: "Otra vez", emoji: "🔴", color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20 hover:bg-destructive/20" },
  { key: "hard", label: "Difícil", emoji: "🟠", color: "text-orange-500", bgColor: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20" },
  { key: "good", label: "Bien", emoji: "🟢", color: "text-primary", bgColor: "bg-primary/10 border-primary/20 hover:bg-primary/20" },
  { key: "easy", label: "Fácil", emoji: "🔵", color: "text-blue-500", bgColor: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" },
];

// ── Initialize FSRS cards from mock data ──
function ensureCardsInitialized() {
  const sentenceCards = MOCK_SENTENCES.map((s, i) => ({
    id: `sent:${s.verb}:${s.tense}:${s.pronoun}:${i}`,
    verb: s.verb,
    tense: s.tense,
    pronoun: s.pronoun,
  }));
  const tableCards = generateTableClozeCards().map((t, i) => ({
    id: `table:${t.verb}:${t.tense}:${i}`,
    verb: t.verb,
    tense: t.tense,
  }));
  initializeCards(sentenceCards, tableCards);
}

// ── Build review queue from FSRS due cards ──
function buildReviewQueue(count: number): ReviewCard[] {
  ensureCardsInitialized();
  const dueCards = getDueCards(count);

  const sentenceMap = new Map<string, SentenceCloze>();
  MOCK_SENTENCES.forEach((s, i) => {
    sentenceMap.set(`sent:${s.verb}:${s.tense}:${s.pronoun}:${i}`, s);
  });

  const tableMap = new Map<string, TableClozeCard>();
  generateTableClozeCards().forEach((t, i) => {
    tableMap.set(`table:${t.verb}:${t.tense}:${i}`, t);
  });

  return dueCards.map((fsrsCard) => {
    if (fsrsCard.type === "sentence") {
      return {
        id: fsrsCard.id,
        type: "sentence" as const,
        fsrsCard,
        sentenceData: sentenceMap.get(fsrsCard.id),
      };
    }
    return {
      id: fsrsCard.id,
      type: "table" as const,
      fsrsCard,
      tableData: tableMap.get(fsrsCard.id),
    };
  }).filter((c) => c.sentenceData || c.tableData);
}

// ── Sentence Cloze Component ──
const SentenceClozeView = ({
  data, cardState, userAnswer, onAnswerChange, onSubmit, isCorrect,
}: {
  data: SentenceCloze; cardState: CardState; userAnswer: string;
  onAnswerChange: (v: string) => void; onSubmit: () => void; isCorrect: boolean | null;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const parts = data.sentence.split("___");

  useEffect(() => {
    if (cardState === "answering") setTimeout(() => inputRef.current?.focus(), 300);
  }, [cardState]);

  const handleSpeak = () => {
    const full = data.sentence.replace("___", data.answer);
    const utterance = new SpeechSynthesisUtterance(full);
    utterance.lang = "de-DE";
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-2">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{data.verb}</span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{data.tense} · {data.pronoun}</span>
      </div>
      {data.hint && <p className="text-xs text-muted-foreground italic">({data.hint})</p>}
      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-xl font-bold leading-relaxed text-foreground md:text-2xl">
          {parts[0]}
          {cardState === "answering" ? (
            <span className="relative inline-block mx-1">
              <input
                ref={inputRef} type="text" value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && userAnswer.trim() && onSubmit()}
                className="w-32 border-b-2 border-primary bg-transparent text-center text-xl font-bold text-primary outline-none md:w-40 md:text-2xl"
                autoComplete="off" spellCheck={false}
              />
            </span>
          ) : (
            <span className={`relative mx-1 inline-block rounded-lg px-2 py-0.5 font-extrabold ${isCorrect ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
              {data.answer}
            </span>
          )}
          {parts[1]}
        </p>
      </div>
      {cardState === "feedback" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
          {!isCorrect && (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-bold text-foreground">Tu respuesta: <span className="text-destructive line-through">{userAnswer}</span></p>
                <p className="text-sm text-foreground">Correcto: <span className="font-bold text-primary">{data.answer}</span></p>
              </div>
            </div>
          )}
          <button onClick={handleSpeak} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
            <Volume2 className="h-4 w-4 text-primary" /> Escuchar pronunciación
          </button>
        </motion.div>
      )}
      {cardState === "answering" && (
        <button onClick={onSubmit} disabled={!userAnswer.trim()} className="w-full rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90 active:scale-[0.98]">
          Comprobar
        </button>
      )}
    </div>
  );
};

// ── Table Cloze Component ──
const TableClozeView = ({
  data, cardState, userAnswers, onAnswerChange, onSubmit, results,
}: {
  data: TableClozeCard; cardState: CardState; userAnswers: Record<string, string>;
  onAnswerChange: (pronoun: string, val: string) => void; onSubmit: () => void;
  results: Record<string, boolean> | null;
}) => {
  const blanks = data.rows.filter((r) => r.isBlank);
  const allFilled = blanks.every((r) => (userAnswers[r.pronoun] || "").trim());
  const firstBlankRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cardState === "answering") setTimeout(() => firstBlankRef.current?.focus(), 300);
  }, [cardState]);

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  };

  let blankIndex = 0;

  return (
    <div className="flex flex-col items-center gap-6 px-2">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{data.verb}</span>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{data.tense}</span>
      </div>
      <p className="text-xs font-medium text-muted-foreground">Completa las conjugaciones que faltan</p>
      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
        {data.rows.map((row, i) => {
          const isCurrentBlank = row.isBlank;
          const isFirstBlank = isCurrentBlank && blankIndex === 0;
          if (isCurrentBlank) blankIndex++;
          return (
            <div key={row.pronoun} className={`flex items-center justify-between px-5 py-4 ${i < data.rows.length - 1 ? "border-b border-border" : ""} ${cardState === "feedback" && results ? results[row.pronoun] === true ? "bg-primary/5" : results[row.pronoun] === false ? "bg-destructive/5" : "" : ""}`}>
              <span className="text-sm font-medium text-muted-foreground">{row.pronoun}</span>
              {!isCurrentBlank ? (
                <span className="text-[15px] font-bold text-foreground">{row.answer}</span>
              ) : cardState === "answering" ? (
                <input
                  ref={isFirstBlank ? firstBlankRef : undefined} type="text"
                  value={userAnswers[row.pronoun] || ""}
                  onChange={(e) => onAnswerChange(row.pronoun, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && allFilled) onSubmit(); }}
                  placeholder="..."
                  className="w-28 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-right text-sm font-bold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 md:w-36"
                  autoComplete="off" spellCheck={false}
                />
              ) : (
                <div className="flex items-center gap-2">
                  {results && results[row.pronoun] === false && <span className="text-xs text-destructive line-through">{userAnswers[row.pronoun]}</span>}
                  <span className="text-[15px] font-bold text-primary">{row.answer}</span>
                  {results && (results[row.pronoun] ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-destructive" />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {cardState === "feedback" && (
        <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => { const fullText = data.rows.map((r) => `${r.pronoun} ${r.answer}`).join(". "); handleSpeak(fullText); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
          <Volume2 className="h-4 w-4 text-primary" /> Escuchar pronunciación
        </motion.button>
      )}
      {cardState === "answering" && (
        <button onClick={onSubmit} disabled={!allFilled} className="w-full rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground transition-opacity disabled:opacity-40 hover:opacity-90 active:scale-[0.98]">
          Comprobar
        </button>
      )}
    </div>
  );
};

// ── Session Summary ──
const SessionSummary = ({
  totalCards, correctCount, ratings, onRestart, onGoHome,
}: {
  totalCards: number; correctCount: number; ratings: Rating[];
  onRestart: () => void; onGoHome: () => void;
}) => {
  const accuracy = totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;
  const xpEarned = ratings.reduce((acc, r) => {
    const xpMap: Record<Rating, number> = { easy: 15, good: 10, hard: 5, again: 2 };
    return acc + xpMap[r];
  }, 0);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[80dvh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-5xl">
            {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "⭐" : "💪"}
          </motion.div>
          <h2 className="text-2xl font-extrabold text-foreground">{accuracy >= 80 ? "¡Excelente!" : accuracy >= 50 ? "¡Buen trabajo!" : "¡Sigue practicando!"}</h2>
          <p className="text-sm text-muted-foreground">Sesión completada</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <Target className="h-5 w-5 text-primary" /><p className="text-xl font-extrabold text-foreground">{accuracy}%</p><p className="text-[10px] font-medium text-muted-foreground">Precisión</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <Zap className="h-5 w-5 text-accent" /><p className="text-xl font-extrabold text-foreground">{xpEarned}</p><p className="text-[10px] font-medium text-muted-foreground">XP ganados</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
            <Brain className="h-5 w-5 text-primary" /><p className="text-xl font-extrabold text-foreground">{totalCards}</p><p className="text-[10px] font-medium text-muted-foreground">Cards</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Desglose</p>
          <div className="grid grid-cols-4 gap-2">
            {RATING_OPTIONS.map((r) => {
              const count = ratings.filter((rt) => rt === r.key).length;
              return (
                <div key={r.key} className="flex flex-col items-center gap-1">
                  <span className="text-lg">{r.emoji}</span><span className="text-sm font-extrabold text-foreground">{count}</span><span className="text-[9px] text-muted-foreground">{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98]">
            <RotateCcw className="h-5 w-5" /> Otra sesión
          </button>
          <button onClick={onGoHome} className="w-full rounded-2xl border border-border bg-card py-4 text-base font-bold text-foreground transition-colors hover:bg-muted/50">
            Volver al dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ──
const REVIEW_COUNT = 10;

const SmartReviewPage = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<ReviewCard[]>(() => buildReviewQueue(REVIEW_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>("answering");
  const [sessionDone, setSessionDone] = useState(false);
  const [sentenceAnswer, setSentenceAnswer] = useState("");
  const [sentenceCorrect, setSentenceCorrect] = useState<boolean | null>(null);
  const [tableAnswers, setTableAnswers] = useState<Record<string, string>>({});
  const [tableResults, setTableResults] = useState<Record<string, boolean> | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);

  const currentCard = queue[currentIndex];
  const progress = sessionDone ? 100 : queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;

  const resetCardState = useCallback(() => {
    setSentenceAnswer("");
    setSentenceCorrect(null);
    setTableAnswers({});
    setTableResults(null);
    setCardState("answering");
    setLastCorrect(false);
  }, []);

  const handleSubmitSentence = useCallback(() => {
    if (!currentCard?.sentenceData) return;
    const correct = sentenceAnswer.trim().toLowerCase() === currentCard.sentenceData.answer.toLowerCase();
    setSentenceCorrect(correct);
    setLastCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
    setCardState("feedback");
  }, [currentCard, sentenceAnswer]);

  const handleSubmitTable = useCallback(() => {
    if (!currentCard?.tableData) return;
    const blanks = currentCard.tableData.rows.filter((r) => r.isBlank);
    const results: Record<string, boolean> = {};
    let allCorrect = true;
    for (const row of blanks) {
      const userVal = (tableAnswers[row.pronoun] || "").trim().toLowerCase();
      const isCorrect = userVal === row.answer.toLowerCase();
      results[row.pronoun] = isCorrect;
      if (!isCorrect) allCorrect = false;
    }
    setTableResults(results);
    setLastCorrect(allCorrect);
    if (allCorrect) setCorrectCount((c) => c + 1);
    setCardState("feedback");
  }, [currentCard, tableAnswers]);

  const handleRate = useCallback((rating: Rating) => {
    // Record in FSRS
    if (currentCard) {
      reviewCard(currentCard.id, rating, lastCorrect);
    }
    setRatings((prev) => [...prev, rating]);
    if (currentIndex + 1 >= queue.length) {
      setSessionDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      resetCardState();
    }
  }, [currentIndex, queue.length, resetCardState, currentCard, lastCorrect]);

  const handleRestart = useCallback(() => {
    const newQueue = buildReviewQueue(REVIEW_COUNT);
    setQueue(newQueue);
    setCurrentIndex(0);
    setCorrectCount(0);
    setRatings([]);
    setSessionDone(false);
    resetCardState();
  }, [resetCardState]);

  // No due cards
  if (queue.length === 0 && !sessionDone) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-5xl">
          🎉
        </motion.div>
        <h2 className="text-2xl font-extrabold text-foreground">¡Todo al día!</h2>
        <p className="mt-2 text-sm text-muted-foreground">No hay cards pendientes. Vuelve más tarde.</p>
        <button onClick={() => navigate("/conjugations")} className="mt-8 rounded-2xl bg-primary px-8 py-4 text-base font-extrabold text-primary-foreground">
          Volver al dashboard
        </button>
      </div>
    );
  }

  // Achievement check on session done
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!sessionDone) return;
    const stats = getStats();
    const ctx = updateContextFromStats(stats);
    const accuracy = queue.length > 0 ? Math.round((correctCount / queue.length) * 100) : 0;
    if (accuracy === 100 && queue.length > 0) recordPerfectSession();
    else recordSession();
    const unlocked = checkAchievements(ctx);
    if (unlocked.length > 0) setNewAchievements(unlocked);
  }, [sessionDone, correctCount, queue.length]);

  if (sessionDone) {
    return (
      <div className="min-h-[100dvh] bg-background">
        {newAchievements.length > 0 && (
          <AchievementUnlockPopup
            achievements={newAchievements}
            onClose={() => setNewAchievements([])}
          />
        )}
        <SessionSummary totalCards={queue.length} correctCount={correctCount} ratings={ratings}
          onRestart={handleRestart} onGoHome={() => navigate("/conjugations")} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/conjugations")} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="flex-1"><Progress value={progress} className="h-2.5 bg-muted" /></div>
          <span className="min-w-[3rem] text-right text-xs font-bold text-muted-foreground">{currentIndex + 1}/{queue.length}</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4 pt-5 pb-2">
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${currentCard?.type === "table" ? "bg-accent/15 text-accent-foreground" : "bg-primary/10 text-primary"}`}>
          {currentCard?.type === "table" ? "📋 Table Cloze" : "💬 Sentence Cloze"}
        </span>
      </div>

      <div className="flex-1 mx-auto w-full max-w-2xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentCard?.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.25 }}>
            {currentCard?.type === "sentence" && currentCard.sentenceData && (
              <SentenceClozeView data={currentCard.sentenceData} cardState={cardState} userAnswer={sentenceAnswer}
                onAnswerChange={setSentenceAnswer} onSubmit={handleSubmitSentence} isCorrect={sentenceCorrect} />
            )}
            {currentCard?.type === "table" && currentCard.tableData && (
              <TableClozeView data={currentCard.tableData} cardState={cardState} userAnswers={tableAnswers}
                onAnswerChange={(p, v) => setTableAnswers((prev) => ({ ...prev, [p]: v }))}
                onSubmit={handleSubmitTable} results={tableResults} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cardState === "feedback" && currentCard && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.25 }}
            className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="mx-auto max-w-2xl px-4 py-4">
              <p className="mb-3 text-center text-xs font-medium text-muted-foreground">¿Qué tan bien lo sabías?</p>
              <div className="grid grid-cols-4 gap-2">
                {RATING_OPTIONS.map((r) => {
                  const sublabel = getNextIntervalLabel(currentCard.fsrsCard, r.key);
                  return (
                    <button key={r.key} onClick={() => handleRate(r.key)}
                      className={`flex flex-col items-center gap-1 rounded-2xl border py-3 transition-all active:scale-95 ${r.bgColor}`}>
                      <span className="text-lg">{r.emoji}</span>
                      <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
                      <span className="text-[9px] text-muted-foreground">{sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartReviewPage;
