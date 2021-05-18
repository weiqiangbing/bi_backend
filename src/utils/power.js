export function getPageAuth(key, arr){
  if(arr && arr.length>0){
    return arr.indexOf(key) != -1
  }else{
    return true
  }
}
