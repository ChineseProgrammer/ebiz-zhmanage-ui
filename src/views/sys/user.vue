<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem prop="realName" label="负责人姓名">
            <Input placeholder="请输入负责人姓名" v-model="params.realName" />
          </FormItem>
          <FormItem label="用户账号" prop="userName">
            <Input v-model="params.userName" placeholder="请输入用户账号" />
          </FormItem>
          <FormItem prop="mobileNo" label="手机号码">
            <Input placeholder="请输入手机号码" v-model="params.mobileNo" />
          </FormItem>
          <FormItem prop="email" label="邮箱">
            <Input placeholder="请输入邮箱" v-model="params.email" />
          </FormItem>
          <FormItem prop="idLst" label="所属部门">
            <!--<TreeSelect  style="width:162px" :disableds="formDis" v-bind:modelData="params.post" :treeData="treeDataInsurance" ></TreeSelect>-->
            <Select
              clearable
              filterable
              style="width:162px"
              placeholder="请选择所属部门"
              v-model="params.idLst"
            >
              <Option
                v-for="item in deptList"
                :value="item.id"
                :key="item.id"
                >{{ item.deptName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem  label="所属公司机构">
            <Select
              clearable
              filterable
              style="width:162px"
              placeholder="请选择所属公司机构"
              v-model="params.customerId"
            >
              <Option
                v-for="item in companyList"
                :value="item.id"
                :key="item.id"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="status" label="状态">
            <Select
              clearable
              style="width:162px"
              placeholder="请选择状态"
              v-model="params.status"
            >
              <Option value="0">启用</Option>
              <Option value="1">停用</Option>
            </Select>
          </FormItem>
          <FormItem label="" class="float-right"> </FormItem>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div class="mb-10">
        <Row>
          <Col span="12">
            <Button
             v-if="isAdminCenter || button.user_add"
              type="primary"
              @click="addUser()"
              class="marginRight3"
              style="margin-bottom: 5px;"
              >添加用户</Button
            >
            <!--<Button type="primary" @click="addUser()" class="marginRight3"      style="margin-bottom: 5px;">{{$t('newBuilt')}}</Button>-->
            <!-- <Button type="error" @click="delUser()"      style="margin-bottom: 5px;">{{$t('batchdeletion')}}</Button> -->
          </Col>
          <i-col class="float-right">
            <Button
              type="primary"
              @click="search(1)"
              style="margin-left:10px"
              >{{ $t("query") }}</Button
            >
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
        </Row>
      </div>
      <div>
        <primaryTable
          :columns="columns"
          :data="tableList"
          :total="total"
          :pageSize="params.pageSize"
          ref="primaryTable"
          @on-edit="editUser"
          @on-del="delUser"
          @on-change="changePage"
          class="wholeTable"
          @on-page-size-change="changeSize"
        >
        </primaryTable>
      </div>

      <!--<urlTable :configure='configure' ref='signTable'> </urlTable>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userForm from "./form/userForm";
import { parse } from "path";

export default {
  data() {
    return {
        button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {
        mobileNo: "",
        userName: "",
        realName: "",
        status: "",
        idLst: "",
        customerId:"",
        pageSize: 10,
        page: 1,
      },
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      roleList: [],
      companyList: [],
      searchData: [],
      deptList: [],
      columns:[
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "用户账号",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "userName",
        },
        {
          title: "所属部门",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "deptName",
        },
        {
           title: "用户角色",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
          key: "roleName",
        },
        {
          title: "所属公司机构",
          // slot:"alarm",
          align: "center",
          minWidth: 120,
          key: "orgName",
          width: 150,
        },
        {
          title: "负责人姓名",
          align: "center",
          // slot:"alarm",
          minWidth: 110,
          key: "realName",
        },
        {
          title: "手机号码",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "mobileNo",
        },
        {
          title: "邮箱",
          align: "center",
          // slot:"alarm",
          minWidth: 90,
          key: "email",
        },
        {
          title: "创建时间",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "createdDate",
        },
        {
          title: "状态",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "status",
          render: (h, params) => {
            let btnName = "";
            if (params.row.status == 0) {
              btnName = "启用";
            } else {
              btnName = "停用";
            }
            return h("div", btnName);
          },
        },
        {
          title: "操作人",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "createUserName",
        },
        {
          title: "操作",
          slot: "action",
          width: 280,
          align: "center",
          btn: { edit: true, del: true },
          render: (h, params) => {
            let btnName = "";
            let btnTip = "";
            let disable = false;
            if (
              params.row.userName == "adminCenter" ||
              params.row.userName == "adminProduct"
            ) {
              disable = true;
            }
            if (params.row.status == 1) {
              // btnTip=vue.$t('enable')
              // btnName = "<i class='iconfont icon-jinyong1'></i>";
              btnName = "启用";
            } else {
              // btnTip = this.$t('prohibit');
              // btnName = "<i class='iconfont icon-qiyong'></i>";
              btnName = "停用";
            }
            var text = params.row;
             let arr = [];
            if (this.isAdminCenter || this.button.user_edit) {
              arr.push(
                h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: disable,
                },
                domProps: {
                  // 添加标签,使用自己引入的iconfont图标
                  // innerHTML: "<i class='iconfont icon-pen'></i>"
                  innerHTML: "编辑",
                },
                on: {
                  click: () => {
                    this.editUser(params.row);
                  },
                },
              })
              );
            }
            if (this.isAdminCenter || this.button.user_resetPassword) {
              arr.push(
                 h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: disable,
                },
                domProps: {
                  // 添加标签,使用自己引入的iconfont图标
                  // innerHTML: "<i class='iconfont icon-pen'></i>"
                  innerHTML: "重置密码",
                },
                on: {
                  click: () => {
                    this.resetPwd(params.row);
                  },
                },
              })
              );
            }
             if (this.isAdminCenter || this.button.user_OutOfService) {
              arr.push(
                h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: disable,
                },
                domProps: {
                  // 添加标签,使用自己引入的iconfont图标
                  innerHTML: btnName,
                },
                on: {
                  click: () => {
                    this.updateState(params.row);
                  },
                },
              })
              );
            }
             if (this.isAdminCenter || this.button.user_delete) {
              arr.push(
                h("Button", {
                props: {
                  type: "primary",
                  size: "small",
                  disabled: disable,
                },
                domProps: {
                  // 添加标签,使用自己引入的iconfont图标
                  // innerHTML: "<i class='iconfont icon-delete'></i>"
                  innerHTML: "删除",
                },
                on: {
                  click: () => {
                    this.delUser(params.row);
                  },
                },
              }) 
              );
            }
            return h("div", arr);
          },
        },
      ]
    };
  },
  created: function() {
     this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.search(1);
    //调用部门
    // this.getOrgDepList();
    this.getRoleAllList();
    this.getCompanyList();
    this.getDeptList();
  },
  mounted: function() {},
  watch: {},
  methods: {
    //重置
    resertMo() {
      this.params.userName = "";
      this.params.realName = "";
      this.params.mobileNo = "";
      this.params.status = "";
      this.params.idLst = "";
      this.params.customerId = "";
      this.params.email = "";
      this.search(1);
    },

    //更改启用/停用状态
    async updateState(row) {
      let self = this;
      if (row.status == 1) {
        row.status = 0;
        var text = this.$t("enable");
      } else {
        row.status = 1;
        var text = "停用";
      }
      //判断当前会议室启用状态  还是停用状态
      let params = row
      let result = await this.$api.user_info({userId:row.id})
      params.userRoleInSyses=result.content.userRoleInSyses
      this.$api
        .updateUser(params)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success(text + this.$t("success"));
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
//       zhuge.track('713操作', {
//   '操作1' : '222',
// });  
// console.log("9----------")
      this.params.page = page ? page : 1;
      let idList = []
      if(this.params.customerId != ""){
        idList.push(this.params.customerId)
      }
      
      let searchData = {
        email: this.params.email,
        userName: this.params.userName,
        realName: this.params.realName,
        mobileNo: this.params.mobileNo,
        status: this.params.status,
        customerId:this.params.customerId,
        idLst: this.params.idLst?[this.params.idLst]:undefined,
        pageNum: this.params.page,
        pageSize: this.params.pageSize,
      };
      this.getUserList(searchData);
      this.searchData = searchData;
      // this.query=true;
      // this.params.page=1;
      // this.getUserList()
    },

    //加载用户列表e
    getUserList(option) {
      this.$api.getUserList(option).then((res) => {
        console.log(res);
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          for (var i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].userName == "adminCenter") {
              this.tableList[i]._disabled = true;
            }
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获得角色·
    getRoleAllList() {
      this.$api.getRoleAllList({ roleStatus: 0 }).then((res) => {
        if (res.respCode == "0") {
          this.roleList = res.data;
        }
      });
    },
    changePage(page) {
      this.params.page = page;
      this.searchData.page = page;
      this.getUserList(this.searchData);
    },
    addUser(formData) {
//    zhuge.track('购买商品99', {
//   '商品分类' : '手机',
//   '商品名称' : 'iPhone XS',
//   '数量' : 2
// }); 
      let props = {},
        title = this.$t("addUser");
      props.deptList = this.deptList;
      props.roleList = this.roleList;
      props.companyList = this.companyList;
      console.log(this.roleList);
      if (formData) {
        console.log(formData);
        props.formValidate = formData;
        title = this.$t("editUser");
      }
      let self = this;
      var params = {
        self: this,
        title: title,
        width: 800, //默认600
        props: props,
        form: userForm, //弹窗中的表单
        success: (res) => {
          if ((res = 1)) {
            this.params.page = 1;
            this.params.userName = "";
            this.params.realName = "";
          }
          this.search(1);
        },
        cancel: () => {},
      };
      this.$util.openModelForm(params, this);
    },
    async editUser(row) {
      let params = row;
      let result = await this.$api.user_info_uu({userId:row.id})
      console.log(result);
      for (let item of result.content.userRoleInSyses) {
        params.roleId = item.roleId;
        params.deptId = item.deptId;
        params.customerId = item.customerId;
      }
      this.$set(params,"customerIdAnd",params.otherInfo20+"/"+params.customerId);
      this.addUser(params);
    },
    delUser(row) {
      let content = this.$t("deleteTit");
      let params = { ids: [], systemType: 0 };
      if (row) {
        params.ids.push(row.id);
      }
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.delUser(params).then((res) => {
          if (res.respCode == 0) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
            self.search(1);
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    getOrgDepList() {
      this.$api.getOrgDepList({ systemType: 0 }).then((res) => {
        if (res.respCode == 0 || res.result == 0) {
          this.depTreeData = this.getTreeOrgDept(res.data);
        } else {
          this.$Message.error(res.message ? res.message : res.resultMessage);
        }
      });
    },
    /*
              生成树形组织结构(适用于 返回不是树形数据)
            */

    getTreeOrgDept(list, treeData, id) {
      let itemArr = [];
      let that = this;
      filter(itemArr, null);
      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }
      //遍历过滤
      function filter(tree, id) {
        let array = list.filter((item) => {
          //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
          if (id == null) {
            item.title = item.deptName;
          }
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        //依次遍历
        if (array.length > 0) {
          get(array);
        }
      }

      return itemArr;
    },
    //获取公司机构
    getCompanyList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getCompanyList({}).then((res) => {
        console.log(res);
        if (res.respCode == "0") {
          this.companyList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获取部门
    getDeptList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getDeptController({}).then((res) => {
        console.log(res);
        if (res.respCode == "0") {
          this.deptList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置密码
    resetPwd(row) {
      let data = {
        userId: row.id,
      };
      let that = this
      this.$Modal.confirm({
          title: '确认重置',
          content: '<p>确认对当前帐号重置密码？重置后恢复为随机密码！</p>',
          onOk: () => {
              that.$api.resetPassword(data).then((res) => {
                if (res.respCode == "0") {
                  that.$Message.success({
                    content: "重置密码成功，初始密码是"+res.content,
                    duration: 100,
                    closable: true
                });
                } else {
                  that.$Message.error(res.message);
                }
              });
          }
      });
    },
  },
  filters: {},
  components: {
    userForm,
  },
};
</script>

<style lang="less">
#menu_index {
}
.v-transfer-dom
  .ivu-modal-wrap
  .ivu-modal
  .ivu-modal-content
  .ivu-modal-body
  .ivu-modal-confirm-body {
  height: auto !important;
  max-height: 350px !important;
  color: unset !important;
  overflow: auto;
}
</style>
