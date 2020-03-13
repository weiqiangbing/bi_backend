<template>
  <div class="button">
    <div class="rechar_btn" @click="panicBuy()">
      <div class="btn_word">{{btnWord}}</div>
      <img class="btn_bg" :src="btnBgUrl" alt="按钮图片">
    </div>
  
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
  .rechar_btn{
      position: relative;
      text-align: center;
      width: 136px;
      height: 32px;
      margin: 2px auto;
      .btn_word{
        font-size: 12px;
        position: absolute;
        z-index: 9;
        left: 0;
        top: 0;
        line-height: 33px;
        color: @whiteBgColor;
        width: 100%;
        height: 100%;
      }
      .btn_bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
  }
</style>
