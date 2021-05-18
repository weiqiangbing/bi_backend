<template>
  <div class="app-container">
	<div class="check-list">
		<!-- <el-checkbox-group> -->
			<el-checkbox v-model="formThead.chapter_num" label="章节数"></el-checkbox>
			<el-checkbox v-model="formThead.words_num" label="字数"></el-checkbox>			
		<!-- </el-checkbox-group> -->
    </div>
   	<el-table
	   	v-loading="loading"
		:data="tableData"
		@sort-change="sortChange"
		:default-sort = "{prop: 'user_id', order: 'descending'}"
		style="width: 100%">
			<!-- <el-table-column
			v-for="fruit in defaultFormThead"
			:key="fruit.prop"
			:label="fruit.label">
				<template v-show="fruit.checked" slot-scope="scope">
					<span>{{ scope.row[fruit.prop] }}</span>
				</template>
			</el-table-column> -->
			<el-table-column
			label="用户ID"
			prop="user_id" 
			sortable="custom"
			:class-name="getSortClass('user_id')">
			<template slot-scope="{row}">
				<span>{{ row.user_id }}</span>
			</template>
			</el-table-column>
			<el-table-column
			label="用户姓名">
			<template slot-scope="scope">
				<span>{{ scope.row.nickname }}</span>
			</template>
			</el-table-column>			
			<el-table-column
			v-if="formThead.chapter_num"
			label="章节数量">
			<template slot-scope="scope">
				<span>{{ scope.row.chapter_num }}</span>
			</template>
			</el-table-column>
			<el-table-column
			v-if="formThead.words_num"
			label="字数">
			<template slot-scope="scope">
				<span>{{ scope.row.words_num }}</span>
			</template>
			</el-table-column>				
			<el-table-column
			label="报酬">
			<template slot-scope="scope">
				<span class="link-type" @click="handleFetchPv(scope.row.price_total)">{{ scope.row.price_total }}</span>
			</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
					size="mini"
					type="primary"
					@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button
					size="mini"
					type="danger"
					@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
  	
	<!-- 分页 -->
	<div class="pagination">
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

	<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/read/demo'
import { Collapse } from 'element-ui'


export default {
	name: 'DeliveryDetail',
	props: {
		role: Number,
		uid: Number,
		start_time: String
	},
	data() {
		return {
			loading: true,
			refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
			total_nums: 0, // 分组内的用户总数
			currentPage: 1, // 默认获取第一页的数据
			pageCount: 10, // 每页10条数据
			tableData: [],
			formThead: {chapter_num: true, words_num: false},
			isShow: true,
			dialogPvVisible: false,
			pvData:[
				{key: 'PC', pv: '1024'},
				{key: 'mobile', pv: '1024'},
				{key: 'ios', pv: '1024'},
				{key: 'andoid', pv: '1024'},
			]
				
		}
	},
	mounted() {
		// this.listData()
	},
	methods: {
		listData() {		
			let res 
			const role = this.role
			const uid = this.uid || 0
			const start_time = this.start_time || ''
			const currentPage = this.currentPage - 1

			this.loading = true
			const params = {
				page: currentPage,
				count: this.pageCount,
				start_time : start_time,
				role : role,
				uid: uid
			}
			// getList(params).then(res => {
			// 	this.tableData = [...res.data.collection]					
			// 	this.loading = false
			// 	this.total_nums = res.data.total_nums				
			// })		
			this.tableData = [
				{
					book_num: 1,
					chapter_num: 5,
					create_time: "2019-11-15 21:17:45",
					day: "2019-11-11",
					id: 2,
					month: "2019-11",
					nickname: "super",
					price: "0.00",
					price_method: 0,
					price_total: "0.00",
					role: 2,
					task_reject_num: 0,
					task_total_num: 0,
					user_id: 1,
					words_num: 11139,
					year: 2019
				},
				{
					book_num: 1,
					chapter_num: 5,
					create_time: "2019-11-15 21:17:45",
					day: "2019-11-12",
					id: 2,
					month: "2019-11",
					nickname: "super",
					price: "0.00",
					price_method: 0,
					price_total: "0.00",
					role: 2,
					task_reject_num: 0,
					task_total_num: 0,
					user_id: 2,
					words_num: 11139,
					year: 2019
				},
				{
					book_num: 1,
					chapter_num: 5,
					create_time: "2019-11-15 21:17:45",
					day: "2019-11-13",
					id: 2,
					month: "2019-11",
					nickname: "super",
					price: "0.00",
					price_method: 0,
					price_total: "0.00",
					role: 2,
					task_reject_num: 0,
					task_total_num: 0,
					user_id: 3,
					words_num: 11139,
					year: 2019
				},
				{
					book_num: 1,
					chapter_num: 5,
					create_time: "2019-11-15 21:17:45",
					day: "2019-11-14",
					id: 2,
					month: "2019-11",
					nickname: "super",
					price: "0.00",
					price_method: 0,
					price_total: "0.00",
					role: 2,
					task_reject_num: 0,
					task_total_num: 0,
					user_id: 4,
					words_num: 11139,
					year: 2019
				},
				{
					book_num: 1,
					chapter_num: 5,
					create_time: "2019-11-15 21:17:45",
					day: "2019-11-15",
					id: 2,
					month: "2019-11",
					nickname: "super",
					price: "0.00",
					price_method: 0,
					price_total: "0.00",
					role: 2,
					task_reject_num: 0,
					task_total_num: 0,
					user_id: 5,
					words_num: 11139,
					year: 2019
				},
			]
			this.total_nums = 1
			this.loading = false
		},
		// 切换table页
		handleCurrentChange(val) {
			console.log(val)
			this.currentPage = val
			this.loading = true
			this.listData()
			this.loading = false
		},
		sortChange(data) {
			const { prop, order } = data
			if (prop === 'user_id') {
				this.sortByID(order)
			}
		},
		sortByID(order) {
			if (order === 'ascending') {
				this.sort = '+user_id'
			} else {
				this.sort = '-user_id'
			}
			// this.handleFilter()
		},
		getSortClass: function(key) {
			const sort = this.sort
			return sort === `+${key}`
				? 'ascending'
				: sort === `-${key}`
				? 'descending'
				: ''
		},
		handleFetchPv(data){
			this.dialogPvVisible = true
		}
		// handleEdit(index, row) {
		// 	console.log(index, row);
		// },
		// handleDelete(index, row) {
		// 	console.log(index, row);
		// }
	}
}
</script>

<style lang="scss" scoped>

	.pagination {
		display: flex;
		justify-content: flex-start;
		margin: 20px 0;
	}
	.check-list{
		padding: 10px;
		border: 1px solid #eee;
	}
	

</style>
