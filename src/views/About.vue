<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button type="primary">默认按钮</Button>
    <keep-alive>
      <input type="text" v-model="text">
    </keep-alive>
  </div>
</template>
<script>
import { Button } from 'vant';
export default {
  components:{Button},
  data(){
    return{
      text:''
    }
  },

}
</script>