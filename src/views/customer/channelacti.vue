<template>
  <div class="user-list">
    <Col span="11">
      <div class="mb-10">
        <Row>
          <Col span="12">
            <Button
              v-if="isAdminCenter || button.channel_add"
              type="primary"
              @click="addUser('新增渠道')"
              class="marginRight3"
              style="margin-bottom: 5px"
              >新增渠道</Button
            >
            <!--  <Button
                    @click="dictionarydelete(selectIds)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-bottom: 5px;padding-top: -10px"
                  >批量删除</Button> -->
          </Col>
        </Row>
      </div>
      <div>
        <primaryTable
          ref="multipleTable"
          highlight-row
          :current.sync="params.page"
          :row-class-name="rowClassName"
          @on-current-change="selectRow"
          :columns="columns"
          :data="tableList"
          :total="total"
          :pageSize="params.pageSize"
          @on-change="changePage"
          class="wholeTable"
          @on-page-size-change="changeSize"
        >
        </primaryTable>
      </div>
    </Col>
    <Col offset="1" span="12">
      <div class="mb-10">
        <Row>
          <Col span="12">
            <Button
             v-if="isAdminCenter || button.activity_add"
              type="primary"
              @click="addUser('新增活动')"
              class="marginRight3"
              style="margin-bottom: 5px"
              >新增活动</Button
            >
            <!--   <Button
                    @click="dictionarydelete(selectIds)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-bottom: 5px;padding-top: -10px"
                  >批量删除</Button> -->
          </Col>
        </Row>
      </div>
      <div>
        <primaryTable
          :current.sync="params2.page"
          :columns="innerColumns"
          :data="tableList2"
          :total="total2"
          :pageSize="params2.pageSize"
          ref="primaryTable"
          @on-change="changePage2"
          class="wholeTable"
          @on-page-size-change="changeSize2"
        >
        </primaryTable>
      </div>
    </Col>
    <Modal
      v-model.trim="modelShow"
      :title="title"
      :loading="true"
      :closable="false"
      :width="900"
      :mask-closable="false"
    >
      <Form
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="130"
      >
        <Row class="user-row">
          <Col span="11">
            <FormItem v-if="!isChild" label="渠道名称" prop="channelName">
              <Input
                v-model="formData.channelName"
                placeholder="请输入渠道名称"
                :maxlength="20"
              />
            </FormItem>
            <FormItem v-if="isChild" label="活动名称" prop="activityName">
              <Input
                v-model="formData.activityName"
                placeholder="请输入活动名称"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem
              v-if="!isChild"
              label="渠道标识"
              prop="channelCode"
              class="ivu-form-item-required"
            >
              <Input
                v-model="formData.channelCode"
                placeholder="请输入渠道标识"
                :maxlength="20"
              />
            </FormItem>
            <FormItem
              v-if="isChild"
              label="活动标识"
              prop="activityCode"
              class="ivu-form-item-required"
            >
              <Input
                v-model="formData.activityCode"
                placeholder="请输入活动标识"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col v-if="isChild" span="11">
            <FormItem label="选择渠道" prop="channelId">
              <Select
                clearable
                transfer
                v-model="formData.channelId"
                placeholder="请选择渠道"
              >
                <Option
                  v-for="item in parentNameList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.channelName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit">确认</Button>
        <Button @click="handleReset">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
