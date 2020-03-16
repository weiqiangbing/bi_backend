<template>
    <div class="rechar_time">
      <div class="time_box">
        <div class="time_num">
            <p class="num">01</p>
            <p class="tip">天</p>
            <p class="num">03</p>
            <p class="tip">时</p>
            <p class="num">03</p>
            <p class="tip">分</p>
            <p class="num">03</p>
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
  props:['btnBgUrl', 'btnWord'],
  name: 'buttons',
  mounted(){
    
  },
  data(){
    return {
      
    }
  },
  methods:{
    panicBuy(){
      this.$emit('btnClick')
    }
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
