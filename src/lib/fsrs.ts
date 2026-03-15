/**
 * Local FSRS (Free Spaced Repetition Scheduler) implementation.
 * Stores card data in localStorage with real interval scheduling.
 */

// ── Types ──
export type Rating = "again" | "hard" | "good" | "easy";
export type CardStatus = "new" | "learning" | "review" | "relearning";

export interface FSRSCard {
  id: string; // unique: "verb:tense:pronoun" or "sentence:idx"
  type: "sentence" | "table";
  status: CardStatus;
  // FSRS parameters
  stability: number; // days until ~90% recall probability
  difficulty: number; // 0-10
  interval: number; // days
  due: string; // ISO date string
  reps: number;
  lapses: number;
  lastReview: string | null;
  // Content ref
  verb: string;
  tense: string;
  pronoun?: string;
}

export interface FSRSStats {
  totalCards: number;
  dueToday: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  streak: number;
  totalReviewed: number;
  retentionRate: number;
  xpToday: number;
  masteredCards: number;
}

export interface ReviewLog {
  cardId: string;
  rating: Rating;
  timestamp: string;
  correct: boolean;
}

export interface TenseProgress {
  tense: string;
  mastered: number;
  total: number;
}

export interface WeakSpot {
  verb: string;
  tense: string;
  pronoun: string;
  accuracy: number;
}

// ── Constants ──
const STORAGE_KEY = "fsrs_cards";
const LOG_KEY = "fsrs_logs";
const STREAK_KEY = "fsrs_streak";
const XP_KEY = "fsrs_xp";

const DESIRED_RETENTION = 0.9;
const INITIAL_STABILITY = 0.5;
const INITIAL_DIFFICULTY = 5;

// ── FSRS Math ──
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function nextInterval(stability: number): number {
  // interval = S * (1/R - 1)^(1/decay) where decay ≈ -0.5
  // Simplified: interval ≈ S * 9^(1/decay) for R=0.9
  return Math.max(1, Math.round(stability * 9));
}

function updateStability(card: FSRSCard, rating: Rating): number {
  const ratingMultipliers: Record<Rating, number> = {
    again: 0.2,
    hard: 0.8,
    good: 1.0,
    easy: 1.3,
  };
  
  const multiplier = ratingMultipliers[rating];
  
  if (card.status === "new" || card.status === "learning") {
    // New/learning cards get base stability
    const baseStabilities: Record<Rating, number> = {
      again: 0.1,
      hard: 0.5,
      good: 1.5,
      easy: 4.0,
    };
    return baseStabilities[rating];
  }
  
  // Review cards: S' = S * multiplier * (1 + factor)
  const factor = Math.log(card.interval + 1) * 0.1;
  return Math.max(0.1, card.stability * multiplier * (1 + factor));
}

function updateDifficulty(current: number, rating: Rating): number {
  const adjustments: Record<Rating, number> = {
    again: 1.5,
    hard: 0.5,
    good: -0.2,
    easy: -1.0,
  };
  return clamp(current + adjustments[rating], 1, 10);
}

// ── Storage ──
function loadCards(): FSRSCard[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCards(cards: FSRSCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function loadLogs(): ReviewLog[] {
  try {
    const data = localStorage.getItem(LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: ReviewLog[]) {
  // Keep last 1000 logs
  localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-1000)));
}

// ── Streak ──
interface StreakData {
  current: number;
  lastDate: string; // YYYY-MM-DD
}

function loadStreak(): StreakData {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { current: 0, lastDate: "" };
  } catch {
    return { current: 0, lastDate: "" };
  }
}

