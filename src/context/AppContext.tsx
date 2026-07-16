import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { calculateShelfLife } from '../services/dateService';
import type { AppState, AppAction } from '../types';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  recalculate: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Aplicar tema al cargar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Incrementar sesiones al cargar la app si el usuario ya está registrado
  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      dispatch({ type: 'INCREMENT_SESSIONS' });
    }
  }, []);

  // Recalcular cuando cambien las fechas o el margen de seguridad
  useEffect(() => {
    if (state.dates.elaborationDate && state.dates.expirationDate) {
      const calculation = calculateShelfLife(state.dates, state.safetyMargin);
      if (calculation) {
        dispatch({ type: 'SET_CALCULATION', payload: calculation });
      } else {
        dispatch({ type: 'SET_CALCULATION', payload: null });
      }
    } else {
      dispatch({ type: 'SET_CALCULATION', payload: null });
    }
  }, [
    state.dates.elaborationDate, 
    state.dates.expirationDate, 
    state.dates.evaluationDate,
    state.safetyMargin
  ]);

  const recalculate = () => {
    if (state.dates.elaborationDate && state.dates.expirationDate) {
      const calculation = calculateShelfLife(state.dates, state.safetyMargin);
      if (calculation) {
        dispatch({ type: 'SET_CALCULATION', payload: calculation });
      }
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    dispatch({ type: 'ADD_TOAST', payload: { message, type } });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, recalculate, addToast }}>
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
