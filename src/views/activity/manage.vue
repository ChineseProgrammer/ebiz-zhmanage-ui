<template>
  <div class="user-list">
    <Col span="8">
      <div class="mb-10">
        <Row>
          <Col span="12">
            <Button
              v-if="isAdminCenter || button.manage_add"
              type="primary"
              @click="addUser('新增字段')"
              class="marginRight3"
              style="margin-bottom: 5px"
              >新增</Button
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
    <Col offset="1" span="15">
      <div class="mb-10">
        <Row>
          <Col span="12">
            <Button
              type="primary"
              @click="addUser('新增对象字段')"
              class="marginRight3"
              style="margin-bottom: 5px"
              >新增对象字段</Button
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
            <FormItem
              :label="isChild ? '中文名称' : '本级字段中文名称'"
              prop="name"
            >
              <Input
                @on-keyup="btKeyUp('name')"
                v-model="formData.name"
                placeholder="请输入"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col span="11" offset="1">
            <FormItem
              :label="isChild ? '码值' : '本级字段英文名称'"
              prop="code"
              class="ivu-form-item-required"
            >
              <Input
                v-model="formData.code"
                placeholder="请输入"
                :disabled="isdisabled"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col v-show="isChild" span="11">
            <FormItem label="父级字段">
              <Select
                @on-change="handleChange(formData.parentFiledCode)"
                clearable
                @on-clear="handleClear"
                transfer
                v-model="formData.parentFiledCode"
                placeholder="请选择父级字段"
              >
                <Option
                  v-for="item in parentNameList"
                  :value="item.code"
                  :key="item.code"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col v-show="isChild" span="11" offset="1">
            <FormItem label="父级码值">
              <Select
                :disabled="!formData.parentFiledCode"
                clearable
                transfer
                v-model="formData.parentCode"
                placeholder="请选择父级码值"
              >
                <Option
                  v-for="item in ChildList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
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
import innerManage from "./form/innerManage";
export default {
  data() {
    return {
      //
      isdisabled: false,
      parentNameList: [],
      ChildList: [],
      curParentCode: "",
      ruleValidate: {
        otherInfo10: [this.$util.rules.cardNo()],
        type: [
          { required: true, message: "请选择码值类型", trigger: "change" },
        ],
        // userNo: [
        //     {required: true, message: this.$context.$t('system.userNo')+ this.$context.$t('noEmpty'), trigger: 'blur'},
        //     {pattern: "^\\w+$", message: this.$context.$t('checkList.underscores'), trigger: 'blur'}
        // ],
        name: [{ required: true, message: "请输入中文名称", trigger: "blur" }],

        code: [
          { required: true, message: "请输入码值", trigger: "blur"},
          {
            pattern: /^[A-Za-z0-9_\( \)\-\#]+$/,
            message: "请输入数字字母和中划线字符",
          },
         ],
        customerIdAnd: [
          {
            required: true,
            message: "请选择所属公司机构",
            trigger: "change",
          },
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "change" },
        ],
        phoneNo: [
          // {required: true, message: this.$context.$t('system.phoneNo')+this.$context.$t('noEmpty'), trigger: 'blur'},
          {
            pattern: "^1\\d{10}$",
            message: this.$context.$t("checkList.correctPhone"),
            trigger: "blur",
          },
        ],
      },
      isChild: false,
      //
      modelShow: false,
      formData: {
        parentFiledCode: "",
        relationCode: "",
        parentCode: "",
        name: "",
        code: "",
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
          title: "中文名称",
          align: "center",
          minWidth: 100,
          key: "name",
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
          title: "码值",
          align: "center",
          minWidth: 100,
          key: "code",
        },
        {
          title: "父级字段中文名称",
          align: "center",
          minWidth: 120,
          key: "parentFiledName",
        },
        {
          title: "父级字段英文名称",
          align: "center",
          minWidth: 120,
          key: "parentFiledCode",
        },
        {
          title: "父级码值名称",
          minWidth: 120,
          align: "center",
          key: "parentCodeName",
        },
        {
          title: "父级码值",
          align: "center",
          minWidth: 100,
          key: "parentRealCode",
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
            if (this.isAdminCenter || this.button.manageObject_edit) {
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
                      this.editUser(params.row, "编辑对象字段");
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.manageObject_delete) {
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
          title: "本级字段中文名称",
          align: "center",
          minWidth: 100,
          key: "name",
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
          title: "本级字段英文名称",
          align: "center",
          minWidth: 100,
          key: "code",
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
            if (this.isAdminCenter || this.button.manage_edit) {
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
                      this.editUser(params.row, "编辑字段");
                    },
                  },
                })
              );
            }
            if (this.isAdminCenter || this.button.manage_delete) {
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
    if (!this.button.manage_edit && !this.button.manage_delete) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    if (!this.button.manageObject_edit && !this.button.manageObject_delete) {
      if (!this.isAdminCenter) {
        this.innerColumns.pop();
      }
    }
    this.search();
  },
  mounted() {},
  watch: {
    "formData.parentFiledCode"(m, v) {
      // console.log(m);
      if (!m) {
        this.ChildList = [];
        this.formData.parentCode = "";
        this.curParentCode = "";
      }
      if (m) {
        this.handleChange(m);
      }
    },
  },
  methods: {
    btKeyUp(name) {
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
    },
    //
    handleClear() {
      this.ChildList = [];
    },
    handleChange(data) {
      if (!data) {
        this.ChildList = [];
        this.formData.parentCode = "";
        this.curParentCode = "";
      } else {
        //加载父级码值
        this.dictionaryChildListNoPage(data);
      }
      // console.log(data);
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
            // console.log(this.ChildList);
            // console.log(this.curParentCode);
            // console.log(this.formData);
            if (this.curParentCode) {
              this.formData.parentCode = this.curParentCode;
            }
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    //加载父级字段和父级码值
    dictionaryListNoPage() {
      this.$api
        .dictionaryListNoPage({
          //relationCode: this.relationCode,
        })
        .then((res) => {
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
        if (valid) {
          // console.log(this.formData.parentFiledCode);
          // console.log(this.formData.parentCode);
          if (this.formData.parentFiledCode && !this.formData.parentCode) {
            this.$Message.error("请选择父级码值");
            return;
          }
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
      // console.log(this.title);
      if (this.title == "新增对象字段") {
        /* if (!this.formData.parentFiledCode) {
          this.formData.parentFiledCode = this.parentFiledCode;
        } */
        this.formData.relationCode = this.relationCode;
        method = "dictionarycreateChild";
      } else if (this.title == "编辑对象字段") {
        this.formData.relationCode = this.relationCode;
        /*   if (!this.formData.parentFiledCode) {
          this.formData.parentFiledCode = this.parentFiledCode;
        } */
        method = "dictionaryupdateChild";
      } else if (this.title == "新增字段") {
        method = "dictionarycreate";
      } else if (this.title == "编辑字段") {
        method = "dictionaryupdate";
      }
      this.formData.systemType = 0;
      //this.formData.customerId =this.formData.customerIdAnd.split("/")[1]
      // this.formData.otherInfo20 =this.formData.customerIdAnd.split("/")[0]
      let option = this.formData;
      // console.log(this.formData);
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
            // console.log(this.formData);
            this.modelShow = false;
            if (this.title == "新增对象字段" || this.title == "编辑对象字段") {
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
      this.params2.page=1
         this.params2.pageSize=10
      this.params2.relationCode = currentRow.code;
       this.params2.parentId = currentRow.id;
      this.getDetailList();
    },
    dictionarydelete(row) {
      let content = "确认删除该数据？";
      if (this.selectIds.length === 0) {
        this.$Message.info("请至少选择一条数据");
      } else {
        this.$util.confirmDialog(this, "确认", content, (self) => {
          this.$api.dictionarydelete({ ids: this.selectIds }).then((res) => {
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
      this.$api.dictionaryList(option).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          if (this.tableList[0]) {
            this.params2.relationCode = this.tableList[0].code;
             this.params2.parentId =this.tableList[0].id;
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
      console.log(this.params2);
      this.$api.dictionaryPageChild(this.params2).then((res) => {
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
      if (tit == "新增对象字段" || tit == "新增字段") {
        this.formData = {
          parentFiledCode: "",
          parentCode: "",
          name: "",
          code: "",
        };
      }
      this.title = tit;
      // console.log(this.formData);
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
      if (this.title == "新增对象字段" || this.title == "编辑对象字段") {
        this.isChild = true;
        this.dictionaryListNoPage();
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
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.dictionarydelete(params).then((res) => {
          if (res.code == 0) {
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
  components: {
    innerManage,
  },
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
