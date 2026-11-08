import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

interface Props {
  percentage: number;
}

export const ShelfLifeGauge = ({ percentage }: Props) => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)',
          isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(229, 231, 235, 0.8)',
        ],
        borderWidth: 0,
        circumference: 270,
        rotation: 225,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="gauge-container">
      <Doughnut data={data} options={options} />
      <div className="gauge-label">
        <span className="gauge-value">{percentage}%</span>
        <span className="gauge-text">Aprobación</span>
      </div>
    </div>
  );
};
