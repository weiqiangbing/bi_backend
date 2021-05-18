import {
  filterSite,
  filterPlatform,
  filterOutSite,
  filterSection,
  filterOutClass,
} from "@/utils/filterWord";

export function getSpecialName(key, value) {
  if(key == "site_id") {
    return filterSite(value);
  } else if (key == "platform") {
    return filterPlatform(value);
  } else if (key == "section_id") {
    return filterSection(value);
  } else if (key == "outsite") {
    return filterOutSite(value);
  } else if (key == "class_id") {
    return filterOutClass(value);
  } else {
    if (value) {
      return value
    } else {
      if(value==0){
        return 0
      }else{
        return "~"
      }
    }
  }
}

export function getDateName(val, num){
  // console.log(8888,val, num);
  let str = ''
  if(val){
    let valArr = val.split(',')
    if(valArr[num]){
      str = getDateChinaName(valArr[num])
      if(valArr[num].indexOf('-') != -1){
        str += '前'
      }else{
        str += '后'
      }
    }
  }
  return str
}

export function getDateChinaName(val){
  if(val){
    let name = val.slice(1)
    if(name=='day'){
      return '天'
    }else if(name=='week'){
      return '周'
    }else if(name=='month'){
      return '月'
    }else if(name=='year'){
      return '年'
    }else{
      return ''
    }
  }else{
    return ''
  }
  

}
