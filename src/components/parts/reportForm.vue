<template>
  <div class="report_s">
    <el-form ref="form" size="mini" :model="formData" label-width="80px">
        <el-form-item label="报表名称">
            <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="刷新时间" class="re_time">
            <el-input-number :min="1" controls-position="right" v-model="formData.refresh_time"></el-input-number>
            <span class="min_span">
              分钟
            </span>
        </el-form-item>
        <el-form-item label="类型" v-if="!isHome">
            <el-radio-group v-model="formData.report_type">
            <el-radio :label="1">私有</el-radio>
            <el-radio :label="2">公用</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  props: {
    
  },
  components: {
    
  },
  data(){
    return{
      formData:{
          refresh_time:5,
          report_type: 1
      }
    }
  },
  computed:{
    isHome(){
			return this.$route.name == 'Dashboard'
		}
  },
  mounted() {
    
  },
  methods: {
    
  },
}
</script>
<style scoped lang="scss">
    .report_s{
        padding-top: 15px;
        /deep/ .el-input-number--mini{
            width: 100%;
            .el-input__inner{
                text-align: left;
            }
        }
        .re_time{
          /deep/ .el-form-item__content{
            display: flex;
          }
          .min_span{
            width: 50px;
            padding-left: 8px;
          }
        }
    }
</style>



