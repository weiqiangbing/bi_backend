<template>
<div class="filter-wrap">
<el-row>
	<div class="filter-tit">
		<span>书籍筛选</span>
		<div class="save-msg-btn">
			<el-popover
				placement="right"
				width="400"
				v-model="visible"
				trigger="click">
				<el-form>
					<el-form-item label="筛选条目名称">
						<el-input v-model="postData.title" placeholder="未命名"></el-input>
					</el-form-item>
					<el-form-item label="筛选条目描述">
						<el-input v-model="postData.des" placeholder="请输入筛选描述"></el-input>
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
	</div>
</el-row>

<el-row>
	<!-- <el-col :span="12">
		<el-form ref="form" :model="form" label-width="80px">		
			<el-form-item label="行为">
				<el-select v-model="form.db_table" placeholder="请选择筛选行为" @change="handleSelectHandles">
					<el-option v-for="(value, key, index) in handlesData" :key="key" :label="value" :value="key"></el-option>
				</el-select>
			</el-form-item>			
			<el-form-item label="维度">
				<el-select v-model="groupList" multiple placeholder="请选择维度">
					<el-option v-for="(value, key, index) in handleInfoData.group" :key="key" :label="value" :value="key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-show="isShowTime" label="时间">
				<el-date-picker
					v-model="betweenTime"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="yyyy-MM-dd">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="筛选">
				<el-button size="mini" type="primary" @click="handleAddFilter">添加筛选条件</el-button>
				<div>
					<el-tag closable v-for="(item, index) in form.where" :key="index" @close="handleDelTag(form.where, index)">{{splitVal(item)}}</el-tag>
				</div>
			</el-form-item>	
			<el-form-item label="维度筛选">
				<el-button size="mini" type="primary" @click="handleAddGroupFilter">添加筛选条件</el-button>
				<div>
					<el-tag closable v-for="(item, index) in form.having" :key="index" @close="handleDelTag(form.having, index)">{{splitVal(item)}}</el-tag>
				</div>
			</el-form-item>	
			<el-form-item>
				<el-button type="success" plain @click="getResults">查询</el-button>
				<el-button type="info" plain @click="continueAdd">继续添加</el-button>	
			</el-form-item> 
		</el-form>
		<div class="result-data">
			<div v-if="resultData > 0">
				一共查到<span>{{resultData}}</span>条数据
			</div>
			<div v-else>
				暂无数据
			</div>
		</div>
	</el-col> -->
	<!-- 点击添加筛选条件 -->
	<el-col>
		<el-button class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
	</el-col>
	<el-col :span="12">
		<!-- <div class="filter-tit">我的筛选条目：</div>
		<el-table
		:data="postData.content.searches"
		style="width: 100%">
			<el-table-column
				prop="db_table"
				label="行为">
			</el-table-column>			
			<el-table-column
				prop="group"
				label="维度">
				<template slot-scope="props">
					<el-row v-for="(item, index) in props.row.group" :key="index"><el-tag effect="plain" class="m-b-5" type="info">{{item}}</el-tag></el-row>
				</template> 
			</el-table-column>
			<el-table-column
				prop="where"
				label="筛选">
				<template slot-scope="props">
					<el-row v-for="(item, index) in props.row.where" :key="index"><el-tag effect="plain" class="m-b-5">{{splitVal(item)}}</el-tag></el-row>
				</template> 
			</el-table-column>
			<el-table-column 
				prop="having" 
				label="维度筛选">
				<template slot-scope="props">
					<el-row v-for="(item, index) in props.row.having" :key="index"><el-tag effect="plain" type="success" class="m-b-5">{{splitVal(item)}}</el-tag></el-row>
				</template>  
			</el-table-column>
		</el-table> -->
		<div>
			<el-form>
				<el-row>
					<el-col :span="12">
						<el-form-item label="结果取交集或并集">
							<el-radio-group v-model="postData.content.merge_type">
								<el-radio label="common">交集</el-radio>
								<el-radio label="all">并集</el-radio>
							</el-radio-group>
						</el-form-item>						
					</el-col :span="12">
					<el-col :span="12">
						<el-form-item label="结果是否去重">
							<el-radio-group v-model="postData.content.distinct">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>			
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="结果取交集或并集">
							<el-radio-group v-model="postData.content.merge_type">
								<el-radio label="common">交集</el-radio>
								<el-radio label="all">并集</el-radio>
							</el-radio-group>
						</el-form-item>						
					</el-col :span="12">
					<el-col :span="12">
						<el-form-item label="结果是否去重">
							<el-radio-group v-model="postData.content.distinct">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>			
				</el-row>
			</el-form>			
		</div>
		<div>			
			<el-steps :active="postData.content.searches.length" direction="vertical" align-center>	
				<el-step v-for="item in postData.content.searches" :title="handlesData[item.db_table]" :description="desMsg(item)"></el-step>
			</el-steps>
		</div> 
		<div style="margin-top: 30px;">
			<el-button type="primary" @click.native="handleSaveAll">总查询</el-button>
		</div>		
		<div class="result-data">
			<div v-if="resultAllData > 0">
				一共查到<span>{{resultAllData}}</span>条数据
			</div>
			<div v-else>
				暂无数据
			</div>
		</div>
	</el-col>
