
<template>
  <div>
      <Form ref="formValidate" :rules="rules" :model="upLoadForm" :label-width="100">
        <FormItem prop='title' label="导入标题">
          <Input v-model="upLoadForm.title" placeholder="请输入导入标题" style="width:160px" />
        </FormItem>
        <FormItem prop='liveBroadcastTime'  label="直播时间">
          <!-- <Input v-model="upLoadForm.title" placeholder="请输入导入标题" style="width:160px" /> -->
          <DatePicker type="date"  v-model="upLoadForm.liveBroadcastTime" placeholder="请选择"></DatePicker>
        </FormItem>
        <FormItem prop='' label="导入文件">
          <Upload action="actionUpload" 
                  :before-upload="handleBeforeUpload" 
                  accept=".xls, .xlsx" 
                  :headers="actionUploadHeaders">
            <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
          </Upload>
        </FormItem>
        <div class="ivu-upload-list-file" v-if="file !== null">
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
export default {
  name: 'upload-excel',
  data () {
    return {
      actionUpload: this.$api.uploadImage,
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
          liveBroadcastTime: [
            { required: true, message: '直播开始时间不为空', trigger: 'blur' }
          ]
      },//校验规则对象
      upLoadForm:{
        title:'',
        liveBroadcastTime:''
      }, //表单
      uploadLoading: false,
      showRemoveFile: false,
      file: null,
    }
  },
  methods: {
    handleSubmit (name) {
      console.log("-------》")
        this.$refs[name].validate((valid) => {
          console.log("-------》name",name,"----valid-",valid)
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
    handleReset (name) {
      console.log("------name",name)
        // this.$refs[name].resetFields();
        upLoadForm.liveBroadcastTime = null
        upLoadForm.title = null
        file.name = null
        this.initUpload()
    },
    //初始化上传
    initUpload () {
      this.file = null
      this.loadingProgress = 0
    },
    handleUploadFile () {
      this.initUpload()
      // 调用后台接口上传文件
      
    },
    //移除方法
    handleRemove () {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
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
      return false
    },
  },
  created () {

  },
  mounted () {

  }
}
</script>
