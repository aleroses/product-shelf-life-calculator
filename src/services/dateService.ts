import { differenceInDays, subDays, parse, format, isValid } from 'date-fns';
import type { ProductDates, ShelfLifeCalculation, ProductStatus } from '../types';

const DAYS_TO_SUBTRACT_FROM_EXPIRATION = 3;

/**
 * Parsea una fecha en formato DD/MM/YYYY
 * Solo parsea fechas completas (con año de 4 dígitos) para evitar fechas inválidas
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  // Remover espacios y validar formato básico
  const cleaned = dateString.trim();
  
  // Dividir por barras
  const parts = cleaned.split('/');
  
  // Debe tener exactamente 3 partes (día, mes, año)
  if (parts.length !== 3) {
    return null;
  }
  
  // Validar que el año tenga exactamente 4 dígitos
  // Esto evita parsear fechas incompletas como "11/12/2" que podrían crear años como "0002"
  if (parts[2].length !== 4) {
    return null;
  }
  
  // Validar que día y mes tengan 2 dígitos
  if (parts[0].length !== 2 || parts[1].length !== 2) {
    return null;
  }

  try {
    // Parsear con formato completo DD/MM/YYYY
    const parsed = parse(cleaned, 'dd/MM/yyyy', new Date());
    
    // Validar que la fecha sea válida usando isValid de date-fns
    if (!isValid(parsed)) {
      return null;
    }
    
    // Validar que los componentes de la fecha coincidan con lo ingresado
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Verificar que la fecha parseada coincida con lo ingresado
    if (
      parsed.getDate() !== day ||
      parsed.getMonth() + 1 !== month ||
      parsed.getFullYear() !== year
    ) {
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
};

/**
 * Formatea una fecha a DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

/**
 * Calcula la vida útil total en días
 * Diferencia entre fecha de elaboración y fecha de caducidad
 * Nota: La vida útil total NO resta los 3 días, solo se aplica para días restantes
 */
export const calculateTotalShelfLife = (
  elaborationDate: Date,
  expirationDate: Date
): number => {
  return differenceInDays(expirationDate, elaborationDate);
};

/**
 * Calcula los días restantes
 * Diferencia entre fecha de caducidad (ajustada) y fecha de evaluación
 */
export const calculateRemainingDays = (
  expirationDate: Date,
  evaluationDate: Date
): number => {
  const adjustedExpirationDate = subDays(expirationDate, DAYS_TO_SUBTRACT_FROM_EXPIRATION);
  const remaining = differenceInDays(adjustedExpirationDate, evaluationDate);
  return Math.max(0, remaining); // No permitir valores negativos
};

/**
 * Calcula el porcentaje de vida útil restante
 */
export const calculateRemainingPercentage = (
  remainingDays: number,
  totalShelfLife: number
): number => {
  if (totalShelfLife <= 0) {
    return 0;
  }
  
  const percentage = (remainingDays / totalShelfLife) * 100;
  return Math.round(percentage);
};

/**
 * Determina el estado del producto según el porcentaje
 */
export const determineProductStatus = (
  percentage: number
): { status: ProductStatus; message: string } => {
  if (percentage >= 80) {
    return {
      status: 'acceptable',
      message: 'Recién producido - Aceptable',
    };
  }
  
  if (percentage >= 70) {
    return {
      status: 'limit-acceptable',
      message: 'Límite aceptable - Aceptable',
    };
  }
  
  return {
    status: 'rejected',
    message: 'No aceptable - Rechazado',
  };
};

/**
 * Calcula toda la información de vida útil del producto
 */
export const calculateShelfLife = (
  dates: ProductDates
): ShelfLifeCalculation | null => {
  if (!dates.elaborationDate || !dates.expirationDate) {
    return null;
  }

  const totalShelfLife = calculateTotalShelfLife(
    dates.elaborationDate,
    dates.expirationDate
  );

  if (totalShelfLife <= 0) {
    return null;
  }

  const remainingDays = calculateRemainingDays(
    dates.expirationDate,
    dates.evaluationDate
  );

  const remainingPercentage = calculateRemainingPercentage(
    remainingDays,
    totalShelfLife
  );

  const { status, message } = determineProductStatus(remainingPercentage);

  return {
    totalShelfLife,
    remainingDays,
    remainingPercentage,
    status,
    statusMessage: message,
  };
};

