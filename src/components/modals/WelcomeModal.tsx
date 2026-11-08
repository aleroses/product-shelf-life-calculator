import { useState } from 'react';
import { User, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { useApp } from '../../hooks/useApp';
import { getAvatarPath } from '../../services/storageService';
import type { Gender } from '../../types';
import './WelcomeModal.css';

export const WelcomeModal = () => {
  const { state, dispatch } = useApp();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  const handleConfirm = () => {
    if (!name.trim()) {
      toast.error('Por favor ingresa tu nombre');
      return;
    }
    if (!gender) {
      toast.error('Por favor selecciona tu género');
      return;
    }

    dispatch({
      type: 'SET_USER',
      payload: {
        name: name.trim(),
        gender,
        avatar: getAvatarPath(gender),
        registrationDate: new Date().toISOString(),
      },
    });
    toast.success('¡Bienvenido! Datos guardados correctamente');
  };

  return (
    <Modal
      isOpen={state.showWelcomeModal}
      title="Bienvenido al Sistema de Control"
      closable={false}
      size="md"
    >
      <p className="welcome-text">
        Configura tu perfil para comenzar a analizar productos.
      </p>

      <div className="welcome-field">
        <label htmlFor="welcome-name" className="welcome-label">
          Nombre
        </label>
        <input
          id="welcome-name"
          type="text"
          className="welcome-input"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />
      </div>

      <div className="welcome-field">
        <span className="welcome-label">Género</span>
        <div className="gender-cards">
          <button
            type="button"
            className={`gender-card ${gender === 'male' ? 'gender-card--selected' : ''}`}
            onClick={() => setGender('male')}
          >
            <User size={32} />
            <span>Hombre</span>
          </button>
          <button
            type="button"
            className={`gender-card ${gender === 'female' ? 'gender-card--selected' : ''}`}
            onClick={() => setGender('female')}
          >
            <UserRound size={32} />
            <span>Mujer</span>
          </button>
        </div>
      </div>

      <button type="button" className="welcome-btn" onClick={handleConfirm}>
        Comenzar
      </button>
    </Modal>
  );
};
