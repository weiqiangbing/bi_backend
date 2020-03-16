import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './lib/axios'

import './assets/js/flexible'

import './lib/jsbridge'

InteractorProxy.registerHandler()
console.log(InteractorProxy.app);

import them from './lib/them'
let themWord = them.changeThem(InteractorProxy.app.scheme)

import './assets/css/main.less'
import ('./assets/css/thems/'+themWord+'.less')

Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
