import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, BookOpen, Target, Trophy, Zap, ArrowRight, Sun, Moon, Star, BarChart3, Flame, Shield, Download } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import AppDownloadPopup from "@/components/AppDownloadPopup";
import pulpoMascot from "@/assets/pulpo-mascot.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const STATS = [
  { value: "10.400", label: "Cards contextuales" },
  { value: "650+", label: "Verbos alemanes" },
  { value: "88-92%", label: "Retención real" },
  { value: "16", label: "Tiempos verbales" },
];

const FEATURES = [
  {
    emoji: "🧠",
    icon: Brain,
    title: "FSRS Inteligente",
    desc: "Algoritmo de repetición espaciada de última generación que programa tus repasos en el momento óptimo para maximizar la retención.",
  },
  {
    emoji: "📋",
    icon: BookOpen,
    title: "Table-Cloze Contextual",
    desc: "Practica tablas completas de conjugación con huecos inteligentes — aprende patrones, no formas aisladas.",
  },
  {
    emoji: "💬",
    icon: Target,
    title: "Sentence-Cloze",
    desc: "Oraciones reales con contexto para transferencia directa al habla. Mucho más efectivo que memorizar listas.",
  },
  {
    emoji: "🎯",
    icon: BarChart3,
    title: "Weak-Spot Priority",
    desc: "El sistema detecta tus puntos débiles y los prioriza automáticamente. Practica donde más lo necesitas.",
  },
  {
    emoji: "🔥",
    icon: Flame,
    title: "Gamificación avanzada",
    desc: "Rachas, XP, niveles y 22 logros desbloqueables. Aprende sin sentir que estudias.",
  },
  {
    emoji: "📊",
    icon: Shield,
    title: "Analíticas de progreso",
    desc: "Curvas de retención, mapas de dominio por verbo y estadísticas avanzadas en tiempo real.",
  },
];

const COMPARISON = [
  { criteria: "Cards totales", traditional: "62.400", verboflow: "~10.400", winner: "verboflow" },
  { criteria: "Contexto real", traditional: "Bajo", verboflow: "Alto", winner: "verboflow" },
  { criteria: "Retención estimada", traditional: "75-82%", verboflow: "88-92%", winner: "verboflow" },
  { criteria: "Riesgo de burnout", traditional: "Muy alto", verboflow: "Bajo", winner: "verboflow" },
  { criteria: "Transferencia al habla", traditional: "Limitada", verboflow: "Directa", winner: "verboflow" },
];

