import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DateInput } from './DateInput';
import { CalculationResults } from './CalculationResults';
import { formatDate } from '../services/dateService';
import type { HistoryRecord } from '../types';
import './ProductForm.css';

export const ProductForm = () => {
  const { state, dispatch, addToast } = useApp();

  const handleElaborationDateChange = (date: Date | null) => {
    dispatch({ type: 'SET_ELABORATION_DATE', payload: date });
  };

  const handleExpirationDateChange = (date: Date | null) => {
    dispatch({ type: 'SET_EXPIRATION_DATE', payload: date });
  };

  const handleEvaluationDateChange = (date: Date | null) => {
    if (date) {
      dispatch({
        type: 'SET_EVALUATION_DATE',
        payload: date,
      });
    }
  };

  const handleClearDates = () => {
    dispatch({ type: 'SET_ELABORATION_DATE', payload: null });
    dispatch({ type: 'SET_EXPIRATION_DATE', payload: null });
    dispatch({ type: 'SET_PRODUCT_NAME', payload: '' });
  };

  // Guardado automático con debounce (1.5 segundos)
  useEffect(() => {
    const { elaborationDate, expirationDate } = state.dates;
    const { calculation, productName, safetyMargin, history } = state;

    if (elaborationDate && expirationDate && calculation) {
      const timer = setTimeout(() => {
        const prodName = productName.trim() || 'Producto Genérico';
        const elabStr = formatDate(elaborationDate);
        const expStr = formatDate(expirationDate);
        const evalStr = formatDate(state.dates.evaluationDate);

        // Crear registro a comparar/guardar
        const newRecord: HistoryRecord = {
          id: Math.random().toString(36).substring(2, 9),
          productName: prodName,
          elaborationDate: elabStr,
          expirationDate: expStr,
          evaluationDate: evalStr,
          totalShelfLife: calculation.totalShelfLife,
          remainingDays: calculation.remainingDays,
          remainingPercentage: calculation.remainingPercentage,
          status: calculation.status,
          safetyMargin
        };

        // Comprobar si es un duplicado idéntico del último guardado
        const lastRecord = history[0];
        const isDuplicate = lastRecord &&
          lastRecord.elaborationDate === newRecord.elaborationDate &&
          lastRecord.expirationDate === newRecord.expirationDate &&
          lastRecord.productName === newRecord.productName &&
          lastRecord.safetyMargin === newRecord.safetyMargin;

        if (!isDuplicate) {
          dispatch({ type: 'ADD_HISTORY_RECORD', payload: newRecord });
          
          // Enviar toast de confirmación según el estado del producto
          if (calculation.status === 'rejected') {
            addToast(`[Rechazado] ${prodName} ingresado en el historial.`, 'error');
          } else {
            addToast(`[Guardado] ${prodName} ingresado en el historial.`, 'success');
          }
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    state.dates.elaborationDate, 
    state.dates.expirationDate, 
    state.calculation, 
    state.productName, 
    state.safetyMargin
  ]);

  return (
    <div className='product-form-container'>
      <div className='form-card'>
        <h2 className="form-title">Control de Vida Útil</h2>
        <p className='form-subtitle'>
          Introduce las fechas y parámetros de seguridad del lote a evaluar
        </p>

        <div className='form-fields'>
          {/* Nombre del Producto */}
          <div className='form-field-group'>
            <label htmlFor="product-name" className='form-field-label'>
              Nombre del Producto / Lote (Opcional)
            </label>
            <input
              id="product-name"
              type="text"
              className='form-input-text'
              value={state.productName}
              onChange={(e) => dispatch({ type: 'SET_PRODUCT_NAME', payload: e.target.value })}
              placeholder="Ej. Lote-108, Queso Fresco"
              autoComplete="off"
            />
          </div>

          <DateInput
            label='Fecha de elaboración'
            value={state.dates.elaborationDate}
            onChange={handleElaborationDateChange}
            required
          />

          <DateInput
            label='Fecha de caducidad'
            value={state.dates.expirationDate}
            onChange={handleExpirationDateChange}
            required
          />

          <DateInput
            label='Fecha de evaluación (hoy)'
            value={state.dates.evaluationDate}
            onChange={handleEvaluationDateChange}
          />

          {/* Margen de seguridad */}
          <div className='form-field-group'>
            <label htmlFor="safety-margin" className='form-field-label'>
              Margen de Seguridad (Días)
            </label>
            <input
              id="safety-margin"
              type="number"
              min={1}
              className='form-input-text'
              value={state.safetyMargin}
              onChange={(e) => dispatch({ type: 'SET_SAFETY_MARGIN', payload: Math.max(1, parseInt(e.target.value) || 1) })}
              placeholder="Por defecto: 3"
            />
            <small className='form-field-hint'>
              Se restan {state.safetyMargin} {state.safetyMargin === 1 ? 'día' : 'días'} a la fecha de caducidad para el cálculo de seguridad.
            </small>
          </div>

          <button
            type='button'
            onClick={handleClearDates}
            className='clear-dates-button'
            disabled={!state.dates.elaborationDate && !state.dates.expirationDate}
          >
            Limpiar Formulario
          </button>
        </div>
      </div>

      <CalculationResults />
    </div>
  );
};
