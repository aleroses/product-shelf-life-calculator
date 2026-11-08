import type { AppState, AppAction } from '../types';
import {
  loadTheme,
  loadUser,
  loadHistory,
  loadStats,
  loadConfig,
  saveTheme,
  saveUser,
  saveHistory,
  saveStats,
  saveConfig,
} from '../services/storageService';
import { DEFAULT_SAFETY_MARGIN, MAX_HISTORY_RECORDS } from '../constants/levels';
import { updateStatsFromCalculation } from '../services/dateService';

export const initialState: AppState = {
  dates: {
    elaborationDate: null,
    expirationDate: null,
    evaluationDate: new Date(),
  },
  calculation: null,
  theme: loadTheme(),
  user: loadUser(),
  history: loadHistory(),
  stats: loadStats(),
  config: loadConfig(),
  showWelcomeModal: !loadUser(),
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ELABORATION_DATE':
      return {
        ...state,
        dates: { ...state.dates, elaborationDate: action.payload },
      };

    case 'SET_EXPIRATION_DATE':
      return {
        ...state,
        dates: { ...state.dates, expirationDate: action.payload },
      };

    case 'SET_EVALUATION_DATE':
      return {
        ...state,
        dates: { ...state.dates, evaluationDate: action.payload },
      };

    case 'SET_CALCULATION':
      return { ...state, calculation: action.payload };

    case 'SET_THEME': {
      saveTheme(action.payload);
      return { ...state, theme: action.payload };
    }

    case 'TOGGLE_THEME': {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(newTheme);
      return { ...state, theme: newTheme };
    }

    case 'SET_USER': {
      saveUser(action.payload);
      return { ...state, user: action.payload, showWelcomeModal: false };
    }

    case 'SET_HISTORY': {
      saveHistory(action.payload);
      return { ...state, history: action.payload };
    }

    case 'ADD_HISTORY_RECORD': {
      const history = [action.payload, ...state.history].slice(
        0,
        MAX_HISTORY_RECORDS
      );
      saveHistory(history);
      return { ...state, history };
    }

    case 'DELETE_HISTORY_RECORD': {
      const history = state.history.filter((r) => r.id !== action.payload);
      saveHistory(history);
      return { ...state, history };
    }

    case 'CLEAR_HISTORY': {
      const clearedStats = {
        ...state.stats,
        totalCalculations: 0,
        approved: 0,
        rejected: 0,
        limitAcceptable: 0,
        bestPercentage: 0,
        worstPercentage: 0,
        lastCalculationDate: null,
        lastProductStatus: null,
      };
      saveHistory([]);
      saveStats(clearedStats);
      return { ...state, history: [], stats: clearedStats };
    }

    case 'SET_STATS': {
      saveStats(action.payload);
      return { ...state, stats: action.payload };
    }

    case 'INCREMENT_APP_OPENS': {
      const stats = { ...state.stats, appOpens: state.stats.appOpens + 1 };
      saveStats(stats);
      return { ...state, stats };
    }

    case 'SET_CONFIG': {
      saveConfig(action.payload);
      return { ...state, config: action.payload };
    }

    case 'SET_SAFETY_MARGIN': {
      const config = {
        ...state.config,
        lastSafetyMargin: action.payload,
      };
      saveConfig(config);
      return { ...state, config };
    }

    case 'SET_SHOW_WELCOME_MODAL':
      return { ...state, showWelcomeModal: action.payload };

    case 'LOAD_PERSISTED_STATE':
      return { ...state, ...action.payload };

    case 'RECORD_CALCULATION': {
      const { calculation, record } = action.payload;
      const stats = updateStatsFromCalculation(state.stats, calculation);
      saveStats(stats);
      const history = [record, ...state.history].slice(0, MAX_HISTORY_RECORDS);
      saveHistory(history);
      const config = {
        ...state.config,
        lastSafetyMargin: calculation.safetyMargin,
      };
      saveConfig(config);
      return { ...state, stats, history, config, calculation };
    }

    case 'RESET_ALL':
      return {
        ...initialState,
        theme: state.theme,
        showWelcomeModal: true,
        user: null,
        history: [],
        stats: {
          totalCalculations: 0,
          approved: 0,
          rejected: 0,
          limitAcceptable: 0,
          appOpens: 0,
          bestPercentage: 0,
          worstPercentage: 0,
          lastCalculationDate: null,
          lastProductStatus: null,
        },
        config: {
          defaultSafetyMargin: DEFAULT_SAFETY_MARGIN,
          lastSafetyMargin: DEFAULT_SAFETY_MARGIN,
        },
      };

    default:
      return state;
  }
};