function saveStreak(streak: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function updateStreak(): number {
  const streak = loadStreak();
  const today = todayStr();
  
  if (streak.lastDate === today) return streak.current;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  
  if (streak.lastDate === yesterdayStr) {
    streak.current += 1;
  } else if (streak.lastDate !== today) {
    streak.current = 1;
  }
  streak.lastDate = today;
  saveStreak(streak);
  return streak.current;
}

// ── XP ──
interface XPData {
  date: string;
  xp: number;
}

function loadXP(): XPData {
  try {
    const data = localStorage.getItem(XP_KEY);
    const parsed = data ? JSON.parse(data) : { date: "", xp: 0 };
    if (parsed.date !== todayStr()) return { date: todayStr(), xp: 0 };
    return parsed;
  } catch {
    return { date: todayStr(), xp: 0 };
  }
}

function addXP(amount: number): number {
  const xpData = loadXP();
  xpData.xp += amount;
  xpData.date = todayStr();
  localStorage.setItem(XP_KEY, JSON.stringify(xpData));
  return xpData.xp;
}

function ratingToXP(rating: Rating): number {
  const xpMap: Record<Rating, number> = { again: 2, hard: 5, good: 10, easy: 15 };
  return xpMap[rating];
}

// ── Card Management ──
export function initializeCards(
  sentenceCards: { id: string; verb: string; tense: string; pronoun: string }[],
  tableCards: { id: string; verb: string; tense: string }[]
): void {
  const existing = loadCards();
  const existingIds = new Set(existing.map((c) => c.id));
  const now = new Date().toISOString();
  
  const newCards: FSRSCard[] = [];
  
  for (const s of sentenceCards) {
    if (!existingIds.has(s.id)) {
      newCards.push({
        id: s.id,
        type: "sentence",
        status: "new",
        stability: INITIAL_STABILITY,
        difficulty: INITIAL_DIFFICULTY,
        interval: 0,
        due: now,
        reps: 0,
        lapses: 0,
        lastReview: null,
        verb: s.verb,
        tense: s.tense,
        pronoun: s.pronoun,
      });
    }
  }
  
  for (const t of tableCards) {
    if (!existingIds.has(t.id)) {
      newCards.push({
        id: t.id,
        type: "table",
        status: "new",
        stability: INITIAL_STABILITY,
        difficulty: INITIAL_DIFFICULTY,
        interval: 0,
        due: now,
        reps: 0,
        lapses: 0,
        lastReview: null,
        verb: t.verb,
        tense: t.tense,
      });
    }
  }
  
  if (newCards.length > 0) {
    saveCards([...existing, ...newCards]);
  }
}

export function getDueCards(limit?: number): FSRSCard[] {
  const cards = loadCards();
  const now = new Date();
  
  const due = cards
    .filter((c) => new Date(c.due) <= now)
    .sort((a, b) => {
      // Priority: relearning > learning > new > review
      const statusOrder: Record<CardStatus, number> = {
        relearning: 0,
        learning: 1,
        new: 2,
        review: 3,
      };
      const orderDiff = statusOrder[a.status] - statusOrder[b.status];
      if (orderDiff !== 0) return orderDiff;
      // Then by due date (oldest first)
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });
  
  return limit ? due.slice(0, limit) : due;
}

export function reviewCard(cardId: string, rating: Rating, correct: boolean): FSRSCard | null {
  const cards = loadCards();
  const idx = cards.findIndex((c) => c.id === cardId);
  if (idx === -1) return null;
  
  const card = { ...cards[idx] };
  const now = new Date();
  
  // Update FSRS parameters
  card.difficulty = updateDifficulty(card.difficulty, rating);
  card.stability = updateStability(card, rating);
  card.reps += 1;
  card.lastReview = now.toISOString();
  
  if (rating === "again") {
    card.lapses += 1;
    card.status = card.status === "new" ? "learning" : "relearning";
    // Short interval: 1-10 minutes
    const minutes = Math.min(10, card.lapses * 2 + 1);
    const dueDate = new Date(now.getTime() + minutes * 60 * 1000);
    card.due = dueDate.toISOString();
    card.interval = 0;
  } else if (rating === "hard") {
    if (card.status === "new" || card.status === "learning") {
      card.status = "learning";
      // 6 minutes
      card.due = new Date(now.getTime() + 6 * 60 * 1000).toISOString();
      card.interval = 0;
    } else {
      card.status = "review";
      const interval = Math.max(1, Math.round(card.interval * 1.2));
      card.interval = interval;
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + interval);
      card.due = dueDate.toISOString();
    }
  } else if (rating === "good") {
    if (card.status === "new" || card.status === "learning") {
      card.status = "review";
      card.interval = 1;
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 1);
      card.due = dueDate.toISOString();
    } else {
      card.status = "review";
      const interval = nextInterval(card.stability);
      card.interval = interval;
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + interval);
      card.due = dueDate.toISOString();
    }
  } else {
    // easy
    card.status = "review";
    const interval = Math.max(card.interval + 1, nextInterval(card.stability) * 1.3);
    card.interval = Math.round(interval);
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + card.interval);
    card.due = dueDate.toISOString();
  }
  
  cards[idx] = card;
  saveCards(cards);
  
  // Log
  const logs = loadLogs();
  logs.push({ cardId, rating, timestamp: now.toISOString(), correct });
  saveLogs(logs);
  
  // XP
  addXP(ratingToXP(rating));
  
  // Streak
  updateStreak();
  
  return card;
}

