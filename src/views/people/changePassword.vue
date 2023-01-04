<template>
  <div id="peopleList" class="only-content">
    <div>
      <Form
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row :gutter="20">
          <Col span="12">
            <Col span="12">
              <FormItem label="旧密码" prop="oldPassword">
                <Input
                  type="password"
                  placeholder="请输入旧密码"
                  v-model="formData.oldPassword"
                />
              </FormItem>
              <FormItem label="新密码" prop="newPassword">
                <Input
                  type="password"
                  placeholder="请输入新密码"
                  v-model="formData.newPassword"
                />
              </FormItem>
              <FormItem label="再次输入密码" prop="againPassword">
                <Input
                  type="password"
                  placeholder="再次输入密码"
                  v-model="formData.againPassword"
                />
              </FormItem>
            </Col>
          </Col>
        </Row>
        <div id="button" class="mb-10">
          <Button
            @click="$router.back(-1)"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;margin-left: 3px"
            >取消
          </Button>
          <Button
            @click="handleSubmit('formData')"
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
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请确认密码"));
      } else if (value !== this.formData.newPassword) {
        callback(new Error("两次输入密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    const validateAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      // 模拟异步验证效果
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      formData: {},
      formCustom: {
        passwd: "",
        passwdCheck: "",
        age: "",
      },
      ruleValidate: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
         /*  {
            // pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
            pattern: /^[0-9A-Za-z]{6,20}$/,
            message:
              "密码为6-20位字符，包含数字、字母（区分大小写），请重新输入",
            trigger: "blur",
          }, */
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            //^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$
            pattern: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,        
            message:
              "密码必须包含大小写字母，特殊字符，数字的正则8~20位",
            trigger: "blur",
          },
        ],
        againPassword: [{ validator: validatePassCheck, trigger: "blur" }],
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        agreementStartTime: [{ validator: validatePassCheck, trigger: "blur" }],
        age: [{ validator: validateAge, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData.userId = sessionStorage.userId;
          this.formData.userName = window.sessionStorage.getItem("username");
          this.$api.personal_change_password(this.formData).then((res) => {
            if (res.respCode == "0") {
              this.$Message.success("修改成功，请重新登录");
              window.sessionStorage.setItem("systemType", "0");
              window.sessionStorage.setItem("role", "");
              window.sessionStorage.setItem("username", "");
              this.$router.push({
                name: "login",
              });
            } else {
              this.$Message.error(res.message);
            }
          });
          // this.$Message.success('提交成功!');
        } else {
          // this.$Message.error('表单验证失败!');
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    toChangePassword() {
      this.$router.push("change-Password");
    },
    toHome() {
      this.$router.push("home");
    },
  },
};
</script>

<style lang="less" scoped>
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
  /deep/ .ivu-form-item-error-tip{
    width: 600px;
  }
  margin-top: 10px;
  margin-left: 30%;

  #button {
    margin-left: 9%;
  }
  .ivu-form-item-error {
    margin-bottom: 20px;
  }
}
</style>
