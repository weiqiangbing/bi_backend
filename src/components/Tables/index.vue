<template>
  <!-- 主题内容 -->
  <div class="box-size init_scroll" :style="{width: width, height: height,}"> 
    <!-- <div class="table-title">{{item.name}}</div> -->
    <el-table
      height="300px"
      v-loading="loading"
      :data="tableData">
      <template v-for="item in tableColumn">
        <el-table-column
          v-bind:key="item.prop"          
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          :formatter="formatTdValue"
          v-if="checkedData.indexOf(item.prop) != -1 && show_fileds.indexOf(item.prop) != -1"
          align="center">
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
  
  <script>
  import { tableColumns } from '@/utils/tableColumns'
  import {commonGet} from '@/api/public/index'
  import {getSpecialName} from '@/utils/assist'
  import { filterObjToArr } from '@/utils/common'
  
  export default {
    name: 'Table',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      },
      item: Object,
      checkedList: Array
    },
    data() {
      return {  
          loading: false,
          tableData: [],
          checkedData: [],
          tableColumn: [...tableColumns], // table头部名称的配置（所有项）
          show_fileds:[],
          mainTable:0,
          terval: null,
          totalInfos:''
      }
    },
    beforeDestroy(){
      clearInterval(this.terval)
    },
    created() {
      // this.tableData = this.item.data
      this.getInitData()
      this.terval = setInterval(() => {
        this.getInitData()
      }, this.item.refresh_time * 1000 * 60);

    },
    methods: {
      formatTdValue(row,col,val){
        return getSpecialName(col.property, val)
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        if(this.totalInfos){
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总汇';
              return;
            }
            for(let i in this.totalInfos){
              if(column.property==i){
                sums[index] = this.totalInfos[i]
              }
            }
          });
        }
        return sums;
      },
      getInitData(){
        let _this = this
        this.checkedData = this.item.checkedList
        let apis = this.item.apis
        this.loading = true
        if(this.item.from == "MergeTable"){
          apis.forEach((api, index) => {
            if (this.mainTable == index){
              // 主表
              let search1 = _this.item.listQuery;
              let search2 = _this.item.listQuery;
              search1.page = 0;
              commonGet(api, search1).then((res1) => {
                let resData1 = res1.data.collection;
                _this.total_nums = res1.data.total_nums
                _this.show_fileds = res1.data.show_fields;
                if (resData1.length > 0) {
                  let groupArr = _this.item.listQuery.group;
                  resData1.forEach((r) => {
                    r.tableIndex = index;
                  });
                  // console.log('resData1',resData1);
                  // 添加数组查询条件
                  groupArr.forEach((e) => {
                    let obj2 = {};
                    obj2[e] = [];
                    resData1.forEach((r) => {
                      if (obj2[e].indexOf(r[e]) == -1) {
                        obj2[e].push(r[e]);
                      }
                    });
                    obj2[e] = obj2[e].join(",");
                    search2 = Object.assign(search2, obj2);
                  });
                  // console.log("search2", search2);
                  // 辅表
                  search2.count = 0;
                  search2.page = 0;
                  delete search2.order
                  for (let i in search2) {
                    if(search2[i] && i.indexOf('having_') != -1){
                      delete search2[i]
                    }
                  }
                  apis.forEach((api, index) => {
                    if (_this.mainTable != index) {
                      commonGet(api, search2).then(
                        (res2) => {
                          _this.show_fileds = _this.show_fileds.concat(res2.data.show_fields);
                          let resData2 = res2.data.collection
                          resData2.forEach((r) => {
                            r.tableIndex = index;
                          });
                          resData1.forEach((a) => {
                            // let queryObj = {}
                            let queryArr = []
                            groupArr.forEach((e)=>{
                              queryArr.push(a[e])
                            })                          
                              resData2.forEach((b)=>{
                                let arrBool = []
                                for (let i = 0; i < groupArr.length; i++) {
                                  arrBool.push(b[groupArr[i]] == [queryArr[i]])
                                }
                                if(arrBool.indexOf(false) == -1){
                                  a = Object.assign(a,b)
                                }
                              })
                          });
                          console.log('mergeData',resData1);
                          _this.tableData = resData1
                          _this.loading = false
                        }
                      );
                    }
                  });
                } else {
                  // 主表无数据
                  _this.loading = false;
                }
              });
            }
          });
        }else{
          let arr = []
          this.tableData = []
          this.show_fileds = []
          apis.forEach((re)=>{
            arr.push(re)
            commonGet(re, this.item.listQuery).then((res)=>{
              this.tableData = this.tableData.concat(res.data.collection)
              let filed = filterObjToArr(res.data.show_fields)
              this.show_fileds = this.show_fileds.concat(filed)
              if(res.data.new_show_fields && res.data.new_show_fields.length>0){
                res.data.new_show_fields.forEach((r)=>{
                  _this.tableColumn.push({prop: r.key, label: r.value})
                })
              }
              if(res.data.total_info){
                _this.totalInfos = res.data.total_info
              }
              if(arr.length >= apis.length){
                _this.loading = false
              }
            })
          })
        }

        
      }
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .box-size{
    display: inline-block;
    margin: 3px!important;
    position: relative;
    cursor: pointer;
    /deep/ .el-table{
      tr td{
        .cell{
          transform: scale(0.8);
        }
      }
      tr th{
        padding: 3px 0;
        .cell{
          transform: scale(0.84);
        }
      }
    }
  }  
  .table-title{
    position: absolute;
    top: 2px;  
    left: 0;
    z-index:5;
    font-weight: bold;
    font-weight: 16px;
    width: 100%;
    text-align: center;
    text-overflow: ellipsis; /*文字以省略号的方式隐藏*/
    white-space: nowrap;/*禁止文字内容折行*/
    overflow: hidden;/*超出部分溢出隐藏*/

  }
  .box-size >>>.el-table td, .el-table th{
    padding: 0;
  }
  .box-size /deep/.el-table th>.cell{
    white-space: nowrap;
  }
  .box-size /deep/.el-table .cell, .el-table th div{
    padding: 0;
  }
  /* .box-size /deep/.el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {height: 5px;background-color: #eee;} */
  </style>
  