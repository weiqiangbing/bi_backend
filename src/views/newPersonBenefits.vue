<template>
  <div class="newPersonBenefits" :style="{'background-color':'#FF5D5F'}">
    <div class="rechar_banner">
      <img src="../assets/images/gbanner.jpg">
      <div class="time_box">
        <div class="time_num">
            <p class="num">{{endTime.day}}</p>
            <p class="tip">{{$land('天')}}</p>
            <p class="num">{{endTime.hour}}</p>
            <p class="tip">{{$land('时')}}</p>
            <p class="num">{{endTime.minute}}</p>
            <p class="tip">{{$land('分')}}</p>
            <p class="num">{{endTime.second || 0}}</p>
            <p class="tip">{{$land('秒')}}</p>
        </div>
      </div>
    </div>
    <div class="gift_title">
      <div class="title_img title_img1"></div>
      <div class="title_detail">999新人专属大礼包</div>
    </div>
    <div class="gift_box1">
      <div class="gift_bg1">
        <div class="status" @click="receiveOrLook">
          <p class="btnWord">领取</p>
        </div>
        <div class="content">
          <span>999</span>
          <span>专用书券</span>
          <p>有效期至：2020.09.10-2020.10.09</p>
        </div>
      </div>
    </div>
    <div class="gift_title other_title">
      <div class="title_img title_img2"></div>
      <div class="title_detail">999新人专属大礼包</div>
    </div>
    <ul class="gift_box2">
      <li>
        <div class="book_img"></div>
        <div class="book_cont">
          <span>书券</span>
          <span class="money_icon"></span>
          <span>X 10</span>
          <p class="book_time">
            阅读时长10分钟
          </p>
        </div>
        <bgButton :btnBgUrl="smailbtnUrl" :width="94" :height="28" wordColor="#7E1001" :isWeight="true" :btnWord="$land('马上领取')" ></bgButton>
      </li>
      <li>
        <div class="book_img"></div>
        <div class="book_cont">
          <span>书券</span>
          <span class="money_icon"></span>
          <span>X 10</span>
          <p class="book_time">
            阅读时长10分钟
          </p>
        </div>
        <bgButton :btnBgUrl="smailbtnUrl" :width="94" :height="28" wordColor="#7E1001" :isWeight="true" :btnWord="$land('马上领取')" ></bgButton>
      </li>
      <li>
        <div class="book_img"></div>
        <div class="book_cont">
          <span>书券</span>
          <span class="money_icon"></span>
          <span>X 10</span>
          <p class="book_time">
            阅读时长10分钟
          </p>
        </div>
        <bgButton :btnBgUrl="smailbtnUrl" :width="94" :height="28" wordColor="#7E1001" :isWeight="true" :btnWord="$land('马上领取')" ></bgButton>
      </li>
      <li>
        <div class="book_img"></div>
        <div class="book_cont">
          <span>书券</span>
          <span class="money_icon"></span>
          <span>X 10</span>
          <p class="book_time">
            阅读时长10分钟
          </p>
        </div>
        <bgButton :btnBgUrl="smailbtnUrl" :width="94" :height="28" wordColor="#7E1001" :isWeight="true" :btnWord="$land('马上领取')" ></bgButton>
      </li>
    </ul>
    <div class="gift_title other_title">
      <div class="title_img title_img3"></div>
      <div class="title_detail">999新人专属大礼包</div>
    </div>

    <div class="gift_box3">
      <ul>
        <li class="box3_li">
          <div class="box3_top">
            <p>4200<span>书币+</span>4200<span>书券</span></p>
            <p>原件：9.99=4200书币+600书券</p>
          </div>
          <div class="box3_buttom">
            <p><span>首充</span> US$9.99</p>
            <p>100%返利</p>
          </div>
        </li>
        <li class="box3_li">
          <div class="box3_top">
            <p>4200<span>书币+</span>4200<span>书券</span></p>
            <p>原件：9.99=4200书币+600书券</p>
          </div>
          <div class="box3_buttom">
            <p><span>首充</span> US$9.99</p>
            <p>100%返利</p>
          </div>
        </li>
      </ul>
      <bgButton :btnBgUrl="bigbtnUrl" :width="195" :height="41" wordColor="#7E1001" :isWeight="true" :fontSize="15" :btnWord="$land('立即抢购')"></bgButton>
    </div>

    <div class="gift_title other_title gift_title4">
      <div class="title_img title_img4"></div>
      <div class="title_detail">999新人专属大礼包</div>
    </div>
    <div class="gift_box4">
      <ul class="box4_ul">
        <li>
          <p class="pint"></p>
          <div class="box4_left">
            <div class="left_title">
              <span class="title_name">首次登录</span>
              <span class="money_bg"></span>
              <span class="title_num">x15</span>
            </div>
            <div class="left_detail">
              描述描述描述描述描述描述描述描述描述描述
            </div>
          </div>
          <div class="box4_right">
            <bgButton :btnBgUrl="minbtnUrl" :width="62" :height="24" wordColor="#7E1001" :isWeight="true" :btnWord="$land('去领取')" ></bgButton>
          </div>
        </li>
        <li>
          <p class="pint"></p>
          <div class="box4_left">
            <div class="left_title">
              <span class="title_name">首次登录</span>
              <span class="money_bg"></span>
              <span class="title_num">x15</span>
            </div>
            <div class="left_detail">
              描述描述描述描述描述描述描述描述描述描述
            </div>
          </div>
          <div class="box4_right">
            <bgButton :btnBgUrl="minbtnUrl" :width="62" :height="24" wordColor="#7E1001" :isWeight="true" :btnWord="$land('去领取')" ></bgButton>
          </div>
        </li>
        <li>
          <p class="pint"></p>
          <div class="box4_left">
            <div class="left_title">
              <span class="title_name">首次登录</span>
              <span class="money_bg"></span>
              <span class="title_num">x15</span>
            </div>
            <div class="left_detail">
              描述描述描述描述描述描述描述描述描述描述
            </div>
          </div>
          <div class="box4_right">
            <bgButton :btnBgUrl="minbtnUrl" :width="62" :height="24" wordColor="#7E1001" :isWeight="true" :btnWord="$land('去领取')" ></bgButton>
          </div>
        </li>
        <li>
          <p class="pint"></p>
          <div class="box4_left">
            <div class="left_title">
              <span class="title_name">首次登录</span>
              <span class="money_bg"></span>
              <span class="title_num">x15</span>
            </div>
            <div class="left_detail">
              描述描述描述描述描述描述描述描述描述描述
            </div>
          </div>
          <div class="box4_right">
            <bgButton :btnBgUrl="minbtnUrl" :width="62" :height="24" wordColor="#7E1001" :isWeight="true" :btnWord="$land('去领取')" ></bgButton>
          </div>
        </li>
        <li>
          <p class="pint"></p>
          <div class="box4_left">
            <div class="left_title">
              <span class="title_name">首次登录</span>
              <span class="money_bg"></span>
              <span class="title_num">x15</span>
            </div>
            <div class="left_detail">
              描述描述描述描述描述描述描述描述描述描述
            </div>
          </div>
          <div class="box4_right">
            <bgButton :btnBgUrl="minbtnUrl" :width="62" :height="24" wordColor="#7E1001" :isWeight="true" :btnWord="$land('去领取')" ></bgButton>
          </div>
        </li>
      </ul>
    </div>

    <div class="rechar_footer">
        <div class="footer_title">
          <b>{{$land('活动规则')}}</b>
        </div>
        <div class="footer_content" v-html="$land(eventRule)">
          
        </div>
    </div>
    <giftPopup ref="giftPop"></giftPopup>

  </div>
