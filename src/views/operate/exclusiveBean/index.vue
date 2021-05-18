<template>
  <div class="app-container book-cost-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload" @handleShowRow="handleShowRow" :defaultSite="500"
    @handleShowEcharts="handleShowEcharts" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.exclusBean"
    :groupListData="groupListData"
    ></filter-inputs>
    <!-- 显示隐藏列 -->
    <!-- <div v-show="isShowRow" class="checked-show-row-list">
      <el-checkbox-group 
        v-model="checkedList"
        @change="checkListChange">
        <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>     -->
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
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            :render-header="(h, obj)=>handleRenderHeader(h,obj,item)"
            :formatter="formatTdValue"
            :sortable="sortSum[item.prop] ? 'custom' : false"
            align="center">
          </el-table-column>

          <!-- <el-table-column
            v-bind:key="item.prop"
            v-if="noRepeatSum[item.prop] && checkedSum[item.prop] && item.prop != 'event_status'"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            :render-header="(h, obj)=>handleRenderHeader(h,obj,item)"
            :sortable="sortSum[item.prop] ? 'custom' : false"
            align="center">
            <template slot-scope="props">
              {{props.row[item.prop] != null ? props.row[item.prop] : '~' }}
            </template>
          </el-table-column>
          

          <el-table-column width='100' align="center" label="平台" :prop="item.prop" v-if="item.prop === 'platform' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span v-if="props.row.platform == 0">全平台</span>
              <span v-else-if="props.row.platform == 1000">PC</span>
              <span v-else-if="props.row.platform == 2000">M站</span>
              <span v-else-if="props.row.platform == 3000">安卓</span>
              <span v-else-if="props.row.platform == 4000">苹果</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column width='100' align="center" label="站点" :prop="item.prop" v-if="item.prop === 'site_id' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{siteList1[props.row.site_id] ? siteList1[props.row.site_id] : '~' }}</span>
            </template>
          </el-table-column>   
          <el-table-column width='100' align="center" label="渠道" :prop="item.prop" v-if="item.prop === 'outsite' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.outsite | outSiteText }}</span>
            </template>
          </el-table-column>          
          <el-table-column width='100' align="center" label="频道" :prop="item.prop" v-if="item.prop === 'section_id' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.section_id | sectionText }}</span>
            </template>
          </el-table-column>
          <el-table-column width='100' align="center" label="状态" :prop="item.prop" v-if="item.prop === 'event_status' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.event_status | filterStatus }}</span>
            </template>
          </el-table-column>

          <el-table-column width='100' align="center" label="分类" :prop="item.prop" v-if="item.prop === 'class_id' && checkedSum[item.prop]" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.class_id | classText }}</span>
            </template>
          </el-table-column>        -->
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
import { getList } from '@/api/operate/exclusiveBean'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setExclusiveBeanList, getExclusiveBeanList, removeExclusiveBeanList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import {getSpecialName} from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

export default {
  name: 'ExclusiveBean',
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
      groupListData: [],
      defaultCheckedList: [],
      checkedList: [],
      book_ids: [], 
      tableData: [],
      allData: [], // 导出数据
      show_field: [], // 本次返回数据所包含的列
      tableColumn: [...tableColumns],
      listQuery: {},	
      new_show_fields:[],
      siteList1: {},  
      authArrData:[],
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.exclusBean.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.exclusBean.checkedSum)),
      sortSum: JSON.parse(JSON.stringify(pageTableConfig.exclusBean.sortSum)),
		}
  },
  filters: {
    outSiteText,
    sectionText,
    classText,
    
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
    filterStatus(val){
      if(val==0){
        return '无效'
      }else if(val==1){
        return '有效'
      }else if(val==4){
        return '删除'
      }
    },
    formatTdValue(row,col,val){
      if(col.property == 'event_status'){
        return this.filterStatus(val)
      }else{
        return getSpecialName(col.property, val)
      }
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
          if(getExclusiveBeanList().length > 0){
            this.checkedList = getExclusiveBeanList()
            this.isChecked()   
          }else{
            this.checkedList.push(this.tableColumn[i].prop) 
          }  
        }  
      }
      if(getExclusiveBeanList().length <= 0){
        hasArr.forEach((r)=>{
          this.$set(this.checkedSum, r, true)
        })
        this.checkedList = this.checkedList.concat(hasArr)
      }
      let checkArr = new Set(this.checkedList)
      this.checkedList = [...checkArr]
      this.defaultCheckedList = this.defaultCheckedList.concat(reteArr)
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
        author_name: this.listQuery.author_name
      }
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => {          
        this.tableData = [...res.data.collection]	
        this.show_field = [...res.data.show_fields]
        this.new_show_fields = res.data.new_show_fields
        if(res.data.new_show_fields && res.data.new_show_fields.length>0){
          this.computeThs(1)
        }else{
          this.computeThs(0)
        }
        // this.groupListData = res.data.group_list ? [...res.data.group_list] : []	       
        this.total_nums = res.data.total	
        setTimeout(() => {
          this.loading = false
        }, 250)	
      })			
    },  
    // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏  
    // getRowList(){
    //   for(let item of this.tableColumn){
    //     if(pageTableConfig.exclusBean.checkedSum[item.prop]){
    //       this.defaultCheckedList.push({prop: item.prop, label: item.label})
    //     }
    //     if(this.checkedSum[item.prop]){
    //       if(getExclusiveBeanList().length > 0){
    //         this.checkedList = getExclusiveBeanList()
    //         this.isChecked()   
    //       }else{
    //         this.checkedList.push(item.prop) 
    //       }  
    //     }  
    //   }
    // },    
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
      setExclusiveBeanList(this.checkedList)
      this.isChecked()   
    },    
    handleFilter(listQuery,isTrue){
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
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = '专属魔豆数据.csv'   
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
    handleRenderHeader(h, { column, $index }, item){
      return h(
        'div',{
          style: 'padding: 0;margin: 0;text-align: left;white-space:normal; word-break:break-all;line-height: 1;position: relative;top: 3px;'
        },
        [ 
          h('span', column.label),
          h('el-popover', 
            { props: { placement: 'top', width: '200',trigger: 'hover', content: item.placeholder?item.placeholder:column.label }},
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
  .check_th_clss {
    /deep/ .el-checkbox{
      width: 110px;
    }
  }
}
</style>
