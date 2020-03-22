<template>
  <div v-if="show" class="lds-spinner">
    <div class="spinner ball-spin-fade-loader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <!-- <div class="double-bounce2"></div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    show: Boolean
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.lds-spinner{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.29);
}
.spinner {
  width: 20px;
  height: 20px;
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%) scale(.56);
  -webkit-transform: translate(-50%) scale(.56);
}
 
</style>