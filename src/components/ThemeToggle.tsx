import { useApp } from '../context/AppContext';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { state, dispatch } = useApp();

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={`Cambiar a modo ${state.theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {state.theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};


