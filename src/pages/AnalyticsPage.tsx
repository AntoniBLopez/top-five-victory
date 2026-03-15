import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, BarChart3, Target, Brain, Zap, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RechartsTooltip, Cell, PieChart, Pie,
} from "recharts";
import BottomNav from "@/components/BottomNav";
import {
  getStats,
  getDailyActivity,
  getRetentionOverTime,
  getVerbMasteryMap,
  getCardStatusDistribution,
  getTenseProgress,
} from "@/lib/fsrs";

const STATUS_COLORS: Record<string, string> = {
  new: "hsl(var(--muted-foreground))",
  learning: "hsl(var(--primary))",
  review: "hsl(142 71% 45%)",
  relearning: "hsl(var(--destructive))",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevas",
  learning: "Aprendiendo",
  review: "Repaso",
  relearning: "Re-aprendiendo",
};

const MASTERY_COLORS = [
  { min: 21, color: "bg-emerald-500", label: "Dominado" },
  { min: 7, color: "bg-primary", label: "Conocido" },
  { min: 1, color: "bg-amber-500", label: "Aprendiendo" },
  { min: 0, color: "bg-muted", label: "Nuevo" },
];

function getMasteryColor(interval: number): string {
  if (interval >= 21) return "bg-emerald-500";
  if (interval >= 7) return "bg-primary";
  if (interval >= 1) return "bg-amber-500";
  return "bg-muted";
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const stats = useMemo(() => getStats(), []);
  const activity = useMemo(() => getDailyActivity(14), []);
  const retention = useMemo(() => getRetentionOverTime(14), []);
  const verbMastery = useMemo(() => getVerbMasteryMap(), []);
  const statusDist = useMemo(() => getCardStatusDistribution(), []);
  const tenseProgress = useMemo(() => getTenseProgress(), []);

  const pieData = Object.entries(statusDist)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: STATUS_LABELS[key],
      value,
      fill: STATUS_COLORS[key],
    }));

  const allTenses = Array.from(new Set(verbMastery.flatMap((v) => Object.keys(v.tenses))));

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate("/conjugations")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Analíticas</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 px-4 pt-6">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { icon: Target, label: "Retención", value: `${stats.retentionRate}%`, color: "text-primary" },
            { icon: Brain, label: "Dominadas", value: `${stats.masteredCards}`, color: "text-emerald-500" },
            { icon: Zap, label: "XP hoy", value: `${stats.xpToday}`, color: "text-amber-500" },
            { icon: Calendar, label: "Racha", value: `${stats.streak} días`, color: "text-destructive" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <div>
                <p className="text-lg font-extrabold text-foreground">{item.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-extrabold text-foreground">Actividad diaria</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateShort}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  labelFormatter={formatDateShort}
                />
                <Bar dataKey="correct" name="Correctas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" name="Total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Retention Curve */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-extrabold text-foreground">Curva de retención</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retention}>
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateShort}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  tickFormatter={(v) => `${v}%`}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  labelFormatter={formatDateShort}
                  formatter={(value: number) => [`${value}%`, "Retención"]}
                />
                <Area
                  type="monotone"
                  dataKey="retention"
                  stroke="hsl(142 71% 45%)"
                  strokeWidth={2}
                  fill="url(#retentionGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="mb-4 text-sm font-extrabold text-foreground">Distribución de tarjetas</h2>
          <div className="flex items-center gap-4">
            <div className="h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                  <span className="text-xs font-bold text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tense Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="mb-4 text-sm font-extrabold text-foreground">Progreso por tiempo verbal</h2>
          <div className="space-y-3">
            {tenseProgress.map((t) => {
              const pct = t.total > 0 ? Math.round((t.mastered / t.total) * 100) : 0;
              return (
                <div key={t.tense}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{t.tense}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Verb Mastery Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="mb-1 text-sm font-extrabold text-foreground">Mapa de dominio por verbo</h2>
          <div className="mb-4 flex flex-wrap gap-3">
            {MASTERY_COLORS.map((m) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-sm ${m.color}`} />
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
          {verbMastery.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="pb-2 pr-3 text-left font-bold text-muted-foreground">Verbo</th>
                    {allTenses.map((t) => (
                      <th key={t} className="pb-2 px-1 text-center font-bold text-muted-foreground whitespace-nowrap">
                        {t.slice(0, 4)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verbMastery.slice(0, 15).map((v) => (
                    <tr key={v.verb}>
                      <td className="py-1 pr-3 font-bold text-foreground whitespace-nowrap">{v.verb}</td>
                      {allTenses.map((t) => {
                        const data = v.tenses[t];
                        const colorClass = data ? getMasteryColor(data.interval) : "bg-muted/30";
                        return (
                          <td key={t} className="px-1 py-1">
                            <div className={`mx-auto h-5 w-8 rounded ${colorClass}`} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground">
              Completa sesiones de repaso para ver tu mapa de dominio
            </p>
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AnalyticsPage;
