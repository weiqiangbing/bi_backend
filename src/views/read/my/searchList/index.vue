<template>
  <div class="search-list-wrap" v-loading="loading">
	<!-- <p class="my-title">我的历史搜索列表</p> -->
		<el-row :gutter="20" v-if="listData.length > 0">
			<el-col :span="item.span" v-show="item.type == 'table'" v-for="(item, ind) in listData" :key="ind">
				<div class="table_box" v-if="item.type == 'table'">
					<div class="table_heard">
						<div class="table_name">
							{{item.name}} 
							<span class="tag tag_prive" v-if="item.report_type==1 && !isHome">私</span>
							<span class="tag tag_public" v-else-if="!isHome">公</span>
						</div>
						
						<div class="table_right">
							<span class="right_icon el-icon-view" @click="goToSee(item)"></span>
							<el-dropdown trigger="click" @command="setingClick(item, $event)" :hide-on-click="hideClicks">
								<span class="right_icon el-icon-setting"></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="1">刷新</el-dropdown-item>
									<el-dropdown-item :command="2">修改</el-dropdown-item>
									<el-dropdown-item :command="3">删除</el-dropdown-item>
									<el-dropdown-item :command="5" v-if="!isHome">在首页展示</el-dropdown-item>
									<el-popover
										placement="top-start"
										title="标题"
										width="200"
										trigger="click">
										<div>
											<el-select v-model="item.span" placeholder="请选择">
												<el-option v-for="item in spanData" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</div>
										<el-dropdown-item slot="reference" :command="4">设置宽度</el-dropdown-item>
									</el-popover>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
					<tables v-if="item.refresh" height="300px" width="100%" style="overflow:auto" :id="'table' + (ind + 1)" :class="'table' + (ind + 1)" :item="item"></tables>
				</div>
			</el-col>
			<el-col :span="item.span" v-show="item.type == 'echart'" v-for="(item, ind) in listData" :key="'chart-' + ind">
				<div class="table_box" v-if="item.type == 'echart'">
					<div class="table_heard">
						<div class="table_name">
							{{item.name}}
							<span class="tag tag_prive" v-if="item.report_type==1">私</span>
							<span class="tag tag_public" v-else>公</span>
						</div>
						<div class="table_right">
							 <span class="right_icon el-icon-view" @click="goToSee(item)"></span>
							<el-dropdown trigger="click" @command="setingClick(item, $event)" :hide-on-click="hideClicks">
								<span class="right_icon el-icon-setting"></span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="1">刷新</el-dropdown-item>
									<el-dropdown-item :command="2">修改</el-dropdown-item>
									<el-dropdown-item :command="3">删除</el-dropdown-item>
									<el-dropdown-item :command="5" v-if="!isHome">在首页展示</el-dropdown-item>
									<el-popover
										placement="top-start"
										title="标题"
										width="200"
										trigger="click">
										<div>
											<el-select v-model="item.span" @change="changeEchartWidth" placeholder="请选择">
												<el-option v-for="item in spanData" :key="item.value" :label="item.label" :value="item.value"></el-option>
											</el-select>
										</div>
										<el-dropdown-item slot="reference" :command="4">设置宽度</el-dropdown-item>
									</el-popover>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</div>
					<chart 
					ref="echartline"
					 v-if="item.refresh" 
					 height="310px" width="380px" 
					 style="float: left;box-sizing: border-box;padding-left: 5px;" 
					 :id="'chart' + (ind + 1)" 
					 :class="'chart' + (ind + 1)" 
					 :item="item"/>
				</div>
			</el-col>
		</el-row>

	<div class="bitmap" v-else>
		<img src="@/assets/images/no_history.jpg" alt="">
		<p>暂无报表</p>
	</div>

	<div class="center_page" v-if="!isHome">
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
	<div class="init_dialog">
		<el-dialog
        :title="'修改'+this.eidtItem.name+'信息'"
        :modal="true"
        top="15vh"
        :visible.sync="reportDialog"
        width="400px">
        <div class="term_s">
            <reportForm ref="reportBox"></reportForm>
        </div>
        <div style="text-align: center; margin: 10px">
            <el-button type="text" @click="reportDialog = false">取消</el-button>
            <el-button type="primary" size="mini" :loading="btnLading" @click="updateReoprt()">确认</el-button>
        </div>
    </el-dialog>
	</div>

  </div>	
