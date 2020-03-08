<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/images/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    1234
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
