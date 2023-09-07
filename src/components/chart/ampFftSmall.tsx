// import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";

export default function AmpFft(props: any) {
  const labels = props.index;
  const plots = props.plots;
  const tv = props.tv;
  const minY = props.minY;
  const maxY = props.maxY;

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },

      annotation: {
        annotations: [
          {
            drawTime: "afterDatasetsDraw",
            type: "line",
            yMin: tv,
            yMax: tv,
            borderColor: "blue",
            borderWidth: 2,
          },
        ],
      },
    },
    interaction: {
      axis: "xy",
    },
    animations: {
      tension: {
        duration: 500,
        easing: "linear",
        from: 0.5,
        to: 0.3,
        loop: true,
      },
    },
    scales: {
      x: {
        // min: 0,
        // max: 100,
        // stacked: true,
        ticks: {
          maxTicksLimit: 20,
        },
      },
      y: {
        // defining min and max so hiding the dataset does not change scale range
        min: minY,
        max: maxY,
        grid: {
          color: function (context: any) {
            if (context.tick.value > 0) {
              return "rgb(75, 192, 192)";
            } else if (context.tick.value < 0) {
              return "rgb(255, 99, 132)";
            }
            return "#000000";
          },
        },
      },
    },
  };

  const data: any = {
    labels: labels,
    datasets: [
      {
        // data: labels.map(() => faker.datatype.number({ min: -100, max: 100 })),
        label: "Amplitude",
        data: plots,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointStyle: false,
      },
      // {
      //   label: "Dataset 2",
      //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return <Line options={options} data={data} />;
}
