<template>
<div class="user-filter-wrap">
<el-row>
	<div class="filter-tit">
		<span>用户筛选</span>		
	</div>
</el-row>
<el-row style="height: 100%;">
	<el-col class="border-left border-none" :span="8">
		<div class="step-tit"><el-tag>第一步</el-tag></div>
		<el-form ref="form" :model="form" label-width="120px">
			<!--  v-show="form.site_code == ''" -->
			<el-form-item label="选择站点">
				<!-- <el-select v-model="form.region" placeholder="请选择站点">
					<el-option label="aaa" value="shanghai">特色言情</el-option>
					<el-option label="bbb" value="beijing">小说大全</el-option>
				</el-select> -->
				<!-- :disabled="form.site_code != ''" -->
				<el-select				
				style="width: 150px;" 
				clearable  
				v-model="form.site_code" 
				filterable 
				placeholder="请选择站点"
				@change="handleSelectSite">
					<el-option
					v-for="item in siteList"
					:key="item.site_id"
					:label="item.site_name"
					:value="item.site_id"
					>
					</el-option>
			</el-select> 
			<span class="site-prompt">（必选）</span>
			</el-form-item> 	
			<el-form-item label="筛选数据源">
				<el-select v-model="form.db_table" placeholder="请选择筛选数据源" @change="handleSelectHandles">
					<el-option v-for="(value, key, index) in handlesData" :key="key" :label="value" :value="key"></el-option>
				</el-select>
			</el-form-item>			
			<!-- <el-form-item label="需要汇总的字段">
				<el-select v-model="groupList" multiple placeholder="请选择维度">
					<el-option v-for="(value, key, index) in handleInfoData.group" :key="key" :label="value" :value="key"></el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item v-show="isShowTime" label="时间">
				<el-date-picker
					v-model="betweenTime"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="筛选条件">
				<el-button size="mini" type="primary" @click="handleAddFilter">添加筛选条件</el-button>
				<div>
					<el-tag closable v-for="(item, index) in form.where" :key="index" @close="handleDelTag(form.where, index)">{{splitVal(item)}}</el-tag>
				</div>
			</el-form-item>	
			<el-form-item label="汇总字段的条件">
				<el-button size="mini" type="primary" @click="handleAddGroupFilter">添加汇总字段条件</el-button>
				<div>
					<el-tag closable v-for="(item, index) in form.having" :key="index" @close="handleDelTag(form.having, index)">{{splitVal(item)}}</el-tag>
				</div>
			</el-form-item>	
			<el-form-item>
				<!-- <el-button type="success" plain @click="getResults">查询</el-button> -->
				<el-button type="success" plain @click="continueAdd">下一步</el-button>								
			</el-form-item> 
		</el-form>
		<!-- <div class="result-data">
			<div v-if="resultData > 0">
				一共查到<span>{{resultData}}</span>条数据
			</div>
			<div v-else>
				暂无数据
			</div>
		</div> -->
	</el-col>
	<el-col class="border-left" :span="8">
		<div class="step-tit"><el-tag>第二步</el-tag></div>
		<div>			
			<!-- <p v-show="postData.content.searches.length && postData.content.site_code == 0 || postData.content.site_code">
				<el-tag>站点： {{siteList1[postData.content.site_code]}}</el-tag>
			</p> -->
			<el-steps :active="postData.content.searches.length" direction="vertical" align-center>				
				<el-step v-for="(item,index) in postData.content.searches" :title="'站点：' + siteList1[item.site_code]+ ', 行为：' + item.db_table" :description="desMsg(item, index)"></el-step>
			</el-steps>
		</div> 
		<!-- 结果取集 -->
		<div>
			<el-form>
				<el-row>
					<el-col :span="12">
						<el-form-item label="结果取交集/并集:">
							<el-radio-group v-model="postData.content.merge_type">
								<el-radio label="common">交集</el-radio>
								<el-radio label="all">并集</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col :span="12">
					<!-- <el-col :span="12">
						<el-form-item label="结果是否去重:">
							<el-radio-group v-model="postData.content.distinct">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>			 -->
				</el-row>
			</el-form>			
		</div>		
		<div style="margin-top: 30px;">
			<el-button type="primary" @click.native="handleSaveAll">总查询</el-button>
		</div>		
	</el-col>
	<el-col class="border-left" :span="8">
		<div class="step-tit"><el-tag>第三步</el-tag></div>
		<div class="result-data">
			<div v-if="resultAllData > 0">
				一共查到<span>{{resultAllData}}</span>(去重后)条数据
			</div>
			<div v-else>
				暂无数据
			</div>
		</div>
		<div class="save-msg-btn">
			<el-popover
				placement="right"
				width="400"
				popper-class="user_popover"
				v-model="visible"
				trigger="click">
				<el-form>
					<el-form-item label="筛选条目名称">
						<el-input v-model="postData.title" placeholder="未命名"></el-input>
					</el-form-item>
					<el-form-item label="筛选条目描述">
						<el-input v-model="postData.des" placeholder="请输入筛选描述"></el-input>
					</el-form-item>		
					<el-form-item label="是否允许所有用户查看">
						<el-radio-group style="width:100%" v-model="postData.public">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>		
					<el-form-item label="是否所有站都支持查询">
						<el-radio-group style="width:100%" v-model="isAllSite">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>				
					<el-form-item>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="visible = false">取消</el-button>
							<el-button type="primary" size="mini" @click="submitSaveFilter">确定</el-button>
						</div>
					</el-form-item>
				</el-form>
				<el-button slot="reference" type="success">保存</el-button>
			</el-popover>
		</div>

	</el-col>
	
