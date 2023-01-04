<template>
  <div class="ml10 underwriting">
    <!-- 审核详情 -->
    <div>
       <p class="mt20 fs16 fwb">
       审核详情
      </p>
      <Divider class="mv20"/>
        <div  class="pl20">
        <Row class="mv10">
          <i-col span="6">
            <span
              >订单号：<label>{{ reviewedInfo.orderNo }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >投保单号：<label>{{ reviewedInfo.applyCode }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >产品名称(主险)<label>{{ reviewedInfo.policyCode }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >投保人姓名：<label>{{ reviewedInfo.orderGenDate }}</label></span
            >
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span
              >证件类型：<label>{{ reviewedInfo.effectiveDate }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >证件号码：<label>{{ reviewedInfo.channel }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >被保人姓名：<label>{{ reviewedInfo.premium }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >被保人年龄：<label>{{ reviewedInfo.policyStatusName }}</label></span
            >
          </i-col>
        </Row>
          </Row>
        <Row class="mv10">
          <i-col span="6">
            <span
              >证件类型：<label>{{ reviewedInfo.agentCode }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >证件号码：<label>{{ reviewedInfo.agentName }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >渠道：<label>{{ reviewedInfo.agentPhone }}</label></span
            >
          </i-col>
          <i-col span="6">
            <span
              >推广人员姓名：<label>{{ reviewedInfo.manageOrgName }}</label></span
            >
          </i-col>
            </Row>
        <Row class="mv10">
          <i-col span="6">
            <span
              >转人核时间：<label>{{ reviewedInfo.serverOrgName }}</label></span
            >
          </i-col>
           <i-col span="6">
            <span
              >审核状态：<label>{{ reviewedInfo.serverOrgName }}</label></span
            >
          </i-col>
           <i-col span="6">
            <span
              >审核人：<label>{{ reviewedInfo.serverOrgName }}</label></span
            >
          </i-col>
           <i-col span="6">
            <span
              >审核时间：<label>{{ reviewedInfo.serverOrgName }}</label></span
            >
          </i-col>
        </Row>
      </div>
    </div>
    
    <!-- 投保人影像信息 -->
    <div>  
      <div>
         <p class="mt20 fs16 fwb"> 审核详情</p>
          <Divider class="mv20"/>
         <div>
            <!-- <Row v-if="fileList.length >0" >
              <i-col span="6" offset="2"  class="mv20"  v-for="(item,index) in fileList" :key="index">
                  <div  v-show="urlSuffixList[index] !== 'pdf'">
                      <img :src="item" alt=""  style="width:100%;height:100%"> 
                  </div>
              </i-col>
            </Row> -->
            <Row class="mv10">
                <i-col span="6">
                  <span
                    >投保人姓名：<label>{{ reviewedInfo.serverOrgName }}</label></span
                  >
                </i-col>
                <i-col span="6">
                  <span
                    >投保人年龄：<label>{{ reviewedInfo.serverOrgName }}</label></span
                  >
                </i-col>
                <i-col span="6">
                  <span
                    >投保人性别：<label>{{ reviewedInfo.serverOrgName }}</label></span
                  >
                </i-col>
                <i-col span="6">
                  <span
                    >证件类型：<label>{{ reviewedInfo.serverOrgName }}</label></span
                  >
                </i-col>
            </Row>
            <Row class="mv10">
              <i-col span="6">
                <span
                  >证件号码：<label>{{ reviewedInfo.serverOrgName }}</label></span
                >
              </i-col>
              <i-col span="6">
                <span
                  >转人核原因：<label>{{ reviewedInfo.serverOrgName }}</label></span
                >
              </i-col>
            </Row>
            <Row>
              <i-col span="8" >
                <img src='../../assets/idcard.jpg'  style="width:50%;height:50%;">
                <p class="mv10 fs12 ml25">投保人面部识别照片</p>
              </i-col>
                <i-col span="8">
                <img src='../../assets/idcard.jpg'  style="width:50%;height:50%;">
                <p class="mv10 fs12 ml25">投保人证件照片(正面)</p>
              </i-col>
                <i-col span="8">
                <img src='../../assets/idcard.jpg'  style="width:50%;height:50%;">
                <p class="mv10 fs12 ml25">投保人证件照片(反面)</p>
              </i-col>
            </Row>
            <Row>
            
              <p class="ml80 mv10 fs16 fwb green">审核通过<label>{{ reviewedInfo.serverOrgName }}</label> </p>
            </Row>
         </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers : {sid : this.$util.getSessionStorage("sid")} ,
      id: this.$route.params.id,      
      //基本信息数据
      reviewedInfo:{
        orderNo:"C20200428000018",
        applyCode:"C20200428000018",
         policyCode:"C20200428000018",
         name:"李腾"
      },
      //影像信息数据
      fileList:[],
      //url后缀
      urlSuffixList:[],
      //受益人---与被保人关系
      benneInsuredRelationList:[
        { name: "本人", value: "00" },
        { name: "配偶", value: "01" },
        { name: "父亲", value: "03" },
        { name: "母亲", value: "04" },
        { name: "子女", value: "05" },
        { name: "祖父母", value: "07" },
        { name: "兄弟姐妹", value: "15" },
        { name: "孙子女", value: "17" },
        { name: "朋友", value: "27" },
        { name: "雇佣", value: "28" },
        { name: "其他", value: "30" },
        { name: "借贷关系", value: "32" },
      ],
      //证件类型--枚举值
        certificateTypeList: [
        { name: "身份证", value: "00" },
        { name: "户口本", value: "01" },
        { name: "出生证", value: "02" },
        { name: "外国护照", value: "03" },
        { name: "军人证(军官证)", value: "04" },
        { name: "士兵证", value: "05" },
        { name: "警官证", value: "06" },
        { name: "台湾居民往来内陆通行证", value: "07" },
        { name: "港澳居民往来内陆通行证", value: "08" },
        { name: "中国护照", value: "09" },
        { name: "护照", value: "10" },
        { name: "无证件", value: "11" },
        { name: "其他", value: "12" },
        { name: "外国人永久居留身份证", value: "13" },
      ],
      //保单状态--枚举值
       policyStatusList: [
        { name: "初始状态", value: "00" },
        { name: "待核保", value: "20" },
        { name: "核保成功", value: "21" },
        { name: "核保失败", value: "22" },
        { name: "承保成功", value: "23" },
        { name: "承保失败", value: "24" },
        { name: "已终止", value: "25" },
        { name: "已失效(已撤单)", value: "26" },
        { name: "已失效A(已撤单)", value: "26A" },
        { name: "待转人工核保", value: "27-0" },
        { name: "转人工核保成功", value: "27-1" },
        { name: "转人工核保失败", value: "27-2" },
        { name: "签收回执", value: "28" },
        { name: "修改中", value: "29" },
      ],
      
    };
  },
  created: function() {
    this.getExamineList();
  },
  mounted: function() {},
  watch: {},
  methods: {
    //获取核保信息
    getExamineList() {
      let params = {
        policyId:this.id,
        examineType:2,
      };
      // loading
      this.$util.showLoading();
      this.$api.getExamineList(params).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        console.log(res)
        if (res.result === "0") {
          //基本信息
          
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
  },
};
</script>
