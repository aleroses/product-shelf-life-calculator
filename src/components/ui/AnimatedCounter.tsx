import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({
  value,
  suffix = '',
  prefix = '',
  duration = 800,
  className = '',
}: AnimatedCounterProps) => {
  const animated = useAnimatedCounter(value, duration);
  return (
    <span className={className}>
      {prefix}
      {animated}
      {suffix}
    </span>
  );
};
