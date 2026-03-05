import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, PenLine, Layers, Grid3X3, Zap, ChevronRight, Trophy, Gamepad2, Sun, Moon, Flame, Check } from "lucide-react";
import { GameType, GAME_TYPE_LABELS } from "@/types/game";
import { MOCK_TOPIC_WORDS } from "@/data/mockWords";
import { CONJUGATION_BY_TENSE, TENSE_OPTIONS, TenseId } from "@/data/mockConjugations";
import { useTheme } from "@/components/ThemeProvider";
import DailyStreakPopup from "@/components/DailyStreakPopup";
import FlashcardGame from "@/components/games/FlashcardGame";
import MultipleChoiceGame from "@/components/games/MultipleChoiceGame";
import WritingGame from "@/components/games/WritingGame";
import MatchingGame from "@/components/games/MatchingGame";
import EndGameScreen from "@/components/games/EndGameScreen";

const GAMES: { type: GameType; desc: string; multiplier: string; emoji: string }[] = [
  { type: "flashcards", desc: "Repasa tarjetas y marca las que conoces", multiplier: "×0.4", emoji: "🃏" },
  { type: "multiplechoice", desc: "Elige la traducción correcta entre 4 opciones", multiplier: "×1.0", emoji: "🎯" },
  { type: "writing", desc: "Escribe la traducción correcta en alemán", multiplier: "×1.5", emoji: "✍️" },
  { type: "matching", desc: "Conecta palabras con su traducción", multiplier: "×1.2", emoji: "🔗" },
];

const MOCK_STREAK = 7;

const AppHeader = ({ showBack, onBack, title }: { showBack?: boolean; onBack?: () => void; title?: string }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="h-5 w-5 text-foreground rotate-180" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-foreground md:text-lg">SpanischMitBelu</span>
            </div>
          )}
          {title && <h1 className="text-base font-bold text-foreground md:text-lg">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
            <Flame className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-accent-foreground">{MOCK_STREAK}</span>
          </div>
          <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-muted transition-colors" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>
    </header>
  );
};

const GamesPage = () => {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();
  const [selectedTense, setSelectedTense] = useState<TenseId | null>(null);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState<{ known: string[]; learning: string[] } | null>(null);
  const [showStreak, setShowStreak] = useState(false);

  const isConjugation = mode === "conjugaciones";

  // For vocabulary, skip tense selection
  const topicWords = isConjugation
    ? (selectedTense ? CONJUGATION_BY_TENSE[selectedTense] : [])
    : MOCK_TOPIC_WORDS;
  const modeLabel = isConjugation ? "Conjugaciones" : "Vocabulario";

  useEffect(() => {
    const shown = sessionStorage.getItem("streak_shown");
    if (!shown) {
      const timer = setTimeout(() => setShowStreak(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseStreak = () => {
    setShowStreak(false);
    sessionStorage.setItem("streak_shown", "1");
  };

  const handleComplete = (known: string[], learning: string[]) => {
    setResults({ known, learning });
    setGameFinished(true);
  };

  const handleRestart = () => {
    setGameFinished(false);
    setResults(null);
  };

  const handleBackFromGame = () => {
    setActiveGame(null);
    setGameFinished(false);
    setResults(null);
  };

  const handleBackFromGameSelect = () => {
    if (isConjugation) {
      setSelectedTense(null);
    } else {
      navigate("/");
    }
  };

  // End game screen
  if (gameFinished && results && activeGame) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        <AppHeader showBack onBack={handleBackFromGame} />
        <div className="flex flex-1 items-center justify-center px-4">
          <EndGameScreen
            knownCount={results.known.length}
            learningCount={results.learning.length}
            topicWords={topicWords}
            restart={handleRestart}
            gameType={activeGame}
            onGoHome={handleBackFromGame}
          />
        </div>
      </div>
    );
  }

  // Active game
  if (activeGame) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        <AppHeader showBack onBack={handleBackFromGame} title={GAME_TYPE_LABELS[activeGame]} />
        <main className="flex flex-1 items-start justify-center py-6 md:py-10 md:items-center">
          <div className="w-full">
            {activeGame === "flashcards" && <FlashcardGame topicWords={topicWords} onComplete={handleComplete} />}
            {activeGame === "multiplechoice" && <MultipleChoiceGame topicWords={topicWords} onComplete={handleComplete} />}
            {activeGame === "writing" && <WritingGame topicWords={topicWords} onComplete={handleComplete} />}
            {activeGame === "matching" && <MatchingGame topicWords={topicWords} onComplete={handleComplete} />}
          </div>
        </main>
      </div>
    );
  }

  // Tense selection step (conjugation mode only)
  if (isConjugation && !selectedTense) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <AppHeader showBack onBack={() => navigate("/")} title="Conjugaciones" />
        <DailyStreakPopup streakDays={MOCK_STREAK} open={showStreak} onClose={handleCloseStreak} />

        <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 md:px-6 md:pt-12">
          <div className="mb-8 text-center md:mb-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl md:h-20 md:w-20 md:text-4xl">
              ✏️
            </div>
            <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">¿Qué tiempo verbal?</h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">Elige qué conjugaciones quieres practicar</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {TENSE_OPTIONS.map(({ id, label, emoji, desc }) => {
              const wordCount = CONJUGATION_BY_TENSE[id]?.length ?? 0;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedTense(id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] group md:p-5"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl md:h-14 md:w-14">
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground md:text-base">{label}</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        {wordCount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 md:text-sm">{desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Game selection hub
  const tenseLabel = isConjugation && selectedTense
    ? TENSE_OPTIONS.find(t => t.id === selectedTense)?.label ?? ""
    : "";

  return (
    <div className="min-h-[100dvh] bg-background">
      <AppHeader showBack onBack={handleBackFromGameSelect} title={isConjugation ? tenseLabel : undefined} />
      <DailyStreakPopup streakDays={MOCK_STREAK} open={showStreak} onClose={handleCloseStreak} />

      <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 md:px-6 md:pt-12">
        <div className="mb-8 text-center md:mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 md:h-20 md:w-20">
            <Gamepad2 className="h-8 w-8 text-primary md:h-10 md:w-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">Practica {modeLabel.toLowerCase()}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">Elige un modo de juego para empezar</p>
        </div>

        {/* Info card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-xs">
                {isConjugation ? "Tiempo" : "Modo"}
              </p>
              <p className="text-base font-bold text-foreground md:text-lg">
                {isConjugation ? tenseLabel : modeLabel}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">
                {topicWords.length} {isConjugation ? "conjugaciones" : "palabras"}
              </span>
            </div>
          </div>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {GAMES.map(({ type, desc, multiplier, emoji }) => (
            <button
              key={type}
              onClick={() => setActiveGame(type)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] group md:p-5"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl md:h-14 md:w-14">
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground md:text-base">{GAME_TYPE_LABELS[type]}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
                    <Zap className="h-2.5 w-2.5" /> {multiplier}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 md:text-sm">{desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => navigate("/ranking")}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Trophy className="h-4 w-4 text-primary" />
            Ver ranking
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
