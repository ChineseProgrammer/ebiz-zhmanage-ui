<template>
  <div id="productList" class="only-content">
    <div>  
      <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="100"
      >
        <Row :gutter="20">
            <Col span="12">
                <Col span="12">
                    <FormItem label="租户编号" prop="tenantCode">
                        <Input v-model="formData.tenantCode" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="租户名称" prop="tenantName">
                        <Input v-model="formData.tenantName" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="联系人" prop="contactPeople">
                        <Input v-model="formData.contactPeople" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="电话" prop="phone">
                        <Input v-model="formData.phone" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input v-model="formData.email" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="地址" prop="address">
                        <Input v-model="formData.address" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="营业执照" prop="license">
                        <Input v-model="formData.license" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="资质证件" prop="certificate ">
                        <Input v-model="formData.certificate " :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="缴费时间" prop="paymenttime ">
                        <Input v-model="formData.paymenttime " :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="缴费金额" prop="paymenttotal ">
                        <Input v-model="formData.paymenttotal " :disabled="isClick!==0"/>
                    </FormItem>
                </Col>
                
            </Col>
            <Col span="12">
                <Col span="12">
                    <FormItem label="账户余额" prop="balance">
                        <Input v-model="formData.balance" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="缴费类型" prop="paymentType">
                        <Input v-model="formData.paymentType" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="到期时间" prop="endTime">
                        <Input v-model="formData.endTime" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="状态" prop="status">
                        <Input v-model="formData.status" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="访问次数" prop="visitTime">
                        <Input v-model="formData.visitTime" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="积分" prop="credits">
                        <Input v-model="formData.credits" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="合作的保险公司" prop="cooperated">
                        <Input v-model="formData.cooperated" :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="行业荣誉" prop="certificate ">
                        <Input v-model="formData.certificate " :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="域名" prop="domain ">
                        <Input v-model="formData.domain " :disabled="isClick!==0"/>
                    </FormItem>
                    <FormItem label="服务器规格" prop="serverType ">
                        <Input v-model="formData.serverType " :disabled="isClick!==0"/>
                    </FormItem>
                </Col>
                
            </Col>
        </Row>
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
        tenantCode:'DX3906',
        tenantName: '隽天',
        contactPeople: '管月',
        phone: '15997186261',
        email: 'xietianguanyue@163.com',
        address: '上海市黄浦区广东路500号三层',
        license: '9449324',
        certificate: '1912724183',
        paymenttime: '2019-11-03',
        paymenttotal: '63681',
        balance: '3218',
        paymentType: '在线支付',
        endTime: '2019-11-22',
        status: '启用',
        visitTime: '21345',
        credits: '73369',
        cooperated: '中国人寿',
        domain: 'www.juntianbroker.com',
        serverType: '4核8G',
        jdRiskInfoAgreementReqVOS:[
            {
                riskId: "",
                riskType:"",
                riskName:"",
                commissionRate:"",
                insuredCost:""
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
  created: function() {
      this.getList()
      console.log(this.isClick)
      if(this.id){
          this.getDetail()
      }
      
  },
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
          commissionRate:"",
          insuredCost:""
        }
        this.formData.jdRiskInfoAgreementReqVOS.push(obj);
    },
    delInsurance(index){
        this.formData.jdRiskInfoAgreementReqVOS.splice(index,1);
    },
    riskCheck(value){
        console.log(value)
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
        // this.formData.jdRiskInfoAgreementReqVOS = JSON.parse(JSON.stringify(this.insuranceList))
        console.log(this.formData)
        console.log(this.isClick)
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
    toDetail(row) {
      this.$router.push("customer-detail");
    }
  }
};
</script>

<style lang='less'>
#productList {
  .ivu-input-wrapper {
    width: 200px;
  }
  .ivu-select {
    width: 200px;
  }
  .border-bottom {
    border-bottom: 1px dashed #ddd;
  }
}
</style>
