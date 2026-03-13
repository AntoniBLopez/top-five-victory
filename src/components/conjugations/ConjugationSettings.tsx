import { Settings2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export interface ConjugationFilters {
  tenses: Record<string, boolean>;
  pronouns: Record<string, boolean>;
}

const TENSE_INFO: { key: string; label: string; example: string }[] = [
  { key: "Präsens", label: "Präsens", example: "ich gehe, du gehst…" },
  { key: "Präteritum", label: "Präteritum", example: "ich ging, du gingst…" },
  { key: "Perfekt", label: "Perfekt", example: "ich bin gegangen…" },
];

const PRONOUN_INFO: { key: string; label: string }[] = [
  { key: "ich", label: "ich" },
  { key: "du", label: "du" },
  { key: "er/sie", label: "er / sie / es" },
];

interface Props {
  filters: ConjugationFilters;
  onChange: (filters: ConjugationFilters) => void;
}

const ConjugationSettings = ({ filters, onChange }: Props) => {
  const toggleTense = (key: string) => {
    onChange({
      ...filters,
      tenses: { ...filters.tenses, [key]: !filters.tenses[key] },
    });
  };

  const togglePronoun = (key: string) => {
    onChange({
      ...filters,
      pronouns: { ...filters.pronouns, [key]: !filters.pronouns[key] },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <Settings2 className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-10 pt-6 max-h-[85dvh] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-lg font-extrabold text-foreground">
            Configuración
          </SheetTitle>
        </SheetHeader>

        {/* Tenses */}
        <div className="mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Tiempos verbales
          </p>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {TENSE_INFO.map(({ key, label, example }) => (
              <label
                key={key}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col gap-0.5 pr-4">
                  <span className="text-[15px] font-bold text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground italic">{example}</span>
                </div>
                <Switch
                  checked={filters.tenses[key] ?? true}
                  onCheckedChange={() => toggleTense(key)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Pronouns */}
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Pronombres
          </p>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
            {PRONOUN_INFO.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <span className="text-[15px] font-bold text-foreground">{label}</span>
                <Switch
                  checked={filters.pronouns[key] ?? true}
                  onCheckedChange={() => togglePronoun(key)}
                />
              </label>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const DEFAULT_FILTERS: ConjugationFilters = {
  tenses: { Präsens: true, Präteritum: true, Perfekt: true },
  pronouns: { ich: true, du: true, "er/sie": true },
};

export default ConjugationSettings;
