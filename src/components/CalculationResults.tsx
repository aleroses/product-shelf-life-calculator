import { useApp } from '../context/AppContext';
import './CalculationResults.css';

export const CalculationResults = () => {
  const { state } = useApp();
  const { calculation } = state;

  if (!calculation) {
    return (
      <div className="calculation-results empty">
        <p>Ingresa las fechas para calcular la vida útil del producto</p>
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

  return (
    <div className="calculation-results">
      <div className="results-card">
        <h2 className="results-title">Resultados</h2>
        
        <div className="results-grid">
          <div className="result-item">
            <span className="result-label">Vida útil total</span>
            <span className="result-value">{calculation.totalShelfLife} días</span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Días restantes</span>
            <span className="result-value">{calculation.remainingDays} días</span>
          </div>
          
          <div className="result-item">
            <span className="result-label">Porcentaje de vida útil</span>
            <span className="result-value">{calculation.remainingPercentage}%</span>
          </div>
        </div>

        <div className={`status-badge ${getStatusClass(calculation.status)}`}>
          <span className="status-icon">
            {calculation.status === 'acceptable' && '✓'}
            {calculation.status === 'limit-acceptable' && '⚠'}
            {calculation.status === 'rejected' && '✗'}
          </span>
          <span className="status-message">{calculation.statusMessage}</span>
        </div>
      </div>
    </div>
  );
};

