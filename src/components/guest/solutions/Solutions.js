import Chart from "react-apexcharts";
import { useTheme } from '@mui/material/styles';
import ApexCharts from "apexcharts";
import { useEffect } from "react";

export default function Solutions() {
    const theme = useTheme()

    const chartOptions = {
        options: {
            chart: {
                height: 390,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            show: false,
                        }
                    }
                }
            },
            colors: ['#1ab7ea', '#0084ff', '#39539E'],
            labels: ['Vimeo', 'Messenger', 'Facebook'],
            legend: {
                show: true,
                floating: true,
                fontSize: '16px',
                position: 'left',
                offsetX: 80,
                offsetY: 15,
                labels: {
                    useSeriesColors: true,
                },
                markers: {
                    size: 0
                },
                formatter: function (seriesName, opts) {
                    return " " + seriesName
                },
                itemMargin: {
                    vertical: 3
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        show: false
                    }
                }
            }]
        }
    };

    return (
        <Chart
            options={chartOptions.options}
            series={[90, 80, 99]}
            type="radialBar"
            width={450}
        />
    );
}