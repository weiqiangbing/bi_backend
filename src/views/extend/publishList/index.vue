<template>
  <div class="app-container user-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload"
    @handleShowRow="handleShowRow" @handleShowEcharts="handleShowEcharts" @handleSaveEcharts="handleSaveEcharts" :defaultSite="500" :tableData="tableData" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.publishList" :groupListData="groupListData"></filter-inputs>

    <el-dialog
    title="请选择你想要显示的列进行勾选"
    class="check_th_clss"
    :modal="false"
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
        <el-table-column prop="site_code" label="站点" v-if="checkedSum['site_code']" :formatter="formatSite"></el-table-column>
        <template v-for="(item) in tableColumn">
          <!-- 正常表单列 -->          
          <el-table-column
            v-bind:key="item.prop"
            v-if="checkedSum[item.prop] && item.prop != 'site_code' && filterAuth(item.prop)"
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
import { getList } from '@/api/extend/publishList'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson,addTremParams, filterObjToArr } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { setPublishList, getPulishList, removePublishList} from '@/utils/auth'
import { outSiteText, sectionText, classText } from '@/filters/index'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import {getSpecialName} from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

export default {
  name: 'PublishList',
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
      new_show_fields:[],
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
      authArrData: [],
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
      noRepeatSum: JSON.parse(JSON.stringify(pageTableConfig.publishList.noRepeatSum)),
      checkedSum: JSON.parse(JSON.stringify(pageTableConfig.publishList.checkedSum)),
      // checkedSum: Object.assign({}, pageTableConfig.publishList.checkedSum),
      sortSum: JSON.parse(JSON.stringify(pageTableConfig.publishList.sortSum)),
		}
  },
  filters: { 
    outSiteText,
    sectionText,
    classText
  },
created() {
    let pageCount = localStorage.getItem('extend_appdata_pagecount')
    console.log('tableColumn',this.tableColumn);
    console.log('pageTableConfig.publishList',pageTableConfig.publishList.checkedSum);
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    // removeBookList()
    // this.listData()
    // 获取隐藏列默认值 通过缓存动态记录 改变 列的显示隐藏
    // for(let i in this.tableColumn){
    //   if(pageTableConfig.publishList.checkedSum[this.tableColumn[i].prop]){
    //       console.log('1111', this.tableColumn[i].label);
          
    //     this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
    //   }
    //   if(this.checkedSum[this.tableColumn[i].prop]){
    //     if(getPulishList().length > 0){
    //       this.checkedList = getPulishList()
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
          if(getPulishList().length > 0){
            this.checkedList = getPulishList()
            this.isChecked()   
          }else{
            this.checkedList.push(this.tableColumn[i].prop) 
          }  
        }  
      }
      if(getPulishList().length <= 0){
        hasArr.forEach((r)=>{
          this.$set(this.checkedSum, r, true)
        })
        this.checkedList = this.checkedList.concat(hasArr)
      }
      let checkArr = new Set(this.checkedList)
      this.checkedList = [...checkArr]
      this.defaultCheckedList = this.defaultCheckedList.concat(reteArr)
      // console.log('this.defaultCheckedList',this.defaultCheckedList);
    },   
    formatSite(row,col,val){
      switch (val) {
        case 'hrxs':
          return '火热小说'
        case 'hrmh':
          return '火热漫画'
        case 'tsyqw':
          return '特色言情'
        case 'chk':
          return '超好看'
        case 'mhm':
          return '漫画猫'
        case 'xsdq':
          return '小说大全'
        case 'lmxs':
          return '龙猫小说'
        case 'cqsc':
          return '传奇书城'
        case 'sxyda':
          return '水仙阅读'
        case 'ylsy':
          return '悦路书院'
        default: 
          return val
      }
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
          // console.log(res);
          this.tableData = res.data.collection?[...res.data.collection] : []
          console.log('this.tableData',this.tableData);
          // this.show_field = filterObjToArr(res.data.show_fields)
          this.show_field = ['site_code','book_id','app_channel','status','add_time','complete_time','send_time','send_type','send_model','topic','book_prev_five_const',
          'book_prev_five_premium','book_prev_five_num','book_next_five_const','book_next_five_premium','book_next_five_num','book_prev_five_pv','book_prev_five_uv',
          'book_next_five_pv','book_next_five_uv']
          // this.groupListData = res.data.group_list ? [...res.data.group_list]	: []
          // this.new_show_fields = res.data.new_show_fields
          this.new_show_fields = []
          // console.log(1111,res.data);
          if(!Array.isArray(res.data) && res.data.new_show_fields && res.data.new_show_fields.length>0){
            this.computeThs(1)
          }else{
            this.computeThs(0)
          }
          // console.log(2222,res.data);

          // console.log('this.show_field',this.show_field);
          
          this.total_nums = res.data.total_nums 	  
        setTimeout(() => {
          this.loading = false
        }, 250)	
      }).catch(err => {
        this.loading = false
      })     
      

    },  
    formatTdValue(row,col,val){
      return getSpecialName(col.property, val)
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
      setPublishList(this.checkedList)
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
      let tremPraam = addTremParams(this.listQuery)
      params = Object.assign(params, tremPraam)
      const newParams = this.filterNullVal(params)
      getList(newParams).then(res => { 
        // console.log('res', res)
        const blob = new Blob([res])     
        const fileName = '推送列表.csv'   
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
      localStorage.setItem('extend_appdata_pagecount', val)
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
            { props: { placement: 'top', width: '200',trigger: 'hover', content: item.placeholder?item.placeholder:column.label}},
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
  /deep/ .el-dialog__body{
    padding-top: 0;
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
  /deep/ .el-table .cell.el-tooltip{
    white-space: normal; 
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
