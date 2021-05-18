<template>
    <div class="ratio_box">
        <el-dialog
            title="请选择需要对比的条件"
            top="15vh"
            :visible.sync="showRatio"
            width="820px">
            <el-row class="row_disflex">
                <!-- 分组查询 -->
                <div class="group_select">
                    <p class="form_label">选择分组:</p>
                    <el-select
                        class="mg-btm-20"
                        style="width: 100%;margin-bottom:10px;margin-top:8px;"
                        v-model="groupValue"
                        multiple
                        placeholder="汇总"
                        @change="handleGroupList">
                        <el-option
                        v-for="item in groupListData"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </div>
                <div class="group_select">
                    <p class="form_label" style="line-height:13px;white-space:nowrap;">公用条件:</p>
                    <Filterbtns ref="filter0" :isCommon="true" :filterConfig="selectData"></Filterbtns>
                </div>
            </el-row>

            <el-row class="filt_box" :gutter="30">
                <el-col class="filt1" :span="12">
                    <!-- <i class="bottom_icon el-icon-back"></i> -->
                    <Filterbtns ref="filter1" :isCommon="false" :filterConfig="selectData"></Filterbtns>
                </el-col>
                <!-- <hr style="height: 100%; height:1px;border: none;background-color: #409eff;margin-bottom: 20px;"/> -->
                <el-col :span="12">
                    <!-- <i class="bottom_icon el-icon-back"></i> -->
                    <Filterbtns ref="filter2" :isCommon="false" :filterConfig="selectData"></Filterbtns>
                </el-col>
            </el-row>
            <br>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="showRatio = false">取 消</el-button>
                <el-button type="primary" @click="ratioTable">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Filterbtns from '@/components/Filterbtns'

export default {
    props:['selectData','groupListData','tableData','tableColumn','checkedList'],
    
    data(){
        return{
            showRatio: false,
            groupValue: [],
            // checkList:[],
            // groupStr:'',
            siteList1:[],
            // selectNewData1:{},
            // selectNewData2:{},
            delectSelect:[],
            showSelect:[]
        }
    },
    components:{
        Filterbtns
    },
    created(){
        // this.selectNewData()
    },
    computed:{
        checkedTit(){
            let arr = []            
            for(let i in this.tableColumn){ 
                if(this.checkedList.indexOf(this.tableColumn[i].prop) != -1){
                    arr.push({label:this.tableColumn[i].label, prop:this.tableColumn[i].prop}) 
                }    
            }
            return arr
        },
    },
    methods:{
        // selectNewData(){
        //     console.log('this.selectData',this.selectData);
        //     let newObj = JSON.parse(JSON.stringify(this.selectData))
        //     if(JSON.stringify(newObj) != '{}'){
        //         if(newObj.hasOwnProperty('group')){
        //             newObj.group.isShow = false
        //         }
        //     }
        //     console.log('newObj8888',newObj);
        //     this.selectNewData1 = newObj
        //     this.selectNewData2 = newObj
        // },
        filterNullVal(obj){
            const newObj = {}
            for (const key in obj) {   
                if(obj[key] !== ''){
                    newObj[key] = obj[key]
                }
            }
            return newObj
        }, 
        ratioTable(){
            // if(this.groupValue.length < 1){
            //     this.$message.warning('请选择分组')
            //     return false
            // }

            let objComm = this.$refs.filter0.listQuery
            objComm.group = this.groupValue
            let obj1 = Object.assign({}, objComm)
            let obj2 = Object.assign({}, objComm)
            obj1.start_time = this.$refs.filter1.listQuery.start_time
            obj1.end_time = this.$refs.filter1.listQuery.end_time
            obj1.time_unit = this.$refs.filter1.listQuery.time_unit
            obj1.book_id = this.$refs.filter1.listQuery.book_id
            obj1.user_id = this.$refs.filter1.listQuery.user_id
            obj1.searches_user = this.$refs.filter1.listQuery.searches_user
            obj1.searches_book = this.$refs.filter1.listQuery.searches_book
            obj1.time_type = this.$refs.filter1.listQuery.time_type

            obj2.start_time = this.$refs.filter2.listQuery.start_time
            obj2.end_time = this.$refs.filter2.listQuery.end_time
            obj2.time_unit = this.$refs.filter2.listQuery.time_unit
            obj2.book_id = this.$refs.filter2.listQuery.book_id
            obj2.user_id = this.$refs.filter2.listQuery.user_id
            obj2.searches_user = this.$refs.filter2.listQuery.searches_user
            obj2.searches_book = this.$refs.filter2.listQuery.searches_book
            obj2.time_type = this.$refs.filter2.listQuery.time_type

            let obj = {
                // objComm: objComm,
                obj1 : obj1,
                api1 : this.$route.meta.api,
                obj2 : obj2,
                myGroupData: this.$refs.filter1.myGroupData || { 1: [], 2: []},
                // filth : this.checkList,
                tableTh: this.checkedTit,
                checkedList: this.checkedList,
                siteList1: this.$refs.filter1.siteList1
            }
            // let groupname = this.groupValue
            
            // obj.obj2.group = groupname
            console.log(obj);
            // return
            sessionStorage.setItem('mergeTableFilter', JSON.stringify(obj))
            this.showRatio = false

            // sessionStorage.removeItem('merge_table_filter_data')
            this.$router.push({name:'RatioTable'})
        },
        handleGroupList(val){
            console.log(val);
            // this.delectSelect = val
        },
        // mergeFun(item){
        //     console.log(item);
        //     this.$nextTick(()=>{
        //         this.$refs.filter1.listQuery = Object.assign({},item.params)
        //         this.selectNewData1 = item.filters
        //         this.groupValue = item.params.group.split(',')
        //     })
        // }
        
    }
}
</script>
<style lang="scss" scoped>
    .ratio_box{
        .filt_box{
            .row_checkout{
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
            }
            overflow: hidden;
            margin-top: -7px;
            .filt1 .filter-inputs{
                // background-color: #f3f6ff;
            }
            /deep/ .filter-inputs{
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 2px;
                padding: 10px;
                padding-bottom: 0;
                .el-select{
                    width: 140px !important;
                }
                .el-date-editor{
                    width: 274px !important;
                }
            }
            .el-col{
                position: relative;
                margin-top: 20px;
                // margin-bottom: 15px;
                .bottom_icon{
                    position: absolute;
                    top: -20px;
                    font-size: 15px;
                    left: 50%;
                    transform: rotate(-90deg);
                    font-weight: bold;
                    color: #999;
                }
                
            }
            &::after{
                content: 'VS';
                position: absolute;
                left: 50%;
                margin-left: -9px;
                top: 100px;
                top: 46%;
            }
        }
        .row_disflex{
            border: 1px solid #ddd;
            padding: 0px 14px;
            box-sizing: border-box;
            .group_select{
                display: flex;
            }
            .form_label{
                width: 74px;
                font-weight: bold;
                line-height: 28px;
                display: inline-table;
            }
            .item_list{
                margin-top: 5px;
            }
        }
    }
</style>