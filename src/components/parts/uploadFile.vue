<template>
<div class="upload_box" :class="{btnCalss:type=='btn'}">
    <el-upload
        class="avatar-uploader"
        :action="productUrl+url"
        :headers="myHeaders"
        :show-file-list="false"
        :data="otherData"
        :on-success="successUpload"
        :name="filekey"
        :before-upload="beforeUpload">
        <img v-if="uploadedUrl && type=='img'" :src="uploadedUrl" class="avatar">
        <i v-if="!uploadedUrl && type=='img'" class="el-icon-plus avatar-uploader-icon"></i>
        
        <el-button type="primary">{{btnWord}}</el-button>
    </el-upload>
</div>
    
</template>  
<script>
import { getToken } from '@/utils/auth'

export default {
    props:{
        otherData:{
            type: Object,
            default: {
                
            }
        },
        url:{
            type: String,
            default: ''
        },
        type:{
            type: String,
            default: 'img'
        },
        btnWord:{
            type: String,
            default: '上传'
        },
        filekey:{
            tyep: String,
            default: 'file'
        }
    },
    data(){
        return{
            productUrl:'',
            uploadedUrl:'',
            myHeaders:{}
        }
    },
    mounted(){
        if (process.env.NODE_ENV != "development") {
            this.productUrl = origin
        } else {
            this.productUrl = process.env.VUE_APP_BASE_API || ''
        }
        let token = getToken()
        token = token || ''
        token = token.replace('%20', ' ')
        this.myHeaders['authorization'] = token
        // this.myHeaders['Content-Type'] = 'multipart/form-data'
    },
    methods:{
        successUpload(res, file){
            console.log(222,res, file);
            this.uploadedUrl = res.data.url
            if(res.code ===20000){
                this.$message.success('上传成功')
                this.$emit('successUpload',this.uploadedUrl)
            }else{
                this.$message.error(res.message)
            }
        },
        beforeUpload(file){
            console.log(111,file);
            console.log(444,this.otherData);
            
            // this.$emit('beforeUpload')
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isLt2M

        },
    }

}
</script>
<style lang="scss" scoped>
.upload_box{
    width: 100px;
    height: 100px;
    /deep/ .el-upload{
        img{
            width: 100%;
            height: 100%;
        }
    }
    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background-color: #fbfdff;
    }
    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    /deep/ .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    /deep/ .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
}
.btnCalss{
    display: inline-block;
    height: 40px;
    width: auto;
    position: relative;
    top: 15px;
    /deep/ .avatar-uploader .el-upload{
        border: none;
    }
}
    
</style>