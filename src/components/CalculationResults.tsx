import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, ShieldAlert, Shield, Calendar, 
  Hourglass, Percent
} from 'lucide-react';
import './CalculationResults.css';

export const CalculationResults = () => {
  const { state } = useApp();
  const { calculation, productName, safetyMargin } = state;

  if (!calculation) {
    return (
      <div className="calculation-results empty">
        <div className="empty-results-content">
          <Shield className="empty-shield-icon" size={48} />
          <p>Ingresa las fechas del lote para iniciar la inspección de vida útil</p>
        </div>
      </div>
    );
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'acceptable':
        return 'status-acceptable';
      case 'limit-acceptable':
        return 'status-limit';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'acceptable':
        return 'FRESCO - ACEPTABLE';
      case 'limit-acceptable':
        return 'LÍMITE ACEPTABLE';
      case 'rejected':
        return 'PRODUCTO RECHAZADO';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acceptable':
        return <ShieldCheck className="status-badge-icon text-ok" size={20} />;
      case 'limit-acceptable':
        return <ShieldAlert className="status-badge-icon text-limit" size={20} />;
      case 'rejected':
        return <ShieldAlert className="status-badge-icon text-rejected" size={20} />;
      default:
        return null;
    }
  };

  // Parámetros de la circunferencia del círculo gauge (r=54, C = 2 * PI * 54 = 339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * calculation.remainingPercentage) / 100;

  return (
    <div className="calculation-results">
      <div className="results-card">
        <div className="results-card-header">
          <h2 className="results-title">Resultado de Inspección</h2>
          {productName && (
            <span className="results-prod-badge" title={productName}>
              {productName}
            </span>
          )}
        </div>
        
        <div className="results-visual-container">
          {/* Circular Gauge */}
          <div className="gauge-wrapper">
            <svg width="140" height="140" viewBox="0 0 140 140" className="gauge-svg">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="gauge-circle-bg"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                className={`gauge-circle-val ${getStatusClass(calculation.status)}`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="68" className="gauge-val-text">
                {calculation.remainingPercentage}%
              </text>
              <text x="70" y="90" className="gauge-label-text">
                vida útil
              </text>
            </svg>
          </div>

          {/* Status Badge */}
          <div className={`status-badge-premium ${getStatusClass(calculation.status)}`}>
            {getStatusIcon(calculation.status)}
            <span className="status-message-premium">
              {getStatusLabel(calculation.status)}
            </span>
          </div>
          <p className="status-description-text">{calculation.statusMessage}</p>
        </div>

        <div className="results-divider"></div>

        <div className="results-grid-premium">
          <div className="result-item-premium">
            <div className="result-item-left">
              <div className="result-item-icon-bg">
                <Calendar size={16} />
              </div>
              <div className="result-item-meta">
                <span className="result-label-premium">Vida útil total</span>
                <span className="result-value-premium">{calculation.totalShelfLife} días</span>
              </div>
            </div>
          </div>
          
          <div className="result-item-premium">
            <div className="result-item-left">
              <div className="result-item-icon-bg">
                <Hourglass size={16} />
              </div>
              <div className="result-item-meta">
                <span className="result-label-premium">Días restantes</span>
                <span className="result-value-premium">{calculation.remainingDays} días</span>
              </div>
            </div>
          </div>
          
          <div className="result-item-premium">
            <div className="result-item-left">
              <div className="result-item-icon-bg">
                <Percent size={16} />
              </div>
              <div className="result-item-meta">
                <span className="result-label-premium">Margen Aplicado</span>
                <span className="result-value-premium">{safetyMargin} {safetyMargin === 1 ? 'día' : 'días'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