</el-row>
	
<!-- 添加筛选条件的弹框 -->
<el-dialog
	title="添加筛选项" 
	width="25%" 
	:visible.sync="inputVisible" >
	<el-form ref="form" :model="form" label-width="80px">		
		<el-form-item label="行为">
			<el-select v-model="form.db_table" placeholder="请选择筛选行为" @change="handleSelectHandles">
				<el-option v-for="(value, key, index) in handlesData" :key="key" :label="value" :value="key"></el-option>
			</el-select>
		</el-form-item>			
		<el-form-item label="维度">
			<el-select v-model="groupList" multiple placeholder="请选择维度">
				<el-option v-for="(value, key, index) in handleInfoData.group" :key="key" :label="value" :value="key"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item v-show="isShowTime" label="时间">
			<el-date-picker
				v-model="betweenTime"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				value-format="yyyy-MM-dd">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="筛选">
			<el-button size="mini" type="primary" @click="handleAddFilter">添加筛选条件</el-button>
			<div>
				<el-tag closable v-for="(item, index) in form.where" :key="index" @close="handleDelTag(form.where, index)">{{splitVal(item)}}</el-tag>
			</div>
		</el-form-item>	
		<el-form-item label="维度筛选">
			<el-button size="mini" type="primary" @click="handleAddGroupFilter">添加筛选条件</el-button>
			<div>
				<el-tag closable v-for="(item, index) in form.having" :key="index" @close="handleDelTag(form.having, index)">{{splitVal(item)}}</el-tag>
			</div>
		</el-form-item>	
		<el-form-item>
			<el-button type="success" plain @click="getResults">查询</el-button>
			<el-button type="info" plain @click="continueAdd">继续添加</el-button>	
		</el-form-item> 
	</el-form>
	<div class="result-data">
		<div v-if="resultData > 0">
			一共查到<span>{{resultData}}</span>条数据
		</div>
		<div v-else>
			暂无数据
		</div>
	</div>
</el-dialog>

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
      <el-select v-model="dialogForm[1]" placeholder="请选择筛选方式">
        <el-option v-for="item in wayData" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
	<el-form-item label="请选择判断条件值" style="width:326px">
		<el-input placeholder="请输入条件值" v-model="dialogForm[2]"></el-input>
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
    <el-form-item label="请选择筛选字段">
      <el-select v-model="havingWhere[0]" placeholder="请选择筛选字段">
			<el-option v-for="(value, key, index) in handleInfoData.having" :key="key" :label="value" :value="key"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="请选择筛选方式">
      <el-select v-model="havingWhere[1]" placeholder="请选择筛选方式">
        <el-option v-for="item in wayData" :key="item.label" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>	
	<el-form-item label="请选择判断条件值">
		<el-input v-model="havingWhere[2]" placeholder="请输入条件值" style="width:200px"></el-input>
	</el-form-item>
	<el-form-item label="请选择筛选求和">
      <el-select v-model="havingWhere[3]" placeholder="请选择筛选求和">
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

