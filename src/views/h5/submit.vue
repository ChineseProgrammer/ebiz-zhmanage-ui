/*
 * @Author: 孙美方
 * @Date: 2021-01-12 11:30:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */
<template>
  <div id="submit">
    <div>
      <van-form @submit="onSubmit" class="submit-form">
        <div class="block">
          <label for>1、我考虑的需求（多选）</label>
          <van-field name="checkboxGroup">
            <template #input>
              <van-checkbox-group
                v-model="questionCodes"
                direction="horizontal"
              >
                <van-checkbox
                  v-for="(item, index) in getCheckbox"
                  :key="index"
                  :name="item.questionCode"
                  shape="square"
                  >{{ item.question }}</van-checkbox
                >
              </van-checkbox-group>
            </template>
          </van-field>
        </div>
        <div class="block">
          <label for>2、保障对象（多选）</label>
          <van-field name="checkboxGroup">
            <template #input>
              <van-checkbox-group
                v-model="safeguardTarget"
                direction="horizontal"
              >
                <van-checkbox
                  v-for="(item, index) in radioArr2"
                  :key="index"
                  :name="item.value"
                  shape="square"
                  >{{ item.text }}</van-checkbox
                >
              </van-checkbox-group>
            </template>
          </van-field>
        </div>
        <div class="block">
          <label for>3、我的预算（单选）</label>
          <van-field name="checkboxGroup">
            <template #input>
              <van-radio-group v-model="budget">
                <van-radio
                  shape="square"
                  v-for="(item, index) in radioArr"
                  :name="item.value"
                  @click="select(item.value)"
                  :key="index"
                  >{{ item.text }}</van-radio
                >
              </van-radio-group>
            </template>
          </van-field>
        </div>
        <div class="block agreeChecked-block">
          <van-checkbox v-model="agreeChecked" shape="square"
            ><span class="red">*</span>我已阅读并认可<a @click="serveTcp(1)"
              >《用户服务协议》</a
            ><a @click="serveTcp(2)">《个人隐私保护政策》</a>内容</van-checkbox
          >
        </div>
      </van-form>
      <van-button
        type="default"
        size="large"
        :disabled="!agreeChecked"
        @click="onSubmit"
        class="next"
      >
        <h4>提交预约</h4>
      </van-button>
    </div>
  </div>
