<template>
  <div class="clue-wrapper">
    <div class="clue-head">
      <div class="clue-head-item clue-name" :class="{ 'active': !messageVisible }">{{userinfo.clientName}}</div>
      <div class="clue-head-item" :class="{ 'active': messageVisible }" @click="messageVisible = true;">基本信息</div>
    </div>
    <van-form validate-first @failed="onFailed" @submit="onSubmit" ref="myForm">
      <van-field name="contactTime" v-model="formData.contactTime" :disabled="userinfo.checked === 2" readonly
        label="首联时间" placeholder="请选择" :rules="[{ required: true, message: '' }]"
        @click-input="chooseType('contactTime')" right-icon="arrow-down"
        @click-right-icon="chooseType('contactTime')" />

      <van-field name="mode" v-model="formData.mode" readonly label="首次沟通方式" placeholder="请选择" :disabled="modeDisabled" @click-input="chooseType('mode')" right-icon="arrow-down" @click-right-icon="chooseType('mode')" />
      <van-field name="addWx" label="是否添加微信" class="radio-field">
        <template #input>
          <van-radio-group v-model="formData.addWx" direction="horizontal" :disabled="addWxDis">
            <van-radio name="是" shape="square">是</van-radio>
            <van-radio name="否" shape="square">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <!-- <van-field name="nickName" v-show="formData.addWx === '是'" :disabled="userinfo.externalUserid" -->
      <van-field name="nickName" v-show="formData.addWx === '是'" :disabled="!!formData.nickName"
        v-model="formData.nickName" readonly label="关联用户昵称" placeholder="请选择"
        :rules="[{ required: formData.addWx === '是', message: '' }]" @click-input="chooseType('nickName')"
        right-icon="arrow-down" @click-right-icon="chooseType('nickName')" />

      <van-field name="interview" label="是否面访" class="radio-field">
        <template #input>
          <van-radio-group v-model="formData.interview" direction="horizontal" :disabled="interviewDis">
            <van-radio name="是" shape="square">是</van-radio>
            <van-radio name="否" shape="square">否</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field name="followStatus" v-model="formData.followStatus" readonly label="跟进状态" placeholder="请选择"
        right-icon="warning-o" @click-right-icon="showfollowStatusDetails" @click-input="chooseType('followStatus')" />

      <van-field name="insuredProduct" :disabled="!chengbaoRequired" v-model="formData.insuredProduct" readonly label="投保产品" placeholder="请选择"
        @click-input="chooseType('insuredProduct')" :rules="[{ required: chengbaoRequired, message: '' }]"
        right-icon="arrow-down" @click-right-icon="chooseType('insuredProduct')" />

      <van-field name="amount" :disabled="!chengbaoRequired" v-model="formData.amount" label="保额（万）" type="digit" placeholder="请输入" clearable
        :rules="[{ required: chengbaoRequired, message: '' }]" />

      <van-field name="prem" :disabled="!chengbaoRequired" v-model="formData.prem" label="保费" type="number" placeholder="请输入" clearable
        :rules="[{ required: chengbaoRequired,validator: asyncValidator, message: '需保留两位小数' }]" />

      <van-field name="des" v-model="formData.des" label="情况说明" type="textarea" placeholder="请输入" maxlength="100"
        :rules="[{ required: desRequired, message: '' }]" clearable show-word-limit />

      <van-row style="padding: 16px 16px 50px;">
        <van-col span="8">
          <van-button round block plain type="info" @click="backList">返回</van-button>
        </van-col>
        <van-col span="15" offset="1">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </van-col>
      </van-row>
    </van-form>
    <div class="base-message-box" v-show="messageVisible" @click="messageVisible = false;">
      <div class="base-message-content">
        <p>姓名：{{userinfo.clientName}}</p>
        <p>性别：{{userinfo.clientSex}}</p>
        <p>年龄：{{userinfo.clientAge}}</p>
        <p>电话：{{userinfo.clientPhone}}</p>
        <p>基本保额：{{userinfo.clientPrem}}万元</p>
        <p>产品名称：{{userinfo.productName}}</p>
      </div>
    </div>

    <van-popup v-model="dateVisible" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate" type="datetime" title="选择年月日时分" :min-date="minDate" :max-date="maxDate"
        @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
    </van-popup>
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <van-picker :title="pickerTitle" round show-toolbar :columns="pickerColumns" @confirm="onConfirm"
        @cancel="onCancel" @change="onChange" :defaultIndex="defaultIndex" />
    </van-popup>
    <van-popup v-model="tipVisible" position="left" :style="{ height: '100%' }">
      <div class="followStatusTips">
        <h3>跟进状态解释说明：</h3>
        <div class="followStatus-p">
          <p>（1）投放产品沟通：与客户沟通广告投放的产品</p>
          <p>（2）转投其他产品沟通：客户不愿或不能投保广告投放产品，转而与客户沟通其他产品，需在【详情说明】中写明沟通的是哪款产品</p>
          <p>（3）产品方案设计沟通：为客户或其家庭设计多产品保障方案，需在【详情说明】中写明推荐的是哪几款产品及涉及的被保险人</p>
          <p>（4）发送产品计划书：已向客户发送产品计划书，需在【详情说明】中写明发送的是哪款产品的计划书</p>
          <p>（5）预约面访：与客户明确了面访的时间和地点，需在【详情说明】中写明面访时间</p>
          <p>（6）已面访：已与客户面见沟通，需在【详情说明】中写明面访情况</p>
          <p>（7）投保跟进沟通：客户已有投保意向，就投保相关事宜与客户沟通，需在【详情说明】中写明客户的投保意向产品</p>
          <p>（8）提交投保申请：客户已填写投保申请单，并提交给运营，需在【详情说明】中写明客户投保的产品</p>
          <p>（9）核保中：客户健康存在异常，运营核保中，需在【详情说明】中写明客户的健康异常状况</p>
          <p>（10）拒保/延期：核保给出拒保或延期的核保结论，需在【详情说明】中写明核保结论下发的理由</p>
          <p>（11）待缴费：核保通过，待扣费，需在【详情说明】中写明投保产品、保额、保费</p>
          <p>（12）已承保：保单承保，需选择【投保产品】，写明【保额】和【保费】</p>
          <p>（13）运营维系沟通：客户持观望态度，持续宣贯保险理念</p>
          <p>（14）放弃跟进：判断非真正有投保需求的客户，放弃跟进，需在【详情说明】中写明放弃跟进的理由</p>
          <p>（15）无法联系：客户未接电话且不加微信</p>
          <p>（16）拒绝跟进：客户明确表示不要再联系</p>
          <p>（17）理念沟通：跟客户沟通保险理念、普及保险知识</p>
          <p>（18）其他：上述以外的情况，需在【详情说明】中写明具体情况</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Dialog } from 'vant';
