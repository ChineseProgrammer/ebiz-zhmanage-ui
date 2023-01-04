/*
 * @Author: 孙美方
 * @Date: 2021-01-12 11:30:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */
<template>
  <div id="appointment" ref="appointment">
    <van-form
      ref="form"
      @submit="validState = true"
      :show-error="false"
      class="submit-form"
    >
      <div class="block">
        <label for="">姓名</label>
        <van-field
          v-model="content.name"
          placeholder="请输入姓名"
          maxlength="10"
          class="field-rouder"
          :rules="rules.name"
        ></van-field>
      </div>
      <div class="block">
        <label for="">性别</label>
        <van-field
          v-model="sex"
          label="当前选择"
          readonly
          is-link
          placeholder="请选择性别"
          @click="sexShow = true"
          class="field-rouder"
        />
        <van-popup v-model="sexShow" round position="bottom">
          <van-picker
            show-toolbar
            :columns="sixColumns"
            @confirm="onConfirmSix"
            @cancel="onCancelSix"
            @change="onChangeSix"
          />
        </van-popup>
      </div>
      <div class="block">
        <label for="">年龄</label>
        <van-field
          v-model="content.age"
          type="digit"
          placeholder="请输入年龄"
          class="field-rouder"
          :rules="rules.age"
        ></van-field>
      </div>
      <div class="block">
        <label for=""><span class="red">*</span>所在地区</label>
        <van-field
          v-model="area"
          label="当前选择"
          readonly
          is-link
          placeholder="请选择所在地"
          @click="showArea = true"
          :rules="rules.location"
          class="field-rouder"
        />
        <van-popup v-model="showArea" round position="bottom">
          <van-picker
            show-toolbar
            :columns="options"
            @confirm="onConfirmArea"
            @cancel="onCancelArea"
            @change="onChangeArea"
          />
        </van-popup>
      </div>
      <div class="block">
        <label for=""><span class="red">*</span>手机号</label>
        <van-field
          v-model="content.phoneNumber"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          :rules="rules.phoneNumber"
          name="phoneNumber"
          class="field-rouder"
        ></van-field>
      </div>
      <div v-if="h5_verificationCode" class="block code-block">
        <van-field
          v-model="content.verificationCode"
          type="number"
          maxlength="6"
          center
          clearable
          placeholder="请输入验证码"
          :rules="rules.verificationCode"
          class="code-style"
        >
        </van-field>
        <div
         id="contentNumId"
          class="code-button"
          @click="getVerification"
          :disabled="isSendDisabled"
          :class="{colorGray:isSendDisabled}"
        >
          {{ contentNum }}
        </div>
      </div>
       <van-button
      type="default"
      size="large"
      @click="onSubmit"
      class="next"
      v-if="isButton"
      ><h4>下一步</h4></van-button
    >
    </van-form>
   
  </div>
