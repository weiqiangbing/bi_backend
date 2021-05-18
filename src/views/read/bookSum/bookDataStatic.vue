<template>
<div class="book-progress-wrap">
    <!-- 列表页面 -->
    <div class="container">
    <div class="header">
        <!-- <div class="title">书籍列表</div> -->
        <div class="filter-container">
        <el-form :model="listQuery" ref="listQuery">
            <el-input v-model="listQuery.book_id" clearable placeholder="请输入书籍ID" style="width: 150px;" class="margin-rihgt-10"></el-input>
            <el-date-picker
                v-model="value"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleGetData"
                class="margin-rihgt-10">
            </el-date-picker>            
            <el-button
            class="padding-btn-10"
            type="primary" icon="el-icon-search"
            @click="handleFilter('listQuery')">
            查询
            </el-button>
            <el-button
            class="padding-btn-10"
            icon="el-icon-refresh"
            @click="handleReset">
            重置
            </el-button>
        </el-form>
        </div>
    </div>
    <div class="book-msg" v-if="tableData.length > 0">
        <span>{{tableData[0].book_id}}</span><span>《{{tableData[0].book_name}}》</span>
    </div>
    <div class="card-box" v-show="pay_rate_data.pay_rate">
        <el-card class="card-item">
            <div slot="header" class="clearfix">    
                <div class="icon-pop">
                    <el-popover
                    ref="popover"
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    content="付费点用户数 / 付费点前用户数 = 付费转化率">
                    </el-popover>
                    <i class="el-icon-question" v-popover:popover></i>
                </div>                
                <span class="label-class">付费转化率</span>{{pay_rate_data.pay_rate | getFilterNum}}              
                <!-- <el-button style="float: right; padding: 0 3px 0; font-size: 20px;" type="text"><i class="icon-go el-icon-d-arrow-right"></i></el-button> -->
            </div>
            <div class="text item">
                <p><span class="label-class">付费点用户数</span>{{pay_rate_data.vip_chapter_uv}}</p>
                <p><span class="label-class">付费点前用户数</span>{{pay_rate_data.free_chapter_uv}}</p>                
            </div>
        </el-card>
        <!-- <el-card class="card-item">
            <div slot="header" class="clearfix">
              <span>卡片名称</span>
              <el-button style="float: right; padding: 0 3px 0; font-size: 20px;" type="text"><i class="icon-go el-icon-d-arrow-right"></i></el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
        </el-card>
        <el-card class="card-item">
            <div slot="header" class="clearfix">
              <span>卡片名称</span>
              <el-button style="float: right; padding: 0 3px 0; font-size: 20px;" type="text"><i class="icon-go el-icon-d-arrow-right"></i></el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{'列表内容 ' + o }}
            </div>
        </el-card> -->
    </div>
    <!-- 表格 -->
    <el-table
        class="book-sum-table"
        v-show="tableData.length > 0"
        :data="tableData"        
        v-loading="loading"
        id="out-table'">
        <!-- 开始循环 -->
        <template v-for="item in tableColumn">
        <!-- 正常表单列 -->
        <el-table-column
                v-bind:key="item.label"
                v-if="!item.noRepeat"
                :prop="item.prop"
                :label="item.label"
                :show-overflow-tooltip="true"
                :fixed="item.fixed ? item.fixed : false"
                :width="item.width ? item.width : ''"
        ></el-table-column>
        <!-- 章节标题 -->
        <el-table-column label="章节标题" v-if="item.prop ==='chapter_title'" v-bind:key="item.label">
            <template slot-scope="props">              
                <div>{{props.row.chapter_title}}<span v-show="props.row.chapter_vip > 0" style="color: #d41e24;padding-left: 5px;">[V]</span></div>        
            </template>
          </el-table-column>
        <!-- 跟读率 -->
          <el-table-column label="跟读率" v-if="item.prop ==='follow_rate'" v-bind:key="item.label">
            <template slot="header" slot-scope="props">
              <el-tooltip class="item" effect="dark" content="1 - (本章UV-上一章UV) / 上一章UV = 跟读率" placement="top">
                <div>                  
                  <span>跟读率</span>
                  <i class="el-icon-question"></i>
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="props">              
                <div>{{props.row.follow_rate | getFilterNum}}</div>
            </template>
          </el-table-column>
          <el-table-column width="250" label="报错段落数/总段落数 = 报错率" v-if="item.prop ==='chapter_error_info'" v-bind:key="item.label">
            <!-- <template slot="header" slot-scope="props">
              <el-tooltip class="item" effect="dark" content="报错率" placement="top">
                <div>                  
                  <span>报错段落数/总段落数 = 报错率</span>
                  <i class="el-icon-question"></i>
                </div>
              </el-tooltip>
            </template> -->
            <template slot-scope="props">   
                <div>{{props.row.chapter_error_info.sentence_num ? props.row.chapter_error_info.sentence_num : 0}} / {{props.row.chapter_error_info.full_senten_num ? props.row.chapter_error_info.full_senten_num : 0}} = {{props.row.chapter_error_info.error_rate ? props.row.chapter_error_info.error_rate : 0 | getFilterNum}}</div>                          
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <!-- <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
            <el-button
            v-for="(item,index) in operate"
            :type="item.type"
            :disabled="!isRepeat(scope.row,item)"
            plain
            size="mini"
            :key="index"
            @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
            >{{item.name}}</el-button>
        </template>
        </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-show="tableData.length > 0">
        <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="total_nums">
        </el-pagination>
    </div>
    </div>

</div>
</template>

<script>
import { getBookSumList } from '@/api/read/book_sum'
import { outSiteText, sectionText, classText, siteText } from '@/filters/index'

