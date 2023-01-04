<style lang="less">
@import "../style/home.less";
</style>

<template>
  <div class="home text-center v-middle">
         <Modal
      v-model.trim="modelShow"
      :title="modewlTitle"
      :loading="true"
      :closable="false"
      :mask-closable="false"
    >
      <Form
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row :gutter="20">
          <Col span="24">
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
        </Row>
      </Form>
      <div slot="footer">
          <div id="button" class="mb-10">
          <Button
            @click="loginOut"
            class="ivu-btn ivu-btn-primary"
            >取消
          </Button>
          <Button
            @click="submit('formData')"
            class="ivu-btn ivu-btn-primary"
            >确定
          </Button>
        </div>
      </div>
    </Modal>
     <img class="homeImg mt60" alt="" src="../assets/home.png" />
    <div class="fs20 fwb mv20">欢&nbsp;&nbsp;迎&nbsp;&nbsp;访&nbsp;&nbsp;问&nbsp;&nbsp;综&nbsp;&nbsp;合&nbsp;&nbsp;管&nbsp;&nbsp;理&nbsp;&nbsp;系&nbsp;&nbsp;统&nbsp;&nbsp;！</div>
  </div>
</template>

<script>
import { removeWatermark, setWaterMark } from '@/lib/watermark.js'
// @ is an alias to /src
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
      modewlTitle:'',
       modelShow:false,
       cancelBtn:false,
       formData: {},
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
            pattern: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,     
            message:
              "密码必须包含大小写字母，特殊字符，数字的正则8~20位",
            trigger: "blur",
          },
        ],
        againPassword: [ { required: true, message: "请输入新密码", trigger: "blur" },{ validator: validatePassCheck, trigger: "blur" }],
      },
      dateType: 0
    };
  },
  mounted: function() {
    const timeOne = new Date()
      const year = timeOne.getFullYear()
      let month = timeOne.getMonth() + 1
      let day = timeOne.getDate()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      const NOW_MONTHS_AGO = `${year}-${month}-${day}`
   let username = window.sessionStorage.getItem("username");
    setWaterMark(username, NOW_MONTHS_AGO,'')
  },
  methods: {
    checkPasswordSecurity() {
      this.$api.checkPasswordSecurity().then((res) => {
        if (res.ok || res.respCode == 0) {
          if(!res.content.security){
             //false时候弹出修改密码弹框
            this.modelShow=true
            this.modewlTitle="由于您的密码过于简单，存在安全隐患，请修改密码"
            //用户登录时，如密码已处于失效状态（已过失效期），则强制用户更换密码，更换密码成功后，登录成功，否则无法登录。
          } else if(res.content.validity<0){
             this.modewlTitle="密码已处于失效状态，存在安全隐患，请修改密码"
              this.modelShow=true
          } else if((0<=res.content.validity)&&(res.content.validity<15)){
             //1.增加密码有效期，有效期6个月，用户登录时，如密码距离失效期小于等于15天，则提示用户更换密码（非强制）。
              this.modewlTitle="此密码还有"+res.content.validity+"天将失效，存在安全隐患，请修改密码"
              this.modelShow=true
              this.cancelBtn=true;
          }
        }
      });
    },
     loginOut(){
       if(!this.cancelBtn){
         this.$api.loginOut({sid:sessionStorage.getItem('sid')}).then(res=>{
                    if(res.respCode == 0){
                        sessionStorage.setItem("sid", '');
                        sessionStorage.removeItem("systemType")
                        this.$router.push({ path:'/login',});
                    }else{
                        this.$Message.error(res.message)
                    }
                })
       } else{
         this.modelShow=false
       }
    },
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formData.userId = sessionStorage.userId;
          this.formData.userName = window.sessionStorage.getItem("username");
          this.$api.personal_change_password(this.formData).then((res) => {
            if (res.respCode == "0") {
              this.$Message.success("修改成功，请重新登录");
               sessionStorage.setItem("sid", '');
                        sessionStorage.removeItem("systemType")
                        this.$router.push({ path:'/login',});
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
    dateChange: function(date1, date2) {
      this.dateType = 0;
    }
  },
  created(){
        //判断当前用户检测密码是否安全
this.checkPasswordSecurity()
  }
};
</script>
<style lang="less" scoped>
.home{
  height:540px;
  // display: table-cell;
	// 	vertical-align: middle;
	// 	text-align: center;
}
.homeImg{
  width: 250px !important;
}
</style>
