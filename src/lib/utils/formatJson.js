import appInfo from '../../assets/json/appInfo.json'
export default{
    // 查找app信息，返回对象
    formatAppInfo(key, val){
        // console.log("appInfo",appInfo);
        // appInfo.forEach((re)=>{
        //     if(re[key] == val){  
        //         console.log("re", re);
        //         return re
        //     }
        // })
        // return {}
        for (let i = 0; i < appInfo.length; i++) {
            if(appInfo[i][key] == val){
                return appInfo[i]
                // break;
            }
        }
        return ''
    }
}