//import innerManage from "./form/innerManage";
export default {
  data() {
    return {
      //
      isdisabled: false,
      parentNameList: [],
      ChildList: [],
      curParentCode: "",
      ruleValidate: {
        channelCode: [
          { required: true, message: "请输入渠道标识", trigger: "blur" },
        ],

        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
        ],
        activityCode: [
          { required: true, message: "请输入活动标识", trigger: "blur" },
        ],
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        channelId: [
          { required: true, message: "请选择渠道", trigger: "change" },
        ],
      },
      isChild: false,
      //
      modelShow: false,
      formData: {
        channelName: "",
        channelCode: "",
      },
      title: "",
      currentRow: "",
      params: {
        pageSize: 10,
        page: 1,
      },
      params2: {
        pageSize: 10,
        page: 1,
        relationCode: "",
      },
      relationCode: "",
      depTreeData: [],
      total: 0,
      total2: 0,
      tableList2: [],
      selectIds: [],
      tableList: [],
      button: this.$store.state.app.button,
      isAdminCenter: false,
      innerColumns: [
        {
          title: "活动名称",
          align: "center",
          minWidth: 100,
          key: "activityName",
        },
        {
          title: "活动标识",
          align: "center",
          minWidth: 100,
          key: "activityCode",
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          fixed: "right",
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
            if (this.isAdminCenter || this.button.activity_edit) {
              arr.push(
                h("Button", {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-pen'></i>"
                    innerHTML: "编辑",
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row, "编辑活动");
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.activity_delete) {
              arr.push(
                h("Button", {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-delete'></i>"
                    innerHTML: "删除",
                  },
                  on: {
                    click: () => {
                      this.delUser(params.row, "detail");
                    },
                  },
                })
              );
            }
            return h("div", arr);
          },
        },
      ],
      columns: [
        {
          title: "渠道名称",
          align: "center",
          minWidth: 100,
          key: "channelName",
          /*  render: (h, params) => {
            let btnName = "";
            if (params.row.type == "activityFirstCategory") {
              btnName = "活动类型";
            } else if (params.row.type == "activitySecondCategory") {
              btnName = "活动类型细分";
            } else if (params.row.type == "activityTheme") {
              btnName = "活动主题";
            }
            return h("div", btnName);
          }, */
        },
        {
          title: "渠道标识",
          align: "center",
          minWidth: 100,
          key: "channelCode",
        },
        {
          title: "操作",
          fixed: "right",
          slot: "action",
          width: 150,
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
            if (this.isAdminCenter || this.button.channel_edit) {
              arr.push(
                h("Button", {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    // innerHTML: "<i class='iconfont icon-pen'></i>"
                    innerHTML: "编辑",
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row, "编辑渠道");
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.channel_delete) {
              arr.push(
                h("Button", {
                  props: {
                    type: "primary",
                    size: "small",
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
      ],
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (!this.button.channel_edit && !this.button.channel_delete) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    if (!this.button.activity_edit && !this.button.activity_delete) {
      if (!this.isAdminCenter) {
        this.innerColumns.pop();
      }
    }
    this.search();
  },
  mounted() {},
  methods: {
    /*  btKeyUp(name) {
      // console.log(name);
      // console.log(this.formData[name]);
      //只能输入英文字母和数字
      if (name == "code") {
        // console.log(this.formData[name]);
        let a=/^[a-z0-9\.-]*$/g
        if(!a.test(this.formData[name])){
         // return
         this.formData[name] =''
        }
        //this.formData[name] = this.formData[name].replace(/^[\w-\s]+$/, "");
      }
      //只能输入中文和数字
      if (name == "name") {
        this.formData[name] = this.formData[name].replace(
          /[^\u4e00-\u9fa50-9]/g,
          ""
        );
      }
    }, */
    //
    handleChange(data) {
      if (!data) {
        this.ChildList = [];
        this.formData.parentCode = "";
        this.curParentCode = "";
      } else {
        //加载父级码值
        this.dictionaryChildListNoPage(data);
      }
      console.log(data);
    },
    //加载父级字段和父级码值
    dictionaryChildListNoPage(parentFiledCode) {
      this.$api
        .dictionaryChildListNoPage({
          relationCode: parentFiledCode,
        })
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            //this.formData.parentCode=""
            this.ChildList = res.data;
            console.log(this.ChildList);
            console.log(this.curParentCode);
            console.log(this.formData);
            if (this.curParentCode) {
              this.formData.parentCode = this.curParentCode;
            }
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    productAdvertisementChannelList() {
      this.$api.productAdvertisementChannelList({}).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.parentNameList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    /*
               提交
            */
    handleSubmit() {
      this.$refs.formData.validate((valid) => {
        console.log(valid);
        if (valid) {
          console.log(this.formData.parentFiledCode);
          console.log(this.formData.parentCode);
          /*  if (this.formData.parentFiledCode && !this.formData.parentCode) {
            this.$Message.error("请选择父级码值");
            return;
          } */
          this.saveUser();
        } else {
          this.$emit("error", "");
        }
      });
    },

    /*
               保存
            */
    saveUser() {
      let method;
      console.log(this.title);
      if (this.title == "新增活动") {
        this.formData.relationCode = this.relationCode;
        method = "productAdvertisementActivityCreate";
      } else if (this.title == "编辑活动") {
        this.formData.relationCode = this.relationCode;
        method = "productAdvertisementActivityUpdatee";
      } else if (this.title == "新增渠道") {
        method = "productAdvertisementChannelCreate";
      } else if (this.title == "编辑渠道") {
        method = "productAdvertisementChannelUpdate";
      }
      this.formData.systemType = 0;
      //this.formData.customerId =this.formData.customerIdAnd.split("/")[1]
      // this.formData.otherInfo20 =this.formData.customerIdAnd.split("/")[0]
      let option = this.formData;
      console.log(this.formData);
      let userRoleInSyses = [];
      let userRoleInSysesObj = {
        customerId: [],
        deptId: [],
        code: [],
        systemType: "0",
      };
      userRoleInSysesObj.customerId.push(option.customerId);
      userRoleInSysesObj.deptId.push(option.deptId);
      userRoleInSysesObj.code.push(option.code);
      userRoleInSyses.push(userRoleInSysesObj);

      //option.userRoleInSyses = userRoleInSyses;
      this.$api[method](option)
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            this.$Message.success(this.title + this.$context.$t("success"));
            console.log(this.formData);
            this.modelShow = false;
            if (this.title == "新增活动" || this.title == "编辑活动") {
              //只加载子集列表
              this.getDetailList();
            } else {
              this.search();
            }
          } else {
            this.$emit("error", "");
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    handleReset() {
      this.$refs.formData.resetFields();
      this.modelShow = false;
    },
    //
    rowClassName(row, rowIndex) {
      //console.log(row)
      if (rowIndex === 0 && this.currentRow === "") {
        return "success-row";
      }
      return "";
    },
    selectRow(currentRow) {
      this.currentRow = currentRow;
      this.relationCode = currentRow.code;
      this.params2.page = 1;
      this.params2.pageSize = 10;
      this.params2.relationCode = currentRow.code;
      this.params2.channelId = currentRow.id;
      this.getDetailList();
    },
    dictionarydelete(row) {
      let content = "确认删除该数据？";
      if (this.selectIds.length === 0) {
        this.$Message.info("请至少选择一条数据");
      } else {
        this.$util.confirmDialog(this, "确认", content, (self) => {
          this.$api
            .productAdvertisementActivityDelete({ ids: this.selectIds })
            .then((res) => {
              if (res.code == 0 || res.result - 0 == 0) {
                this.$Message.success("删除成功");
                this.params.page = 1;
                this.search();
              } else {
                this.$Message.error(res.message);
              }
            });
        });
      }
    },
    //重置
    resertMo() {
      this.params.userName = "";
      this.params.realName = "";
      this.params.phoneNo = "";
      this.params.status = "";
      this.params.idLst = "";
      this.params.customerId = "";
      this.params.email = "";
      this.params.page = 1;
      this.search();
    },

    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    changeSize2(size) {
      this.params2.pageSize = size;
      this.getDetailList();
    },
    //查询
    search() {
      if (!this.params.page) {
        this.params.page = 1;
      }
      let searchData = {
        page: this.params.page,
        pageSize: this.params.pageSize,
      };
      //字段列表
      this.getUserList(searchData);
      // this.query=true;
      // this.params.page=1;
    },
    //加载列表
    getUserList(option) {
      this.$api.productAdvertisementChannel(option).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          if (this.tableList[0]) {
            this.params2.relationCode = this.tableList[0].code;
            this.params2.channelId = this.tableList[0].id;
            this.relationCode = this.tableList[0].code;
            this.getDetailList();
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //加载列表e
    getDetailList() {
      if (!this.params2.page) {
        this.params2.page = 1;
      }
      this.$api.productAdvertisementActivity(this.params2).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.total2 = res.data.total;
          this.tableList2 = res.data.list;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    changePage(page) {
      this.params.page = page;
      this.getUserList(this.params);
    },
    changePage2(page) {
      this.params2.page = page;
      this.getDetailList();
    },
    addUser(tit) {
      if (tit == "新增活动" || tit == "新增渠道") {
        this.formData = {
          parentFiledCode: "",
          parentCode: "",
          name: "",
          code: "",
        };
      }
      this.title = tit;
      console.log(this.formData);
      if (this.formData.id) {
        this.isdisabled = true;
      } else {
        this.formData.parentFiledCode = "";
        this.formData.parentCode = "";
        this.formData.name = "";
        this.formData.code = "";
        this.isdisabled = false;
      }
      this.modelShow = true;
      if (this.title == "新增活动" || this.title == "编辑活动") {
        this.isChild = true;
        this.productAdvertisementChannelList();
        //当父级字段有值时候，加载父级码值列表
        if (this.formData.parentFiledCode) {
          this.handleChange(this.formData.parentFiledCode);
        }
        //
      } else {
        this.isChild = false;
      }
      /*  var params = {
        self: this,
        title: tit,
        width: 800, //默认600
        props: props,
        form: innerManage, //弹窗中的表单
        success: (res) => {
          if (res == 1) {
            this.params.page = 1;
          }
          this.search();
        },
        cancel: () => {},
      };
      this.$util.openModelForm(params, this); */
    },
    async editUser(row, title) {
      this.curParentCode = row.parentCode;
      let params = row;
      /* let result = await this.$api.user_info({userId:row.id})
      console.log(result)
      for (let item of result.content.userRoleInSyses) {
        params.roleId = item.roleId;
        params.deptId = item.deptId;
        params.customerId = item.customerId;
      } */
      //加载父级码值
      if (params.relationCode) {
        this.dictionaryChildListNoPage(params.relationCode);
      }
      this.formData = JSON.parse(JSON.stringify(params));
      this.addUser(title);
    },
    delUser(row, type) {
      let content = this.$t("deleteTit");
      let params = { ids: [], systemType: 0 };
      if (row) {
        params.ids.push(row.id);
      }
      let method=''
      if(type){
        method="productAdvertisementActivityDelete"
      } else{
         method="productAdvertisementChannelDelete"
      }
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api[method](params).then((res) => {
          console.log(res);
          if (res.result == 0) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
            this.params.page = 1;
            //当子集表格删除时候，只加载子集表格
            if (type) {
              this.params2.page = 1;
              self.getDetailList();
            } else {
              this.params.page = 1;
              self.search();
            }
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
  },
  filters: {},
  /*  components: {
    innerManage,
  }, */
};
</script>

<style lang="less">
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
.success-row td {
  background: #ebf7ff;
}
.ivu-layout-content {
  height: 100%;
  padding-bottom: 25px;
}
</style>
