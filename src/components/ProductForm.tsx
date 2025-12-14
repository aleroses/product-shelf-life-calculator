import { useApp } from '../context/AppContext';
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
      dispatch({
        type: 'SET_EVALUATION_DATE',
        payload: date,
      });
    }
  };

  return (
    <div className='product-form-container'>
      <div className='form-card'>
        {/* <h1 className="form-title">Calculadora de Vida Útil</h1> */}
        <p className='form-subtitle'>
          Calcula la vida útil restante de tus productos
        </p>

        <div className='form-fields'>
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
        </div>
      </div>

      <CalculationResults />
    </div>
  );
};
