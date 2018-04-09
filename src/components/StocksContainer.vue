<template>
  <div class="container">
    <br>
    <h5>Stocks Viewer</h5>
    <spinner v-if="loading"></spinner>
    <p v-if="loading">Retrieving Information, Please Wait...</p>
    <div v-show="!loading">
      <p v-show="this.stocksData">{{this.getMeta}}</p>
      <p v-show="this.error" deep-red>Error Occurred: {{ this.error }}</p>
    </div>
    <div class="center-align stocks">
      <template v-for="(stock, index) in stocksDataElements">
        <div class="row">
          <component ref="stockElement" :is="stock" :key="index"
                     v-bind="{id: index, stockData: stocksData[index]}"></component>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Stock from './Stock.vue'

  export default {

    async mounted() {

        await axios.all(this.links.map(link => axios.get(link)))
          .then(axios.spread((...result) => {
            result.map(res => {
              this.stocksDataElements.push(Stock)
            })
            this.stocksData = result
            this.loading = false
            console.log(this.stocksData)
          }))
          .catch(err => {
            this.error = err
            this.loading = false
          })
    },
    data() {
      return {
        stocksData: null,
        stocksDataElements: [],
        error: null,
        loading: true,
        apiKey: '1FCYOMNM3HBVNJ4H',
        links: [
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=DJI&interval=1min&apikey=${this.apiKey}`,
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=INX&interval=1min&apikey=${this.apiKey}`,
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=NDX&interval=1min&apikey=${this.apiKey}`,
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=AMZN&interval=1min&apikey=${this.apiKey}`,
          `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=GOOGL&interval=1min&apikey=${this.apiKey}`]
      }
    }
    ,
    computed: {
      getMeta() {
        return this.stocksData ? this.stocksData['Meta Data'] : 'loading'
      }
    }

  }
</script>


<style scoped>

</style>
