<template>
  <Form
    ref="formData"
    :model="formData"
    :rules="ruleValidate"
    :label-width="110"
  >
    <Row class="user-row">
      <!-- <Col span="11">
                <FormItem :label="$context.$t('system.userNo')+':'" prop="userNo">
                    <Input    v-model="formData.userNo" :placeholder="$context.$t('pleaseEnter')+$context.$t('system.userNo')" :maxlength="20"/>
                </FormItem>
            </Col> -->
      <Col span="11">
        <FormItem label="中文名称" prop="name">
          <Input
            v-model="formData.name"
            placeholder="请输入中文名称"
            :maxlength="100"
          />
        </FormItem>
      </Col>
      <Col v-show="!isChild" span="11" offset="1">
        <FormItem label="英文名称" prop="code" class="ivu-form-item-required">
          <Input
            v-model="formData.code"
            placeholder="请输入英文名称"
            :disabled="formData.isdisabled"
          />
        </FormItem>
      </Col>
      <Col v-show="isChild" span="11" offset="1">
        <FormItem label="编码" prop="code" class="ivu-form-item-required">
          <Input
            v-model="formData.code"
            placeholder="请输入编码"
            :disabled="formData.isdisabled"
          />
        </FormItem>
      </Col>
      <Col v-show="isChild" span="11">
        <FormItem label="父级字段">
          <Select
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
            transfer
            v-model="formData.parentCode"
            placeholder="请选择父级码值"
          >
            <Option
              v-for="item in ChildList"
              :value="item.code"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>
<script>
export default {
  props: {
    formValidate: {
      type: Object,
      default: () => {
        return {};
      },
    },
    parentFiledCode: {
      type: String,
      default: () => {
        return "";
      },
    },
    roleList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    companyList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    const roleIds = (rule, value, callback) => {
      if (value.length === 0) {
        callback(
          new Error(this.$context.$t("roles") + this.$context.$t("noEmpty"))
        );
      } else {
        callback();
      }
    };
    return {
      parentNameList: [],
      ChildList: [],
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

        code: [{ required: true, message: "请输入英文名称", trigger: "blur" }],
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
      formData: {
        parentFiledCode: "",
        parentCode: "",
        name: "",
        code: "",
      },
    };
  },
  components: {},
  created: function () {
    this.formData = this.formValidate;
    // console.log(this.formValidate);
    /*  for (let i in this.formData) {
      if (this.formValidate[i]) {
        this.formData[i] = this.formValidate[i];
      }
    } */
  },
  mounted() {
    if (this.title == "新增对象字段" || this.title == "编辑对象字段") {
      this.isChild = true;
      this.dictionaryListNoPage();
    }
  },
  methods: {
    handleClear() {
      this.ChildList = [];
    },
    handleChange(data) {
      // console.log(data);
      this;
      //加载父级码值
      this.dictionaryChildListNoPage(data);
    },
    //加载父级字段和父级码值
    dictionaryChildListNoPage(parentFiledCode) {
      this.$api
        .dictionaryChildListNoPage({
          parentFiledCode: parentFiledCode,
        })
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            this.total = res.data.total;
            this.ChildList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    //加载父级字段和父级码值
    dictionaryListNoPage() {
      this.$api.dictionaryListNoPage().then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
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
        if (this.formData.parentFiledCode != this.parentFiledCode) {
          //父级设置高亮
          // console.log(this.formData.parentFiledCode);
        }
        if (!this.formData.parentFiledCode) {
          this.formData.parentFiledCode = this.parentFiledCode;
        }
        method = "dictionarycreateChild";
      } else if (this.title == "编辑对象字段") {
        if (!this.formData.parentFiledCode) {
          this.formData.parentFiledCode = this.parentFiledCode;
        }
        method = "dictionaryupdateChild";
      } else if (this.title == "新增字段") {
        this.formData.parentFiledCode = "";
        method = "dictionarycreate";
      } else if (this.title == "编辑字段") {
        this.formData.parentFiledCode = "";
        method = "dictionaryupdate";
      }
      this.formData.systemType = 0;
      //this.formData.customerId =this.formData.customerIdAnd.split("/")[1]
      // this.formData.otherInfo20 =this.formData.customerIdAnd.split("/")[0]
      let option = this.formData;
      // console.log(this.formData);
      let userRoleInSyses = [];
      //角色多选
      // for(let i=0;i<option.roleIds.length;i++){
      //     let userRoleInSysesObj= {
      //         "customerId": "",
      //         "deptId": option.deptId,
      //         "roleId": option.roleIds[i],
      //         "systemType": "0"
      //     };
      //     userRoleInSyses.push(userRoleInSysesObj)
      // }
      //角色单选
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
            if (this.formData.id) {
              //存下来当前编辑是哪条，删除新增则到第一页。
              //子集的编辑
              if (this.formData.parentFiledCode) {
                sessionStorage.setItem("curDictionaryData", this.formData.parentFiledCode);
              }
              this.$emit("finish", "");
            } else {
              //新建跳回第一页
              this.$emit("finish", 1);
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
    },
  },
  watch: {
    "formData.parentFiledCode"(m, v) {
      // console.log(m);
      if (m) {
        this.handleChange(m);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.ivu-form-item-error {
  margin-bottom: 20px;
}
.user-row {
  .ivu-form-item {
    margin-bottom: 20px;
  }
}
</style>
