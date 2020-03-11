import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/css/main.less'
import 'lib-flexible/flexible'
import them from './lib/them'
import storage from './lib/localstorage'

them.changeThem('light')

Vue.config.productionTip = false

axios.defaults.baseURL = '/api'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (storage.get('tokenid')) {
       //请求头加上token
      config.headers.authorization = storage.get('tokenid') 
    }
    return config
  },
  err => {
    return Promise.reject(err)
})

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
