import type { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  block?: boolean;
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  block = false,
}: TooltipProps) => (
  <span
    className={`tooltip-wrapper tooltip-wrapper--${position}${block ? ' tooltip-wrapper--block' : ''}`}
  >
    {children}
    <span className="tooltip-content" role="tooltip">
      {content}
    </span>
  </span>
);
