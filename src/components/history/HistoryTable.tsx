import { useState, useMemo } from 'react';
import {
  Search,
  Trash2,
  Download,
  FileSpreadsheet,
  FileText,
  Eraser,
  ArrowUpDown,
} from 'lucide-react';
import { parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useApp } from '../../hooks/useApp';
import { formatDate } from '../../services/dateService';
import {
  exportHistoryCSV,
  exportHistoryExcel,
  exportHistoryPDF,
} from '../../services/exportService';
import { GlassCard } from '../ui/GlassCard';
import type { HistoryFilters, ProductStatus } from '../../types';
import './HistoryTable.css';

const STATUS_LABELS: Record<ProductStatus, string> = {
  acceptable: 'Aceptable',
  'limit-acceptable': 'Límite',
  rejected: 'Rechazado',
};

const defaultFilters: HistoryFilters = {
  search: '',
  status: 'all',
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const HistoryTable = () => {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState<HistoryFilters>(defaultFilters);

  const filtered = useMemo(() => {
    let records = [...state.history];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          formatDate(parseISO(r.elaborationDate)).includes(q) ||
          formatDate(parseISO(r.expirationDate)).includes(q) ||
          STATUS_LABELS[r.status].toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      records = records.filter((r) => r.status === filters.status);
    }

    records.sort((a, b) => {
      const dir = filters.sortDirection === 'asc' ? 1 : -1;
      switch (filters.sortField) {
        case 'remainingPercentage':
          return (a.remainingPercentage - b.remainingPercentage) * dir;
        case 'totalShelfLife':
          return (a.totalShelfLife - b.totalShelfLife) * dir;
        case 'remainingDays':
          return (a.remainingDays - b.remainingDays) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        default:
          return a.createdAt.localeCompare(b.createdAt) * dir;
      }
    });

    return records;
  }, [state.history, filters]);

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_HISTORY_RECORD', payload: id });
    toast.success('Registro eliminado');
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Eliminar todo el historial? El perfil de usuario se conservará.')) {
      dispatch({ type: 'CLEAR_HISTORY' });
      toast.success('Historial eliminado');
    }
  };

  const toggleSort = (field: HistoryFilters['sortField']) => {
    setFilters((f) => ({
      ...f,
      sortField: field,
      sortDirection:
        f.sortField === field && f.sortDirection === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <section className="history-section">
      <div className="history-header">
        <h2 className="section-title">Historial de Cálculos</h2>
        <div className="history-actions">
          <button
            className="history-btn"
            onClick={() => exportHistoryCSV(state.history)}
            disabled={state.history.length === 0}
            title="Exportar CSV"
          >
            <Download size={16} /> CSV
          </button>
          <button
            className="history-btn"
            onClick={() => exportHistoryExcel(state.history)}
            disabled={state.history.length === 0}
            title="Exportar Excel"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            className="history-btn"
            onClick={() => exportHistoryPDF(state.history)}
            disabled={state.history.length === 0}
            title="Exportar PDF"
          >
            <FileText size={16} /> PDF
          </button>
          <button
            className="history-btn history-btn--danger"
            onClick={handleClearHistory}
            disabled={state.history.length === 0}
          >
            <Eraser size={16} /> Limpiar historial
          </button>
        </div>
      </div>

      <GlassCard className="history-filters" hover={false}>
        <div className="history-filters__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por fecha o estado..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>
        <select
          className="history-filters__select"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value as HistoryFilters['status'],
            }))
          }
        >
          <option value="all">Todos los estados</option>
          <option value="acceptable">Aceptable</option>
          <option value="limit-acceptable">Límite aceptable</option>
          <option value="rejected">Rechazado</option>
        </select>
      </GlassCard>

      {filtered.length === 0 ? (
        <GlassCard className="history-empty">
          <p>No hay registros en el historial</p>
        </GlassCard>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>
                  <button onClick={() => toggleSort('createdAt')}>
                    Fecha <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Elaboración</th>
                <th>Caducidad</th>
                <th>
                  <button onClick={() => toggleSort('totalShelfLife')}>
                    Total <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('remainingDays')}>
                    Restantes <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('remainingPercentage')}>
                    % <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('status')}>
                    Estado <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Margen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(parseISO(r.createdAt))}</td>
                  <td>{formatDate(parseISO(r.elaborationDate))}</td>
                  <td>{formatDate(parseISO(r.expirationDate))}</td>
                  <td>{r.totalShelfLife}d</td>
                  <td>{r.remainingDays}d</td>
                  <td>{r.remainingPercentage}%</td>
                  <td>
                    <span className={`history-status history-status--${r.status}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td>{r.safetyMargin}d</td>
                  <td>
                    <button
                      className="history-delete-btn"
                      onClick={() => handleDelete(r.id)}
                      aria-label="Eliminar registro"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
