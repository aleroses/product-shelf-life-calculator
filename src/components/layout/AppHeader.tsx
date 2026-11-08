import {
  Settings,
  Moon,
  Sun,
  Star,
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="app-header">
      <div className="app-header__top">
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
                <div className="app-header__meta">
                  <div className="app-header__level">
                    <Star size={14} aria-hidden />
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
              </>
            )}
          </div>
        </div>

        <nav className="app-header__nav app-header__nav--desktop" aria-label="Secciones">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="app-header__nav-link"
              onClick={() => scrollToSection(id)}
            >
              <Icon size={16} aria-hidden />
              <span>{label}</span>
            </button>
          ))}
        </nav>

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

      <nav className="app-header__nav app-header__nav--mobile" aria-label="Secciones">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="app-header__nav-chip"
            onClick={() => scrollToSection(id)}
          >
            <Icon size={16} aria-hidden />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
