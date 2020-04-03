export default{
    // 转化为时分秒格式：2019-05-23 12：42：20
    getTimeStr(sj){
        var now = new Date(sj);
        var   year=now.getFullYear();    
        var   month=now.getMonth()+1;    
        var   date=now.getDate();    
        var   hour=now.getHours();    
        var   minute=now.getMinutes();    
        var   second=now.getSeconds();    
        if(month<10){
            month = '0'+month
        }if(date<10){
            date = '0'+date
        }if(hour<10){
            hour = '0'+hour
        }if(minute<10){
            minute = '0'+minute
        }if(second<10){
            second = '0'+second
        }
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
    },
    // 转化为日期格式：2019.02.12
    getDatetr(sj){
        var now = new Date(sj);
        var   year=now.getFullYear();    
        var   month=now.getMonth()+1;    
        var   date=now.getDate();    
        if(month<10){
            month = '0'+month
        }if(date<10){
            date = '0'+date
        }
        return year+"."+month+"."+date 
    },
    // 求剩余多少天
    getDayAndTime(val){
      let num = (new Date(val).getTime() - new Date().getTime())/1000
      var theTime = parseInt(num);// 需要转换的时间秒 
      var theTime1 = 0;// 分 
      var theTime2 = 0;// 小时 
      var theTime3 = 0;// 天
      if(theTime > 60) { 
        theTime1 = parseInt(theTime/60); 
        theTime = parseInt(theTime%60); 
        if(theTime1 > 60) { 
        theTime2 = parseInt(theTime1/60); 
        theTime1 = parseInt(theTime1%60); 
        if(theTime2 > 24){
          //大于24小时
          theTime3 = parseInt(theTime2/24);
          theTime2 = parseInt(theTime2%24);
        }
        } 
      } 
      var result = {};
      if(theTime >= 0){
        result.second = parseInt(theTime)
      }
      if(theTime1 >= 0) { 
        result.minute = parseInt(theTime1)
      } 
      if(theTime2 >= 0) { 
        result.hour = parseInt(theTime2)
      } 
      if(theTime3 >= 0) { 
        result.day = parseInt(theTime3)
      }      
      return result; 
    },
    // 便利替换字符串中的字符
    mapReplace(str, newVal, oldVal){
      if(str){
        if(str.indexOf(newVal) != -1){
          str = str.replace(newVal, oldVal)
          return this.mapReplace(str, newVal, oldVal)
        }
        else{
          return str
        }
      }else{
        return ''
      }
    }

}