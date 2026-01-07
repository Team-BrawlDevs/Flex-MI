import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

export default function EmiLineChart({ timeline }) {
  const data = {
    labels: timeline.map(item => item.time),
    datasets: [
      {
        label: "EMI Decision (₹)",
        data: timeline.map(item => item.emiAmount),
        borderColor: "#0A2540",
        backgroundColor: "rgba(10,37,64,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
}
