import { Bar } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

interface Props {
  data: { date: string; count: number }[];
}

export const DailyBarChart = ({ data }: Props) => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const chartData = {
    labels: data.map((d) => d.date.slice(5)),
    datasets: [
      {
        label: 'Productos',
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: textColor, maxRotation: 45 },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};
