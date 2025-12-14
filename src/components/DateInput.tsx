import { useState, useEffect, useRef } from 'react';
import { parseDate, formatDate } from '../services/dateService';
import './DateInput.css';

interface DateInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
}

/**
 * Formatea el input agregando automáticamente las barras "/"
 * Ejemplo: "11" -> "11/", "1112" -> "11/12/", "11122025" -> "11/12/2025"
 */
const formatDateInput = (value: string): string => {
  // Remover todo lo que no sea número
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  
  // Limitar a 8 dígitos (DDMMYYYY)
  const limited = numbers.slice(0, 8);
  
  // Formatear según la cantidad de dígitos
  if (limited.length <= 2) {
    // Si tiene 2 dígitos, agregar "/" automáticamente
    return limited.length === 2 ? `${limited}/` : limited;
  } else if (limited.length <= 4) {
    // Si tiene 4 dígitos, agregar "/" después del mes
    const day = limited.slice(0, 2);
    const month = limited.slice(2);
    return limited.length === 4 ? `${day}/${month}/` : `${day}/${month}`;
  } else {
    // Formato completo con año - NO agregar barras adicionales
    const day = limited.slice(0, 2);
    const month = limited.slice(2, 4);
    const year = limited.slice(4);
    return `${day}/${month}/${year}`;
  }
};

export const DateInput = ({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  required = false,
}: DateInputProps) => {
  const [inputValue, setInputValue] = useState<string>(() => {
    return value ? formatDate(value) : '';
  });
  const isUserTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Solo actualizar desde el valor externo si el usuario no está escribiendo
    if (!isUserTypingRef.current) {
      if (value) {
        const formatted = formatDate(value);
        if (formatted !== inputValue) {
          setInputValue(formatted);
        }
      } else if (!value && inputValue) {
        // Solo limpiar si el valor externo cambió a null explícitamente
        setInputValue('');
      }
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    const rawValue = e.target.value;
    const input = e.target;
    const cursorPosition = input.selectionStart || 0;
    
    // Si el usuario está borrando, permitir borrar normalmente
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);
      const parsed = parseDate(rawValue);
      onChange(parsed);
      
      // Restaurar posición del cursor después de un breve delay
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = Math.min(cursorPosition, rawValue.length);
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
      
      // Resetear el flag después de un breve delay
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
      return;
    }
    
    // Formatear automáticamente agregando "/"
    const formatted = formatDateInput(rawValue);
    setInputValue(formatted);
    
    // Calcular nueva posición del cursor
    const numbersBefore = rawValue.slice(0, cursorPosition).replace(/\D/g, '').length;
    let newCursorPosition = 0;
    let count = 0;
    
    for (let i = 0; i < formatted.length && count < numbersBefore; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
      }
      newCursorPosition = i + 1;
    }
    
    // Parsear y notificar al padre
    const parsed = parseDate(formatted);
    onChange(parsed);
    
    // Restaurar posición del cursor
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
      isUserTypingRef.current = false;
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir navegación con teclas de flecha, backspace, delete, etc.
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Home',
      'End',
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permitir Ctrl/Cmd + A, C, V, X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    // Solo permitir números
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="date-input-container">
      <label htmlFor={label} className="date-input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        ref={inputRef}
        id={label}
        type="text"
        className="date-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          // Cuando el usuario termina de escribir, sincronizar con el valor externo
          isUserTypingRef.current = false;
        }}
        placeholder={placeholder}
        maxLength={10}
        inputMode="numeric"
        autoComplete="off"
      />
      <small className="date-input-hint">Formato: DD/MM/YYYY</small>
    </div>
  );
};

