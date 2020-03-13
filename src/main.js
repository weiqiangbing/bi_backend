import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './lib/axios'

import './assets/css/main.less'
import 'lib-flexible/flexible'

import './lib/jsbridge'

// console.log(InteractorProxy.registerHandler());
// document.addEventListener('click', function(dd){
//   console.log(dd);
// })
// import them from './lib/them'
// let themWord = them.changeThem('blank')
// import config from './lib/config'
// config.themPathName = themWord

Vue.config.productionTip = false

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
