<template>
  <div class="active_popup" v-show="popupAll">
    <!-- <transition name="bounce"> -->
      <Popup v-model="popupShow" @close="onClose" :overlay-style="{backgroundColor:'rgba(0, 0, 0, 0.29)'}">
        <div class="pop_box">
          <img id="imgId" class="pop_header" :src="headerUrl" alt="pop弹框图片">
          <div class="pop_content">
            <div class="pop_tip">温馨提示</div>
            <div class="pop_list">
              非常抱歉<br>活动结束了～
            </div>
            <div class="pop_btn" @click="onClose">
              <bgButton :btnBgUrl="btnBgUrl" btnWord="我知道了"></bgButton>
            </div>
            <div class="end_time">
              活动截止时间：2020-02-02
            </div>
          </div>
        </div>
      </Popup>
    <!-- </transition> -->
  </div>
</template>

<script>
import {Popup, Loading} from 'vant'
import bgButton from './bgButton'
export default {
  props:['headerUrl'],
  name: 'activePopup',
  components:{Popup, bgButton},
  mounted(){
    
  },
  data(){
    return {
      popupAll: false,
      popupShow: false,
      btnBgUrl: require('../assets/images/btnbg.png'),
    }
  },
  methods:{
    // panicBuy(){
    //   this.$emit('btnClick')
    // },
    onClose(){
      this.popupShow = false
      
    },
    isShowPopup(isTrue){
      if(isTrue){
        this.popupShow = true
        this.$nextTick(()=>{
          let imgId = document.getElementById('imgId')
          imgId.onload=(()=>{
            this.popupAll = true
          })
        })
      }else{
        this.popupShow = false
      }
    }
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
      border-radius:0px 0px 8px 8px;
      margin: 0 auto;
      margin-top: -1px;
      .pop_tip{
        font-size:18px;
        font-weight: bold;
        line-height: 25px;
        padding-top: 7px;
      }
      .pop_list{
        font-weight:500;
        line-height:22px;
        font-size:16px;
        margin-top: 4px;
      }
      .pop_btn{
        padding-top: 6px;
        // padding-bottom: 10px;
      }
      .end_time{
        padding: 7px;
      }
    }
    
  }
  // .active_popup /deep/.van-overlay{
  //   opacity: 0.2905;
  // }

</style>
