import type { ReactNode, CSSProperties } from 'react';
import './GlassCard.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className = '',
  style,
  hover = true,
  onClick,
}: GlassCardProps) => (
  <div
    className={`glass-card ${hover ? 'glass-card--hover' : ''} ${className}`}
    style={style}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') onClick();
          }
        : undefined
    }
  >
    {children}
  </div>
);
