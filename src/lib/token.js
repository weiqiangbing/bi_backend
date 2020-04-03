// import storage from './utils/localstorage'
import store from '../store/index'
import Vue from 'vue'
import utily from './utils/utily'

import versionTest from '../components/versionTest'

export function tokenCheck (){
    return new Promise((resolve, reject)=>{
        if(process.env.NODE_ENV == 'development'){
            resolve('开发环境')
        }else{
            utily.waitLoad(()=>{
                // store.commit('changeThem', window.InteractorProxy.app.scheme)
                console.log('InteractorProxy',window.InteractorProxy);
                   
                if(parseInt(window.InteractorProxy.version) >= 7){
                    resolve(window.InteractorProxy)
                }else{
                    store.commit('showVersion',true)
                }                            
            })
        }
    })
}
let TuiModalConstructor = Vue.extend(versionTest)

let instance = new TuiModalConstructor ({
    el: '#version',
    data(){
        return{
            
        }
    },
  })
// 将组件添加到dom
document.body.appendChild(instance.$el)

