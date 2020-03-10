<template>
  <div class="rechargeActivities">
    <img alt="Vue logo" src="../assets/images/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div style="color:red">123</div>
    <div style="color:red">456</div>
    <div style="color:red">789</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'rechargeActivities',
  components: { 
    HelloWorld
  }
}
</script>
<style lang="less" scoped>
  .rechargeActivities{
    width: 100%;
    height: 100%;
    background-color: @warningColor; 
  }
</style>
