import { Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import './AppHeader.css';

interface AppHeaderProps {
  onOpenSettings: () => void;
}

export const AppHeader = ({ onOpenSettings }: AppHeaderProps) => {
  const { state, dispatch } = useApp();

  return (
    <header className="app-header">
      <div className="app-header__brand">
        {state.user?.avatar && (
          <img
            src={state.user.avatar}
            alt="Avatar"
            className="app-header__avatar"
          />
        )}
        <div>
          <h1 className="app-title">Control de Vida Útil</h1>
          {state.user && (
            <p className="app-header__subtitle">{state.user.name}</p>
          )}
        </div>
      </div>
      <div className="app-header__actions">
        <button
          className="header-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          aria-label={`Cambiar a modo ${state.theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {state.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          className="header-btn"
          onClick={onOpenSettings}
          aria-label="Configuración"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};
