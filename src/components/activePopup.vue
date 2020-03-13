<template>
  <div class="active_popup">
    <Popup v-model="popupShow" @close="onClose" @before-enter="onClose">
      <div class="pop_box">
        <img class="pop_header" :src="headerUrl" alt="pop弹框图片">
        <div class="pop_content">
          <div class="pop_tip">温馨提示</div>
          <div class="pop_list">
            非常抱歉<br>活动结束了～
          </div>
          <div class="pop_btn" @click="onClose">
            <bgButton :btnBgUrl="btnBgUrl" btnWord="我知道了"></bgButton>
          </div>
        </div>
      </div>
    </Popup>
  
  </div>
</template>

<script>
import {Popup} from 'vant'
import bgButton from './bgButton'
export default {
  props:['headerUrl', 'popupShow'],
  name: 'activePopup',
  components:{Popup, bgButton},
  mounted(){
    
  },
  data(){
    return {
      btnBgUrl: require('../assets/images/btnbg.png'),
    }
  },
  methods:{
    // panicBuy(){
    //   this.$emit('btnClick')
    // },
    onClose(){
      // console.log(this.popupShow);
      this.$emit('closePopup')
    },
  }

}
</script>

<style lang="less" scoped>
.van-popup{
  background-color: transparent;
}
.pop_box{
    width: 300px;
    .pop_header{
      width: 300px;
      height: 120px;
    }
    .pop_content{
      text-align: center;
      width:260px;
      background: @whiteBgColor;
      border-radius:0px 0px 8px 8px;
      margin: 0 auto;
      margin-top: -1px;
      .pop_tip{
        font-size:18px;
        color: @popupTitleColor;
        font-weight: bold;
        line-height: 25px;
        padding-top: 7px;
      }
      .pop_list{
        font-weight:500;
        color: @popupContentColor;
        line-height:22px;
        font-size:16px;
        margin-top: 4px;
      }
      .pop_btn{
        padding: 6px;
        padding-bottom: 10px;
      }
    }
  }
</style>
