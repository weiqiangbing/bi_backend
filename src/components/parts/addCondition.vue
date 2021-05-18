<template>
<div class="term_box">
    <el-dialog
        title="选择过滤条件"
        :modal="true"
        top="15vh"
        :visible.sync="showDialog"
        width="640px">
        <div class="term_s">
            <el-form :model="termObj" ref="termObj" label-width="100px" class="demo-ruleForm">
                <el-form-item label="选择过滤项" prop="name">
                    <el-select v-model="termValue" value-key="prop" @change="changeTerm" clearable>
                        <el-option
                            v-for="item in termDataArr"
                            :key="item.prop"
                            :label="item.label"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <ul class="term_item">
                    <li class="term_li" v-for="(item,index) in termObj.termForms" :key="index">
                        <div class="labe_name">{{item.name}}</div>
                        <el-form-item label="" :prop="item.type">
                            <el-select v-model="item.type" @change="changeType(item)" filterable>
                                <el-option v-for="item in markData" :key="item.prop" :label="item.name" :value="item.prop"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" :prop="item.num">
                            <el-input v-model="item.num"></el-input>
                        </el-form-item>
                         <!-- :rules="{required: true, message: '该项不能为空', trigger: 'change'}" -->
                         <div v-if="item.type=='between'" class="label_bet">-</div>
                        <el-form-item v-if="item.type=='between'" label="" :prop="item.num2">
                            <el-input v-model="item.num2"></el-input>
                        </el-form-item>
                        <el-button @click="delectTerm(item,index)" style="margin: 5px 0px 0px 10px;height:30px;" size="mini" icon="el-icon-minus" circle></el-button>
                    </li>
                </ul>
            </el-form>
        </div>
        <div style="text-align: center; margin: 10px;clear: both;">
            <el-button type="text" @click="showDialog = false">取消</el-button>
            <el-button type="primary" @click="handleSave('termObj')">确定</el-button>
        </div>
    </el-dialog>
</div>
    
</template>  
<script>

export default {
    props:{
        termDatas:{
            type: Array,
            default: []
        },
        
    },
    data(){
        return{
            showDialog: false,
            termObj: {
                termForms:[]
            },
            // isEdit: false,
            termValue:{},
            termNewData:[],
            termDataArr:[],
            markData:[
                {label:'大于', name:'>', prop:'gt'},
                {label:'小于', name:'<', prop:'lt'},
                {label:'等于', name:'=', prop:'eq'},
                {label:'大于等于', name:'>=', prop:'egt'},
                {label:'小于等于', name:'<=', prop:'elt'},
                {label:'区间', name:'区间', prop:'between'},
            ],
            
        }
    },
    created(){
        this.termDataArr = this.termDatas
    },
    mounted(){
       
    },
    methods:{
        changeTerm(val){
            // console.log(val);
            // console.log('this.termObj.termForms',this.termObj);
            // let arrs = this.termObj.termForms
            // this.termNewData = []
            this.termObj.termForms.push({
                name: val.label,
                prop: val.prop,
                type: 'gt',
                num: '0',
            })
            this.termDataArr = this.termDataArr.filter((re)=>{
                return re.prop != val.prop
            })
            this.termValue = ''
        },
        delectTerm(item,index){
            console.log('item,index',item,index);
            this.termObj.termForms.splice(index,1)
            this.termDataArr.push({
                label: item.name,
                prop: item.prop
            })
        },
        handleSave(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let dataArr = this.termObj.termForms
                    // console.log('dataArr6777',dataArr);
                    if(dataArr && dataArr.length>0){
                        this.$emit('addTremData', dataArr)
                    }else{
                        this.$message.warning('请添加过滤项')
                        return false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showDiaFun(arr){
            // console.log(arr);
            this.termObj = {
                termForms:[]
            }
            let treSelect = []
            if(arr.length > 0){
                this.termObj.termForms = JSON.parse(JSON.stringify(arr))
                arr.forEach(r=>{
                    treSelect.push(r.prop)
                })
                this.termDataArr = this.termDatas.filter(re=>{
                    return treSelect.indexOf(re.prop) == -1
                })
            }else{
                this.termDataArr = this.termDatas
            }
            
            this.showDialog = true
            if(this.$refs.termObj){
                this.$refs.termObj.resetFields()
            }
        },
        // editTrem(item){
        //     // this.isEdit = true
        //     this.showDialog = true
        //     this.termObj = item
        // },
        changeType(item){
            console.log(item);
            if(item.type=="between"){
                // item.num2 = '0'
                this.$set(item, 'num2',0)
            }
        }
    }

}
</script>
<style lang="scss" scoped>
.term_box{
    .term_s{
        .el-select{
            width: 100%;
        }
        .term_item{
            .term_li{
                // display: flex;
                width: 100%;
                clear: both;
                list-style-type: none;
                /deep/ .el-form-item__content{
                    margin-left: 10px !important;
                }
                .labe_name{
                    white-space: nowrap;
                    line-height: 42px;
                    width: 120px;
                    float: left;
                    text-align: right;
                    // font-weight: bold;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .el-form-item{
                    width: 110px;
                    float: left;
                }
                .label_bet{
                    width: 16px;
                    float: left;
                    line-height: 40px;
                    margin-left: 7px;
                    margin-right: -15px;
                }
                
            }
        }
    }
 
}

    
</style>