<template>
  <div class="rechargeActivities">
    <div class="rechar_banner">
      <img src="../assets/images/banner.png" alt="" srcset="">
    </div>
    <div class="rechar_box">
      <activeDateBox></activeDateBox>
      <!-- <button @click="getInitData">获取token</button>
      <button @click="getData">请求数据</button> -->
      <div class="rechar_item" v-for="(item, index) in activeData" :key="index">
        <div class="rechar_title">
          <div class="title_word">
            <div class="main_title">{{item.mainTitle}}</div>
            <div class="second_title">{{item.secondTitle}}</div>
          </div>
        </div>
        <div class="rechar_money">{{item.recharMoney}}</div>
        <bgButton :btnBgUrl="btnBgUrl" btnWord="立即抢购" @btnClick="btnClick"></bgButton>
        <div class="corner_marker">
          <img src="../assets/images/cornermarker.png" alt="角标">
          <p>角标</p>
        </div>
      </div>

      <div class="rechar_footer">
        <div class="footer_title">
          <!-- <img src="../assets/images/yinhao1.png" alt="活动规则图片"> -->
          <b>活动规则</b>
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
import {tokenCheck} from '../lib/token'
import bgButton from '../components/bgButton'
import activePopup from '../components/activePopup'
import activeDateBox from '../components/activeDateBox'

export default {
  name: 'rechargeActivities',
  components: { 
    activePopup,
    bgButton,
    activeDateBox
  },
  data(){
    return {
      popupShow: false,
      btnBgUrl: require('../assets/images/btnbg.png'),
      headerUrl: require('../assets/images/popbg.png'),
      activeData:[
        {mainTitle: '4200魔币+600魔豆', secondTitle:'原价：us19.99=8400书币+1200书券', recharMoney:'US$19.99'},
        {mainTitle: '4200魔币+600魔豆', secondTitle:'原价：us19.99=8400书币+1200书券', recharMoney:'US$19.99'},
        {mainTitle: '4200魔币+600魔豆', secondTitle:'原价：us19.99=8400书币+1200书券', recharMoney:'US$19.99'}
      ]
    }
  },
  created(){
    // console.log('InteractorProxy',InteractorProxy.login);
      // console.log('4444','./src/assets/css/thems/'+config.themPathName+'.less');
    this.getInitData()
  },
  methods:{
    getInitData(){
      tokenCheck().then((data)=>{
        // this.$axios.get('/recharge.rechargeEvent?event_id=141&user_id=72&platform=3000').then((res)=>{
        //   console.log('111111',res);
        // })
      })
    },
    
    btnClick(){
      this.$refs.popup.isShowPopup(true)
    },
    // closePopup(){
    //   this.$refs.popup.isShowPopup(false)
    // },
    btnClick1(){
      InteractorProxy.login()
      
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
          width: 27px;
          height: 55px;
          bottom: 0;
          left: 20px;
          img{
            width: 100%;
          }
          p{
            position: absolute;
            font-size: 14px;
            // writing-mode: vertical-rl;
            bottom: 2px;
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
