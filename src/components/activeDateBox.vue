<template>
    <div class="rechar_time">
      <div class="time_box">
        <div class="time_num">
            <p class="num">{{endTime.day}}</p>
            <p class="tip">天</p>
            <p class="num">{{endTime.hour}}</p>
            <p class="tip">时</p>
            <p class="num">{{endTime.minute}}</p>
            <p class="tip">分</p>
            <p class="num">{{endTime.second}}</p>
            <p class="tip">秒</p>
        </div>
        <div class="time_to">
          截止时间：2019.02.01
        </div>
      </div>
      <div class="time_silder"></div>
    </div>
</template>

<script>
export default {
  props:['expiryTime'],
  name: 'activeDate',
  mounted(){
    
  },
  data(){
    return {
      
    }
  },
  computed:{
    endTime(){
      var theTime = parseInt(this.expiryTime);// 需要转换的时间秒 
      var theTime1 = 0;// 分 
      var theTime2 = 0;// 小时 
      var theTime3 = 0;// 天
      if(theTime > 60) { 
        theTime1 = parseInt(theTime/60); 
        theTime = parseInt(theTime%60); 
        if(theTime1 > 60) { 
        theTime2 = parseInt(theTime1/60); 
        theTime1 = parseInt(theTime1%60); 
        if(theTime2 > 24){
          //大于24小时
          theTime3 = parseInt(theTime2/24);
          theTime2 = parseInt(theTime2%24);
        }
        } 
      } 
      var result = {};
      if(theTime > 0){
        result.second = parseInt(theTime)
      }
      if(theTime1 > 0) { 
        result.minute = parseInt(theTime1)
      } 
      if(theTime2 > 0) { 
        result.hour = parseInt(theTime2)
      } 
      if(theTime3 > 0) { 
        result.day = parseInt(theTime3)
      }
      return result; 
      

    }
    

  },
  methods:{
    
  }

}
</script>

<style lang="less" scoped>
  .rechar_time{
    position: relative;
    width: 318px;
    margin: 0 auto;
    margin-top: -65px;
    .time_box{
      width:290px;
      height:60px;
      margin: 0 auto;
      text-align: center;
      border-radius:11px 11px 0px 0px;
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
    .time_silder{
      width:318px;
      height:14px;
      border-radius:7px;
    }

  }
</style>
