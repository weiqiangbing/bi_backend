<template>
  <div class="rechargeActivities" :style="{'background-color':eventImage.background_color}">
    <div class="rechar_banner">
      <img v-if="eventImage.top" :src="eventImage.top">
    </div>
    <div class="rechar_box">
      <activeDateBox v-show="productList.length != 0" :expiryTime="expiryTime" :endDate="endDate" @changeInvalid="changeInvalid" :bgColor="eventImage.background_color"></activeDateBox>
      <div class="rechar_item" v-for="(item, index) in productList" :key="index">
        <div class="rechar_title">
          <div class="title_word">
            <div class="main_title">{{$land(mainTitle(item))}}</div>
            <div class="second_title">{{$land(secondTitle(item))}}</div>
          </div>
        </div>
        <div class="rechar_money">{{item.mark+item.priceValue}}</div>
        <bgButton :btnBgUrl="btnBgUrl" :isInvalid="isInvalid" :btnWord="$land('立即抢购')" @btnClick="btnClick(item, index)"></bgButton>
        <div v-if="item.badge_color && item.badge_text" class="corner_marker" :style="{'background-color': item.badge_color}">
          <p>{{$land(item.badge_text)}}</p>
        </div>
      </div>

      <div class="rechar_footer" v-show="productList.length != 0">
        <div class="footer_title">
          <!-- <img src="../assets/images/yinhao1.png" alt="活动规则图片"> -->
          <b>{{$land('活动规则')}}</b>
          <!-- <img src="../assets/images/yinhao2.png" alt="活动规则图片"> -->
        </div>
        <div class="footer_content" v-html="$land(eventRule)">
          
        </div>
      </div>
      <!-- <button @click="gethuodongData">获取用户信息</button>
      <button >测试接口</button> -->
    </div>
    <activePopup ref="popup" :endDate="endDate" :headerUrl="eventImage.popup_top"></activePopup>
  </div>
</template>

<script>
import {tokenCheck } from '../lib/token'
import bgButton from '../components/bgButton'
import activePopup from '../components/activePopup'
import activeDateBox from '../components/activeDateBox'
import { Toast } from 'vant';
import comm from '../lib/utils/comm.js'
import {params} from '../lib/utils/variable'
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
      isInvalid: true,
      productList:[],
      expiryTime:'',
      isJoin:'',
      btnBgUrl: '',
      eventStatus:'',
      endDate:'',
      eventImage:{},
      eventRule:`1、本活动只在页面展示的活动时间内生效，请及时关注。<br>
          2、充值成功后，相应的魔币和魔豆将立即到账，请在个人中心查看。<br>
          3、魔豆有效期为30天，到期自动失效，请在有效期内尽快使用。<br>
          4、充值成功后，所赠打折卡将自动开启，打折卡有效时间内订阅全站作品可享受8折优惠。<br>
          5、打折卡8折特权只在订阅时有效，针对其他形式的消费一律无效。<br>
          6、如多次购买，系统将自动顺延所赠的打折卡时间。`
    }
  },
  created(){
    this.$loading.show()
  },
  mounted(){
    this.getInitData()
  },
  computed:{
    
  },
  methods:{
    getInitData(){
      let _this = this
      tokenCheck().then((data)=>{
        console.log(params);
        this.$axios.get('/v1/event.recharge_activity?event_id='+params.event_id).then((res)=>{
          _this.productList = res.data.product_list
          _this.expiryTime = res.data.event.expiry_time
          _this.endDate = comm.getDatetr(_this.expiryTime * 1000)
          _this.isJoin = res.data.event.isJoin
          _this.eventStatus = res.data.event.event_status
          _this.eventImage = res.data.event.position
          _this.$loading.hide()
          if(res.data.event.event_rule){
            _this.eventRule = res.data.event.event_rule
          }
          this.judgeAuthority()
        })
      })
    },
    changeInvalid(isTrue){
      if(isTrue){
        this.isInvalid = true
        this.btnBgUrl = this.eventImage.button_invalid
        // this.$refs.popup.isShowPopup(true, "温馨提示", "非常抱歉<br>活动结束了~", this.expiryTime)
      }else{
        this.isInvalid = false
        this.btnBgUrl = this.eventImage.button
      }
    },
    // 判断按钮权限
    judgeAuthority(){
      if(this.eventStatus==1 && this.isJoin && this.expiryTime > new Date().getTime()/1000){
        this.isInvalid = false
        this.btnBgUrl = this.eventImage.button
      }else if(this.eventStatus==1 && this.isJoin && this.expiryTime <= new Date().getTime()/1000){
        this.$refs.popup.isShowPopup(true, "温馨提示", "非常抱歉<br>活动结束了~", this.expiryTime)
        this.isInvalid = true
        this.btnBgUrl = this.eventImage.button_invalid
        this.expiryTime = new Date().getTime()/1000
      }else{
        this.isInvalid = true
        this.btnBgUrl = this.eventImage.button_invalid
        this.expiryTime = new Date().getTime()/1000
        this.endDate = comm.getDatetr(new Date(new Date().getTime() - 24*3600*1000).getTime())
        this.$refs.popup.isShowPopup(true, "温馨提示", "非常抱歉<br>活动已下架",this.expiryTime)
      }
    },
    mainTitle(item){
      let str = ''
      if(item.event_coin && item.coin_name){
        str += item.event_coin+item.coin_name
      }
      if(item.event_premium && item.premium_name){
        str += '+'+item.event_premium+item.premium_name
      }
      if(item.event_discount_days){
        str += '+'+item.event_discount_days+this.$land('天打折卡')
      }
      return str
    },
    secondTitle(item){
      let str = '原价：'
      if(item.priceValue){
        str+= item.mark+item.priceValue+'='
      }
      if(item.coin && item.coin_name){
        str += item.coin+item.coin_name
      }
      if(item.premium && item.premium_name){
        str += '+'+item.premium+item.premium_name
      }
      if(item.discount_days){
        str += '+'+item.discount_days+this.$land('天打折卡')
      }
      return str
    },
    btnClick(item, index){
      window.InteractorProxy.open("open.page.PAY")
    },

  }
}
</script>
<style lang="less" scoped>
  .rechargeActivities{
    width: 100%;
    height: 100%;
    // overflow-y: auto;
    .rechar_banner{
      width: 100%;
      height: 173px;
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
        height: 144px;
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
          width: 100%;
          // height: 90px;
          // bottom: 0;
          // left: 7px;
          transform: rotate(45deg);
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          bottom: 0;
          left: 0;
          margin-left: -132px;
          margin-top: -132px;
          p{
            // position: absolute;
            font-size: 12px;
            transform: scale(0.72);
            // : 12px;
            word-break: break-all;
            margin-left: -28px;
            letter-spacing: 4px;
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
