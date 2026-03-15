import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  Search,
  Lock,
  Flame,
  Zap,
  Brain,
  TrendingUp,
  BookOpen,
  Play,
  Target,
  Clock,
  Trophy,
  ChevronRight,
  Settings2,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONJUGATION_BY_TENSE } from "@/data/mockConjugations";
import { WordsArray } from "@/types/game";
import BottomNav from "@/components/BottomNav";
import ConjugationSettings, {
  ConjugationFilters,
  DEFAULT_FILTERS,
} from "@/components/conjugations/ConjugationSettings";
import { Progress } from "@/components/ui/progress";
import {
  getStats,
  getTenseProgress,
  getWeakSpots,
  initializeCards,
  getOnboardingData,
  type FSRSStats,
  type TenseProgress as TenseProgressType,
  type WeakSpot,
} from "@/lib/fsrs";
import { MOCK_SENTENCES, generateTableClozeCards } from "@/data/mockSentences";
import DailyStreakPopup from "@/components/DailyStreakPopup";

const TENSE_COLORS: Record<string, { emoji: string; color: string }> = {
  "Präsens": { emoji: "🔵", color: "from-blue-500 to-cyan-400" },
  "Präteritum": { emoji: "🟠", color: "from-orange-500 to-amber-400" },
  "Perfekt": { emoji: "🟢", color: "from-emerald-500 to-green-400" },
};

// ── Types ──
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

// ── Dashboard View ──
const DashboardView = ({ onStartReview, onOpenLibrary }: { onStartReview: () => void; onOpenLibrary: () => void }) => {
  const navigate = useNavigate();
  const stats = useMemo(() => getStats(), []);
  const tenseProgress = useMemo(() => getTenseProgress(), []);
  const weakSpots = useMemo(() => getWeakSpots(), []);
  const onboarding = useMemo(() => getOnboardingData(), []);
  const dailyGoal = onboarding?.dailyGoal || 20;
  const dailyProgress = Math.min(Math.round((stats.totalReviewed / dailyGoal) * 100), 100);

  return (
    <div className="space-y-6 px-4 pb-8 pt-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground"
      >
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stats.streak}</p>
                <p className="text-xs font-medium text-white/70">días de racha</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">{stats.xpToday} XP hoy</span>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <span className="text-3xl">📋</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{stats.dueToday}</p>
              <p className="text-sm font-medium text-white/80">conjugaciones pendientes</p>
            </div>
          </div>

          <button
            onClick={onStartReview}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-extrabold text-primary shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <Play className="h-5 w-5" />
            Iniciar Smart Review
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
          <Target className="h-5 w-5 text-primary" />
          <p className="text-xl font-extrabold text-foreground">{stats.retentionRate}%</p>
          <p className="text-[10px] font-medium text-muted-foreground">Retención</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
          <Brain className="h-5 w-5 text-primary" />
          <p className="text-xl font-extrabold text-foreground">{stats.masteredCards}</p>
          <p className="text-[10px] font-medium text-muted-foreground">Dominados</p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-4">
          <Clock className="h-5 w-5 text-primary" />
          <p className="text-xl font-extrabold text-foreground">{stats.totalReviewed}</p>
          <p className="text-[10px] font-medium text-muted-foreground">Revisadas</p>
        </div>
      </motion.div>

      {/* Daily Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Objetivo diario</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {stats.totalReviewed}/{dailyGoal}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dailyProgress}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`h-full rounded-full ${dailyProgress >= 100 ? "bg-emerald-500" : "bg-primary"}`}
          />
        </div>
        {dailyProgress >= 100 && (
          <p className="mt-2 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            🎉 ¡Objetivo cumplido!
          </p>
        )}
      </motion.div>

      {/* Tense Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-foreground">Progreso por tiempo verbal</h2>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {tenseProgress.map((tense) => {
            const pct = tense.total > 0 ? Math.round((tense.mastered / tense.total) * 100) : 0;
            const colors = TENSE_COLORS[tense.tense] || { emoji: "📘", color: "from-primary to-primary/70" };
            return (
              <div key={tense.tense} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{colors.emoji}</span>
                    <span className="text-sm font-bold text-foreground">{tense.tense}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    {tense.mastered}/{tense.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${colors.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Weak Spots Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-foreground">Puntos débiles</h2>
          <Trophy className="h-4 w-4 text-accent" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {weakSpots.length > 0 ? weakSpots.map((spot, i) => (
            <div
              key={i}
              className="flex min-w-[140px] flex-col gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
            >
              <p className="text-sm font-extrabold text-foreground">{spot.verb}</p>
              <p className="text-[10px] font-medium text-muted-foreground">
                {spot.pronoun} · {spot.tense}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-destructive"
                    style={{ width: `${spot.accuracy}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-destructive">{spot.accuracy}%</span>
              </div>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground py-4">Completa algunas sesiones para ver tus puntos débiles</p>
          )}
        </div>
      </motion.div>

      {/* Achievements CTA */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        onClick={() => navigate("/achievements")}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 active:bg-muted/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
            <Trophy className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">Logros y niveles</p>
            <p className="text-xs text-muted-foreground">Desbloquea badges y sube de nivel</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </motion.button>

      {/* Analytics CTA */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.37 }}
        onClick={() => navigate("/analytics")}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 active:bg-muted/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">Analíticas y progreso</p>
            <p className="text-xs text-muted-foreground">Gráficos de retención y dominio</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </motion.button>

      {/* Verb Library CTA */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        onClick={onOpenLibrary}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40 active:bg-muted/60"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-foreground">Biblioteca de verbos</p>
            <p className="text-xs text-muted-foreground">Consulta todas las conjugaciones</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </motion.button>
    </div>
  );
};

