import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const PieChart = (props) => {
  const { container, data } = props;

  useEffect(() => {
    const getChart = () => {
      Highcharts.chart(container, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: false,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        series: data
      });
    };
    getChart();
  }, [container, data]);

  return (
    <figure className="highcharts-figure">
      <div id={container}></div>
    </figure>
  )
};

export default PieChart;