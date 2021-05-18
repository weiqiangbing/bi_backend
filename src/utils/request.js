import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

let productUrl = ''
if (process.env.NODE_ENV != "development") {
  productUrl = origin
} else {
  productUrl = process.env.VUE_APP_BASE_API || ''
  // productUrl = '/api'
}
// console.log(33333);

// create an axios instance
const service = axios.create({
  baseURL: productUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})
// console.log('hash1111', location);

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log('config',config);
    // do something before request is sent
    // if (config.method == 'post') {
    //   config.data = config.params
    // }
    let token = getToken()

    // console.log('token',token);
    
    token = token || ''
    token = token.replace('%20', ' ')
    token = token.replace('#/', '')
    // if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['authorization'] = 'Bearer ' + getToken()
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      config.headers['authorization'] = token
      config.headers['X-ACTION'] = location.hash || ''
    // }
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
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
    // console.log(res.code);
    if (res.code && res.code !== 20000) {
      // console.log(88888);
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return res

      // // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 8 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    
    console.log('err' + JSON.stringify(error.response)) // for debug
    if(error.response && error.response.status && error.response.status==401){
      let baseUrl = encodeURIComponent (window.location.href) 
      location.href = `${error.response.data.login_url}?source_url=${baseUrl}`
    }else{
      let msg = ''
      if(error.response && error.response.data && error.response.data.message){
        msg = error.response.data.message
      }else{
        msg = error.message
      }
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
