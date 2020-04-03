<template>
  <div class="test" >
    <Button type="primary" block @click="btnClick(1)">{{$land('获取用户信息')}}</Button>
    <Button type="primary" block @click="btnClick(2)">{{$land('获取app信息')}}</Button>
    <Button type="primary" block @click="btnClick(3)">{{$land('跳到登陆页')}}</Button>
    <Button type="primary" block @click="btnClick(4)">{{$land('跳到首页')}}</Button>
    <!-- <Button type="primary" block @click="btnClick(5)">打开默认应用市场</Button> -->
    <Button type="primary" block @click="btnClick(6)">{{$land('跳到支付')}}</Button>
    <Button type="primary" block @click="btnClick(7)">{{$land('调用后端接口')}}</Button>
    
    <Field v-model="value1" placeholder="APP内支付进行付款"></Field>
    <Button type="primary" block @click="btnClick(8)">{{$land('APP内支付进行付款')}}</Button>
    <input v-model="value2" id="aaa" placeholder="打开指定的Uri页面">
    <Button type="primary" block @click="btnClick(9)">{{$land('打开指定的Uri页面')}}</Button>
    <Field v-model="value3" placeholder="校验Uri是否被APP支持"></Field>
    <Button type="primary" block @click="btnClick(10)">{{$land('校验Uri是否被APP支持')}}</Button>
  </div>
</template>

<script>
import {Button, Field} from 'vant'

export default {
  name: 'test',
  components: { 
    Button,
    Field
  },
  data(){
    return {
      btnBgUrl: require('../assets/images/btnbg.png'),
      value1:'cqsc.coins.10',
      value2:'hrxsapp://navigator/novel/book/13193',
      value3:'hrxsapp://navigator/novel/book/13193',
      screenHeightNoChange:true
    }
  },
  created(){
    
  },
  mounted(){
    // const self = this;
    // window.onresize = () => {
    //   console.log('调起了键盘');
      
    // };
  },
  methods:{
    getInitData(){
      let _this = this
      this.$loading.show()
        this.$axios.get('/v1/event.recharge_activity?event_id=141&channel_code=apple&currency=USD').then((res)=>{
            _this.$loading.hide()
            alert(JSON.stringify(res.data))
        })
    },
    
    btnClick(index){
      if(index==1){
        // console.log(this.btnBgUrl);
        let info = window.InteractorProxy.getUserInfo()
        console.log('getUserInfo',window.InteractorProxy.getUserInfo());
        alert(JSON.stringify(info))
      }else if(index==2){
        let appinfo = window.InteractorProxy.app
        console.log('appinfo', appinfo);
        alert(JSON.stringify(appinfo))
      }else if(index==3){
        window.InteractorProxy.login()
      }else if(index==4){
        window.InteractorProxy.open("open.page.HOME")
      }
      // else if(index==5){
      //   window.InteractorProxy.openAppMarket()
      // }
      else if(index==6){
        window.InteractorProxy.open("open.page.PAY")
      }else if(index==7){
          // console.log('fdfd');
        this.getInitData()
      }else if(index==8){
        console.log(this.value1);
        window.InteractorProxy.purchase(this.value1)
      }else if(index==9){
        console.log(this.value2);
        window.InteractorProxy.openUri(this.value2)
      }else if(index==10){
        console.log(this.value3);
        var isSupport = InteractorProxy.isUriValid(this.value3)
        alert(isSupport)
      }
    },
    // custInput1(){
    //   // var inputTextBox = document.getElementById('aaa');
    //   // setInterval(function(){
    //   //   inputTextBox.scrollIntoView(true);
    //   // },200)
    // },
    // custInput2(){
    //   // console.log('fouce');
    //   // setTimeout(function(){
    //   //   document.body.scrollTop = document.body.scrollHeight;
    //   // },300)
      
    // }
    

  }
}
</script>
<style lang="less" scoped>
  .test{
      padding: 30px 20px;
      box-sizing: border-box;
      height: 100%;
    //   background-color: #FFA18A;
      // overflow-y: auto;
      button{
          margin-bottom: 22px;
      }
      #aaa{
        width: 100%;
        height: 40px;
      }
  }
  
</style>
