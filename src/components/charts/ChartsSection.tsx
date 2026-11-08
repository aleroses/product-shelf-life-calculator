import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';
import { useApp } from '../../hooks/useApp';
import { computeDashboardStats } from '../../services/dateService';
import { AcceptanceDonut } from './AcceptanceDonut';
import { ShelfLifeGauge } from './ShelfLifeGauge';
import { DailyBarChart } from './DailyBarChart';
import { PercentageLineChart } from './PercentageLineChart';
import { MonthlyBarChart } from './MonthlyBarChart';
import { GlassCard } from '../ui/GlassCard';
import './ChartsSection.css';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler
);

export const ChartsSection = () => {
  const { state } = useApp();
  const dashStats = useMemo(
    () => computeDashboardStats(state.history),
    [state.history]
  );

  if (state.history.length === 0) {
    return (
      <GlassCard className="charts-empty">
        <p>Realiza cálculos para ver las gráficas de estadísticas</p>
      </GlassCard>
    );
  }

  return (
    <section className="charts-section">
      <h2 className="section-title">Gráficas y Estadísticas</h2>
      <div className="charts-grid">
        <GlassCard className="chart-card">
          <h3 className="chart-card__title">Aceptados vs Rechazados</h3>
          <AcceptanceDonut distribution={dashStats.distribution} />
        </GlassCard>
        <GlassCard className="chart-card">
          <h3 className="chart-card__title">Vida útil promedio</h3>
          <ShelfLifeGauge percentage={dashStats.approvalRate} />
        </GlassCard>
        <GlassCard className="chart-card chart-card--wide">
          <h3 className="chart-card__title">Productos revisados por día</h3>
          <DailyBarChart data={dashStats.dailyData} />
        </GlassCard>
        <GlassCard className="chart-card chart-card--wide">
          <h3 className="chart-card__title">% vida útil en el tiempo</h3>
          <PercentageLineChart data={dashStats.percentageOverTime} />
        </GlassCard>
        <GlassCard className="chart-card chart-card--wide">
          <h3 className="chart-card__title">Productos analizados por mes</h3>
          <MonthlyBarChart data={dashStats.monthlyData} />
        </GlassCard>
      </div>

      <div className="stats-summary">
        <GlassCard className="stats-summary__item">
          <span className="stats-summary__label">Vida útil promedio</span>
          <span className="stats-summary__value">{dashStats.avgShelfLife} días</span>
        </GlassCard>
        <GlassCard className="stats-summary__item">
          <span className="stats-summary__label">Mayor vida útil</span>
          <span className="stats-summary__value">{dashStats.maxShelfLife} días</span>
        </GlassCard>
        <GlassCard className="stats-summary__item">
          <span className="stats-summary__label">Menor vida útil</span>
          <span className="stats-summary__value">{dashStats.minShelfLife} días</span>
        </GlassCard>
        <GlassCard className="stats-summary__item">
          <span className="stats-summary__label">Día con mayor actividad</span>
          <span className="stats-summary__value">
            {dashStats.mostActiveDay
              ? `${dashStats.mostActiveDay.date} (${dashStats.mostActiveDay.count})`
              : '—'}
          </span>
        </GlassCard>
        <GlassCard className="stats-summary__item">
          <span className="stats-summary__label">Total revisados</span>
          <span className="stats-summary__value">{dashStats.totalReviewed}</span>
        </GlassCard>
      </div>
    </section>
  );
};