</el-row>


<!-- 添加筛选条件的弹框 -->
<el-dialog
	title="添加筛选项" 
	width="50%" 
	:visible.sync="dialogFormVisible" >
  <el-form :model="dialogForm" label-width="125px" style="width:500px">
    <el-form-item label="请选择筛选字段">
      <el-select v-model="dialogForm[0]" placeholder="请选择筛选字段">
		<el-option v-for="(value, key, index) in handleInfoData.fields" :key="key" :label="value" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择筛选方式">
      <el-select v-model="dialogForm[1]" @change="changeType" placeholder="请选择筛选方式">
        <el-option v-for="item in wayData" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
	<el-form-item label="请选择判断条件值" style="width:326px">
		<!-- <el-select v-model="dialogForm[2]" v-if="dialogForm[1]=='time'" placeholder="请选择判断条件">
			<el-option v-for="(item, index) in timeData" :key="index" :label="item.label" :value="item.value"></el-option>
		</el-select> -->
		<el-popover
			v-if="dialogForm[1]=='time'"
			placement="bottom"
			title=""
			width="auto"
			v-model="timeVisible"
			trigger="click">
			<div>
				<dateArea @changedTime="changedTime" ref="dateArea"></dateArea>
			</div>
			<div class="mg-btm-20" slot="reference" style="display: inline-block;">
				<div class="relative_time" v-if="isRelative">
					<el-input :readonly="true" v-model="relativeTime1" style="width:120px"></el-input>
					<span style="width:14px;text-align:center" v-show="dateObjs.end_time" >-</span>
					<el-input :readonly="true" v-if="dateObjs.end_time" v-model="relativeTime2" style="width:120px"></el-input>
				</div>
				<el-date-picker
				v-else
				v-model="timeArea"
				type="daterange"
				align="right"
				unlink-panels
				range-separator="至"
				value-format="yyyy-MM-dd"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:readonly="true">
				</el-date-picker>
			</div>
		</el-popover>
		<el-input v-else placeholder="请输入条件值" v-model="dialogForm[2]"></el-input>
		
	</el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleSave">确 定</el-button>
  </div>
</el-dialog>

