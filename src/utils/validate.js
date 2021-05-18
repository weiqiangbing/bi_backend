/**
 * Created by PanJiaChen on 16/11/18.
 */
import Vue from 'vue'
import { getToken,setToken,setUserAuth, getUserAuth} from '@/utils/auth'
import { getPermission } from '@/api/auth'
import store from '@/store'
// import router from '@/router'

// Vue.use(router)
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function funcUrlDel(name) {
  store.commit('part/changeFullLoad',true)
      var loca = window.location;
      var baseUrl = loca.origin + loca.pathname;
      var query = loca.hash;
      var href = loca.href;
      if(query.indexOf('?') != -1){
        query = query.split('?')[0]
      }
      let paramStr = href.split('?')[1]
      if (paramStr.indexOf(name) > -1) {
        var obj = {}
        var arr = paramStr.split("&");   
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].split("=");
          obj[arr[i][0]] = arr[i][1];
        };
        
        let token = obj['authorization']        
        setToken(token)
        delete obj[name];
        let url =  baseUrl + query        
        if(JSON.stringify(obj) != '{}'){
          url =url+JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        }
        // alert(url)
        getPermiss(url)
        // setTimeout(() => {
          location.href = url
        // }, 1000);
      }
    }
  export function getPermiss(url) {
    let data = {
      domain_id: 'D-5fa10d1e0ab4a',
      path_type: 'WEB'
    }
    getPermission(data).then((res)=>{
      console.log(res);
      let resData = ''
      if(res.success == 1){
        if(res.result.is_super_admin == 1 || res.result.is_domain_admin == 1){
          // 管理员，都可以看
          resData = 1
        }else if(!res.result.path_list || res.result.path_list.length <= 0){
          resData = res.result
          // alert('没有权限')
          // return
        }else{
          // 保存权限
          resData = res.result
        }
        setUserAuth(JSON.stringify(resData))
        // redictUrl()
        if(url){
          location.href = url
          // location.reload()
        }
      }
    }).catch((err)=>{
      setUserAuth(JSON.stringify(err.response.data.result))
      store.commit('part/changeFullLoad',false)
      // console.log(err.response.data.result);
      if(url){
        location.href = url
        // location.reload()
      }
    })
  }

  export function redictUrl(){
    let authStr = getUserAuth()
    let autObj = {}
    let authArr = []
    if(authStr){
      autObj = JSON.parse(authStr)
    }
    if(autObj && autObj.path_list){
      authArr = autObj.path_list
    }
    let pathurl = location.hash.slice(1)
    // console.log('pathurl',autObj);
    let isHave = authArr.some((re)=>{
      return re.url_path == pathurl
    })
    // console.log(9999,isHave)
    if(!isHave && autObj != 1){
      // alert(1)
      location.href = location.origin+'#/index'
    }
    // console.log(';authArr',authArr);
  }