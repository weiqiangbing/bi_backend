// import { getBookMsgList } from '@/api/read/user'
import { getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import { parseTime } from '@/utils'

export function getCheckedZh(defaultCheckedList, checkedList) {
  const obj = {
    checkedZh: [],
    checkedEn: []
  }
  for (const i in defaultCheckedList) { 
    if (checkedList.indexOf(defaultCheckedList[i].prop) !== -1) {
      obj.checkedZh.push(defaultCheckedList[i].label)
      obj.checkedEn.push(defaultCheckedList[i].prop)
    }
  }
  return obj
}

export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timeline') {
      return parseTime(v[j])
    } else {
      return v[j]
    }
  }))
}


// 表格的导出
// handleDownload() {
//   // this.getCheckedTit()
//   // this.downloadLoading = true
//   import('@/vendor/Export2Excel').then(excel => {
//     const tHeader = this.checkedTit
//     const filterVal = this.checkedList
//     const data = this.formatJson(filterVal, this.tableData)
//     excel.export_json_to_excel({
//       header: tHeader,
//       data,
//       filename: 'table-data'
//     })
//     this.downloadLoading = false
//   })
// }

// 对数据进行判断，导出选中的数据
// formatJson(filterVal, jsonData) {
//   // console.log(filterVal)
//   // console.log(jsonData)
//   return jsonData.map(v => filterVal.map(j => {
//     if (j === 'timeline') {
//       return parseTime(v[j])
//     } else {
//       return v[j]
//     }
//   }))
// }

// 我的报表数据的本地存储
// removeHistorySearchList()
// localStorage.removeItem('historySearchList')
const historySearchList = getHistorySearchList()
// const arr = [].concat(historySearchList)
// console.log('aaa', historySearchList)
const arr = historySearchList
let id = 0
export function setSearchList(type, route, name, listQuery, data, checkedList) {
  const obj = {
    listQuery: {},
    data: [],
    checkedList: []
  }
  obj.id = id++
  // eslint-disable-next-line eqeqeq
  obj.name = name != '' ? name : ''
  obj.type = type
  obj.from = route.name
  obj.to = route.path
  obj.listQuery = { ...listQuery }
  obj.data = [...data]
  obj.checkedList = [...checkedList]
  arr.push(obj)
  setHistorySearchList(arr)
  // localStorage.setItem('historySearchList', JSON.stringify(arr))
  // console.log('arrcommon', getHistorySearchList())
}

// 获取书籍id集合
// export function getBookIds(arr) {
//   const newArr = []
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].book_id) {
//       newArr.push(arr[i].book_id)
//     }
//   }
//   return newArr
// }

export function addTremParams(querys) {
  let newObj = {}
  if(querys){
    let allkeys = Object.keys(querys)
    // console.log('allkeys',allkeys);
    let newKey = allkeys.filter((re)=>{
      return re.indexOf('having_') != -1
    })
    
    if(newKey && Array.isArray(newKey) && newKey.length>0)
    newKey.forEach((re)=>{
      newObj[re] = querys[re]
    })
  }
  return newObj
}

export function arrDelectHave(arrs){
  var arr = arrs.shift(); 
  for(var i=arrs.length;i--;){
     var p = {"boolean":{}, "number":{}, "string":{}}, obj = [];
     arr = arr.concat(arrs[i]).filter(function (x) {
       var t = typeof x;
       return !((t in p) ? !p[t][x] && (p[t][x] = 1) : obj.indexOf(x) < 0 && obj.push(x));
     });
     if(!arr.length) return null; 
  }
  return arr;
}

export function getDatetr(sj, sep){
  var now = new Date(sj);
  var year=now.getFullYear();    
  var month=now.getMonth()+1;    
  var date=now.getDate();    
  if(month<10){
      month = '0'+month
  }if(date<10){
      date = '0'+date
  }
  return year + sep + month + sep + date 
}

// export function arrDelectHave(arr1, arr2){
//   return arr2.every(val => arr1.includes(val))
// }

export function filterObjToArr(obj){
  let arr = []
  for(let i in obj){
    arr.push(obj[i])
  }
  return arr
}

export function numToFixedTow(val){
  if(val){
    if(val.toString().indexOf('.') != -1){
      return val.toFixed(2)
    }else{
      return val
    }
  }else{
    return 0
  }
}