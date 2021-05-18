<template>
  <div class="app-container user-wrap">	 

    <!-- 筛选 -->
    <div class="filter-container">
      <el-row style="overflow: hidden;float:left;">
        <el-select 
          class="mg-btm-20"
          style="width: 140px;" 
          v-model="listQuery.site_id" 
          filterable 
          placeholder="全部站点" 
          @change="handleSite">
          <el-option
            v-for="item in siteList"
            :key="item.site_id"
            :label="item.site_name"
            :value="item.site_id"
            >
          </el-option>
        </el-select>
        <el-select 
        class="mg-btm-20"
        style="width: 140px;" 
        clearable  
        v-model="listQuery.platform" 
        filterable 
        placeholder="全部平台" 
        @change="handlePlatform">
          <el-option
            v-for="item in optionsConfig.platformData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>

        <el-select 
        class="mg-btm-20"
        style="width: 140px;" 
        @change="handlePlatform"
        clearable  
        v-model="listQuery.section_type" 
        filterable 
        placeholder="全部频道">
          <el-option
            v-for="item in sectionList"
            :key="item.section_id"
            :label="item.section_name"
            :value="item.section_id"
            >
          </el-option>
        </el-select>

        <el-select 
          class="mg-btm-20"
          style="width: 140px;" 
          clearable  
          v-model="listQuery.tj_id" 
          filterable 
          placeholder="全部推荐位">
            <el-option
              v-for="item in recommData"
              :key="item.tj_id"
              :label="item.tj_name"
              :value="item.tj_id"
              >
            </el-option>
        </el-select>

        <el-input type="text" style="width: 140px;"  v-model="listQuery.book_id" placeholder="书籍id">

        </el-input>

        <el-date-picker
          style="width: 340px;"
          value-format="yyyy-MM-dd"
          v-model="listQuery.time_area"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

        <el-button
          class="margin-rihgt-10 padding-btn-10" 
          type="success" icon="el-icon-search" 
          @click="handleFilter">
          查询
        </el-button>
        <el-button 
          style="margin-left: 0;" 
          class="padding-btn-10" 
          icon="el-icon-refresh" 
          @click="handleReset">
          重置
        </el-button> 
        <el-button 
          style="margin-left: 0;" 
          class="padding-btn-10" 
          :loading="downloadLoading" 
          type="primary" 
          icon="el-icon-download"
          @click="handleDownload">
          导出
        </el-button>
      </el-row>
    </div>
    <!-- 主题内容 -->
    <div class="main-table">    
      <el-table
        :row-class-name="rowTableClss"
        class="cus_table"
        v-loading="loading"
        :data="tableData">
        <template v-for="(item) in tableThs">
          <el-table-column
            v-if="!item.isTree"
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
            v-else
            v-bind:key="item.prop"
            :render-header="(h, obj)=>handleRenderHeader(h,obj,item)"
            :prop="item.prop"
            :width="item.width?item.width:'auto'"
            :label="item.label"
            :show-overflow-tooltip="true"
            align="center">
              <template slot-scope="scope">
                <!-- {{ite}} -->
                <div v-for="(ite,ind) in scope.row['day_stats']" :key="ind" class="cell_div">
                  <p v-if="item.prop=='timeline'">{{ite.timeline}}</p>
                  <p v-if="item.prop=='cost_user'">{{ite.cost_user}}</p>
                  <p v-if="item.prop=='cost_total'">{{ite.cost_total}}</p>
                  <p v-if="item.prop=='book_income'">{{ite.book_income}}</p>
                  <p v-if="item.prop=='cost_chapters'">{{ite.cost_chapters}}</p>
                  <p v-if="item.prop=='book_average_user_cost'">{{ite.book_average_user_cost}}</p>
                </div>
                <!-- <div class="tree_box" :key="ite.timeline">
                   
                </div> -->
                
              </template>
          </el-table-column>
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
        :total="total_nums">
      </el-pagination>
    </div>
  </div>  
</template>

