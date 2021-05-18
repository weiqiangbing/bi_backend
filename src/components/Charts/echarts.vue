<template>
  <div class="echart-wrap" v-loading="echartLoading">
    <!-- <el-dialog
    :visible.sync="isShowEchart"
    width="70%"
    center
    top="10vh"
    @opened="openFn()"
    @close="closeFn"> -->
    <!-- <el-popover
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
    </el-popover> -->

      <div class="echart_right_btn save-btn" v-if="!isSmall">
        <el-tooltip v-if="echartType" class="item" effect="dark" content="切换x，y轴" placement="top">
          <el-button type="primary" @click="changeEchartX" icon="el-icon-sort" circle></el-button>
        </el-tooltip>
        <el-popover
          placement="top"
          width="340"
          v-model="visible">
          <reportForm ref="reportBox"></reportForm>
          <!-- <p>
            <p>请编辑搜索名称：</p>
            <el-input
            size="small"
            v-model="echartName"
            placeholder="请编辑搜索名称">
            </el-input>
          </p>     -->
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="handleSaveFilter">确定</el-button>
          </div>
          <el-tooltip slot="reference" class="item" effect="dark" content="保存报表" placement="top">
            <el-button type="success" icon="el-icon-news" circle></el-button>
          </el-tooltip>
        </el-popover>
      </div>

      <div v-if="echartType && !isSmall" class="radio_group">
        <div class="label_word">统计项：</div>
        <el-radio-group v-model="echartNums">
            <el-radio v-for="item in twoRadioData" :label="item.value" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>  
      </div>
      <div :style="{width: '100%',height: height}" :id="idName">
      </div>
    <!-- </el-dialog> -->
    
  </div>
</template>

<script>
import Echarts from 'echarts'
import { tableColumns } from '@/utils/tableColumns'
import { getSite, getHistorySearchList, setHistorySearchList, removeHistorySearchList } from '@/utils/auth'
import { setSearchList } from '@/utils/common'
import { filterSite,filterOutSite,filterSection,filterOutClass,filterPlatform } from '@/utils/filterWord'
import reportForm from '@/components/parts/reportForm.vue'