</template>
<script>
import { getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import { getReportData, updateReportData } from '@/api/public/index'
import Chart from '@/components/Charts/BarChart'
import Tables from '@/components/Tables/index'
import reportForm from '@/components/parts/reportForm.vue'

export default {
  	name: 'searchList',
  	components: { 
		Chart, 
		Tables,
		reportForm
	},
	data() {
		return {
			loading: false,
			reportDialog: false,
			btnLading: false,
			hideClicks: true,
			listData: [],
			currentPage:1,
			pageCount:10,
			total_nums:0,
			eidtItem:{},
			spanData:[
				{label:'25%',value: 6},
				{label:'50%',value: 12},
				{label:'75%',value: 18},
				{label:'100%',value: 24},
			]

		}
	},
	created() {
		// const arr = getHistorySearchList()
		this.getReports()
		// console.log('arr2', arr)
		// if(arr != null){
		// 	this.listData = [...arr]
		// }
	},
	computed:{
		isHome(){
			return this.$route.name == 'Dashboard'
		}
	},
	methods: {  
		getReports(){
		    const current = this.currentPage - 1
			let params = {
				page: current,
				count: this.pageCount,
			}
			this.listData = []
			if(this.isHome){
				let homeData = JSON.parse(localStorage.getItem('home_report_data'))
				if(homeData){
					this.listData = homeData
				}
			}else{
				this.loading = true
				getReportData(params).then((res)=>{
					res.data.collection.forEach((re)=>{
						re.refresh = true
						re.span = 6
					})
					this.listData = res.data.collection
					this.total_nums = res.data.total_nums
					this.loading = false
				})
			}
		},
		handleSizeChange(val){
			this.pageCount = val
			this.getReports()
		},
		handleCurrentChange(val){
			this.currentPage = val
			this.getReports()
		},
		// changeSpan(row,e){
		// 	console.log(555,row, e);
		// 	row.span = e
		// },
		refreshTable(item){
			console.log(item);
			item.refresh = false
			this.$nextTick(()=>{
				item.refresh = true
			})
		},
		setingClick(item, e){
			console.log(2222,item,e);
			this.hideClicks = false
			if(e==1){
				this.refreshTable(item)
			}else if(e==2){
				this.editReport(item)
			}else if(e==3){
				this.deleteReport(item)
			}else if(e==4){
				this.hideClicks = true
			}else if(e==5){
				this.saveToHome(item)
			}

		},
		saveToHome(item){
			let homeData = localStorage.getItem('home_report_data')
			let arr = []
			if(homeData){
				arr = JSON.parse(homeData)
				let ishave = arr.some((er)=>{
					return er.report_id == item.report_id
				})
				if(ishave){
					this.$message.warning('该报表已在首页中存在')
					return
				}
			}
			arr.push(item)
			console.log(arr);
			localStorage.setItem('home_report_data', JSON.stringify(arr))
			this.$message.success('保存首页成功')
		},
		deleteReport(item){
			let _this = this
			this.$confirm('此操作删除'+item.name+'报表?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if(_this.isHome){
					let homeData = localStorage.getItem('home_report_data')
					let arr = JSON.parse(homeData)
					for (let i = 0; i < arr.length; i++) {
						if(arr[i].report_id == item.report_id){
							arr.splice(i, 1)
						}
					}
					localStorage.setItem('home_report_data', JSON.stringify(arr))
					this.listData = arr
				}else{
					let data = {
						report_id: item.report_id,
						status: '4'
					}
					updateReportData(data).then((res)=>{
						if(res.code==20000){
							_this.currentPage = 1
							_this.getReports()
							_this.$message({
								type: 'success',
								message: '删除成功!'
							});
						}
						
					})
				}
			});
		},
		goToSee(item){
			// console.log(this.$store.state.tagsView.visitedViews);
			// console.log(item);
			if(item.from=="MergeTable"){
				let result = {
					pages:[],
					searchObj: item.listQuery,
				}
				let baseRoutes = this.$router.options.routes[3].children
				item.apis.forEach(api=>{
					baseRoutes.forEach((re)=>{
						if(re.meta.api == api){
							result.pages.push({api:api, name: re.name, title: re.meta.title})
						}
					})
				})
				sessionStorage.setItem('merge_pages_data', JSON.stringify(result))
			}
			let ishave = false
			let views = this.$store.state.tagsView.visitedViews
			views.forEach((re)=>{
				if(re.path==item.to){
					ishave = true
					this.closeSelectedTag(re, item)
				}
			})
			if(!ishave){
				this.$router.push({
				path: item.to,
				query: {
					from: 'my/searchList',
					formReport: 1,
					type: item.type,
					checkedList: item.checkedList,
					listQuery: JSON.stringify(item.listQuery)
				}})
			}
		},
		editReport(item){
			this.eidtItem = item
			this.reportDialog = true
			// if(this.isHome){
			// 	let homeData = localStorage.getItem('home_report_data')
			// 	let arr = JSON.parse(homeData)
			// 	arr.forEach((er)=>{
			// 		if(er.report_id == item.report_id){
			// 			er.refresh_time = this.eidtItem.refresh_time
			// 			er.name = this.eidtItem.name
			// 		}
			// 	})
			// 	localStorage.setItem('home_report_data', JSON.stringify(arr))
			// }else{
				this.$nextTick(()=>{
					this.$refs.reportBox.formData = {
						name: this.eidtItem.name,
						refresh_time: this.eidtItem.refresh_time,
						report_type: this.eidtItem.report_type,
					}
				})
			// }
		},
		changeEchartWidth(){
			let comps = this.$refs.echartline
			comps.forEach(re=>{
				this.$nextTick(()=>{
					re.changeEchartWidth()
				})
			})
		},
		updateReoprt(){
			let data = this.$refs.reportBox.formData
			data.report_id = this.eidtItem.report_id
			if(this.isHome){
				let homeData = localStorage.getItem('home_report_data')
				let arr = JSON.parse(homeData)
				arr.forEach((er)=>{
					if(er.report_id == this.eidtItem.report_id){
						er.refresh_time = data.refresh_time
						er.name = data.name
					}
				})
				localStorage.setItem('home_report_data', JSON.stringify(arr))
				this.listData = arr
				this.reportDialog = false
			}else{
				this.btnLading = true
				updateReportData(data).then((res)=>{
					this.btnLading = false
					this.reportDialog = false
					this.getReports()
				}).catch((err)=>{
					this.btnLading = false
				})
			}
		},

		closeSelectedTag(view, item) {
			this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
				this.$nextTick(()=>{
					this.$router.push({
					path: item.to,
					query: {
						from: 'my/searchList',
						formReport: 1,
						type: item.type,
						checkedList: item.checkedList,
						listQuery: JSON.stringify(item.listQuery)
					}}
				)
				})
			})
		},

	}
}
</script> 

