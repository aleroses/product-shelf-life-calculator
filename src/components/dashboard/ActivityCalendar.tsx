import { useEffect, useMemo, useState } from 'react';
import { getActivityCalendar } from '../../services/dateService';
import { useApp } from '../../hooks/useApp';
import { GlassCard } from '../ui/GlassCard';
import { Tooltip } from '../ui/Tooltip';
import './ActivityCalendar.css';

export const ActivityCalendar = () => {
  const { state } = useApp();
  const [weeksCount, setWeeksCount] = useState(12);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 479px)');
    const update = () => setWeeksCount(mq.matches ? 8 : 12);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const days = useMemo(
    () => getActivityCalendar(state.history, weeksCount),
    [state.history, weeksCount]
  );

  const weeks = useMemo(() => {
    const result: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <GlassCard className="activity-calendar">
      <h3 className="activity-calendar__title">Calendario de actividad</h3>
      <div className="activity-calendar__grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="activity-calendar__week">
            {week.map((day) => (
              <Tooltip
                key={day.date}
                content={`${day.date}: ${day.count} análisis`}
              >
                <div
                  className={`activity-calendar__day activity-calendar__day--level-${day.level}`}
                  aria-label={`${day.date}: ${day.count} análisis`}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      <div className="activity-calendar__legend">
        <span>Menos</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div
            key={l}
            className={`activity-calendar__day activity-calendar__day--level-${l}`}
          />
        ))}
        <span>Más</span>
      </div>
    </GlassCard>
  );
};
