import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ProductStatus } from '../types';
import { 
  Search, Filter, ArrowUpDown, Trash2, 
  FileSpreadsheet, FileText, Printer, ChevronDown 
} from 'lucide-react';
import { format } from 'date-fns';
import './HistoryTable.css';

type SortKey = 'evaluationDate' | 'remainingPercentage' | 'remainingDays' | 'totalShelfLife';
type SortOrder = 'asc' | 'desc';

export const HistoryTable = () => {
  const { state, dispatch, addToast } = useApp();
  const { history } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('evaluationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  if (history.length === 0) {
    return (
      <div className="history-empty-card">
        <h3 className="history-empty-title">Historial de Calidad</h3>
        <p className="history-empty-text">Aún no hay análisis registrados en el sistema.</p>
      </div>
    );
  }

  // Manejo de ordenamiento
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc'); // Por defecto descendente en nuevo campo
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey === key) {
      return <ArrowUpDown size={14} className="sort-icon active" />;
    }
    return <ArrowUpDown size={12} className="sort-icon inactive" />;
  };

  // Convertir fecha DD/MM/YYYY a Date para ordenamiento
  const parseDateString = (dateStr: string): Date => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date();
  };

  // Filtrar e ir ordenando
  const filteredHistory = history
    .filter(record => {
      const matchesSearch = (record.productName || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesFilter = statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'evaluationDate') {
        const dateA = parseDateString(a.evaluationDate).getTime();
        const dateB = parseDateString(b.evaluationDate).getTime();
        comparison = dateA - dateB;
      } else {
        comparison = a[sortKey] - b[sortKey];
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Borrar fila
  const handleDelete = (id: string, name: string) => {
    dispatch({ type: 'DELETE_HISTORY_RECORD', payload: id });
    addToast(`Cálculo de "${name || 'Producto Genérico'}" eliminado del historial.`, 'info');
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'acceptable':
        return <span className="badge status-ok">Aceptable</span>;
      case 'limit-acceptable':
        return <span className="badge status-limit">Límite Aceptable</span>;
      case 'rejected':
        return <span className="badge status-rejected">Rechazado</span>;
      default:
        return null;
    }
  };

  // EXPORTACIONES

  // 1. Exportar a CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Producto',
      'Elaboracion',
      'Caducidad',
      'Evaluacion',
      'Dias Totales',
      'Dias Restantes',
      'Porcentaje Restante',
      'Estado',
      'Margen de Seguridad'
    ];

    const rows = history.map(r => [
      r.id,
      r.productName || 'Genérico',
      r.elaborationDate,
      r.expirationDate,
      r.evaluationDate,
      r.totalShelfLife,
      r.remainingDays,
      `${r.remainingPercentage}%`,
      r.status,
      r.safetyMargin
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_calidad_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Historial exportado a CSV correctamente.', 'success');
  };

  // 2. Exportar a Excel (Formato delimitado compatible)
  const handleExportExcel = () => {
    // Generar formato TSV compatible con Excel
    const headers = [
      'ID',
      'Nombre de Producto',
      'Fecha Elaboración',
      'Fecha Expiración',
      'Fecha Evaluación',
      'Vida Útil Total (Días)',
      'Días Restantes',
      'Porcentaje Restante',
      'Estado de Producto',
      'Margen de Seguridad (Días)'
    ];

    const rows = history.map(r => [
      r.id,
      r.productName || 'Producto Genérico',
      r.elaborationDate,
      r.expirationDate,
      r.evaluationDate,
      r.totalShelfLife,
      r.remainingDays,
      `${r.remainingPercentage}%`,
      r.status === 'acceptable' ? 'Aceptable (Fresco)' : r.status === 'limit-acceptable' ? 'Límite Aceptable' : 'Rechazado',
      r.safetyMargin
    ]);

    const tsvContent = '\uFEFF' + [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_calidad_${format(new Date(), 'yyyyMMdd_HHmmss')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Historial exportado a Excel (XLS) correctamente.', 'success');
  };

  // 3. Exportar a PDF (Ventana limpia para impresión con CSS estructurado)
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      addToast('El navegador bloqueó la ventana emergente de impresión', 'error');
      return;
    }

    const userName = state.user?.name || 'Inspector';
    const dateFormatted = format(new Date(), 'dd/MM/yyyy HH:mm');

    const tableRows = history.map(r => `
      <tr>
        <td>${r.productName || 'Genérico'}</td>
        <td>${r.elaborationDate}</td>
        <td>${r.expirationDate}</td>
        <td>${r.evaluationDate}</td>
        <td>${r.totalShelfLife} días</td>
        <td>${r.remainingDays} días</td>
        <td><strong>${r.remainingPercentage}%</strong></td>
        <td><span class="status-cell ${r.status}">${r.status === 'acceptable' ? 'Aceptable' : r.status === 'limit-acceptable' ? 'Límite' : 'Rechazado'}</span></td>
        <td>${r.safetyMargin} d</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Vida Útil de Productos - AeroShelf</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 20px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .meta { text-align: right; font-size: 12px; color: #666; }
            h1 { font-size: 20px; color: #1f2937; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
            th { background-color: #f3f4f6; color: #374151; font-weight: 700; text-align: left; padding: 10px; border-bottom: 1px solid #d1d5db; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .status-cell { font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px; text-transform: uppercase; }
            .status-cell.acceptable { background-color: #d1fae5; color: #065f46; }
            .status-cell.limit-acceptable { background-color: #fef3c7; color: #92400e; }
            .status-cell.rejected { background-color: #fee2e2; color: #991b1b; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 10px; color: #999; margin-top: 40px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">AeroShelf - Reporte de Calidad</div>
              <div style="font-size: 12px; color: #555; margin-top: 4px;">Control de vida útil de inventario</div>
            </div>
            <div class="meta">
              <div><strong>Inspector:</strong> ${userName}</div>
              <div><strong>Generado:</strong> ${dateFormatted}</div>
              <div><strong>Registros:</strong> ${history.length} productos</div>
            </div>
          </div>
          
          <h1>Historial de Evaluación de Calidad</h1>
          
          <table>
            <thead>
              <tr>
                <th>Producto / Lote</th>
                <th>F. Elab.</th>
                <th>F. Venc.</th>
                <th>F. Eval.</th>
                <th>Vida Total</th>
                <th>Días Rest.</th>
                <th>% Rest.</th>
                <th>Estado</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            Reporte oficial automatizado del sistema de control de calidad AeroShelf. Todos los derechos reservados.
          </div>

          <script>
            window.onload = function() {
              window.print();
              // Opcional: Cerrar ventana tras imprimir
              // window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    addToast('Ventana de impresión de PDF enviada.', 'success');
  };

  return (
    <div className="history-section">
      <div className="history-header-bar">
        <h3 className="history-title">Historial de Control ({filteredHistory.length})</h3>
        
        {/* Controles de Exportación */}
        <div className="export-buttons">
          <button onClick={handleExportCSV} className="export-btn" title="Exportar a CSV">
            <FileText size={16} />
            <span>CSV</span>
          </button>
          <button onClick={handleExportExcel} className="export-btn" title="Exportar a Excel">
            <FileSpreadsheet size={16} />
            <span>Excel</span>
          </button>
          <button onClick={handleExportPDF} className="export-btn" title="Imprimir PDF">
            <Printer size={16} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="history-filters-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <div className="select-container">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los Estados</option>
              <option value="acceptable">Aceptable (Fresco)</option>
              <option value="limit-acceptable">Límite Aceptable</option>
              <option value="rejected">Rechazado</option>
            </select>
            <ChevronDown size={14} className="select-arrow" />
          </div>
        </div>
      </div>

      {/* Tabla Responsiva */}
      <div className="table-responsive-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Producto / Lote</th>
              <th onClick={() => handleSort('evaluationDate')} className="sortable">
                Evaluado {getSortIcon('evaluationDate')}
              </th>
              <th>Elaboración</th>
              <th>Expiración</th>
              <th onClick={() => handleSort('totalShelfLife')} className="sortable text-right">
                Vida Total {getSortIcon('totalShelfLife')}
              </th>
              <th onClick={() => handleSort('remainingDays')} className="sortable text-right">
                Días Restantes {getSortIcon('remainingDays')}
              </th>
              <th onClick={() => handleSort('remainingPercentage')} className="sortable text-right">
                % Restante {getSortIcon('remainingPercentage')}
              </th>
              <th>Estado</th>
              <th className="text-center">Margen</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((record) => (
              <tr key={record.id} className="history-row">
                <td className="row-product-name" title={record.productName}>
                  {record.productName || <span className="generic-placeholder">Sin Nombre (Genérico)</span>}
                </td>
                <td className="row-date">{record.evaluationDate}</td>
                <td className="row-date">{record.elaborationDate}</td>
                <td className="row-date">{record.expirationDate}</td>
                <td className="row-number text-right">{record.totalShelfLife} días</td>
                <td className="row-number text-right">{record.remainingDays} días</td>
                <td className="row-number text-right font-bold">
                  {record.remainingPercentage}%
                </td>
                <td>{getStatusBadge(record.status)}</td>
                <td className="row-margin text-center">{record.safetyMargin} d</td>
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(record.id, record.productName)}
                    className="delete-row-btn"
                    title="Eliminar de historial"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && (
        <div className="no-filter-results">
          <p>No se encontraron resultados con los filtros actuales.</p>
        </div>
      )}
    </div>
  );
};
