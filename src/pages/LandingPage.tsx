import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gamepad2, BookOpen, PenLine, Trophy, Zap, Globe, Star, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const FEATURES = [
  {
    icon: BookOpen,
    emoji: "📚",
    title: "Vocabulario interactivo",
    desc: "Aprende palabras nuevas con flashcards, matching y más juegos divertidos.",
  },
  {
    icon: PenLine,
    emoji: "✏️",
    title: "Conjugaciones",
    desc: "Domina los tiempos verbales con ejercicios prácticos y repetición espaciada.",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    title: "Ranking & Rachas",
    desc: "Compite con otros estudiantes y mantén tu racha diaria para ganar XP.",
  },
  {
    icon: Zap,
    emoji: "⚡",
    title: "Aprende jugando",
    desc: "4 modos de juego diferentes que hacen que aprender sea adictivo.",
  },
];

const STATS = [
  { value: "500+", label: "Palabras" },
  { value: "4", label: "Modos de juego" },
  { value: "3", label: "Tiempos verbales" },
  { value: "∞", label: "Diversión" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Gamepad2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-extrabold text-foreground md:text-lg">SpanischMitBelu</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
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
              onClick={() => navigate("/auth")}
              className="rounded-xl text-sm font-bold"
            >
              Empezar gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 pb-16 pt-16 md:px-8 md:pb-28 md:pt-28">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-20 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary"
          >
            <Globe className="h-4 w-4" />
            Aprende español jugando
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl font-extrabold leading-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Aprende español{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              de forma divertida
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl"
          >
            Vocabulario, conjugaciones y mucho más — todo con juegos interactivos
            diseñados para que aprender español sea tan divertido como efectivo.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="h-12 rounded-xl px-8 text-base font-bold gap-2 w-full sm:w-auto"
            >
              Comenzar ahora <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-12 rounded-xl px-8 text-base font-semibold w-full sm:w-auto"
            >
              Ver cómo funciona
            </Button>
          </motion.div>

          {/* Floating emojis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 flex justify-center gap-4 text-4xl md:gap-6 md:text-5xl"
          >
            {["🇪🇸", "🎮", "📖", "🏆", "🔥"].map((emoji, i) => (
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="text-center"
            >
              <p className="text-3xl font-extrabold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="mb-12 text-center md:mb-16"
          >
            <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
              Todo lo que necesitas para aprender
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Herramientas diseñadas para hacer tu aprendizaje más efectivo y divertido
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
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

      {/* Game Modes Preview */}
      <section className="border-y border-border bg-card/30 px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
              4 modos de juego
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              Cada juego entrena una habilidad diferente
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { emoji: "🃏", label: "Flashcards" },
              { emoji: "🧩", label: "Matching" },
              { emoji: "❓", label: "Multiple Choice" },
              { emoji: "✍️", label: "Escritura" },
            ].map((game, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md md:p-6"
              >
                <span className="text-4xl md:text-5xl">{game.emoji}</span>
                <span className="text-sm font-bold text-foreground">{game.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Social proof */}
      <section className="px-4 py-16 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <div className="mb-6 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-foreground italic md:text-xl lg:text-2xl">
              "Aprender español nunca fue tan divertido. Los juegos hacen que quiera practicar todos los días."
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">
              — Estudiante de SpanischMitBelu
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 md:px-8 md:pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center md:p-14"
        >
          <h2 className="text-2xl font-extrabold text-foreground md:text-4xl">
            ¿Listo para aprender español?
          </h2>
          <p className="mt-3 text-muted-foreground md:text-lg">
            Empieza gratis hoy y descubre la forma más divertida de aprender.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="mt-6 h-12 rounded-xl px-10 text-base font-bold gap-2"
          >
            Crear cuenta gratis <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center md:flex-row">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">SpanischMitBelu</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SpanischMitBelu. Hecho con 💚 para aprender español.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
