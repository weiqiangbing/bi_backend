<template>
  <div class="app-container user-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload"
    @handleShowRow="handleShowRow" @handleShowEcharts="handleShowEcharts" @handleSaveEcharts="handleSaveEcharts" :defaultSite="500" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.appExtendData" :groupListData="groupListData"></filter-inputs>

    <div class="static_box">
      <!-- <div class="static_item">
        <div class="static_num">{{otherData.install || 0}}</div>
        <div class="static_word">总安装数</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.reg_rate || '--'}}</div>
        <div class="static_word">注册转化率</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.recharge_rate || '--'}}</div>
        <div class="static_word">充值转化率</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.second_recharge_rate || '--'}}</div>
        <div class="static_word">二次充值转化率</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.recovery_date || '--'}}</div>
        <div class="static_word">100%回本日期</div>
      </div> -->
      <!-- <table border="1" v-if="totalArrs.length>0">
        <tr>
          <td>{{siteName}}</td>
          <td>花费</td>
          <td>新用户充</td>
          <td>%</td>
          <td>全用户充</td>
          <td>%</td>
        </tr>
        <tr v-for="item in totalArrs" :key="item.platform">
          <td>{{filterPlat(item.platform)}}</td>
          <td>{{item.daa_cost | filterFiexd}}</td>
          <td>{{item.daa_pay}}</td>
          <td>{{item.InconsistentReturn}}</td>
          <td>{{item.daa_pay}}</td>
          <td>{{item.InconsistentReturn}}</td>
        </tr>
      </table> -->
    </div>
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
      <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop" v-if="filterAuth(item.prop)">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </el-dialog>
    <!-- 主题内容 -->
    <div class="main-table">    
      <el-table
        :row-class-name="rowTableClss"
        show-summary
        :summary-method="getSummaries"
        class="cus_table"
        v-loading="loading"
        :data="tableData">
          <!-- 正常表单列 -->
          <el-table-column
            v-if="checkedSum[item.prop] && show_field.indexOf(item.prop) != -1 && filterAuth(item.prop)"
            v-for="item in tableThs"
            v-bind:key="item.prop"
            :render-header="(h, obj)=>handleRenderHeader(h,obj,item)"
            :prop="item.prop"
            :width="item.width?item.width:'auto'"
            :label="item.label"
            :formatter="formatTdValue"
            :show-overflow-tooltip="true"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120px">
            <template slot-scope="scope">
              <!-- <div> -->
                <div v-if="scope.row.sum" class="click_cell" @click="goToDetail(scope.row)">广告详细</div>
                <!-- <el-link type="success">成功链接</el-link> -->
              <!-- </div> -->
            </template>
          </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!-- <div class="pagination">
      <el-pagination
        v-if="refreshPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :background="true"
        :page-sizes="[10, 20, 50, 100,200]"
        :page-size="pageCount"
        :current-page="currentPage"                       
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_nums">
      </el-pagination>
    </div> -->
    <!-- 图表弹框 -->
    <chart-line ref="chartLine" :tableData="tableData" :isShowSelect="isShowSelect" :listQuery="listQuery" :checkedList="checkedList" :isShowEchart="isShowEchart" @closeFn="closeFn"></chart-line>
  </div>  
</template>

<script>
import { getList, getGather } from '@/api/extend/extend'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setExtendList, getExtendList, removeExtendList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import {getSpecialName} from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

import {
  filterSite,
  filterPlatform,
  filterOutSite,
  filterSection,
  filterOutClass,
} from "@/utils/filterWord";

