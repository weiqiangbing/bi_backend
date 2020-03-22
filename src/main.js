import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loading from './assets/js/loading'
import storage from './lib/localstorage'

Vue.use(loading)

import './assets/js/flexible'
// import 'https://native/interactor_proxy.js'
// import './lib/jsbridge'
console.log(storage.get('devLoginInfo'));
document.addEventListener("onInteractorReady", function(event){
  // alert('enent',event)
  // alert('main.js里的监听')


  console.log('-----------执行了main.js里的监听---------------');

  
  console.log('ListenerInteractorProxy',window.InteractorProxy);

  // storage.set('systemInfo', window.InteractorProxy.app)
  // alert(JSON.stringify(window.InteractorProxy.app))
  // console.log('ListenerInteractorProxy.app.scheme',window.InteractorProxy.app.scheme);
  // console.log('event',event);

  // const them = require('./lib/them') 
  // let appInfoObj = them.default.changeThem(event.app.scheme)
  // import ('./assets/css/thems/'+appInfoObj.themName+'.less')
  // const axios = require('./lib/axios')
  // const _axios = axios.default.getAxios(appInfoObj.domainName)
  // Vue.prototype.$axios = _axios
  

})

// console.log('InteractorProxy',window.InteractorProxy);
// console.log('InteractorProxy.app',window.InteractorProxy.app);

// let themWord = them.changeThem(window.InteractorProxy.app.scheme)
import './assets/css/main.less'

Vue.config.productionTip = false

import axios from './lib/axios'
import them from './lib/them'
let themWord = them.changeThem('legendnovelapp')
import ('./assets/css/thems/'+themWord.themName+'.less')
// const _axios = axios.getAxios(themWord.domainName)
Vue.prototype.$axios = axios

import  VConsole  from  'vconsole';
let vConsole = new VConsole();
// console.log("test");
// console.log('33333333333333333');


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
