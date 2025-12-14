import type { AppState, AppAction } from '../types';

export const initialState: AppState = {
  dates: {
    elaborationDate: null,
    expirationDate: null,
    evaluationDate: new Date(),
  },
  calculation: null,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
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

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};


