import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ComparisonChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => (item.tipo.length > 20 ? item.tipo.substring(0, 20) + "..." : item.tipo)),
    datasets: [
      {
        label: "Tempo Mínimo (meses)",
        data: data.map((item) => item.tempo.min),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Tempo Máximo (meses)",
        data: data.map((item) => item.tempo.max),
        backgroundColor: "rgba(147, 197, 253, 0.6)",
        borderColor: "rgba(147, 197, 253, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const item = data[context.dataIndex]
            return item.isSelected ? "← Sua consulta" : ""
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tempo (meses)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Tipo de Ação",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: (context) => {
          const item = data[context.dataIndex]
          return item?.isSelected ? 3 : 1
        },
        borderColor: (context) => {
          const item = data[context.dataIndex]
          return item?.isSelected ? "#dc2626" : undefined
        },
      },
    },
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ComparisonChart
