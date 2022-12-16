import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement);

const StorageChart = ({ storageBreakdown, totalStorage }) => {
  const colors = {
    Video: "#B497D6",
    Documents: "#583da1",
    Audio: "#05204A",
    Photo: "#5296A5",
  };

  const chartColors = [];
  const chartData = [];

  Object.keys(storageBreakdown).map((type) => {
    chartColors.push(colors[type]);
    chartData.push(storageBreakdown[type]);
  });

  chartColors.push("lightgray");
  chartData.push(100 - totalStorage);

  const data = {
    datasets: [
      {
        data: chartData,
        backgroundColor: chartColors,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    rotation: -90,
    circumference: 180,
    maintainASpectRatio: false,
    responsive: true,
    cutout: 110,
  };

  return (
    <Doughnut data={data} options={options} width={"100px"} height={"100px"} />
  );
};

export default StorageChart;
