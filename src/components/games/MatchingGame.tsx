import { useState, useMemo } from "react";
import { WordsArray } from "@/types/game";
import { Check, ChevronRight, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  topicWords: WordsArray[];
  onComplete: (known: string[], learning: string[]) => void;
}

interface Cell {
  id: string;
  text: string;
  pairId: number;
  lang: "es" | "de";
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PAIRS_PER_PAGE = 6;

const MatchingGame = ({ topicWords, onComplete }: Props) => {
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(topicWords.length / PAIRS_PER_PAGE);
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState<Cell | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [hoveredPair, setHoveredPair] = useState<number | null>(null);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [learningWords, setLearningWords] = useState<string[]>([]);
  const [errorCounts, setErrorCounts] = useState<Record<number, number>>({});
  const [showTip, setShowTip] = useState(true);

  const pageWords = topicWords.slice(pageIndex * PAIRS_PER_PAGE, (pageIndex + 1) * PAIRS_PER_PAGE);

  const cells = useMemo(() => {
    const result: Cell[] = [];
    pageWords.forEach((pair, i) => {
      result.push({ id: `es-${i}`, text: pair[0], pairId: i, lang: "es" });
      result.push({ id: `de-${i}`, text: pair[1], pairId: i, lang: "de" });
    });
    return shuffleArray(result);
  }, [pageIndex, topicWords]);

  const handleSelect = (cell: Cell) => {
    if (matchedPairs.has(cell.pairId) || wrongPair) return;

    if (!selected) { setSelected(cell); return; }
    if (selected.id === cell.id) { setSelected(null); return; }
    if (selected.lang === cell.lang) { setSelected(cell); return; }

    if (selected.pairId === cell.pairId) {
      setMatchedPairs((prev) => new Set([...prev, cell.pairId]));
      const germanWord = pageWords[cell.pairId][1];
      if ((errorCounts[cell.pairId] || 0) === 0) {
        setKnownWords((prev) => [...prev, germanWord]);
      } else {
        setLearningWords((prev) => [...prev, germanWord]);
      }
      setSelected(null);
    } else {
      setWrongPair([selected.id, cell.id]);
      setErrorCounts((prev) => ({
        ...prev,
        [selected.pairId]: (prev[selected.pairId] || 0) + 1,
        [cell.pairId]: (prev[cell.pairId] || 0) + 1,
      }));
      setTimeout(() => { setWrongPair(null); setSelected(null); }, 600);
    }
  };

  const allMatched = matchedPairs.size === pageWords.length;

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((i) => i + 1);
      setMatchedPairs(new Set());
      setSelected(null);
      setErrorCounts({});
    } else {
      onComplete(knownWords, learningWords);
    }
  };

  const totalMatched = knownWords.length + learningWords.length;
  const progress = (totalMatched / topicWords.length) * 100;

  const getCellStyle = (cell: Cell) => {
    if (matchedPairs.has(cell.pairId) && hoveredPair === cell.pairId) return "border-primary bg-primary/25 text-primary scale-[1.02] shadow-md ring-2 ring-primary/30";
    if (matchedPairs.has(cell.pairId)) return "border-primary/30 bg-primary/10 text-primary opacity-60 scale-95";
    if (wrongPair && (wrongPair[0] === cell.id || wrongPair[1] === cell.id)) return "border-destructive bg-destructive/10 text-destructive animate-shake";
    if (selected?.id === cell.id) return "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 scale-[1.02]";
    return "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-md";
  };

  const renderColumn = (lang: "es" | "de", label: string) => (
    <div className="space-y-2 md:space-y-3">
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center mb-1 md:text-xs">{label}</span>
      {cells.filter(c => c.lang === lang).map((cell) => (
        <button
          key={cell.id}
          onClick={() => !matchedPairs.has(cell.pairId) && handleSelect(cell)}
          onMouseEnter={() => matchedPairs.has(cell.pairId) && setHoveredPair(cell.pairId)}
          onMouseLeave={() => setHoveredPair(null)}
          className={`w-full rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-all duration-200 md:px-4 md:py-3.5 md:text-sm ${getCellStyle(cell)}`}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{cell.text}</span>
            {matchedPairs.has(cell.pairId) && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 md:h-4 md:w-4" />}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4 md:gap-6">
      {/* Progress */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Grupo {pageIndex + 1}/{totalPages}</span>
          <span>{totalMatched}/{topicWords.length} parejas</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center md:text-sm">
        Conecta cada palabra con su traducción
      </p>

      {/* Grid */}
      <div className="w-full grid grid-cols-2 gap-2 md:gap-4">
        {renderColumn("es", "Español")}
        {renderColumn("de", "Deutsch")}
      </div>

      {allMatched && (
        <button
          onClick={handleNextPage}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 animate-slide-up active:scale-[0.97] md:py-3.5"
          style={{ opacity: 0, animationDelay: "0s" }}
        >
          {pageIndex < totalPages - 1 ? (
            <>Siguiente grupo <ChevronRight className="h-4 w-4" /></>
          ) : "Ver resultados"}
        </button>
      )}
    </div>
  );
};

export default MatchingGame;
