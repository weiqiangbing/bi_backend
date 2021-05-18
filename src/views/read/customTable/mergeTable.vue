<template>
  <div class="app-container merge_table">
    <!-- 主题内容 -->
    <div class="filter_box">
      <!-- <Filterbtns ref="filteref" :isAll="true" :filterConfig="filterConfig"></Filterbtns> -->
      <div class="filter_word">
        <div class="filt_list" v-for="(item, index) in filterData" :key="index">
          <span>{{item.label}}</span> : <span>{{filterName(item)}}</span>
        </div>
        <div class="filt_list">
          <span>时间范围：</span>
          <span v-if="searchObj.time_unit">{{relativeTime1}} ~ {{relativeTime2}}  ({{searchObj.time_type=='day'?'天':'月'}})</span>
          <span v-else>{{searchObj.start_time}} ~ {{searchObj.end_time}}({{searchObj.time_type=='day'?'天':'月'}})</span>
        </div>
      </div>
      <div style="display:flex;margin-top: -10px;float: right;">
        <div class="check_ths link-type" @click="handleShowRow"><i class="icon el-icon-setting"></i><span>隐藏列</span></div>    
        <el-popover
        placement="top"
        width="340"
        v-model="visible">
        <div class="report_box">
          <reportForm ref="reportBox"></reportForm>
        </div>    
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="handleSaveFilter('table')">确定</el-button>
        </div>
        <el-button 
          slot="reference"
          style="margin-left: 0;" 
          class="padding-btn-10" 
          type="primary">
          保存报表
        </el-button>
      </el-popover>
      </div>
    </div>
    <div class="init_dialog">
      <el-dialog
        title="请选择你想要显示的列进行勾选"
        :modal="false"
        class="check_th_clss"
        top="5vh"
        :visible.sync="isShowRow"
        width="620px">
        <el-checkbox-group 
          v-model="checkedList"
          @change="checkListChange">
          <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-dialog>
    </div>
    <div class="init-table">
      <el-table
        class="border-top-20"
        v-loading="loading"
        :data="tableData"
        @sort-change="sortChange"
        :cell-style="cellStyle"
        style="width: 100%"
      >
        <template v-for="(item) in tableColumns">
          <el-table-column
            v-bind:key="item.prop"
            v-if="show_field.indexOf(item.prop) != -1 && checkedList.indexOf(item.prop) != -1 && item.prop != 'group_count'"
            :sortable="sortable(item.prop)"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
            :fixed="!sortable(item.prop)"
            :width="item.width ? item.width : ''"
            :formatter="formatTables"
            align="center"
          ></el-table-column>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :background="true"
        :page-sizes="[10, 20, 50, 100,200]"
        :page-size="pageCount"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_nums"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mergeTableData } from "@/api/public";
import { tableColumns } from "@/utils/tableColumns";
import reportForm from '@/components/parts/reportForm.vue'
import { saveReportData } from '@/api/public/index'
import { getSiteList } from '@/api/public/index'
import {getDateName} from '@/utils/assist'
import {
  filterSite,
  filterPlatform,
  filterOutSite,
  filterSection,
  filterOutClass,
} from "@/utils/filterWord";
import { filterObjToArr } from '@/utils/common';
// import Filterbtns from '@/components/Filterbtns'

