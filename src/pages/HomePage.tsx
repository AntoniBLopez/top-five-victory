import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, PenLine, Sun, Moon, Flame, Gamepad2, Crown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import SuperUpgradeDialog from "@/components/SuperUpgradeDialog";
const MOCK_STREAK = 7;

const MODES = [
  {
    id: "vocabulario",
    label: "Vocabulario",
    desc: "Aprende y repasa palabras en alemán con juegos interactivos",
    emoji: "📚",
    icon: BookOpen,
    route: "/games/vocabulario",
  },
  {
    id: "conjugaciones",
    label: "Conjugaciones",
    desc: "Practica las conjugaciones verbales en alemán con ejercicios",
    emoji: "✏️",
    icon: PenLine,
    route: "/games/conjugaciones",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showSuper, setShowSuper] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="text-base font-bold text-foreground md:text-lg">SpanischMitBelu</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSuper(true)}
              className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-accent px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <Crown className="h-3.5 w-3.5" />
              Super
            </button>
            <div className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-accent-foreground">{MOCK_STREAK}</span>
            </div>
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
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 pb-8 pt-8 md:px-6 md:pt-16">
        <div className="mb-10 text-center md:mb-14">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 md:h-20 md:w-20">
            <Gamepad2 className="h-8 w-8 text-primary md:h-10 md:w-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">¿Qué quieres practicar?</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">Elige un modo para comenzar a aprender</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {MODES.map(({ id, label, desc, emoji, route }) => (
            <button
              key={id}
              onClick={() => navigate(route)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg active:scale-[0.98] md:p-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-4xl md:h-20 md:w-20 md:text-5xl">
                {emoji}
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground md:text-xl">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
