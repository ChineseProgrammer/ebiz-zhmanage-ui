
<template>
  <div>
    <!-- <router-view></router-view> -->
    <Form ref="params" :model="params" :label-width="100">
      <Row>
        <Col span="6">
        <FormItem :label="$t('rolename')" prop="roleName">
          <Input v-model="params.roleName" :placeholder="
                $t('pleaseEnter') + $t('blankOrSpace') + $t('rolename')
              " :maxlength="50" />
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem>
          <Button type="primary" style="margin-left:10px" @click="searchMo">{{
              $t("query")
            }}</Button>
          <Button type="default" @click="resetMo">{{ $t("reset") }}</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>

    <div>
      <Row>
        <!-- <Col span="12">
                    <Button style="margin:10px" type="primary" @click="searchMo">{{$t('query')}}</Button>
                    <Button style="margin:10px" type="default" @click="resetMo">{{$t('reset')}}</Button>
                </Col> -->
        <Col span="12">
        <Button v-if="isAdminCenter || button.role_add" type="primary" @click="addRole()"
          style="margin:10px 3px 10px 10px">添加角色</Button>
        <!--<Button type="primary" @click="addRole()" style="margin:10px 3px 10px 10px">{{$t('newBuilt')}}</Button>-->
        </Col>
      </Row>
    </div>
    <Modal v-model="treeModel" :title="modelTitle" :mask-closable="false" :ok-text="$t('preservation')"
      :cancel-text=" $t('cancel')" @on-ok="savePermission" @on-cancel="close">
      <div style="max-height: 400px;overflow-y: auto">
        <p>{{ $t("route.menu") }}:</p>
        <Tree :data="treeMenuData" :check-strictly="false" show-checkbox ref="treeMenu" style="color: #fff!important;">
        </Tree>
      </div>
    </Modal>
    <Modal v-model="themeModel" :title="themeTitle" :mask-closable="false" :ok-text="$t('preservation')"
      :cancel-text=" $t('cancel')" @on-ok="saveTheme" @on-cancel="close">
      <div style="max-height: 400px;overflow-y: auto">
        <Form v-model="themeModelData">
          <FormItem label="角色名称">
            {{themeModelName}}
          </FormItem>
          <FormItem label="选择主题">
            <Tree :data="themeTree" :check-strictly="false" show-checkbox ref="themeMenu"
              style="color: #fff!important;"></Tree>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!--<Button v-has='"role:add"' type="info" @click="addRole()" style="margin-botttom:10px">新建</Button>-->
    <div style="margin-top: 10px">
      <div>
        <primaryTable class="wholeTable" :current="params.page" :columns="columns" :data="tableList" :total="total"
          :pageSize="params.pageSize" ref="primaryTable" @on-edit="editRole" @on-del="delRole" @on-change="changePage"
          @on-set="setPermission">
        </primaryTable>
      </div>
      <!--        <Col-->
      <!--          :span="right"-->
      <!--          style="border-left:1px solid #d9d9d9"-->
      <!--          v-if="right > 0"-->
      <!--        >-->
      <!--          <Card dis-hover>-->
      <!--            <div slot="title" class="right-title">-->
      <!--              <p style="color: #fff!important;">-->
      <!--                {{ $t("permissionsettings") }}： {{ roleName }}-->
      <!--              </p>-->
      <!--              <Icon type="ios-backspace-outline" @click="close" />-->
      <!--            </div>-->
      <!--            <p>{{ $t("route.menu") }}:</p>-->
      <!--            <Tree-->
      <!--              :data="treeMenuData"-->
      <!--              :check-strictly="false"-->
      <!--              show-checkbox-->
      <!--              ref="treeMenu"-->
      <!--              style="color: #fff!important;"-->
      <!--            ></Tree>-->
      <!--            <Button-->
      <!--              type="primary"-->
      <!--              style="margin-right:5px"-->
      <!--              size="small"-->
      <!--              @click="savePermission"-->
      <!--              >{{ $t("preservation") }}</Button-->
      <!--            >-->
      <!--            <Button type="info" size="small" @click="close">{{-->
      <!--              $t("cancel")-->
      <!--            }}</Button>-->
      <!--          </Card>-->
      <!--        </Col>-->
      </Row>
    </div>
  </div>
