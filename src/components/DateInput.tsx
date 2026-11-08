import { useState, useRef } from 'react';
import { parseDate, formatDate } from '../services/dateService';
import './DateInput.css';

interface DateInputProps {
  label: string;
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
}

const formatDateInput = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  const limited = numbers.slice(0, 8);

  if (limited.length <= 2) {
    return limited.length === 2 ? `${limited}/` : limited;
  } else if (limited.length <= 4) {
    const day = limited.slice(0, 2);
    const month = limited.slice(2);
    return limited.length === 4 ? `${day}/${month}/` : `${day}/${month}`;
  } else {
    const day = limited.slice(0, 2);
    const month = limited.slice(2, 4);
    const year = limited.slice(4);
    return `${day}/${month}/${year}`;
  }
};

export const DateInput = ({
  label,
  id,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  required = false,
}: DateInputProps) => {
  const [inputValue, setInputValue] = useState<string>(() =>
    value ? formatDate(value) : ''
  );
  const isUserTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastExternalValue = useRef(value);

  if (!isUserTypingRef.current && lastExternalValue.current !== value) {
    lastExternalValue.current = value;
    const formatted = value ? formatDate(value) : '';
    if (formatted !== inputValue) {
      setInputValue(formatted);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    const rawValue = e.target.value;
    const input = e.target;
    const cursorPosition = input.selectionStart || 0;

    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue);
      onChange(parseDate(rawValue));

      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = Math.min(cursorPosition, rawValue.length);
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
        isUserTypingRef.current = false;
      }, 0);
      return;
    }

    const formatted = formatDateInput(rawValue);
    setInputValue(formatted);

    const numbersBefore = rawValue
      .slice(0, cursorPosition)
      .replace(/\D/g, '').length;
    let newCursorPosition = 0;
    let count = 0;

    for (let i = 0; i < formatted.length && count < numbersBefore; i++) {
      if (/\d/.test(formatted[i])) {
        count++;
      }
      newCursorPosition = i + 1;
    }

    onChange(parseDate(formatted));

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
      isUserTypingRef.current = false;
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    if (allowedKeys.includes(e.key)) return;

    if (
      (e.ctrlKey || e.metaKey) &&
      ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
    ) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="date-input-container">
      <label htmlFor={id} className="date-input-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="date-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
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
