import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

interface Props {
  distribution: { accepted: number; rejected: number; limit: number };
}

export const AcceptanceDonut = ({ distribution }: Props) => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';

  const data = {
    labels: ['Aceptados', 'Límite', 'Rechazados'],
    datasets: [
      {
        data: [
          distribution.accepted,
          distribution.limit,
          distribution.rejected,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: textColor,
          padding: 12,
          boxWidth: 10,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};
