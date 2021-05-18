<template>
  <div class="app-container user-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload"
    @handleShowRow="handleShowRow" @handleShowEcharts="handleShowEcharts" @handleSaveEcharts="handleSaveEcharts" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.dayMonthLife" :groupListData="groupListData"></filter-inputs>
    <!-- 显示隐藏列 -->
    <!-- <div v-show="isShowRow" class="checked-show-row-list">
      <el-checkbox-group 
        v-model="checkedList"
        @change="checkListChange">
        <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>     -->
    <div class="static_box">
      <div class="static_item">
        <div class="static_num">{{otherData.day_keep || '--'}}</div>
        <div class="static_word">次日留存</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.week_keep || '--'}}</div>
        <div class="static_word">周留存</div>
      </div>
      <div class="static_item">
        <div class="static_num">{{otherData.month_keep || '--'}}</div>
        <div class="static_word">月留存</div>
      </div>
    </div>
    <el-dialog
    title="请选择你想要显示的列进行勾选"
    :modal="false"
    top="5vh"
    :visible.sync="isShowRow"
    width="30%">
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
    <div class="main-table">    
      <el-table
        class="border-top-20"
        v-loading="loading"
        :data="tableData"
        @sort-change="sortChange"       
        style="width: 100%">
        <template v-for="(item) in tableColumn">
          <!-- 正常表单列 -->
          <!-- && show_field.indexOf(item.prop) != -1 -->
          <el-table-column
            v-bind:key="item.prop"
            v-if="noRepeatSum[item.prop] && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            :render-header="handleRenderHeader"
            :sortable="sortSum[item.prop] ? 'custom' : false"
            align="center">
            <template slot-scope="props">
              {{props.row[item.prop] != null ? props.row[item.prop] : '~' }}
            </template>
          </el-table-column>
          <!-- 特殊处理 -->       
          <el-table-column width='100' align="center" label="平台" :prop="item.prop" v-if="item.prop === 'platform' && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1" v-bind:key="item.label">
            <template slot-scope="props">         
              <span v-if="props.row.platform == 0">全平台</span>
              <span v-else-if="props.row.platform == 1000">PC</span>
              <span v-else-if="props.row.platform == 2000">M站</span>
              <span v-else-if="props.row.platform == 3000">安卓</span>
              <span v-else-if="props.row.platform == 4000">苹果</span>
            </template>
          </el-table-column>
          <el-table-column width='100' align="center" label="站点" :prop="item.prop" v-if="item.prop === 'site_id' && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{siteList1[props.row.site_id]}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column width='100' align="center" label="渠道" :prop="item.prop" v-if="item.prop === 'outsite' && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.outsite | outSiteText }}</span>
            </template>
          </el-table-column>          
          <el-table-column width='100' align="center" label="频道" :prop="item.prop" v-if="item.prop === 'section_id' && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.section_id | sectionText }}</span>
            </template>
          </el-table-column>
          <el-table-column width='100' align="center" label="分类" :prop="item.prop" v-if="item.prop === 'class_id' && checkedSum[item.prop] && show_field.indexOf(item.prop) != -1" v-bind:key="item.label">
            <template slot-scope="props">            
              <span >{{ props.row.class_id | classText }}</span>
            </template>
          </el-table-column> -->
        </template>
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
import { getList,getGather } from '@/api/extend/lifeuser'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setLifeUserList, getLifeUserList, removeLifeUserList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'DayMonthLife',
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
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
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
created() {
    let pageCount = localStorage.getItem('extend_day_month_pagecount')
    console.log('tableColumn',this.tableColumn);
    console.log('pageTableConfig.dayMonthLife',pageTableConfig.dayMonthLife.checkedSum);
    
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    // removeBookList()
    // this.listData()
    // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏
    for(let i in this.tableColumn){
      if(pageTableConfig.dayMonthLife.checkedSum[this.tableColumn[i].prop]){
        this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
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

    console.log('this.defaultCheckedList',this.defaultCheckedList);
    
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
        this.groupListData = res.data.group_list ? [...res.data.group_list]	: []

        console.log('this.show_field',this.show_field);
        
        this.total_nums = res.data.total_nums 	  
        setTimeout(() => {
          this.loading = false
        }, 250)	
      }).catch(err => {
        this.loading = false
      })   
      getGather(newParams).then((otherData)=>{
        this.otherData = otherData.data
      })
    },      
    isChecked(){
      this.tableColumn.forEach( (item, index) => {
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
      const params = {
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
        user_type: data.user_type,
        user_timeline: data.user_timeline,
        searches_user: data.searches_user,
        searches_book: data.searches_book,
        outsite: data.outsite,
        section_id: data.section_id,
        class_id: data.class_id,
        author_name: data.author_name
      }  
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = '日活月活列表.csv'   
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

<style lang="scss">
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

}
</style>
