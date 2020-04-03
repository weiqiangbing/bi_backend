<template>
  <div class="login">
    <h1>开发模拟登陆页</h1>
    <Button type="primary" block @click="login">登陆</Button>
    
  </div>
</template>
<script>
import { Button } from 'vant';
import storage from '../lib/utils/localstorage'
export default {
  name:'login',
  components:{Button},
  data(){
    return{
      text:''
    }
  },
  methods:{
      login(){
        let data = {
            mobile: '18333063001',
            password: '123456'
        }
        this.$axios.post('/v1/user.login', data).then((res)=>{
            console.log(res);
            let devLoginInfo = {
                'token': res.data.token,
                'Device-Uuid': '6f03a8dff7d9f54a7d05f0a420fe8bbfe8f19448',
                'id': res.data.user.user_id
                // 'X-Device-Time': new Date().getTime(),
                // 'User-Agent': 'ylsyapp/ios iPhone Mobile',
                // 'X-App-Channel': 'apple',
                // 'X-APP-FC':	1,
            }
            storage.set('devLoginInfo', devLoginInfo)
            this.$router.go(-1)
        })
      }
  }

}
</script>
<style lang="less" scoped>
    .login{
        padding: 30px;
        box-sizing: border-box;
        text-align: center;
        h1{
            font-size: 30px;
            margin-bottom: 30px;
            margin-top: 100px;
        }
    }
</style>