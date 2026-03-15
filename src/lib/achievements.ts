/**
 * Achievement / Badge system with localStorage persistence.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: "streak" | "mastery" | "volume" | "accuracy" | "speed";
  tier: "bronze" | "silver" | "gold" | "diamond";
  requirement: number; // threshold value
  check: (ctx: AchievementContext) => boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO date
  seen: boolean;
}

export interface AchievementContext {
  streak: number;
  totalReviewed: number;
  totalReviewedAllTime: number;
  masteredCards: number;
  retentionRate: number;
  perfectSessions: number;
  totalSessions: number;
  xpToday: number;
  totalXP: number;
}

const STORAGE_KEY = "achievements_unlocked";
const CONTEXT_KEY = "achievements_context";

// ── Achievement Definitions ──
export const ACHIEVEMENTS: Achievement[] = [
  // Streak
  { id: "streak_3", title: "Constancia", description: "3 días de racha", emoji: "🔥", category: "streak", tier: "bronze", requirement: 3, check: (c) => c.streak >= 3 },
  { id: "streak_7", title: "Semana perfecta", description: "7 días de racha", emoji: "⚡", category: "streak", tier: "silver", requirement: 7, check: (c) => c.streak >= 7 },
  { id: "streak_14", title: "Imparable", description: "14 días de racha", emoji: "🌟", category: "streak", tier: "gold", requirement: 14, check: (c) => c.streak >= 14 },
  { id: "streak_30", title: "Leyenda mensual", description: "30 días de racha", emoji: "👑", category: "streak", tier: "diamond", requirement: 30, check: (c) => c.streak >= 30 },

  // Volume (total reviews all-time)
  { id: "reviews_10", title: "Primer paso", description: "Revisar 10 tarjetas", emoji: "📝", category: "volume", tier: "bronze", requirement: 10, check: (c) => c.totalReviewedAllTime >= 10 },
  { id: "reviews_50", title: "Estudiante", description: "Revisar 50 tarjetas", emoji: "📚", category: "volume", tier: "silver", requirement: 50, check: (c) => c.totalReviewedAllTime >= 50 },
  { id: "reviews_200", title: "Dedicado", description: "Revisar 200 tarjetas", emoji: "🎓", category: "volume", tier: "gold", requirement: 200, check: (c) => c.totalReviewedAllTime >= 200 },
  { id: "reviews_500", title: "Maestro del repaso", description: "Revisar 500 tarjetas", emoji: "🏅", category: "volume", tier: "diamond", requirement: 500, check: (c) => c.totalReviewedAllTime >= 500 },

  // Mastery
  { id: "master_5", title: "Primeros dominios", description: "Dominar 5 conjugaciones", emoji: "🌱", category: "mastery", tier: "bronze", requirement: 5, check: (c) => c.masteredCards >= 5 },
  { id: "master_15", title: "En crecimiento", description: "Dominar 15 conjugaciones", emoji: "🌿", category: "mastery", tier: "silver", requirement: 15, check: (c) => c.masteredCards >= 15 },
  { id: "master_30", title: "Experto verbal", description: "Dominar 30 conjugaciones", emoji: "🌳", category: "mastery", tier: "gold", requirement: 30, check: (c) => c.masteredCards >= 30 },
  { id: "master_50", title: "Maestro absoluto", description: "Dominar 50 conjugaciones", emoji: "💎", category: "mastery", tier: "diamond", requirement: 50, check: (c) => c.masteredCards >= 50 },

  // Accuracy
  { id: "accuracy_80", title: "Buen ojo", description: "80% de retención", emoji: "🎯", category: "accuracy", tier: "bronze", requirement: 80, check: (c) => c.retentionRate >= 80 && c.totalReviewedAllTime >= 20 },
  { id: "accuracy_90", title: "Precisión quirúrgica", description: "90% de retención", emoji: "💫", category: "accuracy", tier: "silver", requirement: 90, check: (c) => c.retentionRate >= 90 && c.totalReviewedAllTime >= 30 },
  { id: "accuracy_95", title: "Casi perfecto", description: "95% de retención", emoji: "✨", category: "accuracy", tier: "gold", requirement: 95, check: (c) => c.retentionRate >= 95 && c.totalReviewedAllTime >= 50 },

  // Perfect sessions
  { id: "perfect_1", title: "Sesión perfecta", description: "1 sesión con 100%", emoji: "⭐", category: "speed", tier: "bronze", requirement: 1, check: (c) => c.perfectSessions >= 1 },
  { id: "perfect_5", title: "Perfeccionista", description: "5 sesiones perfectas", emoji: "🏆", category: "speed", tier: "silver", requirement: 5, check: (c) => c.perfectSessions >= 5 },
  { id: "perfect_10", title: "Sin errores", description: "10 sesiones perfectas", emoji: "💯", category: "speed", tier: "gold", requirement: 10, check: (c) => c.perfectSessions >= 10 },

  // XP milestones
  { id: "xp_100", title: "Primeros puntos", description: "Ganar 100 XP total", emoji: "⚡", category: "volume", tier: "bronze", requirement: 100, check: (c) => c.totalXP >= 100 },
  { id: "xp_500", title: "Acumulador", description: "Ganar 500 XP total", emoji: "💰", category: "volume", tier: "silver", requirement: 500, check: (c) => c.totalXP >= 500 },
  { id: "xp_1000", title: "XP millonario", description: "Ganar 1000 XP total", emoji: "🤑", category: "volume", tier: "gold", requirement: 1000, check: (c) => c.totalXP >= 1000 },
];

// ── Storage ──
function loadUnlocked(): UnlockedAchievement[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveUnlocked(data: UnlockedAchievement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadContext(): AchievementContext {
  try {
    const data = localStorage.getItem(CONTEXT_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return {
    streak: 0, totalReviewed: 0, totalReviewedAllTime: 0,
    masteredCards: 0, retentionRate: 0, perfectSessions: 0,
    totalSessions: 0, xpToday: 0, totalXP: 0,
  };
}

export function saveContext(ctx: AchievementContext) {
  localStorage.setItem(CONTEXT_KEY, JSON.stringify(ctx));
}

export function updateContextFromStats(stats: {
  streak: number; totalReviewed: number; masteredCards: number;
  retentionRate: number; xpToday: number;
}): AchievementContext {
  const prev = loadContext();
  const ctx: AchievementContext = {
    ...prev,
    streak: stats.streak,
    totalReviewed: stats.totalReviewed,
    totalReviewedAllTime: prev.totalReviewedAllTime + stats.totalReviewed - prev.totalReviewed,
    masteredCards: stats.masteredCards,
    retentionRate: stats.retentionRate,
    xpToday: stats.xpToday,
    totalXP: prev.totalXP + (stats.xpToday - prev.xpToday),
  };
  // Fix: ensure allTime only increases
  if (ctx.totalReviewedAllTime < prev.totalReviewedAllTime) {
    ctx.totalReviewedAllTime = prev.totalReviewedAllTime;
  }
  if (ctx.totalXP < prev.totalXP) ctx.totalXP = prev.totalXP;
  saveContext(ctx);
  return ctx;
}

export function recordPerfectSession() {
  const ctx = loadContext();
  ctx.perfectSessions += 1;
  ctx.totalSessions += 1;
  saveContext(ctx);
}

export function recordSession() {
  const ctx = loadContext();
  ctx.totalSessions += 1;
  saveContext(ctx);
}

// ── Check & Unlock ──
export function checkAchievements(ctx: AchievementContext): Achievement[] {
  const unlocked = loadUnlocked();
  const unlockedIds = new Set(unlocked.map((u) => u.id));
  const newlyUnlocked: Achievement[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (unlockedIds.has(ach.id)) continue;
    if (ach.check(ctx)) {
      unlocked.push({ id: ach.id, unlockedAt: new Date().toISOString(), seen: false });
      newlyUnlocked.push(ach);
    }
  }

  if (newlyUnlocked.length > 0) saveUnlocked(unlocked);
  return newlyUnlocked;
}

export function getUnlockedAchievements(): UnlockedAchievement[] {
  return loadUnlocked();
}

export function markAchievementSeen(id: string) {
  const unlocked = loadUnlocked();
  const item = unlocked.find((u) => u.id === id);
  if (item) { item.seen = true; saveUnlocked(unlocked); }
}

export function getUnseenAchievements(): Achievement[] {
  const unlocked = loadUnlocked();
  const unseen = unlocked.filter((u) => !u.seen);
  return unseen
    .map((u) => ACHIEVEMENTS.find((a) => a.id === u.id))
    .filter(Boolean) as Achievement[];
}

export function getAchievementProgress(): {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0-100
}[] {
  const unlocked = loadUnlocked();
  const unlockedMap = new Map(unlocked.map((u) => [u.id, u]));
  const ctx = loadContext();

  return ACHIEVEMENTS.map((ach) => {
    const u = unlockedMap.get(ach.id);
    let current = 0;
    switch (ach.category) {
      case "streak": current = ctx.streak; break;
      case "volume":
        if (ach.id.startsWith("xp")) current = ctx.totalXP;
        else current = ctx.totalReviewedAllTime;
        break;
      case "mastery": current = ctx.masteredCards; break;
      case "accuracy": current = ctx.retentionRate; break;
      case "speed": current = ctx.perfectSessions; break;
    }
    const progress = Math.min(100, Math.round((current / ach.requirement) * 100));
    return {
      achievement: ach,
      unlocked: !!u,
      unlockedAt: u?.unlockedAt,
      progress: u ? 100 : progress,
    };
  });
}

// Tier colors
export const TIER_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  bronze: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-600 dark:text-orange-400" },
  silver: { bg: "bg-slate-400/10", border: "border-slate-400/30", text: "text-slate-600 dark:text-slate-300" },
  gold: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-600 dark:text-yellow-400" },
  diamond: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400" },
};

export function getUserLevel(ctx: AchievementContext): { level: number; title: string; xpForNext: number; xpInLevel: number } {
  const thresholds = [
    { level: 1, title: "Principiante", xp: 0 },
    { level: 2, title: "Aprendiz", xp: 50 },
    { level: 3, title: "Estudiante", xp: 150 },
    { level: 4, title: "Intermedio", xp: 350 },
    { level: 5, title: "Avanzado", xp: 600 },
    { level: 6, title: "Experto", xp: 1000 },
    { level: 7, title: "Maestro", xp: 1500 },
    { level: 8, title: "Gran Maestro", xp: 2500 },
    { level: 9, title: "Leyenda", xp: 4000 },
    { level: 10, title: "Diamante", xp: 6000 },
  ];

  let current = thresholds[0];
  let next = thresholds[1];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (ctx.totalXP >= thresholds[i].xp) {
      current = thresholds[i];
      next = thresholds[i + 1] || { level: 11, title: "∞", xp: current.xp + 5000 };
      break;
    }
  }

  return {
    level: current.level,
    title: current.title,
    xpForNext: next.xp - current.xp,
    xpInLevel: ctx.totalXP - current.xp,
  };
}
