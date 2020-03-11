import storage from './localstorage'
import axios from 'axios'

// export default {
//     // tokenCheck(callback){
//     //     let token = storage.get('token')
//     //     if(token){
//     //         callback()
//     //     }else{
//     //         confirm('没有登陆,确定登陆')
//     //         storage.set('token','tokeniiiiiiii')
//     //     }
//     // },

//     tokenCheck(){
//         return new Promise((resolve, reject)=>{
//             let token = storage.get('token')
//             if(token){
//                 resolve('登陆成功')
//             }else{
//                 reject('没有登陆')
//                 // confirm('没有登陆,确定登陆')
//                 storage.set('token','tokeniiiiiiii')
//             }
//         })
//     }
//     // tokenCheck
// }
export function tokenCheck (){
    return new Promise((resolve, reject)=>{
        let token = storage.get('tokenid')
        if(token){
            resolve('没有请求')
        }else{
            let data = {
                mobile: '18333063001',
                password: '123456'
            }
            axios.post('/user.login', data).then((res)=>{
                
                storage.set('tokenid', res.data.token)
                storage.set('user', res.data.user)

                resolve('请求了')
                // storage.set('tokenid','tokeniiiiiiii')
            })

        }
    })
}
