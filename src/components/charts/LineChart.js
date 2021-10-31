import React, { useEffect, useContext } from 'react';
import Highcharts from 'highcharts';
import { MyContext } from "../../pages/Dashboard/index.js";

const LineChart = ({
  container
}) => {
  const data = useContext(MyContext);

  useEffect(() => {
    const getChart = () => {
      const categories = [];
      const dataPrice = [];
      const limit = data.length > 10 ? 10 : data.length;
      for (let i = 0; i < limit; i++) {
        const { komoditas, price } = data[i];
        categories.push(komoditas);
        dataPrice.push(parseInt(price));
      }

      Highcharts.chart(container, {
        chart: {
          type: 'column'
        },
        title: false,
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Harga (Rp)'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>RP {point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Komoditas',
          data: dataPrice
        }]
      });
    }
    getChart();
  }, [container, data]);

  return (
    <figure className="highcharts-figure">
      <div id={container}></div>
    </figure>
  )
};

export default LineChart;