<template>
<div class="term_box">
    <el-dialog
        title="添加指标"
        :modal="true"
        top="15vh"
        :visible.sync="showDialog"
        width="440px">
        <div class="term_s">
            <el-form :model="termObj" ref="termObj" :rules="rules" label-width="100px" class="demo-ruleForm">
                <div class="row_form">
                    <el-form-item label="" prop="molecular">
                        <el-select placeholder="请选择分子" v-model="termObj.molecular" filterable>
                            <el-option v-for="item in selectData" :key="item.prop" :label="item.label" :value="item.prop"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="span_icon">/</div>
                    <el-form-item label="" prop="denominator">
                        <el-select placeholder="请选择分母" v-model="termObj.denominator" filterable>
                            <el-option v-for="item in selectData" :key="item.prop" :label="item.label" :value="item.prop"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="gt_icon">=</div>
                </div>
                <el-form-item label="" prop="title" class="term_name">
                    <el-input v-model="termObj.title" placeholder="请输入指标名称"></el-input>
                    <el-select v-model="termObj.unit" filterable>
                        <el-option label="百分比" value="1"></el-option>
                        <el-option label="数值" value="2"></el-option>
                    </el-select>
                </el-form-item>                
            </el-form>
        </div>
        <div style="text-align: center; margin: 10px;clear: both;">
            <el-button type="text" @click="showDialog = false">取消</el-button>
            <el-button type="primary" :loading="btnLoading" @click="handleSave('termObj')">确定</el-button>
        </div>
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
        handleSave(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.termObj.molecular == this.termObj.denominator){
                        this.$message.warning('分子和分母不能相同')
                        return false
                    }else{
                        let data = {
                            molecular: this.termObj.molecular,
                            denominator: this.termObj.denominator,
                            title: this.termObj.title,
                            from: this.$route.meta.api,
                            unit: this.termObj.unit,
                            from_title: this.$route.meta.title
                        }
                        this.btnLoading = true
                        addIndicators(data).then((res)=>{
                            if(res.code==20000){
                               this.$message.success('指标添加成功') 
                               this.showDialog = false
                               this.$emit('AddIndicaed')
                            }else{
                                this.$message.warning(res.message)
                            }
                            this.btnLoading = false
                        }).catch(()=>{
                            this.btnLoading = false
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showDiaFun(){
            this.termObj={
                unit: '1'
            }
            this.showDialog = true
            this.$nextTick(()=>{
                this.$refs.termObj.clearValidate()
            })

        },
    }

}
</script>
<style lang="scss" scoped>
.term_box{
    .term_s{
        .el-select{
            width: 100%;
        }
        .el-form-item{
           /deep/ .el-form-item__content{
               margin-left: 7px !important;
               margin-right: 7px;;
           } 
        }
    }
    .row_form{
        display: flex;
        position: relative;
        padding-bottom: 20px;
        .span_icon{
            font-size: 23px;
            line-height: 39px;
        }
        .gt_icon{
            font-size: 30px;
            position: absolute;
            transform: rotate(90deg);
            left: 50%;
            bottom: 2px;
            margin-left: -10px;
        }
        .el-form-item{
           /deep/ .el-form-item__content{
               margin-left: 7px !important;
               margin-right: 7px;;
           } 
        }
    }
    .term_name{
        /deep/ .el-form-item__content{
            display: flex;
            .el-select{
                width: 120px;
                .el-input__inner{
                    color: #409EFF;
                }
            }
        }
    }
}

    
</style>