export default {
  name: 'AppData',
  components: {
    FilterInputs,
    ChartLine
  },
	data() {
		return {  
      loading: true,	
      isShowRow: false,
      isShowSelect: false,
      isShowEchart: false,
      siteName:'',
      downloadLoading: false, // 导出状态
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
			total_nums: 0, // 分组内的用户总数
			currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      base_url: process.env.VUE_APP_BASE_API,
      groupListData: [],
      defaultCheckedList: [], // 隐藏列默认值      
      checkedList: [],
      book_ids: [],
      tableData: [], // 表格数据
      allData: [], // 导出数据
      show_field: [], // 本次返回数据所包含的列
			tableColumn: [...tableColumns], // table头部名称的配置（所有项）
      listQuery: {},
      siteList1: {},
      otherData:{},
      totalInfo:{},
      totalArrs:[],
      new_show_fields:[],
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
      authArrData:[],
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.appExtendData.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.appExtendData.checkedSum)),
      // checkedSum: Object.assign({}, pageTableConfig.appExtendData.checkedSum),
      // sortSum: JSON.parse(JSON.stringify(pageTableConfig.appExtendData.sortSum)),
      tableThs:[
        {label: '日期',prop:'timeline',width:'120'},
        {label: '站点',prop:'site_id',width:'100'},
        {label: '渠道',prop:'daa_channel',width:'140'},
        {label: '账号',prop:'daa_account_name',width:'240'},
        {label: '系统',prop:'platform'},
        // {label: '广告',prop:'daa_series',width:'160'},
        {label: '作品',prop:'book_id'},
        {label: '展示次数',prop:'daa_show_times',width:'100',isNum: true},
        {label: '覆盖人数',prop:'daa_show_users',width:'100',isNum: true},
        {label: '点击率%',prop:'click_an_rate',width:'100',isNum: true},
        {label: '花费金额',prop:'daa_cost',width:'120',isNum: true},
        {label: '安装人数',prop:'daa_install_users',width:'100',isNum: true},
        {label: '安装单价',prop:'uninstalled',width:'120',isNum: true},
        {label: '充值金额',prop:'daa_pay',width:'100',isNum: true},
        {label: '回报%',prop:'InconsistentReturn',isNum: true},
        {label: '充值次数',prop:'daa_pay_times',width:'100',isNum: true},
        {label: '充值人数',prop:'daa_pay_users',width:'100',isNum: true},
        {label: '推广人',prop:'daa_editor'},
      ]
		}
  },
  filters: {
    outSiteText,
    sectionText,
    classText,
    filterFiexd(val){
      if(val){
        return Number(val).toFixed(2)
      }else{
        return 0
      }
    },
  },
