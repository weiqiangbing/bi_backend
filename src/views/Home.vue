<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/images/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div class="wl" style="height:40px;border:1px solid blue;color:blue">hello jenkins</div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
<style lang="less" scoped>
  .home{
    width: 750px; 
    height: 200px;
    background-color: @warningColor; 
  }
</style>
