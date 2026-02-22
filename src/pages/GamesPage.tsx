import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, PenLine, Layers, Grid3X3, Zap, ChevronRight, Trophy, Gamepad2 } from "lucide-react";
import { GameType, GAME_TYPE_LABELS } from "@/types/game";
import { MOCK_TOPIC_WORDS } from "@/data/mockWords";
import FlashcardGame from "@/components/games/FlashcardGame";
import MultipleChoiceGame from "@/components/games/MultipleChoiceGame";
import WritingGame from "@/components/games/WritingGame";
import MatchingGame from "@/components/games/MatchingGame";
import EndGameScreen from "@/components/games/EndGameScreen";

const GAMES: { type: GameType; icon: typeof BookOpen; desc: string; multiplier: string; emoji: string }[] = [
  { type: "flashcards", icon: Layers, desc: "Repasa tarjetas y marca las que conoces", multiplier: "×0.4", emoji: "🃏" },
  { type: "multiplechoice", icon: Grid3X3, desc: "Elige la traducción correcta entre 4 opciones", multiplier: "×1.0", emoji: "🎯" },
  { type: "writing", icon: PenLine, desc: "Escribe la traducción correcta en alemán", multiplier: "×1.5", emoji: "✍️" },
  { type: "matching", icon: BookOpen, desc: "Conecta palabras con su traducción", multiplier: "×1.2", emoji: "🔗" },
];

const GamesPage = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [results, setResults] = useState<{ known: string[]; learning: string[] } | null>(null);

  const handleComplete = (known: string[], learning: string[]) => {
    setResults({ known, learning });
    setGameFinished(true);
  };

  const handleRestart = () => {
    setGameFinished(false);
    setResults(null);
  };

  const handleBack = () => {
    setActiveGame(null);
    setGameFinished(false);
    setResults(null);
  };

  // End game screen
  if (gameFinished && results && activeGame) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4">
        <EndGameScreen
          knownCount={results.known.length}
          learningCount={results.learning.length}
          topicWords={MOCK_TOPIC_WORDS}
          restart={handleRestart}
          gameType={activeGame}
          onGoHome={handleBack}
        />
      </div>
    );
  }

  // Active game
  if (activeGame) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 md:px-6">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="h-5 w-5 text-foreground rotate-180" />
            </button>
            <h1 className="text-base font-bold text-foreground md:text-lg">{GAME_TYPE_LABELS[activeGame]}</h1>
          </div>
        </header>

        <main className="flex flex-1 items-start justify-center py-6 md:py-10 md:items-center">
          <div className="w-full">
            {activeGame === "flashcards" && <FlashcardGame topicWords={MOCK_TOPIC_WORDS} onComplete={handleComplete} />}
            {activeGame === "multiplechoice" && <MultipleChoiceGame topicWords={MOCK_TOPIC_WORDS} onComplete={handleComplete} />}
            {activeGame === "writing" && <WritingGame topicWords={MOCK_TOPIC_WORDS} onComplete={handleComplete} />}
            {activeGame === "matching" && <MatchingGame topicWords={MOCK_TOPIC_WORDS} onComplete={handleComplete} />}
          </div>
        </main>
      </div>
    );
  }

  // Game selection hub
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Desktop: centered card layout. Mobile: full-width */}
      <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 md:px-6 md:pt-12">
        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 md:h-20 md:w-20">
            <Gamepad2 className="h-8 w-8 text-primary md:h-10 md:w-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">Practica vocabulario</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">Elige un modo de juego para empezar</p>
        </div>

        {/* Topic info card */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:text-xs">Tema</p>
              <p className="text-base font-bold text-foreground md:text-lg">Vocabulario básico</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">{MOCK_TOPIC_WORDS.length} palabras</span>
            </div>
          </div>
        </div>

        {/* Game cards — 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {GAMES.map(({ type, icon: Icon, desc, multiplier, emoji }) => (
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

        {/* Footer nav */}
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