</template>

<script>
import { dateTransfer } from "@/api/sm4";
import { mapGetters } from "vuex";
import roleForm from "./form/roleForm";
import { mainRouter } from "../../router/routers.js";
export default {
  data() {
    return {
      themeId: "",
      themeModelName: "",
      themeModelData: "",
      button: this.$store.state.app.button,
      isAdminCenter: false,
      treeModel: false,
      themeModel: false,
      themeTree: [],
      modelTitle: "",
      themeTitle: "",
      params: {
        roleName: "",
        pageSize: 10,
        systemType: 0,
        page: 1,
      },
      left: 24, //左侧表格比例
      right: 0,
      treeMenuData: [],
      roleName: "",
      roleId: "",
      tableList: [],
      total: 0,
      mainRouter: [],
      //         columns:[
      //                 {
      //                     type: 'selection',
      //                     width: 60,
      //                     align: 'center',
      //                 },
      //                 {
      //                     type: 'index',
      //                     width: 60,
      //                     align: 'center',
      //                     title:"序号"
      //                 },

      //                 {
      //                     title: '角色名称',
      //                     key: 'rolename',
      //                     align: 'center',
      //                     slot:"alarm"//添加可实现表格edit
      //                 },

      //                 {
      //                     title: '角色描述',
      //                     key: 'rolede',
      //                     align: 'center',
      //                     slot:"alarm"//添加可实现表格edit
      //                 },
      //                 {
      //                     title: '创建时间',
      //                     slot:"alarm",
      //                     align: 'center',
      //                     key: 'createdate'
      //                 },
      //                 {
      //                     title: '状态',
      //                     slot:"alarm",
      //                     align: 'center',
      //                     key: 'status'
      //                 },
      //                 {
      //   title: "操作",
      //   slot: "action",
      //   width: 210,
      //   align: "center",
      //       render: (h, params) => {
      //           return h("div", [
      //               h(
      //               "Button",
      //               {
      //                   props: {
      //                   type: "primary",
      //                   size: "small",
      //                   },
      //                   style: {
      //                   marginRight: "5px"
      //                   },
      //                   on: {
      //                   click: () => {

      //                   }
      //                   }
      //               },
      //               "编辑"
      //               ),
      //                 h(
      //               "Button",
      //               {
      //                   props: {
      //                   type: "primary",
      //                   size: "small",
      //                   },
      //                   style: {
      //                   marginRight: "5px"
      //                   },
      //                   on: {
      //                   click: () => {

      //                   }
      //                   }
      //               },
      //               "删除"
      //               ),
      //               h(
      //               "Button",
      //               {
      //                   props: {
      //                   type: "primary",
      //                   size: "small",
      //                   },
      //                   style: {
      //                   marginRight: "5px"
      //                   },
      //                   on: {
      //                   click: () => {

      //                   }
      //                   }
      //               },
      //               "停用"
      //               ),
      //           ]);
      //       }
      //     }

      //             ]
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (
      !this.button.role_set &&
      !this.button.role_edit &&
      !this.button.role_outOfService &&
      !this.button.role_delete
    ) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.getRoleList();
    this.getAllTheme();
  },
  mounted: function () { },
  computed: {
    columns(vue) {
      return [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: this.$t("rolename"),
          key: "roleName",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          // slot:"alarm"//添加可实现表格edit
        },
        {
          title: "角色类型",
          align: "center",
          key: "otherInfo5",
          render: (h, params) => {
            let btnName = "";
            if (params.row.otherInfo5 == 0) {
              btnName = "管理员";
            } else if (params.row.otherInfo5 == 1) {
              btnName = "停用";
            } else if (params.row.otherInfo5 == 1) {
              btnName
            }
            return h("div", btnName);
          },
        },
        {
          title: "角色描述",
          align: "center",
          // slot:"alarm",
          minWidth: 180,
          key: "remark",
        },
        // {
        //     title: "状态",
        //     align:'center',
        //     // slot:"alarm",
        //     key: 'roleStatus',
        //     render: (h, params) => {
        //         let btnName='';
        //         if(params.row.roleStatus==0){
        //             btnName = "启用";
        //         }else{
        //             btnName = "停用";
        //         }
        //         return h('div',btnName);
        //     }
        // },
        {
          title: "最后操作时间",
          align: "center",
          // slot:"alarm",
          minWidth: 110,
          key: "modifyTime",
        },
        {
          title: "操作人",
          align: "center",
          // slot:"alarm",
          minWidth: 150,
          key: "modifyUserName",
        },
        {
          title: this.$t("operation"),
          slot: "action",
          width: 350,
          align: "center",
          render: (h, params) => {
            let disable = false;
            let enabletxt = params.row.roleStatus == "0" ? "停用" : "启用";
            let flag = params.row.roleStatus == 0 ? 1 : 0;
            if (params.row.roleName == "admin") {
              disable = true;
            }
            let arr = [];
            if (this.isAdminCenter || this.button.role_set) {
              arr.push(
                h("Button", {
                  domProps: {
                    innerHTML: "权限设置",
                  },
                  props: {
                    type: "primary",
                    size: "small",
                    //disabled:disable
                  },
                  // style: {
                  //     display: "none"
                  // },
                  on: {
                    click: () => {
                      this.setPermission(params.row);
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.role_set) {
              arr.push(
                h("Button", {
                  domProps: {
                    innerHTML: "主题设置",
                  },
                  props: {
                    type: "primary",
                    size: "small",
                    //disabled:disable
                  },
                  // style: {
                  //     display: "none"
                  // },
                  on: {
                    click: () => {
                      this.setTheme(params.row);
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.role_edit) {
              arr.push(
                h("Button", {
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-pen'></i>"
                    innerHTML: "编辑",
                  },
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: disable,
                  },
                  on: {
                    click: () => {
                      this.editRole(params.row);
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.role_outOfService) {
              arr.push(
                h("Button", {
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-delete'></i>"
                    innerHTML: enabletxt,
                  },
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: disable,
                  },
                  on: {
                    click: () => {
                      this.enableRole(params.row, flag);
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.role_delete) {
              arr.push(
                h("Button", {
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-delete'></i>"
                    innerHTML: "删除",
                  },
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: disable,
                  },
                  on: {
                    click: () => {
                      this.delRole(params.row);
                    },
                  },
                })
              );
            }
            return h("div", arr);
          },
        },
      ];
    },
  },
  watch: {},
  methods: {
    //分页
    changePage(page) {
      this.params.page = page;
      this.getRoleList();
    },
    //查询
    searchMo() {
      this.params.pageNum = 1;
      this.current = 1;
      this.getRoleList();
    },
    // 重置
    resetMo() {
      //this.$refs['formValidate'].resetFields();
      this.params.roleName = null;
      this.params.pageNum = 1;
      this.params.pageSize = 10;
      this.getRoleList();
    },
    /*
             获得列表

           */
    getRoleList() {
      this.$api.getRoleList(this.params).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          this.tableList.map((t) => {
            t.modifyTime = dateTransfer(t.modifyTime)
          })
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //新增
    addRole(formData) {
      let props = {},
        title = this.$t("newBuilt") + this.$t("roles");
      props.menuList = this.treeData;
      var $tot = {
        t_rolename: this.$t("rolename"),
        t_remark: this.$t("remarks"),
      };
      props.Formt = $tot;
      if (formData) {
        props.formValidate = formData;
        title = this.$t("edit") + this.$t("roles");
      }
      let self = this;
      var params = {
        self: this,
        title: title,
        width: 600, //默认600
        props: props,
        form: roleForm, //弹窗中的表单
        success: (res) => {
          console.log(res)
          this.getRoleList();
          this.changePage(1);
        },
        cancel: () => { },
      };
      this.$util.openModelForm(params, this);
    },
    //编辑
    editRole(row) {
      let { roleName, id, remark, otherInfo1 } = row;
      let params = {
        roleName: roleName,
        id: id,
        remark: remark,
        otherInfo1: otherInfo1 || '0'
      };
      this.addRole(params);
    },
    //删除
    delRole(row) {
      this.$util.confirmDialog(
        this,
        this.$t("confirm"),
        this.$t("confirm") +
        this.$t("delete") +
        this.$t("roles") +
        ":" +
        `${row.roleName}`,
        (self) => {
          self.$api
            .delRole({ roleIds: [row.id], systemType: 0 })
            .then((res) => {
              if (res.result == 0) {
                self.$Message.success(this.$t("delete") + this.$t("success"));
                self.getMenuList();
                self.getRoleList();
              } else {
                self.$Message.error(res.message);
              }
            });
        }
      );
    },
    // 设置权限
    setPermission(row) {
      this.left = 16;
      this.right = 0;
      var self = this;
      setTimeout(function () {
        self.right = 8;
      }, 500);
      this.treeModel = true;
      this.modelTitle = this.$t("permissionsettings") + this.roleName;
      this.roleName = row.roleName;
      this.roleId = row.id;
      this.getRoleMenu();
    },
    /* 保存权限
     */
    savePermission() {
      let menu = this.$refs.treeMenu.getCheckedAndIndeterminateNodes();
      // if(menu.length==0)
      // {
      //     this.$Message.error('请选择菜单！');
      //     return;
      // }
      let params = {
        authIds: [],
        roleId: this.roleId,
        systemType: 0,
        userId: sessionStorage.userId,
      };
      for (let item of menu) {
        params.authIds.push(item.id);
      }
      this.$util.confirmDialog(this, "确认", "确认添加角色权限", (self) => {
        self.$api.setAuthsForRole(params).then((res) => {
          if (res.result == 0 || res.respCode == 0) {
            self.$Message.success("保存成功");
            self.close();
          } else {
            self.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        });
      });
    },
    close() {
      this.left = 24;
      this.right = 0;
      this.roleName = "";
    },

    getRoleMenu() {
      this.$api
        .queryAuthsByRoleList({ roleId: this.roleId, type: "1" })
        .then((res) => {
          if (res.respCode == 0 || res.result == 0) {
            let roleMenuId = {};
            for (let a = 0; a < res.data.length; a++) {
              if (res.data[a].children) {
                for (let item of res.data[a].children) {
                  if (item.parentId) {
                    roleMenuId[item.id + ""] = true;
                  }
                  if (item.children != null) {
                    delete roleMenuId[item.id]; //如果下方有children 的权限 那就删除当前的itemid 用来做返现
                    for (let d = 0; d < item.children.length; d++) {
                      if (item.children[d].parentId) {
                        roleMenuId[item.children[d].id + ""] = true;
                      }
                    }
                  }
                }
              } else {
                roleMenuId[res.data[a].id + ""] = true;
              }
            }
            console.log(roleMenuId);
            this.getMenuList(roleMenuId);
            //    let roleMenuId={};
            // //    for(let item of res.data)
            // //    {
            // //        roleMenuId[item.id+'']=true;

            // //    }
            //    getRoleMenuIds(res.data)
            //    function getRoleMenuIds(data){
            //        for(let item of data)
            //         {
            //             roleMenuId[item.id+'']=true;
            //             if(item.children){
            //                 getRoleMenuIds(item.children)
            //             }

            //         }
            //    }
            //    this.getMenuList(roleMenuId);
          } else {
            this.$Message.error(res.message);
          }
        });

      //   if (mainRouter) {
      //         let len = mainRouter.length-1
      //         console.log(len)

      //             mainRouter.map((item,index) => {
      //                 if(index ==0){
      //                     if(index == len){
      //                         item.hidden = false
      //                     }else{
      //                         item.hidden = true
      //                     }
      //                 }
      //             })

      //         this.menuList = mainRouter;
      //     }
    },

    getMenuList(roleMenuId) {
      this.$api.getMenuList().then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          // this.handleMenuList(res.data,roleMenuId);
          // this.treeMenuData=res.data;
          this.treeMenuData = this.handleMenuList(res.data, roleMenuId);
        } else {
          this.$Message.error(res.message);
        }
      });
    },

    //如果返回的事树形数据
    handleMenuList(data, roleMenuId) {
      let arr = [];
      data.map((item) => {
        // if (item.otherInfo1 != "1") {
        // let obj = {
        //     title:item.menuName,
        //     typeName:item.type==0?"菜单":'按钮',
        //     expand:true,
        //     checked:false,
        //     children:[]
        // }
        item.title = item.menuName;
        item.typeName = item.type == 0 ? "菜单" : "按钮";
        item.expand = true;
        if (roleMenuId[item.id + ""]) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        if (item.children) {
          item.children = this.handleMenuList(item.children, roleMenuId);
        }
        arr.push(item);
        // }
      });
      return arr;

      //   for(let item of data)
      //   {
      //       console.log(item)
      //       if(item.otherInfo1 !="1"){
      //         item.title=item.menuName;
      //         item.typeName=item.type==0?"菜单":'按钮'
      //         item.expand=true;
      //         if(roleMenuId[item.id+''])
      //         {
      //             item.checked=true;
      //         }
      //         else{
      //             item.checked=false;
      //         }
      //         if(item.children)
      //         {
      //             this.handleMenuList(item.children,roleMenuId)
      //         }
      //       }else{
      //         //   data.splice(item.nodeKey,1)
      //       }

      //   }
    },
    //启用/禁用
    enableRole(row, flag) {
      this.$util.confirmDialog(
        this,
        this.$t("confirm"),
        this.$t("confirm") +
        (flag == 0 ? this.$t("enable") : this.$t("prohibit")) +
        this.$t("roles") +
        ":" +
        `${row.roleName}`,
        (self) => {
          let data = {
            roleId: row.id,
          };
          if (row.roleStatus === "0") {
            self.$api.disablePeople(data).then((res) => {
              if (res.code == "0") {
                let txt = flag == 0 ? "启用成功" : "停用成功";
                self.$Message.success(txt);
                // self.getMenuList();
                self.getRoleList();
              } else {
                self.$Message.error(res.message);
              }
            });
          } else {
            self.$api.enablePeople(data).then((res) => {
              if (res.code == "0") {
                let txt = flag == 0 ? "启用成功" : "停用成功";
                self.$Message.success(txt);
                // self.getMenuList();
                self.getRoleList();
              } else {
                self.$Message.error(res.message);
              }
            });
          }
        }
      );
    },
    // 主题设置
    setTheme(row) {
      console.log(row);
      this.themeModel = true;
      this.themeTitle = "主题设置";
      this.themeModelName = row.roleName;
      this.getThisMenu(row.id);
    },
    getThisMenu(id) {
      this.themeId = id;
      let reqData = {
        roleId: id,
      };
      this.$api
        .getChannelByRole(reqData)
        .then((res) => {
          if (res.result == 0) {
            console.log(res);
            this.themeTree = this.dispose(res.content, 0);
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch((err) => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
    },
    dispose(data, type) {
      data.map((item) => {
        item.title = item.channelName;
        item.checked = item.check;
        if (type == 0) {
          item.expand = true;
        }
        if (item.children && item.children.length > 0) {
          item.children = this.dispose(item.children, 1);
        }
      });
      return data;
    },
    // 获取全部主题
    getAllTheme() {
      this.$api
        .channelTree({
          channelType: 4,
        })
        .then((res) => {
          if (res) {
            console.log("88888888");
            console.log(res);
            // debugger;
            //this.themeTree = this.dispose(res.content, 0);
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch((err) => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
    },
    // 保存主题
    saveTheme() {
      let menu = this.$refs.themeMenu.getCheckedAndIndeterminateNodes();
      let params = {
        channelIds: [],
        roleId: this.themeId,
      };
      for (let item of menu) {
        params.channelIds.push(item.id);
      }
      this.$util.confirmDialog(this, "确认", "确认添加角色权限", (self) => {
        self.$api.saveChannel(params).then((res) => {
          if (res.result == 0 || res.respCode == 0) {
            self.$Message.success("保存成功");
            self.close();
          } else {
            self.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        });
      });
    },
  },
  filters: {},
  components: {
    roleForm,
  },
};
</script>

<style lang="less">
#menu_index {
  .ivu-col {
    transition: width 0.5s;
    -moz-transition: width 0.5s; /* Firefox 4 */
    -webkit-transition: width 0.5s; /* Safari 和 Chrome */
    -o-transition: width 0.5s; /* Opera */
  }
  .right-title {
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
    .ivu-card {
      width: 100%;
      overflow: hidden;
    }
    i {
      font-size: 18px;
      cursor: pointer;
      &:hover {
        color: #2d8cf0;
      }
    }
    p {
    }
  }
}
</style>
