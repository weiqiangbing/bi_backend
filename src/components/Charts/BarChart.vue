<template>
  <div v-loading="loading" style="width:100%;height:310px">
    <!-- <div style="cursor: pointer;" :id="id" :class="className" :style="{height:height,width:width}" /> -->
    <ChartLine ref="chartLine" :idName="id" height="300px" :isSmall="true" :echartDatas="echartDatas" :listQuery="listQuery" :checkedList="checkedList" :groupList="groupList"></ChartLine>
  </div>
</template>

<script>
import { tableColumns } from '@/utils/tableColumns'
import echarts from 'echarts'
import {commonGet} from '@/api/public/index'
import ChartLine from '@/components/Charts/echarts'
// import resize from './mixins/resize'

export default {
  // mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    },
    item: Object

  },
  components:{ChartLine},
  data() {
    return {
      chart: null,
      loading: false,
      xAxis: 'timeline',
      echartSelectText: [], // 图表中文集合
      series: [{type: 'bar'}],
      echartData: [],
      dimensions: [],
      echartDatas: [],
      checkedList: [],
      groupList:[],
      listQuery:{},
      terval: null
    }
  },
  created() {

  },
  mounted() {
    this.listQuery = this.item.listQuery
    this.getInitData()
    // this.initChart()
    this.terval = setInterval(() => {
      this.getInitData()
    }, this.item.refresh_time * 1000 * 60);
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    clearInterval(this.terval)
  },
  methods: {
    echartSelectFn(){
      for (let i in tableColumns){
        this.echartSelectText[tableColumns[i].prop] = tableColumns[i].label
      }
    },
    changeEchartWidth(){
      this.$refs.chartLine.reizeEchart()
    },
    getInitData(){
      let _this = this
      this.checkedList = this.item.checkedList
      this.apis = this.item.apis
      this.loading = true
      let arr = []
      this.echartDatas = []
      this.groupList =  this.listQuery.group.length > 0 ?  this.listQuery.group.split(",") : []
      this.apis.forEach((re)=>{
        arr.push(re)
        commonGet(re, this.listQuery).then((res)=>{
          this.echartDatas = this.echartDatas.concat(res.data.collection)
          if(arr.length >= _this.apis.length){
            _this.loading = false
            _this.$nextTick(()=>{
              // console.log('33333455666',_this.echartDatas);
              if(_this.$refs.chartLine){
                _this.$refs.chartLine.initData()
              }
            })
          }
        })
      })

      // this.echartData = []
      // for(let i in this.item.data){
      //   const obj = {}
      //   for (let j in this.item.data[i]){  
      //     if(this.item.checkedList.indexOf(j) != -1 || j == this.xAxis){
      //       obj[this.echartSelectText[j]] = this.item.data[i][j]
      //     } 
      //   }
      //   this.echartData.push(obj)
      // }
    },
    initChart() {
      const chart = echarts.init(document.getElementById(this.id))
      // const xData = (function() {
      //   const data = []
      //   for (let i = 1; i < 13; i++) {
      //     data.push(i + 'month')
      //   }
      //   return data
      // }())
      var option = {
        title: {
          text: this.item.name,
          left: 'center',
          top: 1,
          textStyle: {
            fontSize: 16
          }
        },
        tooltip : {},
        grid:{
          bottom: 45,
          top: 50,
          left: 50
        },
        toolbox: {},
        dataset: {
            // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
            // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射。
            dimensions: this.item.data[0],
            source: this.item.data[1]
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
            type : 'value'
        },
        series: this.item.data[2]
      };
      chart.on('legendselectchanged', function (params) {
        window.event? window.event.cancelBubble = true : e.stopPropagation();
      });
      // console.log('dimensions', this.dimensions)
      // console.log('echartData', this.echartData)
      chart.clear()
      chart.setOption(option)
      
    },
  }
}
</script>
<style lang="csss" scoped>
  
</style>
