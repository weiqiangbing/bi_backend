<template>
  <div class="gift_popup">
    <!-- <transition name="bounce"> -->
      <Popup v-model="popupShow" :close-on-click-overlay="shadwClose" :overlay-style="{backgroundColor:'rgba(0, 0, 0, 0.8)'}">
        <div class="pop_box">
          <div class="pop_content">
            <div class="pop_header"></div>
            <ul class="pop_list">
              <li>
                <div class="pop_left"></div>
                <div class="pop_right">
                  <div class="book_name">书名书名书名书名书名</div>
                  <div class="book_money">已获赠本书 333 专用书券</div>
                  <div class="book_cont">我是推荐语我是推荐语我是推荐 推荐语我是推荐语我是推荐</div>
                </div>
              </li>
              <li>
                <div class="pop_left"></div>
                <div class="pop_right">
                  <div class="book_name">书名书名书名书名书名</div>
                  <div class="book_money">已获赠本书 333 专用书券</div>
                  <div class="book_cont">我是推荐语我是推荐语我是推荐 推荐语我是推荐语我是推荐</div>
                </div>
              </li>
              <li>
                <div class="pop_left"></div>
                <div class="pop_right">
                  <div class="book_name">书名书名书名书名书名</div>
                  <div class="book_money">已获赠本书 333 专用书券</div>
                  <div class="book_cont">我是推荐语我是推荐语我是推荐 推荐语我是推荐语我是推荐</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="close_btn" @click="onClose"></div>
        </div>
      </Popup>
    <!-- </transition> -->
  </div>
</template>

<script>
import {Popup} from 'vant'
export default {
  props:{
    shadwClose:{
      type: Boolean,
      default: true
    }
  },
  name: 'giftPopup',
  components:{Popup},
  mounted(){
    
  },
  data(){
    return {
      popupShow: false,
      popContent:'',
    }
  },
  computed:{
    
  },
  methods:{
    onClose(){
      this.popupShow = false
      
    },
    isShowPopup(isTrue, content){
      console.log(isTrue, content);
      if(isTrue){
        this.popupShow = true
        this.popContent = content
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
    position: relative;
    .pop_content{
      .pop_header{
        width: 94px;
        height: 30px;
        background-size: 100%;
        margin: 0 auto;
      }
      text-align: center;
      width: 310px;
      border-radius: 8px;
      margin: 0 auto;
      background-size: 100%;
      padding: 20px 30px;
      box-sizing: border-box;
      .pop_list{
        font-weight:500;
        line-height:22px;
        font-size:16px;
        margin-top: 4px;
        max-height: 300px;
        overflow-y: auto;
        li{
          display: flex;
          margin-top: 15px;
          .pop_left{
            width: 68px;
            height: 90px;
            background-color: #ddd;
          }
          .pop_right{
            flex: 1;
            text-align: left;
            padding-left: 10px;
            .book_name{
              font-size: 15px;
              color: #6F563E;
            }
            .book_money{
              font-size: 13px;
              color: #DC8120;
            }
            .book_cont{
              font-size: 11px;
              color: #6F563E;
            }
          }
        }
      }
   
   
    }
    .close_btn{
      width: 40px;
      height: 40px;
      background-size: 100%;
      margin: 18px auto 10px;
    }
  }

</style>
