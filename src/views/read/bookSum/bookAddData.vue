<template>
  <div class="app-container user-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload"
    @handleShowRow="handleShowRow" @handleShowEcharts="handleShowEcharts" @handleSaveEcharts="handleSaveEcharts" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.newDadData" :groupListData="groupListData" @getEchartData="getEchartData" :echartDatas="echartDatas" :originTime="originTime"></filter-inputs>
    <!-- 显示隐藏列 -->
    <el-dialog
    title="请选择你想要显示的列进行勾选"
    class="check_th_clss"
    :modal="false"
    top="5vh"
    :visible.sync="isShowRow"
    width="620px">
    <!-- :before-close="handleClose" -->
    <el-checkbox-group 
      v-model="checkedList"
      @change="checkListChange">
      <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
    </el-checkbox-group>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="isShowRow = false">取 消</el-button>
      <el-button type="primary" @click="isShowRow = false">确 定</el-button>
    </span> -->
  </el-dialog>
    <!-- 主题内容 -->
    <div class="table_nopad" v-loading="loading">    
      <el-table
        :row-class-name="tableRowClassName"
        border
        v-if="!groupChaged"
        :data="tableData"
        @sort-change="sortChange"       
        style="width: 100%">
          <!-- 正常表单列 -->
          <el-table-column prop="reg_date" label="时间" :fixed="true" width="96" align="center"></el-table-column>
          <el-table-column prop="site_id" label="站点" v-if="show_field.indexOf('site_id') != -1" :fixed="true" width="80" :formatter="formatTdValue" align="center"></el-table-column>
          <el-table-column prop="platform" label="平台" v-if="show_field.indexOf('platform') != -1" :fixed="true" width="70" :formatter="formatTdValue" align="center"></el-table-column>
          <el-table-column prop="reg_user" label="新增用户" width="100" align="center"></el-table-column>
          <el-table-column prop="total_order_money" label="累计充值" width="100" align="center"></el-table-column>
          <el-table-column prop="daa_cost" label="成本" width="100" align="center"></el-table-column>
          <el-table-column prop="recovery_day" label="回本天数 / 预计回本天数" width="110" align="center"></el-table-column>
          <el-table-column prop="last_ratio" label="累计回本率" width="110" align="center"></el-table-column>

          <el-table-column v-for="(val, index) in monthDays" :prop="'field_'+val" :key="index" :label="'第'+val+'天充值'" width="100"  align="center">
            <template slot-scope="props">
              <div class="month_td" v-if="props.row['field_'+val]">
                <p>{{getMonthTd(props.row['field_'+val],'order_money')}}</p>
                <p>回{{getMonthTd(props.row['field_'+val],'total_ratio')}}</p>
                <p>增{{getMonthTd(props.row['field_'+val],'now_ratio')}}</p>
              </div>
              <div v-else>~</div>
            </template>
          </el-table-column>

          <el-table-column v-for="index in [30,60,90,120,150]" :prop="'field_show_'+index" :label="'第'+index+'-'+(index+30)+'天'" :key="index" width="100" align="center">
            <template slot-scope="props">
              <div class="month_td" v-if="props.row['field_show_'+(index)]">
                <p>{{getMonthTd(props.row['field_show_'+(index)],'order_money')}}</p>
                <p>回{{getMonthTd(props.row['field_show_'+(index)],'total_ratio')}}</p>
                <p>增{{getMonthTd(props.row['field_show_'+(index)],'now_ratio')}}</p>
              </div>
              <div v-else>~</div>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
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
    </div>
    <!-- 图表弹框 -->
    <chart-line ref="chartLine" :tableData="tableData" :isShowSelect="isShowSelect" :listQuery="listQuery" :checkedList="checkedList" :isShowEchart="isShowEchart" @closeFn="closeFn"></chart-line>
  </div>  
</template>

<script>
import { getAddData } from '@/api/extend/lifeuser'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams, filterObjToArr, numToFixedTow } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setLifeUserList, getLifeUserList, removeLifeUserList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { getSpecialName } from '@/utils/assist'

