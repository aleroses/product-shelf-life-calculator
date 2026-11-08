import { Settings, Moon, Sun, Star } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { getUserLevel, getLevelProgress } from '../../services/levelService';
import './AppHeader.css';

interface AppHeaderProps {
  onOpenSettings: () => void;
}

export const AppHeader = ({ onOpenSettings }: AppHeaderProps) => {
  const { state, dispatch } = useApp();
  const level = getUserLevel(state.stats.totalCalculations);
  const levelProgress = getLevelProgress(state.stats.totalCalculations);

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
        <div className="app-header__identity">
          <h1 className="app-title">Control de Vida Útil</h1>
          {state.user && (
            <>
              <p className="app-header__subtitle">{state.user.name}</p>
              <div className="app-header__level">
                <Star size={14} />
                <span>{level}</span>
              </div>
              <div className="app-header__progress">
                <div
                  className="app-header__progress-bar"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </>
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