const objVal = 'book_id'
const defaultForm = { // 筛选行为对象表
	db_table: '',
	group: [],
	field: '',
	where: [],	
	having: [],
}
const defaultPostData = { // 提交保存表
	title: "",
	des: "",
	field: objVal,
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
  	name: 'ScreenBook',  
	data() {
		return {	
			inputVisible: false,
			inputValue: '',
		
			betweenTime: '',
			dialogFormVisible: false,
			dialogHavingWhereVisible: false,
			isShowTime: false,
			objVal: objVal,
			selectVal: '',
			visible: false,	
			groupList: [], // 记录维度，根据需求添加类型id	
			handlesData: {}, // 行为数据
			handleInfoData: { // 行为对应维度数据
				group: [],
				fields: [],
			},
			resultData: 0, // 查询结果
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
			form: Object.assign({}, defaultForm), // 筛选行为对象表
			dialogForm: Object.assign({}, defaultDialogForm), // 筛选条件
			havingWhere: Object.assign({}, defaultHavingWhere), // 维度筛选条件
			postData:  Object.assign({}, defaultPostData), // 提交保存表
		}
	},
	created() {
		this.getHandleData()
		this.setDefaultTime()
		this.clearDefault()
		this.postData.content.searches = []
	},
	methods: { 
		desMsg(obj){
			// return obj.group.length > 0 ? '维度：' + obj.group.join(',') : '' + obj.where.length > 0 ?  ' 筛选：'+ obj.where.join(',') + obj.having.length > 0 ? ' 维度筛选：' + this.getHavingStr(obj.having) : ''
			// console.log('obj', obj)
			// console.log(obj.group.join(','))
			const group = obj.group.length > 0 ? ' 维度：' + obj.group.join(',') : ''
			const where = obj.where.length > 0 ? ' 筛选：' + obj.where.join(',') : ''
			const having = obj.having.length > 0 ? ' 维度筛选：' + this.getHavingStr(obj.having) : ''
			return  group + where + having
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
		getHandleData(){			
			const params = {
				field: this.objVal,
			}
			const newParams = this.filterNullVal(params)
			getHandles(newParams).then((res) => {
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
		// 判断是否显示时间插件
		showTime(){
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
				this.resultData = 0
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
		// 保存本次筛选条目
		submitSaveFilter(){	
			// 调用继续添加
			this.continueAdd()	
			this.postData.field = this.objVal
			this.postData.content.field = this.objVal
			this.postData.content.site_code = this.form.site_code
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
			this.visible = false
			postMyFilter(this.postData).then((res) => {
				// 清空默认值
				this.postData =  JSON.parse(JSON.stringify(defaultPostData))
				this.postData.content.searches = []
				if(res.code == 20000){
					this.$message.success('保存成功！');
				}		
			})
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
			this.handleGropList()
			this.form.field = this.objVal
			if(this.form.db_table != ''){
				this.postData.content.searches.push(this.form)
			}				
			this.clearDefault()
			this.setDefaultTime()
		},
		// 清除默认值
		clearDefault(){
			this.form = Object.assign({}, defaultForm)
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
		// 查询结果
		getResults(){	
			let that = this
			this.handleGropList()
			this.form.field = this.objVal
			let paramsData = JSON.parse(JSON.stringify(this.form))
			paramsData = this.concatTime(paramsData)
			if(paramsData.db_table == ''){
				this.$message.warning('请先选择行为');
				return false
			}
			searchMyFilter(paramsData).then( res => {
				that.resultData = res.data
				if(this.resultData <= 0){
					this.$message.error('未查询到数据')
				}
			})
		},
		// 复合条件查询
		handleSaveAll(){
			searchMyFilters(this.postData.content).then( res => {
				this.resultAllData = res.data
			})
		},
		handleDelTag(form, index){
			form.splice(index, 1)
		},
		handleGropList(){
			if(this.groupList.length > 0 && this.groupList.indexOf('book_id') == -1){
				this.form.group = JSON.parse(JSON.stringify(this.groupList))
				this.form.group.push('book_id')	
			}else{
				this.form.group = JSON.parse(JSON.stringify(this.groupList))
			}
		},




		showInput() {
			this.inputVisible = true;
			// this.$nextTick(_ => {
			// this.$refs.saveTagInput.$refs.input.focus();
			// });
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
			this.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		}

	}
}
</script>

<style lang="scss">
.app-container{
	padding: 30px;
}
.filter-wrap{

	.el-tag + .el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-header, .el-footer {
		background-color: #B3C0D1;
		color: #333;
		text-align: center;
		line-height: 60px;
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
		text-align: left;
		padding-left: 200px;
		padding-top: 50px;
		span{
			color: #409EFF;
		}
	}
	.m-b-5{
		margin-bottom: 5px;
		margin-right: 5px;
	}
	.save-msg-btn{
		position: absolute;
		right: 10px;
		top: 4px;
		z-index: inherit;
	}
}
</style>
