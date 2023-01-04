<template>
  <div class="user-list">
    <div class="header">
      <Row>
        <Col span="8">
          <Form ref="formValidate" :model="params" inline :label-width="100">
            <FormItem style="width: 100%" label="新增违规词：">
              <Input
                clearable
                placeholder="请输入违规词（限制20位）"
                v-model="name"
              />
            </FormItem>
          </Form>
        </Col>
        <Col span="8">
          <Button
            :disabled="!name || name.length > 20"
            type="primary"
            @click="tabooWordsCreate()"
            style="margin-left: 10px"
            >新增</Button
          >
          <Button :disabled="!name" type="default" @click="name = ''"
            >清空</Button
          >
        </Col>
      </Row>
    </div>
    <div class="m-table">
      <Row style="margin: 10px 0">
        <Button
          v-if="isAdminCenter || button.Illegal_downloadTemplate"
          type="primary"
          @click="exportAll"
          >下载模板</Button
        >
        <Upload
          v-if="isAdminCenter || button.Illegal_import"
          :action="actionTeam"
          ref="upload"
          :show-upload-list="false"
          :on-success="handleTeamSuccess"
          :before-upload="beforeTeamUpload"
          :on-format-error="handleTeamError"
          :format="['xls', 'xlsx']"
          :headers="teamHeaders"
          style="display: inline"
        >
          <Button class="ivu-btn ivu-btn-primary">批量导入</Button>
        </Upload>
      </Row>
      <primaryTable
        :columns="columns"
        :data="tableList"
        :total="total"
        :pageSize="params.pageSize"
        ref="primaryTable"
        @on-edit="editUser"
        @on-del="tabooWordsDelete"
        @on-change="changePage"
        class="wholeTable"
        @on-page-size-change="changeSize"
      >
      </primaryTable>
      <!--<urlTable :configure='configure' ref='signTable'> </urlTable>-->
    </div>
  </div>
</template>

<script>
import { dateTransfer} from "@/api/sm4";
export default {
  data() {
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      teamHeaders: { sid: window.sessionStorage.getItem("sid") },
      actionTeam: this.$api.tabooWordsImport,
      params: {
        pageSize: 10,
        page: 1,
      },
      name: "",
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      roleList: [],
      companyList: [],
      searchData: [],
      deptList: [],
       columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "标签ID",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "id",
        },
        {
          title: "标签名称",
          align: "center",
          minWidth: 110,
          key: "name",
        },
        {
          title: "创建时间",
          align: "center",
          minWidth: 100,
          key: "createdDate",
        },
        {
          title: "创建账号",
          align: "center",
          minWidth: 90,
          key: "createdUser",
        },
        {
          title: "操作",
          slot: "action",
          minWidth: 90,
          align: "center",
          btn: { edit: true, del: true },
          render: (h, params) => {
            let btnTip = "";
            let disable = false;
            if (
              params.row.userName == "adminCenter" ||
              params.row.userName == "adminProduct"
            ) {
              disable = true;
            }
            var text = params.row;
            let arr = [];
            if (this.isAdminCenter || this.button.Illegal_delete) {
              arr.push(
                h("div", [
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
                        this.tabooWordsDelete(params.row);
                      },
                    },
                  }),
                ])
              );
            }
            return h("div", arr);
          },
        },
      ]
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.search(1);
    //调用部门
    // this.getOrgDepList();
    this.getRoleAllList();
    this.getCompanyList();
    this.getDeptList();
  },
  mounted: function () {
    if (!this.button.Illegal_delete) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
  },
  watch: {},
  methods: {
    //上传之前事件
    beforeTeamUpload(res) {
      this.$util.showLoading();
    },
    //---上传文件格式错误
    handleTeamError(res, file) {
      this.$util.hideLoading();
      this.$Notice.warning({
        title: "上传文件",
        desc: "支持Excel格式",
      });
    },
    //---上传成功
    handleTeamSuccess(res, file, fileList) {
      this.$util.hideLoading();
      if (res.code == "0") {
        if (res.content != null) {
          if (res.content.result != "0") {
            this.$Message.error(res.content.resultMessage);
          }
        } else {
          this.$Message.success("导入成功");
        }
        this.search(1);
      } else {
        this.$Message.error(res.content ? res.content : res.message);
        this.search(1);
      }
    },
    exportAll() {
      this.$api
        .exportTemplate()
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "违规词库模板.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
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
      let params = row;
      let result = await this.$api.user_info({ userId: row.id });
      params.userRoleInSyses = result.content.userRoleInSyses;
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
      this.params.page = page ? page : 1;
      let idList = [];
      if (this.params.customerId != "") {
        idList.push(this.params.customerId);
      }
      this.tabooWordsPage(this.params);
      this.searchData = this.params;
      // this.query=true;
      // this.params.page=1;
      // this.tabooWordsPage()
    },

    //加载列表e
    tabooWordsPage(option) {
      this.$api.tabooWordsPage(option).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          for (var i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].userName == "adminCenter") {
              this.tableList[i]._disabled = true;
            }
            if(this.tableList[i].createdDate){
               this.tableList[i].createdDate=dateTransfer(this.tableList[i].createdDate)
            }
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //添加
    tabooWordsCreate() {
      this.$api
        .tabooWordsCreate({
          tabooWord: this.name,
        })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.$Message.success("添加成功");
            this.search();
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
      this.tabooWordsPage(this.searchData);
    },
    async editUser(row) {
      let params = row;
      let result = await this.$api.user_info({ userId: row.id });
      for (let item of result.content.userRoleInSyses) {
        params.roleId = item.roleId;
        params.deptId = item.deptId;
        params.customerId = item.customerId;
      }
    },
    tabooWordsDelete(row) {
      let content = this.$t("deleteTit");
      let params = { ids: [], systemType: 0 };
      if (row) {
        params.ids.push(row.id);
      }
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.tabooWordsDelete(params).then((res) => {
          if (res.code == 0) {
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
      let that = this;
      this.$Modal.confirm({
        title: "确认重置",
        content: "<p>确认对当前帐号重置密码？重置后恢复为默认密码！</p>",
        onOk: () => {
          that.$api.resetPassword(data).then((res) => {
            if (res.respCode == "0") {
              that.$Message.success("重置密码成功");
            } else {
              that.$Message.error(res.message);
            }
          });
        },
      });
    },
  },
  filters: {},
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