<style lang="scss" scoped>
.search-list-wrap {
	padding: 30px;
	.my-title{
		font-size: 20px;
		font-weight: bold;
    	/* padding-bottom: 20px; */
		/* padding-left: 20px; */
	}
	.el-row .el-col{
		margin-bottom: 14px;
	}
	.bitmap{
		color: #666;
		font-size: 16px;
		text-align: center;
		img {
			width: 300px;
			height: auto;
			padding-top: 120px;
		}
	}
	.center_page{
		width: 100%;
		clear: both;
		text-align: center;
		padding-top: 20px;
	}
	.table_heard{
		display: flex;
		justify-content: space-between;
		height: 36px;
		line-height: 36px;
		padding: 0 10px;
		border-bottom: 1px solid #ddd;
		
		.table_name{
			font-weight: bold;
			font-size: 14px;
			color: #606266;
			white-space: nowrap;
			width: 200px;
			text-overflow: ellipsis;
			overflow: hidden;
			.tag{
				font-size: 12px;
				padding: 2px;
				border-radius: 2px;
				color: #ffffff;
				transform: scale(.8);
			}
			.tag_prive{
				background-color: #67C23A;
			}
			.tag_public{
				background-color: #E6A23C;
			}
		}
		.table_right{
			display: flex;
			span{
				display: inline-block;
				width: 20px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				font-size: 18px;
				line-height: 36px;
				cursor: pointer;
				margin: 0 4px;
			}
		}
	}
	.table_box{
		border: 1px solid #dddddd;
		border-radius: 6px;
		overflow: hidden;
		/deep/ .echart-wrap{
			// transform: scale(0.8) translate(-45px, -20px);
			border: none;
			height: 100%;
			padding-top: 0;
		}
		// padding: 8px;
	}
	.init_dialog{
		.term_s{
			margin-top: -16px;
		}
	}
}
</style>
