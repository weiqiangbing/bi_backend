<template>
  <div class="app-container user-wrap add_data">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleFilter="handleFilter" @handleDownload="handleDownload"
    @handleShowRow="handleShowRow" @handleShowEcharts="handleShowEcharts" @handleSaveEcharts="handleSaveEcharts" :checkedList="checkedList" :downloadLoading="downloadLoading" :filterConfig="pageConfig.returnModel" :groupListData="groupListData" @getEchartData="getEchartData" :echartDatas="echartDatas" :originTime="originTime"></filter-inputs>
    <div class="link_div">
      <el-button type="normal" icon="el-icon-question">180天数据的模型</el-button>
    </div>
    <!-- 显示隐藏列 -->
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
      <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </el-dialog>
    <div v-loading="loading">
      <el-row class="total_row" :gutter="30">
        <el-col :span="8">
          <div class="total_box">
            <div class="total_num">{{totalInfos.back_day || '--'}}</div>
            <div class="total_title">平均回本周期</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total_box">
            <div class="total_num">{{totalInfos.max_ratio || '--'}}%</div>
            <div class="total_title">第一天回本率</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total_box">
            <div class="total_num">{{totalInfos.main_ratio || '--'}}%</div>
            <div class="total_title">已回本第一天回本率</div>
          </div>
        </el-col>
      </el-row>
      <!-- 主题内容 -->
      <!-- <div class="table_nopad">    
        <el-table
          border
          :data="tableData"   
          style="width: 100%">
            <el-table-column prop="site_id" label="站点" v-if="haveSiteId" :fixed="true" align="center">
              <template slot-scope="props">
                <div>{{formatTdValue('site_id', haveSiteId)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台" v-if="havePlatform" :fixed="true" align="center">
              <template slot-scope="props">
                <div>{{formatTdValue('platform', havePlatform)}}</div>
              </template>
            </el-table-column>
            <el-table-column v-for="(val, index) in monthDays" :prop="'field_'+val" :key="index" :label="'第'+val+'天'" align="center">
              <template slot-scope="props">
                <div class="month_td" v-if="props.row['field_'+val]">
                  <p>{{getMonthTd(props.row['field_'+val],'main_ratio')+'% - '+getMonthTd(props.row['field_'+val],'max_ratio')+'%'}}</p>
                </div>
                <div v-else>~</div>
              </template>
            </el-table-column>
            <el-table-column label="回本周期" prop="back_day"></el-table-column>
        </el-table>
      </div> -->


       <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <!-- <el-table-column prop="site_id" label="站点" width="190" v-if="haveSiteId" :fixed="true" align="center">
          <template slot-scope="props">
            <div>{{formatTdValue('site_id', haveSiteId)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" v-if="havePlatform" :fixed="true" align="center">
          <template slot-scope="props">
            <div>{{formatTdValue('platform', havePlatform)}}</div>
          </template>
        </el-table-column> -->
        <el-table-column
          width="50"
          class-name="extend_cell"
          v-if="filterAuth('field_extend')"
          prop="field_extend"
          label="展开"
        >
        </el-table-column>
        <el-table-column
          prop="field_1"
          v-if="filterAuth('field_1')"
          :formatter="formateNum"
          label="第1天"
        >
        </el-table-column>
        <el-table-column
          prop="field_3"
          v-if="filterAuth('field_3')"
          :formatter="formateNum"
          label="第3天"
        >
        </el-table-column>
        <el-table-column
          prop="field_7"
          v-if="filterAuth('field_7')"
          :formatter="formateNum"
          label="第7天">
        </el-table-column>
        <el-table-column
          prop="field_15"
          v-if="filterAuth('field_15')"
          :formatter="formateNum"
          label="第15天">
        </el-table-column>
        <el-table-column
          prop="backDay"
          v-if="filterAuth('backDay')"
          label-class-name="back_heard"
          class-name="back_day"
          label="回本周期">
        </el-table-column>
      </el-table>
    </div>
  </div>  
</template>

<script>
import { getReturnModelData } from '@/api/extend/lifeuser'
import FilterInputs from '@/components/FilterInputs'
import ChartLine from '@/components/Charts/index'
import { getCheckedZh, formatJson, addTremParams, filterObjToArr, numToFixedTow } from '@/utils/common'
import { pageConfig } from '@/utils/pageConfig'
import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'
import { outSiteText, sectionText, classText } from '@/filters/index'
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { getSpecialName } from '@/utils/assist'
import {getPageAuth} from '@/utils/power'

export default {
  name: 'ReturnModel',
  components: {
    FilterInputs,
    ChartLine
  },
	data() {
		return {  
      loading: false,	
      oldGroups:'',
      isShowRow: false,
      isShowSelect: false,
      isShowEchart: false,
      haveSiteId:'',
      havePlatform:'',
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
      monthDays:[1,3,7,15],
      checkedZh: [], // 当前页面显示列对于的标题
      checkedEn: [], // 当前页面显示列对于的标题
      authArrData:[],
      originTime: {
        time_unit: '-month,-month',
        start_time: 1,
        end_time: 0,
      },
      pageConfig: JSON.parse(JSON.stringify(pageConfig)),
    }
  },
  filters: {
    outSiteText,
    sectionText,
    classText
  },
  computed:{
    
  },
  created() {
    let pageCount = localStorage.getItem('extend_return_model_pagecount')
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
        getReturnModelData(newParams).then(res => {
          // console.log(res);
          if(!isEch){
            // this.oldGroups = this.listQuery.group
            console.log(res.data.collection);
            this.tableData = filterObjToArr(res.data.collection)
            console.log('this.tableData',this.tableData);
            // this.show_field = filterObjToArr(res.data.show_fields)
            // this.groupListData = res.data.group_list ? [...res.data.group_list]	: []
            // this.total_nums = res.data.total_nums
            this.totalInfos = res.data.total_info
            // this.new_show_fields = res.data.new_show_fields
            // console.log('totalInfos',this.totalInfos);
            this.haveSiteId = ''
            this.havePlatform = ''
            if(newParams.site_id){
              this.haveSiteId = newParams.site_id
            }
            if(newParams.platform){
              this.havePlatform = newParams.platform
            }
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
    checkListChange(){
      // setLifeUserList(this.checkedList)
    },  
    handleFilter(listQuery, noLoad){
      this.currentPage = 1
      this.listQuery = {...listQuery}
      if(!noLoad){
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
      getReturnModelData(newParams).then(res => { 
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
    formatTdValue(col,val){
      return getSpecialName(col, val)
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
      localStorage.setItem('extend_return_model_pagecount', val)
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
    // getSummaries(param) {
    //     const { columns, data } = param;
    //     const sums = [];
    //     columns.forEach((column, index) => {
    //       if (index === 0) {
    //         sums[index] = '总汇';
    //         return;
    //       }
    //       for(let i in this.totalInfos){
    //         if(column.property==i && i != 'site_id' && i != 'platform' && i != 'order_date'){
    //           if(this.totalInfos[i] && String(this.totalInfos[i]).indexOf('.') != -1){
    //             sums[index] = Number(this.totalInfos[i]).toFixed(2)
    //           }else{
    //             sums[index] = this.totalInfos[i]
    //           }
    //         }
    //       }
    //     });
    //     return sums;
    //   },
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
    formateNum(row,col,val){
      if(val && val.indexOf(' - ') != -1){
        let arr = val.split(' - ')
        if(arr.length>0){
          let newArr = arr.map((e)=>{
            let num = Number(e.slice(0, -1))
            num = num.toFixed(0)
            return num
          })
          if(newArr.length>=2){
            return newArr[0] + '% - '+ newArr[1] + '%'
          }
          return ''
        }
      }else{
        return ''
      }
    }

	}
}
</script>

<style lang="scss" scoped>
.user-wrap{
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .link_div{
    float: right;
    margin-top: -50px;
    /deep/ .el-button{
      border: none;
      background-color: #ffffff !important;
      color: #606266 !important;
      font-weight: bold;
    }
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
  .el-table{
    /deep/ .back_heard{
      color: #606266;
    }
    /deep/ .back_day .cell{
      color: #606266;
      font-weight: bold;
    }
    /deep/ tbody .extend_cell{
      text-indent: 3px; 
      .el-table__indent{
        padding-left: 0 !important;
      }
    }
    /deep/ .el-table__expand-icon>.el-icon{
      color: #000;
      font-weight: bold;
    }

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
      text-align: center;
      line-height: 3px;
    }
  }
  .table_nopad{
    /deep/ tr td{
      // padding: 0;
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
.total_row{
  padding-bottom: 10px;
  .el-col{
    .total_box{
      border: 1px solid #ddd;
      padding: 20px;
      text-align: center;
      border-radius: 3px;
      .total_num{
        font-weight: bold;
        font-size: 26px;
        color: #606266;
      }
      .total_title{
        color: #606266;
      }
    }
  }
}

</style>