export default {
  data() {
    return {
      formData: {
        contactTime: '',
        mode: '',
        addWx: '',
        nickName: '',
        followStatus: '',
        insuredProduct: '',
        amount: '',
        prem: '',
        des: '',
        interview: '',
        externalUserid: '',
      },
      modeDisabled: false,
      defaultIndex: 0,
      pickerTitle: '',
      pickerColumns: [],
      pickerType: '',
      mode: ['企业微信', '电话'],
      nickName: [], //关联用户
      followStatus: [], //跟进状态
      insuredProduct: [], //投保产品
      show: false,
      dateVisible: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      chengbaoRequired: false,
      messageVisible: false,
      tipVisible: false,
      userinfo: {},
      submitFlag: false,
      addWxDis:false,
      interviewDis:false,
    }
  },
  computed: {
    desRequired: function () {
      if (["转投其他产品沟通", "产品方案设计沟通", "发送产品计划书", "预约面访", "已面访", "投保跟进沟通", "提交投保申请", "核保中", "拒保/延期", "待缴费", "放弃跟进","无法联系","拒绝跟进", "其他"].includes(this.formData.followStatus)) {
        return true;
      }
      return false
    }
  },
  created() {
    this.getClue();
    this.getStatusList();
    this.getProductList();
    document.title = "线索详情";
  },
  methods: {
    asyncValidator(val) {
      if (this.chengbaoRequired && (this.formData.insuredProduct || val)) {
        return /^[0-9]+\.[0-9]{2}$/.test(val);
      } else {
        return true;
      }
    },
    getClue() {
      let checked = this.$route.query.checked;
      console.log("this.$route.query:", this.$route.query);
      if (checked == '2') {
        checked = 2;
      } else {
        checked = 1;
      }
      this.$api.getOneApiClue({ clueId: this.$route.query.id, checked: checked }).then(res => {
        console.log("res: ", res);
        this.userinfo = res.data.list[0];
        let clueAllotTime = "";
        if(this.userinfo.clueAllotTime){
          clueAllotTime = this.userinfo.clueAllotTime.replace(/-/g, '/');
        }
        this.minDate = new Date(clueAllotTime);
        if(this.userinfo.contactTime){
          this.formData.contactTime = this.userinfo.contactTime;
        }else{
          this.formData.contactTime = this.getFormatDate(new Date())
        }
        this.formData.mode = this.userinfo.mode;
        if(this.formData.mode){
          this.modeDisabled = true;
        }
        this.formData.addWx = this.userinfo.addWx;
        if(this.userinfo.addWx==='是'){
          this.addWxDis=true;
        }
        if(this.userinfo.interview==='是'){
          this.interviewDis=true;
        }
        this.formData.nickName = this.userinfo.nickName;
        this.formData.followStatus = this.userinfo.followStatus;
        if(this.formData.followStatus === '已承保'){
          this.chengbaoRequired = true;
        }
        this.formData.insuredProduct = this.userinfo.insuredProduct;
        this.formData.amount = this.userinfo.amount;
        this.formData.prem = this.userinfo.prem;
        this.formData.des = this.userinfo.des;

        this.formData.groupIn = this.userinfo.inGroup;
        this.formData.groupName = this.userinfo.groupChatName;
        this.formData.externalUserid = this.userinfo.externalUserid;
        this.formData.interview = this.userinfo.interview;
        this.externalContact();
      })
    },
    getProductList() {
      this.$api.apiProductList({}).then((res) => {
        console.log(res);
        this.insuredProduct = res.data;
      });
    },
    externalContact() {
      console.log(this.userinfo, "+----");
      this.$api.externalContact({ agentId: this.userinfo.agentId }).then(res => {
        console.log(res);
        this.nickName = [];
        res.data.map(one => {
          one.text = one.name;
          this.nickName.push(one);
        })
      })
    },
    getStatusList() {
      this.params = {
        page: 1,
        parentId: "996065045395800064",
        relationCode: "clue_status",
        pageSize: 20
      }
      this.$api.getClueStatusList(this.params).then((res) => {
        console.log(res);
        this.followStatus = [];
        res.data.content.list.map(one => {
          this.followStatus.push(one.name);
        });
      });
    },
    onConfirm(e) {
      console.log(e, this.pickerType);
      let date = new Date(e);
      if (this.pickerType === 'contactTime') {
        this.formData.contactTime = this.getFormatDate(date);
        this.dateVisible = false;
      } else if (['mode', 'nickName', 'followStatus', 'insuredProduct'].includes(this.pickerType)) {
        if (this.pickerType === 'nickName') {
          Dialog.confirm({
            title: '提示',
            message: '该用户只可添加一次，不支持修改，确定添加吗？',
          })
            .then(() => {
              // on confirm
              this.formData[this.pickerType] = e.name;
              this.formData.groupIn = e.inGroup;
              this.formData.groupName = e.groupChatName;
              this.formData.externalUserid = e.externalUserid;
              this.show = false;
            })
            .catch(() => {
              // on cancel
            });
        } else {
          if (this.pickerType === 'followStatus') {
            if (e === '已承保') {
              this.chengbaoRequired = true;
            } else {
              this.chengbaoRequired = false;
              this.formData.insuredProduct = "";
              this.formData.prem = '';
              this.formData.amount = '';
            }
          }
          this.formData[this.pickerType] = e;
          this.show = false;
          this.$refs.myForm.resetValidation();
        }
      }

      console.log(this.chengbaoRequired);
    },
    onCancel() {
      this.show = false;
      this.dateVisible = false;
    },
    onChange() { },
    chooseType(type) {
      this.pickerType = type;
      if (type === 'contactTime') {
        if(this.userinfo.checked === 2){
          return false;
        }
        this.pickerType = 'contactTime';
        this.maxDate = new Date();
        this.dateVisible = true;
      } else if (type === 'mode') {
        if(this.modeDisabled){
          return false;
        }
        this.pickerTitle = '沟通方式';
        this.pickerColumns = this.mode;
        this.show = true;
      } else if (type === 'nickName') {
        if(!!this.formData.nickName){
          return false;
        }
        this.pickerTitle = '关联用户昵称';
        this.pickerColumns = this.nickName;
        this.show = true;
      } else if (type === 'followStatus') {
        this.pickerTitle = '跟进状态';
        this.pickerColumns = this.followStatus;
        this.show = true;
      } else if (type === 'insuredProduct') {
        if(!this.chengbaoRequired){
          return false;
        }
        this.pickerTitle = '投保产品';
        this.pickerColumns = this.insuredProduct;
        this.show = true;
      }
      let index = this.pickerColumns.findIndex(one => {
        return one === this.formData[type];
      })
      if (index >= 0) {
        this.defaultIndex = index;
      } else {
        this.defaultIndex = 0;
      }
      console.log(this.pickerColumns);
    },
    onSubmit(values) {
      if (!this.submitFlag) {
        this.submitFlag = true;
        values.clueId = this.$route.query.id;
        values.userId = this.userinfo.agentId;
        values.groupIn = this.formData.groupIn;
        values.groupName = this.formData.groupName;
        values.externalUserid = this.formData.externalUserid;
        values.interview = this.formData.interview;
        values.userName = this.userinfo.agentName;
        console.log(values);
        this.$api.addApiClue(values).then(res => {
          console.log(res);
          this.$router.go(-1);
        }).catch(err => {
          this.submitFlag = false;
        })
      }
    },
    backList(){
      this.$router.go(-1);
    },
    onFailed() {

    },
    getFormatDate(date){
      return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0') + " " + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    },
    showfollowStatusDetails() {
      this.tipVisible = true;
    },
    toFixedTwo(str) {
      const tails = 2;
      if (str === 0 || str === '0' || str === '0.0' || str === '0.00') {
        return '0.'.padEnd(tails + 2, '0');
      }
      if (!str) {
        return '-'
      }

      if (str) {
        str = str.toString();
        if (isNaN(Number(str))) {
          return '-'
        }
      }
      str = Math.round(Number(str) * 100) / 100 + '';
      let pointIndex = str.indexOf(".");
      if (pointIndex === -1) {
        return str + '.'.padEnd(tails + 1, '0');
      } else {
        let tailLength = str.split('.')[1].length;
        for (let i = 0; i < (tails - tailLength); i++) {
          str += '0';
        }
        return str;
      }
    }
  }
}
</script>
<style scoped>
.clue-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  font-family: PingFang SC;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f8f8f8;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}

