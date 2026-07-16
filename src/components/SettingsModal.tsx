import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Settings, User, ShieldAlert, Trash2, RefreshCw, 
  Download, Upload, Save
} from 'lucide-react';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { state, dispatch, addToast } = useApp();
  const { user, safetyMargin, sessionsCount, history } = state;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'man' | 'woman'>('man');
  const [selectedAvatar, setSelectedAvatar] = useState('man.jpeg');
  const [margin, setMargin] = useState(3);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar valores actuales al abrir
  useEffect(() => {
    if (user) {
      setName(user.name);
      setGender(user.gender);
      setSelectedAvatar(user.avatar);
    }
    setMargin(safetyMargin);
  }, [user, safetyMargin, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('El nombre no puede estar vacío', 'warning');
      return;
    }
    if (margin < 1) {
      addToast('El margen de seguridad debe ser al menos de 1 día', 'warning');
      return;
    }

    // Actualizar usuario
    const updatedUser = {
      ...user,
      name: name.trim(),
      gender,
      avatar: selectedAvatar
    };

    dispatch({ type: 'SET_USER', payload: updatedUser });
    dispatch({ type: 'SET_SAFETY_MARGIN', payload: margin });
    addToast('Configuración guardada correctamente.', 'success');
    onClose();
  };

  const handleGenderChange = (newGender: 'man' | 'woman') => {
    setGender(newGender);
    // Cambiar avatar por defecto correspondiente al género
    setSelectedAvatar(newGender === 'man' ? 'man.jpeg' : 'woman.jpeg');
  };

  // 1. Limpiar solo el historial
  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el historial de análisis? No se eliminarán los datos de tu usuario.')) {
      dispatch({ type: 'CLEAR_HISTORY' });
      addToast('Historial de cálculos eliminado.', 'info');
    }
  };

  // 2. Restablecer por completo
  const handleResetAll = () => {
    if (window.confirm('¡ATENCIÓN! Esto eliminará por completo tus datos de usuario, historial, configuración y estadísticas. La aplicación volverá a su estado inicial. ¿Deseas continuar?')) {
      dispatch({ type: 'RESET_APP' });
      addToast('Aplicación restablecida por completo.', 'info');
      onClose();
    }
  };

  // 3. Exportar copia de seguridad (JSON)
  const handleExportBackup = () => {
    const backupData = {
      app: 'AeroShelf',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        user,
        history,
        safetyMargin,
        sessionsCount
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aeroshelf_backup_${user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Copia de seguridad exportada con éxito.', 'success');
  };

  // 4. Importar copia de seguridad (JSON)
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validaciones básicas de integridad
        if (parsed.app !== 'AeroShelf' || !parsed.data) {
          throw new Error('Formato de archivo no válido');
        }

        const { user: impUser, history: impHistory, safetyMargin: impMargin, sessionsCount: impSessions } = parsed.data;

        if (!impUser || !impUser.name || !Array.isArray(impHistory)) {
          throw new Error('Estructura de datos corrupta');
        }

        // Despachar importación
        dispatch({
          type: 'IMPORT_STATE',
          payload: {
            user: impUser,
            history: impHistory,
            safetyMargin: impMargin || 3,
            sessionsCount: impSessions || 1
          }
        });

        addToast('Datos importados y restaurados correctamente.', 'success');
        onClose();
      } catch (err) {
        console.error(err);
        addToast('Error al importar archivo. Asegúrate de usar un backup JSON válido de AeroShelf.', 'error');
      }
    };
    reader.readAsText(file);
    // Limpiar input para permitir subir el mismo archivo después
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-content">
        {/* Cabecera */}
        <div className="settings-header">
          <div className="settings-title-group">
            <Settings className="settings-header-icon" size={20} />
            <h3>Panel de Configuración</h3>
          </div>
          <button onClick={onClose} className="settings-close-btn" aria-label="Cerrar panel">
            <X size={18} />
          </button>
        </div>

        {/* Formularios y acciones */}
        <div className="settings-body">
          <form onSubmit={handleSaveProfile} className="settings-form">
            
            {/* Sección Perfil */}
            <div className="settings-section">
              <h4 className="section-subtitle"><User size={16} /> Identidad del Inspector</h4>
              
              <div className="settings-input-group">
                <label htmlFor="settings-name" className="settings-label">Nombre</label>
                <input
                  id="settings-name"
                  type="text"
                  className="settings-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Género</label>
                <div className="settings-gender-selectors">
                  <button
                    type="button"
                    className={`gender-selector-btn ${gender === 'man' ? 'active' : ''}`}
                    onClick={() => handleGenderChange('man')}
                  >
                    Hombre
                  </button>
                  <button
                    type="button"
                    className={`gender-selector-btn ${gender === 'woman' ? 'active' : ''}`}
                    onClick={() => handleGenderChange('woman')}
                  >
                    Mujer
                  </button>
                </div>
              </div>

              {/* Selección de Avatar */}
              <div className="settings-input-group">
                <label className="settings-label">Avatar Disponible</label>
                <div className="avatar-selection-grid">
                  <button
                    type="button"
                    className={`avatar-choice ${selectedAvatar === 'man.jpeg' ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar('man.jpeg')}
                  >
                    <img src="/assets/avatars/man.jpeg" alt="Avatar Hombre" />
                  </button>
                  <button
                    type="button"
                    className={`avatar-choice ${selectedAvatar === 'woman.jpeg' ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar('woman.jpeg')}
                  >
                    <img src="/assets/avatars/woman.jpeg" alt="Avatar Mujer" />
                  </button>
                </div>
              </div>
            </div>

            {/* Configuración de la Calculadora */}
            <div className="settings-section">
              <h4 className="section-subtitle"><Settings size={16} /> Parámetros del Cálculo</h4>
              
              <div className="settings-input-group">
                <label htmlFor="settings-margin" className="settings-label">
                  Margen de Seguridad por Defecto (días)
                </label>
                <input
                  id="settings-margin"
                  type="number"
                  min={1}
                  className="settings-input"
                  value={margin}
                  onChange={(e) => setMargin(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
                <small className="settings-hint">
                  Días restados automáticamente de la fecha de caducidad antes del cálculo.
                </small>
              </div>
            </div>

            {/* Guardar cambios */}
            <button type="submit" className="save-settings-btn">
              <Save size={16} />
              <span>Guardar Configuración</span>
            </button>
          </form>

          {/* Copia de Seguridad */}
          <div className="settings-section backup-section">
            <h4 className="section-subtitle"><Download size={16} /> Base de Datos (Backup)</h4>
            <p className="section-desc">Exporta e importa tus estadísticas, perfil e historial de cálculos.</p>
            
            <div className="backup-actions">
              <button onClick={handleExportBackup} className="backup-btn export">
                <Download size={15} />
                <span>Exportar Backup</span>
              </button>
              
              <button onClick={triggerFileInput} className="backup-btn import">
                <Upload size={15} />
                <span>Importar Backup</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Restablecimientos / Borrar Datos */}
          <div className="settings-section danger-section">
            <h4 className="section-subtitle danger"><ShieldAlert size={16} /> Zona de Peligro</h4>
            <div className="danger-actions">
              <button onClick={handleClearHistory} className="danger-btn clear-history">
                <Trash2 size={15} />
                <span>Limpiar Historial</span>
              </button>

              <button onClick={handleResetAll} className="danger-btn reset-all">
                <RefreshCw size={15} />
                <span>Restablecer Aplicación</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
