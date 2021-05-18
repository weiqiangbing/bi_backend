<template>
  <div class="app-container book-cost-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload" @handleShowRow="handleShowRow"
    @handleShowEcharts="handleShowEcharts" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.keyWordStatics"
    :groupListData="groupListData" @getEchartData="getEchartData" :echartDatas="echartDatas"
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
        <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop" v-if="filterAuth(item.prop)">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
    <!-- 主题内容 -->
    <div class="main-table">    
      <el-table
        class="border-top-20"
        v-loading="loading"
        :data="tableData"
        @sort-change="sortChange"       
        style="width: 100%">
        <template v-for="(item) in tableColumn">
          <!-- 正常表单列 -->
        <!-- <template v-show="!item.noRepeat"> -->
          <el-table-column
            v-bind:key="item.prop"
            v-if="checkedSum[item.prop] && filterAuth(item.prop)"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
            :fixed="fixedColumn(item)"
            :render-header="(h, obj)=>handleRenderHeader(h,obj,item)"
            :formatter="formatTdValue"
            :sortable="sortSum[item.prop] ? 'custom' : false"
            align="center">
          </el-table-column>    
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-if="refreshPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageCount"
        :background="true"
        :page-sizes="[10, 20, 50, 100,200]"
        :current-page="currentPage"                       
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_nums">
      </el-pagination>
    </div>
    <!-- 图表弹框 -->
    <chart-line ref="chartLine" :tableData="tableData" :isShowSelect="isShowSelect" :listQuery="listQuery" :checkedList="checkedList" @closeFn="closeFn"></chart-line>
  </div>	
</template>

<script>
import { getList } from '@/api/operate/keyWordStatics'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setKeyWordStaticsList, getKeyWordStaticsList, removeKeyWordStaticsList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import {getSpecialName} from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

export default {
  name: 'KeyWordStatics',
  components: {
    FilterInputs,
    ChartLine,
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
      groupListData: [
        {key:'keyword', value:'关键词'},
        {key:'timeline', value:'日期'},
      ]	,
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
      siteList1: {},  
      authArrData:[],
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.keyWordStatics.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.keyWordStatics.checkedSum)),
      sortSum: JSON.parse(JSON.stringify(pageTableConfig.keyWordStatics.sortSum)),
		}
  },
  filters: {
    outSiteText,
    sectionText,
    classText
  },
	created() {
    let pageCount = localStorage.getItem('book_cost_pagecount')
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
          if(getKeyWordStaticsList().length > 0){
            this.checkedList = getKeyWordStaticsList()
            this.isChecked()   
          }else{
            this.checkedList.push(this.tableColumn[i].prop) 
          }  
        }  
      }
      if(getKeyWordStaticsList().length <= 0){
        hasArr.forEach((r)=>{ 
          this.$set(this.checkedSum, r, true)
        })
        this.checkedList = this.checkedList.concat(hasArr)
      }
      let checkArr = new Set(this.checkedList)
      this.checkedList = [...checkArr]
      this.defaultCheckedList = this.defaultCheckedList.concat(reteArr)
    }, 
    listData(isEch) {		
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
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => {        
        if(!isEch){  
          this.tableData = [...res.data.collection]	
          this.show_field = [...res.data.show_fields]
          this.new_show_fields = res.data.new_show_fields
          if(res.data.new_show_fields && res.data.new_show_fields.length>0){
            this.computeThs(1)
          }else{
            this.computeThs(0)
          }     
          // this.groupListData = [
          //   {key:'keyword', value:'关键词'},
          //   {key:'timeline', value:'日期'},
          // ]	
          this.total_nums = res.data.total	
        }else{
          this.echartDatas = [...res.data.collection]
          this.$nextTick(()=>{
            this.$refs.filterDom.handleShowEcharts()
          })
          if(res.data.total_nums>2500){
            this.$message.warning('还有'+(res.data.total_nums-2500)+'条数据未统计到')
          }
        }
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
    formatTdValue(row,col,val){
      if(col.property=='timeline'){
        if(val && val.indexOf(' ') != -1){
          return val.split(' ')[0]
        }else{
          return val
        }
      }else{
        return getSpecialName(col.property, val)
      }
    },
    // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏  
    getRowList(){
      for(let item of this.tableColumn){
        if(pageTableConfig.keyWordStatics.checkedSum[item.prop]){
          this.defaultCheckedList.push({prop: item.prop, label: item.label})
        }
        if(this.checkedSum[item.prop]){
          if(getKeyWordStaticsList().length > 0){
            this.checkedList = getKeyWordStaticsList()
            this.isChecked()   
          }else{
            this.checkedList.push(item.prop) 
          }  
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
      setKeyWordStaticsList(this.checkedList)
      this.isChecked()   
    },    
    handleFilter(listQuery, isTrue){
      this.currentPage = 1
      this.listQuery = {...listQuery}
      if(!isTrue){
        this.listData()
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

<style lang="scss">
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
}
</style>