const HOW_IT_WORKS = [
  { step: "1", emoji: "🎯", title: "Test de calibración", desc: "Un test rápido de 24 preguntas determina tu nivel actual y configura tu plan personalizado." },
  { step: "2", emoji: "🧠", title: "Smart Review diario", desc: "El algoritmo FSRS selecciona las cards óptimas: table-cloze para patrones, sentence-cloze para contexto." },
  { step: "3", emoji: "📈", title: "Progreso adaptativo", desc: "Weak-spots se priorizan automáticamente. Tus analíticas muestran retención real y dominio por verbo." },
  { step: "4", emoji: "🏆", title: "Dominio total", desc: "Desbloquea logros, mantén tu racha y alcanza >88% de retención real en conjugaciones alemanas." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("vf-download-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowDownload(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseDownload = () => {
    setShowDownload(false);
    sessionStorage.setItem("vf-download-dismissed", "1");
  };

  return (
    <div className="min-h-[100dvh] bg-background overflow-x-hidden">
      <AppDownloadPopup open={showDownload} onClose={handleCloseDownload} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <img src={pulpoMascot} alt="VerboFlow" className="h-8 w-8 rounded-xl object-cover ring-1 ring-primary/20" />
            <span className="text-base font-extrabold text-foreground md:text-lg">VerboFlow</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowDownload(true)}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Descargar app"
            >
              <Download className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-foreground" />
              )}
            </button>
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-sm font-semibold"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={() => navigate("/conjugations")}
              className="rounded-xl text-sm font-bold"
            >
              Empezar gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-16 md:px-8 md:pb-28 md:pt-28">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-20 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden" animate="visible" custom={0} variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary"
          >
            <Zap className="h-4 w-4" />
            Sistema Contextual Cloze + FSRS · 2026
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="text-4xl font-extrabold leading-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Domina las conjugaciones{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              alemanas de verdad
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl leading-relaxed"
          >
            El único sistema basado en{" "}
            <span className="font-bold text-foreground">Table-Cloze + Sentence-Cloze + FSRS</span>{" "}
            — la combinación que logra &gt;88% de retención real según la investigación de 2026.
            Solo ~10.400 cards inteligentes, no 62.000 formas aisladas.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate("/conjugations")}
              className="h-14 rounded-2xl px-10 text-base font-extrabold gap-2 w-full sm:w-auto"
            >
              Comenzar Smart Review <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="h-14 rounded-2xl px-10 text-base font-semibold w-full sm:w-auto"
            >
              Cómo funciona
            </Button>
          </motion.div>

          {/* Floating emojis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex justify-center gap-4 text-4xl md:gap-6 md:text-5xl"
          >
            {["🇩🇪", "🧠", "📋", "💬", "🔥"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3, ease: "easeInOut" }}
                className="inline-block"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              custom={i} variants={fadeUp}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={fadeUp}
            className="mb-12 text-center md:mb-16"
          >
            <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
              Cómo funciona VerboFlow
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              4 pasos hacia el dominio real de las conjugaciones
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg md:p-8"
              >
                <div className="absolute -right-4 -top-4 text-7xl opacity-[0.06] font-extrabold text-foreground">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform group-hover:scale-110">
                    {item.emoji}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/30 px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={fadeUp}
            className="mb-12 text-center md:mb-16"
          >
            <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
              Tecnología que marca la diferencia
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Basado en Ella Verbs, KOFI Method y papers de retención 2025-2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg md:p-8"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform group-hover:scale-110">
                  {f.emoji}
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={fadeUp}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
              ¿Por qué no 62.000 cards?
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Más cards ≠ mejor aprendizaje. La ciencia lo confirma.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={1} variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="grid grid-cols-3 border-b border-border bg-muted/50 px-4 py-3 md:px-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Criterio</span>
              <span className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">Tradicional</span>
              <span className="text-center text-xs font-bold text-primary uppercase tracking-wider">VerboFlow</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 items-center px-4 py-3.5 md:px-6 ${i < COMPARISON.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-sm font-medium text-foreground">{row.criteria}</span>
                <span className="text-center text-sm text-muted-foreground">{row.traditional}</span>
                <span className="text-center text-sm font-bold text-primary">{row.verboflow}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-y border-border bg-card/30 px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            custom={0} variants={fadeUp}
          >
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-foreground italic md:text-xl lg:text-2xl leading-relaxed">
              "Después de probar decks de Anki con 50.000+ cards y abandonar tres veces, VerboFlow fue la primera vez que sentí que realmente retenía las conjugaciones. La mezcla de table-cloze y oraciones en contexto es genial."
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">
              — Estudiante de alemán, nivel B1
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 md:px-8 md:py-28">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          custom={0} variants={fadeUp}
          className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 text-center md:p-14"
        >
          <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
            ¿Listo para dominar las conjugaciones?
          </h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Test de calibración de 3 minutos → plan personalizado → retención &gt;88%.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/conjugations")}
            className="mt-8 h-14 rounded-2xl px-10 text-base font-extrabold gap-2"
          >
            Empezar ahora — es gratis <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Sin cuenta requerida. Tus datos se guardan localmente.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center md:flex-row">
          <div className="flex items-center gap-2">
            <img src={pulpoMascot} alt="VerboFlow" className="h-5 w-5 rounded object-cover" />
            <span className="text-sm font-bold text-foreground">VerboFlow</span>
            <span className="text-xs text-muted-foreground">by SpanischMitBelu</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VerboFlow · Contextual Cloze FSRS · Hecho con 💚
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
