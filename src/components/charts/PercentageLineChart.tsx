import { Line } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

interface Props {
  data: { date: string; percentage: number }[];
}

export const PercentageLineChart = ({ data }: Props) => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: '% Vida útil',
        data: data.map((d) => d.percentage),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};
