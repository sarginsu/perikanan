import React, { useEffect, useContext } from 'react';
import Highcharts from 'highcharts';

import { MyContext } from "../../pages/Dashboard/index.js";

const PieChart = ({
  container, province
}) => {
  const data = useContext(MyContext);

  useEffect(() => {
    const getChart = () => {
      let arrProvinsi = [];
      let tempProvinsi = [];
      data.forEach(val => {
        const { area_provinsi } = val;
        arrProvinsi.push(area_provinsi);

        const index = tempProvinsi.indexOf(area_provinsi);
        if (index === -1) {
          tempProvinsi.push(area_provinsi);
        }
      });

      let dataChart = [];
      tempProvinsi.forEach(val => {
        const total = arrProvinsi.filter(item => item === val);
        const temp = {
          name: val,
          y: parseInt(total.length)
        }
        dataChart.push(temp);
      });

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
        series: [{
          name: 'Provinsi',
          colorByPoint: true,
          data: dataChart
        }]
      });
    };
    getChart();
  }, [container, data, province]);

  return (
    <figure className="highcharts-figure">
      <div id={container}></div>
    </figure>
  )
};

export default PieChart;