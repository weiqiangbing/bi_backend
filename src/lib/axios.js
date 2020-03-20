import Vue from 'vue'
import axios from 'axios'
import storage from './localstorage'
import them from './them'
import config from './config'
import { Toast } from 'vant';
import qs from 'qs'

// InteractorProxy.registerHandler()
// const themWord = them.changeThem(InteractorProxy.app.scheme)
// const themWord = them.changeThem('legendnovelapp')
var themWord = {}

const Axios = axios.create({
    // baseURL: config.requestFirst,
    baseURL: '/api',
    // baseURL: process.env.NODE_ENV == 'development'?'/api':themWord.domainName,
    timeout: config.requestTimeOut, 
    crossDomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
})

Axios.interceptors.request.use(
    config => {
      if(config.method == 'post') {
          config.data = qs.stringify(config.data);
      }
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        // if(process.env.NODE_ENV == 'development'){
          // if (storage.get('tokenid')) {
            let systemInfo = storage.get('systemInfo')
            console.log('44444', JSON.parse(systemInfo));
            
            //添加请求头
            config.headers = Object.assign({}, JSON.parse(systemInfo))
          // }
        // }
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
        new Vue().$loading.hide()
        
      }else if (error.response.status) {
        if(error.response.data.code == 5002){
          Toast('登陆超时')
          window.InteractorProxy.login()
        }else{
          Toast(error.response.data.desc)
        }
        
        // switch (error.response.status) {
        //   // 401: 未登录
        //   // 未登录则跳转登录页面，并携带当前页面的路径
        //   // 在登录成功后返回当前页面，这一步需要在登录页操作。
        //   case 401:
        //     vant.Toast.fail("身份验证失败，请关闭重新进入。");
        //     break;
  
        //   // 403 token过期
        //   // 登录过期对用户进行提示
        //   // 清除本地token和清空vuex中token对象
        //   // 跳转登录页面
        //   case 403:
        //     vant.Toast.fail("登录过期，请关闭重新进入。");
        //     // 清除token
        //     break;
  
        //   // 404请求不存在
        //   case 404:
        //     vant.Toast.fail("您访问的网页不存在。");
        //     break;
        //   // 其他错误，直接抛出错误提示
        //   default:
        //     vant.Toast.fail(error.response.data.message);
        // }
        // return Promise.reject(error.response);
      }
      return Promise.reject(error)
    }
  );

export default Axios
// export default {
//   getAxios(appName){
//     themWord = them.changeThem(appName)
//     return Axios
//   }
// }