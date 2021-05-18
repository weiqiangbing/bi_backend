<template>
  <div class="app-container merge_table">	 
    <!-- <div class="filter_box">
      <div class="check_ths link-type" @click="handleShowRow"><i class="icon el-icon-setting"></i><span>隐藏列</span></div>    
    </div>
    <div class="init_dialog">
      <el-dialog
        title="请选择你想要显示的列进行勾选"
        :modal="false"
        top="5vh"
        :visible.sync="isShowRow"
        width="30%">
        <el-checkbox-group 
          v-model="checkedList"
          @change="checkListChange">
          <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div> -->
    <div class="filter_word">
      <div class="filt_list" v-for="(item, index) in filterData" :key="index">
        <span>{{item.label}}</span> : <span>{{filterName(item)}}</span>
      </div>
      <div class="filt_list" v-if="searchObj">
        <span>时间范围：</span>
        <span v-if="searchObj.time_unit">{{relativeTime1}} ~ {{relativeTime2}}  ({{searchObj.time_type=='day'?'天':'月'}})</span>
        <span v-else>{{searchObj.start_time}} ~ {{searchObj.end_time}}({{searchObj.time_type=='day'?'天':'月'}})</span>
      </div>
    </div>
    <!-- <div class="filt_list" v-if="searchObj">
      <span>时间范围：</span>
      <span v-if="searchObj.time_unit">{{relativeTime1}} ~ {{relativeTime2}}  ({{searchObj.time_type=='day'?'天':'月'}})</span>
      <span v-else>{{searchObj.start_time}} ~ {{searchObj.end_time}} ({{searchObj.time_type=='day'?'天':'月'}})</span>
    </div> -->

    <!-- 主题内容 -->
    <div class="main-table origin_table" v-loading="loading">    
      <el-table
        v-if="!loading"
        class="border-top-20"
        :data="tableData"
        @sort-change="sortChange"       
        style="width: 100%">
        <template v-for="(item) in tableThArr">
          <el-table-column
            v-bind:key="item.prop"
            v-if="checkedList.indexOf(item.prop) != -1 || item.prop == 'searches_book' || item.prop == 'searches_user'"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="false"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            align="center"
          >
          <template slot-scope="scope">
            <div class="ratio_table" :class="{coment_cell: !item.isNum}">
              <span class="cell_value">{{formatTdValue(item.prop,scope.row[item.prop])}}</span>
              <span class="bet_value" v-show="scope.row[item.prop+'_between'] && !item.isTerm">
                <i class="sucess_icon el-icon-back" v-if="scope.row[item.prop+'_between']>0"></i>
                <i class="delete_icon el-icon-back" v-else></i>
                <span :class="{sucess_word:scope.row[item.prop+'_between']>0}">{{scope.row[item.prop+'_between'] | filterNums}}</span>
              </span>
            </div>
          </template>  
          </el-table-column>
        </template>
      </el-table>

    </div>
  </div>	
</template>

<script>
import {mergeTableData} from '@/api/public'
import { tableColumns } from '@/utils/tableColumns'
import { filterObjToArr } from '@/utils/common'
import {filterPlatform,filterOutSite,filterSection,filterOutClass,filterSite} from '@/utils/filterWord'
import {getSpecialName} from '@/utils/assist'
import {getDateName} from '@/utils/assist'