</template>
<script>
import baseUrl from "../../api/setBaseUrl.js";
import utils from "@/lib/util.js";
import Vue from "vue";
import VueRouter from "vue-router";
import { routers } from "@/router/routers";
Vue.use(VueRouter);
export default {
  data() {
    return {
      content: {
        name: null,
        gender: 0,
        age: null,
        phoneNumber: null,
        verificationCode: null,
        location: null,
      },
      area: null,
      sex: "男",
      sexShow: false,
      sixColumns: [
        {
          text: "男",
          defaultIndex: 0,
        },
        {
          text: "女",
          defaultIndex: 1,
        },
      ],
      showArea: false,
      cascaderValue: "",
      options: [
        {
          text: "北京市",
          value: "330000",
        },
        {
          text: "天津市",
          value: "320000",
        },
      ],
      validState: false,
      rules: {
        name: [
          {
            pattern: /^([\u4e00-\u9fa5a-zA-Z]{0,20})$/,
            message: "请输入中文或英文名称",
          },
        ],
        age: [
          {
            validator: (val) => {
              if (val != "" || val) {
                return val > 0 && val <= 120;
              }
            },
            message: "请输入正确的年龄",
          },
        ],
        location: [{ required: true, message: "请选择所在地" }],
        phoneNumber: [
          { required: true, message: "请输入手机号" },
          {
            pattern: /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/,
            message: "请输入正确手机号",
          },
        ],
        verificationCode: [
          { required: true, message: "请输入验证码" },
            { pattern: /^(\d{6})$/, message: "请输入正确验证码" }  
        ],
      },
        h5_verificationCode:false,
      isButton: true,
      docmHeight: document.documentElement.clientHeight,
      showHeight: document.documentElement.clientHeight,
      isSendDisabled: false,
      contentNum: "获取验证码",
      timer: null,
      timeNum: "",
    };
  },
  created() {
    // 判断页面是否需要微信授权
    // 微店或者电子名片
    /*   console.log(this.$route)
        let active_mpauth = utils.getSessionStorage('mpauth_openId')
        if (!active_mpauth && !(this.$route.name == 'Mpauth')) {
          // 跳转认证页面
          next({
            name: 'Mpauth',
            query: { redirect:this.$route.path }
          })
          return
        }
        if (to.name == 'Mpauth') {
          next()
        } */
    const RouterConfig = {
      // mode: 'history',
      routes: routers,
    };
    const router = new VueRouter(RouterConfig);
    /*  router.beforeEach((to, from, next) => {
      let active_mpauth = utils.getSessionStorage("mpauth_openId");
      console.log(active_mpauth)
      if (!active_mpauth && !(to.name == "Mpauth")) {
        // 跳转认证页面
        next({
          name: "Mpauth",
          query: { redirect: to.fullPath },
        });
        return;
      }
      if (to.name == "Mpauth") {
        next();
      }
      LoadingBar.start();
    }); */
  },
  computed: {},
  mounted() {
       if(baseUrl.h5_verificationCode==1){
this.h5_verificationCode=true
    } else{
this.h5_verificationCode=false
    }
    this.getArea();
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })();
    };
  },
  watch: {
      'isSendDisabled'(o){
      if(o){
       document.getElementById('contentNumId').classList.add('colorGray')
      }else{
         document.getElementById('contentNumId').classList.remove('colorGray')
      }
    }
    /* showHeight: function () {
      const category = navigator.userAgent;
      const isAndroid =
        category.indexOf("Android") > -1 || category.indexOf("Adr") > -1;
      const isiOS = !!category.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        if (this.docmHeight > this.showHeight) {
          this.isButton = false;
        } else {
          this.isButton = true;
        }
      }
    }, */
  },
  created () {
    let code = this.$route.query.code
    if (code) {
      this.$api.getWxUserInfo({
        code: this.getQueryValue('code')
      }).then(r=>{
        sessionStorage.setItem('wxInfo',JSON.stringify(r))
 if (sessionStorage.getItem("wxInfo")) {
            let r = JSON.parse(sessionStorage.getItem("wxInfo"));
            zhuge.track("客户推广h5-custom-打开页面", {
              微信用户昵称: r.nickname,
              性别: r.sex,
              省份: r.province,
              城市: r.city,
              country: r.country,
            });
          }
      })
    } else{
       if (sessionStorage.getItem("wxInfo")) {
        let r = JSON.parse(sessionStorage.getItem("wxInfo"));
        zhuge.track("客户推广h5-custom-打开页面", {
          微信用户昵称: r.nickname,
          性别: r.sex,
          省份: r.province,
          城市: r.city,
          country: r.country,
        });
      }
    }
  },
  methods: {
    getQueryValue(queryName) {
      var query = decodeURI(window.location.search.substring(1))
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == queryName) {
          return pair[1]
        }
      }
      return null
    },
    onConfirmSix(value, index) {
      this.sexShow = false;
      this.content.gender = value.defaultIndex;
      this.sex = value.text;
    },
    onCancelSix() {
      this.sexShow = false;
    },
    onChangeSix(picker, value, index) {},
    onConfirmArea(value, index) {
      this.showArea = false;
      this.content.location = value.value;
      this.area = value.text;
    },
    onCancelArea() {
      this.showArea = false;
    },
    onChangeArea(picker, value, index) {},
    getArea() {
      this.$api.getArea({ relationCode: "areaCode" }).then((res) => {
        if (res.respCode == "0") {
          this.options = res.content.reverse();
          this.options = this.options.map((item) => {
            item.text = item.name;
            item.value = item.code;
            return item;
          });
          let params = window.sessionStorage.getItem("params");
          if (params) {
            this.content = JSON.parse(params);
            if (this.content.gender == 0) {
              this.sex = "男";
            } else if (this.content.gender == 1) {
              this.sex = "女";
            }
            let org = this.options.filter((item) => {
              if (item.value == JSON.parse(params).location) {
                return item;
              }
            });
            this.area = org[0].text;
          }
        } else {
          this.$toast.fail(message);
        }
      });
    },
    async checkPhone() {
      let result = false;
      await this.$refs["form"]
        .validate("phoneNumber")
        .then((res) => {
          result = true;
        })
        .catch((error) => {
          result = false;
        });
      return result;
    },
    countdown() {
      this.isSendDisabled = true;
      const timeCounbt = 60;
      this.timeNum = timeCounbt;
      this.timer = window.setInterval(() => {
        if (this.timeNum > 0 && this.timeNum <= timeCounbt) {
          this.isSendDisabled = true;
          this.timeNum--;
          this.contentNum = this.timeNum + "s后重新获取";
        } else {
          this.isSendDisabled = false;
          this.contentNum = "获取验证码";
          clearInterval(this.timer), (this.timer = null);
        }
      }, 1000);
    },
    async getVerification() {
      if (await this.checkPhone()) {
             this.isSendDisabled=true;
        let result = await this.isCheckRepeat();
        if (result == 1) {
          this.countdown();
          await this.$api
            .getVerifi({ phoneNo: this.content.phoneNumber })
            .then((res) => {
              if (res.result == 0) {
                this.$toast.success("验证码发送成功");
              } else {
                this.$toast.fail("验证码发送失败");
              }
            })
            .catch((error) => {
              this.$toast.fail(error.message);
            });
        } else if (result == 2) {
            this.isSendDisabled=false;
          this.$router.push({
            name: "custom",
            query: {
              id: 1,
            },
          });
        } else if (result == 0) {
            this.isSendDisabled=false;
          this.$toast.fail("网络异常请重试");
        }
      }
    },
    async isCheckRepeat() {
      let result = await this.$api
        .checkRepeat({ phoneNumber: this.content.phoneNumber })
        .then((res) => {
          if (res.result == 0) {
            if (res.content.result == false) {
              // 没有预约过
              return 1;
            } else {
              // 预约过
              return 2;
            }
          } else {
            return 0;
            this.$toast.fail(message);
          }
        })
        .catch((error) => {
          return 0;
          this.$toast.fail(message);
        });
      return result;
    },
    // 校验
    async checkData() {
      this.$refs["form"].submit();
      let res = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.validState) resolve(true);
          resolve(false);
        }, 5);
      });
      return res;
    },
    async checkValidate() {
      let res = await this.$api
        .checkValifi({
          phoneNo: this.content.phoneNumber,
          code: this.content.verificationCode,
        })
        .then((res) => {
          if (res.result == "0") {
            return 1;
          } else {
            return 2;
          }
        })
        .catch((error) => {
          return 0;
        });
      return res;
    },
    async onSubmit() {
      if (!(await this.checkData())) {
        return false;
      } else {
        if(this.h5_verificationCode){
            // 手机验证码通了后，校验手机验证码有没有填写，
        let isCheck = await this.checkValidate();
        if (isCheck == 1) {
          let params = this.content;
          window.sessionStorage.setItem("params", JSON.stringify(params));
          this.$router.push({
            name: "submit",
          });
        } else if (isCheck == 2) {
          this.$toast.fail("短信验证码不正确");
        } else if (isCheck == 0) {
          this.$toast.fail("网络异常请重试");
        }
        } else{
            // 现在短信验证码没通这块先保留，手机验证码通了后，校验手机验证码有没有填写，
           let isCheck = await this.isCheckRepeat();
        if (isCheck == 1) {
          let params = this.content;
          window.sessionStorage.setItem("params", JSON.stringify(params));
          this.$router.push({
            name: "submit",
          });
        } else if (isCheck == 2) {
          this.$router.push({
            name: "custom",
            query: {
              id: 1,
            },
          });
        } else if (isCheck == 0) {
          this.$toast.fail("网络异常请重试");
        }
        }
      }
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
#appointment {
  padding-top: 30%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url("../../assets/h5_background1.jpg") no-repeat;
  min-height: 600px;
  background-size: 100% 100%;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  .submit-form {
    width: 100%;
    padding: 0px 5%;
    height: 85%;
    overflow-y: auto;
    box-sizing: border-box;
    ::v-deep.van-cell {
      line-height: 20px;
      font-size: 0.95rem;
    }
    .block {
      width: 100%;
      margin-bottom: 10px;
      label {
        margin-bottom: 10px;
        .red {
          color: red;
          vertical-align: middle;
        }
      }
      .field-rouder {
        border-radius: 0px;
        margin-bottom: 0px;
        border-bottom: 1px solid #eee;
      }
      .code-style {
        width: 100%;
        display: inline-block;
        border-radius: 4px;
        padding-right: 40%;
      }
      .code-button {
        color: #ed7117;
        position: absolute;
        top: 10px;
        right: 0px;
      }
      .colorGray {
        color: rgb(187, 186, 186);
          pointer-events: none;
      }
    }
    .code-block {
      margin: 0px;
      position: relative;
      ::v-deep .van-cell:after {
        right: 0px;
        left: 0px;
      }
    }
  }
  .next {
    border-radius: 4px;
    background: rgba(237, 113, 23, 1);
    border: 2px solid rgba(237, 113, 23, 1);
    color: #fff;
    // position: absolute;
    // bottom: 5%;
    // left: 5%;
    // right: 5%;
    // width: 90%;
    z-index: 10;
    margin-top: 5%;
  }
}
</style>