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
];

export const CONJUGATION_BY_TENSE: Record<string, WordsArray[]> = {
  prasens: PRASENS_WORDS,
  prateritum: PRATERITUM_WORDS,
  perfekt: PERFEKT_WORDS,
  alle: [...PRASENS_WORDS, ...PRATERITUM_WORDS, ...PERFEKT_WORDS],
};

// Legacy export for backward compat
export const MOCK_CONJUGATION_WORDS: WordsArray[] = PRASENS_WORDS;
