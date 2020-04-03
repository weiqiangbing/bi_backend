<template>
    <div class="rechar_time">
      <div class="time_box">
        <div class="time_num">
            <p class="num">{{endTime.day}}</p>
            <p class="tip">{{$land('天')}}</p>
            <p class="num">{{endTime.hour}}</p>
            <p class="tip">{{$land('时')}}</p>
            <p class="num">{{endTime.minute}}</p>
            <p class="tip">{{$land('分')}}</p>
            <p class="num">{{endTime.second || 0}}</p>
            <p class="tip">{{$land('秒')}}</p>
        </div>
        <div class="time_to">
          {{$land('截止时间')}}：{{endDate}}
        </div>
      </div>
      <div class="silder time_silder1">
        <p :style="{'background-color':bgColor}"></p>
        <div v-show="bgColor"></div>
        <p :style="{'background-color':bgColor}"></p>
      </div>
      <div class="silder time_silder2">
        <p :style="{'background-color':bgColor}"></p>
        <div v-show="bgColor"></div>
        <p :style="{'background-color':bgColor}"></p>
      </div>
    </div>
</template>

<script>
import comm from '../lib/utils/comm.js'
export default {
  props:['expiryTime', 'bgColor', 'endDate'],
  name: 'activeDate',
  mounted(){
    
  },
  data(){
    return {
      surplusTime:'',
    }
  },
  watch:{
    expiryTime(val, old){
      if(val && !old){
        this.surplusTime = this.expiryTime * 1000
        setInterval(()=>{
          this.surplusTime = this.surplusTime - 1
        },1000)
      }
    }
  },
  computed:{
    endTime(){
      let lastTime = comm.getDayAndTime(this.surplusTime)
      if(lastTime.day || lastTime.hour || lastTime.minute || lastTime.second){
        this.$emit('changeInvalid',false)
      }else{
        this.$emit('changeInvalid',true)
      }
     return lastTime    
    }
    

  },
  methods:{
    
  }

}
</script>

<style lang="less" scoped>
  .rechar_time{
    position: relative;
    width: 270px;
    height:60px;
    margin: 0 auto;
    margin-top: -65px;
    .time_box{
      width:270px;
      height:60px;
      margin: 0 auto;
      text-align: center;
      border-radius: 4px;
      z-index: 9;
      position: relative;
      top: 6px;
      padding-top: 12px;
      box-sizing: border-box;
      .time_num{
        line-height: 22px;
        p{
          display: inline-block;
          margin: 1px 3px;
        }
        .num{
          font-size:12px;
          width:20px;
          height:18px;
          line-height: 18px;
          text-align: center;
        }
        .tip{
          font-size:10px;
        }
      }
      .time_to{
        font-size:12px;
        font-weight:400;
        line-height: 20px;
      }
    }
    .silder{
      position: absolute;
      bottom: -22px;
      z-index: 10;
      height: 24px;
      width: 5px;
      div{
        height: 24px;
        width: 5px;
        position: absolute;
        background-color: rgb(255,255,255);
        z-index: 9;
        border-radius: 10px;
        box-shadow: 0 0 1px 1px #E4E4E4;
      }
      p{
        width: 9px;
        height: 9px;
        border-radius: 50%;
        position: absolute;
        left: -2px;
      }
      p:nth-child(1){
        top: -5px;
      }
      p:nth-child(3){
        bottom: -5px;
      }
    }
    .time_silder1{
      left: 40px;
    }
    .time_silder2{
      right: 40px;
    }

  }
</style>
