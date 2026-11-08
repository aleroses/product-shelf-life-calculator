import { useState } from 'react';
import { User, UserRound, Download, Upload, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { useApp } from '../../hooks/useApp';
import {
  getAvatarPath,
  exportAllData,
  importAllData,
} from '../../services/storageService';
import { exportStatsJSON } from '../../services/exportService';
import type { Gender, ExportData } from '../../types';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { state, dispatch, resetApplication } = useApp();
  const [name, setName] = useState(state.user?.name ?? '');
  const [gender, setGender] = useState<Gender>(state.user?.gender ?? 'male');
  const [defaultMargin, setDefaultMargin] = useState(
    state.config.defaultSafetyMargin
  );

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }

    dispatch({
      type: 'SET_USER',
      payload: {
        name: name.trim(),
        gender,
        avatar: getAvatarPath(gender),
        registrationDate:
          state.user?.registrationDate ?? new Date().toISOString(),
      },
    });

    dispatch({
      type: 'SET_CONFIG',
      payload: {
        ...state.config,
        defaultSafetyMargin: defaultMargin,
        lastSafetyMargin: defaultMargin,
      },
    });

    toast.success('Configuración guardada');
    onClose();
  };

  const handleExport = () => {
    const data = exportAllData();
    exportStatsJSON(data);
    toast.success('Estadísticas exportadas');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as ExportData;
          if (importAllData(data)) {
            dispatch({
              type: 'LOAD_PERSISTED_STATE',
              payload: {
                user: data.user,
                history: data.history,
                stats: data.stats,
                config: data.config,
                theme: data.theme,
                showWelcomeModal: !data.user,
              },
            });
            if (data.theme) {
              dispatch({ type: 'SET_THEME', payload: data.theme });
            }
            setName(data.user?.name ?? '');
            setGender(data.user?.gender ?? 'male');
            setDefaultMargin(
              data.config?.defaultSafetyMargin ?? state.config.defaultSafetyMargin
            );
            toast.success('Datos importados correctamente');
          } else {
            toast.error('Error al importar datos');
          }
        } catch {
          toast.error('Archivo inválido');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (
      window.confirm(
        '¿Estás seguro? Se eliminarán todos los datos: usuario, historial, estadísticas y configuración.'
      )
    ) {
      resetApplication();
      setName('');
      setGender('male');
      setDefaultMargin(3);
      toast.success('Aplicación restablecida');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración" size="md">
      <div className="settings-field">
        <label htmlFor="settings-name" className="settings-label">
          Nombre
        </label>
        <input
          id="settings-name"
          type="text"
          className="settings-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="settings-field">
        <span className="settings-label">Género / Avatar</span>
        <div className="settings-gender">
          <button
            type="button"
            className={`settings-gender-btn ${gender === 'male' ? 'active' : ''}`}
            onClick={() => setGender('male')}
          >
            <User size={20} /> Hombre
          </button>
          <button
            type="button"
            className={`settings-gender-btn ${gender === 'female' ? 'active' : ''}`}
            onClick={() => setGender('female')}
          >
            <UserRound size={20} /> Mujer
          </button>
        </div>
        <img
          src={getAvatarPath(gender)}
          alt="Vista previa avatar"
          className="settings-avatar-preview"
        />
      </div>

      <div className="settings-field">
        <label htmlFor="settings-margin" className="settings-label">
          Margen de seguridad por defecto (días)
        </label>
        <input
          id="settings-margin"
          type="number"
          min={1}
          className="settings-input"
          value={defaultMargin}
          onChange={(e) =>
            setDefaultMargin(Math.max(1, parseInt(e.target.value) || 1))
          }
        />
      </div>

      <div className="settings-actions">
        <button type="button" className="settings-btn" onClick={handleSave}>
          Guardar cambios
        </button>
        <button
          type="button"
          className="settings-btn settings-btn--secondary"
          onClick={handleExport}
        >
          <Download size={16} /> Exportar estadísticas
        </button>
        <button
          type="button"
          className="settings-btn settings-btn--secondary"
          onClick={handleImport}
        >
          <Upload size={16} /> Importar estadísticas
        </button>
        <button
          type="button"
          className="settings-btn settings-btn--danger"
          onClick={handleReset}
        >
          <RotateCcw size={16} /> Restablecer aplicación
        </button>
      </div>
    </Modal>
  );
};
