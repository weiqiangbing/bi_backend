<template>
<div class="group-list-wrap">
	<!-- <el-popover
	placement="top"
	width="160"
	v-model="visible">
		<p>确定要删除这条数据吗？</p>
		<div style="text-align: right; margin: 0">
			<el-button size="mini" type="text" @click="visible = false">取消</el-button>
			<el-button type="primary" size="mini" @click="visible = false">确定</el-button>
		</div>
		<el-button slot="reference">删除</el-button>
	</el-popover> -->
	<el-row style="padding-bottom: 20px;">
		<!-- <el-button>默认按钮</el-button> -->
		<el-button type="primary" @click="gotouser">添加用户筛选</el-button>
		<el-button type="primary" @click="gotobook">添加书籍筛选</el-button>
	</el-row>
	<!-- style="width: 100%" -->
	<el-table
	:data="listData"
	border	
	:row-class-name="tableRowClassName">
		<el-table-column
		type="index"
		width="50">
		</el-table-column>
		<el-table-column
		prop="create_time"
		label="创建时间"
		width="200">
		</el-table-column>
		<el-table-column
		prop="type"
		label="类型"
		width="150">
		<template slot-scope="props">
			<span >{{props.row.type == 1 ? '用户' : '书籍'}}</span>
		  </template>
		</el-table-column>
		<!-- <el-table-column
		prop="id"
		label="ID"
		width="150">
		</el-table-column> -->
		<el-table-column
		prop="title"
		label="标题"
		width="120">
		</el-table-column>
		<el-table-column
		prop="des"
		label="描述"
		width="120">
		</el-table-column>	
		<!-- fixed="right"	 -->
		<el-table-column		
		label="操作"
		width="200"
		align="center">
			<template slot-scope="scope">
				<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
				<!-- <el-popover
				placement="top"
				width="160"
				trigger="click">
					<p>确定要删除这条数据吗？</p>
					<div style="text-align: right; margin: 0">
						<el-button size="mini" type="text" @click="visible = false">取消</el-button>
						<el-button type="primary" size="mini" @click="visible = false">确定</el-button>
					</div>
					<el-button slot="reference">删除</el-button>
				</el-popover> -->
				<el-button type="text" size="small" @click="delFn(scope.row)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!-- 查看详情 -->
	<el-dialog title="筛选条件：" :visible.sync="dialogTableVisible">
		<el-steps :active="gridData.length" direction="vertical" align-center>				
			<el-step v-for="item in gridData" :title="item.site_code ? ('站点：' + item.site_code + ', 行为：' + item.db_table) : ('行为：' + item.db_table)" :description="desMsg(item)"></el-step>
		</el-steps>
	</el-dialog>

</div>
	
</template>

<script>
import { getList, delArticle } from '@/api/read/user_list'

export default {
  	name: 'ScreenUserList',  
	data() {
		return {
			visible: false,
			dialogTableVisible: false,
			listData: [],
			gridData: []
		}
	},
	created() {
		this.getGroupState()
  	},
	methods: {	
		getGroupState(){
			getList().then(res => {
				// console.log(res)
				this.listData = [...res.data.collection]
			})	
		},
		tableRowClassName({row, rowIndex}) {
			if (row.type == 1) {
				return '';
			} else if (row.type == 2) {
				return 'success-row';
			}
		},
		desMsg(obj){
			// return obj.group.length > 0 ? '维度：' + obj.group.join(',') : '' + obj.where.length > 0 ?  ' 筛选：'+ obj.where.join(',') + obj.having.length > 0 ? ' 维度筛选：' + this.getHavingStr(obj.having) : ''
			// console.log('obj', obj)
			// console.log(obj.group.join(','))
			const group = obj.group.length > 0 ? ' 维度：' + obj.group.join(',') : ''
			const where = obj.where.length > 0 ? ' 筛选：' + obj.where.join(',') : ''
			const having = obj.having.length > 0 ? ' 维度筛选：' + this.getHavingStr(obj.having) : ''
			return  group + where + having
		},
		// 查看
		handleClick(row) {
			this.dialogTableVisible = true
			this.gridData = row.content.searches
		},
		// 删除
		delFn(row){
			// console.log(row.id)
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				delArticle(row.id).then(res => {
					if(res.code == 20000){
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getGroupState()
					}
				})
				
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
			
		},
		gotouser(){
			this.$router.push('/service/screenuser')
		},
		gotobook(){
			this.$router.push('/service/screenbook')
		}
	}
}

</script>

<style lang="scss">
.app-container{
	padding: 30px;
}
.group-list-wrap{
	padding: 30px;
	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
}

</style>
