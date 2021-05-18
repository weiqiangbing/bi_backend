<template>
<div class="config_dialog">
    <el-dialog
        title="添加指标"
        :modal="true"
        top="15vh"
        :visible.sync="showDialog"
        width="940px">
        <div class="config_table">
            <el-table
                height="500px"
                v-loading="loading"
                :data="tableData">
                    <el-table-column prop="item.prop" label="字段名" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="item.prop" label="表头名" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="item.prop" label="提示文案" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="item.prop" label="是否可排序" :show-overflow-tooltip="true" align="center"></el-table-column>
                    <el-table-column prop="item.prop" label="宽度" :show-overflow-tooltip="true" align="center"></el-table-column>
            </el-table>
        </div>
        <!-- <div style="text-align: center; margin: 10px;clear: both;">
            <el-button type="text" @click="showDialog = false">取消</el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSave('termObj')">确定</el-button>
        </div> -->
    </el-dialog>
</div>
    
</template>  
<script>
import {addIndicators} from '@/api/public/index'
export default {
    props:{
        markDatas:{
            type: Array,
            default: []
        },
        
    },
    data(){
        return{
            showDialog: false,
            btnLoading: false,
            termObj: {
                
            },  
            rules: {
                molecular: [
                    { required: true, message: '请选择分子', trigger: 'change' }
                ],
                denominator: [
                    { required: true, message: '请选择分母', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '请输入指标名称', trigger: 'change' }
                ],
            }          
        }
    },
    created(){
        console.log('markDatas',this.markDatas);
    },
    computed:{
        selectData(){
            let arr = []
            arr = this.markDatas.filter((er)=>{
                return er.isNum
            })
            return arr
        }
    },
    mounted(){
       
    },
    methods:{
        // handleSave(formName){
        //     this.$refs[formName].validate((valid) => {
        //         if (valid) {
        //             if(this.termObj.molecular == this.termObj.denominator){
        //                 this.$message.warning('分子和分母不能相同')
        //                 return false
        //             }else{
        //                 let data = {
        //                     molecular: this.termObj.molecular,
        //                     denominator: this.termObj.denominator,
        //                     title: this.termObj.title,
        //                     from: this.$route.meta.api,
        //                     unit: this.termObj.unit,
        //                     from_title: this.$route.meta.title
        //                 }
        //                 this.btnLoading = true
        //                 addIndicators(data).then((res)=>{
        //                     if(res.code==20000){
        //                        this.$message.success('指标添加成功') 
        //                        this.showDialog = false
        //                        this.$emit('AddIndicaed')
        //                     }else{
        //                         this.$message.warning(res.message)
        //                     }
        //                     this.btnLoading = false
        //                 }).catch(()=>{
        //                     this.btnLoading = false
        //                 })
        //             }
        //         } else {
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // },
        showDiaFun(){
            this.showDialog = true
          

        },
    }

}
</script>
<style lang="scss" scoped>
.config_dialog{
    .config_table{
        
        
    }

}

    
</style>