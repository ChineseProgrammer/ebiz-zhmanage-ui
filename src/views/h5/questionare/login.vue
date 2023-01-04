<template>
  <div class="mobile-wrapper">
    <div class="top-part">
      <!-- <div class="head-title">登录</div> -->
    </div>
    <div class="login-wrapper">
      <div class="login-title-line">
        <div class="login-title">登录</div>
      </div>
      <div class="form-line username">
        <input type="text" class="form-input" v-model="userName" placeholder="请输入您的姓名">
        <i class="username-icon"></i>
      </div>
      <div class="form-line mobile">
        <input type="text" class="form-input" v-model="mobile" placeholder="请输入您的手机号码">
        <i class="mobile-icon"></i>
      </div>
      <div class="login-btn" :class="[disabled ? 'disabled' : '']" @click="beginAnswer">开始考试</div>
    </div>
  </div>
</template>
<script>
import { Notify } from 'vant';
export default {
  data() {
    return {
      userName: '',
      mobile: '',
      taskId: '',
      disabled: false
    }
  },
  created() {
    this.taskId = this.$route.query.taskId;
    this.getTask();
  },
  mounted() {
    document.title = "登陆";
  },
  methods: {
    getTask() {
      this.$api.oneTask({ taskId: this.taskId }).then(res => {
        console.log(res);
        if (res.data.task) {
          if (res.data.task.enable === 2) {
            this.disabled = true;
            Notify({
              type: 'warning',
              message: '考试已下架,请联系管理员!'
            })
          } else {
            this.disabled = false;
          }
        } else {
          this.disabled = true;
          Notify({
            type: 'warning',
            message: '没有这个考试,请联系管理员!'
          })
        }
      })
    },
    beginAnswer() {
      if (this.disabled) {
        Notify({
          type: 'warning',
          message: '考试已下架,请联系管理员!'
        })
        return
      }
      let phoneRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (this.userName && this.userName.trim()) {
      } else {
        Notify({ type: 'warning', message: '请输入姓名' });
        return
      }
      if (!phoneRegex.test(this.mobile)) {
        Notify({ type: 'warning', message: '请输入有效的手机号' });
        return
      }

      this.form = {
        userName: this.userName,
        mobile: this.mobile,
        task: this.taskId
      }
      console.log(this.form);
      console.log(this.$route);
      this.$api.mobileLogin(this.form).then(res => {
        console.log(res);
        if (res.data.result) {
          this.$router.push({ path: "/questionareResult", query: { logId: res.data.id, taskId: this.taskId } })
        } else {
          this.$router.push({ path: "/questionareQuestions", query: { logId: res.data.id, taskId: this.taskId } })
          // this.$router.replace({path: "/questionareQuestions", query: {logId: res.id,taskId: taskId}})
        }
      })
    },
  }
}
</script>
<style scoped>
.mobile-wrapper {
  font-family: PingFang SC;
  min-height: 100%;
  background-color: #f8f8f8;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
}

.top-part {
  height: 3.9rem;
  background-image: url(../../../assets/questionare/banner.png);
  background-size: 100% 100%;
}

.head-title {
  height: 0.88rem;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.88rem;
  text-align: center;
  font-weight: bold;
}

.login-wrapper {
  position: relative;
  top: -1.33rem;
  background: #fff;
  width: 7.06rem;
  margin: 0 auto;
  border-radius: 0.2rem;
  padding: 0 0.35rem 2.16rem;
}

.login-title-line {
  display: flex;
  padding-left: 0.27rem;
  margin-bottom: 0.25rem;
}

.login-title {
  height: 1.33rem;
  color: #386DBC;
  font-size: 0.32rem;
  line-height: 1.2rem;
  position: relative;
}

.login-title:after {
  display: block;
  content: "";
  position: absolute;
  width: 0.24rem;
  height: 0.05rem;
  background-color: #386DBC;
  left: 50%;
  margin-left: -0.12rem;
  bottom: 0.33rem;
}

.form-line {
  display: flex;
  align-items: center;
  height: 0.88rem;
  background: rgba(33, 73, 135, .1);
  border-radius: 0.44rem;
  width: 100%;
  margin: 0 auto 0.57rem;
  padding-left: 0.93rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
  position: relative;
}

.form-line i {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0.5rem;
  margin-left: -0.2rem;
  top: 50%;
  margin-top: -0.2rem;
}

.username-icon {
  background-image: url(../../../assets/questionare/user.png);
  background-position: center;
  background-size: 0.32rem 0.4rem;
  background-repeat: no-repeat;
}

.mobile-icon {
  background-image: url(../../../assets/questionare/phone.png);
  background-position: center;
  background-size: 0.27rem 0.4rem;
  background-repeat: no-repeat;
}

.login-btn {
  margin-top: 0.98rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.3rem;
  color: #fff;
  background: #386DBC;
  height: 0.88rem;
  border-radius: 0.44rem;
  cursor: pointer;
}
.login-btn.disabled{
  background-color: #ccc;
}
.form-input {
  border: 0;
  background: transparent;
  color: #386DBC;
  width: 100%;
  font-size: 0.28rem;
  line-height: 0.42rem;
  height: 0.42rem;
}
</style>