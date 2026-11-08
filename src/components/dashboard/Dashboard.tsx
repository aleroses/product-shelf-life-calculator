import { useMemo } from 'react';
import {
  User,
  Calendar,
  Flame,
  Calculator,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Timer,
  Trophy,
  AlertTriangle,
  CalendarClock,
  FlaskConical,
  Star,
} from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { computeDashboardStats, formatDateLong } from '../../services/dateService';
import { getUserLevel, getLevelProgress } from '../../services/levelService';
import { StatCard } from './StatCard';
import { ActivityCalendar } from './ActivityCalendar';
import { GlassCard } from '../ui/GlassCard';
import './Dashboard.css';

const STATUS_LABELS: Record<string, string> = {
  acceptable: 'Aceptable',
  'limit-acceptable': 'Límite aceptable',
  rejected: 'Rechazado',
};

export const Dashboard = () => {
  const { state } = useApp();
  const { stats, user, history } = state;

  const dashStats = useMemo(
    () => computeDashboardStats(history),
    [history]
  );

  const level = getUserLevel(stats.totalCalculations);
  const levelProgress = getLevelProgress(stats.totalCalculations);

  return (
    <section className="dashboard">
      <div className="dashboard__profile-row">
        <GlassCard className="profile-card" hover={false}>
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="profile-card__avatar" />
          )}
          <div className="profile-card__info">
            <h2 className="profile-card__name">{user?.name ?? 'Usuario'}</h2>
            <div className="profile-card__level">
              <Star size={16} />
              <span>{level}</span>
            </div>
            <div className="profile-card__progress">
              <div
                className="profile-card__progress-bar"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </GlassCard>
        <ActivityCalendar />
      </div>

      <div className="dashboard__grid">
        <StatCard icon={<User size={20} />} label="Nombre" value={user?.name ?? '—'} animate={false} />
        <StatCard
          icon={<Calendar size={20} />}
          label="Primer uso"
          value={
            user?.registrationDate
              ? formatDateLong(user.registrationDate)
              : '—'
          }
          animate={false}
        />
        <StatCard
          icon={<Flame size={20} />}
          label="Veces abierta"
          value={stats.appOpens}
          tooltip="Número de veces que abriste la aplicación"
        />
        <StatCard
          icon={<Calculator size={20} />}
          label="Total cálculos"
          value={stats.totalCalculations}
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Aprobados"
          value={stats.approved}
          variant="success"
        />
        <StatCard
          icon={<XCircle size={20} />}
          label="Rechazados"
          value={stats.rejected}
          variant="danger"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="% Aprobación"
          value={dashStats.approvalRate}
          suffix="%"
          variant="success"
        />
        <StatCard
          icon={<TrendingDown size={20} />}
          label="% Rechazo"
          value={dashStats.rejectionRate}
          suffix="%"
          variant="danger"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Prom. días restantes"
          value={dashStats.avgRemainingDays}
        />
        <StatCard
          icon={<Timer size={20} />}
          label="Prom. vida útil total"
          value={dashStats.avgTotalShelfLife}
        />
        <StatCard
          icon={<Trophy size={20} />}
          label="Mejor %"
          value={stats.bestPercentage}
          suffix="%"
          variant="accent"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Menor %"
          value={stats.worstPercentage}
          suffix="%"
          variant="warning"
        />
        <StatCard
          icon={<CalendarClock size={20} />}
          label="Último cálculo"
          value={
            stats.lastCalculationDate
              ? formatDateLong(stats.lastCalculationDate)
              : '—'
          }
          animate={false}
        />
        <StatCard
          icon={<FlaskConical size={20} />}
          label="Estado último producto"
          value={
            stats.lastProductStatus
              ? STATUS_LABELS[stats.lastProductStatus]
              : '—'
          }
          animate={false}
          variant={
            stats.lastProductStatus === 'rejected'
              ? 'danger'
              : stats.lastProductStatus === 'limit-acceptable'
                ? 'warning'
                : 'success'
          }
        />
        <StatCard
          icon={<Star size={20} />}
          label="Nivel"
          value={level}
          animate={false}
          variant="accent"
        />
      </div>
    </section>
  );
};
