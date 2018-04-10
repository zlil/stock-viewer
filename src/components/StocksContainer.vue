<template>
  <div class="container">
    <br>
    <h5>Stocks Viewer</h5>
    <spinner v-if="loading"></spinner>
    <p v-if="loading">Retrieving Information, Please Wait...</p>
    <div v-show="!loading">
      <p v-show="this.stocksData">{{this.getMeta}}</p>
      <p v-show="this.error" class="red-text">Error Occurred: {{ this.error }}</p>
    </div>
    <div class="center-align stocks">
      <template v-for="(stock, index) in stocksDataElements">
        <div class="row">
          <component ref="stockElement" :is="stock" :key="index"
                     v-bind="{id: index, stockData: stocksData[index], heading: stocksData[index]['data']['Meta Data']['2. Symbol']}"></component>
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
      try {
        await axios.all(this.links.map(link => axios.get(link)))
          .then(axios.spread((...result) => {
            result.map(res => {
              if(res == null || res.data["Error Message"] != undefined)
                throw '400'
              else {
                this.stocksDataElements.push(Stock)
                this.stocksData.push(res)
              }
            })

            this.loading = false
          }))
          .catch(err => {
            debugger
            this.error = err
            this.loading = false
          })
      }catch(e){
        debugger
        console.log('error', e);
      }
    },
    data() {
      return {
        stocksData: [],
        stocksDataElements: [],
        error: null,
        loading: true,
        apiKey: '1FCYOMNM3HBVNJ4H',
        links: [
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=DJI&interval=1min&apikey=1FCYOMNM3HBVNJ4H",
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=INX&interval=1min&apikey=1FCYOMNM3HBVNJ4H",
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=NDX&interval=1min&apikey=1FCYOMNM3HBVNJ4H",
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=AMZN&interval=1min&apikey=1FCYOMNM3HBVNJ4H",
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&outputsize=full&symbol=GOOGL&interval=1min&apikey=1FCYOMNM3HBVNJ4H"]
      }
    },
    computed: {
      getMeta() {
        return this.stocksData ? this.stocksData['Meta Data'] : 'loading'
      }
    }

  }
</script>


<style scoped>

</style>
