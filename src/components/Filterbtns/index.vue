<template>
<div class="filter-inputs">
  <!-- 筛选 -->
  <div class="filter-container">
    <el-row style="overflow: hidden;">
      <el-select 
        class="mg-btm-20"
        v-if="localFilterConfig.siteId.isShow && isCommon || isAll"
        style="width: 140px;" 
        clearable  
        v-model="listQuery.siteName" 
        :disabled="isMerge"
        filterable 
        :placeholder="localFilterConfig.siteId.placeholder" 
        @change="handleSite">
        <el-option
          v-for="item in siteList"
          :key="item.site_id"
          :label="item.site_name"
          :value="item.site_id"
          >
        </el-option>
      </el-select>
      <el-select 
      class="mg-btm-20"
      v-if="localFilterConfig.platform.isShow && isCommon || isAll"
      style="width: 140px;" 
      clearable  
      :disabled="isMerge"
      v-model="listQuery.platform" 
      filterable 
      :placeholder="localFilterConfig.platform.placeholder" 
      @change="handlePlatform">
        <el-option
          v-for="item in optionsConfig.platformData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
      <!-- 分组查询 -->
      <!-- <el-select
        class="mg-btm-20"
        v-if="localFilterConfig.group.isShow"
        style="width: 180px;"
        v-model="groupList"
        multiple
        :disabled="isMerge"
        collapse-tags
        :placeholder="localFilterConfig.group.placeholder"
        @change="handleGroupList">
        <el-option
          v-for="item in groupListData"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select> -->
      <!-- 授权渠道 -->
      <el-select
        class="mg-btm-20"
        v-if="localFilterConfig.outSite.isShow && isCommon || isAll"
        style="width: 180px;"
        v-model="outsiteVals"
        multiple
        :disabled="isMerge"
        collapse-tags
        :placeholder="localFilterConfig.outSite.placeholder"
        @change="handleOutSite">
        <el-option
          v-for="item in outsitesList"
          :key="item.outsite"
          :label="item.outsite_name"
          :value="item.outsite">
        </el-option>
      </el-select>

      <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.sectionId.isShow && isCommon || isAll"
        style="width: 140px;" 
        clearable  
        :disabled="isMerge"
        v-model="listQuery.section_id" 
        filterable 
        :placeholder="localFilterConfig.sectionId.placeholder" 
        >
        <el-option
          v-for="item in sectionList"
          :key="item.section_id"
          :label="item.section_name"
          :value="item.section_id">
        </el-option>
      </el-select>
      <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.classId.isShow && isCommon || isAll"
        style="width: 140px;" 
        clearable  
        :disabled="isMerge"
        v-model="listQuery.class_id" 
        filterable 
        :placeholder="localFilterConfig.classId.placeholder" 
        >
        <el-option
          v-for="item in classList"
          :key="item.class_id"
          :label="item.class_name"
          :value="item.class_id">
        </el-option>
      </el-select>
      <el-input
        :disabled="isMerge"
        v-if="localFilterConfig.authorName.isShow && isCommon || isAll"
        v-model="listQuery.author_name"
        :placeholder="localFilterConfig.authorName.placeholder"
        clearable
        style="width: 140px;">
      </el-input>
      <!-- 指定id搜索和群组搜索合并 2019.12.16 -->
      <span style="display: inline-block;height: 40px;" class="mg-btm-20" v-if="(localFilterConfig.bookId ? localFilterConfig.bookId.isShow : false) || (localFilterConfig.user_id ? localFilterConfig.user_id.isShow : false)" v-show="!isCommon || isAll">
        <el-dropdown trigger="click" @command="handleGroupCommand" class="el-dropdown-border">
          <span class="el-dropdown-link">
            {{bookText}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">            
            <el-dropdown-item command="book_id" v-show="localFilterConfig.bookId.isShow">书籍ID搜索</el-dropdown-item>
            <el-dropdown-item command="user_id" v-show="localFilterConfig.user_id.isShow">用户ID搜索</el-dropdown-item>
            <el-dropdown-item command="user_group" v-show="localFilterConfig.userGroup.isShow && !(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)">用户群组搜索</el-dropdown-item>
            <el-dropdown-item command="book_group" v-show="localFilterConfig.bookGroup.isShow && !(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)">书籍群组搜索</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- </el-date-picker> -->
        <el-input
          :disabled="isMerge"
          class="book_id"
          v-if="localFilterConfig.bookId.isShow && listQuery.group_type == 'book_id'"
          v-model="listQuery.book_id" 
          :placeholder="localFilterConfig.bookId.placeholder"
          clearable
          style="width: 140px;">
          <!-- :type="listQuery.book_id.length > 12 ? 'textarea' : 'text'" -->
        </el-input>        
        <el-input
          class="book_id"
          :disabled="isMerge"
          v-if="localFilterConfig.user_id.isShow && listQuery.group_type == 'user_id'"
          v-model="listQuery.user_id" 
          :placeholder="localFilterConfig.user_id.placeholder"
          clearable
          style="width: 140px;" />
        <el-select
          v-if="localFilterConfig.userGroup.isShow && listQuery.group_type == 'user_group'"
          style="width: 140px;"
          v-model="listQuery.searches_user"
          :disabled="isMerge"
          clearable
          :placeholder="localFilterConfig.userGroup.placeholder">
          <el-option
            v-for="item in myGroupData[1]"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>       
        <el-select
          v-if="localFilterConfig.bookGroup.isShow && listQuery.group_type == 'book_group'"
          style="width: 140px;"
          v-model="listQuery.searches_book"
          :disabled="isMerge"
          clearable
          :placeholder="localFilterConfig.bookGroup.placeholder">
          <el-option
            v-for="item in myGroupData[2]"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </span>  
      <!-- 2020.3.27新增章节id  start-->
      <div class="mg-btm-20" style="display: inline-block;">
        <!-- <el-input
          v-if="localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false"
          v-model="listQuery.chapterId"
          :placeholder="localFilterConfig.chapterId.placeholder"
          clearable
          style="width: 140px;">
        </el-input> -->
        <!-- <span class="el-dropdown-link">
          {{timeTypes}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span> -->
        
        <span style="display: flex;" v-if="localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false">   
          <div class="el-dropdown-border el-dropdown" style="float: left;">
            <span class="el-dropdown-link el-dropdown-selfdefine " aria-haspopup="list" aria-controls="dropdown-menu-6831" role="button" tabindex="0">章节序号</span>
          </div>           
          <div style="display: inline-block;width: 300px;display: flex;">
            <div>
              <el-input :disabled="isMerge" v-model="listQuery.min_chapter_code" clearable placeholder="开始章节序号"></el-input>
            </div>
            <div style="width: 30px;text-align: center;line-height: 40px;">
              ~
            </div>
            <div>
              <el-input :disabled="isMerge" v-model="listQuery.max_chapter_code" clearable placeholder="结束章节序号"></el-input>
            </div>
          </div>
        </span>
      </div>

      <el-select 
        class="mg-btm-20"
        v-if="localFilterConfig.userType.isShow"
        style="width: 140px;" 
        clearable  
        :disabled="isMerge"
        v-model="listQuery.user_type" 
        filterable 
        :placeholder="localFilterConfig.userType.placeholder">
        <el-option
          v-for="item in optionsConfig.userTypeData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        class="mg-btm-20"
        v-if="localFilterConfig.userTimeline.isShow"
        style="width: 140px;" 
        v-model="listQuery.user_timeline"
        type="date"
        :disabled="isMerge"
        value-format="yyyy-MM-dd"
        :placeholder="localFilterConfig.userTimeline.placeholder">
      </el-date-picker>

      <div class="mg-btm-20" style="display: inline-block;" v-if="!isCommon || isAll">
        <!-- 新的时间框 -->
        <el-popover
          placement="bottom"
          title=""
          width="auto"
          v-model="timeVisible"
          trigger="click">
          <dateArea @changedTime="changedTime" ref="dateArea"></dateArea>
          
        <div class="mg-btm-20" slot="reference" style="display: inline-block;">
          <div class="relative_time" v-if="isRelative">
            <el-input :readonly="true" v-model="relativeTime1" style="width:120px"></el-input>
            <span v-show="listQuery.end_time" >-</span>
            <el-input :readonly="true" v-if="listQuery.end_time" v-model="relativeTime2" style="width:120px"></el-input>
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

          <el-select v-model="listQuery.time_type" style="width:64px !important">
            <el-option label="日" value="day"></el-option>
            <el-option label="月" value="month"></el-option>
          </el-select>
        </div>
        </el-popover>
        <!-- <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-border" style="float: left;">
          <span class="el-dropdown-link">
            {{timeTypes}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" :disabled="isMerge"> 
            <el-dropdown-item command="relative">时间段(相对)</el-dropdown-item>
            <el-dropdown-item command="absolute">时间段(绝对)</el-dropdown-item>
            <el-dropdown-item command="relative_point">时间(相对)</el-dropdown-item>
            <el-dropdown-item command="absolute_point">时间(绝对)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-if="localFilterConfig.time.isShow && defaultTime == 'absolute'">
          <el-date-picker
            :disabled="isMerge"
            style="width: 300px;"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleTime">
          </el-date-picker>
          <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-date-border" :disabled="isMerge">
            <span class="el-dropdown-link">
              {{timeText}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"> 
              <el-dropdown-item v-show="!(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)" command="month">月</el-dropdown-item>
              <el-dropdown-item command="day">日</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span style="display: flex;" v-if="localFilterConfig.time.isShow && defaultTime == 'relative'">              
          <div style="display: inline-block;width: 300px;display: flex;">
            <div>
              <el-input v-model="listQuery.start_time" placeholder="填写时间" :disabled="isMerge"></el-input>
            </div>
            <div style="width: 30px;text-align: center;line-height: 40px;">
              ~
            </div>
            <div>
              <el-input v-model="listQuery.end_time" placeholder="填写时间" :disabled="isMerge"></el-input>
            </div>
          </div>    
          <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-date-border">
            <span class="el-dropdown-link">
              {{timeTexts}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"> 
              <el-dropdown-item v-show="!(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)" command="month">几月前</el-dropdown-item>
              <el-dropdown-item command="day">几天前</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span style="display: flex;" v-if="localFilterConfig.time.isShow && defaultTime == 'relative_point'">              
          <div style="display: inline-block;width:150px;display: flex;">
            <div>
              <el-input v-model="listQuery.start_time" @blur="handleTimeAbs" placeholder="填写时间" :disabled="isMerge"></el-input>
            </div>
          </div>    
          <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-date-border">
            <span class="el-dropdown-link">
              {{timeTexts}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"> 
              <el-dropdown-item v-show="!(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)" command="month">几月前</el-dropdown-item>
              <el-dropdown-item command="day">几天前</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span v-if="localFilterConfig.time.isShow && defaultTime == 'absolute_point'">
          <el-date-picker
            style="width: 150px;"
            value-format="yyyy-MM-dd"
            :disabled="isMerge"
            v-model="listQuery.start_time"
            type="date"            
            placeholder="选择日期"
            @change="handleTimeAbs">
          </el-date-picker>
          <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-date-border">
            <span class="el-dropdown-link">
              {{timeText}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown"> 
              <el-dropdown-item v-show="!(localFilterConfig.chapterId ? localFilterConfig.chapterId.isShow : false)" command="month">月</el-dropdown-item>
              <el-dropdown-item command="day">日</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span> -->

      </div>
    </el-row>
  </div>
</div>
</template>

<script>
import { getSiteList, getOutsitesList, getSectionList, getClassList, searchMyGroup } from '@/api/public/index'
import { setSearchList, getDatetr } from '@/utils/common'
import { optionsConfig } from '@/utils/optionsConfig'
import { tableColumns } from '@/utils/tableColumns'
import { parseTime } from '@/utils'
import { getSite, setSite, getOutSite, setOutSite, getSection, setSection, getClass, setClass} from '@/utils/auth'
import { getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import dateArea from '@/components/parts/dateArea.vue'
import {getDateName} from '@/utils/assist'

const defaultListQuery = {
  start_time: '',
  end_time: '',
  // relative_start_time: '',
  // relative_end_time: '',
  siteName: '',
  order: '',
  book_id: '',
  site_id: '',
  platform: '',
  week_time: '',
  week_date: '',
  month_time: '',
  day_time: '',
  time_type: 'day',
  group_type: 'book_id',  
  outsite: '', // 授权渠道
  section_id: '', // 频道（男频 女频 漫画）
  class_id: '', // 分类
  user_type: '',
  user_timeline: '',
  group: '',
  searches_user: '',
  searches_book: '',
  author_name: '', // 作者
  min_chapter_code: '', // 开始章节序号
  max_chapter_code: '', // 结束章节序号

} // 默认的筛选值
export default {
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 展示数据
    checkedList: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 配置查询条件字段显隐及
    filterConfig: {
      type: Object,
      default: {}
    },
    // 维度列表
    groupListData: {
      type: Array,
      default: function () {
        return []
      }
    },
    isMerge:{
      type: Boolean,
      default: false
    },
    // delectSelect:{
    //   type: Array,
    //   default: []
    // },
    isCommon:{
      type: Boolean,
      default: false
    },
    isAll:{
      type: Boolean,
      default: false
    }
  },
  components:{dateArea},
  data() {
    return {
      visible: false,
      showRatio: false,
      time: '',
      timeText: '日',
      timeTexts: '几天前',
      timeTypes: '时间段(绝对)',
      defaultTime: 'absolute',
      bookText: '书籍 ID 搜索',
      groupVal: '',
      isShowRow: false,
      isGroup: true,
      siteList: [],
      siteList1: {},
      groupList: [], // 分组查询选中值 
      outsitesList: [], // 从缓存中读取渠道数据
      outsiteVals: [], // 授权渠道选中值
      sectionList: [],
      classList: [],
      checkedTit: [],
      timeArea:[],
      isRelative: false,
      timeVisible: false,
      myGroupData: { 1: [], 2: []},
      tableColumn: [...tableColumns],
      localFilterConfig: Object.assign({}, this.filterConfig),	
      listQuery: Object.assign({}, defaultListQuery),
      // listQuery: JSON.parse(JSON.stringify(defaultListQuery)),	
      optionsConfig: Object.assign({}, optionsConfig),
      isInit: false, // 是否走缓存读取数据
    }
  },
  watch: {
    groupListData(){
      if(this.isGroup){
        let str = ''
        const arr = ['user_id', 'book_id']
        const obj = { 
          user_id: 'userGroup',
          book_id: 'bookGroup' 
        }
        this.groupListData.map( item => {
          if(arr.indexOf(item.key) != -1){
            this.localFilterConfig[obj[item.key]].isShow = true
            // if(item.key == 'user_id'){
            //   str = str + '1'
            // }else if (item.key == 'book_id'){
            //   str = str + '2'
            // }  
          }
        })
        // if(str.length > 0) {
        //   this.getGroupState(str.split('').join(','))
        // } 
        this.isGroup = false
        // console.log(111)
        // console.log(this.listQuery)
        if (this.isInit) {

        } else {
          this.getBookText()
        }
      }  
    },
    timeVisible(val){
      if(val){
        this.$refs.dateArea.postToTime(this.timeArea)
      }
    }
  },
  created(){    
    this.getSiteData()
    this.setDefaultTime()
    // 初次进入页面（1）
    if(this.$route.name == 'Chapter'){
      let book_id = this.$route.query.book_id
      this.listQuery.book_id = book_id
      if(!this.listQuery.book_id){
        this.$message.warning('书籍ID不能为空！')
        return false
      }  
    }  
    this.handleFilter()
    this.getGroupState('1,2')
    
  },
  activated() {
    // 页面已被缓存过（2）
    // console.log(this.$route.name == 'Chapter')
    if(this.$route.name == 'Chapter'){
      // let book_id = this.$route.query.book_id
      // this.listQuery.book_id = book_id
      if(!this.listQuery.book_id && this.tableData.length <= 0){
        this.$message.warning('书籍ID不能为空！')
        return false
      }  
      this.handleFilter()
      this.getGroupState('1,2')
    }
    if(this.$route.query.from == 'my/searchList'){
      this.init()
    }    
  },
  // mounted() {
  //   console.log('mounted', this.listQuery)
  // },
  methods: {
    // 缓存条件赋值 
    init(){
      this.isInit = true
      var that = this      
      var queryData = this.$route.query.listQuery
      if(typeof(this.$route.query.listQuery) == 'object'){ 
        // console.log('queryData', queryData)
        this.listQuery = Object.assign({}, queryData)  
        this.groupList =  this.listQuery.group.length > 0 ?  this.listQuery.group.split(",") : []
        this.outsiteVals =  this.listQuery.outsite.length > 0 ?  this.listQuery.outsite.split(",") : []
        this.outsiteVals = this.outsiteVals.map( str => { return parseInt(str) } );
        this.time = [this.listQuery.start_time, this.listQuery.end_time]
        // this.getBookText()
        // console.log('listQuery', this.listQuery)
        if(this.listQuery.start_time.indexOf('-') == -1){
          if(this.listQuery.start_time == this.listQuery.end_time){
            this.timeTypes = '时间(相对)'
            this.defaultTime = 'relative_point'
          }else{
            this.timeTypes = '时间段(相对)'
            this.defaultTime = 'relative'
          }          
        }else{
          if(this.listQuery.start_time == this.listQuery.end_time){
            this.timeTypes = '时间(绝对)'
            this.defaultTime = 'absolute_point'
          }else{
            this.timeTypes = '时间段(绝对)'
            this.defaultTime = 'absolute'
          }
        }
        this.handleCommand(this.listQuery.time_type)
        this.handleGroupCommand(this.listQuery.group_type)
        this.listQuery.searches_user = queryData.searches_user
        this.listQuery.searches_book = queryData.searches_book
        this.listQuery.book_id = queryData.book_id
        this.listQuery.user_id = queryData.user_id
      }
      this.handleFilter()
      this.getGroupState('1,2')

    },
    // isShowSelect(key){
    //   if(this.isCommon){
    //     if(this.delectSelect.indexOf(key)==-1){
    //       return false
    //     }else{
    //       return true
    //     }
    //   }else{
    //     if(this.delectSelect.indexOf(key)==-1){
    //       return true
    //     }else{
    //       return false
    //     }
    //   }
    // },
    getCheckedTit(){
      this.checkedTit = []
      for(let i in this.tableColumn){ 
        if(this.checkedList.indexOf(this.tableColumn[i].prop) != -1){
          this.checkedTit.push(this.tableColumn[i].label) 
        }    
      }
    },
    changedTime(data){
      // console.log('data3333',data);
      // console.log(data.type);
      if(data.type == 'rel'){
        this.isRelative = true
        this.listQuery.start_time = data.dates[0]
        this.listQuery.end_time = data.dates[1]
        this.listQuery.time_unit = data.time_unit
        // if(this.listQuery.start_time == this.listQuery.end_time){
        //   this.relativeTime1 = this.listQuery.start_time +' '+ getDateName(data.time_unit,0)
        //   this.relativeTime2 = ''
        // }else{
          this.relativeTime1 = this.listQuery.start_time +' '+ getDateName(data.time_unit,0)
          this.relativeTime2 = this.listQuery.end_time +' '+ getDateName(data.time_unit,1)
        // }
      }else{
        this.isRelative = false
        this.listQuery.time_unit = ''
        this.listQuery.start_time = getDatetr(data.dates[0],'-')
        this.listQuery.end_time = getDatetr(data.dates[1],'-') 
        this.timeArea = [this.listQuery.start_time,this.listQuery.end_time] 
        console.log('this.timeArea',this.timeArea);
      }
      this.timeVisible = false
    },
    getBookText(){
      if(this.localFilterConfig.bookId.isShow){
        this.bookText = '书籍 ID 搜索'
        this.listQuery.group_type = 'book_id'
      }if(this.localFilterConfig.user_id.isShow){
        this.bookText = '用户 ID 搜索'
        this.listQuery.group_type = 'user_id'
      }else if(this.localFilterConfig.userGroup.isShow){
        this.bookText = '用户群组搜索'
        this.listQuery.group_type = 'user_group'
      }else if(this.localFilterConfig.bookGroup.isShow){
        this.bookText = '书籍群组搜索'
        this.listQuery.group_type = 'book_group'
      }
    },
    getGroupState(val){
      const params = {type: val}
        searchMyGroup(params).then(res => {
          this.myGroupData = {...res.data}
        })	
    },
    getSiteData() {	
      const that = this   
      const siteData = getSite()  
      const outSiteData = getOutSite()  
      const sectionData = getSection()
      const classData = getClass()
      // 获取站点
      if(siteData.length > 0){
        this.siteList = siteData
          that.siteList.forEach(item => {
            let site_id = item.site_id
            let site_name = item.site_name
            that.siteList1[site_id] = site_name
          })
      }else{
        getSiteList().then(res => {         
          that.siteList = [...res.data]
          setSite(res.data)
          that.siteList.forEach(item => {
            let site_id = item.site_id
            let site_name = item.site_name
            that.siteList1[site_id] = site_name
          })
        })
      }
      // 获取渠道
      if(outSiteData.length > 0){
        this.outsitesList = outSiteData
      }else{
        getOutsitesList().then(res => {
          this.outsitesList = [...res.data]
          setOutSite(res.data)
        })	
      }  

      // 获取频道
      if(sectionData.length > 0){
        this.sectionList = sectionData
      }else{
        getSectionList().then(res => {
          this.sectionList = [...res.data]
          setSection(res.data)
        })	
      } 
      // 获取分类
      if(classData.length > 0){
        this.classList = classData
      }else{
        getClassList().then(res => {
          this.classList = [...res.data]
          setClass(res.data)
        })	
      }
    },
    handleGroupList(val){
      this.groupStr = val.toString()
      // const groupStr = this.groupList.join(",")
      this.listQuery.group = this.groupStr
    },
    handleOutSite(val){
      this.outSiteStr = val.toString()
      // const groupStr = this.groupList.join(",")
      this.listQuery.outsite = this.outSiteStr
    },
    handleCommand(command) {
      // 根据条件渲染对应文案
      if(this.defaultTime.indexOf('absolute') != -1 && command == 'day'){
        this.timeText = '日'
      }else if(this.defaultTime.indexOf('absolute') != -1 && command == 'week'){
        this.timeText = '周'
      }else if(this.defaultTime.indexOf('absolute') != -1 && command == 'month'){
        this.timeText = '月'
      }

      if(this.defaultTime.indexOf('relative') != -1 && command == 'day'){
        this.timeTexts = '几天前'
      }else if(this.defaultTime.indexOf('relative') != -1 && command == 'week'){
        this.timeTexts = '几周前'
      }else if(this.defaultTime.indexOf('relative') != -1 && command == 'month'){
        this.timeTexts = '几月前'
      }
      // 清空默认值，动态改变文案
      if(command == 'relative'){
        this.timeTypes = '时间段(相对)'
        this.defaultTime = 'relative'
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
        this.listQuery.time_type = 'day'
        this.timeText = '日'
        this.timeTexts = '几天前'
      }else if(command == 'absolute'){
        this.setDefaultTime()
        this.listQuery.time_type = 'day'
        this.timeText = '日'
        this.timeTexts = '几天前'
        this.timeTypes = '时间段(绝对)'
        this.defaultTime = 'absolute'
      }else if(command == 'relative_point'){
        this.timeTypes = '时间(相对)'
        this.defaultTime = 'relative_point'
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
        this.listQuery.time_type = 'day'
        this.timeText = '日'
        this.timeTexts = '几天前'
      }else if(command == 'absolute_point'){
        this.setDefaultTime()
        this.listQuery.time_type = 'day'
        this.timeText = '日'
        this.timeTexts = '几天前'
        this.timeTypes = '时间(绝对)'
        this.defaultTime = 'absolute_point'
      }else{
        this.listQuery.time_type = command
      }
      // console.log('listQuery', this.listQuery)
    },
    handleGroupCommand(command) {
      // console.log('command',command)
      // this.listQuery = Object.assign({}, defaultListQuery)  
      if(command == 'book_id'){
        this.bookText = '书籍 ID 搜索'
      }else if(command == 'user_id'){
        this.bookText = '用户 ID 搜索'
      }else if(command == 'user_group'){
        this.bookText = '用户群组搜索'
      }else if(command == 'book_group'){
        this.bookText = '书籍群组搜索'
      }
      this.listQuery.group_type = command
      // if(this.$route.query.from != 'my/searchList'){
        this.listQuery.searches_user = ''
        this.listQuery.searches_book = ''
        this.listQuery.book_id = ''
        this.listQuery.user_id = ''
      // }
      
    },
    // 查询数据
		handleFilter() {
      this.currentPage = 1
      if(this.$route.name == 'Chapter'){
        if(!this.listQuery.book_id){
          this.$message.warning('书籍ID不能为空！')
          return false
        } 
        // this.handleFilter()
        // this.getGroupState('1,2')
      }
      // console.log('this.listQuery',this.listQuery);
      
      this.$emit('handleFilter', this.listQuery)
      // this.listData()  
    },
    // 重置
		handleReset() {
      this.listQuery = Object.assign({}, defaultListQuery)
      // this.time = ''
      this.groupList= []
			this.setDefaultTime()
    },
    handleSite(item) {
			this.listQuery.site_id = item
    },
    handlePlatform(item) {
      this.listQuery.platform = item
    },
    handleTime(res){
      this.listQuery.start_time = res[0]
      this.listQuery.end_time = res[1]           
    },
    handleTimeAbs(){  
      this.listQuery.end_time = this.listQuery.start_time
    },
    handleWeek(date){
			const week = this.getWeek(date)
			this.listQuery.start_time = week
    },
    getWeek (date){
			let nowDate = new Date(date)
			let firstDay = new Date(date)
			// const y = new Date(date).getFullYear();  
			// console.log(y)
			firstDay.setMonth(0)  //设置1月
			firstDay.setDate(1) //设置1号
			let diffDays = Math.ceil((nowDate - firstDay)/(24*60*60*1000))
			let week = Math.ceil(diffDays/7)
			return week + 1 == 53 ? 1 : week + 1
    },
    // 设置默认时间
		setDefaultTime(){
			var date = new Date()
			var nowYear = date.getFullYear()
			var month = ("0" + (date.getMonth() + 1)).slice(-2)
			var day = ("0" + date.getDate()).slice(-2)
      var today = nowYear+"-"+(month)+"-"+(day)
      var yesterday = nowYear+"-"+(month)+"-"+(day-1)
      // 默认日期赋值为前一天
      this.timeArea = [yesterday, today]
      this.listQuery.start_time = yesterday
      this.listQuery.end_time = today
    },
    aaa(name){
      const arr = getHistorySearchList()
        return new Promise((resolve, reject) => {  
          // if(arr != null){
            arr.map(item => {
              if(item.name == name){
                reject(new Error('fail'))  
              }  
            })  
            resolve(true)     
        })     
    },

  }
}
</script>

<style lang="scss">
  .filter-inputs{
    .filter-container{
      overflow: hidden;
    }
    .el-dropdown-border{
      position: relative;
      right: -5px;
      top: 0;
      padding: 11px 6px;
      border-radius: 4px 0 0 4px;
      border: 1px solid #DCDFE6;
      border-right: none;
    }
    .el-dropdown-date-border{
      position: relative;
      left: -5px;
      top: 0;
      padding: 11px 6px;
      border-radius: 0 4px 4px 0;
      border: 1px solid #DCDFE6;
      border-left: none;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .pd-top-20{
      padding-top: 20px;
    }
    .mg-btm-20{
      margin-bottom: 10px;
    }
    .book_id{
      textarea {
        height: 40px;
        padding: 8px 15px;
      }
    }
    .check-row-btn{
      display: inline-block;
      font-size: 20px;
      padding-left: 5px;
      cursor: pointer;
      span{
        font-size: 14px;
        padding-left: 5px;
      }
      i{
        position: relative;
        top: 2px;
        left: 0;
        z-index: inherit;
      }
    }
  }
</style>