</template>
<script>
import $axios from "axios";
export default {
  data() {
    return {
      protect: null,
      budget: null,
      oldRadio: null,
      questionCodes: [],
      safeguardTarget: [],
      getCheckbox: [],
      agreeChecked: false,
      radioArr2: [
        {
          value: 0,
          text: "给自己",
        },
        {
          value: 1,
          text: "给父母",
        },
        {
          value: 2,
          text: "给子女",
        },
        {
          value: 3,
          text: "给配偶",
        },
      ],
      radioArr: [
        {
          value: 4,
          text: "每年5000元-1万元",
        },
        {
          value: 5,
          text: "每年1万-5万元",
        },
        {
          value: 6,
          text: "每年5万元以上",
        },
        {
          value: 3,
          text: "其他",
        },
      ],
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    serveTcp(id) {
      let a = window.location.origin;
      window.open(a + "/static/pdf/web/viewer.html?id=" + id, "_blank");
    },

    select(item) {
      if (item == this.oldRadio) {
        this.budget = null;
        this.protect = null;
        this.oldRadio = null;
      } else {
        this.oldRadio = item;
      }
    },
    init() {
      this.$api
        .getSelectList({})
        .then((res) => {
          if (res.result == "0") {
            if (res.content) {
              this.getCheckbox = res.content;
            }
          } else {
            this.$toast.fail(res.message);
          }
        })
        .catch((error) => {
          this.$toast.fail(error.message);
        });
    },
    onSubmit() {
      this.$store.commit("showLoading");
      let customerSharedReqDTO;
      if (window.sessionStorage.getItem("params")) {
        customerSharedReqDTO = JSON.parse(
          window.sessionStorage.getItem("params")
        );
      }
      if (this.questionCodes.length > 0) {
        customerSharedReqDTO.questionCodes = this.questionCodes.map((item) => {
          return item;
        });
      } else {
        customerSharedReqDTO.questionCodes = [];
      }
      if (this.safeguardTarget.length > 0) {
        customerSharedReqDTO.safeguardTarget = this.safeguardTarget.map(
          (item) => {
            return item;
          }
        );
      } else {
        customerSharedReqDTO.safeguardTarget = [];
      }
      customerSharedReqDTO.safeguardTarget = customerSharedReqDTO.safeguardTarget.join(
        ","
      );
      customerSharedReqDTO.budget = this.budget;
      customerSharedReqDTO.protect = this.protect;
      if (window.sessionStorage.getItem("userId")) {
        let userId = window.sessionStorage.getItem("userId");
        if (userId.constructor === "Object" && "external_userid" in userId) {
          customerSharedReqDTO.external_userid = userId.external_userid;
        }
      }
      let channelMsg;
      if (window.sessionStorage.getItem("wxState")) {
        channelMsg = JSON.parse(window.sessionStorage.getItem("wxState"));
      }
      if (channelMsg && channelMsg !== "") {
        if (
          window.location.href &&
          window.location.href.indexOf("?code=") > -1
        ) {
          customerSharedReqDTO.channel = channelMsg.split("/userid=")[0]; //来源渠道
          if (channelMsg.split("/userid=")[1]) {
            customerSharedReqDTO.userId = channelMsg.split("/userid=")[1]; //企业微信用户userId
          } else {
            customerSharedReqDTO.userId = null; //企业微信用户userId
          }
        } else {
          if (channelMsg && channelMsg.indexOf("&") > 0) {
            customerSharedReqDTO.channel = channelMsg
              .split("&")[0]
              .split("=")[1]; //来源渠道
            customerSharedReqDTO.userId = channelMsg
              .split("&")[1]
              .split("=")[1]; //企业微信用户userId
          } else {
            customerSharedReqDTO.channel = channelMsg.split("=")[1]; //来源渠道
            customerSharedReqDTO.userId = null; //企业微信用户userId
          }
        }
      } else {
        customerSharedReqDTO.channel = null; //来源渠道
        customerSharedReqDTO.userId = null; //企业微信用户userId
      }
      // 渠道，userid
      if (channelMsg && channelMsg.indexOf("&") > 0) {
        customerSharedReqDTO.channel = JSON.parse(JSON.stringify(channelMsg))
          .split("&")[0]
          .split("=")[1]; //来源渠道
        customerSharedReqDTO.userId = JSON.parse(JSON.stringify(channelMsg))
          .split("&")[1]
          .split("=")[1]; //企业微信用户userId
      } else if (channelMsg && channelMsg.indexOf(".") > 0) {
        customerSharedReqDTO.userId = JSON.parse(JSON.stringify(channelMsg))
          .split(".")[1]
          .split("%3D")[1]; //企业微信用户userId
        customerSharedReqDTO.channel = JSON.parse(JSON.stringify(channelMsg))
          .split(".")[0]
          .split("%3D")[1]; //来源渠道
      }
      let wxInfo;
      if (sessionStorage.getItem("wxInfo")) {
        wxInfo = JSON.parse(sessionStorage.getItem("wxInfo"));
      }
      customerSharedReqDTO.openid = wxInfo.openid;
      customerSharedReqDTO.nickname = wxInfo.nickname;
      customerSharedReqDTO.sex = wxInfo.sex;
      customerSharedReqDTO.province = wxInfo.province;
      customerSharedReqDTO.city = wxInfo.city;
      customerSharedReqDTO.country = wxInfo.country;
      customerSharedReqDTO.headimgurl = wxInfo.headimgurl;
      customerSharedReqDTO.privilege = wxInfo.privilege;
      customerSharedReqDTO.unionid = wxInfo.unionid;
      customerSharedReqDTO.extendPage = "custom"; // 页面区分
      console.log(customerSharedReqDTO);
      this.$api
        .submitAppointment(customerSharedReqDTO)
        .then((res) => {
          this.$store.commit("hideLoading");
          if (res.result == "0") {
            zhuge.track("客户推广h5-custom-提交信息", {
              "微信用户昵称": wxInfo.nickname,
              "微信性别": wxInfo.sex,
              "省份": wxInfo.province,
              "城市": wxInfo.city,
              "国家": wxInfo.country,
              "客户姓名": customerSharedReqDTO.name,
              "性别": customerSharedReqDTO.gender,
              "年龄": customerSharedReqDTO.age,
              "所在地区": customerSharedReqDTO.location,
              "手机号": customerSharedReqDTO.phoneNumber,
              "推广页面": customerSharedReqDTO.extendPage,
            });
             this.timeNum= ""
            window.sessionStorage.removeItem("params");
            this.$router.push({
              name: "custom",
              query: {
                id: 2,
              },
            });
          } else {
            this.$toast.fail(res.message);
          }
        })
        .catch((error) => {
          this.$store.commit("hideLoading");
          this.$toast.fail(error.message);
        });
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
#submit {
  padding-top: 30%;
  width: 100%;
  position: relative;
  background: url("../../assets/h5_background1.jpg") no-repeat;
  min-height: 600px;
  background-size: 100% 100%;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  .submit-form {
    padding: 0px 5%;
    width: 100%;
    box-sizing: border-box;
    padding-top: 15px;
    .block {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      label {
        margin-bottom: 10px;
      }
      .field-rouder {
        border-radius: 4px;
        margin-top: 10px;
      }
      ::v-deep .van-cell {
        background: transparent;
        padding: 10px 0px;
        font-size: 0.95rem;
        .van-icon {
          background: #fff;
        }
        .van-checkbox__icon--checked .van-icon,
        .van-radio__icon--checked .van-icon {
          color: #fff;
          background-color: #1989fa;
          border-color: #1989fa;
        }
        .van-radio-group {
          width: 100%;
          .van-radio {
            width: 50%;
            float: left;
            margin-bottom: 10px;
          }
        }
        .van-checkbox {
          margin-bottom: 10px;
        }
      }
    }
    .agreeChecked-block {
      margin-bottom: 10px;
      margin-top: 20px;
      bottom: 5%;
      width: 90%;
      left: 5%;
    }
  }
  .next {
    border-radius: 4px;
    margin-bottom: 37px;
    background: rgba(237, 113, 23, 1);
    border: 2px solid rgba(237, 113, 23, 1);
    color: #fff;
    border-width: 2px;
    bottom: 5%;
    left: 5%;
    right: 5%;
    width: 90%;
  }
}
</style>