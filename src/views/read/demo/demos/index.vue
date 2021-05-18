<template>
  <div class="app-container">	 
	<el-tabs v-model="role" @tab-click="activeTab">		
		<!-- <el-tabs  type="border-card"> -->
		<div class="filter-container">
			<el-select 
				style="width: 200px;" 
				clearable  
				v-model="listQuery.userName" 
				filterable 
				placeholder="搜索某个工作人员" 
				@change="handleSelect">
				<el-option
					v-for="item in restaurants"
					:key="item.id"
					:label="item.value"
					:value="item.id"
					>
				</el-option>
			</el-select>    
			<el-input 
				v-model="listQuery.book_id" 
				placeholder="id搜索书籍"
				style="width: 200px;">				
			</el-input>
			<el-dropdown :show-timeout="10" @command="handleCommand" class="el-dropdown-border">
				<span class="el-dropdown-link">
					时间<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown"> 
					<el-dropdown-item command="month">月</el-dropdown-item>
					<el-dropdown-item command="week">周</el-dropdown-item>
					<el-dropdown-item command="day">日</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-date-picker
				v-show="time_way == 'month'"
				v-model="listQuery.month_time"
				type="month"
				value-format="yyyy-MM"
				placeholder="选择要查询的月">
			</el-date-picker>
			<el-date-picker
				v-show="time_way == 'week'"
				v-model="listQuery.week_date"
				type="week"
				format="yyyy 年 WW 周"
				placeholder="选择要查询的周"
				@change="handleWeek(listQuery.week_date)">				
			</el-date-picker>						
			<el-date-picker
				v-show="time_way == 'day'"
				v-model="listQuery.start_time"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择要查询的日期">
			</el-date-picker>	
			<!-- <el-date-picker
				v-model="listQuery.week_date"
				type="week"
				format="yyyy 年 WW 周"
				value-format="yyyy-WW"
				placeholder="选择要查询的周">				
			</el-date-picker> -->
			<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
				<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
			</el-select>
			<el-button
				class="margin-rihgt-10 padding-btn-10" 
				type="primary" clearable icon="el-icon-search" 
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
		</div>		
		<el-tab-pane label="替换词设置" name="1">
			<replaceSet ref="replaceSet" :role="1" :uid="listQuery.uid" :start_time="listQuery.start_time"/>					
		</el-tab-pane>
		<el-tab-pane label="替换词审核" name="2">
			<replaceAudit ref="replaceAudit" :role="2" :uid="listQuery.uid" :start_time="listQuery.start_time"/>	
		</el-tab-pane>
		<el-tab-pane label="章节校对" name="3">
			<chapterProof ref="chapterProof" :role="3" :uid="listQuery.uid" :start_time="listQuery.start_time"/>	
		</el-tab-pane>
		<el-tab-pane label="章节审核" name="4">
			<chapterAudit ref="chapterAudit" :role="4" :uid="listQuery.uid" :start_time="listQuery.start_time"/>	
		</el-tab-pane>		
	</el-tabs>


	<router-view />
  </div>	
</template>

<script>
// import UserList from '@/api/read/demo'
import chapterAudit from './components/chapterAudit/index.vue'
import chapterProof from './components/chapterProof/index.vue'
import replaceAudit from './components/replaceAudit/index.vue'
import replaceSet from './components/replaceSet/index.vue'

const defaultListQuery = {	
	userName: '',
	uid: 0,
	book_id: '',
	start_time: '',
	week_date: '',
	week_time: '',
	month_time: '',
	sort: '+id',
} // 默认的筛选值
export default {
	name: 'TaskListDetail',
	components: {
		chapterAudit,
		replaceAudit,
		replaceSet,
		chapterProof
	},
	data() {
		return {
			time: '',
			role: '1',
			time_way: 'month',
			restaurants: [],
			listQuery: Object.assign({}, defaultListQuery),			
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
		}
	},
	created() {
		// this.setDefaultTime()		
	},
	mounted() {
		this.getList()
		this.activeTab()
	},
	methods: {
		async getList() {
			let res
			try {
				this.loading = true				
				// UserList().then(res => {
					// this.restaurants = [...res]					
					// this.loading = false
				// })
				this.restaurants = [
					{id: 1, value: "super"},
					{id: 2, value: "lishuai"},
					{id: 3, value: "小白"},
					{id: 4, value: "ls"}
				]
			} catch (e) {
				this.loading = false			
			}
		},
		activeTab() {
			if (this.role == '1') {
				this.$refs.replaceSet.listData()
			} else if (this.role == '2') {
				this.$refs.replaceAudit.listData()
			} else if (this.role == '3') {
				this.$refs.chapterProof.listData()
			} else if (this.role == '4') {
				this.$refs.chapterAudit.listData()
			}
		},
		querySearch(queryString, cb) {
			const { restaurants } = this
			const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
			// 调用 callback 返回建议列表的数据
			cb(results)
		},
		createFilter(queryString) {
			return restaurant => (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
		},
		handleSelect(item) {
			this.listQuery.uid = item
		},
		handleFilter() {
			// console.log(this.listQuery)
			this.activeTab()
		},
		handleCommand(command) {
			this.time_way = command
		},
		handleWeek(date){
			const week = this.getWeek(date)
			this.listQuery.week_time = week
		},
		getWeek (date){
			let nowDate = new Date(date);
			let firstDay = new Date(date);
			// const y = new Date(date).getFullYear();  
			// console.log(y)
			firstDay.setMonth(0);//设置1月
			firstDay.setDate(1);//设置1号
			let diffDays = Math.ceil((nowDate - firstDay)/(24*60*60*1000));
			let week = Math.ceil(diffDays/7);
			return week + 1 == 53 ? 1 : week + 1;
		},
		handleReset() {
			this.listQuery = Object.assign({}, defaultListQuery)
			// this.setDefaultTime()
		},
		setDefaultTime(){
			var date = new Date();
			var nowYear = date.getFullYear();
			var month = ("0" + (date.getMonth() + 1)).slice(-2); 
			var day = ("0" + date.getDate()).slice(-2);
			var today = nowYear+"-"+(month)+"-"+(day-1);
			// 默认日期赋值为前一天
			this.listQuery.start_time = today
		}
		


	}
}
</script>

<style lang="scss">
.el-icon-arrow-down {
	font-size: 12px;
}
.demonstration {
	display: block;
	color: #8492a6;
	font-size: 14px;
	margin-bottom: 20px;
}
	
</style>
