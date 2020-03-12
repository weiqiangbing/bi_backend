import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './lib/axios'

import './assets/css/main.less'
import 'lib-flexible/flexible'

// import them from './lib/them
// them.changeThem('blank')

import './lib/jsbridge'

Vue.config.productionTip = false


Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
