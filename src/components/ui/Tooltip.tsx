import type { ReactNode } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
}: TooltipProps) => (
  <span className={`tooltip-wrapper tooltip-wrapper--${position}`}>
    {children}
    <span className="tooltip-content" role="tooltip">
      {content}
    </span>
  </span>
);
