import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loading from './assets/js/loading'
import formatJson from './lib/utils/formatJson'
import utily from './lib/utils/utily'
import {chooseZh} from './assets/js/chiness'

Vue.use(loading)
import  VConsole  from  'vconsole';
let vConsole = new VConsole();

import './assets/js/flexible'
// import 'https://native/interactor_proxy.js'
document.addEventListener("onInteractorReady", function(event){  
  console.log('-----------执行了main.js里的监听---------------');

})

import './assets/css/main.less'

Vue.config.productionTip = false

import axios from './lib/axios'

Vue.prototype.$axios = axios
Vue.prototype.$store = store
Vue.prototype.$land = chooseZh

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if(process.env.NODE_ENV == 'development'){
  import("./assets/css/thems/legend.less")
}else{
  utily.waitLoad(()=>{
    // console.log('main.js里得app',window.InteractorProxy.app);
    let scheme = window.InteractorProxy.app.scheme
    if(scheme && scheme.indexOf(':') != -1){
      scheme = scheme.split(':')[0]
    }
    let appObj = formatJson.formatAppInfo('appName', scheme)
    console.log("./assets/css/thems/"+appObj.themName+".less");
    
    import("./assets/css/thems/"+appObj.themName+".less")
    // if(parseInt(window.InteractorProxy.version) < 7){
    //     store.commit('showVersion',true)
    // }
  })
}