created() {
    let pageCount = localStorage.getItem('extend_appdata_pagecount')
    // console.log('tableColumn',this.tableColumn);
    // console.log('pageTableConfig.appExtendData',pageTableConfig.appExtendData.checkedSum);
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    
  },
  mounted() {
    this.siteList1 = this.$refs.filterDom.siteList1
  },
	methods: {
    // 去空值
    filterNullVal(obj){
      const newObj = {}
      for (const key in obj) {   
        if(obj[key] !== ''){
          newObj[key] = obj[key]
        }
      }
      return newObj
    },  
    filterAuth(key){
      return getPageAuth(key, this.authArrData)
    },   
    computeThs(num){
     // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏
      this.defaultCheckedList = []
      this.tableColumn = [...tableColumns]
      let hasArr = []
      let reteArr = []
      if(num){
        this.new_show_fields.forEach(r=>{
          this.tableColumn.push({label: r.value, prop: r.key})
          reteArr.push({label: r.value, prop: r.key})
          hasArr.push(r.key)
        })  
      }
      for(let i in this.tableColumn){
        if(this.show_field.indexOf(this.tableColumn[i].prop) != -1){
          if(hasArr.indexOf(this.tableColumn[i].prop)==-1){
            this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
          }
        }
        if(this.checkedSum[this.tableColumn[i].prop]){
          if(getExtendList().length > 0){
            this.checkedList = getExtendList()
            this.isChecked()   
          }else{
            this.checkedList.push(this.tableColumn[i].prop) 
          }  
        }  
      }
      if(getExtendList().length <= 0){
        hasArr.forEach((r)=>{
          this.$set(this.checkedSum, r, true)
        })
        this.checkedList = this.checkedList.concat(hasArr)
      }
      let checkArr = new Set(this.checkedList)
      this.checkedList = [...checkArr]
      this.defaultCheckedList = this.defaultCheckedList.concat(reteArr)
    },   
    goToDetail(row){
      // console.log(row);
      // console.log(this.listQuery);
      // return
      this.$router.push({
        name: 'AppDataDetail',
        query: {
          account_id:row.daa_account_id,
          start_time: this.listQuery.start_time,
          end_time: this.listQuery.end_time,
          time_unit: this.listQuery.time_unit
        }
      })
    },    
    listData() {		
      const currentPage = this.currentPage - 1
      this.loading = true
      let params = {
        page: currentPage,
        count: this.pageCount,
        start_time: this.listQuery.start_time,
        end_time: this.listQuery.end_time,
        order: this.listQuery.order,
        book_id: this.listQuery.book_id, 
        site_id: this.listQuery.site_id,
        pay_channel: this.listQuery.pay_channel,
        platform: this.listQuery.platform,
        time_type: this.listQuery.time_type,
        group: this.listQuery.group,  
        time_unit: this.listQuery.time_unit,
        user_type: this.listQuery.user_type,
        user_timeline: this.listQuery.user_timeline,
        searches_user: this.listQuery.searches_user,
        searches_book: this.listQuery.searches_book,
        outsite: this.listQuery.outsite,
        section_id: this.listQuery.section_id,
        class_id: this.listQuery.class_id,
        author_name: this.listQuery.author_name,
        show_type: 'index'
      }
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
      this.show_field = ['timeline','site_id','daa_channel','daa_account_name','platform','daa_series','book_id',
        'daa_show_times','daa_show_users','click_an_rate','daa_cost','daa_install_users','uninstalled','daa_pay',
        'InconsistentReturn','daa_pay_times','daa_pay_users','daa_editor']
      getGather(newParams).then(res => {
          this.tableData = res.data.list
          this.totalInfo = res.data.total_Info
          this.totalArrs = res.data.siteTotalInfo

          this.new_show_fields = res.data.new_show_fields
          if(res.data.new_show_fields && res.data.new_show_fields.length>0){
            this.computeThs(1)
          }else{
            this.computeThs(0)
          }

          if(this.listQuery.site_id){
            this.siteName = filterSite(this.listQuery.site_id)
          }else{
            this.siteName = '全部'
          }
        this.groupListData = res.data.group_list ? [...res.data.group_list]	: []

        // console.log('this.show_field',this.show_field);
        
        // this.total_nums = res.data.total_nums 	  
        setTimeout(() => {
          this.loading = false
        }, 250)	
      }).catch(err => {
        this.loading = false
      })  
      // getGather(newParams).then((otherData)=>{
      //   this.otherData = otherData.data
      // })
    },     
    
    filterPlat(val){
      if(val=='APP'){
        return 'APP'
      }else{
        return filterPlatform(val)
      }
    },
    formatTdValue(row,col,val){
      if(col.property == 'daa_cost'){
        if(val){
          return val.toFixed(2)
        }else{
          return '~'
        }
      }else{
        if(row.sum==1){
          if(col.property=='timeline'){
            return '总汇'
          }else{
            let isShow = false
            this.tableThs.forEach((re)=>{
              if(re.prop == col.property && re.isNum){
                isShow = true
              }
            })
            if(isShow){
              return val
            }else{
              return ''
            }
          }
        }else{
          return getSpecialName(col.property, val)
        }
      }
    },  
    isChecked(){
      this.tableColumn.forEach( (item, index) => {
        if(this.show_field.indexOf(item.prop) != -1){
          if(this.checkedList.indexOf(item.prop) == -1){
            this.checkedSum[item.prop] = false
          }else{
            this.checkedSum[item.prop] = true         
          }
        }  
      })
    },
    checkListChange(){
      setExtendList(this.checkedList)
      this.isChecked()   
    },  
    handleFilter(listQuery){
      this.currentPage = 1
      this.listQuery = {...listQuery}
      this.listData()
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 6) {
            sums[index] = '总汇';
            return;
          }
          if(column.property=='daa_show_times'){
            sums[index] = this.totalInfo['daa_show_times']
          }else if(column.property=='daa_show_users'){
            sums[index] = this.totalInfo['daa_show_users']
          }else if(column.property=='click_an_rate'){
            sums[index] = this.totalInfo['click_an_rate']
          }else if(column.property=='daa_cost'){
            if(this.totalInfo['daa_cost']){
             sums[index] = Number(this.totalInfo['daa_cost']).toFixed(2)
            }
          }else if(column.property=='daa_install_users'){
            sums[index] = this.totalInfo['daa_install_users']
          }else if(column.property=='uninstalled'){
            sums[index] = this.totalInfo['uninstalled']
          }else if(column.property=='daa_pay'){
            sums[index] = this.totalInfo['daa_pay']
          }else if(column.property=='InconsistentReturn'){
            sums[index] = this.totalInfo['InconsistentReturn']
          }else if(column.property=='daa_pay_times'){
            sums[index] = this.totalInfo['daa_pay_times']
          }else if(column.property=='daa_pay_users'){
            sums[index] = this.totalInfo['daa_pay_users']
          }
        });
        return sums;
      },
      rowTableClss({row}){
        // console.log(row);
        if(row.sum==1){
          return 'sum_class'
        }
      },
    // ===== 导出数据 start =====
    handleDownload(data) {
      // console.log('data', data)
      // let targetUrl = this.base_url + `bi/works/visit?` + `authorization=` +  `Bearer ` + getToken() + `&page=` + currentPage + `&count=` + `-1`
      // let targetUrl = `http://ls.bi.backend.moqing.com/common/test`
      // console.log(targetUrl);
      // window.open(targetUrl, "_self", "width=200,height=200,scrollbars=no");

      let obj = getCheckedZh(this.defaultCheckedList, this.checkedList)
      const currentPage = this.currentPage - 1
      const checkedEnStr = obj.checkedEn.join(',')
      this.downloadLoading = true
      let params = {
        page: currentPage,
        count: -1,
        //field: checkedEnStr,
        start_time: data.start_time,
        end_time: data.end_time,
        order: data.order,
        book_id: data.book_id, 
        site_id: data.site_id,
        pay_channel: data.pay_channel,
        platform: data.platform,
        time_type: data.time_type,
        group: data.group,  
        time_unit: data.time_unit,
        user_type: data.user_type,
        user_timeline: data.user_timeline,
        searches_user: data.searches_user,
        searches_book: data.searches_book,
        outsite: data.outsite,
        section_id: data.section_id,
        class_id: data.class_id,
        author_name: data.author_name,
        show_type: 'index'
      }
      let tremPraam = addTremParams(data)
      params = Object.assign(params, tremPraam)
      params.download_field = this.checkedList.join(',')   
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = 'App推广数据.csv'   
        if('download' in document.createElement('a')){
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        }else{
          navigator.msSaveBlob(blob, fileName)
        }
        this.downloadLoading = false
      }).catch(err => {
        this.downloadLoading = false
        this.$message.warning('导出失败！')
      })  
    },
    // ===== 导出数据 end =====
    handleShowRow(isShowRow){
      this.isShowRow = isShowRow
    },
    handleShowEcharts(groupStr){ 
      if(this.tableData.length){
        this.isShowSelect = true
      }else{
        this.$message.warning('查询数据后方可绘图')
      }
    },  
    handleSaveEcharts(){
      var data = JSON.parse(localStorage.getItem('saveEchartData'))

      if(data != null){
        this.isShowEchart = true
      }else{
        this.$message.warning('暂无历史图表')
      }
    }, 
    // handleSaveFilter(){
    //   console.log(123)
    // },
    closeFn(){
      this.isShowSelect = false
      this.isShowEchart = false
    },
    // 设置table分页条数
    handleSizeChange(val){
      localStorage.setItem('extend_appdata_pagecount', val)
      this.pageCount = val
			this.loading = true
			this.listData()
			this.loading = false
    },
    // 切换table分页
		handleCurrentChange(val) {
			this.currentPage = val
			this.loading = true
			this.listData()
			this.loading = false
    },
    // sortChange(data) {    
    //   this.$nextTick(()=>{
    //     const { prop, order } = data
    //     let orders = ''
    //     if (order === 'ascending') {
    //       orders = 'asc'
    //     }else if(order === 'descending'){
    //       orders = 'desc'
    //     }else if(prop == null){
    //       this.listQuery.order = '' 
    //       this.currentPage = 1
    //       this.listData()    
    //       return false
    //     }
    //     this.listQuery.order = prop + ' ' + orders
    //     this.currentPage = 1
    //     this.listData()
    //   })      
    // },
    handleRenderHeader(h, { column, $index }, item){
      return h(
        'div',{
          style: 'width: 80px;padding: 0;margin: 0;text-align: left;white-space:normal; word-break:break-all;line-height: 16px;'
        },
        [ 
          h('span', column.label),
          h('el-popover', 
            { props: { placement: 'top', width: '200',trigger: 'hover', content: item.placeholder?item.placeholder:column.label }},
            [
              h('span', { slot: 'reference',class:'font-normal'},[
                  h('i', {class:'el-icon-question',style: 'color:#409eff;margin-left:5px;font-size:15px;margin-top: 5px;cursor: pointer;'}),
              ])
            ])
        ]
      )
    }

	}
}
</script>

<style lang="scss" scoped>
.user-wrap{
  .static_box{
    table{
      border: none;
      border-collapse: collapse;
      tr{
        border-color: #ddd;
        td{
          font-size: 14px;
          padding: 4px 10px;
          border-color: #ddd;
          .cell{
            text-align: left;
          }
        }
      }
    }
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  // .filter-container{
  //   padding-top: 20px;
  // }
  .table{
    padding-top: 20px;
    
  }
  .pagination {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;
  }
  .border-top-20{
    padding-top: 20px;
  }
  .el-dialog__body{
    /* min-height: 400px; */
    padding: 5px 30px 20px;
  }
  .checked-show-row-list{
    padding-top: 30px;
  }
  
}
.main-table{
  // overflow-y: hidden;
  .cus_table{
    width: 100%;
    // overflow-x: auto;
    overflow: auto;
    /deep/ .sum_class td{
      background-color: #f5f7fa !important;
    }
    /deep/ tr{
      // &:nth-child(1){
      //   background-color: #ddd;
      // }
      td{
        padding: 6px 20px;
        .cell{
            text-align: left;
          }
      }
    }
    
  }
}

</style>
