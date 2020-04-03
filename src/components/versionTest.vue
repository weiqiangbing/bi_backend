<template>
  <!-- <div id="version" class="active_popup" v-show="popupAll"> -->
  <div id="version" class="active_popup">
    <!-- <transition name="bounce"> -->
      <Popup v-model="popupShow" :close-on-click-overlay="shadwClose" :overlay-style="{backgroundColor:'rgba(0, 0, 0, 0.29)'}">
        <div class="pop_box">
          <img id="imgId" class="pop_header" :src="headerUrl" alt="版本图片">
          <div class="pop_dom">
            <div class="pop_list">
              当前版本过低<br>请升级到最新版本
            </div>
            <div class="pop_btn" @click="upgrade">
              <bgButton :btnBgUrl="btnBgUrl" btnWord="立即升级"></bgButton>
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
import comm from '../lib/utils/comm.js'
import formatJson from '../lib/utils/formatJson'
export default {
  props:{
    headerUrl: {
      type: String,
      default: require('../assets/images/upgrade.png')
    },
    shadwClose:{
      type: Boolean,
      default: false
    }
  },
  name: 'activePopup',
  components:{Popup, bgButton},
  mounted(){
    
  },
  data(){
    return {
      // popupAll: false,
      // popupShow: false,
      btnBgUrl: require('../assets/images/upgradebtn.png'),
    }
  },
  computed:{
    popupShow(){
      return this.$store.state.versionPop
    }
  },
  methods:{
    upgrade(){
      this.popupShow = false
      let a = document.createElement('a')
      let platform = window.InteractorProxy.app.platform
      let aHref = ''
      let appObj = formatJson.formatAppInfo('appName', window.InteractorProxy.app.scheme)
      console.log('appObjmm',appObj);
      if(platform && platform.toLowerCase()=='ios'){
        aHref = appObj.iosUpdateUrl
        // aHref = "https://itunes.apple.com/app/id1454202392"
      }else{
        aHref = appObj.andUpdateUrl
        // aHref = "https://play.google.com/store/apps/details?id=and.legendnovel.app"
      }
      a.href = aHref
      a.click()
    },
  }

}
</script>

<style lang="less" scoped>
.van-popup{
  background-color: transparent;
}
.pop_box{
    width: 222px;
    height: 162px;
    background-color: #ffffff;
    border-radius: 6px;
    position: relative;
    .pop_header{
      position: absolute;
      width: 99px;
      height: 80px;
      top: -48px;
      left: 50%;
      transform: translate(-50%, 10px);
    }
    .pop_dom{
      text-align: center;
      border-radius:0px 0px 8px 8px;
      margin: 0 auto;
      padding-top: 50px;
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
        padding-bottom: 6px;
      }
      .pop_btn{
        padding-top: 6px;
      }
      .pop_btn /deep/ .img_btn{
        width: 130px;
      }
      .end_time{
        padding: 7px;
      }
    }

    
  }
  .van-popup{
    overflow: initial;
  }

</style>
