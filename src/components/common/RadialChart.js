import Chart from "react-apexcharts";
import { useTheme } from '@mui/material/styles';
import ApexCharts from "apexcharts";
import { useEffect } from "react";
import { styled } from '@mui/material/styles';

const StyledChart = styled(Chart)(({ theme }) => ({

}));

export default function RadialChart({ series, width, index, isHovered, labelsData, legendOffsetX = 10, legendOffsetY = 0, verticalMargin = 0, legendFontSize = 12 }) {
    const theme = useTheme()

    const chartOptions = {
        options: {
            chart: {
                id: 'chart' + index,
                type: 'radialBar',
                sparkline: {
                    enabled: true
                },
                animations: {
                    // enabled: false,
                    // easing: "linear",
                    // dynamicAnimation: {
                    //     enabled: true,
                    //     speed: 300
                    // }
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
                theme: 'dark',
                style: {
                    fontSize: '12px',
                    fontFamily: undefined,
                },
                onDatasetHover: {
                    highlightDataSeries: true,
                },
            },
            colors: [theme.palette.chart.red, theme.palette.chart.green, theme.palette.chart.yellow],
            stroke: {
                lineCap: 'round',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 360,
                    hollow: {
                        size: '13%',
                    },
                    dataLabels: {
                        name: {
                            // fontSize: '22px',
                            show: false,
                        },
                        value: {
                            fontSize: '14px',
                            offsetY: 4,
                        },
                        // total: {
                        //     show: true,
                        //     label: 'Total',
                        //     formatter: function (w) {
                        //         // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                        //         return 249
                        //     }
                        // }
                    }
                }
            },
            labels: labelsData,
            // legend: {
            //     show: false,
            //     showForSingleSeries: false,
            //     showForNullSeries: true,
            //     showForZeroSeries: true,
            //     floating: true,
            //     fontSize: legendFontSize,
            //     fontWeight: 700,
            //     position: 'left',
            //     offsetX: legendOffsetX,
            //     offsetY: legendOffsetY,
            //     verticalAlign: 'right',
            //     labels: {
            //         useSeriesColors: false,
            //         colors: theme.palette.black
            //     },
            //     markers: {
            //         width: 0,
            //         height: 0,
            //     },
            //     formatter: function (seriesName, opts) {
            //         return [seriesName, ""]
            //     },
            //     itemMargin: {
            //         vertical: verticalMargin
            //     },
            // },
        },
    };

    useEffect(() => {
        if (isHovered) {
            ApexCharts.exec('chart' + index, 'updateSeries', [0, 0, 0])
            ApexCharts.exec('chart' + index, 'updateSeries', [90, 99, 99])
        }
    }, [isHovered])

    return (
        <StyledChart
            options={chartOptions.options}
            series={series}
            type="radialBar"
            width={width}

        />
    );
}