export default {
  name: 'RatioTable',
  components: {
    
  },
	data() {
		return {      
      loading: false,	
      isShowRow: false,
      tableData:[],
      filterObj:{},
      show_field:[],
      checkedList:[],
      // defaultCheckedList:[],
      siteList1:[],
      tableThArr: [],
      groupArr:[],
      myGroupData:{},
      searchObj:'',
      relativeTime1:'',
      relativeTime2:'',
      filterData:[]
		}
  },
  filters:{
    filterNums(val){
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
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      vm.loading = true
      let filters = sessionStorage.getItem('mergeTableFilter')
      // console.log('filters33333',filters);
      vm.filterObj = JSON.parse(filters) || {}
      let filterObj = vm.filterObj
      let groupArr = filterObj.obj1.group
      vm.getFilerArr()
      vm.checkedList = filterObj.checkedList
      vm.groupArr = groupArr
      console.log('vm.checkedList',vm.checkedList);
      // console.log('filterObj',filterObj);
      vm.siteList1 = filterObj.siteList1
      let api1 = filterObj.api1
      let api2 = filterObj.api1
      if(groupArr.length>0){
        filterObj.obj1.count = 200
        filterObj.obj2.count = 200
      }else{
        filterObj.obj1.count = 2
        filterObj.obj2.count = 2
      }
      vm.myGroupData = filterObj.myGroupData
      mergeTableData(api1, vm.filterNullVal(filterObj.obj1)).then((res1)=>{
        let arrData1 = res1.data.collection
          if(arrData1.length>0){
            arrData1.map((re)=>{
              re.table_order_num = 1
            })
          }

        vm.show_field = filterObjToArr(res1.data.show_fields)
        mergeTableData(api2, vm.filterNullVal(filterObj.obj2)).then((res2)=>{
          let arrData2 = res2.data.collection
          if(arrData2.length>0){
            arrData2.map((re)=>{
              re.table_order_num = 2
            })
          }
          vm.show_field=vm.show_field.concat(filterObjToArr(res2.data.show_fields))
          console.log('res2',arrData2); 
          let deleteArr = []
          let newColumns = tableColumns.filter((re)=>{
            return groupArr.indexOf(re.prop) == -1
          })
          groupArr.forEach((r)=>{
            tableColumns.forEach((re)=>{
              if(re.prop==r){
                deleteArr.push(re)
              }
            })
          })
          
          newColumns = deleteArr.concat(newColumns)
          vm.tableThArr = newColumns.filter(er=>{
            return vm.show_field.indexOf(er.prop) != -1
          })
          
          // 表格中添加自定义的时间
          if(filterObj.obj1.start_time != filterObj.obj2.start_time || filterObj.obj1.end_time != filterObj.obj2.end_time){
            vm.tableThArr.splice(vm.getIsNumIndex(),0,{prop:'timeline',label:'时间',isNum:true, isTerm: true})
            vm.searchObj = ''
          }else{
            vm.searchObj = filterObj.obj1
            if(vm.searchObj.time_unit){
              vm.relativeTime1 = vm.searchObj.start_time +' '+ getDateName(vm.searchObj.time_unit,0)
              vm.relativeTime2 = vm.searchObj.end_time +' '+ getDateName(vm.searchObj.time_unit,1)
            }
          }
          // 表格中自定义书籍id
          if(filterObj.obj1.book_id != filterObj.obj2.book_id){
            vm.tableThArr = vm.tableThArr.filter(e=>{
              return e.prop != 'book_id'
            })
            vm.tableThArr.splice(vm.getIsNumIndex(),0,{prop:'book_id',label:'书籍ID',isNum:true, isTerm: true})
          }
          // 表格中自定义用户id
          if(filterObj.obj1.user_id != filterObj.obj2.user_id){
            vm.tableThArr = vm.tableThArr.filter(e=>{
              return e.prop != 'user_id'
            })
            vm.tableThArr.splice(vm.getIsNumIndex(),0,{prop:'user_id',label:'用户ID',isNum:true, isTerm: true})
          }

          // 表格中自定义用户群组
          if(filterObj.obj1.searches_user || filterObj.obj2.searches_user){
            vm.tableThArr.splice(vm.getIsNumIndex(),0,{prop:'searches_user',label:'用户群组',isNum:true, isTerm: true})
          }

          // 表格中自定义书籍群组
          if(filterObj.obj1.searches_book || filterObj.obj2.searches_book){
            vm.tableThArr.splice(vm.getIsNumIndex(),0,{prop:'searches_book',label:'书籍群组',isNum:true, isTerm: true})
          }

          // 添加指标列
          if(res2.data.new_show_fields && res2.data.new_show_fields.length>0){
            res2.data.new_show_fields.forEach(e=>{
              vm.tableThArr.push({label: e.value, prop: e.key, isNum:true,})
            })
          }
          // console.log('vm.tableThArr',vm.tableThArr);

          let allDatas = arrData1.concat(arrData2)
          let arrs = []
          // 分组为空时
          if(groupArr.length==0){
            let sumObj1 = {}
            let sumObj2 = {}
            if(arrData1.length>0){
              sumObj1 = Object.assign(arrData1[0], res1.data.total_info)
            }
            if(arrData2.length>0){
              sumObj2 = Object.assign(arrData2[0], res2.data.total_info)
            }
            let indsRow = [sumObj1,sumObj2]
            vm.tableThArr.forEach((b)=>{
              indsRow.forEach((r)=>{
                if(b.isNum){
                  indsRow[1][b.prop+'_between'] = indsRow[1][b.prop] - indsRow[0][b.prop]
                  if(filterObj.obj1.start_time != filterObj.obj2.start_time || filterObj.obj1.end_time != filterObj.obj2.end_time){
                      indsRow[0].timeline =  filterObj.obj1.start_time+' ~ '+filterObj.obj1.end_time
                      indsRow[1].timeline =  filterObj.obj2.start_time+' ~ '+filterObj.obj2.end_time
                      if(filterObj.obj1.time_unit){
                       indsRow[0].timeline += getDateName(filterObj.obj1.time_unit,0)
                      }
                      if(filterObj.obj2.time_unit){
                       indsRow[1].timeline += getDateName(filterObj.obj2.time_unit,1)
                      }
                  }
                  if(filterObj.obj1.searches_user){
                    indsRow[0].searches_user = vm.filterGroupName('user',filterObj.obj1.searches_user)
                  }
                  if(filterObj.obj2.searches_user){
                    indsRow[1].searches_user = vm.filterGroupName('user',filterObj.obj2.searches_user)
                  }
                  if(filterObj.obj1.searches_book){
                    indsRow[0].searches_book = vm.filterGroupName('book',filterObj.obj1.searches_book)
                  }
                  if(filterObj.obj2.searches_book){
                    indsRow[1].searches_book = vm.filterGroupName('book',filterObj.obj2.searches_book)
                  }
                }
              })
            })
            let sumSearch = vm.filterNullVal(filterObj.obj1)
            vm.tableThArr = vm.tableThArr.filter((er)=>{
              // console.log(33,sumSearch[er.prop]);
              return (sumSearch[er.prop] != undefined || er.isNum)
            })
            arrs = indsRow
            // return
          }
          // 有分组时
          if(groupArr.length>=1){
            let allGroup1 = []
            allDatas.forEach((e)=>{
              let aaa = []
              groupArr.forEach((el)=>{
                let objt = {}
                objt[el] = e[el]
                aaa.push(JSON.stringify(objt))
              })
              let str_grp = aaa.join(',')
              if(allGroup1.indexOf(str_grp) == -1){
                allGroup1.push(str_grp)
              }
            })
            allGroup1.forEach((re)=>{
              let inds = []
              let indsRow = []
              let currGropuData = []
              allDatas.forEach(r=>{
                let groupValues = re.split(',')
                let arrBool = []
                groupValues.forEach((gropu, ind)=>{
                  gropu = JSON.parse(gropu)
                  arrBool.push(gropu[Object.keys(gropu)[0]] == r[Object.keys(gropu)[0]])
                })

                if(arrBool.indexOf(false) == -1){
                  if(filterObj.obj1.start_time != filterObj.obj2.start_time || filterObj.obj1.end_time != filterObj.obj2.end_time){
                    if(r.table_order_num==1){
                      r.timeline = filterObj.obj1.start_time+' ~ '+filterObj.obj1.end_time
                      if(filterObj.obj1.time_unit){
                       r.timeline += getDateName(filterObj.obj1.time_unit,0)
                      }
                    }else{
                      r.timeline = filterObj.obj2.start_time+' ~ '+filterObj.obj2.end_time
                      if(filterObj.obj2.time_unit){
                       r.timeline += getDateName(filterObj.obj2.time_unit,1)
                      }
                    }                      
                  }

                  // if(filterObj.obj1.searches_user != filterObj.obj2.searches_user){
                    if(filterObj.obj1.searches_user && r.table_order_num==1){
                      r.searches_user = vm.filterGroupName('user',filterObj.obj1.searches_user)
                    }else if(filterObj.obj2.searches_user){
                      r.searches_user = vm.filterGroupName('user',filterObj.obj2.searches_user)
                    }
                  // }
                  // if(filterObj.obj1.searches_book != filterObj.obj2.searches_book){
                    if(filterObj.obj1.searches_book && r.table_order_num==1){
                      r.searches_book = vm.filterGroupName('book',filterObj.obj1.searches_book)
                    }else{
                      r.searches_book = vm.filterGroupName('book',filterObj.obj2.searches_book)
                    }
                  // }

                  inds.push(r.table_order_num)
                    indsRow.push(r)
                    if(indsRow.length==2){
                      vm.tableThArr.forEach((b)=>{
                        indsRow.forEach((a)=>{
                          if(b.isNum){
                            // console.log(2222,indsRow[1][b.prop], indsRow[0][b.prop]);
                            r[b.prop+'_between'] = indsRow[1][b.prop] - indsRow[0][b.prop]
                          }
                        })
                      })
                    }
                    currGropuData.push(r)
                }  
              })

              if(inds.length==1){
                let ob = {}
                let otherRow = indsRow[0]
                for(let i in otherRow){
                  vm.tableThArr.forEach((ev)=>{
                    if(!ev.isNum && ev.prop == i){
                      ob[ev.prop] = otherRow[i]
                    }
                  })
                }
                if(otherRow.searches_user){
                  ob['searches_user'] = vm.filterGroupName('user',filterObj['obj'+(3-inds[0])].searches_user)
                }
                if(otherRow.searches_book){
                  ob['searches_book'] = vm.filterGroupName('book',filterObj['obj'+(3-inds[0])].searches_book)
                }
                currGropuData.push(ob)
                if(inds[0] == 2){
                  currGropuData = currGropuData.reverse()
                }
              }
              arrs = arrs.concat(currGropuData)
            })
          }
          vm.tableData = arrs
          console.log('arrs',arrs);
          vm.loading = false
        })
      })

    })
  },
	created() {  
    
  },
  activated(){

  },
  mounted() {
    
  },
	methods: {  
   filterNullVal(obj){
      const newObj = {}
      for (const key in obj) {   
        if(obj[key] !== ''){
          newObj[key] = obj[key]
        }
      }
      return newObj
    },  
    handleShowRow(){
      this.isShowRow = !this.isShowRow
    },
    filterGroupName(type, id){
      let name = ''
      if(type=='user'){
        this.myGroupData[1].forEach((re)=>{
          if(re.id == id){
            name = re.title
          }
        })
      }else{
        this.myGroupData[2].forEach((re)=>{
          if(re.id == id){
            name = re.title
          }
        })
      }
      return name
    },
    // checkListChange(val){
    //   console.log(val);
    //   this.checkedList = val
    // }, 
    filterName(item){
      if(item.key=='group'){
        let gArr = item.prop.map((r)=>{
          return this.selectName(r)
        })
        return gArr.join(',')
      }else if(item.key=='site_id'){
        return filterSite(item.prop)
      }else if(item.key=='section_id'){
        return filterSection(item.prop)
      }else if(item.key=='platform'){
        return filterPlatform(item.prop)
      }else if(item.key=='class_id'){
        return filterOutClass(item.prop)
      }else if(item.key=='outsite'){
        let arrs = item.prop.split(',')
        let oArr = arrs.map((r)=>{
          return filterOutSite(r)
        })
        return oArr.join(',')
      }else{
        return item.prop
      }
    }, 
    getIsNumIndex(){
      let timeNum = 0
      for (let i = 0; i < this.tableThArr.length; i++) {
        if(this.tableThArr[i].isNum){
          timeNum = i
          console.log('timeNum',timeNum);
          break;
        }
      }
      return timeNum
    },
    getFilerArr(){
      console.log('this.searchObj',this.filterObj.obj1);
      let searchObj = this.filterObj.obj1
      let arr = []
      for(let i in this.filterObj.obj1){
        if(this.selectName(i) && searchObj[i]){
          arr.unshift({key: i,label: this.selectName(i), prop: searchObj[i]})
        }
      }
      console.log('arr55',arr);
      this.filterData = arr
    },
    selectName(key){
      if(key == 'group'){
        return '分组'
      }else if(key == 'platform'){
        return '平台'
      }else if(key == 'section_id'){
        return '频道'
      }else if(key == 'site_id'){
        return '站点'
      }else if(key == 'class_id'){
        return '分类'
      }else if(key == 'outsite'){
        return '渠道'
      }else{
        return ''
      }
    },
    flitterData(arr){
        let spanOneArr = []
        let concatOne = 0
        arr.forEach((item,index)=>{
            if(index === 0){
                spanOneArr.push(1);
            }else{
                //name 修改
                if(item.platform === arr[index - 1].platform){ //第一列需合并相同内容的判断条件
                    spanOneArr[concatOne] += 1;
                    spanOneArr.push(0);
                }else{
                    spanOneArr.push(1);
                    concatOne = index;
                };
            }
        });
        return {
            one: spanOneArr,
        }
    },
    
    formatTdValue(col,val){
      return getSpecialName(col, val)
    },
    sortChange(data) {    
      // this.$nextTick(()=>{
      //   const { prop, order } = data
      //   let orders = ''
      //   if (order === 'ascending') {
      //     orders = 'asc'
      //   }else if(order === 'descending'){
      //     orders = 'desc'
      //   }else if(prop == null){
      //     // this.listQuery.order = '' 
      //     // this.currentPage = 1
      //     this.listData()    
      //     return false
      //   }
      //   // this.listQuery.order = prop + ' ' + orders
      //   // this.currentPage = 1
      //   this.listData()
      // })      
    },

	}
}
</script>

