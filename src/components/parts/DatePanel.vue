<template>
  <div class="date-panel">
    <date-panel ref="datePanel" @pick="pick"></date-panel>
    
    <!-- <el-date-picker
      v-model="timeArea"
      @change="pick"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker> -->
  </div>
</template>
<script>
import DatePanel from "element-ui/packages/date-picker/src/panel/date-range.vue"

export default {
  props: {
    showTime: {
      default: false,
      type: Boolean
    }
  },
  components: {
     DatePanel,
  },
  model: {
    prop: 'date',
    event: 'change'
  },
  data(){
    return{
      timeArea:[]
    }
  },
  mounted() {
    
  },
  methods: {
    pick(date) {
      // this.$refs.datePanel.value = date;
      // this.$refs.datePanel.resetView && this.$refs.datePanel.resetView();
      this.$emit("change", date);

    },
    postToTime(times){
      this.timeArea = times
      this.$refs.datePanel.value = this.timeArea;
      this.$refs.datePanel.showTime = this.showTime;
      this.$refs.datePanel.visible = true;
    }
  },
}
</script>
<style scoped>
  .date-panel >>> .el-picker-panel__footer{ display: none!important; }
  .date-panel >>> .el-picker-panel{box-shadow:none;border:0}
</style>



