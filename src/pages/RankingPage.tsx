import { useState } from "react";
import { Trophy, Star, Zap, ArrowLeft, ChevronDown, User, Globe } from "lucide-react";

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

const RankingPage = () => {
  const [tab, setTab] = useState<"global" | "personal">("global");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

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
          <Trophy className="h-5 w-5 text-gold" />
        </div>
      </header>

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
