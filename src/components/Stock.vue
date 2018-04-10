<template>
  <div class="s12">
    {{this.heading}}
    <div class="card-panel">
          <span class="black-text">
            Current Stock Value: {{this.currentStockValue}}, Last Update\Trading: {{this.keys[0]}}
          </span>
      <p :class="trendClass">Trend: {{this.trend}}</p>
      <div class="row">
        <div class="col s12 m12 l12 xl12">
          <div ref="graph"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['id', 'stockData', 'heading'],
    async mounted() {

      this.keys = Object.keys(this.stockData['data']['Time Series (1min)']);
      this.currentStockValue = this.stockData['data']['Time Series (1min)'][this.keys[0]]['4. close']
      let self = this
      $(document).ready(async () => {
        await self.fetchSixHourData()
        this.graph = self.drawGraph({
          title: 'Stock Movement',
          renderTo: self.$refs.graph,
          categories: self.graphData.categories,
          series: [{
            name: 'Price',
            data: self.graphData.prices,
            color: '#e57373',
            pointStart: new Date(this.keys[0]).getTime(),
            pointInterval: (36 * 10000) / 6,
            tooltip: {
              valuePrefix: 'Stock Value: '
            },
          }],
        });
        self.trend = self.calculateTrend
      })
    },
    data() {
      return {
        currentStockValue: null,
        currentTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        trendClass: null,
        graph: null,
        graphData: [],
        keys: [],
        trend: null
      }
    },
    computed: {
      calculateTrend() {
        let open = parseFloat(this.stockData['data']['Time Series (1min)'][this.keys[0]]['1. open'])
        let close = parseFloat(this.stockData['data']['Time Series (1min)'][this.keys[0]]['4. close'])
        let res = (((close - open) / close) * 100).toFixed(2)
        if (res < 0)
          this.trendClass = 'red-text'
        else
          this.trendClass = 'green-text'

        return `${res}%`
      }
    },
    methods: {
      drawGraph(options) {

        let self = this
        return new Highcharts.stockChart(options.renderTo, {
          xAxis: {
            allowDecimals: true,
            categories: options.categories,
            type: 'datetime'
          },
          yAxis: {title: {text: `${self.heading} Price`, margin: 80}},
          plotOptions: {
            series: {
              pointStart: 100
            }
          },
          credits: false,
          series: options.series || null,
        })

      },
      fetchSixHourData() {
        let lastDataSignatureAt = null;
        let sixHoursBack = moment(this.keys[0]).subtract(6, 'hours').format("YYYY-MM-DD HH:mm:00")
        let lastDataSegment = this.keys[0];
        if(lastDataSegment < this.currentTime)
           lastDataSignatureAt = lastDataSegment
        else
          lastDataSignatureAt = this.currentTime
        let prices = [];
        let categories = [];
        let j = 0;

        while (sixHoursBack < lastDataSignatureAt) {
          let price = this.stockData['data']['Time Series (1min)'][sixHoursBack] ? this.stockData['data']['Time Series (1min)'][sixHoursBack]['4. close'] : prices[prices.length - 1];
          if (price != undefined && sixHoursBack != undefined)
            prices.push(parseFloat(price))
          categories.push(`${sixHoursBack}`)

          sixHoursBack = moment(sixHoursBack).add(1, 'minutes').format("YYYY-MM-DD HH:mm:00")
        }
        this.graphData.prices = prices
        this.graphData.categories = categories
      }
    }

  }

</script>
