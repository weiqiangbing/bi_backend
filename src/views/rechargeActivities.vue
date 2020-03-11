<template>
  <div class="rechargeActivities">
    <div class="rechar_banner">

    </div>
    <div class="rechar_box">
      <!-- <button @click="getInitData">ddddd</button> -->
      <div class="rechar_item">
        <div class="rechar_title">
          <div class="title_word">充值的项目</div>
          <div class="rechar_btn">充值</div>
        </div>
        <ul class="rechar_content">
          <li>礼品</li>
          <li>礼品</li>
          <li>礼品</li>
          <li>礼品</li>
        </ul>
      </div>
    
    </div>
  </div>
</template>

<script>
import {tokenCheck} from '../lib/token'
export default {
  name: 'rechargeActivities',
  components: { 
    
  },
  created(){

  },
  methods:{
    getInitData(){
      tokenCheck().then((data)=>{
        console.log('data', data);
        
      })
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
      height: 229px;
      background-color: #ff874b;
    }
    // background-color: @warningColor; 
    .rechar_box{
      width: 100%;
      padding: 20px 30px;
      box-sizing: border-box;
      background-color: @bgColor;

      .rechar_item{
        border: 1px solid #ccc;
        width: 329px;
        height: 138px;
        padding-top: 20px;
        margin-top: 40px;

        .rechar_title{
          padding: 0 7px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;
          padding-bottom: 10px;
          
          .title_word{
            font-size: 30px;
            font-weight: bold;
            float: left;
          }
          .rechar_btn{
            padding: 3px;
            border: 1px solid #ccc;
            border-radius: 10px;
            float: right;
            font-size: 16px;
          }
        }
        .rechar_content{
          display: flex;
          // width: 42px;
          height: 80px;
          justify-content: space-around;
          li{
            background-color: rosybrown;
            width: 50px;
            height: 80px;
            font-size: 16px;
          }
        }
      }
    }
  }
  
</style>
