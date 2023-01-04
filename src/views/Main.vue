<template>
  <div class="layout">
    <Alert v-if="loginRecordDTO.osName" class="alertStyle" style="box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
    background: #fff;z-index:999999;
    border: none;
    position: absolute;
    right: 27px;
    bottom: 10px;" type="warning" closable>
      上次登录信息
      <template slot="desc">
        <Form :label-width="100">
          <FormItem label="操作设备：">
            {{ loginRecordDTO.osName }}
          </FormItem>
          <FormItem label="操作系统：">
            {{ loginRecordDTO.osVersion }}
          </FormItem>
          <FormItem label="IP：">
            {{ loginRecordDTO.ip }}
          </FormItem>
          <FormItem label="上次登录时间：">
            {{ loginRecordDTO.loginDate }}
          </FormItem>
          <FormItem label="上次登录方式：">
            {{ loginRecordDTO.loginType }}
          </FormItem>
        </Form>
      </template>
    </Alert>
    <Layout>
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model.trim="isCollapsed">
        <div class="menu-head">
          <img src="../assets/logo.png" class="w125 mt10" v-if="!isCollapsed" />
          <img src="../assets/logoImg1.png" v-if="isCollapsed" class="w40" />
        </div>
        <siderMenu :menuList="menuList" :shrink="isCollapsed" :openNames="openNames" theme="dark">
        </siderMenu>
      </Sider>
      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{ margin: '0 20px' }" type="md-menu"
            size="24"></Icon>
          <breadcrumbNav :currentPath="currentPath"></breadcrumbNav>
          <div class="hearder-person">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <span>{{ roleName }}</span>
              <Dropdown transfer trigger="click" @on-click="handleDropMenuClick"
                style="vertical-align: middle; height: 24px; line-height: 26px">
                <a href="javascript:void(0)" style="height: 24px">
                  <img class="logo" src="../assets/logoImg2.png" alt="" />
                  <span class="main-user-name" style="color: #fff; margin-right: 20px; height: 24px">{{ roleName
                  }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="0">{{
                      $t("route.editorPassword")
                  }}</DropdownItem>
                  <DropdownItem name="1" divided>{{
                      $t("route.out")
                  }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!--<Avatar :src="logoIcon2" style="background: #619fe7;margin-left: 10px;"></Avatar>-->
            </Row>
          </div>
        </Header>
        <div class="main-content">
          <Content :style="{ margin: '10px', background: '#fff', minHeight: '260px' }">
            <Card dis-cover dis-hover>
              <div class="ivu-card-head" v-if="cardTitle" style="margin-bottom: 10px; margin-top: -10px">
                <p slot="title" v-if="cardTitle" class="title">
                  {{ cardTitle }}
                </p>
                <div v-if="cardExtra" class="extra" :id="cardExtra.id"
                  v-has="cardExtra.permission ? cardExtra.permission : true">
                  <Icon :type="cardExtra.icon" v-if="cardExtra.icon" />
                  <span>
                    {{ cardExtra.text }}
                  </span>
                </div>
              </div>
              <div>
                <keep-alive :include="$store.state.app.keepAlives">
                  <router-view></router-view>
                </keep-alive>
              </div>
              <Spin size="large" fix v-if="showLoad"></Spin>
            </Card>
          </Content>
        </div>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import siderMenu from "../components/sider-menu/siderMenu.vue";
import breadcrumbNav from "../components/breadcrumb-nav.vue";
import { mainRouter, adminCenterRouter, button } from "../router/routers.js";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      loginRecordDTO: {},
      spId: "",
      formData: {},
      isCollapsed: false,
      showLoad: false,
      menuList: [],
      openNames: [], //默认展开的菜单
      userName: "",
      logoIcon: "http://www.hrs.com.cn/templates/main/img/logo1.png",
      logoIcon2: "http://www.hrs.com.cn/templates/main/img/logo2.png",
      role: window.sessionStorage.getItem("role"),
      roleName: window.sessionStorage.getItem("username"),
    };
  },
  created: function () {
    if (!window.sessionStorage.getItem("sid")) {
      this.$router.push({ path: "/login" });
    }
    // this.changeMenusStyle(this.$store.state.app.sideMent);
    if (this.role == "0") {
      this.getAdminUserInfo();
      console.log(adminCenterRouter);
      this.menuList = adminCenterRouter;
      this.$store.commit("setButtonPermission", button);
    } else {
      this.getUserInfo();
    }
    if (JSON.parse(window.sessionStorage.getItem("loginRecordDTO"))) {
      this.loginRecordDTO = JSON.parse(window.sessionStorage.getItem("loginRecordDTO"))
      sessionStorage.removeItem("loginRecordDTO")
    }
  },
  mounted() {
    let pathArr = this.$util.setCurrentPath(this, this.$route.name);

    //面包屑长度如果小于2 说明当前路由没有子菜单 掐头去尾得到需要展开的菜单
    if (pathArr.length > 2) {
      for (var i = 1; i < pathArr.length - 1; i++) {
        this.openNames.push(pathArr[i].name);
      }
    }
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },

    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    cardTitle() {
      return this.$store.state.app.cardTitle;
    },
    cardExtra() {
      return this.$store.state.app.cardExtra;
    },
    isQuitLogin() {
      return this.$store.state.app.quitLogin;
    },

    getUserName() {
      return this.$store.state.app.userInfo.realName
        ? this.$store.state.app.userInfo.realName
        : "";
    },
  },
  watch: {
    "$route.path": function (newVal, oldVal) {
      window.sessionStorage.setItem("menu", newVal.substring(1).split("/")[0]);
    },
    siderType(ov, ne) {
      this.changeMenusStyle(ne);
    },
    $route(to) {
      let pathArr = this.$util.setCurrentPath(this, to.name);
    },
    //            'isQuitLogin'(){
    //                    this.$Message.error('登录状态失效，即将退出登录');
    //                    setTimeout(()=>{
    //                        this.quitLogin();
    //
    //                    },2000);
    //            },
  },
  methods: {
    changeMenusStyle(ne) {
      this.show = ne;
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    quitLogin() {
      sessionStorage.setItem("sid", "");
      this.$router.push({ name: "login" });
    },
    getUserInfo() {
      let params = {
        userId: window.sessionStorage.getItem("userId"),
      };
      this.$api.user_info(params).then((res) => {
        console.log(res);
        if (res.ok || res.respCode == 0) {
          let data = res.data;
          var roleId = data.userRoleInSyses[0].roleId;
          this.getUserMenu(roleId);
          sessionStorage.userRoleInSyses = JSON.stringify(data.userRoleInSyses);
          this.$store.commit("setUserInfo", data);
        }
      });
    },
    getAdminUserInfo() {
      this.$api
        .getUserInfo(window.sessionStorage.getItem("sid"))
        .then((res) => {
          if (res.ok || res.respCode == 0) {
            this.$api.user_info({ userId: res.content.id }).then((result) => {
              console.log(result);
              let data = result.content;
              sessionStorage.userRoleInSyses = JSON.stringify(
                data.userRoleInSyses
              );
              this.$store.commit("setUserInfo", data);
            });
          }
        });
    },

    getUserMenu(roleId) {
      let params = { roleId: roleId };
      this.$api.queryAuthsByRole(params).then((res) => {
        if (res.result || res.respCode == 0) {
          let menuList = res.data;
          let that = this
          menuList.map((d) => {
            if (d.children && d.children[0]) {
              d.children.map((c) => {
                if (c.children && c.children[0]) {
                  for (let i = 0; i < c.children.length; i++) {
                    if (c.menuName == '产品广告') {
                      that.spId = c.id
                    }
                  }
                }
              });
            }
          });
          this.handleMenuData(res.data);
        }
      });
    },

    //arr:需要删除元素的数组 index:要删除元素的索引
    delElByIndex(arr, index) {
      var sliced = arr.slice(index + 1); //将需要删除元素后续的元素截取出来保存
      arr.length = index; //将需要删除的元素以及后续的所有元素删除
      arr.push.apply(arr, sliced); //将sliced中的元素复制回原数组arr中
      return arr;
    },
    // 处理获得的菜单数据
    handleMenuData(data) {
      let menuData = [];
      let button = {};
      this.$store.commit("setButtonPermission", button);
      this.handleMenuList(data, button);
      //type=0是菜单   type=1是按钮
      /*  this.menuList = data; */
      let menuList = JSON.parse(JSON.stringify(data));
      let that = this
      menuList.map((d) => {
        if (d.children && d.children[0]) {
          d.children.map((c) => {
            if (c.children && c.children[0]) {
              for (let i = 0; i < c.children.length; i++) {
                if (c.menuName == '产品广告') {
                  that.spId = c.id
                  if (c.children[i].type == 1) {
                    c.children.splice(i, 1);
                    i--;
                  }
                }
              }
            }
          });
        }
      });
      this.menuList = menuList;
      this.$store.commit("getThisAuto", this.menuList);
      let routeArr = JSON.parse(
        JSON.stringify(this.$router.options.routes[2].children)
      );
      let list = [];
      list = this.accessRecursive(routeArr);
      // 处理后的菜单放入vuex中
      this.$store.commit("saveMenuList", routeArr);
    },
    accessRecursive(arr) {
      let flag = false;
      let jsonArr = this.menuList;
      for (var I = 0; I < arr.length; I++) {
        var item = arr[I];
        if (item.children) {
          item.allow = this.accessRecursive(item.children);
        }
        function deepJsonArr(jsonArr) {
          for (var a = 0; a < jsonArr.length; a++) {
            if (item.allow || jsonArr[a].url === item.name) {
              // console.log("flag",item.allow,jsonArr[a].url,item.name)
              item.allow = true;
              break;
            }
            if (jsonArr[a].children && jsonArr[a].children.length > 0) {
              deepJsonArr(jsonArr[a].children);
            }
          }
        }
        deepJsonArr(jsonArr);
        flag = flag || item.allow;
        if (!item.allow) {
          arr.splice(I, 1);
          I--;
        }
      }
     
      // console.log("this.$router",this.$router);
      return flag;
    },
    //如果返回的事树形数据
    handleMenuList(data) {
      let that = this
      for (let item of data) {
        //判断是否隐藏
        if (item.otherInfo1 - 0 == 0 && item.type - 0 == 0) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
        item.title = item.menuName;
        // item.hidden = false;
        item.name = item.url;
        item.icon = item.img;
        // console.log("item",item)
        if (item.children) {
          var arrChildren = [];
          for (var g = 0; g < item.children.length; g++) {
             arrChildren.push(item.children[g]);
            if (
              item.children[g].otherInfo1 - 0 == 0 &&
              item.children[g].type - 0 == 0
            ) {
            } else if (item.children[g].type == "1") {
              let button = this.$store.state.app.button;
              button[item.children[g].url] = true;
              this.$store.commit("setButtonPermission", button);
              if (g == item.children.length - 1) {
                /*  这是产品广告菜单的id*/
                if (item.id !== that.spId) {
                  //  item.children=[];
                  arrChildren.push();
                  item.hiddenChildren = true;
                }
              }
            } else if (
              item.children[g].type - 0 == 0 &&
              item.children[g].otherInfo1 - 0 == 1
            ) {
              arrChildren.push(item.children[g]);
              item.hiddenChildren = true;
            }
          }
          this.handleMenuList(arrChildren);
        } else {
          item.children = [];
        }
        // }
      }
    },
    /*
              生成树形菜单(适用于 返回不是树形数据)
            */
    getTreeMenu(list, id) {
      let itemArr = [];
      filter(itemArr, null);

      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }
      function filter(tree, id) {
        let array = list.filter((item) => {
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        if (array.length > 0) {
          get(array);
        }
      }
      return itemArr;
    },
    handleDropMenuClick(name) {
      //个人中心
      if (name == 0) {
        this.$router.push("change-Password");
      } else if (name == 1) {
        this.$util.confirmDialog(this, "确认", "您确认退出登录", (self) => {
          sessionStorage.setItem("menu", "home");
          this.$api
            .loginOut({ sid: sessionStorage.getItem("sid") })
            .then((res) => {
              if (res.respCode == 0) {
                self.quitLogin();
              } else {
                this.$Message.error(res.message);
              }
            });
        });
      }
    },
  },
  components: {
    siderMenu,
    breadcrumbNav,
  },
};
</script>
<style scoped>
.logo {
  width: 28px;
  height: auto;
  margin-left: 5px;
  border-radius: 50%;
}

.alertStyle .ivu-form-item {
  margin-bottom: 0;
}

.alertStyle .ivu-form-item-label {
  text-align: left;
}
</style>
