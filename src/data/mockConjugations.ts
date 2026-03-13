import { WordsArray } from "@/types/game";

export type TenseId = "prasens" | "prateritum" | "perfekt" | "alle";

export interface TenseOption {
  id: TenseId;
  label: string;
  emoji: string;
  desc: string;
}

export const TENSE_OPTIONS: TenseOption[] = [
  { id: "alle", label: "Todos los tiempos", emoji: "🌟", desc: "Practica todas las conjugaciones mezcladas" },
  { id: "prasens", label: "Präsens", emoji: "🔵", desc: "Presente simple: ich gehe, du gehst…" },
  { id: "prateritum", label: "Präteritum", emoji: "🟠", desc: "Pasado simple: ich ging, du gingst…" },
  { id: "perfekt", label: "Perfekt", emoji: "🟢", desc: "Pasado compuesto: ich bin gegangen…" },
];

// Format: ["infinitivo — pronombre (tiempo)", "forma conjugada"]
const PRASENS_WORDS: WordsArray[] = [
  ["sein — ich (Präsens)", "bin"],
  ["sein — du (Präsens)", "bist"],
  ["sein — er/sie (Präsens)", "ist"],
  ["haben — ich (Präsens)", "habe"],
  ["haben — du (Präsens)", "hast"],
  ["haben — er/sie (Präsens)", "hat"],
  ["gehen — ich (Präsens)", "gehe"],
  ["gehen — du (Präsens)", "gehst"],
  ["kommen — ich (Präsens)", "komme"],
  ["kommen — du (Präsens)", "kommst"],
  ["machen — ich (Präsens)", "mache"],
  ["machen — du (Präsens)", "machst"],
  ["sprechen — ich (Präsens)", "spreche"],
  ["sprechen — du (Präsens)", "sprichst"],
  ["sprechen — er/sie (Präsens)", "spricht"],
  ["schreiben — ich (Präsens)", "schreibe"],
  ["schreiben — du (Präsens)", "schreibst"],
  ["schreiben — er/sie (Präsens)", "schreibt"],
  ["lesen — ich (Präsens)", "lese"],
  ["lesen — du (Präsens)", "liest"],
  ["lesen — er/sie (Präsens)", "liest"],
  ["sehen — ich (Präsens)", "sehe"],
  ["sehen — du (Präsens)", "siehst"],
  ["sehen — er/sie (Präsens)", "sieht"],
  ["fahren — ich (Präsens)", "fahre"],
  ["fahren — du (Präsens)", "fährst"],
  ["fahren — er/sie (Präsens)", "fährt"],
];

const PRATERITUM_WORDS: WordsArray[] = [
  ["sein — ich (Präteritum)", "war"],
  ["sein — du (Präteritum)", "warst"],
  ["sein — er/sie (Präteritum)", "war"],
  ["haben — ich (Präteritum)", "hatte"],
  ["haben — du (Präteritum)", "hattest"],
  ["haben — er/sie (Präteritum)", "hatte"],
  ["gehen — ich (Präteritum)", "ging"],
  ["gehen — du (Präteritum)", "gingst"],
  ["kommen — ich (Präteritum)", "kam"],
  ["kommen — du (Präteritum)", "kamst"],
  ["machen — ich (Präteritum)", "machte"],
  ["machen — du (Präteritum)", "machtest"],
  ["sprechen — ich (Präteritum)", "sprach"],
  ["sprechen — du (Präteritum)", "sprachst"],
  ["sprechen — er/sie (Präteritum)", "sprach"],
  ["schreiben — ich (Präteritum)", "schrieb"],
  ["schreiben — du (Präteritum)", "schriebst"],
  ["schreiben — er/sie (Präteritum)", "schrieb"],
  ["lesen — ich (Präteritum)", "las"],
  ["lesen — du (Präteritum)", "last"],
  ["lesen — er/sie (Präteritum)", "las"],
  ["sehen — ich (Präteritum)", "sah"],
  ["sehen — du (Präteritum)", "sahst"],
  ["sehen — er/sie (Präteritum)", "sah"],
  ["fahren — ich (Präteritum)", "fuhr"],
  ["fahren — du (Präteritum)", "fuhrst"],
  ["fahren — er/sie (Präteritum)", "fuhr"],
];

const PERFEKT_WORDS: WordsArray[] = [
  ["sein — ich (Perfekt)", "bin gewesen"],
  ["sein — du (Perfekt)", "bist gewesen"],
  ["haben — ich (Perfekt)", "habe gehabt"],
  ["haben — du (Perfekt)", "hast gehabt"],
  ["gehen — ich (Perfekt)", "bin gegangen"],
  ["gehen — du (Perfekt)", "bist gegangen"],
  ["kommen — ich (Perfekt)", "bin gekommen"],
  ["kommen — du (Perfekt)", "bist gekommen"],
  ["machen — ich (Perfekt)", "habe gemacht"],
  ["machen — du (Perfekt)", "hast gemacht"],
  ["sprechen — ich (Perfekt)", "habe gesprochen"],
  ["sprechen — du (Perfekt)", "hast gesprochen"],
  ["schreiben — ich (Perfekt)", "habe geschrieben"],
  ["schreiben — du (Perfekt)", "hast geschrieben"],
  ["lesen — ich (Perfekt)", "habe gelesen"],
  ["lesen — du (Perfekt)", "hast gelesen"],
  ["sehen — ich (Perfekt)", "habe gesehen"],
  ["sehen — du (Perfekt)", "hast gesehen"],
  ["fahren — ich (Perfekt)", "bin gefahren"],
  ["fahren — du (Perfekt)", "bist gefahren"],
];

export const CONJUGATION_BY_TENSE: Record<string, WordsArray[]> = {
  prasens: PRASENS_WORDS,
  prateritum: PRATERITUM_WORDS,
  perfekt: PERFEKT_WORDS,
  alle: [...PRASENS_WORDS, ...PRATERITUM_WORDS, ...PERFEKT_WORDS],
};

// Legacy export for backward compat
export const MOCK_CONJUGATION_WORDS: WordsArray[] = PRASENS_WORDS;
