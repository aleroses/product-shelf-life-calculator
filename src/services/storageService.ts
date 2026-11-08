import { STORAGE_KEYS } from '../constants/storageKeys';
import { DEFAULT_SAFETY_MARGIN } from '../constants/levels';
import type {
  UserProfile,
  HistoryRecord,
  AppStats,
  AppConfig,
  Theme,
  ExportData,
} from '../types';

const defaultStats = (): AppStats => ({
  totalCalculations: 0,
  approved: 0,
  rejected: 0,
  limitAcceptable: 0,
  appOpens: 0,
  bestPercentage: 0,
  worstPercentage: 0,
  lastCalculationDate: null,
  lastProductStatus: null,
});

const defaultConfig = (): AppConfig => ({
  defaultSafetyMargin: DEFAULT_SAFETY_MARGIN,
  lastSafetyMargin: DEFAULT_SAFETY_MARGIN,
});

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const getAvatarPath = (gender: 'male' | 'female'): string => {
  const base = import.meta.env.BASE_URL;
  return gender === 'male'
    ? `${base}assets/avatars/man.jpeg`
    : `${base}assets/avatars/woman.jpeg`;
};

export const loadTheme = (): Theme => {
  const legacy = localStorage.getItem('theme');
  const theme = localStorage.getItem(STORAGE_KEYS.THEME) ?? legacy;
  return theme === 'dark' ? 'dark' : 'light';
};

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  localStorage.setItem('theme', theme);
};

export const loadUser = (): UserProfile | null => {
  return safeParse<UserProfile | null>(
    localStorage.getItem(STORAGE_KEYS.USER),
    null
  );
};

export const saveUser = (user: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const loadHistory = (): HistoryRecord[] => {
  return safeParse<HistoryRecord[]>(
    localStorage.getItem(STORAGE_KEYS.HISTORY),
    []
  );
};

export const saveHistory = (history: HistoryRecord[]): void => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

export const loadStats = (): AppStats => {
  return safeParse<AppStats>(
    localStorage.getItem(STORAGE_KEYS.STATS),
    defaultStats()
  );
};

export const saveStats = (stats: AppStats): void => {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const loadConfig = (): AppConfig => {
  return safeParse<AppConfig>(
    localStorage.getItem(STORAGE_KEYS.CONFIG),
    defaultConfig()
  );
};

export const saveConfig = (config: AppConfig): void => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

export const resetAll = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem('theme');
};

export const exportAllData = (): ExportData => ({
  user: loadUser(),
  history: loadHistory(),
  stats: loadStats(),
  config: loadConfig(),
  theme: loadTheme(),
});

export const importAllData = (data: ExportData): boolean => {
  try {
    if (data.user) saveUser(data.user);
    saveHistory(data.history ?? []);
    saveStats(data.stats ?? defaultStats());
    saveConfig(data.config ?? defaultConfig());
    if (data.theme) saveTheme(data.theme);
    return true;
  } catch {
    return false;
  }
};
