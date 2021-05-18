import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// let productUrl = process.env.VUE_APP_AUTH_API
// if (process.env.NODE_ENV != "development") {
//   productUrl = 'http://ucenter-service.backend.weiyanqing.com/'
// } else {
//   productUrl = 'http://ucenter-service.backend.test.com/'
// }

const service = axios.create({
  baseURL: process.env.VUE_APP_AUTH_API, // url = base url + request url
  timeout: 50000 // request timeout
})

service.interceptors.request.use(
  config => {
    let token = getToken()
    
    token = token || ''
    token = token.replace('%20', ' ')
    token = token.replace('#/', '')
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['authorization'] = token
    config.headers['X-ACTION'] = location.hash || ''
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    // console.log('response',response);
    const res = response.data
    const reconfig = response.headers
    // console.log('reconfig',reconfig);
    // console.log('reconfig.authorization',reconfig.authorization);
    
    if(reconfig && reconfig.authorization){
      // alert(reconfig.authorization)
      setToken(reconfig.authorization)
    }
    // console.log('response',response);
    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   return res
    // } else {
      return res
    // }
  },
  error => {
    console.log('err' + JSON.stringify(error.response.data)) // for debug
    if(error.response && error.response.data && error.response.data.code >= 40600 && error.response.data.code <= 40700){
      let baseUrl = encodeURIComponent (window.location.href) 
      if(error.response.data.result.login_url){
        location.href = `${error.response.data.result.login_url}?source_url=${baseUrl}`
      }
    }else{
      Message({
        message: error.response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
