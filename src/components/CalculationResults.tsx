import { useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../hooks/useApp';
import { isApproved } from '../services/dateService';
import './CalculationResults.css';

export const CalculationResults = () => {
  const { state, recordCalculation } = useApp();
  const { calculation } = state;
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!calculation) return;
    if (
      state.dates.elaborationDate &&
      state.dates.expirationDate
    ) {
      recordCalculation();
    }
  }, [
    calculation,
    state.dates.elaborationDate,
    state.dates.expirationDate,
    recordCalculation,
  ]);

  useEffect(() => {
    if (!calculation) return;
    const key = `${calculation.status}-${calculation.remainingPercentage}`;
    if (prevStatusRef.current === key) return;
    prevStatusRef.current = key;

    if (isApproved(calculation.status)) {
      toast.success('Producto aceptado');
    } else if (calculation.status === 'rejected') {
      toast.error('Producto rechazado');
    }
  }, [calculation]);

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

  const StatusIcon = () => {
    switch (calculation.status) {
      case 'acceptable':
        return <CheckCircle size={24} />;
      case 'limit-acceptable':
        return <AlertTriangle size={24} />;
      case 'rejected':
        return <XCircle size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="calculation-results">
      <div className="results-card">
        <h2 className="results-title">Resultados</h2>

        <div className="results-grid">
          <div className="result-item">
            <span className="result-label">Vida útil total</span>
            <span className="result-value">
              {calculation.totalShelfLife} días
            </span>
          </div>

          <div className="result-item">
            <span className="result-label">Días restantes</span>
            <span className="result-value">
              {calculation.remainingDays} días
            </span>
          </div>

          <div className="result-item">
            <span className="result-label">Porcentaje de vida útil</span>
            <span className="result-value">
              {calculation.remainingPercentage}%
            </span>
          </div>

          <div className="result-item">
            <span className="result-label">Margen de seguridad</span>
            <span className="result-value">
              {calculation.safetyMargin} días
            </span>
          </div>
        </div>

        <div className={`status-badge ${getStatusClass(calculation.status)}`}>
          <span className="status-icon">
            <StatusIcon />
          </span>
          <span className="status-message">{calculation.statusMessage}</span>
        </div>
      </div>
    </div>
  );
};
