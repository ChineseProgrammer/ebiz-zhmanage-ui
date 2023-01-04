<style lang="less" scoped>
@import "../style/login.less";
@import "../style/iconfont.css";

.ivu-form-item-error {
  margin-bottom: 34px !important;
}
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="top-area">
      <h1>综合管理系统</h1>
    </div>
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <!-- <FormItem v-show="!isShow" prop="userName"> -->
            <FormItem prop="userName">
              <Input
                v-model="form.userName"
                placeholder="请输入用户名"
              >
                <span slot="prepend">
                  <Icon type="ios-person-outline" :size="16" />
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
              >
                <span slot="prepend">
                  <Icon type="ios-lock-outline" size="14" />
                </span>
              </Input>
            </FormItem>
            <FormItem prop="verificationCode" >
              <Row>
                <Col span="17">
                  <Input
                    v-model="form.verificationCode"
                    placeholder="请输入验证码"
                  >
                    <span slot="prepend">
                      <Icon type="ios-cog-outline" size="14" />
                    </span>
                  </Input>
                </Col>
                <Col span="7">
                  <div
                    id="contentNumId"
                    class="code-button"
                    @click="getVerification"
                    :disabled="isSendDisabled"
                    :class="{ colorGray: isSendDisabled }"
                  >
                    {{ contentNum }}
                  </div>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
            <!-- <small @click="isShow = !isShow">{{
              !isShow ? "短信验证码登录" : "账号密码登录"
            }}</small> -->
          </Form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
    <!-- <div class="foot">
              <div  class="content">
                  <p>易 商 阜 极</p>
              </div>
        </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      isSendDisabled: false,
      contentNum: "获取验证码",
      companyList: [],
      form: {
        password: "",
        userName: "",
        manageCode: "",
        verificationCode: "",
        systemType: "0",
        phoneNumber: "",
      },
      codeUrl: "/api/usermanage/getcode?" + new Date().getTime(),
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          // { pattern:"^[a-zA-Z0-9]{1,20}$", message: '用户名为1-20位字符，包含数字、字母（区分大小写）！',trigger:'blur'}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          //{ pattern:"^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$", message: '密码必须包含大小写字母，特殊字符，数字的正则8~20位',trigger:'blur'}
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号" },
          {
            pattern:
              /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/,
            message: "请输入正确手机号",
          },
        ],
        verificationCode: [
          { required: true, message: "请输入验证码" },
          { pattern: /^(\d{6})$/, message: "请输入正确验证码" },
        ],
        // manageCode: [
        //     { required: true, message: '请输选择系统', trigger: 'blur' },
        //     // { pattern:"^[a-zA-Z0-9]{6,20}$", message: '密码必须包含大小写字母，特殊字符，数字的正则8~20位',trigger:'blur'}
        // ],
        //  verificationCode: [
        //     { required: true, message: '请输入验证码', trigger: 'blur' },
        // ]
      },
    };
  },
  mounted() {
    /*  this.getCompany();
    this.getCompany2() */
    //  window.sessionStorage.setItem("systemType","0");
  },
  watch: {
    isSendDisabled(o) {
      if (o) {
        document.getElementById("contentNumId").classList.add("colorGray");
      } else {
        document.getElementById("contentNumId").classList.remove("colorGray");
      }
    },
  },
  methods: {
    //获取当前人--手机号
    getUserInfoByUserName(userName) {
      if (!userName) {
        return false;
      } else {
        this.$api
          .getUserInfoByUserName({ userName: userName })
          .then((res) => {
           return res
          })
          .catch((error) => {
            this.$Message.error(error.message);
          });
      }
    },
    async checkPhone() {
      let result = false;
      await this.$refs.loginForm
        .validate("phoneNumber")
        .then((res) => {
          result = res;
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
        this.isSendDisabled = true;
        this.countdown();
        await this.$api
          .getUserInfoByUserName({ userName: this.form.userName})
          .then((res) => {
            if (res.result == 0) {
              this.$Message.success("验证码发送成功");
            } else {
              this.$Message.error("验证码发送失败");
            }
          })
          .catch((error) => {
            this.$Message.error(error.message);
          });
    },
    // 校验
    async checkData() {
      this.$refs.loginForm.submit();
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
          code: this.form.verificationCode,
        })
        .then((res) => {
          if (res && res.result == "0") {
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
    getCompany(code) {
      this.$api
        .test_get({
          str: "朱文丽",
        })
        .then((res) => {
          console.log(res);
          if (res.respCode == 0) {
          } else {
            this.$Message.error(res.resultMessage);
          }
        });
    },
    getCompany2(code) {
      this.$api
        .test_post({
          age: 18,
          name: "朱文丽",
        })
        .then((res) => {
          console.log(res);
          if (res.respCode == 0) {
          } else {
            this.$Message.error(res.resultMessage);
          }
        });
    },
    // 提交登录
    handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          //账号密码登录
          // if (!this.isShow && this.form.userName && this.form.password) {
          //   this.toLogin();
          // } else if (
          //   this.isShow &&
          //   this.form.verificationCode &&
          //   this.form.phoneNumber
          // ) {
          //   this.toLogin();
          //  /*  // 手机验证码通了后，校验手机验证码是否正确，
          //   let isCheck = this.checkValidate();
          //   if (isCheck == 1) {
          //     //手机验证码登录
          //     this.toLogin();
          //   } else if (isCheck == 2) {
          //     this.$Message.error("短信验证码不正确");
          //   } else if (isCheck == 0) {
          //     this.$Message.error("网络异常请重试");
          //   } */
          // }
          if (valid) {
            this.toLogin();
          }
        });
    },
    refreshCode() {
      this.codeUrl = "/api/usermanage/getcode?=" + new Date().getTime();
    },
    // 请求登录接口
    toLogin() {
      //
      var self = this;
      //实例化JSEncrypt
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCzJG4x0fX1EempsNyl25ztMuSRkltP/GqhBt+8SWksNEIsmK39tI1gc+XS7V2vJSJwiNz7EL69dNmU1d4xmUcurDxW99Z691ihruM02i3wD/cm1D1sKuXnC/bm6TYu/vst4HkOFsMdHdXqrmd7zrsETxjKgBJ7UMH1HywH8ScitQIDAQAB"
      );
      let systemType = window.sessionStorage.getItem("systemType") || 0;
      this.form.systemType = systemType;
      //判断是账号密码登录还是短信验证码登录
      let form = {},
        method = "",
        outParams = "";
      /*  if (this.isShow) {
        form.mobileNo = this.form.phoneNumber;s
         form.password = this.form.verificationCode;
        method = "mobileLogin";
        outParams = form;
      } else { */
      form.mobileNo = this.form.phoneNumber;
      form.verificationCode = this.form.verificationCode;
      form.userName = this.form.userName;
      form.password = this.form.password;
      form = encrypt.encrypt(JSON.stringify(form));
      method = "login";
      outParams = { secret: form };
      /*   } */
      sessionStorage.setItem("menu", "home");
      this.$api[method](outParams)
        .then((res) => {
          console.log(res);
          if (res.respCode == 0) {
            // self.$Message.info("登录成功");
            window.sessionStorage.setItem("sid", res.content.sid);
            if (res.content.loginRecordDTO) {
              if (res.content.loginRecordDTO.loginType == 1) {
                res.content.loginRecordDTO.loginType = "短信登录";
              } else {
                res.content.loginRecordDTO.loginType = "口令登录";
              }
              window.sessionStorage.setItem(
                "loginRecordDTO",
                JSON.stringify(res.content.loginRecordDTO)
              );
            }

            this.$api.getUserInfo(res.content.sid).then((result) => {
              window.sessionStorage.setItem(
                "username",
                result.content.userName
              );
              window.sessionStorage.setItem("userId", result.content.id);
              // this.$api
              //   .user_info({userId:result.content.id})
              //   .then((content) => {
              this.$api.user_info({}).then((content) => {
                if (content.result == 0) {
                  window.sessionStorage.setItem(
                    "systemType",
                    content.content.userRoleInSyses[0].systemType
                  );
                  window.sessionStorage.setItem(
                    "role",
                    content.content.userRoleInSyses[0].roleId
                  );
                  self.$router.push({
                    name: "home",
                  });
                } else {
                  this.$Message.error(content.message);
                }
              });
            });
          } else {
            self.$Message.error("登录失败:" + res.message);
            self.refreshCode();
          }
        })
        .catch((error) => {
          self.refreshCode();
          console.log(error);
        });
    },
  },
};
</script>
<style lang="less">
#contentNumId {
  cursor: pointer;
  text-align: center;
}
.colorGray {
  color: rgb(187, 186, 186);
  pointer-events: none;
}
.form-con small {
  right: 16px;
  position: absolute;
  bottom: 10px;
  cursor: pointer;
}
</style>
