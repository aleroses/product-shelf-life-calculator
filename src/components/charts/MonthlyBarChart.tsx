import { Bar } from 'react-chartjs-2';
import { useApp } from '../../hooks/useApp';

interface Props {
  data: { month: string; count: number }[];
}

export const MonthlyBarChart = ({ data }: Props) => {
  const { state } = useApp();
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Productos',
        data: data.map((d) => d.count),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
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
        ticks: { color: textColor },
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
