<template>
  <div class="app-container">
   	<el-table
    :data="tableData"
    style="width: 100%">
		<el-table-column
		label="时间">
		<template slot-scope="scope">
			<!-- <i style="padding-top: 4px;" class="el-icon-time"></i> -->
			<span>{{ scope.row.day }}</span>
		</template>
		</el-table-column>
		<el-table-column
		label="用户ID">
		<template slot-scope="scope">
			<span>{{ scope.row.user_id }}</span>
		</template>
		</el-table-column>
		<el-table-column
		label="用户姓名">
		<template slot-scope="scope">
			<span>{{ scope.row.nickname }}</span>
		</template>
		</el-table-column>			
		<el-table-column
		label="章节数量">
		<template slot-scope="scope">
			<span>{{ scope.row.chapter_num }}</span>
		</template>
		</el-table-column>
		<el-table-column
		label="字数">
		<template slot-scope="scope">
			<span>{{ scope.row.words_num }}</span>
		</template>
		</el-table-column>				
		<el-table-column
		label="报酬">
		<template slot-scope="scope">
			<span>{{ scope.row.price_total }}</span>
		</template>
		</el-table-column>
		<!-- <el-table-column label="操作">
		<template slot-scope="scope">
			<el-button
			size="mini"
			type="primary"
			@click="handleEdit(scope.$index, scope.row)">查看</el-button>
			<el-button
			size="mini"
			type="danger"
			@click="handleDelete(scope.$index, scope.row)">删除</el-button>
		</template>
		</el-table-column> -->
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
  </div>
</template>

<script>
import { getList } from '@/api/read/demo'

export default {
	name: 'DeliveryDetail',
	props: {
		role: Number,
		uid: Number,
		start_time: String
	},
	data() {
		return {
			refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
			total_nums: 0, // 分组内的用户总数
			currentPage: 1, // 默认获取第一页的数据
			pageCount: 10, // 每页10条数据
			tableData: [],
		}
	},
	mounted() {
		// this.getList()
	},
	methods: {
		getList() {		
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
				// this.tableData = [...res.collection]					
				// this.loading = false
				// this.total_nums = res.total_nums				
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
			]
			this.total_nums = 1
		},

		// 切换table页
		handleCurrentChange(val) {
			console.log(val)
			this.currentPage = val
			this.loading = true
			this.getList()
			this.loading = false
		},
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
	

</style>
