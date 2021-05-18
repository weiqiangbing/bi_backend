<template>
<div class="filter-inputs">
  <!-- 筛选 -->
  <div class="filter-container">
    <el-row style="overflow: hidden;float:left;">
      <el-select 
        class="mg-btm-20"
        v-if="localFilterConfig.siteId.isShow"
        style="width: 140px;" 
        :clearable="!localFilterConfig.siteId.noClearAble"  
        v-model="listQuery.siteName" 
        filterable 
        :placeholder="localFilterConfig.siteId.placeholder" 
        @change="handleSite">
        <el-option
          v-for="item in siteNewList"
          :key="item.site_id"
          :label="item.site_name"
          :value="item.site_id"
          >
        </el-option>
      </el-select>
      <el-select 
      class="mg-btm-20"
      v-if="localFilterConfig.platform.isShow"
      style="width: 140px;" 
      clearable  
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
      <el-select
        class="mg-btm-20"
        v-if="localFilterConfig.group.isShow"
        style="width: 180px;"
        v-model="groupList"
        multiple
        collapse-tags
        :placeholder="localFilterConfig.group.placeholder"
        @change="handleGroupList">
        <el-option
          v-for="item in groupListData"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
      <!-- 充值类型 -->
      <el-select
        class="mg-btm-20"
        v-if="localFilterConfig.recharType && localFilterConfig.recharType.isShow"
        style="width: 180px;"
        v-model="listQuery.topup_type"
        :placeholder="localFilterConfig.recharType.placeholder">
        <el-option label="普通余额充值" value="1"></el-option>
        <el-option label="打折卡" value="5"></el-option>
        <el-option label="月卡" value="4"></el-option>
      </el-select>
      <!-- 授权渠道 -->
      <el-select
        class="mg-btm-20"
        v-if="localFilterConfig.outSite.isShow"
        style="width: 180px;"
        v-model="outsiteVals"
        multiple
        filterable
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
      <!-- <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.outSite.isShow"
        style="width: 140px;" 
        clearable  
        v-model="listQuery.outsite" 
        filterable 
        :placeholder="localFilterConfig.outSite.placeholder"
        >
        <el-option
          v-for="item in outsitesList"
          :key="item.outsite"
          :label="item.outsite_name"
          :value="item.outsite">
        </el-option>
      </el-select>      -->
      <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.sectionId.isShow"
        style="width: 140px;" 
        clearable  
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
        v-if="localFilterConfig.classId.isShow"
        style="width: 140px;" 
        clearable  
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

      <el-select
        class="mg-btm-20" 
        v-if="recomeData.length>0"
        style="width: 140px;" 
        clearable  
        v-model="listQuery.tj_page" 
        filterable 
        placeholder="所在页面" 
        >
        <el-option
          v-for="item in recomeData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <!-- 活动类型 -->
      <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.event_type && localFilterConfig.event_type.isShow"
        @change="changeEventType"
        style="width: 140px;" 
        v-model="listQuery.event_type = localFilterConfig.event_type.default" 
        :placeholder="localFilterConfig.event_type.placeholder">
        <el-option
          v-for="item in eventTypeData"
          :key="item.key"
          :label="item.value"
          :value="item.key">
        </el-option>
      </el-select>
      <!-- 活动id -->
      <el-select
        class="mg-btm-20" 
        v-if="localFilterConfig.event_id && localFilterConfig.event_id.isShow"
        style="width: 140px;" 
        @change="changeActive"
        clearable  
        v-model="listQuery.event_id" 
        filterable 
        :placeholder="localFilterConfig.event_id.placeholder" 
        >
        <el-option
          v-for="item in eventIdData"
          :key="item.event_id"
          :label="item.event_id+'-'+item.event_name"
          :value="item.event_id">
        </el-option>
      </el-select>
      <el-input
        v-if="localFilterConfig.authorName.isShow"
        v-model="listQuery.author_name"
        :placeholder="localFilterConfig.authorName.placeholder"
        clearable
        style="width: 140px;">
      </el-input>
      <!-- 指定id搜索和群组搜索合并 2019.12.16 -->
      <span style="display: inline-block;height: 40px;" class="mg-btm-20" v-if="(localFilterConfig.bookId ? localFilterConfig.bookId.isShow : false) || (localFilterConfig.user_id ? localFilterConfig.user_id.isShow : false)">
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
          v-if="localFilterConfig.user_id.isShow && listQuery.group_type == 'user_id'"
          v-model="listQuery.user_id" 
          :placeholder="localFilterConfig.user_id.placeholder"
          clearable
          style="width: 140px;" />
        <el-select
          v-if="localFilterConfig.userGroup.isShow && listQuery.group_type == 'user_group'"
          style="width: 140px;"
          v-model="listQuery.searches_user"
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
              <el-input v-model="listQuery.min_chapter_code" clearable placeholder="开始章节序号"></el-input>
            </div>
            <div style="width: 30px;text-align: center;line-height: 40px;">
              ~
            </div>
            <div>
              <el-input v-model="listQuery.max_chapter_code" clearable placeholder="结束章节序号"></el-input>
            </div>
          </div>
        </span>
      </div>
      <!-- 2020.3.27新增章节id  end-->
      <el-select 
        class="mg-btm-20"
        v-if="localFilterConfig.userType.isShow"
        style="width: 140px;" 
        clearable  
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
      <!-- 推广类型 -->
      <el-select
          v-if="localFilterConfig.isExtend && localFilterConfig.isExtend.isShow"
          class="mg-btm-20" 
          style="width: 140px;" 
          clearable  
          v-model="listQuery.event_type"  
          placeholder="推广类型">
          <el-option label="推广" value="1"></el-option>
          <el-option label="未推广" value="-1"></el-option>
      </el-select>
      <el-date-picker
        class="mg-btm-20"
        v-if="localFilterConfig.userTimeline.isShow"
        style="width: 140px;" 
        v-model="listQuery.user_timeline"
        type="date"
        value-format="yyyy-MM-dd"
        :placeholder="localFilterConfig.userTimeline.placeholder">
      </el-date-picker>

      <!-- 新的时间框 -->
      <el-popover
       v-if="localFilterConfig.time.isShow"
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

        <el-select v-model="listQuery.time_type" style="width:64px">
          <el-option label="日" value="day"></el-option>
          <el-option label="月" value="month"></el-option>
        </el-select>
      </div>
      </el-popover>
      
      <!-- <div class="mg-btm-20" style="display: inline-block;">
        <el-dropdown trigger="click" @command="handleCommand" class="el-dropdown-border" style="float: left;">
          <span class="el-dropdown-link">
            {{timeTypes}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown"> 
            <el-dropdown-item command="relative">时间段(相对)</el-dropdown-item>
            <el-dropdown-item command="absolute">时间段(绝对)</el-dropdown-item>
            <el-dropdown-item command="relative_point">时间(相对)</el-dropdown-item>
            <el-dropdown-item command="absolute_point">时间(绝对)</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-if="localFilterConfig.time.isShow && defaultTime == 'absolute'">
          <el-date-picker
            style="width: 300px;"
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleTime">
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
        </span>
        <span style="display: flex;" v-if="localFilterConfig.time.isShow && defaultTime == 'relative'">              
          <div style="display: inline-block;width: 300px;display: flex;">
            <div>
              <el-input v-model="listQuery.start_time" placeholder="填写时间"></el-input>
            </div>
            <div style="width: 30px;text-align: center;line-height: 40px;">
              ~
            </div>
            <div>
              <el-input v-model="listQuery.end_time" placeholder="填写时间"></el-input>
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
              <el-input v-model="listQuery.start_time" @blur="handleTimeAbs" placeholder="填写时间"></el-input>
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
        </span>
      </div> -->

      <!-- 是否推广 -->
      <!-- <div class="extend_class"> -->
        <!-- <el-checkbox-group v-model="isExtended" >
          <el-checkbox label="1">推广</el-checkbox>
          <el-checkbox label="-1">未推广</el-checkbox>
        </el-checkbox-group> -->
        
      <!-- </div> -->
      <div class="trem_class">
        <el-tag
          :key="tag.name"
          size="medium"
          @click="clickTag(tag)"
          v-for="(tag, index) in tremTags"
          closable
          @close="handleClose(index)">
          <span v-if="tag.type=='between'">{{tag.name}}：{{tag.num}}-{{tag.num2}}</span>
          <span v-else>{{tag.name}}{{tag.type | filteType}}{{tag.num}}</span>
        </el-tag>
      </div>

    </el-row>
    <!-- class="pd-top-20" -->
    <el-row class="btn_row">
      <el-button
        class="margin-rihgt-10 padding-btn-10" 
        type="success" clearable icon="el-icon-search" 
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
      <el-button 
        style="margin-left: 0;" 
        class="padding-btn-10" 
        :loading="downloadLoading" 
        type="info" 
        v-if="localFilterConfig.downExcelBtn !==false && btnAuth('downExcelBtn')"
        icon="el-icon-download"
        @click="handleDownload">
        导出
      </el-button>
      <el-popover
        v-if="localFilterConfig.saveAsReportBtn !==false && btnAuth('saveAsReportBtn')"
        placement="top"
        width="340"
        v-model="visible">
        <div class="report_box">
          <reportForm ref="reportBox"></reportForm>
          <!-- <p>请编辑搜索名称：</p>
          <el-input
          size="small"
          v-model="searchName"
          placeholder="请编辑搜索名称">
          </el-input> -->
        </div>    
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="handleSaveFilter('table')">确定</el-button>
        </div>
        <el-button 
          slot="reference"
          style="margin-left: 0;" 
          class="padding-btn-10" 
          icon="el-icon-printer"
          type="warning">
          保存报表
        </el-button>
      </el-popover>
      <!-- 组合查询 -->         
        <el-button
          v-if="localFilterConfig.mergeBtn.isShow && btnAuth('mergeBtn')"
          class="margin-rihgt-10 padding-btn-10"
          icon="el-icon-news"
          type="primary"
          @click="makeUpFilter">
          组合查询
        </el-button>
      <!-- 对比查询 -->
      <el-button
        style="margin-left: 0;"
        v-if="localFilterConfig.ratioBtn.isShow && btnAuth('ratioBtn')"
        class="margin-rihgt-10 padding-btn-10 ratio_class" 
        type="danger"
        icon="el-icon-sort"
        @click="ratioFilter">
        对比查询
      </el-button>
      <!-- 上传app数据 -->
      <el-popover
        placement="bottom"
        v-if="localFilterConfig.uploadBtn && localFilterConfig.uploadBtn.isShow && btnAuth('uploadBtn')"
        width="265"
        v-model="uploadPopover">
        <div class="upload_btn">
            <a href="./promoting_data_templates.csv" download="海外APP推广数据格式.csv">
              <el-button
                style="margin-left: 4px;"
                class="padding-btn-10" 
                type="primary">
                下载模板
              </el-button>
            </a>
          <uploadFile 
            @successUpload="successUpload"
            url="/bi/spread/upload" 
            type="btn" :btnWord="localFilterConfig.uploadBtn.btnWord" 
            :otherData="otherData"
          ></uploadFile>
          <!-- <input type="file" @change="changeFile"> -->
        </div>

        <el-button
          slot="reference"
          style="margin-left: 0;"
          class="margin-rihgt-10 padding-btn-10" 
          type="primary">
          {{localFilterConfig.uploadBtn.btnWord}}
        </el-button>
      </el-popover>
      
      <!-- 图表按钮 -->
      <el-button-group class="echart_btn" v-if="localFilterConfig.echartBtn !==false && btnAuth('echartBtn')">
        <el-button @click="goToEcharts">
          <span style="color: #337ab7;cursor: pointer;">
            <svg-icon icon-class="tubiao" class-name="disabled" />
          </span>
        </el-button>
        <el-button class="down_icon" :type="!isShowEchart?'primary':'normal'" @click="showEchartBtn">{{isShowEchart?'隐藏':'显示'}}</el-button>
      </el-button-group>
      <!-- <el-popover
        placement="top"
        width="320"
        v-model="selectXPopover">
          <div class="select_box">
            <div class="label_x">请选择X轴：</div>
            <el-radio-group v-model="selectXRadio">
              <el-radio v-for="item in selectXArr" :key="item.key" :label="item.key">{{item.value}}</el-radio>
            </el-radio-group>
          </div>   
          <div style="text-align:center;margin-top:10px;margin-bottom: 4px;">
            <el-button size="mini" type="text" @click="selectXPopover = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirgEchar">确定</el-button>
          </div>
      </el-popover> -->
      <div class="check-row-btn link-type" v-if="localFilterConfig.filterThBtn !==false && btnAuth('filterThBtn')" @click="handleShowRow"><i class="icon el-icon-setting"></i><span>隐藏列</span></div>    
      <div class="check-row-btn link-type" v-if="localFilterConfig.addFilterBtn !==false && btnAuth('addFilterBtn')" @click="addSearchItem" ><i class="icon el-icon-circle-plus"></i><span>添加过滤</span></div>    
      <div class="check-row-btn link-type" v-if="localFilterConfig.addTermBtn !==false && btnAuth('addTermBtn')" @click="addQuota"><i class="icon el-icon-circle-plus"></i><span>添加指标</span></div>    
      <!-- <div class="check-row-btn link-type" v-if="localFilterConfig.configureBtn !==false" @click="settingTable"><i class="icon el-icon-setting"></i><span>配置表格</span></div>     -->
    </el-row>
  </div>
  <el-dialog
        title="请选择需要合并的页面"
        :modal="true"
        top="15vh"
        :visible.sync="mergePopover"
        width="400px">
        <div class="term_s">
            <div class="merge_table">
              <div class="merge_box">
                  <el-checkbox-group v-model="checkboxGroup" @change="changeList" size="small">
                    <el-checkbox v-for="item in baseDataArr" :key="item.name" :disabled="item.name==$route.name" :label="item.name" border>{{item.meta.title}}</el-checkbox>
                  </el-checkbox-group>
              </div>
            </div>    
            <div class="merge_group">
              <div class="group_name">选择分组</div>
              <el-select
                class="mg-btm-20"
                style="width: 100%"
                v-model="mergeGroupValue"
                multiple
                collapse-tags
                placeholder="请选择分组">
                <el-option
                  v-for="item in newGroupData"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
        </div>
        <div style="text-align: center; margin: 10px">
            <el-button type="text" @click="mergePopover = false">取消</el-button>
            <el-button type="primary" :loading="btnLading" @click="saveMergeData()">合并</el-button>
        </div>
    </el-dialog>
  <ratioDialog ref="ration" :selectData="localFilterConfig" :tableData="tableData" :tableColumn="tableColumn" :checkedList="checkedList" :groupListData="groupListData"></ratioDialog>
  <ChartLine ref="chartLine" v-show="isShowEchart" :echartDatas="echartDatas" :listQuery="listQuery" :checkedList="checkedList" :groupList="groupList" @postEchartReport="postEchartReport"></ChartLine>
  <addCondition ref="terms" :termDatas="termDatas" @addTremData="addTremData"></addCondition>
  <quotaDialog ref="quota" :markDatas="checkThs" @AddIndicaed="AddIndicaed"></quotaDialog>
  <!-- <configureTable ref="configureTable"></configureTable> -->
  
</div>
</template>

<script>
import { getSiteList, getOutsitesList, getSectionList, getClassList, searchMyGroup, mergeTableData, saveReportData } from '@/api/public/index'
import { setSearchList, arrDelectHave, getDatetr } from '@/utils/common'
import { optionsConfig } from '@/utils/optionsConfig'
import { tableColumns } from '@/utils/tableColumns'
import { parseTime } from '@/utils'
import { getSite, setSite, getOutSite, setOutSite, getSection, setSection, getClass, setClass} from '@/utils/auth'
import { getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import ratioDialog from './ratioDialog.vue'
import {filterGroup} from '@/utils/filterWord'
import uploadFile from '@/components/parts/uploadFile'
import ChartLine from '@/components/Charts/echarts'
import addCondition from '@/components/parts/addCondition'
import dateArea from '@/components/parts/dateArea.vue'
import {getDateName} from '@/utils/assist'
import reportForm from '@/components/parts/reportForm.vue'
import quotaDialog from '@/components/parts/quotaDialog.vue'
import {uploadFileFun} from '@/utils/uploadFile'
import {getBtnPermiss} from '@/api/auth'
import {getPageAuth} from '@/utils/power'
import {redictUrl} from '@/utils/validate'
import {getUserAuth} from '@/utils/auth'

// import configureTable from '@/components/parts/configureTable'


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
  topup_type:'1',
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
var _this 
export default {
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    echartDatas: {
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
    downloadLoading: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    defaultSite:{
      type: Number,
      default: 0
    },
    originTime:{
      type: Object,
      default: function(){
        return {}
      }
    },
    recomeData:{
      type: Array,
      default: function(){
        return []
      }
    },
    eventTypeData:{
      type: Array,
      default: function(){
        return []
      }
    },
    eventIdData:{
      type: Array,
      default: function(){
        return []
      }
    }
  },
  components:{
    ratioDialog,
    uploadFile,
    ChartLine,
    addCondition,
    dateArea,
    reportForm,
    quotaDialog,
    // configureTable
  },
  filters:{
    // filterName(val){
    //   let name = ''
    //   for (let i = 0; i < _this.tableColumn.length; i++) {
    //     if(_this.tableColumn[i].prop == val){
    //        name = _this.tableColumn[i].label
    //     }
    //   }
    //   return name
    // }
    filteType(val){
      let markData = _this.markData
      let name = ''
      markData.forEach(re=>{
        if(re.prop == val){
          name = re.name
        }
      })
      return name
    }
  },
  computed:{
    
    checkThs(){
        let arr = []            
        // console.log('this.authFieldArr',this.authFieldArr);
        for(let i in this.tableColumn){ 
            if(this.checkedList.indexOf(this.tableColumn[i].prop) != -1 && this.$parent.show_field.indexOf(this.tableColumn[i].prop) != -1){
              if(this.authFieldArr.length <=0 || this.authFieldArr.indexOf(this.tableColumn[i].prop) != -1){
                arr.push({label:this.tableColumn[i].label, prop:this.tableColumn[i].prop, isNum:this.tableColumn[i].isNum}) 
              }
            }    
        }
        // console.log('arr',arr);
        return arr
    },
    baseDataArr(){
      let baseNav = this.$router.options.routes[3]
      let baseArr = baseNav.children.filter((re)=>{
        return !re.hidden
      })
      return baseArr
    },
    termDatas(){
      let arr = this.checkThs.filter((re)=>{return re.isNum})
      let newArr = []
      let newFiles = this.$parent.new_show_fields
      if(newFiles && newFiles.length>0){
        let show_field = this.$parent.show_field || []
        newFiles.forEach(r=>{
            if(show_field.indexOf(r.key) != -1 && this.checkedList.indexOf(r.key) != -1){
              arr.push({label: r.value, prop: r.key})
            }
        })  
      }
      return arr 
    },
    siteNewList(){
      if(this.isAdmin || !this.authData.site_list || this.authData.site_list.length==0){
        return this.siteList
      }else{
        // console.log('this.siteList',this.siteList);
        // console.log('this.authData',this.authData);
        
        let arr = this.siteList.filter((re)=>{
          return this.authData.site_list.indexOf(re.site_id) != -1
        })
        // console.log('this.arr',arr);
        return arr
        
      }
    }
  },
  data() {
    _this = this
    return {
      visible: false,
      showRatio: false,
      uploadPopover: false,
      isShowEchart: false,
      relativeTime1:'',
      relativeTime2:'',
      // selectXPopover:false,
      btnLading: false,
      selectXRadio:'',
      timeArea:[],
      timeVisible: false,
      isRelative: false,
      selectXArr:[],
      isExtended:[],
      checkboxGroup:[],
      mergeGroupValue:[],
      newGroupData:[],
      tremTags:[],
      authBtnArr:[],
      authFieldArr:[],
      time: '',
      timeText: '日',
      timeTexts: '几天前',
      timeTypes: '时间段(绝对)',
      defaultTime: 'absolute',
      bookText: '书籍 ID 搜索',
      groupVal: '',
      // searchName: '',
      isShowRow: false,
      mergePopover:false,
      isGroup: true,
      isAdmin: false,
      otherData:{},
      siteList: [],
      siteList1: {},
      groupList: [], // 分组查询选中值 
      outsitesList: [], // 从缓存中读取渠道数据
      outsiteVals: [], // 授权渠道选中值
      sectionList: [],
      classList: [],
      checkedTit: [],
      authData:'',
      myGroupData: { 1: [], 2: []},
      tableColumn: [...tableColumns],
      localFilterConfig: Object.assign({}, this.filterConfig),	
      listQuery: Object.assign({}, defaultListQuery),
      optionsConfig: Object.assign({}, optionsConfig),
      isInit: false, // 是否走缓存读取数据
      mergeTabletags:[],
      noLoadArr:['UvRanking','GrowthRate','ExclusiveBean','RechargeStatics','KeyWordStatics','ReturnModel','NewAddData','ActiveRatio'],
      markData:[
          {label:'大于', name:'>', prop:'gt'},
          {label:'小于', name:'<', prop:'lt'},
          {label:'等于', name:'=', prop:'eq'},
          {label:'大于等于', name:'>=', prop:'egt'},
          {label:'小于等于', name:'<=', prop:'elt'},
          {label:'区间', name:'区间', prop:'between'},
      ],
      
    }
  },
  watch: {
    // downloadLoading(){
    //   console.log(this.downloadLoading)
    // },
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
      // console.log('vvv',val);
      if(val){
        this.$refs.dateArea.postToTime(this.timeArea)
      }
    }
  },
 async created(){

    this.authData = JSON.parse(getUserAuth())
    if(this.authData == 1){
      this.isAdmin = true
    }

    let perData = {
      domain_id:'D-5fa10d1e0ab4a',
      path_type:'WEB',
      action:'all',
      url_path: this.$route.fullPath
    }
    let res = await getBtnPermiss(perData)

    // console.log(2020202, res);
    if(res.success==1){
      this.authBtnArr = res.result.button
      this.authFieldArr = res.result.field
      // this.authFieldArr = ['site_id','timeline','vote']
      this.$parent.authArrData = this.authFieldArr
    }
    this.checkboxGroup = [this.$route.name]
    if(this.defaultSite){
      this.listQuery.site_id = this.defaultSite
      this.listQuery.siteName = this.defaultSite
    }   
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
    this.assignmentReport()
    if(this.noLoadArr.indexOf(this.$route.name) != -1){
      this.handleFilter(1)
    }else{
      this.handleFilter()
    }
    this.getGroupState('1,2')

  },
  activated() {
    // 页面已被缓存过（2）
    redictUrl()

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
        this.handleGroupCommand(this.listQuery.group_type)
        this.listQuery.searches_user = queryData.searches_user
        this.listQuery.searches_book = queryData.searches_book
        this.listQuery.book_id = queryData.book_id
        this.listQuery.user_id = queryData.user_id
      }

      this.handleFilter()
      this.getGroupState('1,2')

    },
    changeFile(e){
      let file = e.target.files[0]
      uploadFileFun('/bi/spread/upload','file',file,{}).then((res)=>{
        console.log(res);
      })
    },
    btnAuth(key){
      return getPageAuth(key, this.authBtnArr)
    },
    assignmentReport(){
      let querys = this.$route.query
      if(querys.formReport){
        let searchs = JSON.parse(querys.listQuery)
        if(searchs.group){
          this.groupList = searchs.group.split(',')
        }else{
          this.groupList = []
        }
        // 时间赋值
        if(searchs.start_time && !isNaN(searchs.start_time) || searchs.end_time && !isNaN(searchs.end_time)){
          this.isRelative = true
          // if(searchs.start_time == searchs.end_time){
            this.relativeTime1 = searchs.start_time +' '+ getDateName(searchs.time_unit,0)
            this.relativeTime2 = searchs.end_time +' '+ getDateName(searchs.time_unit,1)
          // }else{
          //   this.relativeTime1 = searchs.start_time +' '+ getDateName(searchs.time_unit,0)
          //   this.relativeTime2 = searchs.end_time +' '+ getDateName(searchs.time_unit,1)
          // }
        }else{
          searchs.time_unit = ''
          this.isRelative = false
          this.timeArea = [searchs.start_time,searchs.end_time]
        }
        // 过滤赋值
        // console.log('searchs',searchs);
        let terArr = []
        for(let i in searchs){
          if(i.indexOf('having_') != -1){
            let key = i.slice(7)
            let type = searchs[i].split(',')[0]
            let val = searchs[i].split(',')[1]
            let terobj = {
              prop: key,
              name: this.getLableName(key),
              type: type
            }
            if(type == "between" && val){
              terobj.num = val.split('_')[0]
              terobj.num2 = val.split('_')[1]
            }else{
              terobj.num = val
            }
            terArr.push(terobj)
          }
        }
        console.log('terArr',terArr);
        this.tremTags = terArr

        this.listQuery = Object.assign(this.listQuery,searchs)
        if(querys.type=='table'){
          this.$parent.checkedList = querys.checkedList
        }else{
          this.showEchartBtn()
        }
      }
      
    },
    getLableName(val){
      let name = val
      this.tableColumn.forEach((re)=>{
        if(re.prop == val){
          name = re.label
        }
      })
      return name
    },
    successUpload(url){
      // console.log(res, file);
      console.log('urlss', url);
      this.handleFilter()
    },
    changedTime(data){
      // console.log('data3333',data);
      console.log(data);
      if(data.type == 'rel'){
        this.isRelative = true
        this.listQuery.start_time = data.dates[0]
        this.listQuery.end_time = data.dates[1]
        this.listQuery.time_unit = data.time_unit
        // if(this.listQuery.start_time == this.listQuery.end_time){
          this.relativeTime1 = this.listQuery.start_time +' '+ getDateName(data.time_unit, 0)
          this.relativeTime2 = this.listQuery.end_time +' '+ getDateName(data.time_unit,1)
        // }else{
        //   this.relativeTime1 = this.listQuery.start_time +' '+ getDateName(data.time_unit, 0)
        //   this.relativeTime2 = this.listQuery.end_time +' '+ getDateName(data.time_unit,1)
        // }
      }else{
        this.isRelative = false
        this.listQuery.time_unit = ''
        this.listQuery.start_time = getDatetr(data.dates[0],'-')
        this.listQuery.end_time = getDatetr(data.dates[1],'-') 
        this.timeArea = [this.listQuery.start_time,this.listQuery.end_time] 
        // console.log('this.timeArea',this.timeArea);
      }
      this.timeVisible = false
    },
    addTremData(data, isEdit){
      this.tremTags = JSON.parse(JSON.stringify(data))
      console.log('tremTags',this.tremTags);
      // this.tremTags = dataArr
      this.$refs.terms.showDialog = false
      this.handleFilter()
    },
    handleClose(index){
      this.tremTags.splice(index, 1)
      this.handleFilter()
    },
    clickTag(tag){
      // console.log(tag);
      // this.$refs.terms.editTrem(tag)
      this.$refs.terms.showDiaFun(this.tremTags)
    },
    getCheckedTit(){
      this.checkedTit = []
      for(let i in this.tableColumn){ 
        if(this.checkedList.indexOf(this.tableColumn[i].prop) != -1){
          this.checkedTit.push(this.tableColumn[i].label) 
        }
      }
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
    ratioFilter(){
      this.$refs.ration.isMerge = false
      this.$refs.ration.showRatio = true
    },
    // handleCommand(command) {
    //   // 根据条件渲染对应文案
    //   if(this.defaultTime.indexOf('absolute') != -1 && command == 'day'){
    //     this.timeText = '日'
    //   }else if(this.defaultTime.indexOf('absolute') != -1 && command == 'week'){
    //     this.timeText = '周'
    //   }else if(this.defaultTime.indexOf('absolute') != -1 && command == 'month'){
    //     this.timeText = '月'
    //   }

    //   if(this.defaultTime.indexOf('relative') != -1 && command == 'day'){
    //     this.timeTexts = '几天前'
    //   }else if(this.defaultTime.indexOf('relative') != -1 && command == 'week'){
    //     this.timeTexts = '几周前'
    //   }else if(this.defaultTime.indexOf('relative') != -1 && command == 'month'){
    //     this.timeTexts = '几月前'
    //   }
    //   // 清空默认值，动态改变文案
    //   if(command == 'relative'){
    //     this.timeTypes = '时间段(相对)'
    //     this.defaultTime = 'relative'
    //     this.listQuery.start_time = ''
    //     this.listQuery.end_time = ''
    //     this.listQuery.time_type = 'day'
    //     this.timeText = '日'
    //     this.timeTexts = '几天前'
    //   }else if(command == 'absolute'){
    //     this.setDefaultTime()
    //     this.listQuery.time_type = 'day'
    //     this.timeText = '日'
    //     this.timeTexts = '几天前'
    //     this.timeTypes = '时间段(绝对)'
    //     this.defaultTime = 'absolute'
    //   }else if(command == 'relative_point'){
    //     this.timeTypes = '时间(相对)'
    //     this.defaultTime = 'relative_point'
    //     this.listQuery.start_time = ''
    //     this.listQuery.end_time = ''
    //     this.listQuery.time_type = 'day'
    //     this.timeText = '日'
    //     this.timeTexts = '几天前'
    //   }else if(command == 'absolute_point'){
    //     this.setDefaultTime()
    //     this.listQuery.time_type = 'day'
    //     this.timeText = '日'
    //     this.timeTexts = '几天前'
    //     this.timeTypes = '时间(绝对)'
    //     this.defaultTime = 'absolute_point'
    //   }else{
    //     this.listQuery.time_type = command
    //   }
    // },
    handleGroupCommand(command) {
      // console.log('command',command)
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
		handleFilter(noLoad) {
      this.formatFilter()      
      // console.log(4444,this.listQuery.group);
      // console.log(555,this.$parent.tableColumn);
      if(this.listQuery.group){
        let tableths = JSON.parse(JSON.stringify(this.$parent.tableColumn))
        let groupArr = this.listQuery.group.split(',')
        let arrs = []
        this.$parent.tableColumn = tableths.filter(re=>{
          return groupArr.indexOf(re.prop) == -1
        })
        groupArr.forEach(re=>{
          tableths.forEach(r=>{
            if(re == r.prop){
              arrs.push(r)
            }
          })
        })
        // console.log('arrs',arrs);
        this.$parent.tableColumn = arrs.concat(this.$parent.tableColumn)
        this.$forceUpdate()

        // console.log('this.$parent.tableColumn',this.$parent.tableColumn);

      }
      // return

      // true为初始不加载
      if(noLoad==1){
        this.$emit('handleFilter', this.listQuery, true)
      }else{
        this.$emit('handleFilter', this.listQuery, false)
      }
      
      // this.listData()  
    },
    AddIndicaed(){
      this.handleFilter()
    },
    formatFilter(){
      this.currentPage = 1
      if(this.$route.name == 'Chapter'){
        if(!this.listQuery.book_id){
          this.$message.warning('书籍ID不能为空！')
          return false
        } 
        // this.handleFilter()
        // this.getGroupState('1,2')
      }
      // if(this.isExtended.length==1){
      //   this.listQuery.event_type = this.isExtended[0]
      // }else{
      //   this.listQuery.event_type = 0
      // }
      for (let i in this.listQuery) {
        if(this.listQuery[i] && i.indexOf('having_') != -1){
          delete this.listQuery[i]
        }
      }
      let tremObj = {}
      // console.log('this.tremTags',this.tremTags);
      if(this.tremTags && this.tremTags.length>0){
        // console.log('tremTags',this.tremTags);
        this.tremTags.forEach((re)=>{
          if(re.type=='between'){
            tremObj['having_'+re.prop]=re.type+','+re.num+'_'+re.num2
          }else{
            tremObj['having_'+re.prop]=re.type+','+re.num
          }
        })
      }
      // console.log('tremObj8888',tremObj);
      this.listQuery = Object.assign(this.listQuery,tremObj)
    },
    // 导出数据
    handleDownload() {
      this.formatFilter()
      this.$emit('handleDownload', this.listQuery)
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
      this.$emit('getActiveList','site_id',item)
    },
    changeEventType(val){
      this.$emit('getActiveList','event_type',val)
    },
    handlePlatform(item) {
      this.listQuery.platform = item
    },
    handleShowRow(){
      this.$emit('handleShowRow', !this.isShowRow)
    },
    addSearchItem(){
      this.$refs.terms.showDiaFun(this.tremTags)
    },
    addQuota(){
      this.$refs.quota.showDiaFun()
    },
    // settingTable(){
    //   this.$refs.configureTable.showDiaFun()
    // },
    showEchartBtn(){
      if(this.isShowEchart){
        this.isShowEchart = false
      }else{
        if(this.echartDatas.length<=0){
          this.goToEcharts()
        }else{
          this.isShowEchart = true
        }
      }
    },
    goToEcharts(){
      // console.log('你好呀',JSON.stringify(this.$parent.checkedList));

      if(this.groupList.length<=0){
        this.$message.warning('请选择分组')
        return
      }else if(this.groupList.length>2){
        this.$message.warning('选择分组不能大于两个')
        return
      }
      console.log('this.groupList4',this.groupList);
      console.log('this.listQuery5',this.listQuery);
      if(this.groupList.indexOf('book_id') != -1){
        if(!this.listQuery.book_id || this.listQuery.book_id.split(',').length>50){
          this.$message.warning('按照书籍id分组时，请选择1-50个书籍id进行统计')
          return
        }
      }
      if(this.groupList.indexOf('outsite') != -1){
        if(!this.listQuery.outsite || this.listQuery.outsite.split(',').length>50){
          this.$message.warning('按照渠道分组时，请选择1-50个渠道进行统计')
          return
        }
      }
      if(this.groupList.indexOf('author_name') != -1){
        if(!this.listQuery.author_name || this.listQuery.author_name.split(',').length>50){
          this.$message.warning('按照作者分组时，请选择1-50个作者进行统计')
          return
        }
      }
      // if(this.groupList.indexOf('timeline') != -1){
      //   if(!this.listQuery.author_name){

      //     this.$message.warning('按照时间分组时，时间范围不能超过一个月')
      //     return
      //   }
      // }
      this.formatFilter()
      // console.log('aaaa',);
      this.$nextTick(()=>{
        this.$refs.chartLine.echartLoading = true
        this.$emit('getEchartData', this.listQuery)
      })
    },
    // 绘制图表弹框
    handleShowEcharts(){
      let _this = this
      // console.log('this.echartDatas777',this.echartDatas);
      if(this.groupList.length == 1){
        this.isShowEchart = true
        this.$nextTick(()=>{
          this.$refs.chartLine.resetEchart()
        })
      }else if(this.groupList.length == 2){
        
        if(this.echartDatas.length){
          // this.selectXArr = this.groupListData.filter(re=>{
          //   return this.groupList.indexOf(re.key) != -1
          // })
          this.isShowEchart = true
          // this.selectXRadio = this.selectXArr[0].key
          this.$nextTick(()=>{
            this.$refs.chartLine.resetEchart()
          })
        }else{
          this.$message.warning('查询数据为空')
        }
      }
    },
    confirgEchar(){
      this.isShowEchart = true
      // this.$refs.chartLine.firstGroup = this.selectXRadio
    },
    // 查看保存的历史图表
    // handleSaveEcharts(){
    //   // console.log('groupStr', this.groupStr)
    //   this.$emit('handleSaveEcharts')
    // },
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
      // console.log(44444,this.originTime);
			var date = new Date()
			var nowYear = date.getFullYear()
			var month = ("0" + (date.getMonth() + 1)).slice(-2)
			var day = ("0" + date.getDate()).slice(-2)
      var today = nowYear+"-"+(month)+"-"+(day)
      var yesterday = nowYear+"-"+(month)+"-"+(day-1)

      if(this.originTime.time_unit){
        this.isRelative = true
        this.relativeTime1 = this.originTime.start_time +' '+ getDateName(this.originTime.time_unit.split(',')[0],0)
        this.relativeTime2 = this.originTime.end_time
        this.listQuery.time_unit = this.originTime.time_unit
        this.listQuery.start_time = this.originTime.start_time
        this.listQuery.end_time = this.originTime.end_time
      }else{
        this.isRelative = false
        this.timeArea = [yesterday, today]
        this.listQuery.start_time = yesterday
        this.listQuery.end_time = today
      }      
      
    },
    aaa(name){
      const arr = getHistorySearchList()
        return new Promise((resolve, reject) => {  
            arr.map(item => {
              if(item.name == name){
                reject(new Error('fail'))  
              }  
            })  
            resolve(true)     
        })     
    },
    postEchartReport(type, data){
      this.handleSaveFilter(type, data)
    },
    // 保存筛选条件
    handleSaveFilter(type, data){
      let objs = {}
      if(type=='table'){
        objs = this.$refs.reportBox.formData
      }else{
        objs = data
      }
      // console.log(this.$route);
      if(objs.name){
        this.formatFilter()
        let data = objs
        data.apis = [this.$route.meta.api]
        data.from = this.$route.name
        data.to = this.$route.path
        data.checkedList = this.checkedList
        data.type = type
        data.listQuery = this.filterNullVal(this.listQuery)
        if(type=='echart'){
          data.listQuery.echartKey = objs.echartKey
          data.listQuery.echartsType = objs.echartsType
          data.listQuery.group = objs.groupList.join(',')
        }        
        saveReportData(data).then((res)=>{
          this.$message.success('保存成功！')
          this.visible = false
        })
      }else{
        this.$message.warning('请填写报表名称')
      }  
    }, 
    filterNullVal(obj){
      const newObj = {}
      for (const key in obj) {   
        if(obj[key] !== ''){
          newObj[key] = obj[key]
        }
      }
      return newObj
    },  
    changeActive(val){
      console.log(val);
      this.eventIdData.forEach((re)=>{
        if(re.event_id == val){
          this.timeArea = [re.start_time, re.end_time]
          this.listQuery.start_time = re.start_time
          this.listQuery.end_time = re.end_time
        }
      })
      
    },
    changeList(val){
      // console.log('val',val);
      let _this = this
      let menuArrs = []
      let searchObj = {
        show_group_list: 1,
        start_time: this.listQuery.start_time, 
        end_time: this.listQuery.end_time,
        time_type: 'day'
      }
      this.baseDataArr.forEach((re)=>{
          val.forEach(e=>{
            if(re.name == e){
              let url = re.meta.api
              mergeTableData(url, searchObj).then((res)=>{
                let arrh = []
                res.data.group_list.forEach(r=>{
                  arrh.push(r.key)
                })
                menuArrs.push(arrh)
                if(menuArrs.length >= _this.checkboxGroup.length){
                  let lastArr = arrDelectHave(menuArrs)
                  // console.log('lastArr',lastArr);
                  // console.log('_this.mergeGroupValue',_this.mergeGroupValue);
                  if(lastArr.length>0){
                    console.log('this.newGroupData',this.newGroupData);
                    this.newGroupData = this.groupListData.filter((gr)=>{
                      return lastArr.indexOf(gr.key) != -1
                    })
                    this.mergeGroupValue = this.mergeGroupValue.filter((va)=>{
                      return lastArr.indexOf(va) != -1
                    })
                    
                  }else{
                    _this.mergeGroupValue = []
                  }
                }
              })
            }
          })
        })
      // mergeTableData(url, searchObj)
    },
    saveMergeData(){
      // console.log(33333, this.listQuery.group);
      // console.log('checkboxGroup',this.checkboxGroup);
      let _this = this
      if(this.mergeGroupValue.length<=0){
        this.$message.warning('请选择分组')
        return
      }
      if(this.checkboxGroup.length<=1){
        this.$message.warning('请至少选择两个菜单合并')
        return
      }
      // if(this.mergeGroupValue.indexOf('platform') != -1 && this.checkboxGroup.indexOf("BookAct") != -1){
      //   this.$confirm('作品互动页面无平台区分，是否继续合并', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
          this.formatMerge()
      //   })
      // }
      
    },
    formatMerge(){
      let pagesInfo = []
      this.baseDataArr.forEach((re)=>{
        this.checkboxGroup.forEach((r)=>{
          if(re.name == r && r != this.$route.name){
            let obj = {}
            obj.api = re.meta.api
            obj.title = re.meta.title
            obj.name = re.name
            pagesInfo.push(obj)
          }
        })
      })
      pagesInfo.unshift({api:this.$route.meta.api, name: this.$route.name, title:this.$route.meta.title})
      let result = {
        pages: pagesInfo,
        // filterConfig: this.filterConfig,
        searchObj: this.filterNullVal(this.listQuery),
      }
      result.searchObj.group = this.mergeGroupValue
      this.mergePopover = false
      sessionStorage.setItem('merge_pages_data', JSON.stringify(result))
      this.$router.push({name:'MergeTable'})
    },
    makeUpFilter(){
      // console.log('33333',this.localFilterConfig);
      this.checkboxGroup = [this.$route.name]
      this.mergeGroupValue = []
      this.newGroupData = this.groupListData
      this.mergePopover = true
    },
    // mergeFun(item,index){
    //   console.log('item', item);
    //   console.log(this.checkThs);
    //   let obj = {
    //       obj1 : item.params,
    //       obj2 : item.params,
    //       api1 : item.page.api,
          
    //       tableTh: this.checkThs,
    //       isMerge: true,
    //   }
    //   let groupname = item.group.key
    //   obj.obj1.group = groupname
    //   obj.obj2.group = groupname
    //   localStorage.setItem('mergeTableFilter', JSON.stringify(obj))
    //   this.showRatio = false
    //   this.$router.push({name:'MergeTable'})
    // },
    // mergeDelete(item){
    //   let delIndex
    //   console.log(333,this.mergeTabletags);
    //   this.mergeTabletags.forEach((re,index)=>{
    //     if(re.name == item.name){
    //       delIndex = index
    //     }
    //   })
    //   if(delIndex != undefined){
    //     this.mergeTabletags.splice(delIndex,1)
    //   }
    //   localStorage.setItem('merge_table_filter_data', JSON.stringify(this.mergeTabletags))
    // },
  }
}
</script>

