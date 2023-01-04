
/*
 * @Author: 孙美方
 * @Date: 2021-01-12 11:30:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */
 <template>
  <div
    id="home"
    :class="{
      setHeight: isHeight,
      noHeight: !isHeight,
      isback: isAlready || isSuccess,
    }"
  >
    <div v-if="!isAlready && !isSuccess" class="block-img">
      <img src="../../assets/h5_home.jpg" alt class="home-img" />
    </div>
    <img
      src="../../assets/h5_button.png"
      alt
      @click="beginAppointment"
      v-if="!isAlready && !isSuccess"
      zhclickable="true"
      class="submit-img"
    />
    <div class="already-style" v-if="isAlready">
      <h6 class="van-hairline--bottom already-content">
        您已经提交过预约申请，请勿重复提交
      </h6>
      <h4 class="already-know" @click="alreadyKnow">知道了</h4>
    </div>
    <div class="success" v-if="isSuccess">
      <img src="../../assets/success.png" alt />
      <h2 class="success-title">预约成功</h2>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isHidden: {
      default: Boolean,
      default: false,
    },
  },
  data() {
    return {
      thisPage: "-1",
      isAlready: false,
      isSuccess: false,
      isHeight: false,
    };
  },
  created() {
    // // 主要是为了在点了按钮跳转回来直接拿信息跳转路由
    // let that = this
    // let code = this.$route.query.code
    // if(code){
    //   code = this.getQueryValue('code')
    //   // this.$api.getWxUserInfo({
    //   //   code
    //   // }).then(r=>{
    //     // sessionStorage.setItem('wxInfo',JSON.stringify(r))
    //     sessionStorage.setItem('wxInfo','123')
    //     that.beginAppointment()
    //   // })
    // }
  },
  computed: {},
  mounted() {
    let thisSize = window.location.href.indexOf("?id="),
      thisPage;
    if (thisSize > 0) {
      thisPage = window.location.href.split("?id=")[1];
      this.init(thisSize, thisPage);
    } else {
      this.isAlready = false;
      this.isSuccess = false;
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "custom") {
        if ("id" in to.query) {
          this.isAlready = to.query.id == 1 ? true : false;
          this.isSuccess = to.query.id == 2 ? true : false;
          if (this.isAlready || this.isSuccess) {
            this.isHeight = true;
          }
        } else {
          this.isAlready = false;
          this.isSuccess = false;
          this.isHeight = false;
        }
      }
    },
  },
  methods: {
    beginAppointment() {
      let that = this;
      let wxState =
        window.location.href.indexOf("?") > 0
          ? window.location.href.split("?")[1].split("&").join(".")
          : "STATE";
      // 未授权
      if (!sessionStorage.getItem("wxInfo")) {
        let url = process.env.VUE_APP_CALLBACKURL + "/appointment";
        let appid = process.env.VUE_APP_APPID;
        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&response_type=code&scope=snsapi_userinfo&redirect_uri=${url}&state=STATE#wechat_redirect`
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&response_type=code&scope=snsapi_userinfo&redirect_uri=${url}&state=${wxState}#wechat_redirect`;
      } else {
        that.$router.push("/appointment");
      }
    },
    getQueryValue(queryName) {
      var query = decodeURI(window.location.search.substring(1));
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) {
          return pair[1];
        }
      }
      return null;
    },
    init(newVal, id) {
      if (newVal > 0) {
        if (id == 1) {
          this.isAlready = true;
          this.isHeight = true;
          setTimeout(() => {
            this.$router.push({ name: "custom", query: {} });
          }, 2000);
        } else if (id == 2) {
          this.isSuccess = true;
          this.isHeight = true;
          setTimeout(() => {
            this.$router.push({ name: "custom", query: {} });
          }, 2000);
        } else {
          this.isHeight = false;
        }
      } else {
      }
    },
    alreadyKnow() {
      this.isAlready = false;
      this.$router.push({ name: "custom", query: {} });
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
#home {
  width: 100%;
  position: relative;
  .block-img {
    height: auto;
    overflow: scroll;
  }
  .home-img {
    width: 100%;
    height: 100%;
    background-attachment: fixed;
  }
  .submit-img {
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 100;
    left: 0px;
  }
  .appointment-begin-title {
    position: absolute;
    top: 20%;
    color: rgb(102, 102, 102);
    font-size: 2rem;
    left: 50%;
    margin-left: -3rem;
  }
  .appointment-begin {
    position: absolute;
    bottom: 20%;
    left: 50%;
    margin-left: -100px;
    width: 200px;
    border-radius: 4px;
    border-width: 2px;
  }
  .already-style {
    background: rgba(242, 242, 242, 0.67843137254902);
    border-radius: 4px;
    width: 90%;
    position: absolute;
    z-index: 1000;
    text-align: center;
    top: 50%;
    margin-top: -75px;
    margin-left: 5%;
    .already-content {
      height: 100px;
      line-height: 100px;
      font-size: 0.8rem;
    }
    .already-know {
      color: rgb(0, 194, 0);
      height: 50px;
      line-height: 50px;
      border: 0px;
      font-size: 1rem;
    }
  }
  .success {
    color: #48a708;
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 50%;
    margin-left: -64px;
    margin-top: -80px;
    text-align: center;
    .success-title {
      margin: 0 auto;
    }
  }
}
.setHeight {
  height: 100% !important;
}
.noHeight {
  height: auto !important;
}
.isback {
  width: 100%;
  height: 100%;
  position: relative;
  background: url("../../assets/h5_background1.jpg") no-repeat;
  min-height: 600px;
  background-size: 100% 100%;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
}
</style>