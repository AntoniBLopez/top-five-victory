import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Gamepad2, Mail, Lock, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth backend
    navigate("/");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="text-base font-bold text-foreground md:text-lg">SpanischMitBelu</span>
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
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          {/* Hero icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <span className="text-4xl">🎮</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
              {isLogin ? "¡Willkommen zurück!" : "Erstelle dein Konto"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Melde dich an und lerne weiter Spanisch"
                : "Registriere dich und starte dein Spanisch-Abenteuer"}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Dein Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      👤
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="deine@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Passwort</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base font-bold rounded-xl">
                {isLogin ? "Los geht's! 🚀" : "Konto erstellen 🎉"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">oder</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl font-medium gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl font-medium gap-2"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.18-.04-.56-.04-.95 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.44zm2.033 17.86c-.07.14-.15.28-.24.42-.56.84-1.31 1.89-2.32 1.89-.88 0-1.17-.57-2.42-.57-1.26 0-1.6.55-2.42.59-1.08.04-1.9-1.15-2.46-1.98-1.63-2.42-1.84-5.27-.81-6.78.73-1.07 1.89-1.7 2.98-1.7 1.11 0 1.81.57 2.73.57.89 0 1.43-.57 2.71-.57.94 0 1.96.51 2.68 1.4-2.36 1.3-1.98 4.67.38 5.57-.46 1.17-.67 1.7-1.25 2.72z" />
                </svg>
                Apple
              </Button>
            </div>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "Noch kein Konto? " : "Schon ein Konto? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-primary hover:underline"
              >
                {isLogin ? "Jetzt registrieren!" : "Jetzt anmelden!"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