const defaultListQuery = {
    book_id: '',
    start_time: '',
    end_time: ''
} // 默认的筛选值
export default {
    name: 'BookDataStatic',
    data() {
        return {
        loading: false,
        refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
        total_nums: 0, // 分组内的用户总数
        currentPage: 1, // 默认获取第一页的数据
        pageCount: 10, // 每页10条数据
        tableColumn: [
            // { prop: 'book_id', label: '英文书号' },
            // { prop: 'book_name', label: '英文书名'},
            { prop: 'chapter_id', label: '章节ID' },
            { prop: 'chapter_code', label: '章节序号' },
            { prop: 'chapter_title', label: '章节标题', width: '250', noRepeat: true },
            // { prop: 'author_name', label: '作者' },    
            // { prop: 'pv', label: 'PV' },
            { prop: 'uv', label: 'UV' },
            { prop: 'users', label: '用户数' },
            { prop: 'follow_rate', label: '跟读率', noRepeat: true },
            { prop: 'chapter_error_info', label: '报错率', noRepeat: true },
            
        ],
        listQuery: Object.assign({}, defaultListQuery),
        tableData: [],
        pay_rate_data: {}, // 转化率数据
        value: '',
        

        }
    },
    filters: {
        outSiteText,
        sectionText,
        classText,
        siteText,
        getFilterNum(num) {
            let baseNum = num;
            if(baseNum){
                let newNum = baseNum.toString()
                let ind = newNum.indexOf('.')
                if(ind != -1){
                    return newNum.slice(0, ind + 3) + '%'
                }else{
                    return newNum + '%'
                }    
            }else{
                return baseNum
            }
		}
    },
    async created() {
        // 默认日期赋值	
		this.setDefaultTime()
        // this.getBooks()
        
    },
    methods: {
        getBooks() {
            let res
            const currentPage = this.currentPage - 1
            try {    
                const params = {    
                    count: this.pageCount,
                    page: currentPage,
                    group: 'chapter_id',
                    book_id: this.listQuery.book_id,
                    start_time: this.listQuery.start_time,
                    end_time: this.listQuery.end_time,
                }
                // console.log(params)
                if(!params.book_id){
                    this.$message.warning('书籍ID不能为空！')
                    return false
                }
                this.loading = true
                getBookSumList(params).then(res => {
                    this.loading = false
                    this.tableData = [...res.data.chapter_data.collection]
                    if(this.tableData.length == 0){
                        this.$message.error('暂无数据')
                    }
                    this.pay_rate_data = res.data.pay_rate_data
                    this.total_nums = res.data.chapter_data.total_nums
                })
            } catch (e) {
                this.loading = false
                console.log(e)
            }
        },
        // 切换table页
        async handleCurrentChange(val) {
            this.currentPage = val
            this.loading = true
            await this.getBooks()
            this.loading = false
        },
        handleFilter(formName) {
            this.currentPage = 1
            this.getBooks()
        },
        handleReset() {
            this.listQuery = Object.assign({}, defaultListQuery)
            this.setDefaultTime()
        },
        // 修改时间重新赋值时间段
		handleGetData(arr){
			// this.value = [yesterday, today]
			this.listQuery.start_time = arr ? arr[0] : ''
			this.listQuery.end_time = arr ? arr[1] : ''
		},
        setDefaultTime(){
			var date = new Date();
			var nowYear = date.getFullYear();
			var month = ("0" + (date.getMonth() + 1)).slice(-2); 
			var day = ("0" + date.getDate()).slice(-2);
			var today = nowYear+"-"+(month)+"-"+(day);

			var nowDate = new Date(new Date().toLocaleDateString());//获取当前时间
			var date2 = new Date(nowDate.getTime() - 1*24*60*60*1000);
			var nowYear2 = date2.getFullYear();
			var month2 = ("0" + (date2.getMonth() + 1)).slice(-2); 
			var day2 = ("0" + date2.getDate()).slice(-2);
			var yesterday = nowYear2+"-"+(month2)+"-"+(day2);
			// 默认日期赋值
			this.value = [yesterday, today]
			this.listQuery.start_time = yesterday
            this.listQuery.end_time = today
            if(this.$route.query.book_id){
                this.listQuery.book_id = this.$route.query.book_id
                this.handleFilter()
            }
		}
    },
    }
    </script>

    <style lang="scss" scoped>
    .container {
    padding: 0 30px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
        height: 59px;
        line-height: 59px;
        color: #333;
        font-size: 16px;
        font-weight: 500;
        }
    }
    .book-msg{
        color: #666;
        font-weight: bold;
        line-height: 20px;
        padding: 5px 0 15px 16px;
    }
    .card-box{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .card-item{
            width: 310px;
            font-size: 14px;
            /deep/.el-card__body{
                padding: 10px 20px;

            }
            .label-class{
                display: inline-block;
                width: 200px;
                padding-left: 30px;
                color: #999;
                font-weight: bold;

            }
            .clearfix{
                position: relative;
                .icon-pop{
                    position: absolute;
                    left: 10px;
                    top: 0;
                    z-index: inherit;
                }
            }
        }

    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin: 10px 20px;
    }
    /deep/.el-table .cell{
        flex-wrap: wrap;
    }
    .book-progress-wrap .cell{
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .book-progress-wrap .cell .el-button{
        margin: 5px;
    }
    .filter-container{
        padding-top: 30px;
        padding-bottom: 15px;
        .el-form-item{
        margin-bottom: 0!important;
        }
        .margin-rihgt-10{
        margin-right: 10px;
        }
        .padding-btn-10{
        padding: 12px 15px;
        }
    }
}
</style>
  