<!-- 添加维度筛选条件的弹框 -->
<el-dialog
	title="添加维度筛选项" 
	width="50%" 
	:visible.sync="dialogHavingWhereVisible" >
  <el-form :model="havingWhere" label-width="125px" style="width:500px">
	<el-form-item label="需要汇总的字段">
		<el-select v-model="groupList" multiple placeholder="请选择需要汇总的字段">
			<el-option v-for="(value, key, index) in handleInfoData.group" :key="key" :label="value" :value="key"></el-option>
		</el-select>
	</el-form-item>
    <el-form-item label="请选择汇总字段">
      <el-select v-model="havingWhere[0]" placeholder="请选择汇总字段">
			<el-option v-for="(value, key, index) in handleInfoData.having" :key="key" :label="value" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择汇总方式">
      <el-select v-model="havingWhere[1]" placeholder="请选择汇总方式">
        <el-option v-for="item in wayData" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>	
	<el-form-item label="请输入判断条件值">
		<el-input v-model="havingWhere[2]" placeholder="请输入条件值" style="width:200px"></el-input>
	</el-form-item>
	<el-form-item label="请选择汇总求和">
      <el-select v-model="havingWhere[3]" placeholder="请选择汇总求和">
        <el-option v-for="item in countData" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogHavingWhereVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleHavingSave">确 定</el-button>
  </div>
</el-dialog>
</div>	
</template>

<script>
import { getHandles, getHandleInfo, searchMyFilter, searchMyFilters, postMyFilter } from '@/api/read/screen'
import { getSiteList } from '@/api/public/index'
import { getSite, setSite } from '@/utils/auth'
import dateArea from '@/components/parts/dateArea.vue'
import {getDateName} from '@/utils/assist'
import { getDatetr } from '@/utils/common'

