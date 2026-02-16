import { useState } from "react";
import { Trophy, Star, Zap, ArrowLeft, ChevronDown, User, Globe, HelpCircle, X, Gamepad2, BookOpen, Target, Clock, Award, PenLine, Puzzle, ListChecks, Layers, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RankingEntry {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

interface WeekHistory {
  week: number;
  year: number;
  ranking: RankingEntry[];
  userRank: RankingEntry;
}

interface PersonalWeek {
  week: number;
  year: number;
  xp: number;
  correctAnswers: number;
  totalQuestions: number;
  gamesPlayed: number;
}

const MEDAL_STYLES: Record<number, { icon: string; bg: string; border: string }> = {
  1: { icon: "🥇", bg: "bg-gold/10", border: "border-gold/30" },
  2: { icon: "🥈", bg: "bg-silver/10", border: "border-silver/30" },
  3: { icon: "🥉", bg: "bg-bronze/10", border: "border-bronze/30" },
};

// Mock data
function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.ceil(diff / 604800000 + 1);
}

const CURRENT_WEEK = getCurrentWeekNumber();

const MOCK_CURRENT_RANKING: RankingEntry[] = [
  { rank: 1, name: "María López", xp: 2480, avatar: "👩‍🎓" },
  { rank: 2, name: "Carlos Ruiz", xp: 2210, avatar: "🧑‍💻" },
  { rank: 3, name: "Anna Schmidt", xp: 1950, avatar: "👩‍🏫" },
  { rank: 4, name: "Lukas Weber", xp: 1650, avatar: "🧑‍🎤" },
  { rank: 5, name: "Sophie Müller", xp: 1520, avatar: "👩‍🔬" },
];

const MOCK_USER_RANK: RankingEntry = { rank: 8, name: "Du", xp: 1120, avatar: "🙋", isCurrentUser: true };

const MOCK_HISTORY: WeekHistory[] = [
  {
    week: CURRENT_WEEK - 1, year: 2026,
    ranking: [
      { rank: 1, name: "Carlos Ruiz", xp: 2100, avatar: "🧑‍💻" },
      { rank: 2, name: "Anna Schmidt", xp: 1980, avatar: "👩‍🏫" },
      { rank: 3, name: "María López", xp: 1870, avatar: "👩‍🎓" },
      { rank: 4, name: "Sophie Müller", xp: 1600, avatar: "👩‍🔬" },
      { rank: 5, name: "Lukas Weber", xp: 1450, avatar: "🧑‍🎤" },
    ],
    userRank: { rank: 6, name: "Du", xp: 980, avatar: "🙋", isCurrentUser: true },
  },
  {
    week: CURRENT_WEEK - 2, year: 2026,
    ranking: [
      { rank: 1, name: "Anna Schmidt", xp: 2300, avatar: "👩‍🏫" },
      { rank: 2, name: "María López", xp: 2050, avatar: "👩‍🎓" },
      { rank: 3, name: "Carlos Ruiz", xp: 1900, avatar: "🧑‍💻" },
      { rank: 4, name: "Lukas Weber", xp: 1700, avatar: "🧑‍🎤" },
      { rank: 5, name: "Du", xp: 1550, avatar: "🙋", isCurrentUser: true },
    ],
    userRank: { rank: 5, name: "Du", xp: 1550, avatar: "🙋", isCurrentUser: true },
  },
];

const MOCK_PERSONAL: PersonalWeek[] = [
  { week: CURRENT_WEEK, year: 2026, xp: 1120, correctAnswers: 42, totalQuestions: 55, gamesPlayed: 6 },
  { week: CURRENT_WEEK - 1, year: 2026, xp: 980, correctAnswers: 38, totalQuestions: 50, gamesPlayed: 5 },
  { week: CURRENT_WEEK - 2, year: 2026, xp: 1550, correctAnswers: 58, totalQuestions: 70, gamesPlayed: 8 },
  { week: CURRENT_WEEK - 3, year: 2026, xp: 720, correctAnswers: 28, totalQuestions: 40, gamesPlayed: 4 },
];

function RankRow({ entry }: { entry: RankingEntry }) {
  const medal = MEDAL_STYLES[entry.rank];
  const isTop3 = entry.rank <= 3;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        entry.isCurrentUser
          ? "border-primary/30 bg-primary/5"
          : isTop3 && medal
          ? `${medal.border} ${medal.bg}`
          : "border-border bg-card"
      }`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
        {isTop3 && medal ? <span className="text-xl">{medal.icon}</span> : <span className="text-sm font-bold text-muted-foreground">{entry.rank}</span>}
      </div>
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-lg">{entry.avatar}</div>
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm font-semibold ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
          {entry.name}
          {entry.isCurrentUser && <span className="ml-1.5 text-xs text-primary/70">(Tú)</span>}
        </p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" />
        <span className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()}</span>
      </div>
    </div>
  );
}

const XP_PER_WORD = [
  { label: "Palabra «known»", xp: "+10 XP", desc: "Por cada palabra que dominas" },
  { label: "Palabra «learning»", xp: "+4 XP", desc: "Por cada palabra en progreso" },
];

const XP_BONUSES = [
  { icon: Award, title: "Precisión perfecta", xp: "+20 XP", desc: "100% known con ≥10 palabras" },
  { icon: Clock, title: "Bonus por tiempo", xp: "+5 XP/min", desc: "Máximo +30 XP (6 min jugados)" },
  { icon: LogIn, title: "Login diario", xp: "+15 XP", desc: "Una vez al día, al conectarte" },
];

const GAME_MULTIPLIERS = [
  { icon: PenLine, game: "Writing", mult: "×1.5", desc: "Máximo esfuerzo: escribir la palabra", color: "text-primary" },
  { icon: Puzzle, game: "Matching", mult: "×1.2", desc: "Emparejar correctamente", color: "text-accent" },
  { icon: ListChecks, game: "Multiple choice", mult: "×1.0", desc: "Base: elegir entre opciones", color: "text-muted-foreground" },
  { icon: Layers, game: "Flashcards", mult: "×0.4", desc: "Fácil de completar", color: "text-muted-foreground" },
];

const RANKING_RULES = [
  "El ranking se reinicia cada lunes a las 00:00",
  "Solo cuentan los XP de partidas (no login diario)",
  "Los empates se desempatan por precisión promedio",
  "El Top 5 se actualiza en tiempo real",
];

const RankingPage = () => {
  const [tab, setTab] = useState<"global" | "personal">("global");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);

  const toggleWeek = (week: number) => setExpandedWeek(expandedWeek === week ? null : week);

  const userInCurrentTop5 = MOCK_CURRENT_RANKING.some((e) => e.isCurrentUser);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <button onClick={() => window.history.back()} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Ranking Semanal</h1>
            <p className="text-xs text-muted-foreground">Semana {CURRENT_WEEK} · 2026</p>
          </div>
          <button
            onClick={() => setShowRules(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Cómo funciona el XP"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <Trophy className="h-5 w-5 text-gold" />
        </div>
      </header>

      {/* XP Rules Dialog */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl border-none bg-card p-0 shadow-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">Cómo se obtiene XP</DialogTitle>

          {/* Header */}
          <div className="relative flex flex-col items-center bg-gradient-to-br from-primary to-primary/60 px-6 pb-6 pt-8">
            <button
              onClick={() => setShowRules(false)}
              className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" fill="currentColor" />
            </div>
            <h2 className="text-xl font-extrabold text-white">¿Cómo gano XP?</h2>
            <p className="mt-1 text-sm text-white/70">Aprende, juega y sube en el ranking</p>
          </div>

          {/* Body */}
          <div className="space-y-5 px-5 pb-6 pt-5 max-h-[60vh] overflow-y-auto">
            {/* XP per word */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">XP por palabra</p>
              <div className="grid grid-cols-2 gap-2">
                {XP_PER_WORD.map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-card p-3 text-center">
                    <p className="text-lg font-extrabold text-primary">{item.xp}</p>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonuses */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bonificaciones</p>
              {XP_BONUSES.map((rule) => (
                <div key={rule.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <rule.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{rule.title}</p>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {rule.xp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Game Multipliers */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Multiplicador por juego</p>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                {GAME_MULTIPLIERS.map((gm, i) => (
                  <div key={gm.game} className={`flex items-center gap-3 px-4 py-3 ${i < GAME_MULTIPLIERS.length - 1 ? "border-b border-border" : ""}`}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <gm.icon className={`h-4 w-4 ${gm.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{gm.game}</p>
                      <p className="text-xs text-muted-foreground">{gm.desc}</p>
                    </div>
                    <span className={`text-lg font-extrabold ${gm.color}`}>{gm.mult}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranking Rules */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reglas del ranking</p>
              <div className="rounded-xl bg-muted/50 p-4 space-y-2.5">
                {RANKING_RULES.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowRules(false)}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              ¡Entendido! 💪
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mx-auto max-w-md px-4 py-5 space-y-5">
        {/* Tab Toggle */}
        <div className="flex rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setTab("global")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "global" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-4 w-4" />
            Global
          </button>
          <button
            onClick={() => setTab("personal")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "personal" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            Personal
          </button>
        </div>

        {tab === "global" ? (
          <>
            {/* Current week */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Esta semana</span>
              </div>
              <div className="space-y-2">
                {MOCK_CURRENT_RANKING.map((entry) => (
                  <RankRow key={entry.rank} entry={entry} />
                ))}
              </div>
              {!userInCurrentTop5 && (
                <div>
                  <div className="flex items-center justify-center gap-1 py-1">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  </div>
                  <RankRow entry={MOCK_USER_RANK} />
                </div>
              )}
            </section>

            {/* History accordion */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Semanas anteriores</h2>
              {MOCK_HISTORY.map((wh) => {
                const isOpen = expandedWeek === wh.week;
                const userInTop = wh.ranking.some((e) => e.isCurrentUser);
                return (
                  <div key={wh.week} className="rounded-xl border border-border bg-card overflow-hidden transition-all">
                    <button
                      onClick={() => toggleWeek(wh.week)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                          S{wh.week}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Semana {wh.week}</p>
                          <p className="text-xs text-muted-foreground">
                            Tu posición: #{wh.userRank.rank} · {wh.userRank.xp} XP
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-3 space-y-2 animate-accordion-down">
                        {wh.ranking.map((entry) => (
                          <RankRow key={entry.rank} entry={entry} />
                        ))}
                        {!userInTop && (
                          <div>
                            <div className="flex items-center justify-center gap-1 py-1">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            </div>
                            <RankRow entry={wh.userRank} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        ) : (
          /* Personal tab */
          <section className="space-y-3">
            {MOCK_PERSONAL.map((pw, i) => {
              const isCurrent = pw.week === CURRENT_WEEK;
              const prevWeek = MOCK_PERSONAL[i + 1];
              const xpDiff = prevWeek ? pw.xp - prevWeek.xp : 0;
              const pct = Math.round((pw.correctAnswers / pw.totalQuestions) * 100);

              return (
                <div
                  key={pw.week}
                  className={`rounded-xl border p-4 transition-all ${
                    isCurrent ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isCurrent && <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">Actual</span>}
                      <span className={`text-sm font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>Semana {pw.week}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-primary" fill="currentColor" />
                      <span className="text-lg font-extrabold text-foreground">{pw.xp.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">XP</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Precisión</p>
                      <p className="text-sm font-bold text-foreground">{pct}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Juegos</p>
                      <p className="text-sm font-bold text-foreground">{pw.gamesPlayed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">vs anterior</p>
                      <p className={`text-sm font-bold ${xpDiff > 0 ? "text-primary" : xpDiff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {xpDiff > 0 ? `+${xpDiff}` : xpDiff === 0 ? "—" : xpDiff}
                      </p>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
