import { getSite, getOutSite, getSection, getClass } from '@/utils/auth'

// console.log('getSite',getSite());
// console.log('getOutSite',getOutSite());
// console.log('getSection',getSection());
// console.log('getClass',getClass());

// 站点
export var filterSite = function(value){
    let ind = 0
    let data = getSite()
      data.forEach((re, index)=>{
        if(re.site_id == value){
          ind = index
        }
      })
      return data[ind].site_name
}
// 渠道
export var filterOutSite = function(value){
    let ind = 0
    let data = getOutSite()    
      data.forEach((re, index)=>{
        if(re.outsite == value){
          ind = index
        }
      })
    return data[ind].outsite_name
}

// 频道
export var filterSection = function(value){
    let ind = 0
    let data = getSection()    
      data.forEach((re, index)=>{
        if(re.section_id == value){
          ind = index
        }
      })
    return data[ind].section_name
}

// 分类
export var filterOutClass = function(value){
    let ind = 0
    let data = getClass()    
      data.forEach((re, index)=>{
        if(re.class_id == value){
          ind = index
        }
      })
    return data[ind].class_name
}

// 分组
export var filterGroup= function(arr, key){
  let ind = 0
    arr.forEach((re, index)=>{
      if(re.key == key){
        ind = index
      }
    })
  return arr[ind]
}

// 平台
export var filterPlatform = function(value){
    if(value==0){
        return '全平台'
    }else if(value==1000){
        return 'PC'
    }else if(value==2000){
        return 'M站'
    }else if(value==3000){
        return '安卓'
    }else if(value==4000){
        return '苹果'
    }else{
        return ''
    }
}