const objVal = 'user_id'
const defaultForm = { // 筛选行为对象表
	db_table: '',
	site_code: '',
	group: [],
	field: '',
	where: [],	
	having: [],
}
const defaultPostData = { // 提交保存表
	title: "",
	des: "",
	field: objVal,
	public:'0',
	content: {
		merge_type: "all",
		distinct: true,
		field: objVal,
		site_code: "",
		searches: []
	}
}
const defaultDialogForm = ['', '', '']
const defaultHavingWhere =  ['', '', '', '']
export default {
	name: 'ScreenUser',  
	components:{dateArea},
	data() {
		return {	
			dateObjs:{},
			isRelative: false,
			relativeTime1:'',
			relativeTime2:'',
			betweenTime: '',
			dialogFormVisible: false,
			dialogHavingWhereVisible: false,
			isShowTime: false,
			timeVisible: false,
			objVal: objVal,
			site_code: '',
			site_id: '',
			timeArea:[],
			selectVal: '',
			visible: false,	
			isAllSite:'0',
			groupList: [],
			siteList: [], // 站点数据	
			siteList1: {}, // 转汉字
			handlesData: {}, // 行为数据
			handleInfoData: { // 行为对应维度数据
				group: [],
				fields: [],
			},
			resultData: [], // 查询结果
			resultAllData: 0, // 符合条件查询结果
			wayData: [ //自定义筛选方式
				{
					label: '大于',
					value: '>'
				},
				{
					label: '小于',
					value: '<'
				},
				{
					label: '等于',
					value: '='
				},
				{
					label: '大于等于',
					value: '>='
				},
				{
					label: '小于等于',
					value: '<='
				},
				{
					label: '时间',
					value: 'time'
				},
				{
					label: '区间',
					value: '~'
				},
			],
			countData: [ //自定义筛选方式
				{
					label: '合计',
					value: 'sum'
				},
				{
					label: '平均',
					value: 'avg'
				},
				{
					label: '最大值',
					value: 'max'
				},
				{
					label: '最小值',
					value: 'min'
				},
				{
					label: '计数',
					value: 'count'
				},	
			],
			// timeData: [ 
			// 	{
			// 		label: '上一个小时',
			// 		value: '-1 hour'
			// 	},
			// 	{
			// 		label: '昨天',
			// 		value: '-1 day'
			// 	},
			// 	{
			// 		label: '最近一周',
			// 		value: '-1 week'
			// 	},	
			// 	{
			// 		label: '最近一个月',
			// 		value: '-1 month'
			// 	},	
			// ],
			form: Object.assign({}, defaultForm), // 筛选行为对象表
			dialogForm: Object.assign({}, defaultDialogForm), // 筛选条件
			havingWhere: Object.assign({}, defaultHavingWhere), // 筛选条件
			postData:  Object.assign({}, defaultPostData), // 提交保存表
		}
	},
	watch:{
		timeVisible(val){
			if(val){
				this.$refs.dateArea.postToTime(this.timeArea)
			}
		}
	},
	created() {
		this.setDefaultTime()
		this.getSiteData()
		this.clearDefault()
		this.postData.content.searches = []
  	},
	methods: {  
		desMsg(obj, ind){
			// return obj.group.length > 0 ? '维度：' + obj.group.join(',') : '' + obj.where.length > 0 ?  ' 筛选：'+ obj.where.join(',') + obj.having.length > 0 ? ' 维度筛选：' + this.getHavingStr(obj.having) : ''
			// console.log('obj', obj)
			// console.log(obj.group.join(','))
			const group = obj.group.length > 0 ? ' 需要汇总字段：' + obj.group.join(',') : ''
			const where = obj.where.length > 0 ? ' 筛选条件：' + obj.where.join(',') : ''
			const having = obj.having.length > 0 ? ' 汇总字段筛选：' + this.getHavingStr(obj.having) : ''
			const data = this.resultData.length > 0 ? '查询结果: ' + this.resultData[ind] : ''

			return  group + where + having + data
		},
		changedTime(data){
			// console.log('data3333',data);
			// console.log(data.type);
			if(data.type == 'rel'){
				this.isRelative = true
				this.dateObjs.start_time = data.dates[0]
				this.dateObjs.end_time = data.dates[1]
				this.dateObjs.time_unit = data.time_unit
				// if(this.dateObjs.start_time == this.dateObjs.end_time){
				// this.relativeTime1 = this.dateObjs.start_time +' '+ getDateName(data.time_unit,0)
				// this.relativeTime2 = ''
				// }else{
				this.relativeTime1 = this.dateObjs.start_time +' '+ getDateName(data.time_unit,0)
				this.relativeTime2 = this.dateObjs.end_time +' '+ getDateName(data.time_unit,1)
				// }
			}else{
				this.isRelative = false
				this.dateObjs.start_time = getDatetr(data.dates[0],'-')
				this.dateObjs.end_time = getDatetr(data.dates[1],'-') 
				this.timeArea = [this.dateObjs.start_time,this.dateObjs.end_time] 
				console.log('this.timeArea',this.timeArea);
			}
			this.timeVisible = false
		},
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
		changeType(val){
			// if(val !='time'){
				this.dialogForm[2] = ''
			// }
		},
		handleSelectSite(val){
			this.getHandleData()
			this.form.db_table = ''
		},
		getHandleData(){			
			const params = {
				field: this.objVal,
				site_code: this.form.site_code,
			}
			getHandles(params).then((res) => {
				this.handlesData = {...res.data}
			})
		},
		getHandleInfoData(){
			const params = {
				db_table: this.form.db_table,
			}
			const newParams = this.filterNullVal(params)
			getHandleInfo(newParams).then((res) => {			
				this.handleInfoData = {...res.data}
				this.showTime()
			})
		},
		getSiteData() {	
			// 获取站点 
			let that = this
			const siteData = getSite() 
			if(siteData.length > 0){
				this.siteList = siteData
				this.siteList.unshift({site_id: '0', site_name: '数据中心'})
				that.siteList.forEach(item => {
					let site_id = item.site_id
					let site_name = item.site_name
					that.siteList1[site_id] = site_name
				})
			}else{
				getSiteList().then(res => {         
					that.siteList = [...res.data]
					setSite(res.data)
					this.siteList.unshift({site_id: '0', site_name: '数据中心'})
					that.siteList.forEach(item => {
						let site_id = item.site_id
						let site_name = item.site_name
						that.siteList1[site_id] = site_name
					})
				})
			}
		},	
		// 判断是否显示时间插件
		showTime(){
			// console.log(this.handleInfoData.fields.timeline)
			if(this.handleInfoData.fields.timeline){
				this.isShowTime = true
			}else{
				this.isShowTime = false
			}
		},
		handleSelectHandles(val){
			if(val != ''){
				this.getHandleInfoData()
				this.groupList = []
				// this.resultData = []
			}			
		},
		handleAddFilter(){
			this.dialogFormVisible = true
		},
		handleAddGroupFilter(){
			this.dialogHavingWhereVisible = true
		},
		changeArr(obj){
			let arr = []
			for(const i in obj){
				arr.push(obj[i])
			}
			return arr
		},
		handleSave(){
			if(!JSON.stringify(this.form.where).includes(JSON.stringify(this.dialogForm))){
				if(this.dialogForm[1]=='time'){
					if(this.isRelative){
						let time1 = '-'+this.dateObjs.start_time+' '+this.dateObjs.time_unit
						this.dialogForm[2] = time1
						if(this.dateObjs.end_time){
							let time2 = ''
							time2 = '-'+this.dateObjs.end_time+' '+this.dateObjs.time_unit
							this.dialogForm[2] = time1+','+time2
						}
					}else{
						this.dialogForm[1] = '~'
						this.dialogForm[2] = this.dateObjs.start_time+','+this.dateObjs.end_time
					}
				}
				this.form.where.push(this.changeArr(this.dialogForm))
				
			}else{
				this.$message.warning('请勿填写重复内容')
			}	
			this.dialogForm = Object.assign({}, defaultDialogForm) 
			this.dialogFormVisible = false
		},	
		handleHavingSave(){	
			if(!JSON.stringify(this.form.where).includes(JSON.stringify(this.dialogForm))){
				this.form.having.push(this.havingWhere)
			}else{
				this.$message.warning('请勿填写重复内容')
			}	
			this.havingWhere = Object.assign({}, defaultHavingWhere) 			
			this.dialogHavingWhereVisible = false
		},		
		// 设置默认时间为前一天
		setDefaultTime(){
			var date = new Date();
			var nowYear = date.getFullYear();
			var month = ("0" + (date.getMonth() + 1)).slice(-2); 
			var day = ("0" + date.getDate()).slice(-2);
			var today = nowYear+"-"+(month)+"-"+(day);
			var yesterday = nowYear+"-"+(month)+"-"+(day-1);
			// 默认日期赋值为前一天
			this.betweenTime = [yesterday, today]
		},
		// 拼接时间到where中
		concatTime(form){			
			if(this.isShowTime){
				const arr = [
					['timeline', '>=', this.betweenTime[0]], 
					['timeline', '<', this.betweenTime[1]]
				]
				form.where.push(...arr)		
			}
			return form	
		},
		// 继续添加-执行
		continueAdd(){	
			this.getResults()
			this.postData.field = this.objVal
			this.postData.content.field = this.objVal
			this.postData.content.site_code = this.form.site_code
			this.site_code = this.form.site_code
			// this.handleGropList()
			this.form.field = this.objVal
			// console.log(this.form)
			if(this.form.db_table != ''){
				this.postData.content.searches.push(this.form)
			}				
			this.clearDefault()
			this.setDefaultTime()
		},	
		// 单个条件查询查询结果
		getResults(){	
			let that = this
			this.handleGropList()
			this.form.field = this.objVal
			let paramsData = JSON.parse(JSON.stringify(this.form))
			paramsData = this.concatTime(paramsData)
			if(paramsData.db_table == ''){
				this.$message.warning('请先选择站点和行为');
				return false
			}
			searchMyFilter(paramsData).then( res => {
				let num = res.data ? res.data : 0
				that.resultData.push(parseInt(num))
				// if(this.resultData <= 0){
				// 	this.$message.error('未查询到数据')
				// }
			})
		},
		// 复合条件查询
		handleSaveAll(){
			searchMyFilters(this.postData.content).then( res => {
				this.resultAllData = res.data
			})
		},
		// 保存本次筛选条目
		submitSaveFilter(){	
			// 调用继续添加
			// this.continueAdd()
			this.postData.field = this.objVal
			this.postData.content.field = this.objVal
			this.postData.content.site_code = this.site_code
			if (this.postData.content.searches.length <= 0){
				this.$message.warning('筛选项不能为空！');
				return false
			}else if(this.postData.title == ''){
				this.$message.warning('请输入筛选条目名称！');
				return false
			}else if(this.postData.des == ''){
				this.$message.warning('请输入筛选条目描述性文字！');
				return false
			}
			if(this.isAllSite=='1'){
				this.postData.content.searches = this.postData.content.searches.map((re)=>{
					if(re.db_table && re.db_table.indexOf('.') != -1){
						re.db_table = re.db_table.substring(re.db_table.indexOf('.')+1)
						return re
					}
				})
			}
			// console.log('this.postData',this.postData.content);
			// return

			this.visible = false
			postMyFilter(this.postData).then((res) => {
				// 清空默认值
				this.postData = JSON.parse(JSON.stringify(defaultPostData))
				this.postData.content.searches = []
				this.postData.content.site_code = ''
				this.site_code = ''
				this.resultAllData = 0
				this.form = JSON.parse(JSON.stringify(defaultForm))
				if(res.code == 20000){
					this.$message.success('保存成功！');
				}		
			})
		},
		handleDelTag(form, index){
			form.splice(index, 1)
		},
		handleGropList(){
			if(this.groupList.length > 0 && this.groupList.indexOf('user_id') == -1){
				this.form.group = JSON.parse(JSON.stringify(this.groupList))
				this.form.group.push('user_id')
			}else{
				this.form.group = JSON.parse(JSON.stringify(this.groupList))
			}
		},
		// 清除默认值
		clearDefault(){
			// const site_code = this.form.site_code
			this.form = Object.assign({}, defaultForm)
			// this.form.site_code = site_code
			this.form.where = []
			this.form.having = []
			this.groupList = []
			this.dialogForm = Object.assign({}, defaultDialogForm) 
			this.havingWhere = Object.assign({}, defaultHavingWhere) 
		},
		// 拼接显示值
		splitVal(obj){
			let val = ''
			for(let i in obj){
				val = val + obj[i]
				if(val.indexOf('time-') != -1){
					val = val.replace(/time-/g,',time-');
				}
			}
			return val
		},
		getHavingStr(obj){
			// console.log('having1', obj)
			let val = ''
			obj.map(item => {
				// console.log(item)
				for(let i in item){
					val = val + item[i]
				}
				val = val + ','
			})
			return val
		},

	}
}
</script>

