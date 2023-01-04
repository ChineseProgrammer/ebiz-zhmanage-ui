<template>
  <div id="tenant-list" class="only-content">
    <!-- 顶部筛选 -->
    <div class="header">
      <div class="left">
        <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="100">     
         <Row :gutter="20">
          <Col span="8" offset="2">
          <FormItem label="租户名称"  prop="tenantName" >
              <Input v-model="formData.tenantName" style="width:230px" placeholder="请输入租户名称" />
            </FormItem>

            <FormItem label="租户logo"  prop="uploadLogo" >
              <Upload
                v-model="formData.uploadLogo"
                :on-success="handleSuccess"
                ref="upload"
                 action="//jsonplaceholder.typicode.com/posts/">
                 <div class="upload">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或将文件拖拽到这里上传</p>
                 </div>
              </Upload>
            </FormItem>
            
            <FormItem label="页面风格" prop="pageType" >
                <Select v-model="formData.pageType" style="width:230px" placeholder="3D风格">
                    <Option value="0" >半透明风格</Option>
                    <Option value="1" >3D风格</Option>
                    <Option value="2" >极简风格</Option>
                    <Option value="3" >无边框风格</Option>
                    <Option value="4" >插画风格</Option>
                    
                </Select>
            </FormItem>
            <FormItem label="上架产品类型"  prop="productType" >
                      <Input v-model="formData.productType" style="width:230px" placeholder="请输入..." />
           </FormItem>
              
          </Col>
          <Col span="8" offset="2">
              <FormItem label="推送配置" prop="textarea" >
                <!-- <Input v-model="formData.pushConfig" style="width:230px" placeholder="请输入使用时限" /> -->
              <Input v-model="formData.textarea" type="textarea" style="width:230px"  :autosize="{minRows: 3,maxRows: 9}" placeholder="以短信方式推送..." /> 
              </FormItem>
                  <FormItem label="活动配置"  prop="activConfig " >
                      <!-- <Input v-model="formData.textarea" type="textarea" style="width:230px"  :autosize="{minRows: 3,maxRows: 9}" placeholder="请输入..." />  -->
                      <Checkbox-group v-model="formData.activConfig">
                          <Checkbox label="全力举绩">全力举绩</Checkbox>
                          <Checkbox label="全力冲刺创辉煌">全力冲刺创辉煌</Checkbox>
                          <Checkbox label="坚持不懈，业绩长红">坚持不懈，业绩长红</Checkbox>
                          <Checkbox label="咬定青山不放松">咬定青山不放松</Checkbox>
                          <Checkbox label="流程管理">流程管理</Checkbox>
                      </Checkbox-group>
                  </FormItem>
                  
              <FormItem label="产品名称" prop="productName" >
                  <Input v-model="formData.productName"  style="width:230px" placeholder="请输入产品名称" />
              </FormItem>
            
          </Col>
        </Row>
        </Form>
      </div>
      <div class="right">
        <Button @click="addtenant()" class="ivu-btn ivu-btn-primary" style="margin-right:5px">保存</Button>
        <Button @click="reset()">恢复初始配置</Button>
      </div>
    </div>
   
        
     
  </div>
</template>

<script>
export default {
  data() {
      const validateUpload = (rule, value, callback) => {
      if(this.uploadList && this.uploadList.length === 0) {
        callback(new Error('请上传logo'))
      } else {
        callback()
      }
    }
    return {
      uploadList: [],
      formData: {
       
        tenantName:"隽天",
        uploadLogo:"",
        pageType:"0",
        textarea:"以短信方式推送",
        activConfig: ['全力举绩'],
        productType:"保险",
        productName:"健康险",
      },
     
      ruleValidate: {
        tenantName: [
         { required: true, message: "输入不能为空", trigger: "blur" },         
        ],
        //  uploadLogo: [
        //   { required: true, validator: validateUpload, trigger: 'change'}
        // ],
      },
      //searchParams: {},
      mounted () {
          this.uploadList = this.$refs.upload.fileList
          // console.log(this.uploadList)
      },
     
      
      
      userInfo:JSON.parse(window.sessionStorage.getItem('userInfo')),
      importModal:false,
      file:null
    };
  },
  created: function() {
    // this.search(1);
  },
  mounted: function() {},
  watch: {},
  methods: {
    // addProtocol(id) {
    //   this.modalForm = true;
    //   if (id) {
    //     this.modalName = "编辑营业员";
    //   } else {
    //     this.modalName = "新增营业员";
    //   }
    // },
    //关闭弹窗
    close() {
      this.formData = {
        name: "",
        num: "",
      };
      this.modalForm = false;
    },
    // 获得列表
    search(page) {
      this.params.page = page ? page : 1;
      //注意：不能使用直接使用 this.params，因为根据 key-value 处理后的查询数据 下次查询还会存在
      let { pageSize, tenantName, productName } = this.params;
      let searchData = {
        pageSize: pageSize,
        pageNum: page,
         data : {
            tenantName:tenantName,
            productName:productName,
            
          }
      };
      if (this.params.key) {
        searchData[this.params.key] = this.params.value;
      }
      this.getList(searchData);
      this.searchParams = searchData;
    },
    //获取列表
    getList(searchData) {
      this.tableloading = true;
      //调用接口
      this.$api.getAgentList(searchData).then(res => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.tableList = res.data.records;
          this.total = res.data.total;
        } else {
          this.$Message.error(res.message);
        }
        this.tableloading = false;
      });
    },
    //重置
    reset() {
      this.params.num = "";
      this.params.name = "";
      this.params.type = "";
      this.search(1);
    },
    //换页
    changePage(page) {
      this.params.page = page;
      this.searchParams.page = page;
      this.getList(this.searchParams);
    },
    addtenant() {
      this.modalForm = true;
      this.modalName = "新增租户参数配置";
    },
    addtenant() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
            {
                this.$api.addTeam(this.formData).then(res => {
                    this.close()
                    if (res.respCode == 0) {
                        this.$Message.success("新增成功");
                        this.search(1);
                    } else {
                        this.$Message.error(res.message);
                    }
                });

            }
        }
    })

    },
    // toDetail(row){      
    //     this.$router.push('sys-tenantDetail')
    // },
    
  }
};
</script>

<style lang='less'>
#tenant-list {
  .header {
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
    .left {
      width: 0px;
      flex-grow: 1;
    }
    .right {
      width: auto;
    }
  }
}

</style>


