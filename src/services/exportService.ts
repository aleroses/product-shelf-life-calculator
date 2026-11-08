import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { HistoryRecord } from '../types';
import { formatDate, formatDateLong } from './dateService';
import { parseISO } from 'date-fns';

const STATUS_LABELS: Record<string, string> = {
  acceptable: 'Aceptable',
  'limit-acceptable': 'Límite aceptable',
  rejected: 'Rechazado',
};

const historyToRows = (history: HistoryRecord[]) =>
  history.map((r) => ({
    'Fecha elaboración': formatDate(parseISO(r.elaborationDate)),
    'Fecha caducidad': formatDate(parseISO(r.expirationDate)),
    'Fecha evaluación': formatDate(parseISO(r.evaluationDate)),
    'Vida útil total': r.totalShelfLife,
    'Días restantes': r.remainingDays,
    'Porcentaje': `${r.remainingPercentage}%`,
    Estado: STATUS_LABELS[r.status] ?? r.status,
    'Margen seguridad': r.safetyMargin,
    'Fecha registro': formatDate(parseISO(r.createdAt)),
  }));

export const exportHistoryCSV = (history: HistoryRecord[]): void => {
  const rows = historyToRows(history);
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => `"${String(row[h as keyof typeof row]).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, 'historial-vida-util.csv', 'text/csv;charset=utf-8;');
};

export const exportHistoryExcel = (history: HistoryRecord[]): void => {
  const rows = historyToRows(history);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Historial');
  XLSX.writeFile(wb, 'historial-vida-util.xlsx');
};

export const exportHistoryPDF = (history: HistoryRecord[]): void => {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('Historial de Vida Útil de Productos', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generado: ${formatDateLong(new Date())}`, 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [
      [
        'Elaboración',
        'Caducidad',
        'Evaluación',
        'Total',
        'Restantes',
        '%',
        'Estado',
        'Margen',
      ],
    ],
    body: history.map((r) => [
      formatDate(parseISO(r.elaborationDate)),
      formatDate(parseISO(r.expirationDate)),
      formatDate(parseISO(r.evaluationDate)),
      r.totalShelfLife,
      r.remainingDays,
      `${r.remainingPercentage}%`,
      STATUS_LABELS[r.status],
      r.safetyMargin,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save('historial-vida-util.pdf');
};

export const exportStatsJSON = (data: object): void => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'estadisticas-vida-util.json', 'application/json');
};

const downloadFile = (content: string, filename: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