// ── Interval labels for rating buttons ──
export function getNextIntervalLabel(card: FSRSCard, rating: Rating): string {
  if (rating === "again") {
    const minutes = Math.min(10, (card.lapses + 1) * 2 + 1);
    return `${minutes} min`;
  }
  if (rating === "hard") {
    if (card.status === "new" || card.status === "learning") return "6 min";
    const interval = Math.max(1, Math.round(card.interval * 1.2));
    return interval === 1 ? "1 día" : `${interval} días`;
  }
  if (rating === "good") {
    if (card.status === "new" || card.status === "learning") return "1 día";
    const interval = nextInterval(card.stability);
    return interval === 1 ? "1 día" : `${interval} días`;
  }
  // easy
  const interval = Math.max(
    (card.interval || 1) + 1,
    Math.round(nextInterval(card.stability) * 1.3)
  );
  return interval === 1 ? "1 día" : `${interval} días`;
}

// ── Stats ──
export function getStats(): FSRSStats {
  const cards = loadCards();
  const logs = loadLogs();
  const now = new Date();
  const today = todayStr();
  
  const dueCards = cards.filter((c) => new Date(c.due) <= now);
  const todayLogs = logs.filter((l) => l.timestamp.startsWith(today));
  const correctToday = todayLogs.filter((l) => l.correct).length;
  
  const streak = loadStreak();
  const xpData = loadXP();
  
  // Retention: from last 100 reviews
  const recent = logs.slice(-100);
  const recentCorrect = recent.filter((l) => l.correct).length;
  const retentionRate = recent.length > 0 ? Math.round((recentCorrect / recent.length) * 100) : 0;
  
  // Mastered: interval >= 21 days
  const mastered = cards.filter((c) => c.interval >= 21);
  
  return {
    totalCards: cards.length,
    dueToday: dueCards.length,
    newCards: cards.filter((c) => c.status === "new").length,
    learningCards: cards.filter((c) => c.status === "learning" || c.status === "relearning").length,
    reviewCards: cards.filter((c) => c.status === "review").length,
    streak: streak.lastDate === today || streak.lastDate === (() => {
      const y = new Date(); y.setDate(y.getDate() - 1); return y.toISOString().split("T")[0];
    })() ? streak.current : 0,
    totalReviewed: todayLogs.length,
    retentionRate,
    xpToday: xpData.xp,
    masteredCards: mastered.length,
  };
}

export function getTenseProgress(): TenseProgress[] {
  const cards = loadCards();
  const tenseMap: Record<string, { mastered: number; total: number }> = {};
  
  for (const card of cards) {
    if (!tenseMap[card.tense]) tenseMap[card.tense] = { mastered: 0, total: 0 };
    tenseMap[card.tense].total++;
    if (card.interval >= 21) tenseMap[card.tense].mastered++;
  }
  
  return Object.entries(tenseMap).map(([tense, data]) => ({
    tense,
    ...data,
  }));
}

export function getWeakSpots(limit = 4): WeakSpot[] {
  const logs = loadLogs();
  const cards = loadCards();
  
  // Calculate accuracy per card from logs
  const cardAccuracy: Record<string, { correct: number; total: number }> = {};
  for (const log of logs.slice(-500)) {
    if (!cardAccuracy[log.cardId]) cardAccuracy[log.cardId] = { correct: 0, total: 0 };
    cardAccuracy[log.cardId].total++;
    if (log.correct) cardAccuracy[log.cardId].correct++;
  }
  
  const spots: WeakSpot[] = [];
  for (const [cardId, acc] of Object.entries(cardAccuracy)) {
    if (acc.total < 2) continue; // Need at least 2 reviews
    const pct = Math.round((acc.correct / acc.total) * 100);
    if (pct >= 80) continue; // Not weak
    const card = cards.find((c) => c.id === cardId);
    if (!card) continue;
    spots.push({
      verb: card.verb,
      tense: card.tense,
      pronoun: card.pronoun || "",
      accuracy: pct,
    });
  }
  
  return spots.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LOG_KEY);
  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(XP_KEY);
}
