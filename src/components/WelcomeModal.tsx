import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserCheck, ShieldAlert } from 'lucide-react';
import './WelcomeModal.css';

export const WelcomeModal = () => {
  const { state, dispatch, addToast } = useApp();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'man' | 'woman' | null>(null);

  // Solo mostrar si el usuario no está registrado
  if (state.user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Por favor, ingresa tu nombre de inspector', 'warning');
      return;
    }

    if (!gender) {
      addToast('Por favor, selecciona tu género', 'warning');
      return;
    }

    const newUser = {
      name: name.trim(),
      gender,
      avatar: gender === 'man' ? 'man.jpeg' : 'woman.jpeg',
      registrationDate: new Date().toISOString(),
    };

    dispatch({ type: 'SET_USER', payload: newUser });
    dispatch({ type: 'INCREMENT_SESSIONS' }); // Primera sesión
    addToast(`¡Bienvenido al sistema de control de calidad, ${newUser.name}!`, 'success');
  };

  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal-content">
        <div className="welcome-header">
          <div className="welcome-logo-container">
            <ShieldAlert className="welcome-logo-icon" size={32} />
          </div>
          <h2 className="welcome-title">Sistema AeroShelf</h2>
          <p className="welcome-subtitle">
            Control de Vida Útil de Productos e Inspección de Calidad.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="welcome-input-group">
            <label htmlFor="user-name" className="welcome-label">
              Nombre del Inspector
            </label>
            <input
              id="user-name"
              type="text"
              className="welcome-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Inspector Pérez"
              autoComplete="off"
              required
            />
          </div>

          <div className="welcome-gender-group">
            <label className="welcome-label">Selecciona tu Género</label>
            <div className="welcome-gender-cards">
              <button
                type="button"
                className={`gender-card ${gender === 'man' ? 'selected' : ''}`}
                onClick={() => setGender('man')}
              >
                <div className="gender-avatar-wrapper">
                  <img
                    src="/assets/avatars/man.jpeg"
                    alt="Inspector"
                    className="gender-preview-img"
                  />
                  <div className="gender-icon-fallback">
                    <User size={24} />
                  </div>
                </div>
                <span className="gender-label">Hombre</span>
              </button>

              <button
                type="button"
                className={`gender-card ${gender === 'woman' ? 'selected' : ''}`}
                onClick={() => setGender('woman')}
              >
                <div className="gender-avatar-wrapper">
                  <img
                    src="/assets/avatars/woman.jpeg"
                    alt="Inspectora"
                    className="gender-preview-img"
                  />
                  <div className="gender-icon-fallback">
                    <User size={24} />
                  </div>
                </div>
                <span className="gender-label">Mujer</span>
              </button>
            </div>
          </div>

          <button type="submit" className="welcome-submit-btn">
            <span>Iniciar Sesión de Control</span>
            <UserCheck size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