</template>

<script>
import {tokenCheck } from '../lib/token'
import bgButton from '../components/bgButton'
import activePopup from '../components/activePopup'
import comm from '../lib/utils/comm'
import giftPopup from '../components/giftPopup'

export default {
  name: 'newPersonBenefits',
  components: { 
    activePopup,
    bgButton,
    giftPopup
  },
  data(){
    return {
      smailbtnUrl: require('../assets/images/gbtnbg.png'),
      minbtnUrl: require('../assets/images/gsmilbtn.png'),
      bigbtnUrl: require('../assets/images/gbigbtnbg.png'),
      surplusTime: 1585965515133,
      eventRule:`1、本活动只在页面展示的活动时间内生效，请及时关注。<br>
          2、充值成功后，相应的魔币和魔豆将立即到账，请在个人中心查看。<br>
          3、魔豆有效期为30天，到期自动失效，请在有效期内尽快使用。<br>
          4、充值成功后，所赠打折卡将自动开启，打折卡有效时间内订阅全站作品可享受8折优惠。<br>
          5、打折卡8折特权只在订阅时有效，针对其他形式的消费一律无效。<br>
          6、如多次购买，系统将自动顺延所赠的打折卡时间。`
    }
  },
  created(){
    // this.$loading.show()
  },
  mounted(){
    this.getInitData()
    setInterval(() => {
      this.surplusTime -= 1
    }, 1000);
  },
  computed:{
    endTime(){
      return comm.getDayAndTime(this.surplusTime)
    }
    

  },
  methods:{
    getInitData(){
      let _this = this
      // tokenCheck().then((data)=>{
      //   this.$axios.get('/v1/event.recharge_activity?event_id='+params.event_id).then((res)=>{
          
      //   })
      // })
    },
    receiveOrLook(){

      this.$refs.giftPop.isShowPopup(true, [])
    }

  }
}
</script>
<style lang="less" scoped>
  .newPersonBenefits{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .rechar_banner{
      width: 100%;
      height: 236px;
      img{
        width: 100%;
        height: 100%;
      }
      .time_box{
        text-align: center;
        position: relative;
        top: -122px;
        .time_num{
          display: flex;
          justify-content: center;
          .num{
            width: 20px;
            height: 18px;
            border-radius: 2px;
            line-height: 18px;
            text-align: center;
            font-weight: bold;
          }
          .tip{
            margin: 2px 4px;
          }
        }
      }

    }
    .gift_title{
      width: 174px;
      height: 45px;
      margin: 0 auto;
      margin-top: -48px;
      .title_img{
        width: 174px;
        height: 26px;
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .title_img1{
        position: relative;
      }
      .title_detail{
        font-size: 12px;
        text-align: center;
        margin-top: 6px;
      }
    }
    .other_title{
      margin-top: 36px;
    }
    .gift_box1{
      width: 350px;
      height: 132px;
      margin: 10px auto;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      .gift_bg1{
        position: relative;
        width: 328px;
        height: 112px;
        background-size: 100% 100%;
        margin-bottom: -5px;
        .status{
          position: absolute;
          right: 4px;
          top: 20px;
          width: 76px;
          height: 76px;
          background-size: 100% 100%;
        }
        .btnWord{
          font-size: 21px;
          position: absolute;
          width: 20px;
          top: 8px;
          left: 26px;
          font-weight: 600;
          line-height: 24px;
        }
        .content{
          position: absolute;
          left: 0;
          top: 0;
          padding: 24px 30px;
          
          span:nth-child(1){
            font-size: 35px;
            font-weight: bold;
          }
          span:nth-child(2){
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
          }
          p{
            font-size: 12px;
            width: auto;
          }
        }
      }
      
    }
    .gift_box2{
      width: 350px;
      margin: 10px auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li{
        width: 164px;
        height: 129px;
        border-radius: 5px;
        margin-top: 30px;
        position: relative;
        .book_img{
          width: 70px;
          height: 60px;
          top: -25px;
          position: absolute;
          left: 50%;
          margin-left: -35px;
          background-size: 100% 100%;
        }
        .book_cont{
          text-align: center;
          padding-top: 34px;
          box-sizing: border-box;
          .money_icon{
            width: 17px;
            height: 17px;
            background-size: 100% 100%;
            display: inline-block;
            margin: 0 3px;
            position: relative;
            top: 2px;
          }
          span{
            font-size: 14px;
            font-weight: bold;
          }
          .book_time{
            margin: 8px;
          }
        }
      }
    }
    .gift_box3{
      width: 350px;
      margin: 10px auto;
      border-radius: 5px;
      padding: 10px;
      box-sizing: border-box;
      ul{
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        li{
          width: 162px;
          height: 116px;
          position: relative;
          background-size: 100% 100%;
          .box3_top{
            text-align: center;
            position: absolute;
            top: 0;
            padding-top: 20px;
            box-sizing: border-box;
            width: 100%;
            p:nth-child(1){
              font-size: 16px;
              font-weight: bold;
              font-style: italic;
              white-space: nowrap;
              span{
                font-size: 12px;
              }
            }
            p:nth-child(2){
              font-size: 12px;
              white-space: nowrap;
              text-decoration: line-through;
              transform: scale(0.74);
            }
          }
          .box3_buttom{
            position: absolute;
            transform: translate(-50%);
            top: 72px;
            font-style: italic;
            left: 50%;
            p:nth-child(1){
              span{
                font-size: 14px;
              }
              white-space: nowrap;
              font-size: 16px;
              
            }
            p:nth-child(2){
              text-align: center;
            }
          }
        }
      }
    }
    .gift_box4{
      width: 350px;
      margin: 0 auto;
      border-radius: 5px;
      .box4_ul{
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        margin-top: 10px;
        li{
          // height: 60px;
          width: 100%;
          display: flex;
          border-bottom: 1px solid #DCD5D5;
          padding-bottom: 12px;
          position: relative;
          .pint{
            position: absolute;
            left: -10px;
            top: 14px;
            width: 4px;
            height: 13px;
            background-color: #FFCC44;
          }
          .box4_left{
            width: 240px;
            .left_title{
              margin-top: 10px;
              span{
                font-size: 16px;
                font-weight: bold;
              }
              .money_bg{
                width: 14px;
                height: 14px;
                display: inline-block;
                margin-left: 15px;
                position: relative;
                top: 2px;
                background-size: 100%;
                margin-right: 4px;
              }
            }
            .left_detail{
              font-size: 12px;
              margin-top: 6px;
            }
          }
          .box4_right{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        li:nth-last-child(1){
          border-bottom: none; 
        }
      }
    }
    .rechar_footer{
        width: 329px;
        margin: 0 auto;
        margin-bottom: 22px;
        .footer_title{
          font-size:14px;
          font-weight:600;
          margin: 26px auto 8px;
          b{
            font-size: 14px;
            // padding: 0 9px;
          }
        }
        .footer_content{
          font-size: 12px;
          font-weight:400;
          line-height:17px;
        }
      }
  }
  
</style>
