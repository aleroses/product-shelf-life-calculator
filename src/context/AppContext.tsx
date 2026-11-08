import { createContext, useReducer, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { calculateShelfLife, createHistoryRecord } from '../services/dateService';
import { resetAll as clearStorage } from '../services/storageService';
import type { AppState, AppAction } from '../types';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  recordCalculation: () => void;
  resetApplication: () => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const lastRecordedRef = useRef<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    dispatch({ type: 'INCREMENT_APP_OPENS' });
  }, []);

  useEffect(() => {
    const { elaborationDate, expirationDate } = state.dates;
    if (elaborationDate && expirationDate) {
      const calculation = calculateShelfLife(
        state.dates,
        state.config.lastSafetyMargin
      );
      dispatch({ type: 'SET_CALCULATION', payload: calculation });
    } else {
      dispatch({ type: 'SET_CALCULATION', payload: null });
    }
  }, [
    state.dates.elaborationDate,
    state.dates.expirationDate,
    state.dates.evaluationDate,
    state.config.lastSafetyMargin,
  ]);

  const recordCalculation = useCallback(() => {
    const { elaborationDate, expirationDate } = state.dates;
    if (!elaborationDate || !expirationDate) return;

    const calculation = calculateShelfLife(
      state.dates,
      state.config.lastSafetyMargin
    );
    if (!calculation) return;

    const record = createHistoryRecord(state.dates, calculation);
    const key = `${record.elaborationDate}-${record.expirationDate}-${record.evaluationDate}-${record.safetyMargin}`;

    if (lastRecordedRef.current === key) return;
    lastRecordedRef.current = key;

    dispatch({ type: 'RECORD_CALCULATION', payload: { calculation, record } });
  }, [state.dates, state.config.lastSafetyMargin]);

  const resetApplication = useCallback(() => {
    clearStorage();
    lastRecordedRef.current = null;
    dispatch({ type: 'RESET_ALL' });
  }, []);

  return (
    <AppContext.Provider
      value={{ state, dispatch, recordCalculation, resetApplication }}
    >
      {children}
    </AppContext.Provider>
  );
};
