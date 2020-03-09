<template>
  <div class="err_page">
    <h1>页面走丢啦!!!</h1>
  </div>
</template>

<script>
export default {
  name: 'errPage',
  mounted(){
    
  }

}
</script>

<style lang="less" scoped>
.err_page{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  h1{
    color: rgb(119, 119, 119);
    font-size: @bigFontSize;
    // text-align: center;
  }
}
</style>
