<template>
  <div class="dashboard-container">
    <myReport ref="myReport"></myReport>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getInfo } from '@/api/user'
import myReport from '@/views/read/my/searchList/index.vue'
// import {getInfo} from '@/store/modules/user'
export default {
  name: 'Dashboard',
  components:{myReport},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created(){
    this.$store.dispatch('user/getInfo')
  },
  beforeRouteEnter(to, from, next){
    // console.log(to, from);
    next(vm=>{
      if(from.name=='searchList'){
        console.log('vm.$refs.myReport',vm.$refs.myReport);
        vm.$refs.myReport.getReports()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
