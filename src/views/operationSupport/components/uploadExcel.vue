
<template>
  <div>
      <Form ref="formValidate" :rules="rules" :model="upLoadForm" :label-width="150">
        <FormItem prop='title' label="导入标题">
          <Input v-model="upLoadForm.title" placeholder="请输入导入标题" style="width:160px" />
        </FormItem>
        <FormItem prop='times'  label="直播时间">
          <DatePicker type="datetime"  format="yyyy-MM-dd hh:mm:ss" @on-change="changeDate" v-model="upLoadForm.times"  :options="options"  placeholder="请选择"></DatePicker>
        </FormItem>
        <FormItem prop='' label="导入文件">
          <Upload :action="actionUpload" 
                  multiple
                  :show-upload-list="false"                  
                  :before-upload="handleBeforeUpload" 
                  accept=".xlsx" 
                  :on-success="(value) => handleSuccess(value)"
                  :headers="actionUploadHeaders">
            <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
          </Upload>
        </FormItem>
        <div class="ivu-upload-list-file" v-if="file">
          <Icon type="ios-stats"></Icon>
            {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
        </div>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
  </div>
</template>
<script>
import { decrypt } from "@/api/sm4";
export default {
  name: 'upload-excel',
  data () {
    return {
      value1 : '',
      options: {
          disabledDate (date) {
              return date && date.valueOf() > Date.now();
          }
      },
      actionUpload: this.$api.uploadImage+"?bucket=excle",
      actionUploadHeaders: { sid: window.sessionStorage.getItem("sid") },
      defaultList: [],
      uploadList: [],
      recomFlonList: [],
      recomPiiicList: [],
      sharePicList: [],
      contentType: [
        {
          value: "travel_detail",
          name: "图文",
        },
      ],
      themeIdsabled: false,
      externalLinkDisabled: false,
      rules:{
          title: [
            { required: true, message: '导入标题不能为空', trigger: 'blur' }
          ],
          times: [
              { required: true, type: 'date', message: '直播开始时间不为空', trigger: 'change' }
          ],
      },//校验规则对象
      
      upLoadForm:{
        title:'',
        liveBroadcastTime: null,
        uploadAddress:'',
        times:''
      }, //表单
      uploadLoading: false,
      showRemoveFile: false,
      file: null,
    }
  },
  methods: {
    changeDate(){  
       //uat 环境
      this.upLoadForm.liveBroadcastTime= this.$util.dateFormat2(this.upLoadForm.times, "yyyy-MM-dd hh:mm:ss")
      //本地测试
      // this.upLoadForm.liveBroadcastTime =this.upLoadForm.times 
    },
    handleSubmit (name) {
      if(this.file == null || this.upLoadForm.uploadAddress ==null || this.upLoadForm.uploadAddress ==""){
        this.$Message.error(
         "上传文件不能为空"
        );
        return
      }
      if(this.upLoadForm.liveBroadcastTime==null|| this.upLoadForm.liveBroadcastTime ==""){
        //uat 环境
        this.upLoadForm.liveBroadcastTime = this.$util.dateFormat2(this.upLoadForm.times, "yyyy-MM-dd hh:mm:ss")
        //本地测试
        // this.upLoadForm.liveBroadcastTime =this.upLoadForm.times 
      }
      
      this.$refs[name].validate((valid) => {
        if (valid) {
          //调用接口
          // loading
          this.$util.showLoading();
          this.$api.postImportInfo(this.upLoadForm).then((res) => {
            // loading关闭
            this.$util.hideLoading();
            // 成功判断
            if (res.code == "0") {
                this.$Message.success(
                res.resultMessage ? res.resultMessage : res.message
              );
              this.handleReset('formValidate')
              this.initUpload()
              this.$emit("closeDialog",false)
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          });
          } else {
              this.$Message.error('表单验证失败!');
          }
      })

    },
    handleReset (name) {
        this.$refs[name].resetFields();
        // this.upLoadForm.liveBroadcastTime = null
        // this.upLoadForm.title = null
        this.initUpload()
    },
    //初始化上传
    initUpload () {
      this.file = null
    },
    handleUploadFile () {
      this.initUpload()
    },
    //移除方法
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleSuccess(value) {
      //解密
      if (typeof value == "string") {
        value = JSON.parse(decrypt(value));
      }
      if (value.code == 0) {
        // console.log(index, value)
       this.upLoadForm.uploadAddress= value.content.content.absolute_url;
        // this.formItem.list[index].filePath = value.content.content.url;
        // this.formItem.list[index].toFilePath =
        //   value.content.content.absolute_url;
      }
    },
    //上传校验
    handleBeforeUpload (file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.showRemoveFile = true
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      // return false
    }
  },
  created () {
   
  },
  mounted () {
    this.initUpload()
    this.upLoadForm.times=this.$util.dateFormat2(new Date(), "yyyy-MM-dd hh:mm:ss")
  }
}
</script>
