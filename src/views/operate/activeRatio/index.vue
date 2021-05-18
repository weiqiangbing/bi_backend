<template>
  <div class="app-container book-cost-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload" @handleShowRow="handleShowRow"
    @handleShowEcharts="handleShowEcharts" :tableData="tableData" :checkedList="checkedList" :eventTypeData="eventTypeData" :eventIdData="eventIdData" :downloadLoading="downloadLoading" :filterConfig="pageConfig.activeRatio"
    @getEchartData="getEchartData" :echartDatas="echartDatas" :defaultSite="500" @getActiveList="handActiveList"
    ></filter-inputs>
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
            v-if="filterAuth(item.prop)"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="false"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            align="center"
          >
          <template slot-scope="scope">
            <div class="ratio_table" :class="{coment_cell: item.prop=='site_id' || item.prop=='event_id'}" :style="{paddingRight: item.padRight||0}">
              <span class="cell_value">{{formatTdValue(item.prop,scope.row)}}</span>
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
import { getList, getActiveType, getActiveList } from '@/api/operate/activeRatio'
import FilterInputs from '@/components/FilterInputs'
// import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
// import { setactiveRatioList, getactiveRatioList, removeactiveRatioList} from '@/utils/auth'
import {getSpecialName} from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

export default {
  name: 'ActiveRatio',
  components: {
    FilterInputs,
    // ChartLine,
  },
	data() {
		return { 
      loading: false,
      isShowRow: false,
      isShowSelect: false,		
      downloadLoading: false, // 导出状态
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
			total_nums: 0, // 分组内的用户总数
			currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      defaultCheckedList: [],
      checkedList: [],
      book_ids: [], 
      tableData: [],
      echartDatas:[],
      allData: [], // 导出数据
      show_field: [], // 本次返回数据所包含的列
      tableColumn: [...tableColumns],
      listQuery: {},	
      new_show_fields:[],
      eventTypeData:[],
      eventIdData:[],
      siteList1: {},  
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.activeRatio.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.activeRatio.checkedSum)),
      sortSum: JSON.parse(JSON.stringify(pageTableConfig.activeRatio.sortSum)),
      noNumArr:['site_id','event_id','start_time','end_time'],
      authArrData:[],
      tableThArr:[
        {label: '站点',prop:'site_id', width:80},
        {label: '活动id',prop:'event_id', width:80},
        {label: '开始时间',prop:'start_time', width: 180},
        // {label: 'PV',prop:'pv'},
        // {label: 'UV',prop:'uv'},

        {label: '订阅小说币',prop:'cost_coin'},
        // {label: '消费人数',prop:'cost_people'},
        {label: '消费章节数',prop:'chapters_total'},
        {label: '消费章节数(币)',prop:'coin_chapters'},

        {label: '下单次数',prop:'order_num'},
        // {label: '充值人数',prop:'pay_people'},
        {label: '充值次数',prop:'pay_num'},
        {label: '充值金额',prop:'pay_money', padRight:'50px', width: 140},
      ]
		}
  },
  filters: {
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
	created() {
    let pageCount = localStorage.getItem('book_cost_pagecount')
    this.getActiveType()
    this.getActiveList()
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    // this.listData()	
    // 获取隐藏列数据
    // this.getRowList()
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
    async getActiveType(){
      let res = await getActiveType()
      this.eventTypeData = res.data
    },  
    filterAuth(key){
      return getPageAuth(key, this.authArrData)
    },    
    handActiveList(key, val){
      this.listQuery[key] = val
      this.getActiveList()
    },
    async getActiveList(){
      let params = {
        event_type: this.listQuery.event_type,
        site_id: this.listQuery.site_id
      }
      if(this.$refs.filterDom){
        this.$set(this.$refs.filterDom.listQuery, 'event_id', '')
      }
      let res = await getActiveList(params)
      // this.$refs.filterDom.listQuery.event_id = ''
      this.eventIdData = res.data.collection
    },    
    listData() {		
      const currentPage = this.currentPage - 1
      this.loading = true
      let params = {
        page: currentPage,
        // count: this.pageCount,
        start_time: this.listQuery.start_time,
        end_time: this.listQuery.end_time,
        order: this.listQuery.order,
        book_id: this.listQuery.book_id, 
        event_type: this.listQuery.event_type, 
        event_id: this.listQuery.event_id, 
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
        author_name: this.listQuery.author_name
      }
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => {
        // let arrDatas = []     
        this.tableData = []
        if(res.code == 20000){
          let cost1 = Object.assign(res.data.collection.cost,res.data.collection.order)
          let cost2 = Object.assign(res.data.collection.cost_active,res.data.collection.order_active)
          for(let i in cost1){
            for(let j in cost2){
              if(i==j){
                if(this.noNumArr.indexOf(i) == -1){
                  cost2[i+'_between'] = parseFloat(cost2[i]) - parseFloat(cost1[i])
                }
              }
            }
          }
          this.tableData = [cost1,cost2]
        }
          // console.log('this.tableData',this.tableData);
        setTimeout(() => {
          this.loading = false
        }, 250)	
      })			
    },  
    fixedColumn(item){
      if(this.listQuery.group){
        if(this.listQuery.group.indexOf(item.prop) != -1){
          return true
        }
      }
      return false
    },    
    formatTdValue(col,item){
      if(col=='start_time'){
        return item.start_time + ' ~ '+ item.end_time
      }else{
        return getSpecialName(col, item[col])
      }
    },   
    checkListChange(){
      // setactiveRatioList(this.checkedList)
    },    
    handleFilter(listQuery, isTrue){
      this.currentPage = 1
      this.listQuery = {...listQuery}
      if(this.listQuery.event_id){
        if(!isTrue){
          this.listData()
        }
      }else{
        this.$message.warning('请选择对比活动')
      }
    },
    // ===== 导出数据 start =====
    handleDownload(data) {
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
        author_name: data.author_name
      }
      let tremPraam = addTremParams(data)
      params = Object.assign(params, tremPraam)
      params.download_field = this.checkedList.join(',') 
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = '关键词统计.csv'   
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
        // this.loading = false
        this.$message.warning('导出失败！')
      })  
    },
    getEchartData(filter){
      this.listQuery = filter
      this.listData(true)
    }, 
    // ===== 导出数据 end =====
    handleShowRow(isShowRow){
      this.isShowRow = isShowRow
    },
    handleShowEcharts(){ 
      if(this.tableData.length){
        this.isShowSelect = true
      }else{
        this.$message.warning('查询数据后方可绘图')
      }
    },  
    closeFn(){
      this.isShowSelect = false
    },
    // 设置table分页条数
    handleSizeChange(val){
      localStorage.setItem('book_cost_pagecount', val)
      this.currentPage = 1
      this.pageCount = val
			this.loading = true
			this.listData()
			// this.loading = false
    },
    // 切换table分页
		handleCurrentChange(val) {
			this.currentPage = val
			this.loading = true
			this.listData()
			// this.loading = false
    },
    sortChange(data) {    
      this.$nextTick(()=>{
        const { prop, order } = data
        let orders = ''
        if (order === 'ascending') {
          orders = 'asc'
        }else if(order === 'descending'){
          orders = 'desc'
        }else if(prop == null){
          this.listQuery.order = '' 
          this.currentPage = 1
          this.listData()    
          return false
        }
        this.listQuery.order = prop + ' ' + orders
        this.currentPage = 1
        this.listData()
      })      
    },
    handleRenderHeader(h, { column, $index },item){
      return h(
        'div',{
          style: 'padding: 0;margin: 0;text-align: left;white-space:normal; word-break:break-all;line-height: 1;position: relative;top: 3px;'
        },
        [ 
          h('span', column.label),
          h('el-popover', 
            { props: { placement: 'top', width: '200',trigger: 'hover', content: item.placeholder?item.placeholder:column.label}},
            [
              h('span', { slot: 'reference',class:'font-normal'},[
                  h('i', {class:'el-icon-question',style: 'color:#409eff;margin-left:5px;font-size:15px;'}),
              ])
            ])
        ]
      )
    },   
	}
}
</script>

<style lang="scss" scoped>
.book-cost-wrap{
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
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
  .origin_table{
    /deep/ .ratio_table{
      .bet_value{
        position: absolute;
        top: -10px;
        margin-left: -12px;
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
    /deep/ tr:nth-child(even){
      .coment_cell{
        display: none;
      }
    }
    /deep/ tr:nth-child(odd){
      td{
        border-bottom: none;
        .coment_cell{
          position: absolute;
          top: 36px;
          width: 100%;
          text-align: left;
          padding-left: 10px;
          z-index: 99;
        }
      }
    }
  }
  
  // /deep/ .el-table tr:nth-child(odd) td{
  //   border-bottom: none;
  //   .coment_cell{
  //     display: none;
  //   }
  //   .cell .cell_value{
  //     position: relative;
  //     top: 5px;
  //   }
  // }
}
</style>