.clue-head {
  display: flex;
  padding: 0 0.55rem;
  height: 0.9rem;
  line-height: 0.9rem;
  justify-content: space-between;
  position: relative;
  background-color: #fff;
}

.clue-head-item {
  font-size: 0.32rem;
  color: #999;
}

.clue-name {
  padding: 0 0.2rem;
}

.clue-head-item.active {
  color: #386dbc;
  border-bottom: 0.03rem solid #386dbc;
}

.base-message-box {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
}

.base-message-content {
  width: 4.14rem;
  box-sizing: border-box;
  position: absolute;
  right: 0.2rem;
  top: 1rem;
  padding: 0.2rem 0.3rem;
  background-color: #fff;
  border-radius: 0.1rem;
}

.base-message-content p {
  font-size: 0.28rem;
  line-height: 0.3rem;
  margin-bottom: 0.24rem;
}

.base-message-content p:last-child {
  margin-bottom: 0;
}

.followStatusTips {
  display: flex;
  flex-direction: column;
  width: 80vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 0.2rem;
}
.followStatus-p::-webkit-scrollbar {
  width: 0;
  height: 5px;
}
.followStatus-p::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 6px;
}
.followStatus-p::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
.followStatus-p::-webkit-scrollbar-thumb:horizontal {
  width: 0;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
.followStatus-p {
  height: 100%;
  overflow: auto;
  margin-top: 0.2rem;
  padding-bottom: 0.4rem;
}
.followStatusTips p {
  line-height: 0.36rem;
  margin-bottom: 0.2rem;
  text-align: justify;
  font-size: 0.28rem;
}

/* 表单样式改变 */
.clue-wrapper >>> .van-cell::after {
  display: none;
}

.clue-wrapper >>> .van-field__body {
  border: 1px solid #dfdfdf;
  border-radius: 0.06rem;
  padding: 0.02rem 0.16rem;
}
.radio-field >>> .van-field__body {
  border: 1px solid #fff;
}

.clue-wrapper >>> .van-field__label {
  padding-top: 0.04rem;
}

.clue-wrapper >>> .van-field--min-height .van-field__control {
  min-height: 3.6rem;
}
</style>