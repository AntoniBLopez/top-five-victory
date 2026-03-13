import { useState, useMemo } from "react";
import { ChevronDown, ChevronLeft, Search, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONJUGATION_BY_TENSE } from "@/data/mockConjugations";
import { WordsArray } from "@/types/game";
import BottomNav from "@/components/BottomNav";
import ConjugationSettings, {
  ConjugationFilters,
  DEFAULT_FILTERS,
} from "@/components/conjugations/ConjugationSettings";

interface VerbData {
  verb: string;
  tenses: Record<string, { pronoun: string; form: string }[]>;
}

function parseConjugations(): VerbData[] {
  const verbMap = new Map<string, Record<string, { pronoun: string; form: string }[]>>();
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
      const verb = match[1].trim();
      const pronoun = match[2].trim();
      const label = tenseLabels[tenseKey];

      if (!verbMap.has(verb)) verbMap.set(verb, {});
      const tenses = verbMap.get(verb)!;
      if (!tenses[label]) tenses[label] = [];
      tenses[label].push({ pronoun, form });
    }
  }

  return Array.from(verbMap.entries()).map(([verb, tenses]) => ({ verb, tenses }));
}

// Verb list view
const FREE_VERB_COUNT = 5;

const VerbListView = ({
  verbs,
  onSelect,
}: {
  verbs: VerbData[];
  onSelect: (verb: VerbData) => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = verbs.filter((v) =>
    v.verb.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar verbo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Verb list */}
      <div className="px-4 pt-2 pb-4 space-y-2">
        {/* Free verbs */}
        <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {filtered.slice(0, FREE_VERB_COUNT).map((verbData, i) => (
            <motion.button
              key={verbData.verb}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              onClick={() => onSelect(verbData)}
              className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-muted/40 active:bg-muted/60"
            >
              <span className="text-[15px] font-bold text-foreground">{verbData.verb}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
            </motion.button>
          ))}
        </div>

        {/* Locked verbs */}
        {filtered.length > FREE_VERB_COUNT && (
          <div className="divide-y divide-border/50 rounded-2xl border border-border/50 bg-card/50 overflow-hidden relative">
            {filtered.slice(FREE_VERB_COUNT).map((verbData, i) => (
              <motion.div
                key={verbData.verb}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="flex w-full items-center justify-between px-5 py-4 cursor-not-allowed select-none"
              >
                <span className="text-[15px] font-bold text-muted-foreground">{verbData.verb}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Lock className="h-3 w-3" />
                  PRO
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No se encontraron verbos
          </div>
        )}
      </div>
    </>
  );
};

// Verb detail view (inspired by reference images)
const VerbDetailView = ({
  verbData,
  onBack,
  filters,
}: {
  verbData: VerbData;
  onBack: () => void;
  filters: ConjugationFilters;
}) => {
  const [collapsedTenses, setCollapsedTenses] = useState<Set<string>>(new Set());

  const toggleTense = (tense: string) => {
    setCollapsedTenses((prev) => {
      const next = new Set(prev);
      if (next.has(tense)) next.delete(tense);
      else next.add(tense);
      return next;
    });
  };

  // Filter tenses and pronouns based on settings
  const filteredTenses = useMemo(() => {
    const result: Record<string, { pronoun: string; form: string }[]> = {};
    for (const [tense, forms] of Object.entries(verbData.tenses)) {
      if (!(filters.tenses[tense] ?? true)) continue;
      const filteredForms = forms.filter(
        ({ pronoun }) => filters.pronouns[pronoun] ?? true
      );
      if (filteredForms.length > 0) result[tense] = filteredForms;
    }
    return result;
  }, [verbData, filters]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
    >
      {/* Verb header */}
      <div className="sticky top-[53px] z-10 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-extrabold text-foreground">{verbData.verb}</h2>
        </div>
      </div>

      {/* Tense sections */}
      <div className="mx-auto max-w-2xl px-4 pt-4 pb-6 space-y-1">
        {Object.keys(filteredTenses).length === 0 && (
          <div className="px-1 py-8 text-center text-sm text-muted-foreground">
            No hay conjugaciones con los filtros actuales
          </div>
        )}
        {Object.entries(filteredTenses).map(([tense, forms]) => {
          const isCollapsed = collapsedTenses.has(tense);
          return (
            <div key={tense}>
              <button
                onClick={() => toggleTense(tense)}
                className="flex w-full items-center justify-between py-4"
              >
                <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
                  {tense}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border/60">
                      {forms.map(({ pronoun, form }, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-3.5 px-1"
                        >
                          <span className="text-sm text-muted-foreground">
                            <span className="text-muted-foreground/60 mr-1">›</span>
                            {pronoun}
                          </span>
                          <span className="text-[15px] font-bold text-foreground">
                            {form}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="border-b border-border" />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const ConjugationsPage = () => {
  const verbs = useMemo(parseConjugations, []);
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [filters, setFilters] = useState<ConjugationFilters>(DEFAULT_FILTERS);

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Top header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="w-9" />
          <h1 className="text-base font-bold text-foreground">Conjugaciones</h1>
          <ConjugationSettings filters={filters} onChange={setFilters} />
        </div>
      </header>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {selectedVerb ? (
            <VerbDetailView
              key={selectedVerb.verb}
              verbData={selectedVerb}
              onBack={() => setSelectedVerb(null)}
              filters={filters}
            />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <VerbListView verbs={verbs} onSelect={setSelectedVerb} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default ConjugationsPage;
