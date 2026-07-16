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
}

export type ProductStatus = 'acceptable' | 'limit-acceptable' | 'rejected';

export type Theme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  gender: 'man' | 'woman';
  avatar: string; // e.g., 'man.jpeg', 'woman.jpeg'
  registrationDate: string; // ISO string
}

export interface HistoryRecord {
  id: string;
  productName: string;
  elaborationDate: string; // dd/mm/yyyy
  expirationDate: string;  // dd/mm/yyyy
  evaluationDate: string;  // dd/mm/yyyy
  totalShelfLife: number;
  remainingDays: number;
  remainingPercentage: number;
  status: ProductStatus;
  safetyMargin: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface AppState {
  dates: ProductDates;
  calculation: ShelfLifeCalculation | null;
  theme: Theme;
  user: UserProfile | null;
  history: HistoryRecord[];
  safetyMargin: number;
  sessionsCount: number;
  productName: string;
  toasts: ToastMessage[];
}

export type AppAction =
  | { type: 'SET_ELABORATION_DATE'; payload: Date | null }
  | { type: 'SET_EXPIRATION_DATE'; payload: Date | null }
  | { type: 'SET_EVALUATION_DATE'; payload: Date }
  | { type: 'SET_CALCULATION'; payload: ShelfLifeCalculation | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_PRODUCT_NAME'; payload: string }
  | { type: 'SET_SAFETY_MARGIN'; payload: number }
  | { type: 'ADD_HISTORY_RECORD'; payload: HistoryRecord }
  | { type: 'DELETE_HISTORY_RECORD'; payload: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'INCREMENT_SESSIONS' }
  | { type: 'ADD_TOAST'; payload: Omit<ToastMessage, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'IMPORT_STATE'; payload: { user: UserProfile | null; history: HistoryRecord[]; safetyMargin: number; sessionsCount: number } }
  | { type: 'RESET_APP' };


