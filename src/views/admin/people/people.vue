<template>
  <div id="peopleList" class="only-content">
    <div>  
      <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="100"
      >
        <Row :gutter="20">
            <Col span="12">
                <Col span="12">
                    <FormItem label="登录账号" prop="id">
                        <Input v-model="formData.id" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="姓名" prop="bxCompanyName">
                        <Input v-model="formData.name" :disabled="isClick==0"/>
                    </FormItem>
                    <FormItem label="手机号" prop="agreementStartTime">
                      <Input v-model="formData.phone" :disabled="isClick==0"/>
                    </FormItem>
                    <FormItem label="邮箱" prop="agreementStartTime">
                        <Input v-model="formData.email" :disabled="isClick==0"/>
                    </FormItem>
                </Col>
            </Col>
        </Row>
        <div id="button" class="mb-10">
          <Button
            @click="toChangePassword()"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;margin-left: 3px"
          >修改密码
          </Button>
          <Button
            @click="toHome()"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;"
          >确定
          </Button>
        </div>
      </Form>
      
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    params:{},
      formData: {
          id: 'adminCenter',
          name:'超级管理员',
          phone: '15997186261',
          email: 'jingdaicloud@gmail.com',
        jdRiskInfoAgreementReqVOS:[
            {
                riskId: "",
                riskType:"",
                riskName:"",
                commissionRate:""
            }
        ]
      },
      ruleValidate: {
        // name: [
        //   this.$util.rules.required("请输入名称"),
        //   this.$util.rules.max(100, "输入限制100位")
        // ]
      },
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      id: this.$route.query.id,
      isClick:this.$route.query.type,
      insuranceList: [
        {
          riskId: "",
          riskType:"",
          riskName:"",
          commissionRate:""
        }
      ],
      riskList:[],
    };
  },
  // created: function() {
  //     this.getList()
  //     console.log(this.isClick)
  //     if(this.id){
  //         this.getDetail()
  //     }
      
  // },
  mounted: function() {},
  watch: {},
  methods: {
    //获取列表
    getList() {
      //调用接口
      let data={}
      this.$api.getRiskList(data).then(res => {
        if (res.respCode == "0") {
          this.riskList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //根据id查看详情
    getDetail() {
      //调用接口
      let data={
          id:this.id
      }
      this.$api.getRiskDetail(data).then(res => {
        if (res.respCode == "0") {
          this.formData = res.data;
          this.formData.jdRiskInfoAgreementReqVOS.map(item => {
              item.riskType = item.riskType.toString()
          })
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    addInsurance(){
        let obj = {
          riskId: "",
          riskType:"",
          riskName:"",
          commissionRate:""
        }
        this.formData.jdRiskInfoAgreementReqVOS.push(obj);
    },
    delInsurance(index){
        this.formData.jdRiskInfoAgreementReqVOS.splice(index,1);
    },
    riskCheck(value){
        this.riskList.map(item=>{
            if(item.riskId == value){
                this.formData.jdRiskInfoAgreementReqVOS.map(i =>{
                    if(i.riskId == value){
                        i.riskCode = item.riskCode
                        i.riskName = item.riskName
                    }
                })
            }
        })
    },
    dateStartChange(date){
        this.formData.agreementStartTime = date
    },
    dateEndChange(date){
        this.formData.agreementEndTime = date
    },
    doAdd(){
        if(this.isClick !="1"){
            this.$api.createRisk(this.formData).then(res => {
                if (res.respCode == "0") {
                    this.$Message.success("新增成功");
                } else {
                    this.$Message.error(res.message);
                }
            });
        }else{
            this.$api.updateRisk(this.formData).then(res => {
                if (res.respCode == "0") {
                    this.$Message.success("修改成功");
                } else {
                    this.$Message.error(res.message);
                }
            });
        }
        
    },
    toChangePassword() {
      this.$router.push("change-Password");
    },
    toHome() {
      this.$router.push("home");
    }
  }
};
</script>

<style lang='less'>
#peopleList {
  .ivu-input-wrapper {
    width: 200px;
  }
  .ivu-select {
    width: 200px;
  }
  .border-bottom {
    border-bottom: 1px dashed #ddd;
  }
  margin-top: 10px;
  margin-left: 30%
}
#button
{
  margin-left: 9%
}

</style>
