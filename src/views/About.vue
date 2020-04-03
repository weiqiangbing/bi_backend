<template>
  <div class="about">
    <h1>今天天气很好哈哈哈，可以好好玩耍，桥上</h1>
    <Button type="primary" @click="testChines">默认按钮</Button>
    
  </div>
</template>
<script>
import { Button } from 'vant';
import chooseZh from '../assets/js/chiness'
export default {
  components:{Button},
  data(){
    return{
      text:''
    }
  },
  methods:{
    testChines(){
      console.log(this.$land('韦强兵'))
    }
  }

}
</script>