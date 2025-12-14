import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { calculateShelfLife } from '../services/dateService';
import type { AppState, AppAction } from '../types';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  recalculate: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Aplicar tema al cargar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Recalcular cuando cambien las fechas
  useEffect(() => {
    if (state.dates.elaborationDate && state.dates.expirationDate) {
      const calculation = calculateShelfLife(state.dates);
      if (calculation) {
        dispatch({ type: 'SET_CALCULATION', payload: calculation });
      } else {
        dispatch({ type: 'SET_CALCULATION', payload: null });
      }
    } else {
      dispatch({ type: 'SET_CALCULATION', payload: null });
    }
  }, [state.dates.elaborationDate, state.dates.expirationDate, state.dates.evaluationDate]);

  const recalculate = () => {
    if (state.dates.elaborationDate && state.dates.expirationDate) {
      const calculation = calculateShelfLife(state.dates);
      if (calculation) {
        dispatch({ type: 'SET_CALCULATION', payload: calculation });
      }
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, recalculate }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

