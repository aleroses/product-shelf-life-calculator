import type { ReactNode } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Tooltip } from '../ui/Tooltip';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import './StatCard.css';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  tooltip?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  animate?: boolean;
}

export const StatCard = ({
  icon,
  label,
  value,
  suffix = '',
  tooltip,
  variant = 'default',
  animate = true,
}: StatCardProps) => {
  const content = (
    <GlassCard className={`stat-card stat-card--${variant}`} hover>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">
          {typeof value === 'number' && animate ? (
            <AnimatedCounter value={value} suffix={suffix} />
          ) : (
            <>
              {value}
              {suffix}
            </>
          )}
        </span>
      </div>
    </GlassCard>
  );

  return tooltip ? (
    <Tooltip content={tooltip} block>
      {content}
    </Tooltip>
  ) : (
    content
  );
};
