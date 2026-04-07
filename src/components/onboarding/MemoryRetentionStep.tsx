import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MemoryRetentionStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CHART_DATA = [
  { day: "Hoy", noReview: 100, smartReview: 100 },
  { day: "1d", noReview: 58, smartReview: 97 },
  { day: "3d", noReview: 35, smartReview: 95 },
  { day: "7d", noReview: 25, smartReview: 92 },
  { day: "14d", noReview: 18, smartReview: 90 },
  { day: "30d", noReview: 12, smartReview: 89 },
  { day: "3m", noReview: 5, smartReview: 88 },
];

const MemoryRetentionStep = ({ onNext, onBack }: MemoryRetentionStepProps) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.3 }}
    className="px-6"
  >
    {/* Header */}
    <div className="mb-6 text-center">
      <h2 className="text-xl font-extrabold text-foreground leading-tight">¿Qué nos diferencia?</h2>
      <p className="mt-1 text-lg font-bold text-primary">Memoria que perdura a largo plazo</p>
      <p className="mt-2 text-sm text-muted-foreground">
        No es memorización bruta. Es ciencia aplicada a tu aprendizaje.
      </p>
    </div>

    {/* Chart */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-4 pb-2"
    >
      <p className="mb-1 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        % Retención a lo largo del tiempo
      </p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={CHART_DATA}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientSmart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradientNo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(160, 15%, 90%)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "hsl(210, 10%, 50%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "hsl(210, 10%, 50%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ReferenceLine
              y={88}
              stroke="hsl(162, 63%, 41%)"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            {/* No review area */}
            <Area
              type="monotone"
              dataKey="noReview"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              strokeOpacity={0.6}
              fill="url(#gradientNo)"
              dot={false}
              animationDuration={1200}
              animationBegin={300}
            />
            {/* Smart Review area */}
            <Area
              type="monotone"
              dataKey="smartReview"
              stroke="hsl(162, 63%, 41%)"
              strokeWidth={2.5}
              fill="url(#gradientSmart)"
              dot={false}
              animationDuration={1200}
              animationBegin={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 flex justify-center gap-5 pb-1">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-5 rounded-full bg-destructive/60" />
          <span className="text-[10px] text-muted-foreground">Sin repaso</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-5 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground">Con Smart Review</span>
        </div>
      </div>
    </motion.div>

    {/* Annotation */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3"
    >
      <span className="text-2xl font-black text-primary">&gt;88%</span>
      <span className="text-xs text-muted-foreground leading-tight">
        de retención a largo plazo · Basado en +200 estudios de spaced repetition y benchmarks reales
      </span>
    </motion.div>

    {/* Navigation */}
    <div className="mt-6 flex gap-3">
      <Button variant="outline" onClick={onBack} className="h-12 flex-1 rounded-2xl font-bold gap-1">
        <ArrowLeft className="h-4 w-4" /> Atrás
      </Button>
      <Button onClick={onNext} className="h-12 flex-[2] rounded-2xl font-extrabold gap-1">
        Siguiente <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

export default MemoryRetentionStep;