export default {
  name: 'BookAddData',
  components: {
    FilterInputs,
    ChartLine
  },
	data() {
		return {  
      loading: false,	
      groupChaged: false,
      oldGroups:'',
      isShowRow: false,
      isShowSelect: false,
      isShowEchart: false,
      totalInfos:{},
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
      echartDatas:[],
      otherData:{},
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
      originTime: {
        time_unit: '-month,-month',
        start_time: 1,
        end_time: 0,
      },
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.dayMonthLife.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.dayMonthLife.checkedSum)),
      // checkedSum: Object.assign({}, pageTableConfig.dayMonthLife.checkedSum),
      sortSum: JSON.parse(JSON.stringify(pageTableConfig.dayMonthLife.sortSum)),
		}
  },
  filters: {
    outSiteText,
    sectionText,
    classText
  },
  computed:{
    monthDays(){
      let arr = []
      for (let i = 0; i < 30; i++) {
        arr.push(i+1)        
      }
      return arr
    }
  },
  created() {
    let pageCount = localStorage.getItem('extend_day_month_pagecount')
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    // removeBookList()
    // this.listData()
    // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏
    // for(let i in this.tableColumn){
    //   if(pageTableConfig.dayMonthLife.checkedSum[this.tableColumn[i].prop]){
    //     this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
    //   }
    //   if(this.checkedSum[this.tableColumn[i].prop]){
    //     if(getLifeUserList().length > 0){
    //       this.checkedList = getLifeUserList()
    //       this.isChecked()   
    //     }else{
    //       this.checkedList.push(this.tableColumn[i].prop) 
    //     }  
    //   }  
    // }
    // console.log('this.defaultCheckedList',this.defaultCheckedList);
    
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
    fixedColumn(item){
      if(this.listQuery.group){
        if(this.listQuery.group.indexOf(item.prop) != -1){
          return true
        }
      }
      return false
    }, 
    tableRowClassName({row, rowIndex}) {
      if (row.is_recovery == 1) {
        return 'success-row';
      }
      return 'warning-row'
    },
    getMonthTd(row, key){
      if(row){
        return row[key]
      }
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
        if(this.checkedSum[this.tableColumn[i].prop]){
          if(hasArr.indexOf(this.tableColumn[i].prop)==-1){
            this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
          }
        }
        if(this.checkedSum[this.tableColumn[i].prop]){
          if(getLifeUserList().length > 0){
            this.checkedList = getLifeUserList()
            this.isChecked()   
          }else{
            this.checkedList.push(this.tableColumn[i].prop) 
          }  
        }  
      }
      if(getLifeUserList().length <= 0){
        hasArr.forEach((r)=>{
          this.$set(this.checkedSum, r, true)
        })
        this.checkedList = this.checkedList.concat(hasArr)
      }
      this.defaultCheckedList = this.defaultCheckedList.concat(reteArr)
    },     
    listData(isEch) {		
      return
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
        author_name: this.listQuery.author_name
      }
      if(isEch){
        params.count = 2500
        params.order = ''
      }
      if(this.listQuery.group != this.oldGroups){
        this.groupChaged = true
        this.$nextTick(()=>{
          this.groupChaged = false
        })
      }
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
        getAddData(newParams).then(res => {
          if(!isEch){
            this.oldGroups = this.listQuery.group
            this.tableData = [...res.data.collection]
            this.show_field = filterObjToArr(res.data.show_fields)
            this.groupListData = res.data.group_list ? [...res.data.group_list]	: []
            this.total_nums = res.data.total_nums
            this.totalInfos = res.data.total_info
            this.new_show_fields = res.data.new_show_fields
            // if(res.data.new_show_fields && res.data.new_show_fields.length>0){
            //   this.computeThs(1)
            // }else{
            //   this.computeThs(0)
            // }
          }else{
            this.echartDatas = [...res.data.collection]
            this.$nextTick(()=>{
              this.$refs.filterDom.handleShowEcharts()
            })
            if(res.data.total_nums>2500){
              this.$message.warning('还有'+(res.data.total_nums-2500)+'条数据未统计到')
            }
          }        
          // console.log('this.show_field',this.show_field);
          setTimeout(() => {
            this.loading = false
          }, 250)	
        }).catch(err => {
          this.loading = false
        })   
    },      
    isChecked(){
      this.tableColumn.forEach((item, index) => {
        if(this.checkedList.indexOf(item.prop) == -1){
          this.checkedSum[item.prop] = false
        }else{        
          this.checkedSum[item.prop] = true         
        }
      })
    },
    checkListChange(){
      setLifeUserList(this.checkedList)
      this.isChecked()   
    },  
    handleFilter(listQuery){
      this.currentPage = 1
      this.listQuery = {...listQuery}
      this.listData()
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
        author_name: data.author_name
      }  
      let tremPraam = addTremParams(data)
      params = Object.assign(params, tremPraam)
      params.download_field = this.checkedList.join(',') 
      const newParams = this.filterNullVal(params)
      getAddData(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = '运营数据列表.csv'   
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
        this.$refs.filterDom.downloadLoading = false
        this.$message.warning('导出失败！')
      })  
    },
    formatTdValue(row,col,val){
      if(col.property == 'daa_pay' || col.property == 'daa_cost'){
        return numToFixedTow(val)
      }else{
        return getSpecialName(col.property, val)
      }
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
    getEchartData(filter){
        this.listQuery = filter
        this.listData(true)
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
      localStorage.setItem('extend_day_month_pagecount', val)
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
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总汇';
            return;
          }
          for(let i in this.totalInfos){
            if(column.property==i && i != 'site_id' && i != 'platform' && i != 'order_date'){
              if(this.totalInfos[i] && String(this.totalInfos[i]).indexOf('.') != -1){
                sums[index] = Number(this.totalInfos[i]).toFixed(2)
              }else{
                sums[index] = this.totalInfos[i]
              }
            }
          }
        });
        return sums;
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
    handleRenderHeader(h, { column, $index }){
      return h(
        'div',{
          style: 'padding: 0;margin: 0;text-align: left;white-space:normal; word-break:break-all;line-height: 1;position: relative;top: 3px;'
        },
        [ 
          h('span', column.label),
          h('el-popover', 
            { props: { placement: 'top', width: '200',trigger: 'hover', content: column.label }},
            [
              h('span', { slot: 'reference',class:'font-normal'},[
                  h('i', {class:'el-icon-question',style: 'color:#409eff;margin-left:5px;font-size:15px;'}),
              ])
            ]
          )
        ]
      )
    },
    // 去章节列表页
    handleChapterList(row){
      this.$router.push({
        name: 'Chapter',
        query: {
          book_id: row.book_id
        }
      })
    },

	}
}
</script>

<style lang="scss" scoped>
.user-wrap{
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
  .month_td{
    padding: 0;
    margin: -4px 0;
    p{
      text-align: left;
      line-height: 3px;
    }
  }
  .table_nopad{
    margin-top: 20px;
    /deep/ tr td{
      padding: 0;
    }
    /deep/ .success-row td{
      background: #f0f9eb;
    }
    // /deep/ .warning-row td{
    //   background: oldlace;
    // }
   /deep/ .el-table__fixed{
    tr{
      background-color: #fafafa;
      th{
        background-color: #fafafa;
      }
    }
    }
  }
}
</style>
