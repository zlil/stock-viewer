import Vue from 'vue'
import Router from 'vue-router'
import StocksContainer from '@/components/StocksContainer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Stocks Viewer',
      component: StocksContainer
    }
  ]
})
