import storage from './localstorage'
import axios from './axios'

export function tokenCheck (){
    return new Promise((resolve, reject)=>{
        let systemLocalInfo = JSON.parse(storage.get('systemInfo'))
        if(systemLocalInfo && systemLocalInfo.id && systemLocalInfo.id != -1){
            resolve('用的缓存的')
        }else{
            if(process.env.NODE_ENV == 'development'){      
                    resolve('没有请求获取token')
            
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
