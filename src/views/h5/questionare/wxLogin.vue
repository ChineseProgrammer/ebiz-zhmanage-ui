<template>
  <div class="login">
    <van-empty v-if="loadingText" :description="loadingText" />
    <van-skeleton v-else title :row="3" style="margin-top: 1rem;" />
  </div>
</template>
<script>
// import Cookies from "js-cookie";
// import { encrypt, decrypt } from '@/utils/jsencrypt'
import { Notify,Skeleton,Empty } from 'vant';

export default {
  name: "login",
  components: [Skeleton,Empty],
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        uuid: "",
        type: 1
      },
      redirect: undefined,
      wxwebLoginScheme: false,
      loadingText: "",
    };
  },
  created() {
    // this.getCookie();
    document.title = "考试";
    this.handleLogin()
  },
  methods: {
    // getCookie() {
    //   const username = Cookies.get("username");
    //   const password = Cookies.get("password");
    //   const rememberMe = Cookies.get('rememberMe')
    //   this.loginForm = {
    //     username: username === undefined ? this.loginForm.username : username,
    //     password: password === undefined ? this.loginForm.password : decrypt(password),
    //     rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    //   };
    // },
    handleLogin() {
      console.log("href == ", location.href);
      let userId = sessionStorage.getItem("userId");
      if(userId){
        let state = this.getState();
        this.loginSuccessed(userId,state);
      } else {
        if (location.href.indexOf("code=") >= 0) {
          let code = location.href.substring(
            location.href.indexOf("code=") + 5,
            location.href.indexOf("&state=")
          );
          let state = this.getState();
          console.log("code: ", code, "state: ", state);
          this.getwxworkInfoByCode(code,state);
        } else {
          this.askWxworkOAuth();
        }
      }
    },
    getState(){
      let search = location.search;
      console.log("search: ",search);
      let state = 'wxState';
      if(search){
        search = search.substring(1,search.length);
        let searchs = search.split("&");
        for (let i = 0; i < searchs.length; i++) {
          const element = searchs[i].split('=');
          console.log(element);
          if(element[0] === 'state'){
            state = element[1];
          }
        }
      }
      return state;
    },
    askWxworkOAuth() {
      let REDIRECT_URI = process.env.VUE_APP_CALLBACKURL + "/wxLogin";
      let state = this.getState();
      REDIRECT_URI = encodeURIComponent(REDIRECT_URI);
      let href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.VUE_APP_EXAMINATION_APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
      console.log("href", href);
      window.location.replace(href);
    },
    getwxworkInfoByCode(code, state) {
      this.$api.wxworkInfoByCode({ code: code }).then((res) => {
        console.log("getwxworkInfoByCode", res);
        let userId = res.data.userid;
        sessionStorage.setItem("userId",userId);
        if (userId) {
          this.loginSuccessed(userId, state);
        } else {
          this.loginFailed();
        }
      }).catch(err => {
        this.loginFailed();
      });
    },
    loginSuccessed(userId, state){
      if(state === 'clue'){
        this.$router.push({ path: '/clueList', query: { userId: userId } })
      } else {
        this.$router.push({ path: '/questionareHome', query: { userId: userId } })
      }
    },
    loginFailed() {
      let _this = this;
      Notify({
        type: 'warning',
        message: '登陆失败!',
        onClose(){
          _this.loadingText = '登陆失败'
          window.history.go(-2);
        }
      })
    }
  },
};
</script>
<style scoped>
</style>