export default {
  name: "MergeTable",
  components: {reportForm},
  data() {
    return {
      loading: false,
      isMerge: false,
      visible: false,
      tableData: [],
      filterObj: {},
      tableColumn: [],
      show_field: [],
      siteList1: [],
      searchObj: {},
      pageInfos: {},
      pageCount: 10,
      total_nums: 0,
      currentPage: 1,
      tableColumns: { ...tableColumns },
      mainTable: 0,
      allHeaders: [],
      orderParams:'',
      isShowRow: false,
      checkedList:[],
      pageNames:[],
      siteList1:{},
      filterData:[],
      relativeTime1:'',
      relativeTime2:'',
      
    };
  },
  created() {
    let _this = this
    getSiteList().then(res => {         
      let siteList = [...res.data]
      siteList.forEach(item => {
        let site_id = item.site_id
        let site_name = item.site_name
        _this.siteList1[site_id] = site_name
      })
    })
    this.listData();
  },
  activated() {
    this.mainTable = 0
    this.orderParams = ''
    this.listData();
  },
  mounted() {},
  computed:{
    defaultCheckedList(){
      let arr = []
      let noArr = []
      let fiedsArr = new Set(this.show_field)
      tableColumns.forEach((re)=>{
        fiedsArr.forEach(e=>{
          if(re.prop == e){
            if(noArr.indexOf(e) == -1 && e != 'group_count'){
              arr.push(re)
            }
          }
        })
      })
      // console.log(11134,arr);
      let oldvalue = JSON.parse(sessionStorage.getItem('merge_tables'+this.pageNames.join("_")+this.searchObj.group))
      if(oldvalue && oldvalue.length>0){
        this.checkedList = oldvalue
      }else{
        this.checkedList = Array.from(fiedsArr)
      }
      return arr
    },
  },
  methods: {
    listData() {
      let _this = this;
      this.loading = true
      let mergeData = []
      // console.log("tableColumns", this.tableColumns);
      let pagesData = JSON.parse(sessionStorage.getItem("merge_pages_data"));
      if (pagesData) {
        // console.log("pagesData", pagesData);
        this.searchObj = pagesData.searchObj;
        this.pageInfos = pagesData.pages;
        // this.filterConfig = pagesData.filterConfig
        // this.siteList1 = pagesData.siteList1
        // this.$nextTick(()=>{
        //   this.$refs.filteref.listQuery = this.searchObj
        // })
        this.getFilerArr()
      }
      this.pageNames = []
      this.pageInfos.forEach((page, index) => {
        this.pageNames.push(page.name)
        if (this.mainTable == index){
          // 主表
          let search1 = _this.searchObj;
          let search2 = _this.searchObj;
          search1.count = this.pageCount;
          search1.order = this.orderParams;
          search1.page = this.currentPage - 1;

          if(_this.searchObj.time_unit){
            this.relativeTime1 = _this.searchObj.start_time +' '+ getDateName(_this.searchObj.time_unit,0)
            this.relativeTime2 = _this.searchObj.end_time +' '+ getDateName(_this.searchObj.time_unit,1)
          }

          mergeTableData(_this.pageInfos[index].api, search1).then((res1) => {
            let resData1 = res1.data.collection;
            // mergeData = resData1
            _this.total_nums = res1.data.total_nums
            _this.show_field = filterObjToArr(res1.data.show_fields)
            _this.allHeaders = []
            _this.show_field.forEach((re)=>{
              _this.allHeaders.push(re+'_'+this.mainTable)
            })
            if (resData1.length > 0) {
              // console.log('_this.searchObj.group',_this.searchObj.group);
              let groupArr = _this.searchObj.group;
              resData1.forEach((r) => {
                r.tableIndex = index;
              });
              console.log('resData1',resData1);

              // 添加数组查询条件
              // console.log('groupArr',groupArr);
              groupArr.forEach((e) => {
                let obj2 = {};
                obj2[e] = [];
                resData1.forEach((r) => {
                  if (obj2[e].indexOf(r[e]) == -1) {
                    obj2[e].push(r[e]);
                  }
                });
                obj2[e] = obj2[e].join(",");
                search2 = Object.assign(search2, obj2);
              });
              console.log("search2", search2);
              // 辅表
              search2.count = 0;
              search2.page = 0;
              delete search2.order

              for (let i in search2) {
                if(search2[i] && i.indexOf('having_') != -1){
                  delete search2[i]
                }
              }
              _this.pageInfos.forEach((page, index) => {
                if (_this.mainTable != index) {
                  mergeTableData(_this.pageInfos[index].api, search2).then(
                    (res2) => {
                      console.log('res2.data',res2.data);
                      let res2ShowFieds = filterObjToArr(res2.data.show_fields)
                      res2ShowFieds.forEach((re)=>{
                        _this.allHeaders.push(re+'_'+index)
                      })
                      _this.show_field = _this.show_field.concat(res2ShowFieds);
                      let resData2 = res2.data.collection
                      resData2.forEach((r) => {
                        r.tableIndex = index;
                      });
                      resData1.forEach((a) => {
                        // let queryObj = {}
                        let queryArr = []
                        groupArr.forEach((e)=>{
                          // queryObj[e] = a[e]
                          queryArr.push(a[e])
                        })                          
                          resData2.forEach((b)=>{
                            let arrBool = []
                            for (let i = 0; i < groupArr.length; i++) {
                              arrBool.push(b[groupArr[i]] == [queryArr[i]])
                            }
                            if(arrBool.indexOf(false) == -1){
                              a = Object.assign(a,b)
                            }
                          })
                      });
                      console.log('mergeData',resData1);
                      _this.tableData = resData1
                      _this.loading = false
                    }
                  );
                }
              });
            } else {
              // 主表无数据
              _this.loading = false;
            }
          });
        }
      });
    },
    getFilerArr(){
      // console.log('this.searchObj',this.searchObj);
      let arr = []
      for(let i in this.searchObj){
        if(this.selectName(i) && this.searchObj[i]){
          arr.unshift({key: i,label: this.selectName(i), prop: this.searchObj[i]})
        }
      }
      this.filterData = arr
    },
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
    filterNullVal(obj) {
      const newObj = {};
      for (const key in obj) {
        if (obj[key] !== "") {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    handleSaveFilter(type){
      let objs = this.$refs.reportBox.formData
      // console.log(this.$route);
      // console.log(this.pageInfos);
      let apis = []
      this.pageInfos.forEach(re=>{
        apis.push(re.api)
      })

      if(objs.name){
        let data = objs
        data.apis = apis
        data.from = this.$route.name
        data.to = this.$route.path
        data.checkedList = this.checkedList
        data.type = type
        data.listQuery = this.searchObj
        saveReportData(data).then((res)=>{
          this.$message.success('保存成功！')
          this.visible = false
        })
      }else{
        this.$message.warning('请填写报表名称')
      }  
    }, 
    sortChange(data) {
      this.$nextTick(()=>{
        console.log(data);
        const { prop, order } = data
        this.allHeaders.forEach((re)=>{
          if(re.indexOf(prop) != -1){
            this.mainTable = re.slice(-1)
          }
        })
        // alert(this.mainTable)
        let orders = ''
        if (order === 'ascending') {
          orders = 'asc'
        }else if(order === 'descending'){
          orders = 'desc'
        }else if(prop == null){
          this.orderParams = ''
          this.currentPage = 1
          this.listData()
          return false
        }
        this.orderParams = prop + ' ' + orders
        this.currentPage = 1
        this.listData()
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }){      
      // if(row.tableIndex==0){
      //   return 'background-color:red'
      // }else if(row.tableIndex==1){
      //   return 'background-color:blue'
      // }
    },
    handleSizeChange(val) {
      this.pageCount = val;
      this.listData();
    },
    checkListChange(val){
      console.log(val);
      this.checkedList = val
      sessionStorage.setItem('merge_tables'+this.pageNames.join("_")+this.searchObj.group, JSON.stringify(val))
      // setBookCostList(this.checkedList)
      // this.isChecked()   
    },    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.listData();
    },
    sortable(prop){
      if(this.searchObj.group.indexOf(prop) == -1){
        return 'custom'
      }
      return false
    },
    formatTables(row, col, val) {
      // console.log(col);
      if(col.property == "site_id") {
        return this.siteList1[val];
      } else if (col.property == "platform") {
        return filterPlatform(val);
      } else if (col.property == "section_id") {
        return filterSection(val);
      } else if (col.property == "outsite") {
        return filterOutSite(val);
      } else if (col.property == "class_id") {
        return filterOutClass(val);
      } else {
        if (val) {
          return val;
        } else {
          return "~";
        }
      }
    },
    handleShowRow(){
      this.isShowRow = !this.isShowRow
    }
  },
};
</script>

<style lang="scss" scoped>
.merge_table {
  .main-table{
    
  }
  .filter_box{
    display: flex;
    justify-content: space-between;
    .check_ths{
      padding-top: 12px;
      padding-right: 20px;
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
  .pagination{
    margin-top: 12px;
  }
  .check_th_clss{
    /deep/ .el-dialog__body{
      padding-top: 0;
    }
    /deep/ .el-checkbox{
      width: 110px;
    }
  }
}
</style>
