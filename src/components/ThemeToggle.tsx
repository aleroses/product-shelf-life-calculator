import { Moon, Sun } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { state, dispatch } = useApp();

  return (
    <button
      className="theme-toggle"
      onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
      aria-label={`Cambiar a modo ${state.theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};