<style lang="scss">
/* .app-container{
	padding: 10px;
	height: 90vh;
} */
.user-filter-wrap{
	display: block;
	height: 85vh;
	.aaa{
		position: relative;
		top: -25px;
		left: 80px;
		z-index: 10;
	}
	.el-header, .el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
	}
	.border-left{
		height: 100%;
		padding-left: 10px;
		border-left: 1px solid #cbc6c6;
	}	
	.border-none{
		border: none;
	}
	.step-tit{
		margin-bottom: 15px;		
	}
	.el-aside {
		background-color: #D3DCE6;
		color: #333;
		text-align: center;
		line-height: 200px;
	}
	
	.el-main {
		background-color: #E9EEF3;
		color: #333;
		text-align: center;
		line-height: 160px;
	}
	
	body > .el-container {
		margin-bottom: 40px;
	}
	
	.el-container:nth-child(5) .el-aside,
	.el-container:nth-child(6) .el-aside {
		line-height: 260px;
	}
	
	.el-container:nth-child(7) .el-aside {
		line-height: 320px;
	}
	.filter-tip{
		font-size: 12px;
	}
	.site-prompt{
		font-size: 12px;
		color: red;
		padding-left: 5px;
		vertical-align: middle;
	}
	.filter-tit{
		font-size: 16px;
		padding-top: 15px;
		padding-bottom: 15px;
		padding-left: 10px;
		margin-bottom: 20px;
		margin-top: 5px;
		background-color: #e8ecf1;
		position: relative;
	}
	.result-data{
		padding-top: 15px;
		text-align: center;	
		span{
			color: #409EFF;
		}
	}
	.row-border{
		border-bottom: 1px solid #999;
		&:last-child{
			border-bottom: none;
		}
	}
	.m-b-5{
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.relative_time{
      display: flex;
    }
}
</style>
