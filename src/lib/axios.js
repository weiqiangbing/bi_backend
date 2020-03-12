import axios from 'axios'
import storage from './localstorage'
import config from './config'

const Axios = axios.create({
    baseURL: config.requestFirst,
    timeout: config.requestTimeOut, 
    crossDomain: true,
})

Axios.interceptors.request.use(
    config => {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        if (storage.get('tokenid')) {
            //请求头加上token
            config.headers = {
            'authorization': storage.get('tokenid'),
            'X-Device-Time': new Date().getTime(),
            'Device-Uuid': '6f03a8dff7d9f54a7d05f0a420fe8bbfe8f19448',
            'User-Agent': 'ylsyapp/ios iPhone Mobile',
            'X-App-Channel': 'apple',
            'X-APP-FC':	1,
            }
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

export default Axios