import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function AmpChart(props: any) {
  // console.log(props.plots[props.count]);
  // console.log(props.count);
  const labels = props.index;
  // console.log(labels);

  const plots = props.plots;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    interaction: {
      axis: "r",
    },
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 0.5,
        to: 0.3,
        loop: true,
      },
    },
    scales: {
      x: {
        // min: 0,
        // max: 50,
        // stacked: true,
      },
      y: {
        // defining min and max so hiding the dataset does not change scale range
        // min: -50,
        // max: 50,
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
        label: "Dataset 1",
        // data: labels.map(() => faker.datatype.number({ min: -100, max: 100 })),
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
