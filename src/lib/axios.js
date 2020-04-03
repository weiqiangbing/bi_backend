import Vue from 'vue'
import axios from 'axios'
import storage from './utils/localstorage'
import config from './config'
import { Toast } from 'vant';
import router from '../router'
// import loading from '../assets/js/loading'
// import qs from 'qs'
const origin = location.origin
const Axios = axios.create({
    // baseURL: config.requestFirst,
    baseURL: origin+'/api',
    responseType:'json',
    timeout: config.requestTimeOut, 
    crossDomain: true,
    withCredentials: false,
    headers:{
      "Content-Type": "application/json",
      "authorization":'',
    }
})

Axios.interceptors.request.use(
    config => {
      // if(config.method == 'post') {
      //     config.data = qs.stringify(config.data);
      // }
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        if(process.env.NODE_ENV == 'development'){
            let devLoginInfo = storage.get('devLoginInfo')
            if(devLoginInfo && devLoginInfo.token){
              //添加请求头
              config.headers = Object.assign(config.headers,{
                "authorization": 'Bearer '+devLoginInfo.token,
                "Device-Uuid": "6f03a8dff7d9f54a7d05f0a420fe8bbfe8f19448",
                // "User-Agent": "Android",
                "X-App-Version": "1.6.0"
                // 'User-Agent': 'ylsyapp/ios iPhone Mobile',
              })
            }else{
              router.push('/login')
            }
          // }
        }else{
          console.log('------------------axios.js文件-----------------------');
          // console.log('(window.InteractorProxy.getUserInfo()',window.InteractorProxy.getUserInfo());
          console.log('(window.InteractorProxy.app',window.InteractorProxy.app);
          let proUserInfo = window.InteractorProxy.getUserInfo()
          let appInfo = window.InteractorProxy.app
          console.log('获取app的userInfo', proUserInfo);
          if(proUserInfo && proUserInfo.id){
            //添加请求头
            let scheme = appInfo.scheme
            if(scheme && scheme.indexOf(':') != -1){
              scheme = scheme.split(":")[0]
            }

            let platform = appInfo.platform
            if(platform && platform.toLowerCase() !='android'){
              platform = 'ios iPhone Mobile'
            }
            config.headers = Object.assign(config.headers,{
              "authorization": 'Bearer '+proUserInfo.token,
              "Device-Uuid": proUserInfo.uuid,
              "x-app-version": appInfo.version,
              "User-Agent": scheme+'/'+platform
            })
            // console.log("config.headers", JSON.stringify(config.headers));
            
          }else{
            window.InteractorProxy.login()
          }
          
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

Axios.interceptors.response.use(
    response => {
      // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },

    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    error => {
      console.log('error', error);
    
      // 判断请求超时
      if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
        Toast('请求超时')
      }
      if (!error.response) {
        Toast('接口异常')
        
      }else if (error.response.status) {
        if(error.response.data.code == 5002 || error.response.data.code == 5005){
          // Toast('登陆超时')
          if(process.env.NODE_ENV=='development'){
            router.push('/login')
          }else{
            window.InteractorProxy.login()
          }
        }else{
          Toast(error.response.data.desc)
        }
      }
      new Vue().$loading.hide()
      return Promise.reject(error)
    }
  );

export default Axios
