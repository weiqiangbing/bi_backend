<template>
  <div class="app-container book-chapter-wrap">	 
    <!-- 筛选 -->
    <filter-inputs ref="filterDom" @handleShowRow="handleShowRow" :filterConfig="pageConfig.bookChapter" echartBtn="hide" ></filter-inputs>
    <!-- 显示隐藏列 -->
    <div v-show="isShowRow" class="checked-show-row-list">
      <el-checkbox-group 
        v-model="checkedList"
        @change="checkListChange">
        <el-checkbox v-for="(item) in defaultCheckedList" :label="item.prop" v-bind:key="item.prop">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>    
    <!-- 主题内容 -->
    <el-table :data="chapterTableData" v-loading="chapter_loading">
      <template v-for="item in chapterTableColumn">
        <!-- 正常表单列 -->
        <el-table-column
          v-bind:key="item.label"
          v-if="noRepeatSum[item.prop] && checkedSum[item.prop]"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          :fixed="item.fixed ? item.fixed : false"
          :width="item.width ? item.width : ''"
          align="center"
        ></el-table-column>
        <!-- 特殊处理 -->
        <el-table-column width='100' label="站点" :prop="item.prop" v-if="item.prop === 'site_id' && checkedSum[item.prop]" v-bind:key="item.label">
          <template slot-scope="props">            
            <span >{{siteList1[props.row.site_id] }}</span>
            <!-- <span >{{props.row.site_id }}</span> -->
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChangeChapter"
        :page-size="chapter_pageCount"
        :current-page="chapter_currentPage"
        v-if="chapter_refreshPagination"
        layout="total, prev, pager, next, jumper"
        :total="chapter_total_nums">
      </el-pagination>
    </div>

  </div>	
</template>

<script>
import { getChapterList } from '@/api/read/user'
import { getSiteList, getOutsitesList } from '@/api/public/index'
import FilterInputs from '@/components/FilterInputs'
import { pageConfig } from '@/utils/pageConfig'
// import { tableColumns } from '@/utils/tableColumns'
import { pageTableConfig } from '@/utils/pageTableConfig'

const defaultChapterList = {	
  time_line: '',  
  book_id: '',

} // 章节列表默认的筛选值
export default {
  name: 'BookList',
  components: {
    FilterInputs
  },
	data() {
		return {
      isShowRow: false,
      chapter_loading: true,
      chapterList: Object.assign({}, defaultChapterList),			
      chapter_refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      chapter_total_nums: 0, // 分组内的用户总数
			chapter_currentPage: 1, // 默认获取第一页的数据
      chapter_pageCount: 5, // 每页10条数据
      chapterTableData: [],
      defaultCheckedList: [], // 隐藏列默认值
      checkedList: [],
      chapterTableColumn: [
        // {prop: 'id', label: 'ID', noRepeat: true, checked: true},
        {prop: 'book_id', label: '书籍ID', checked: true},
        {prop: 'chapter_id', label: '章节ID', checked: true},
        {prop: 'timeline', label: '时间', checked: true},
        {prop: 'site_id', label: '站点ID', noRepeat: true, checked: true},  
        {prop: 'pv', label: '总PV', checked: true},
        {prop: 'uv', label: '总UV', checked: true},         
        {prop: 'users', label: '注册用户数', checked: true},
        // {prop: 'vip_users', label: 'vip用户数', checked: true},                     
      ],
      pageConfig: Object.assign({}, pageConfig),
      noRepeatSum: Object.assign({}, pageTableConfig.bookChapter.noRepeatSum),
      checkedSum: Object.assign({}, pageTableConfig.bookChapter.checkedSum),
      sortSum: Object.assign({}, pageTableConfig.bookChapter.sortSum),
		}
	},
	created() {
    this.chapterList = {...this.$route.query}  
    this.getChapterListData() 
    // 获取隐藏列默认值
    for(let i in this.tableColumn){
      if(this.checkedSum[this.tableColumn[i].prop]){
        this.defaultCheckedList.push({prop: this.tableColumn[i].prop, label: this.tableColumn[i].label})
        this.checkedList.push(this.tableColumn[i].prop)
      }  
    }
  },
	methods: {      
    // 去空值
    filterNullVal(obj){
      const newObj = {}
      for (const key in obj) {        
        if(obj[key] != ''){
          newObj[key] = obj[key]
        }
      }
      return newObj
    },            
    getChapterListData() {
      const currentPage = this.chapter_currentPage - 1
      this.chapter_loading = true
      const params = {
        page: currentPage,
        count: this.chapter_pageCount,
        timeline: this.chapterList.time_line, 
        book_id: this.chapterList.book_id,         
      }
      const newParams = this.filterNullVal(params)
      getChapterList(newParams).then(res => {
        this.chapterTableData = [...res.data.collection]			         
        this.chapter_total_nums = res.data.total_nums			
        setTimeout(() => {
          this.chapter_loading = false
        }, 250)	
      })		
      
    },
    checkListChange(){
      this.chapterTableColumn.forEach( (item, index) => {
        if(this.checkedList.indexOf(item.prop) == -1){
          this.chapterTableColumn[index].checked = false
        }else{        
          this.chapterTableColumn[index].checked = true         
        }  
      })      
    },
    // 切换table页
		handleCurrentChangeChapter(val) {
			this.chapter_currentPage = val
			this.chapter_loading = true
			this.getChapterListData()
			this.chapter_loading = false
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
          // this.listData()    
          return false
        }
        this.listQuery.order = prop + ' ' + orders
        this.currentPage = 1
        // this.listData()
      })      
    },  
    handleShowRow(){
      this.isShowRow = !this.isShowRow 
    }
		


	}
}
</script>

<style lang="scss">
.book-chapter-wrap{

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
    min-height: 400px;
  }
  .checked-show-row-list{
    padding-top: 30px;
  }

}
</style>