<style lang="scss">
  .filter-inputs{
    .filter-container{
      overflow: hidden;
      .btn_row{
          // margin-top: -6px;
          // position: relative;
          // top: -4px;
          float: left;
          margin-top: -20px;
        .el-button{
          margin-top: 20px;
        }
        .echart_btn{
          margin-top: -20px;
        }
      }
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
      margin-top: 20px;
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
    .echart_btn{
      /deep/ .down_icon{
        padding-left: 8px;
        padding-right: 8px;
        // width: 24px;
        text-align: center;
      } 
    }
  }
  .merge_table{
      & p{
        line-height: 10px;
      }
      .merge_box{
        max-height: 300px;
        overflow-y: auto;
        padding-bottom: 16px;
        /deep/ .el-checkbox-group{
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .el-checkbox{
            float: left;
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 155px;
            margin-top: 12px;
          }
          .el-checkbox.is-bordered.is-disabled{
            border-color: #409EFF;
            span.el-checkbox__label{
              color: #409EFF;
            }
            .el-checkbox__inner{
              background-color: #409EFF;
              border-color: #409EFF;
            }
            .el-checkbox__inner::after{
              border-color: #ffffff;
            }
          }
        }
      }
    }
    .extend_class{
      display: inline-block;
      margin-left: 10px;
      .el-checkbox{
        margin-right: 10px;
        
      }
    }
    .trem_class{
      display: inline-block;
      .el-tag--medium{
          height: 38px;
          line-height: 38px;
          margin-right: 8px;
        }
    }
    .select_box{
      display: flex;
      padding: 8px;
      box-sizing: border-box;
      line-height: 14px;
      padding-top: 22px;
      .label_x{
        padding-right: 12px;
      }
    }
    .merge_btns{
      text-align: center;
    }
    .relative_time{
      float: left;
      margin-right: 8px;
    }
    .term_s{
      .merge_group{
        padding-top: 6px;
        .group_name{
          white-space: nowrap;
          line-height: 38px;
          padding-right: 6px;
        }
        display: flex;
      }
    }
    .ratio_class{
      i{
        transform: rotate(90deg);
      }
    }
</style>
