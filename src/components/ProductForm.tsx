import { Shield } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { DateInput } from './DateInput';
import { CalculationResults } from './CalculationResults';
import './ProductForm.css';

export const ProductForm = () => {
  const { state, dispatch } = useApp();

  const handleElaborationDateChange = (date: Date | null) => {
    dispatch({ type: 'SET_ELABORATION_DATE', payload: date });
  };

  const handleExpirationDateChange = (date: Date | null) => {
    dispatch({ type: 'SET_EXPIRATION_DATE', payload: date });
  };

  const handleEvaluationDateChange = (date: Date | null) => {
    if (date) {
      dispatch({ type: 'SET_EVALUATION_DATE', payload: date });
    }
  };

  const handleClearDates = () => {
    dispatch({ type: 'SET_ELABORATION_DATE', payload: null });
    dispatch({ type: 'SET_EXPIRATION_DATE', payload: null });
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    dispatch({ type: 'SET_SAFETY_MARGIN', payload: value });
  };

  return (
    <div className="product-form-container">
      <div className="form-card">
        <p className="form-subtitle">
          Calcula la vida útil restante de tus productos
        </p>

        <div className="form-fields">
          <DateInput
            label="Fecha de elaboración"
            id="elaboration-date"
            value={state.dates.elaborationDate}
            onChange={handleElaborationDateChange}
            required
          />

          <DateInput
            label="Fecha de caducidad"
            id="expiration-date"
            value={state.dates.expirationDate}
            onChange={handleExpirationDateChange}
            required
          />

          <DateInput
            label="Fecha de evaluación (hoy)"
            id="evaluation-date"
            value={state.dates.evaluationDate}
            onChange={handleEvaluationDateChange}
          />

          <div className="margin-field">
            <label htmlFor="safety-margin" className="margin-label">
              <Shield size={16} />
              Margen de seguridad (días)
            </label>
            <input
              id="safety-margin"
              type="number"
              min={1}
              className="margin-input"
              value={state.config.lastSafetyMargin}
              onChange={handleMarginChange}
            />
            <small className="margin-hint">
              Se resta de la fecha de caducidad antes del cálculo
            </small>
          </div>

          <button
            type="button"
            onClick={handleClearDates}
            className="clear-dates-button"
            disabled={
              !state.dates.elaborationDate && !state.dates.expirationDate
            }
          >
            Limpiar fechas
          </button>
        </div>
      </div>

      <CalculationResults />
    </div>
  );
};
