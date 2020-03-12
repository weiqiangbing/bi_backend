import storage from './localstorage'
import axios from './axios'

export function tokenCheck (){
    return new Promise((resolve, reject)=>{
        let token = storage.get('tokenid')
        console.log(token);
        if(token){
            resolve('没有请求获取token')
        }else{
            let data = {
                mobile: '18333063001',
                password: '123456'
            }
            axios.post('/user.login', data).then((res)=>{
                
                storage.set('tokenid', res.data.token)
                storage.set('user', res.data.user)

                resolve('重新请求了token')
            })
        }
    })
}
