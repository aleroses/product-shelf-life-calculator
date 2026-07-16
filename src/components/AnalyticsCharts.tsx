import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Chart, registerables } from 'chart.js';
import { BarChart3, PieChart, Activity } from 'lucide-react';
import { subDays, format } from 'date-fns';
import './AnalyticsCharts.css';

Chart.register(...registerables);

export const AnalyticsCharts = () => {
  const { state } = useApp();
  const { history, theme } = state;

  const donutCanvasRef = useRef<HTMLCanvasElement>(null);
  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);

  const donutChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const lineChartRef = useRef<Chart | null>(null);

  const hasData = history.length > 0;

  // Colores según el tema (oscuro/claro)
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const activeBlue = '#3b82f6';
  const activeViolet = '#8b5cf6';

  // 1. Gráfico Donut: Aceptados vs Rechazados
  useEffect(() => {
    if (!donutCanvasRef.current || !hasData) return;

    // Destruir instancia anterior
    if (donutChartRef.current) {
      donutChartRef.current.destroy();
    }

    const acceptable = history.filter(r => r.status === 'acceptable').length;
    const limit = history.filter(r => r.status === 'limit-acceptable').length;
    const rejected = history.filter(r => r.status === 'rejected').length;

    const ctx = donutCanvasRef.current.getContext('2d');
    if (!ctx) return;

    donutChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Fresco (Aceptado)', 'Límite (Aceptado)', 'Rechazado'],
        datasets: [{
          data: [acceptable, limit, rejected],
          backgroundColor: [
            'rgba(16, 185, 129, 0.85)', // verde
            'rgba(245, 158, 11, 0.85)',  // amarillo
            'rgba(239, 68, 68, 0.85)'   // rojo
          ],
          borderColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { size: 11, family: 'system-ui' },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#1f2937',
            bodyColor: textColor,
            borderColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 1,
          }
        },
        cutout: '65%'
      }
    });

    return () => {
      if (donutChartRef.current) {
        donutChartRef.current.destroy();
        donutChartRef.current = null;
      }
    };
  }, [history, theme, hasData]);

  // 2. Gráfico de Barras: Análisis en los últimos 7 días
  useEffect(() => {
    if (!barCanvasRef.current || !hasData) return;

    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    // Calcular últimos 7 días (de hace 6 días a hoy)
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
    const labels = last7Days.map(date => format(date, 'dd/MM'));

    // Agrupar cálculos por fecha corta (dd/MM/yyyy)
    const countsByDate: Record<string, number> = {};
    history.forEach(record => {
      countsByDate[record.evaluationDate] = (countsByDate[record.evaluationDate] || 0) + 1;
    });

    const data = last7Days.map(date => {
      const formattedDate = format(date, 'dd/MM/yyyy');
      return countsByDate[formattedDate] || 0;
    });

    const ctx = barCanvasRef.current.getContext('2d');
    if (!ctx) return;

    // Crear gradiente para barras
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.85)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');

    barChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Análisis',
          data,
          backgroundColor: gradient,
          borderColor: activeBlue,
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#1f2937',
            bodyColor: textColor,
            borderColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 1,
          }
        },
        scales: {
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              stepSize: 1,
              font: { size: 10 }
            },
            min: 0
          },
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { size: 10 }
            }
          }
        }
      }
    });

    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
        barChartRef.current = null;
      }
    };
  }, [history, theme, hasData]);

  // 3. Gráfico de Línea: Porcentaje de vida útil en el tiempo
  useEffect(() => {
    if (!lineCanvasRef.current || !hasData) return;

    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    // Tomar los últimos 15 análisis del historial y ponerlos cronológicamente (reverso)
    const recentHistory = [...history].slice(0, 15).reverse();
    const labels = recentHistory.map((r, index) => r.productName ? `${r.productName.substring(0, 10)}...` : `#${recentHistory.length - index}`);
    const data = recentHistory.map(r => r.remainingPercentage);

    const ctx = lineCanvasRef.current.getContext('2d');
    if (!ctx) return;

    // Crear gradiente de línea
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    lineChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: '% Vida Útil Restante',
          data,
          fill: true,
          backgroundColor: gradient,
          borderColor: activeViolet,
          borderWidth: 2.5,
          tension: 0.35,
          pointBackgroundColor: activeBlue,
          pointBorderColor: isDark ? '#1e293b' : '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#1f2937',
            bodyColor: textColor,
            borderColor: 'rgba(59, 130, 246, 0.2)',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const idx = context.dataIndex;
                const rec = recentHistory[idx];
                return `% Restante: ${context.parsed.y}% (${rec.remainingDays} días rest. / ${rec.totalShelfLife} días tot.)`;
              }
            }
          }
        },
        scales: {
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 10 }
            },
            max: 100,
            min: 0
          },
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { size: 9 },
              maxRotation: 45,
              minRotation: 0
            }
          }
        }
      }
    });

    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
        lineChartRef.current = null;
      }
    };
  }, [history, theme, hasData]);

  if (!hasData) {
    return (
      <div className="analytics-charts-empty">
        <p className="no-charts-text">Calcula y guarda productos para generar las gráficas estadísticas</p>
      </div>
    );
  }

  return (
    <div className="analytics-charts-container">
      {/* Gráfico 1: Aceptados vs Rechazados */}
      <div className="chart-card">
        <div className="chart-header">
          <PieChart size={16} className="chart-header-icon violet" />
          <h4 className="chart-title">Distribución de Estados</h4>
        </div>
        <div className="canvas-wrapper">
          <canvas ref={donutCanvasRef}></canvas>
        </div>
      </div>

      {/* Gráfico 2: Análisis por día */}
      <div className="chart-card">
        <div className="chart-header">
          <BarChart3 size={16} className="chart-header-icon blue" />
          <h4 className="chart-title">Análisis Semanal (Últimos 7 días)</h4>
        </div>
        <div className="canvas-wrapper">
          <canvas ref={barCanvasRef}></canvas>
        </div>
      </div>

      {/* Gráfico 3: Porcentaje restante en el tiempo */}
      <div className="chart-card line-chart-card">
        <div className="chart-header">
          <Activity size={16} className="chart-header-icon green" />
          <h4 className="chart-title">Tendencia de Vida Útil (% Restante)</h4>
        </div>
        <div className="canvas-wrapper">
          <canvas ref={lineCanvasRef}></canvas>
        </div>
      </div>
    </div>
  );
};
