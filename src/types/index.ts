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

export interface AppState {
  dates: ProductDates;
  calculation: ShelfLifeCalculation | null;
  theme: Theme;
}

export type AppAction =
  | { type: 'SET_ELABORATION_DATE'; payload: Date | null }
  | { type: 'SET_EXPIRATION_DATE'; payload: Date | null }
  | { type: 'SET_EVALUATION_DATE'; payload: Date }
  | { type: 'SET_CALCULATION'; payload: ShelfLifeCalculation | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESET' };

