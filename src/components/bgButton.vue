<template>
  <div class="button" :class="{is_invalid: isInvalid}">
    <div class="img_btn" :style="{width: bWidth, height: bHeight}" @click="panicBuy()">
      <div class="btn_word" :style="{color: wordColor,fontSize:bFontSize, fontWeight:bIsWeight}">{{btnWord}}</div>
      <img class="btn_bg" :src="btnBgUrl" alt="按钮图片">
    </div>
  
  </div>
</template>

<script>
import config from '../lib/config'
export default {
  // props:['btnBgUrl', 'btnWord', 'isInvalid'],
  props:{
    btnBgUrl: String,
    btnWord: String,
    isInvalid:{
      type: Boolean,
      default: true
    },
    width:{
      type: Number,
      default: 150
    },
    height:{
      type: Number,
      default: 36
    },
    wordColor:{
      type: String,
      default: '#ffffff'
    },
    isWeight:{
      type: Boolean,
      default: false
    },
    fontSize:{
      type: Number,
      default: 12
    }
  },
  name: 'buttons',
  mounted(){
    
  },
  data(){
    return {
      
    }
  },
  computed:{
    bWidth(){
      if(this.width){
        return (this.width / config.pxRemUnit)+'rem'
      }else{
        return ''
      }
    },
    bHeight(){
      if(this.height){
        return (this.height / config.pxRemUnit)+'rem'
      }else{
        return ''
      }
    },
    bFontSize(){
      if(this.fontSize){
        return (this.fontSize / config.pxRemUnit)+'rem'
      }else{
        return ''
      }
    },
    bIsWeight(){
      if(this.isWeight){
        return 'bold'
      }
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
  .img_btn{
      position: relative;
      text-align: center;
      margin: 2px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn_word{
        font-size: 12px;
        z-index: 9;
      }
      .btn_bg{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
  }
  .is_invalid{
    pointer-events: none;
  }
</style>
