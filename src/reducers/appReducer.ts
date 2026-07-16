import type { AppState, AppAction, UserProfile, HistoryRecord } from '../types';

const loadLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const initialState: AppState = {
  dates: {
    elaborationDate: null,
    expirationDate: null,
    evaluationDate: new Date(),
  },
  calculation: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark', // Default to dark for premium look
  user: loadLocalStorage<UserProfile | null>('user', null),
  history: loadLocalStorage<HistoryRecord[]>('history', []),
  safetyMargin: loadLocalStorage<number>('safetyMargin', 3),
  sessionsCount: loadLocalStorage<number>('sessionsCount', 0),
  productName: '',
  toasts: [],
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ELABORATION_DATE':
      return {
        ...state,
        dates: {
          ...state.dates,
          elaborationDate: action.payload,
        },
      };

    case 'SET_EXPIRATION_DATE':
      return {
        ...state,
        dates: {
          ...state.dates,
          expirationDate: action.payload,
        },
      };

    case 'SET_EVALUATION_DATE':
      return {
        ...state,
        dates: {
          ...state.dates,
          evaluationDate: action.payload,
        },
      };

    case 'SET_CALCULATION':
      return {
        ...state,
        calculation: action.payload,
      };

    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };

    case 'SET_USER':
      if (action.payload) {
        saveLocalStorage('user', action.payload);
      } else {
        localStorage.removeItem('user');
      }
      return {
        ...state,
        user: action.payload,
      };

    case 'SET_PRODUCT_NAME':
      return {
        ...state,
        productName: action.payload,
      };

    case 'SET_SAFETY_MARGIN':
      saveLocalStorage('safetyMargin', action.payload);
      return {
        ...state,
        safetyMargin: action.payload,
      };

    case 'ADD_HISTORY_RECORD':
      // Prevenir duplicados idénticos consecutivos
      const isDuplicate = state.history.length > 0 &&
        state.history[0].elaborationDate === action.payload.elaborationDate &&
        state.history[0].expirationDate === action.payload.expirationDate &&
        state.history[0].productName === action.payload.productName &&
        state.history[0].safetyMargin === action.payload.safetyMargin;

      if (isDuplicate) {
        return state;
      }

      // Guardar últimos 50 cálculos
      const updatedHistory = [action.payload, ...state.history].slice(0, 50);
      saveLocalStorage('history', updatedHistory);

      // Incrementar contador acumulado total de productos revisados
      const totalCount = loadLocalStorage<number>('totalCalculationsCount', 0) + 1;
      saveLocalStorage('totalCalculationsCount', totalCount);

      return {
        ...state,
        history: updatedHistory,
      };

    case 'DELETE_HISTORY_RECORD':
      const filteredHistory = state.history.filter(record => record.id !== action.payload);
      saveLocalStorage('history', filteredHistory);
      return {
        ...state,
        history: filteredHistory,
      };

    case 'CLEAR_HISTORY':
      saveLocalStorage('history', []);
      return {
        ...state,
        history: [],
      };

    case 'INCREMENT_SESSIONS':
      const newSessions = state.sessionsCount + 1;
      saveLocalStorage('sessionsCount', newSessions);
      return {
        ...state,
        sessionsCount: newSessions,
      };

    case 'ADD_TOAST':
      const newToast = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
      };
      return {
        ...state,
        toasts: [...state.toasts, newToast],
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
      };

    case 'IMPORT_STATE':
      const imported = action.payload;
      saveLocalStorage('user', imported.user);
      saveLocalStorage('history', imported.history);
      saveLocalStorage('safetyMargin', imported.safetyMargin);
      saveLocalStorage('sessionsCount', imported.sessionsCount);
      
      // Calcular la cantidad de registros importados e inicializar el contador de análisis histórico
      saveLocalStorage('totalCalculationsCount', imported.history.length);

      return {
        ...state,
        user: imported.user,
        history: imported.history,
        safetyMargin: imported.safetyMargin,
        sessionsCount: imported.sessionsCount,
        productName: '',
      };

    case 'RESET_APP':
      localStorage.clear();
      return {
        dates: {
          elaborationDate: null,
          expirationDate: null,
          evaluationDate: new Date(),
        },
        calculation: null,
        theme: 'dark',
        user: null,
        history: [],
        safetyMargin: 3,
        sessionsCount: 0,
        productName: '',
        toasts: [],
      };

    default:
      return state;
  }
};
