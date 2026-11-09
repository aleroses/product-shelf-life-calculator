import {
  Settings,
  Moon,
  Sun,
  Star,
  Shield,
  Calculator,
  History,
  LayoutDashboard,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { getUserLevel, getLevelProgress } from '../../services/levelService';
import './AppHeader.css';

interface AppHeaderProps {
  onOpenSettings: () => void;
}

const NAV_ITEMS = [
  { id: 'calculadora', label: 'Calculadora', icon: Calculator },
  { id: 'historial', label: 'Historial', icon: History },
  { id: 'estadisticas', label: 'Estadísticas', icon: LayoutDashboard },
  { id: 'graficas', label: 'Gráficas', icon: BarChart3 },
] as const;

export const AppHeader = ({ onOpenSettings }: AppHeaderProps) => {
  const { state, dispatch } = useApp();
  const level = getUserLevel(state.stats.totalCalculations);
  const levelProgress = getLevelProgress(state.stats.totalCalculations);
  const user = state.user;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navButtons = (variant: 'chip' | 'link') =>
    NAV_ITEMS.map(({ id, label, icon: Icon }) => (
      <button
        key={`${variant}-${id}`}
        type="button"
        className={
          variant === 'chip' ? 'app-header__nav-chip' : 'app-header__nav-link'
        }
        onClick={() => scrollToSection(id)}
      >
        <Icon size={variant === 'chip' ? 14 : 16} aria-hidden />
        <span>{label}</span>
      </button>
    ));

  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__brand">
          <Shield
            className="app-header__brand-icon"
            size={28}
            strokeWidth={2}
            aria-hidden
          />
          <div className="app-header__brand-text">
            <h1 className="app-brand-name">AeroShelf</h1>
            <p className="app-header__tagline">Control de vida útil</p>
          </div>
        </div>

        <nav
          className="app-header__nav app-header__nav--inline"
          aria-label="Secciones"
        >
          {navButtons('chip')}
        </nav>

        <nav
          className="app-header__nav app-header__nav--desktop"
          aria-label="Secciones"
        >
          {navButtons('link')}
        </nav>

        <div className="app-header__end">
          {user && (
            <div className="app-header__user app-header__user--desktop">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt=""
                  className="app-header__avatar"
                />
              )}
              <div className="app-header__user-text">
                <span className="app-header__user-name">{user.name}</span>
                <div className="app-header__meta">
                  <div className="app-header__level">
                    <Star size={12} aria-hidden />
                    <span>{level}</span>
                  </div>
                  <div
                    className="app-header__progress"
                    role="progressbar"
                    aria-valuenow={levelProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progreso de nivel ${levelProgress}%`}
                  >
                    <div
                      className="app-header__progress-bar"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
        </div>
      </div>

      {user && (
        <div className="app-header__profile-bar">
          <div className="app-header__user">
            {user.avatar && (
              <img src={user.avatar} alt="" className="app-header__avatar" />
            )}
            <div className="app-header__user-text">
              <span className="app-header__user-name">{user.name}</span>
              <div className="app-header__meta">
                <div className="app-header__level">
                  <Star size={12} aria-hidden />
                  <span>{level}</span>
                </div>
                <div
                  className="app-header__progress"
                  role="progressbar"
                  aria-valuenow={levelProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progreso de nivel ${levelProgress}%`}
                >
                  <div
                    className="app-header__progress-bar"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