// ── Verb List View ──
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

      <div className="px-4 pt-2 pb-4">
        <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {filtered.map((verbData, i) => {
            const isLocked = i >= FREE_VERB_COUNT;
            return isLocked ? (
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
            ) : (
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
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No se encontraron verbos
          </div>
        )}
      </div>
    </>
  );
};

// ── Verb Detail View ──
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

// ── Main Page ──
type PageView = "dashboard" | "library" | "verbDetail";

const ConjugationsPage = () => {
  const navigate = useNavigate();
  const verbs = useMemo(parseConjugations, []);
  const [view, setView] = useState<PageView>("dashboard");
  const [selectedVerb, setSelectedVerb] = useState<VerbData | null>(null);
  const [filters, setFilters] = useState<ConjugationFilters>(DEFAULT_FILTERS);
  const [showStreak, setShowStreak] = useState(false);
  const streakStats = useMemo(() => getStats(), []);

  // Redirect to onboarding if not completed
  useEffect(() => {
    const onboarding = getOnboardingData();
    if (!onboarding) {
      navigate("/conjugations/onboarding", { replace: true });
      return;
    }
    // Show streak popup once per session
    if (streakStats.streak > 0 && !sessionStorage.getItem("streak_shown_conj")) {
      sessionStorage.setItem("streak_shown_conj", "1");
      setShowStreak(true);
    }
  }, [navigate, streakStats.streak]);

  // Initialize FSRS cards on mount
  useEffect(() => {
    const onboarding = getOnboardingData();
    if (!onboarding) return;

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
  }, []);

  const handleStartReview = () => {
    navigate("/conjugations/review");
  };

  const handleSelectVerb = (verb: VerbData) => {
    setSelectedVerb(verb);
    setView("verbDetail");
  };

  const handleBackToLibrary = () => {
    setSelectedVerb(null);
    setView("library");
  };

  const handleBackToDashboard = () => {
    setSelectedVerb(null);
    setView("dashboard");
  };

  const getHeaderTitle = () => {
    switch (view) {
      case "dashboard": return "Conjugaciones";
      case "library": return "Biblioteca de verbos";
      case "verbDetail": return "";
      default: return "Conjugaciones";
    }
  };

  const showBackButton = view === "library";

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Top header */}
      {view !== "verbDetail" && (
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            {showBackButton ? (
              <button
                onClick={handleBackToDashboard}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}
            <h1 className="text-base font-bold text-foreground">{getHeaderTitle()}</h1>
            {view === "library" ? (
              <ConjugationSettings filters={filters} onChange={setFilters} />
            ) : (
              <div className="w-9" />
            )}
          </div>
        </header>
      )}

      <div className="mx-auto max-w-2xl">
        <AnimatePresence mode="wait">
          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardView
                onStartReview={handleStartReview}
                onOpenLibrary={() => setView("library")}
              />
            </motion.div>
          )}

          {view === "library" && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
            >
              <VerbListView verbs={verbs} onSelect={handleSelectVerb} />
            </motion.div>
          )}

          {view === "verbDetail" && selectedVerb && (
            <VerbDetailView
              key={selectedVerb.verb}
              verbData={selectedVerb}
              onBack={handleBackToLibrary}
              filters={filters}
            />
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default ConjugationsPage;
