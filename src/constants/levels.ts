export interface UserLevel {
  name: string;
  minCalculations: number;
}

export const USER_LEVELS: UserLevel[] = [
  { name: 'Novato', minCalculations: 0 },
  { name: 'Inspector', minCalculations: 5 },
  { name: 'Supervisor', minCalculations: 15 },
  { name: 'Jefe de Calidad', minCalculations: 30 },
  { name: 'Especialista', minCalculations: 50 },
  { name: 'Experto', minCalculations: 100 },
];

export const DEFAULT_SAFETY_MARGIN = 3;
export const MAX_HISTORY_RECORDS = 50;
