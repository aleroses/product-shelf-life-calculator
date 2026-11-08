import {
  differenceInDays,
  subDays,
  parse,
  format,
  isValid,
  startOfMonth,
  format as formatDateFns,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  ProductDates,
  ShelfLifeCalculation,
  ProductStatus,
  HistoryRecord,
  AppStats,
} from '../types';
import { DEFAULT_SAFETY_MARGIN } from '../constants/levels';

export const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  const cleaned = dateString.trim();
  const parts = cleaned.split('/');

  if (parts.length !== 3) {
    return null;
  }

  if (parts[2].length !== 4) {
    return null;
  }

  if (parts[0].length !== 2 || parts[1].length !== 2) {
    return null;
  }

  try {
    const parsed = parse(cleaned, 'dd/MM/yyyy', new Date());

    if (!isValid(parsed)) {
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (
      parsed.getDate() !== day ||
      parsed.getMonth() + 1 !== month ||
      parsed.getFullYear() !== year
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

export const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDateFns(d, "d 'de' MMMM, yyyy", { locale: es });
};

export const calculateTotalShelfLife = (
  elaborationDate: Date,
  expirationDate: Date
): number => {
  return differenceInDays(expirationDate, elaborationDate);
};

export const calculateRemainingDays = (
  expirationDate: Date,
  evaluationDate: Date,
  safetyMargin: number = DEFAULT_SAFETY_MARGIN
): number => {
  const adjustedExpirationDate = subDays(expirationDate, safetyMargin);
  const remaining = differenceInDays(adjustedExpirationDate, evaluationDate);
  return Math.max(0, remaining);
};

export const calculateRemainingPercentage = (
  remainingDays: number,
  totalShelfLife: number
): number => {
  if (totalShelfLife <= 0) {
    return 0;
  }

  const percentage = (remainingDays / totalShelfLife) * 100;
  return Math.round(percentage);
};

export const determineProductStatus = (
  percentage: number
): { status: ProductStatus; message: string } => {
  if (percentage >= 80) {
    return {
      status: 'acceptable',
      message: 'Producto fresco - Aceptable',
    };
  }

  if (percentage >= 70) {
    return {
      status: 'limit-acceptable',
      message: 'Límite aceptable - Aceptable',
    };
  }

  return {
    status: 'rejected',
    message: 'No aceptable - Rechazado',
  };
};

export const calculateShelfLife = (
  dates: ProductDates,
  safetyMargin: number = DEFAULT_SAFETY_MARGIN
): ShelfLifeCalculation | null => {
  if (!dates.elaborationDate || !dates.expirationDate) {
    return null;
  }

  const totalShelfLife = calculateTotalShelfLife(
    dates.elaborationDate,
    dates.expirationDate
  );

  if (totalShelfLife <= 0) {
    return null;
  }

  const remainingDays = calculateRemainingDays(
    dates.expirationDate,
    dates.evaluationDate,
    safetyMargin
  );

  const remainingPercentage = calculateRemainingPercentage(
    remainingDays,
    totalShelfLife
  );

  const { status, message } = determineProductStatus(remainingPercentage);

  return {
    totalShelfLife,
    remainingDays,
    remainingPercentage,
    status,
    statusMessage: message,
    safetyMargin,
  };
};

export const isApproved = (status: ProductStatus): boolean => {
  return status === 'acceptable' || status === 'limit-acceptable';
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const createHistoryRecord = (
  dates: ProductDates,
  calculation: ShelfLifeCalculation
): HistoryRecord => ({
  id: generateId(),
  elaborationDate: dates.elaborationDate!.toISOString(),
  expirationDate: dates.expirationDate!.toISOString(),
  evaluationDate: dates.evaluationDate.toISOString(),
  totalShelfLife: calculation.totalShelfLife,
  remainingDays: calculation.remainingDays,
  remainingPercentage: calculation.remainingPercentage,
  status: calculation.status,
  safetyMargin: calculation.safetyMargin,
  createdAt: new Date().toISOString(),
});

export const updateStatsFromCalculation = (
  stats: AppStats,
  calculation: ShelfLifeCalculation
): AppStats => {
  const newStats = { ...stats };
  newStats.totalCalculations += 1;

  if (calculation.status === 'acceptable') {
    newStats.approved += 1;
  } else if (calculation.status === 'limit-acceptable') {
    newStats.limitAcceptable += 1;
    newStats.approved += 1;
  } else {
    newStats.rejected += 1;
  }

  if (
    newStats.totalCalculations === 1 ||
    calculation.remainingPercentage > newStats.bestPercentage
  ) {
    newStats.bestPercentage = calculation.remainingPercentage;
  }

  if (
    newStats.totalCalculations === 1 ||
    calculation.remainingPercentage < newStats.worstPercentage
  ) {
    newStats.worstPercentage = calculation.remainingPercentage;
  }

  newStats.lastCalculationDate = new Date().toISOString();
  newStats.lastProductStatus = calculation.status;

  return newStats;
};

export interface DashboardStats {
  approvalRate: number;
  rejectionRate: number;
  avgRemainingDays: number;
  avgTotalShelfLife: number;
  totalReviewed: number;
  mostActiveDay: { date: string; count: number } | null;
  monthlyData: { month: string; count: number }[];
  dailyData: { date: string; count: number }[];
  percentageOverTime: { date: string; percentage: number }[];
  distribution: { accepted: number; rejected: number; limit: number };
  avgShelfLife: number;
  maxShelfLife: number;
  minShelfLife: number;
}

export const computeDashboardStats = (
  history: HistoryRecord[]
): DashboardStats => {
  if (history.length === 0) {
    return {
      approvalRate: 0,
      rejectionRate: 0,
      avgRemainingDays: 0,
      avgTotalShelfLife: 0,
      totalReviewed: 0,
      mostActiveDay: null,
      monthlyData: [],
      dailyData: [],
      percentageOverTime: [],
      distribution: { accepted: 0, rejected: 0, limit: 0 },
      avgShelfLife: 0,
      maxShelfLife: 0,
      minShelfLife: 0,
    };
  }

  const accepted = history.filter((r) => r.status === 'acceptable').length;
  const limit = history.filter((r) => r.status === 'limit-acceptable').length;
  const rejected = history.filter((r) => r.status === 'rejected').length;
  const total = history.length;

  const avgRemainingDays = Math.round(
    history.reduce((s, r) => s + r.remainingDays, 0) / total
  );
  const avgTotalShelfLife = Math.round(
    history.reduce((s, r) => s + r.totalShelfLife, 0) / total
  );

  const shelfLives = history.map((r) => r.totalShelfLife);

  const dayCounts = new Map<string, number>();
  history.forEach((r) => {
    const day = formatDateFns(parseISO(r.createdAt), 'yyyy-MM-dd');
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  });

  let mostActiveDay: { date: string; count: number } | null = null;
  dayCounts.forEach((count, date) => {
    if (!mostActiveDay || count > mostActiveDay.count) {
      mostActiveDay = { date, count };
    }
  });

  const monthCounts = new Map<string, number>();
  history.forEach((r) => {
    const month = formatDateFns(startOfMonth(parseISO(r.createdAt)), 'yyyy-MM');
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
  });

  const monthlyData = Array.from(monthCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const dailyData = Array.from(dayCounts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, count]) => ({ date, count }));

  const percentageOverTime = [...history]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((r) => ({
      date: formatDateFns(parseISO(r.createdAt), 'dd/MM'),
      percentage: r.remainingPercentage,
    }));

  return {
    approvalRate: Math.round(((accepted + limit) / total) * 100),
    rejectionRate: Math.round((rejected / total) * 100),
    avgRemainingDays,
    avgTotalShelfLife,
    totalReviewed: total,
    mostActiveDay,
    monthlyData,
    dailyData,
    percentageOverTime,
    distribution: { accepted, rejected, limit },
    avgShelfLife: avgTotalShelfLife,
    maxShelfLife: Math.max(...shelfLives),
    minShelfLife: Math.min(...shelfLives),
  };
};

export const getActivityCalendar = (
  history: HistoryRecord[],
  weeks: number = 12
): { date: string; count: number; level: number }[] => {
  const dayCounts = new Map<string, number>();
  history.forEach((r) => {
    const day = formatDateFns(parseISO(r.createdAt), 'yyyy-MM-dd');
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  });

  const maxCount = Math.max(1, ...dayCounts.values());
  const result: { date: string; count: number; level: number }[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatDateFns(d, 'yyyy-MM-dd');
    const count = dayCounts.get(key) ?? 0;
    const level =
      count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4));
    result.push({ date: key, count, level });
  }

  return result;
};
