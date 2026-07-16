import { subDays, format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { 
  Award, Calendar, Clock, Flame, Calculator, CheckCircle2, 
  XCircle, TrendingUp, TrendingDown, Hourglass, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import './DashboardStats.css';

// Helper de nivel
export const getUserLevelInfo = (totalCount: number) => {
  let level = 'Novato';
  let minCalcs = 0;
  let maxCalcs = 5;
  
  if (totalCount >= 50) {
    level = 'Experto';
    minCalcs = 50;
    maxCalcs = 99999;
  } else if (totalCount >= 35) {
    level = 'Especialista';
    minCalcs = 35;
    maxCalcs = 50;
  } else if (totalCount >= 20) {
    level = 'Jefe de Calidad';
    minCalcs = 20;
    maxCalcs = 35;
  } else if (totalCount >= 10) {
    level = 'Supervisor';
    minCalcs = 10;
    maxCalcs = 20;
  } else if (totalCount >= 5) {
    level = 'Inspector';
    minCalcs = 5;
    maxCalcs = 10;
  }
  
  const currentLevelProgress = totalCount - minCalcs;
  const calcsNeeded = maxCalcs - minCalcs;
  const progressPercent = maxCalcs === 99999 ? 100 : Math.round((currentLevelProgress / calcsNeeded) * 100);
  
  return {
    level,
    progressPercent,
    currentLevelProgress,
    calcsNeeded: maxCalcs === 99999 ? 0 : calcsNeeded,
    totalCount
  };
};

export const DashboardStats = () => {
  const { state } = useApp();
  const { user, history, sessionsCount } = state;

  if (!user) return null;

  // Cargar estadísticas all-time de localStorage
  const totalAllTimeCalculations = parseInt(localStorage.getItem('totalCalculationsCount') || '0', 10);
  const lvlInfo = getUserLevelInfo(totalAllTimeCalculations);

  // Computar estadísticas del historial
  const totalCalculations = history.length;
  const approvedCount = history.filter(r => r.status === 'acceptable' || r.status === 'limit-acceptable').length;
  const rejectedCount = history.filter(r => r.status === 'rejected').length;
  
  const approvalRate = totalCalculations > 0 ? Math.round((approvedCount / totalCalculations) * 100) : 0;
  const rejectionRate = totalCalculations > 0 ? Math.round((rejectedCount / totalCalculations) * 100) : 0;

  const avgRemainingDays = totalCalculations > 0 
    ? Math.round(history.reduce((sum, r) => sum + r.remainingDays, 0) / totalCalculations) 
    : 0;

  const avgTotalShelfLife = totalCalculations > 0 
    ? Math.round(history.reduce((sum, r) => sum + r.totalShelfLife, 0) / totalCalculations) 
    : 0;

  const maxRemainingPercent = totalCalculations > 0 
    ? Math.max(...history.map(r => r.remainingPercentage)) 
    : 0;

  const minRemainingPercent = totalCalculations > 0 
    ? Math.min(...history.map(r => r.remainingPercentage)) 
    : 0;

  const lastCalculation = totalCalculations > 0 ? history[0] : null;

  // 12 Semanas Calendario de Actividad (84 días)
  const today = new Date();
  const calendarDays = Array.from({ length: 84 }, (_, i) => subDays(today, 83 - i));

  // Agrupar cálculos por fecha (dd/MM/yyyy)
  const countsByDate: Record<string, number> = {};
  history.forEach(record => {
    countsByDate[record.evaluationDate] = (countsByDate[record.evaluationDate] || 0) + 1;
  });

  const getDayIntensityClass = (date: Date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    const count = countsByDate[formattedDate] || 0;
    if (count === 0) return 'activity-level-0';
    if (count === 1) return 'activity-level-1';
    if (count <= 3) return 'activity-level-2';
    return 'activity-level-3';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'acceptable':
        return <span className="status-indicator stat-ok">Fresco</span>;
      case 'limit-acceptable':
        return <span className="status-indicator stat-limit">Límite</span>;
      case 'rejected':
        return <span className="status-indicator stat-rejected">Rechazado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-stats-container">
      {/* Fila 1: Perfil y Calendario */}
      <div className="dashboard-top-row">
        {/* Perfil del Inspector */}
        <div className="stat-card profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <img 
                src={`/assets/avatars/${user.avatar}`} 
                alt={user.name} 
                className="profile-avatar-img"
              />
              <div className="profile-level-badge">
                <Award size={14} />
              </div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{user.name}</h3>
              <div className="profile-title">
                <span>Rango: {lvlInfo.level}</span>
              </div>
            </div>
          </div>
          <div className="profile-xp-section">
            <div className="xp-labels">
              <span className="xp-text">Progreso de Rango</span>
              <span className="xp-value">{lvlInfo.totalCount} cálculos</span>
            </div>
            <div className="xp-progress-bar-bg">
              <div 
                className="xp-progress-bar" 
                style={{ width: `${lvlInfo.progressPercent}%` }}
              ></div>
            </div>
            {lvlInfo.calcsNeeded > 0 ? (
              <span className="xp-hint">
                {lvlInfo.calcsNeeded - (totalAllTimeCalculations % lvlInfo.calcsNeeded)} cálculos más para el siguiente rango
              </span>
            ) : (
              <span className="xp-hint">¡Nivel máximo alcanzado!</span>
            )}
          </div>
        </div>

        {/* Calendario de Actividad */}
        <div className="stat-card activity-card">
          <div className="card-header-with-icon">
            <Calendar size={18} className="header-icon blue" />
            <h4 className="card-title">Calendario de Actividad</h4>
          </div>
          <p className="card-subtitle">Inspecciones realizadas en los últimos 84 días</p>
          
          <div className="activity-grid-wrapper">
            <div className="activity-grid">
              {calendarDays.map((date, idx) => {
                const formattedDate = format(date, 'dd/MM/yyyy');
                const count = countsByDate[formattedDate] || 0;
                return (
                  <div
                    key={idx}
                    className={`activity-day ${getDayIntensityClass(date)}`}
                    title={`${formattedDate}: ${count} análisis`}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="activity-legend">
            <span>Menos</span>
            <div className="legend-day activity-level-0"></div>
            <div className="legend-day activity-level-1"></div>
            <div className="legend-day activity-level-2"></div>
            <div className="legend-day activity-level-3"></div>
            <span>Más</span>
          </div>
        </div>
      </div>

      {/* Fila 2: Grid de Métricas Clave */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-icon-bg info">
            <Clock size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Primer Uso</span>
            <span className="metric-value">
              {format(new Date(user.registrationDate), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg warning">
            <Flame size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Accesos / Sesiones</span>
            <span className="metric-value">{sessionsCount}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg secondary">
            <Calculator size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Historial Guardado</span>
            <span className="metric-value">{totalCalculations} / 50</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg ok">
            <CheckCircle2 size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Aprobados (Historial)</span>
            <span className="metric-value">{approvedCount}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg rejected">
            <XCircle size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Rechazados (Historial)</span>
            <span className="metric-value">{rejectedCount}</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg ok">
            <TrendingUp size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">% Aprobación</span>
            <span className="metric-value">{approvalRate}%</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg rejected">
            <TrendingDown size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">% Rechazo</span>
            <span className="metric-value">{rejectionRate}%</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg info">
            <Hourglass size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Promedio Días Rest.</span>
            <span className="metric-value">{avgRemainingDays} d</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg info">
            <Hourglass size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Promedio Vida Útil</span>
            <span className="metric-value">{avgTotalShelfLife} d</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg ok">
            <ShieldCheck size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Mejor % Restante</span>
            <span className="metric-value">{maxRemainingPercent}%</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-bg rejected">
            <ShieldAlert size={20} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Peor % Restante</span>
            <span className="metric-value">{minRemainingPercent}%</span>
          </div>
        </div>

        {lastCalculation ? (
          <div className="metric-box last-calc-box">
            <div className="metric-details">
              <span className="metric-label">Último Análisis</span>
              <span className="metric-value truncate" title={lastCalculation.productName}>
                {lastCalculation.productName || 'Genérico'}
              </span>
              <div className="last-calc-meta">
                <span>{lastCalculation.evaluationDate}</span>
                {getStatusBadge(lastCalculation.status)}
              </div>
            </div>
          </div>
        ) : (
          <div className="metric-box empty-calc-box">
            <span className="no-data-text">Sin análisis registrados</span>
          </div>
        )}
      </div>
    </div>
  );
};
