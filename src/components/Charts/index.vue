<template>
  <!-- title="echarts 图表" -->
  <!-- 选择图表展示内容 -->
  <div class="echart-wrap">
    <el-dialog
      :visible.sync="flag1"
      title="请选择要绘制的图表内容"
      width="40%"
      @close="closeFn">  
      <div class="choose-tip">请选择横轴（单选）</div>
      <el-radio-group v-model="xAxis">
        <el-row>
          <el-col :span="8" v-for="(item, key, index) in fileDataX" >
          <el-radio :label="key">{{echartSelectText[key]}}</el-radio>
          </el-col>  
        </el-row> 
      </el-radio-group>  
      <!-- <div class="choose-tip">请选择纵轴（多选）</div>
      <el-checkbox-group v-model="echartSelect">
        <el-row>
          <el-col :span="8" v-for="(item, key, index) in tableData[0]" >
              <el-checkbox v-show="echartSelectText[key] != undefined" :label="key" :disabled="key == xAxis">{{echartSelectText[key]}}</el-checkbox>
          </el-col>  
        </el-row>            
      </el-checkbox-group> -->

      <div class="choose-tip">请选择纵轴（单选）</div>
      <el-radio-group v-model="echartSelect">
        <el-row>
          <el-col :span="8" v-for="(item, key, index) in fileDataY" >
              <el-radio v-show="echartSelectText[key] != undefined" :label="key" :disabled="key == xAxis">{{echartSelectText[key]}}</el-radio>
          </el-col>  
        </el-row>            
      </el-radio-group>

      <!-- <div class="choose-tip">站点（多选）</div>
      <el-checkbox-group v-model="siteVaue">
        <el-row>
          <el-col :span="24">
              <el-checkbox :label="1">火热小说</el-checkbox>
              <el-checkbox :label="2">火热漫画</el-checkbox>
          </el-col>  
        </el-row>            
      </el-checkbox-group> -->
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="flag1 = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
  <!-- 弹框图表 -->
    <el-dialog
    :visible.sync="flag"
    width="70%"
    center
    top="10vh"
    @opened="openFn()"
    @close="flag = false">
    <el-popover
      placement="top"
      width="220"
      v-model="visible">
      <p>
        <p>请编辑搜索名称：</p>
        <el-input
        size="small"
        v-model="echartName"
        placeholder="请编辑搜索名称">
        </el-input>
      </p>    
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSave">确定</el-button>
      </div>
      <el-button 
        slot="reference"
        class="save-btn" 
        type="primary">
        保存报表
      </el-button>
    </el-popover>
    <!-- <div style="position: relative;"><el-button style="position: absolute;right: -10px;top: 15px;z-index: 5;" type="primary" plain size="mini" @click="handleSave">保存图表</el-button></div> -->
      <div style="width: 100%;height: 70vh;" id="xiaobai">
      </div>
    </el-dialog>
    <!-- 历史图表 -->
    <!-- <el-dialog
    :visible.sync="flag2"
    width="70%"
    center
    top="10vh"
    @opened="openHistoryEchart"
    @close="closeFn">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">          
          <el-tab-pane v-for="item in historyEchartData" :label="item.timeline" :name="item.id"></el-tab-pane>
        </el-tabs>
        <div style="width: 100%;height: 70vh;" id="aaa">
        </div>
      </div>
    </el-dialog> -->
    
  </div>
</template>

