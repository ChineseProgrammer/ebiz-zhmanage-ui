/*
 * @Author: 孙美方
 * @Date: 2021-01-12 11:30:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */
 <template>
  <!--  -->
  <div id="app" :style="{ height: bodyHeight + 'px' }">
    <Loading v-show="LOADING"></Loading>
  <!--   <span class="index-img-title" v-if="isHidden">我要预约</span> -->
    <!-- <div class="black" @click="back" v-if="isHidden">
      <h4>返回</h4>
    </div> -->
    <my-router-view
      :isHidden="isHidden"
      class="app-content"
      @touchstart.stop.prevent="touchSatrt"
      @touchmove.stop.prevent="touchmove"
      @touchend.stop.prevent="touchend"
    ></my-router-view>
  </div>
</template>
<script>
import Loading from "../../components/vant/loading.vue";

import wechatUtil from "../../components/vant/wechatUtil";
export default {
  data() {
    return {
      isHidden: false,
      startX: null,
      startY: null,
      x: null,
      y: null,
      aboveY: 0,
      inner: document.getElementsByTagName("body")[0],
      bodyHeight: null,
    };
  },
  beforeCreate() {},
  created() {
    const category = navigator.userAgent;
    const isAndroid =
      category.indexOf("Android") > -1 || category.indexOf("Adr") > -1;
    const isiOS = !!category.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
      this.bodyHeight = document.body.clientHeight;
    }
    if (isiOS) {
      this.bodyHeight = "100%";
    }

    let wxLen = window.location.href.indexOf("?code=");
    if (wxLen > 0) {
      let splitArr = window.location.href.substring(wxLen + 6).split("&");
      let wxCode = splitArr[0];
      // this.init(wxCode);
      let thisParams = splitArr[1].split("#")[0].split("state=")[1]; //参数（来源渠道/企业微信用户userId）
      window.sessionStorage.setItem("wxState", JSON.stringify(thisParams));
    } else if (
      window.location.href.indexOf("channel=") > 0 ||
      window.location.href.indexOf("&userid=") > 0
    ) {
      let thisParams = window.location.href.split("?")[1];
      window.sessionStorage.setItem("wxState", JSON.stringify(thisParams));
    }
  },
  computed: {
    LOADING() {
      return this.$store.state.LOADING;
    },
  },
  watch: {
    $route(to, from) {
      if (to.name != "customerAssignment") {
        this.isHidden = true;
      } else {
        if ("id" in to.query) {
          this.isHidden = to.query.id == 2 ? true : false;
        } else {
          this.isHidden = false;
        }
      }
    },
  },
  mounted() {
    let thisUrl = window.location.href;
    console.log(thisUrl,111)
    if (thisUrl.indexOf("customerAssignment") < 0) {
      this.isHidden = true;
    } else {
      let thisSize = thisUrl.indexOf("?id=");
      if (thisSize > 0) {
        this.isHidden = thisUrl.split("?id=")[1] == 2 ? true : false;
      } else {
        this.isHidden = false;
      }
    this.beginAppointment()
    }
  },
  methods: {
    //微信链接
     beginAppointment() {
      let that = this
      let wxState = window.location.href.indexOf('?')>0?window.location.href.split("?")[1].split('&').join('.'):'STATE';
      // 未授权
      if (!sessionStorage.getItem('wxInfo')) {
        let url = process.env.VUE_APP_CALLBACKURL+'/customerAllot'
          let appid = process.env.VUE_APP_APPID
        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&response_type=code&scope=snsapi_userinfo&redirect_uri=${url}&state=STATE#wechat_redirect`
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&response_type=code&scope=snsapi_userinfo&redirect_uri=${url}&state=${wxState}#wechat_redirect`
      }else{
        that.$router.push("/customerAllot");
      }
    },
    initWx() {
      wechatUtil.init().then((wx, res) => {});
    },
    init(code) {
      let reqData = {
        wxcode: code,
      };
      this.$api
        .ceshi(reqData)
        .then((res) => {
          if ("userid" in res || "external_userid" in res) {
            window.sessionStorage.setItem("userId", JSON.stringify(res));
            this.initWx();
          } else {
            this.$Message.error("服务器调用失败，请重新访问");
          }
        })
        .catch((error) => {
          window.sessionStorage.setItem("userId", null);
        });
    },
    touchSatrt(e) {
      e.preventDefault();
      var touch = e.touches[0];
      this.startY = touch.pageY;
    },
    touchMove(e) {
      e.preventDefault();
      var touch = e.touches[0];
      y = touch.pageY - this.startY;
      this.inner.style.top = this.aboveY + y + "px";
    },
    touchEnd(e) {
      e.preventDefault();
      this.aboveY = parseInt(this.inner.style.top);
    },
    back() {
      // 判断当前页面
      let thisPage = window.location.href;
      // 预约成功返回首页
      if (thisPage.indexOf("customerAssignment") > 0) {
        window.sessionStorage.removeItem("params");
        this.$router.push({ name: "customerAssignment", query: {} });
      } else {
        this.$router.back(-1);
      }
    },
  },
  components: { Loading, wechatUtil },
};
</script>
<style lang="less">
body {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
div::-webkit-scrollbar {
  width: 0;
}
#app {
  width: 100% !important;
  height: 100% !important;
  overflow-x: hidden;
  font-size: 1rem;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  min-height: 600px;
  background-size: 100% 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  overflow-y: scroll;
  .index-img-title {
    position: absolute;
    top: 3.7%;
    left: 50%;
    margin-left: -2.4rem;
    text-align: center;
    font-size: 1.2rem;
    color: #fff;
    font-weight: bold;
    z-index: 1000;
  }
  .black {
    position: absolute;
    margin: 4% 0px 0px 0px;
    height: 30px;
    border-radius: 4px;
    background: transparent;
    color: #fff;
    border-width: 2px;
    z-index: 1000;
    padding: 0px 10px !important;
  }
  .app-content {
    color: rgb(30, 30, 30);
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>