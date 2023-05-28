import axios from "axios";
import React from "react";
import { Line } from "react-chartjs-2";
import { useQuery } from "react-query";
import {
  Chart,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  LineElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";
import { Loader } from "./Loader";
Chart.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  LineElement
);
const LineGraph = () => {
  // Fetch graph data for cases with date
  const { data: graphData, isLoading } = useQuery("graphData", () =>
    axios
      .get("https://disease.sh/v3/covid-19/historical/all?lastdays=all")
      .then((response) => response.data)
  );

  const graphCasesData = graphData?.cases;

  const graphDataArray = Object.keys(graphCasesData || {}).map((date) => ({
    date,
    cases: graphCasesData[date],
  }));

  const graphDates = graphDataArray.map((data) => data.date);
  const graphCaseCounts = graphDataArray.map((data) => data.cases);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Line
          data={{
            labels: graphDates.map((date) =>
              format(new Date(date), "MM/dd/yyyy")
            ),
            datasets: [
              {
                label: "Cases",
                data: Object.values(graphCaseCounts),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                type: "time",
                time: {
                  parser: "MM/dd/yyyy",
                  tooltipFormat: "MMM dd, yyyy",
                },
              },
            },
          }}
        />
      )}
    </>
  );
};

export default LineGraph;
