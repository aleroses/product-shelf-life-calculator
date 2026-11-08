export interface ProductDates {
  elaborationDate: Date | null;
  expirationDate: Date | null;
  evaluationDate: Date;
}

export interface ShelfLifeCalculation {
  totalShelfLife: number;
  remainingDays: number;
  remainingPercentage: number;
  status: ProductStatus;
  statusMessage: string;
  safetyMargin: number;
}

export type ProductStatus = 'acceptable' | 'limit-acceptable' | 'rejected';

export type Theme = 'light' | 'dark';

export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  gender: Gender;
  avatar: string;
  registrationDate: string;
}

export interface HistoryRecord {
  id: string;
  elaborationDate: string;
  expirationDate: string;
  evaluationDate: string;
  totalShelfLife: number;
  remainingDays: number;
  remainingPercentage: number;
  status: ProductStatus;
  safetyMargin: number;
  createdAt: string;
}

export interface AppStats {
  totalCalculations: number;
  approved: number;
  rejected: number;
  limitAcceptable: number;
  appOpens: number;
  bestPercentage: number;
  worstPercentage: number;
  lastCalculationDate: string | null;
  lastProductStatus: ProductStatus | null;
}

export interface AppConfig {
  defaultSafetyMargin: number;
  lastSafetyMargin: number;
}

export interface AppState {
  dates: ProductDates;
  calculation: ShelfLifeCalculation | null;
  theme: Theme;
  user: UserProfile | null;
  history: HistoryRecord[];
  stats: AppStats;
  config: AppConfig;
  showWelcomeModal: boolean;
}

export type AppAction =
  | { type: 'SET_ELABORATION_DATE'; payload: Date | null }
  | { type: 'SET_EXPIRATION_DATE'; payload: Date | null }
  | { type: 'SET_EVALUATION_DATE'; payload: Date }
  | { type: 'SET_CALCULATION'; payload: ShelfLifeCalculation | null }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_HISTORY'; payload: HistoryRecord[] }
  | { type: 'ADD_HISTORY_RECORD'; payload: HistoryRecord }
  | { type: 'DELETE_HISTORY_RECORD'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_STATS'; payload: AppStats }
  | { type: 'INCREMENT_APP_OPENS' }
  | { type: 'SET_CONFIG'; payload: AppConfig }
  | { type: 'SET_SAFETY_MARGIN'; payload: number }
  | { type: 'SET_SHOW_WELCOME_MODAL'; payload: boolean }
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<AppState> }
  | {
      type: 'RECORD_CALCULATION';
      payload: {
        calculation: ShelfLifeCalculation;
        record: HistoryRecord;
      };
    }
  | { type: 'RESET_ALL' };

export type HistorySortField =
  | 'createdAt'
  | 'remainingPercentage'
  | 'totalShelfLife'
  | 'remainingDays'
  | 'status';

export type SortDirection = 'asc' | 'desc';

export interface HistoryFilters {
  search: string;
  status: ProductStatus | 'all';
  sortField: HistorySortField;
  sortDirection: SortDirection;
}

export interface ExportData {
  user: UserProfile | null;
  history: HistoryRecord[];
  stats: AppStats;
  config: AppConfig;
  theme: Theme;
}
