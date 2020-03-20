<template>
  <div class="rechargeActivities">
    <div class="rechar_banner">
      <img :src="mainData.event.position.top">
    </div>
    <div class="rechar_box" style="bakground-color:'red'">
      <activeDateBox :expiryTime="expiryTime"></activeDateBox>
      <div class="rechar_item" v-for="(item, index) in mainData.product_list" :key="index">
        <div class="rechar_title">
          <div class="title_word">
            <div class="main_title">{{item.coin+item.coin_name+'+'+item.premium+item.premium_name}}</div>
            <div class="second_title">{{'原价'+item.currency+item.priceValue+'='+item.event_coin+item.coin_name}}</div>
          </div>
        </div>
        <div class="rechar_money">{{item.mark+item.priceValue}}</div>
        <bgButton :btnBgUrl="mainData.event.position.button" btnWord="立即抢购" @btnClick="btnClick(index)"></bgButton>
        <div class="corner_marker">
          <p>标签标记</p>
        </div>
      </div>

      <div class="rechar_footer">
        <div class="footer_title">
          <!-- <img src="../assets/images/yinhao1.png" alt="活动规则图片"> -->
          <b @click="showLoad">活动规则</b>
          <!-- <img src="../assets/images/yinhao2.png" alt="活动规则图片"> -->
        </div>
        <div class="footer_content">
          1、活动所赠8折订阅全站作品、每日签到多送15魔豆、特定作品免费阅读等资格从领取之时起系统将自动开启；<br> 
          2、活动所赠魔豆有效期为30天，请在有效期内完成使用；<br> 
          3、活动所赠限时免费阅读的书籍领取后将自动置于您的书架，请在“我的书架”内查看；
        </div>
      </div>
    </div>
    <activePopup ref="popup" :headerUrl="headerUrl"></activePopup>
  </div>
</template>

<script>
import {tokenCheck } from '../lib/token'
import bgButton from '../components/bgButton'
import activePopup from '../components/activePopup'
import activeDateBox from '../components/activeDateBox'
import { Toast } from 'vant';
import axios from 'axios'
// import '../assets/js/chinese'

export default {
  name: 'rechargeActivities',
  components: { 
    Toast,
    activePopup,
    bgButton,
    activeDateBox
  },
  data(){
    return {
      popupShow: false,
      mainData:{},
      expiryTime:'',
      btnBgUrl: require('../assets/images/btnbg.png'),
      headerUrl: '',
      
    }
  },
  created(){
    this.getInitData()
    // console.log('InteractorProxy',InteractorProxy.login);
      // console.log('4444','./src/assets/css/thems/'+config.themPathName+'.less');
    
  },
  methods:{
    getInitData(){
      let _this = this
      this.$loading.show()
      tokenCheck().then((data)=>{
        console.log(data);
        this.$axios.get('/v1/event.recharge_activity?event_id=141&channel_code=apple&currency=USD').then((res)=>{
          // console.log(res);
          _this.mainData = res.data
          _this.expiryTime = res.data.event.event_desc
          _this.headerUrl = res.data.event.popup_top
          _this.$loading.hide()
        })
      })
    },
    getInitData2(){
      // let _this = this
      // // this.$loading.show()
      //   this.$axios.get('http://localhost:3000/api/users/getCode').then((res)=>{
      //     Toast('接口请求成功')
      //     console.log(res);
      //     Toast(JSON.stringify(res));
      //     _this.$loading.hide()
      //   })
    },
    // testChina(){
    //   zh_tran('t')
    // },
    btnClick(index){
      if(index==0){
        // console.log(this.btnBgUrl);
        
        this.$refs.popup.isShowPopup(true)
        console.log(window.InteractorProxy);
        let info = window.InteractorProxy.getUserInfo()
        Toast(JSON.stringify(info))
      }else if(index==1){
        // Toast('重新登陆2')
        window.InteractorProxy.open("open.page.HOME")
      }else if(index==2){
        window.InteractorProxy.login()
      }else if(index==3){
        // window.InteractorProxy.startWechatPay("10", "3000", "20")
        this.getInitData1()
      }else if(index==4){
        this.getInitData2()
      }
    },
    // closePopup(){
    //   this.$refs.popup.isShowPopup(false)
    // },
    btnClick1(){
      window.InteractorProxy.login()
      
    },
    showLoad(){
      console.log('InteractorProxy',window.InteractorProxy);
      console.log('window.InteractorProxy.app',window.InteractorProxy.app);
      console.log('window.InteractorProxy.getUserInfo()',window.InteractorProxy.getUserInfo());
      
    }

  }
}
</script>
<style lang="less" scoped>
  .rechargeActivities{
    width: 100%;
    height: 100%;
    .rechar_banner{
      width: 100%;
      height: 180px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .rechar_money{
      font-size:18px;
      font-weight:400;
      line-height:25px;
      margin-top: 8px;
    }
    .rechar_box{
      width: 100%;
      box-sizing: border-box;
      padding-top: 28px;
      padding-bottom: 36px;
      .rechar_item{
        width: 329px;
        height: 140px;
        margin: 14px auto;
        border-radius: 4px;
        text-align: center;
        position: relative;
        overflow: hidden;
        .rechar_title{
          padding: 0 7px;
          overflow: hidden;
          
          .title_word{
            font-weight: bold;
            margin-top: 16px;
            text-align: center;
            .main_title{
              font-size: 18px;
              line-height:22px;
            }
            .second_title{
              font-size:10px;
              font-weight:400;
              font-size: 14px;
              text-decoration: line-through;
              margin-top: 6px;
              line-height:20px;
            }
          }
        }
        .corner_marker{
          position: absolute;
          width: 20px;
          // height: 90px;
          // bottom: 0;
          left: 7px;
          transform: rotate(-45deg);
          height: 100%;
          display: flex;
          align-items: center;
          top: 53px;
          p{
            // position: absolute;
            font-size: 12px;
            transform: scale(0.72);
            // bottom: 2px;
          }
        }
        .rechar_content{
          display: flex;
          height: 90px;
          justify-content: space-around;
          li{
            width: 50px;
            height: 80px;
            font-size: 16px;
          }
        }
      }
      .rechar_footer{
        width: 329px;
        margin: 0 auto;
        .footer_title{
          font-size:14px;
          // font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          margin: 30px auto 8px;
          text-align: center;
          b{
            font-size: 14px;
            padding: 0 9px;
          }
        }
        .footer_content{
          font-size: 12px;
          font-weight:400;
          line-height:17px;
        }
      }
    }
    
  }
  
</style>
