import storage from './localstorage'
import axios from './axios'

export function tokenCheck (){
    return new Promise((resolve, reject)=>{
        let systemLocalInfo = JSON.parse(storage.get('systemInfo'))
        if(systemLocalInfo && systemLocalInfo.id && systemLocalInfo.id != -1){
            resolve('用的缓存的')
        }else{
            if(process.env.NODE_ENV == 'development'){

                // let token = storage.get('tokenid')
                // if(token){
                //     resolve('没有请求获取token')
                // }else{
                    let data = {
                        mobile: '18333063001',
                        password: '123456'
                    }
                    axios.post('/v1/user.login', data).then((res)=>{
                        let devSystemInfo = {
                            'authorization': res.data.token || '',
                            'X-Device-Time': new Date().getTime(),
                            'Device-Uuid': '6f03a8dff7d9f54a7d05f0a420fe8bbfe8f19448',
                            // 'User-Agent': 'ylsyapp/ios iPhone Mobile',
                            // 'X-App-Channel': 'apple',
                            // 'X-APP-FC':	1,
                            'id': '333'
                        }
                        
                        storage.set('systemInfo', JSON.stringify(devSystemInfo))
                        resolve('重新请求了token')
                    })
                // }
            }else{
                let userInfo = window.InteractorProxy.getUserInfo()
                // console.log('systemInfo',userInfo);
                if(!userInfo.id || userInfo.id==-1){
                    window.InteractorProxy.login()
                }else{
                    let proSystemInfo = {
                        'authorization': userInfo.token || '',
                        'X-Device-Time': new Date().getTime(),
                        'Device-Uuid': userInfo.uuid,
                        // 'User-Agent': 'ylsyapp/ios iPhone Mobile',
                        // 'X-App-Channel': 'apple',
                        // 'X-APP-FC':	1,
                        'id': userInfo.id
                    }
                    storage.set('systemInfo', JSON.stringify(proSystemInfo))
                }
                resolve('生产环境')
            }
        }
    })
}
