<template>
  <div class="date_area">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="绝对时间" name="3">
            <DatePanel ref="datePanel" v-model="dateAreas" :show-time="false" />
        </el-tab-pane>
        <el-tab-pane label="快捷键" name="1">
            <ul class="quilty_box">
                <li class="quilty_li" @click="clickQuilty(item)" v-for="item in quiltyDates" :key="item.value" :class="{selectColor: item.selected}" :style="{clear:item.break?'both':'auto'}">
                    {{item.label}}
                </li>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="相对时间" name="2">
            <div class="rel_box">
                <div class="rel_word" v-if="showDbInput">从</div>
                <el-input-number v-model="relNum1" @change="changeRelNum1" controls-position="right" :min="0"></el-input-number>
                <el-select v-model="relType1">
                    <el-option v-for="item in dateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <el-button v-if="!showDbInput" @click="addRelData()" style="display:block;margin:auto;margin-top:10px" size="mini" icon="el-icon-arrow-down" circle></el-button>
            <div class="rel_box" v-if="showDbInput">
                <div class="rel_word" v-if="showDbInput">到</div>
                <el-input-number v-model="relNum2" controls-position="right" :min="0"></el-input-number>
                <el-select v-model="relType2">
                    <el-option v-for="item in dateTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button @click="deleteRelData()" style="margin: 5px 0px 0px 10px;height:30px;" size="mini" icon="el-icon-minus" circle></el-button>
            </div>
        </el-tab-pane>
        
    </el-tabs>
    <div style="padding-top: 10px;text-align: right;padding-right: 10px;">
        <el-button size="mini" type="primary" @click="configDate">确定</el-button>
    </div>
  </div>
</template>
<script>
import DatePanel from './DatePanel.vue'
export default {
  props: {
    
  },
  data(){
      return{
          activeName:'3',
          dateAreas:[],
          relNum1: 1,
          relNum2: 0,
          relType1:'-day',
          relType2:'-day',
          quiltyValue:'',
          showDbInput: false,
          quiltyDates:[
              {label:'近一天',value:'1 day',selected:false},
              {label:'近两天',value:'2 day',selected:false},
              {label:'近三天',value:'3 day',selected:false},
              {label:'近四天',value:'4 day',selected:false},
              {label:'近五天',value:'5 day',selected:false},
              {label:'近六天',value:'6 day',selected:false},
              {label:'近一周',value:'1 week',break:true,selected:false},
              {label:'近两周',value:'2 week',selected:false},
              {label:'近三周',value:'3 week',selected:false},
              {label:'近一月',value:'1 month',break:true,selected:false},
              {label:'近两月',value:'2 month',selected:false},
              {label:'近三月',value:'3 month',selected:false},
              {label:'近半年',value:'6 month',break:true,selected:false},
              {label:'近一年',value:'1 year',selected:false},
          ],
          dateTypes:[
              {label:'天前', value:'-day'},
              {label:'周前', value:'-week'},
              {label:'月前', value:'-month'},
              {label:'年前', value:'-year'},
              {label:'天后', value:'+day'},
              {label:'周后', value:'+week'},
              {label:'月后', value:'+month'},
              {label:'年后', value:'+year'},
          ]
      }
  },
  components: {
    DatePanel
  },
  created() {
 
  },
  computed:{
      
  },
  methods: {
    handleClick(val){
        // console.log(val);
    },
    changeRelNum1(){
        // this.relNum2 = this.relNum1 - 1
    },
    postToTime(times){
        this.dateAreas = times
        this.$refs.datePanel.postToTime(times)
    },
    clickQuilty(item){
        // console.log(item);
        this.quiltyValue = item.value
        this.quiltyDates.forEach((re)=>{
            re.selected = false
            this.$set(item, 'selected', true)
        })
        this.$set(item, 'selected', true)
        // item.selected = true
    },
    addRelData(){
        this.showDbInput = true
    },
    deleteRelData(){
        this.showDbInput = false
    },
    configDate(){
      let result = {
          dates:[]
      }
      if(this.activeName=='1' || this.activeName=='2'){
          if(this.activeName=='1'){
            //   console.log('this.quiltyValue',this.quiltyValue);
              if(!this.quiltyValue){
                  this.$message.warning('请选择快捷键')
                  return
              }
              let arr1 = this.quiltyValue.split(' ')
              result.dates = [arr1[0], 0]
              result.type = 'rel'
              result.time_unit = '-'+arr1[1]+','+'-'+arr1[1]
          }else{
              if(!this.showDbInput){
                  result.dates = [this.relNum1, 0]
                  result.type = 'rel'
                  result.time_unit = this.relType1+','+this.relType1
              }else{
                  result.dates = [this.relNum1,this.relNum2]
                  result.type = 'rel'
                  result.time_unit = this.relType1+','+this.relType2
              }
          }
      }else if(this.activeName=='3'){
          result.dates = this.dateAreas
          result.type = 'abs'
      }
      if(this.activeName != '1'){
        this.quiltyDates.forEach((re)=>{
            re.selected = false
        })
      }
      if(this.activeName != '2'){
        this.relNum1 = 1
        this.relType = 'day'
        this.showDbInput = false
      }
    //   if(this.activeName != '3'){
    //     this.dateAreas = []
    //   }
      this.$emit('changedTime',result)
    },
    changeTimeStyle(val){
        let time
        if(val){
            let valarr = val.split(' ')
            if(valarr[1] == 'day'){
                time = new Date(new Date().getTime() + valarr[0]*3600*24*1000)
            }else if(valarr[1] == 'week'){
                console.log(valarr);
                time = new Date(new Date().getTime() + valarr[0]*3600*24*1000*7)
            }else if(valarr[1] == 'month'){
                time = new Date(new Date().getTime() + valarr[0]*3600*24*1000*30)
            }else if(valarr[1] == 'year'){
                time = new Date(new Date().getTime() + valarr[0]*3600*24*1000*365)
            }
        }
        return time
    }
  },
}
</script>
<style scoped lang="scss">
    .date_area{
        .quilty_box{
            margin-left: -32px;
            overflow: hidden;
            margin-top: 0;
            margin-bottom: 0;
            .quilty_li{
                list-style: none;
                float: left;
                margin-left: 18px;
                width: 63px;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                &:hover{
                    color: #409EFF;
                }
            }
            .selectColor{
                color: #409EFF;
            }
        }
        .rel_box{
            margin-top: 12px;
            .rel_word{
                float: left;
                line-height: 40px;
                padding-right: 8px;
            }
            .el-select{
                width: 180px;
            }
        }
    }
</style>