<style scoped lang="scss">
.merge_table{
  /deep/ .el-table tr td{
    // border: none;
    border-color: #e9e9e9;
    // .cell .cell_value{
    //   position: relative;
    //   top: 0px;
    // }
  }
  .filt_list{
      float: right;
      margin-left: 20px;
      padding-bottom: 10px;
      span:nth-child(1){
        color: #606266;
        font-size: 14px;
        float: left;
        margin-top: -1px;
      }
      span:nth-child(2){
        font-weight: bold;
        color: #606266;
      }
    }
  /deep/ .el-table .first_class td{
    border-top: 1px solid #EBEEF5;
  }
  /deep/ .el-table .order_odd td{
    // background-color: #f3f6ff;
  }
  /deep/ .el-table tr:nth-child(odd) td{
    // padding-top: 0;
    border-bottom: none;
    .coment_cell{
      display: none;
    }
    .cell .cell_value{
      position: relative;
      top: 5px;
    }
  }
  .coment_cell{
    position: absolute;
    top: -11px;
    z-index: 8;
    width: 100%;
  }
  // .first_col{
  //   border-bottom: 1px solid #EBEEF5 !important;
  // }
  /deep/ .second_cell{
    .cell{
      display: none;
    }
  }
  .ratio_table{
    .bet_value{
      position: absolute;
      top: -10px;
      margin-left: 1px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 7;
      color: #F56C6C;
      .sucess_icon{
        color: #67C23A;
        transform: rotate(90deg);
        font-weight: bold;
      }
      .delete_icon{
        color: #F56C6C;
        transform: rotate(-90deg);
        font-weight: bold;
      }
      .sucess_word{
        color: #67C23A;
      }
    }
  }
  .filter_word{
      padding-right: 10px;
      .filt_list{
        float: left;
        margin-left: 20px;
        span:nth-child(1){
          color: #606266;
          font-size: 14px;
        }
        span:nth-child(2){
          font-weight: bold;
          color: #606266;
        }
      }
    }
}
</style>
