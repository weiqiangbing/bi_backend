<template>
  <div v-if="show" class="lds-spinner">
    <div class="spinner">
      <div class="double-bounce1"></div>
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
  width: 28px;
  height: 28px;
  position:absolute;
  top:50%;
  left:50%;
  margin: -14px;
  transform: translate(-50%);
  background: url('../assets/images/loading.png');
  background-size: 100% 100%;
  -webkit-animation: bounce 0.5s infinite linear;
  animation: bounce 0.5s infinite linear;
//   transition-timing-function: linear;
//   transition: all ;
  .double-bounce1 {
    // width: 25px;
    // height: 25px;
    // border-radius: 50%;
    // // background-color: #FF000F;
    // background: url('../assets/images/loading.png');
    // opacity: 0.6;
    // position: absolute;
    // top: 0;
    // left: 0;
    // -webkit-animation: bounce 2.0s infinite ease-in-out;
    // animation: bounce 2.0s infinite ease-in-out;
  }
//   .double-bounce2 {
//     -webkit-animation-delay: -1.0s;
//     animation-delay: -1.0s;
//   }
}
 
// @-webkit-keyframes bounce {
//   0%, 100% { -webkit-transform: scale(0.0) }
//   50% { -webkit-transform: scale(1.0) }
// }
 
@keyframes bounce {
  0% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  } 100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
</style>