export default {
  props: {
    echartDatas: {
      type: Array,
      default: ['']
    },
    groupList:{
      type: Array,
      default:[]
    },
    listQuery: Object,
    checkedList: Array,
    height:{
      type: String,
      default: '50vh'
    },
    isSmall:{
      type: Boolean,
      default: false
    },
    idName: {
      type: String,
      default: 'xiaobai'
    },
  },
  components:{reportForm},
  data() {
    return {
      chart: null,
      // echartDialog: false,  
      flag1: false,
      flag2: false,
      visible: false, // 保存图表popover
      echartName: '', // 保存图表名称
      echartNums:'',
      echartLoading: false,
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
      axisXData:[],
      timename:'',
      othername:'',
      echarTitle:'',
      echartType:0,
      firstGroup:'',
      myEchart:'',
      echartsType:'line'
    }
  },
  created() {  
    this.echartSelectFn()
    this.siteData = getSite()

    // console.log('echartDatas3333333333333',this.echartDatas);
    // this.echartNums = this.twoRadioData[0].value
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.reizeEchart, false)
  },
  mounted(){
    let _this = this
    // setTimeout(() => {
    //   let dom = document.getElementById(this.idName)
    //   console.log('domdom',dom);
    //   dom.addEventListener('resize',((e)=>{
    //       console.log(e);
    //     }))
    // }, 3000);
    window.addEventListener("resize", this.reizeEchart, false);

  },
  watch: {
    echartNums(val, old){
      if(old){
        this.listQuery.echartKey = ''
        this.listQuery.echartsType = ''
      }
      this.initData()
    },
  },
  computed: {
    fileData(){
      let obj = {}
      let deletArr = ['platform','book_id','author_name','outsite','class_id','section_id','site_id','timeline','hour','book_name','keyword']
      if(this.echartDatas[0]){
        obj = JSON.parse(JSON.stringify(this.echartDatas[0]))
        deletArr.forEach((re)=>{
          if(obj.hasOwnProperty(re)){
            delete obj[re]
          }
        })
      }
      return Object.keys(obj)
    },
    twoRadioData(){
      let arr = []
      this.fileData.forEach(re=>{
        let label = this.filterName(re)
        if(label && re){
          arr.push({label:label, value:re})
        }
      })
      return arr
    }
  },
  methods: {
    resetEchart(){
      this.echartNums = this.twoRadioData[0].value
      this.initData()
    },
    reizeEchart(){
      // console.log(3333);
      if(this.myEchart){
        this.myEchart.resize();
      }
    },
    changeEchartNum(val){
      // this.listQuery.echartKey = ''
    },
    echartSelectFn(){
      for (let i in tableColumns){
        this.echartSelectText[tableColumns[i].prop] = tableColumns[i].label
      }
    },
    filterName(val){
      for (let i = 0; i < tableColumns.length; i++) {
        if(tableColumns[i].prop==val){
          return tableColumns[i].label
        }
        
      }
    },
    changeEchartX(){
      this.groupList = this.groupList.reverse()
      this.initData()
    },
    initData(){
      // 选择一个分组
      this.seriesData = []
      this.legendData = []
      this.axisXData = []
      if(this.groupList.length == 1){
        let axisX = []
        // this.legendData = 
        this.fileData.map((re)=>{
          if(this.filterName(re)){
            this.legendData.push(this.filterName(re))
          }
        })
        this.echartType = 0
        for (let i = 0; i < this.echartDatas.length; i++) {
          axisX.push(this.echartDatas[i][this.groupList[0]])
          // console.log(7777,this.filterWord(this.groupList[0],this.echartDatas[i][this.groupList[0]]));
          this.axisXData.push(this.filterWord(this.groupList[0],this.echartDatas[i][this.groupList[0]]))
        }
        if(this.listQuery.echartsType){
          this.echartsType = this.listQuery.echartsType
        }
        for(let j in this.fileData){
          // console.log(7777,this.filterName(this.fileData[j]));
          if(this.filterName(this.fileData[j])){
            let obj = {}
            obj.type = this.echartsType
            obj.name = this.filterName(this.fileData[j])
            obj.data = []
            for (let x = 0; x < axisX.length; x++) {
              for (let i in this.echartDatas) {
                if(axisX[x] == this.echartDatas[i][this.groupList[0]]){
                  obj.data.push(this.echartDatas[i][this.fileData[j]] || 0)
                }
              }
            }  
            this.seriesData.push(obj)   
          }
        }
      }
      // 选择两个分组
      else if(this.groupList.length == 2){
        this.echartType = 1
        let legends = []
        let axisXs = []        
        let firstGroup = this.groupList[0]
        let secondGroup = this.groupList[1]
        // if(this.groupList.indexOf(firstGroup)==0){
        //   secondGroup = this.groupList[1]
        // }else{
        //   secondGroup = this.groupList[0]
        // }
        for (let i = 0; i < this.echartDatas.length; i++) {
          if(axisXs.indexOf(this.echartDatas[i][firstGroup])==-1){
            axisXs.push(this.echartDatas[i][firstGroup])
            this.axisXData.push(this.filterWord(firstGroup,this.echartDatas[i][firstGroup]))
          }
          if(legends.indexOf(this.echartDatas[i][secondGroup])==-1){
            legends.push(this.echartDatas[i][secondGroup])
            this.legendData.push(this.filterWord(secondGroup, this.echartDatas[i][secondGroup]))
          }
        }
        if(this.listQuery.echartKey){
          this.echartNums = this.listQuery.echartKey
        }else{
          this.echartNums = this.echartNums || this.twoRadioData[0].value
        }
        if(this.listQuery.echartsType){
          this.echartsType = this.listQuery.echartsType
        }
        // console.log('this.legendData',this.legendData);
        // console.log('firstGroup',firstGroup);
        // console.log('axisXs',axisXs);
        // console.log('secondGroup',secondGroup);
        // console.log('legends',legends);

        for(let j in legends){
          let obj = {}
          obj.type = this.echartsType
          // obj.name = legends[j]
          // obj.keyName = secondGroup
          obj.nameIndex = legends[j]
          obj.data = []
          this.seriesData.push(obj)
        }

        for (let x = 0; x < axisXs.length; x++) {
          this.seriesData.forEach((re)=>{
            let nums = 0
            for (let i in this.echartDatas) {
              if(axisXs[x] == this.echartDatas[i][firstGroup] && this.echartDatas[i][secondGroup]==re.nameIndex){
                re.name = this.filterWord(secondGroup, this.echartDatas[i][secondGroup])
                nums = this.echartDatas[i][this.echartNums]
              }
            }
            re.data.push(nums)
          })
          
        }

      }
      // console.log('this.seriesData',this.seriesData);
      this.initChart(this.idName)
      // console.log('this.legendData',this.legendData);
      // console.log('this.axisXData',this.axisXData);
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
    handleSaveFilter(){
      this.visible = false
      let objs = this.$refs.reportBox.formData
      objs.echartKey = this.echartNums
      objs.echartsType = this.echartsType
      objs.groupList = this.groupList
      if(objs.name){
        this.$emit('postEchartReport', 'echart', objs)
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
        if(value){
          return String(value)
        }else{
          return ''
        }
      }
      
    },
    handleSave(){
      if(this.echartName != ''){
        this.aaa(this.echartName).then((res) => {
          // this.historyEchartData[0]= this.dimensions
          // this.historyEchartData[1] = this.echartData
          // this.historyEchartData[2] = this.series
          this.historyEchartData[0]= this.legendData
          this.historyEchartData[1] = this.axisXData
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
    },
    initChart(name) {
      // console.log(6666,this.echartsType);
      let _this = this
      this.echartLoading = false      
      this.myEchart = Echarts.init(document.getElementById(name))
      var option = {
        title: {
          text: name == this.idName ? '' : '历史图表'
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
          show: true,
          showTitle:false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          right: '5',
          // type: 'magictypechanged',
          // currentType: 'string',
          feature: {
            mark: {show: true},
            // dataView: {show: true, readOnly: false},
            magicType: {
              show: true, 
              type: this.isSmall?[]:['line', 'bar'], 
              // type: ['line', 'bar', 'stack', 'tiled'], 
              
            },
            // restore: {show: true},
            saveAsImage: {show: !this.isSmall}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: this.echartsType=='bar',
          data: this.axisXData,
        },
        yAxis: {
            type : 'value'
        },
        series: this.seriesData
      };
      this.myEchart.clear()
      this.myEchart.setOption(option)  
      this.myEchart.on('magictypechanged',function(a){
        _this.echartsType = a.currentType
      })
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
    /deep/ .el-icon-sort{
      transform: rotate(90deg);
    }
  }
  .echart-wrap {
    border: 1px solid #ddd;
    padding: 2px 10px;
    border-radius: 6px;
    margin-top: 10px;
    box-sizing: border-box;
    padding-top: 10px;
    .el-radio-group{
        width: 100%;
        .el-radio{
          padding-top: 3px;
          padding-bottom: 5px;
        }
    }
    .radio_group{
      position: relative;
      top: 1px;
      padding: 18px 100px 23px 0;
      box-sizing: border-box;
      display: flex;
      .label_word{
        width: 83px;
        font-size: 18px;
        line-height: 20px;
        font-weight: bold;
      }
    }

  }
</style>