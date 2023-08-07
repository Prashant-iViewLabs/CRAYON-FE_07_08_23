import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import ApexCharts from "apexcharts";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { percentToValue, valueToPercent } from "../../utils/Common";

const StyledChart = styled(Chart)(({ theme }) => ({}));

export default function SingleRadialChart({
  series,
  width,
  index,
  isHovered,
  labelsData,
  color,
  hollow = "65%",
  nameSize = "12px",
  valueSize = "20px",
  nameOffsetY = 16,
  valueOffsetY = -16,
  max = 100,
}) {
  const theme = useTheme();

  const chartOptions = {
    options: {
      chart: {
        id: "chart" + index,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: true,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: true,
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
      },
      colors: [color],
      stroke: {
        lineCap: "round",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 10,
          endAngle: 360,
          hollow: {
            size: hollow,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: nameSize,
              show: true,
              offsetY: nameOffsetY,
              fontWeight: 500,
              color: "#404040",
            },
            value: {
              show: true,

              fontSize: valueSize,
              offsetY: valueOffsetY,
              fontWeight: 700,
              color: "black",
              formatter: function (val) {
                return [percentToValue(max, val)];
              },
            },
          },
        },
      },
      labels: [labelsData],
    },
  };

  // useEffect(() => {
  //     if (isHovered) {
  //         ApexCharts.exec('chart' + index, 'updateSeries', [0, 0, 0])
  //         ApexCharts.exec('chart' + index, 'updateSeries', [90, 99, 99])
  //     }
  // }, [isHovered])

  return (
    <StyledChart
      options={chartOptions.options}
      // series={series}
      series={
        //   labelsData == "notice"
        //     ? [`${valueToPercent(max, series[0])} days`]
        //     : [valueToPercent(max, series[0])]
        [valueToPercent(max, series[0])]
      }
      type="radialBar"
      width={width}
    />
  );
}