<script>
import Echarts from 'echarts'
import { tableColumns } from '@/utils/tableColumns'
import { getSite, getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import { setSearchList } from '@/utils/common'
import { filterSite,filterOutSite,filterSection,filterOutClass,filterPlatform } from '@/utils/filterWord'


export default {
  props: {
    tableData: {
      type: Array,
      default: ['']
    },
    listQuery: Object,
    checkedList: Array,
    isShowSelect: {
      type: Boolean,
      default: false
    },
    isShowEchart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      flag: false,  
      flag1: false,
      flag2: false,
      visible: false, // 保存图表popover
      echartName: '', // 保存图表名称
      dimensions: [],
      series: [],
      echartData: [], // 图表数据
      echartSelect: '', // 图表内容选中集合
      echartSelectText: [], // 图表内容选中集合
      // 'timeline', 'pv', 'uv'
      xAxis: 'timeline',
      siteVaue:[],
      saveEchartData: [],
      activeName: '0',
      historyEchartData: [],
      seriesData:[],
      legendData:[],
      timeData:[],
      timename:'',
      othername:'',
      echarTitle:''
    }
  },
  created() {  
    

    this.echartSelectFn()
    this.siteData = getSite()
    // console.log(this.siteData);
    
  },
  watch: {
    isShowSelect(){
      this.flag1 = this.isShowSelect
    },
    isShowEchart(){
      this.flag2 = this.isShowEchart 
    }
  },
  computed: {
    // dimensions: {
    //   get(){
    //     let arr = []
    //     if(arr.indexOf(this.xAxis) == -1){
    //       arr.push(this.echartSelectText[this.xAxis]) 
    //     }     
    //     this.series = []  
    //     for(const item in this.echartData[0]){
    //       this.series.push({type: 'line'})
    //       if(item != this.echartSelectText[this.xAxis]){
    //         arr.push(item)          
    //       }  
    //       if(item == this.echartSelectText[this.xAxis]){
    //         this.series.splice(0,1)
    //       }  
    //     }  
    //     // console.log('dimensions',arr);
        
    //     return arr
    //   },
    //   set(val){
    //     return val
    //   }          
    // },
    fileDataX(){
      let obj = {}
      let newObj = {}      
      if(this.tableData[0]){
        let obj = JSON.parse(JSON.stringify(this.tableData[0]))
        if(obj.hasOwnProperty('timeline')){
          newObj.timeline=''
          this.xAxis = 'timeline'
        }
        if(obj.hasOwnProperty('hour')){
          newObj.hour=''
          this.xAxis = 'hour'
        }
      } 
      return newObj
    },
    fileDataY(){
      let obj = {}
      let deletArr = ['platform','book_id','author_name','outsite','class_id','section_id','site_id','timeline','hour']
      if(this.tableData[0]){
        obj = JSON.parse(JSON.stringify(this.tableData[0]))
        deletArr.forEach((re)=>{
          if(obj.hasOwnProperty(re)){
            delete obj[re]
          }
        })
      }
      return obj
    }
    // route: {
    //   get: function () {
    //     return this.$store.state.curTab.route
    //   },
    //   set: function () {
    //   }
    // }
  },
  methods: {
    openFn(){
      this.initChart('xiaobai')
    },
    closeFn(){
      this.$emit('closeFn')
      this.echartSelect = ''
      this.activeName = '0'
    },
    echartSelectFn(){
      for (let i in tableColumns){
        this.echartSelectText[tableColumns[i].prop] = tableColumns[i].label
      }
    },
    filterName(val){
      // console.log(val, tableColumns);
      
      for (let i = 0; i < tableColumns.length; i++) {
        if(tableColumns[i].prop==val){
          return tableColumns[i].label
        }
        
      }
    },
    // openHistoryEchart(){
    //   this.historyEchartData = JSON.parse(localStorage.getItem('saveEchartData'));
    //   this.bbb(0, 'aaa')
    // },
    // bbb(ind,name){
    //   this.dimensions = this.historyEchartData[ind].dimensions
    //   this.echartData = this.historyEchartData[ind].source
    //   this.series = this.historyEchartData[ind].series
    //   setTimeout(()=>{
    //     this.initChart(name)
    //   }, 50)
    // },
    // handleClick(tab){
    //   var ind = tab.index
    //   this.bbb(ind,'aaa')  
    // },
    handleSure(){
      // console.log(this.tableData);
      let selectGroup = this.$store.state.part.selectGroup
      let timename = selectGroup.splice(selectGroup.indexOf('timeline'),1)[0]
      let othername = selectGroup[0]

      this.seriesData = []
      this.legendData = []
      this.timeData = []
            
      for(let i in this.tableData){
        let otherWord = this.filterWord(othername, this.tableData[i][othername])

        if(otherWord && this.legendData.indexOf(otherWord) == -1){
          this.legendData.push(otherWord)
        }
        if(this.tableData[i][timename] && this.timeData.indexOf(this.tableData[i][timename]) == -1){
          this.timeData.push(this.tableData[i][timename])
        }
      }
      for(let j in this.legendData){
        let obj = {}
        obj.data = []
        for (let i in this.tableData) {
          if(this.filterWord(othername, this.tableData[i][othername]) == this.legendData[j]){
            // console.log(66666,this.tableData[i],this.echartSelect);
            obj.name = this.legendData[j]
            obj.type = 'line'
            obj.data.push(parseInt(this.tableData[i][this.echartSelect]) || 0)
          }
        }   
        this.seriesData.push(obj)   
      }
      // console.log('this.echartSelect',this.echartSelect);
      // console.log('this.timeData',this.timeData);
      // console.log('this.legendData',this.legendData);
      // console.log('this.seriesData',this.seriesData);
      this.echarTitle = this.filterName(this.echartSelect)
      this.flag1 = false
      this.flag = true
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
    filterWord(key, value){
      // console.log(555555555,key);
      if(key=='site_id'){
        return filterSite(value)
      }else if(key=='outsite'){
        return filterOutSite(value)
      }else if(key=='section_id'){
        return filterSection(value)
      }else if(key=='class_id'){
        return filterOutClass(value)
      }else if(key=='platform'){
        return filterPlatform(value)
      }else{
        return value
      }
      
    },
    handleSave(){
      if(this.echartName != ''){
        this.aaa(this.echartName).then((res) => {
          // this.historyEchartData[0]= this.dimensions
          // this.historyEchartData[1] = this.echartData
          // this.historyEchartData[2] = this.series

          this.historyEchartData[0]= this.legendData
          this.historyEchartData[1] = this.timeData
          this.historyEchartData[2] = this.seriesData
          setSearchList('chart', this.$route, this.echartName, this.listQuery, this.historyEchartData, this.checkedList)
          this.$message.success('保存成功！')
          this.visible = false
        }).catch((err) => {
          this.$message.warning('名称重复了，请重新编辑')
        })
      }else{
        this.$message.warning('搜索名称不能为空！')
      }
      // var id = 0
      // var data = JSON.parse(localStorage.getItem('saveEchartData'))
      // if( data != null){
      //   id =  data.length
      //   this.saveEchartData = data
      // }else{
      //   this.saveEchartData = []
      //   id = 0
      // }
      // var currTime = new Date();
      // var y = currTime.getFullYear();
      // var m = currTime.getMonth();
      // var d = currTime.getDate();
      // var h = currTime.getHours();
      // var min = currTime.getMinutes();
      // var date = y + '/' + m + '/' + d + ' ' + h + ':' + min;
      // this.saveEchartData.push({id: JSON.stringify(id), timeline: date, name: this.echartName, dimensions: this.dimensions, source: this.echartData, series: this.series})
      // localStorage.setItem('saveEchartData', JSON.stringify(this.saveEchartData))
      // this.$message.success('保存成功！')
      
    },
    initChart(name) {
      console.log('this.echarTitle', this.echarTitle);
      
      const chart = Echarts.init(document.getElementById(name))
      var option = {
        title: {
          text: name == 'xiaobai' ? this.echarTitle+'图表' : '历史图表'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: this.legendData,
          width: '70%'
        },
        toolbox: {  
            // feature: {
            //     saveAsImage: {}
            // }
        },
        // dataset: {
        //     // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        //     // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射。
        //     dimensions: this.dimensions,
        //     source: this.echartData
        //     // source: [['2020-02-03', 43.3, 85.8],
        //     // ['2020-02-04', 83.1, 73.4]],
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.timeData
        
        },
        yAxis: {
            type : 'value'
        },
        series: this.seriesData
      };
      chart.clear()
      chart.setOption(option)  
    },
    

  }
}
</script>
<style scoped lang="scss">
  .choose-tip{
    font-size: 16px;
    padding: 10px 0;
  }
  .save-btn{
    position: relative;
    float: right;
    margin-top: 10px;
    z-index: 999;
  }
  .echart-wrap {
    .el-radio-group{
        width: 100%;
        .el-radio{
          padding-top: 3px;
          padding-bottom: 5px;
        }
    }

  }
</style>