<script>
import { optionsConfig } from '@/utils/optionsConfig'
import { getSiteList,getSectionList } from '@/api/public/index'
import { getListData, getRecomData } from '@/api/extend/recomm'
import { getCheckedZh, formatJson, addTremParams } from '@/utils/common'
import { tableColumns } from '@/utils/tableColumns'
import { outSiteText, sectionText, classText } from '@/filters/index'
// import {getSpecialName} from '@/utils/assist'
import {
  filterSite,
  filterPlatform,
  filterSection,
} from "@/utils/filterWord";

export default {
  name: 'AppData',
  components: {
    
  },
	data() {
		return {  
      loading: false,	
      isShowRow: false,
      isShowSelect: false,
      isShowEchart: false,
      siteName:'',
      downloadLoading: false, // 导出状态
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
      listQuery: {
        site_id:'',
        time_area:[]
      },
      defaultQuery:{},
      siteList: {},
      otherData:{},
      totalInfo:{},
      totalArrs:[],
      new_show_fields:[],
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
      authArrData:[],
      optionsConfig: Object.assign({}, optionsConfig),
      recommData:[],
      sectionList:[],
      tableThs:[
        {label: '站点',prop:'tj_site',width:'100', isTree:false},
        // {label: '平台',prop:'tj_platform',width:'100', isTree:false},
        {label: '推荐位名称',prop:'tj_name',width:'150', isTree:false},
        {label: '推荐时间段',prop:'batch_time_period',width:'180', isTree:false},
        {label: '书籍ID',prop:'book_id',width:'100', isTree:false},
        {label: '书籍名称',prop:'book_name',width:'150', isTree:false},
        {label: '频道',prop:'section_type',width:'90', isTree:false},
        {label: '时间',prop:'timeline', isTree:true, width:'110',},
        {label: '订阅人数',placeholder:"币+券", width:'90',prop:'cost_user', isTree:true},
        {label: '订阅数',placeholder:"书币+券数",prop:'cost_total', isTree:true},
        {label: '订阅金额',placeholder:"书币换算人民币",width:'90',prop:'book_income', isTree:true},
        {label: '订阅章节数',placeholder:"币+券",prop:'cost_chapters', isTree:true},
        {label: '均订',placeholder:"人均花费金额",prop:'book_average_user_cost', isTree:true},
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
    if(pageCount){
      this.pageCount = Number(pageCount)
    }  
    let nowDate1 = new Date()
    let nowDate2 = new Date(nowDate1.getTime() - 24*60*60*1000)
    let date1 = this.getDateStr(nowDate1)
    let date2 = this.getDateStr(nowDate2)
    this.listQuery.time_area = [date2, date1]
    this.getSiteData()
  },
  mounted() {
    
  },
  computed:{
    
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
    handleSite(){
      this.getRecommData()
    },
    getSummaries(param) {
        // const { columns, data } = param;
        // const sums = [];
        // columns.forEach((column, index) => {
        //   if (index === 5) {
        //     sums[index] = '总汇';
        //     return;
        //   }
        //   // if(column.property=='cost_user'){
        //   //   sums[index] = this.totalInfo['cost_user']
        //   // }else if(column.property=='cost_total'){
        //   //   sums[index] = this.totalInfo['cost_total']
        //   // }else if(column.property=='book_income'){
        //   //   sums[index] = this.totalInfo['book_income']
        //   // }else if(column.property=='cost_chapters'){
        //   //   sums[index] = this.totalInfo['cost_chapters']
        //   // }else if(column.property=='book_average_user_cost'){
        //   //   sums[index] = this.totalInfo['book_average_user_cost']
        //   // }
        // });
        // return sums;
      },
    getDateStr(date){
      let local = date.toLocaleDateString()
      let localArr = local.split('/')
      let newArr = localArr.map((re)=>{
        if(re<10){
          re='0'+re
        }
        return re
      })
      return newArr.join('-')
    },
    handlePlatform(){
      this.getRecommData()
    },
    getSiteData() {	
      getSiteList().then(res => {         
        this.siteList = res.data
        this.listQuery.site_id = this.siteList[0].site_id
        this.defaultQuery = JSON.parse(JSON.stringify(this.listQuery))
        console.log('this.defaultQuery',this.defaultQuery);
        this.getRecommData()
        this.listData()
      })
      getSectionList().then(res => {
        this.sectionList = [...res.data]
      })	
    },
    async getRecommData(){
      let params = {
        site_id: this.listQuery.site_id,
        platform: this.listQuery.platform,
        section_type: this.listQuery.section_type,
      }
      let res = await getRecomData(params)
      this.recommData = res.data
    },
    listData() {		
      const currentPage = this.currentPage - 1
      this.loading = true
      let start_time = ''
      let end_time = ''
      if(this.listQuery.time_area && this.listQuery.time_area.length>1){
        start_time= this.listQuery.time_area[0]
        end_time= this.listQuery.time_area[1]
      }
      let params = {
        page: currentPage,
        count: this.pageCount,
        batch_time_start: start_time,
        batch_time_end: end_time,
        site_id: this.listQuery.site_id,
        platform: this.listQuery.platform,
        section_type: this.listQuery.section_type,
        book_id: this.listQuery.book_id,
        tj_id: this.listQuery.tj_id,
      }
      // const newParams = this.filterNullVal(params)
      getListData(params).then(res => {
        console.log(222,res);
          this.tableData = res.data.collection
          // this.totalInfo = res.data.total_Info
          this.total_nums = res.data.total_nums
          // this.totalArrs = res.data.siteTotalInfo
          // this.new_show_fields = res.data.new_show_fields

        setTimeout(() => {
          this.loading = false
        }, 250)	
      }).catch(err => {
        this.loading = false
      })  
    },     
    
    filterPlat(val){
      if(val=='APP'){
        return 'APP'
      }else{
        return filterPlatform(val)
      }
    },
    formatTdValue(row,col,val){
      if(col.property=='tj_site'){
        return filterSite(val)
      }else if(col.property=='tj_platform'){
        return filterPlatform(val)
      }else if(col.property=='section_type'){
        return filterSection(val)
      }else{
        return val
      }
    },  
    handleFilter(){
      this.currentPage = 1
      this.listData()
    },
    handleReset(){
      this.listQuery = JSON.parse(JSON.stringify(this.defaultQuery))
    },
    rowTableClss({row}){
      if(row.sum==1){
        return 'sum_class'
      }
    },
    // ===== 导出数据 start =====
    handleDownload() {
      this.downloadLoading = true
      let start_time = ''
      let end_time = ''
      if(this.listQuery.time_area && this.listQuery.time_area.length>1){
        start_time= this.listQuery.time_area[0]
        end_time= this.listQuery.time_area[1]
      }
      let params = {
        page: 0,
        count: -1,
        batch_time_start: start_time,
        batch_time_end: end_time,
        site_id: this.listQuery.site_id,
        platform: this.listQuery.platform,
        section_type: this.listQuery.section_type,
        book_id: this.listQuery.book_id,
        tj_id: this.listQuery.tj_id,
      }
      getListData(params).then(res => { 
        const blob = new Blob([res])     
        const fileName = '推荐位统计数据.csv'   
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
          style: 'width: 100%;padding: 0;margin: 0;text-align: left;white-space:normal; word-break:break-all;line-height: 16px;'
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
    padding-top: 15px;
    // overflow-x: auto;
    // overflow: auto;
    /deep/ .sum_class td{
      background-color: #f5f7fa !important;
    }
    /deep/ tr{
      // &:nth-child(1){
      //   background-color: #ddd;
      // }
      td{
        padding: 0;
        height: 40px;
        .cell{
            text-align: left;
            padding: 0;
            text-indent: 10px;
            .cell_div{
              height: 40px;
              line-height: 40px;
              text-align: center;
              border-top: 1px solid #EBEEF5;
              &:nth-child(1){
                border-top: none;
              }
            }
        }
        p{
          padding: 0;
          margin: 0;
          
        }
      }
    }
    
  }
}

</style>
