<template>
  <Form
    ref="formData"
    :model="formData"
    :rules="ruleValidate"
    :label-width="110"
  >
    <Row class='user-row'>
      <!-- <Col span="11">
                <FormItem :label="$context.$t('system.userNo')+':'" prop="userNo">
                    <Input    v-model="formData.userNo" :placeholder="$context.$t('pleaseEnter')+$context.$t('system.userNo')" :maxlength="20"/>
                </FormItem>
            </Col> -->
      <Col span="11">
        <FormItem label="用户账号" prop="userName">
          <Input
            v-model="formData.userName"
            placeholder="请输入用户账号"
            :disabled="formData.isdisabled"
          />
        </FormItem>
      </Col>
      <Col span="11" offset="1">
        <FormItem label="用户角色" prop="roleId" class="ivu-form-item-required">
          <Select v-model="formData.roleId" placeholder="请选择用户角色">
            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{
              item.roleName
            }}</Option>
          </Select>
        </FormItem>
      </Col>
      <Col span="11">
        <FormItem
          label="所属公司机构:"
          prop="customerIdAnd"
          class="ivu-form-item-required"
        >
          <Select
           :transfer='true'
            filterable
            v-model="formData.customerIdAnd"
            :placeholder="$context.$t('pleaseSelect') + '所属公司机构'"
          >
            <Option
              v-for="item in companyList"
              :value='item.creditCode+"/"+item.id'
              :key='item.creditCode+"/"+item.id'
              >{{ item.orgName }}</Option
            >
          </Select>
        </FormItem>
      </Col>

      <Col span="11" offset="1">
        <FormItem label="负责人姓名" prop="realName">
          <Input
            v-model="formData.realName"
            placeholder="请输入负责人姓名"
            :maxlength="100"
          />
        </FormItem>
      </Col>
      <Col span="11" >
        <FormItem
            label="所属部门:"
            prop="deptId"
            class="ivu-form-item-required"
          >
            <Select
            transfer
              filterable
              v-model="formData.deptId"
              :placeholder="$context.$t('pleaseSelect') + '所属公司机构'"
            >
              <Option v-for="item in deptList" :value="item.id" :key="item.id">{{
                item.deptName
              }}</Option>
            </Select>
          </FormItem>
        
      </Col>
      
      <Col span="11"  offset="1" >
      <FormItem label="身份证号" prop="otherInfo12">
        <Input
          v-model="formData.otherInfo12"
          placeholder="请输入"
        />
      </FormItem>
      </Col>
      <Col span="11">
        <FormItem label="邮箱" prop="email">
          <Input
            v-model="formData.email"
            placeholder="请输入邮箱"
            :maxlength="50"
          ></Input>
        </FormItem>
      </Col>
      <Col span="11" offset="1">
        <FormItem label="手机号码" prop="mobileNo">
          <Input
            v-model="formData.mobileNo"
            placeholder="请输入手机号码"
            :maxlength="11"
          ></Input>
        </FormItem>
      </Col>
      <!-- <Col span="11" >
        <FormItem label="默认密码" prop="password">
          <Input disabled value="123456"></Input>
        </FormItem>
      </Col> -->
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
    deptList: {
      type: Array,
      default: () => {
        return [];
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
      ruleValidate: {
        otherInfo12:[
          this.$util.rules.cardNo()
        ],
        userName: [
          { required: true, message: "请输入用户账号", trigger: "blur" },
          {
            pattern: "^[a-zA-Z0-9\u4e00-\u9fa5]{1,100}$",
            message: '用户账号应为100位以内的字符',
            trigger: "blur",
          },
        ],
        // userNo: [
        //     {required: true, message: this.$context.$t('system.userNo')+ this.$context.$t('noEmpty'), trigger: 'blur'},
        //     {pattern: "^\\w+$", message: this.$context.$t('checkList.underscores'), trigger: 'blur'}
        // ],
        realName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          this.$util.rules.max(100,'负责人姓名应为100位以内的字符')
        ],
        
        roleId: [
          { required: true, message: "请选择用户角色", trigger: "change" },
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
        mobileNo: [
          {required: true, message:"手机号码不能为空", trigger: 'blur'},
          {
            pattern: "^1\\d{10}$",
            message: this.$context.$t("checkList.correctPhone"),
            trigger: "blur",
          },
        ],
        email: [
          // {required: true, message: this.$context.$t('system.email')+this.$context.$t('noEmpty'), trigger: 'blur'},
          this.$util.rules.mail()
        ],
      },
      formData: {
        customerIdAnd:"",
        otherInfo12:'',
        userName: "",
        realName: "",
        roleId: "",
        mobileNo: "",
        deptId: "",
        email: "",
      },
    };
  },
  components: {},
  created: function() {
    for (let i in this.formData) {
      if (this.formValidate[i]) {
        this.formData[i] = this.formValidate[i];
      }
    }
    // 如果是编辑，setid，初始化已有的选项
    if (this.formValidate["id"]) {
      this.formData["id"] = this.formValidate["id"];
    }
  },
  mounted() {},
  methods: {
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
      //根据有无id判断是编辑还是添加
      let method = this.formData.id ? "updateUser" : "createUser";
      let Message = this.formData.id
        ? this.$context.$t("edit")
        : this.$context.$t("addUser");
      this.formData.systemType = 0;
      this.formData.customerId =this.formData.customerIdAnd.split("/")[1]
      this.formData.otherInfo20 =this.formData.customerIdAnd.split("/")[0]
      let option = this.formData;
      option.userNo = option.userName;
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
      let userRoleInSysesObj = [
        {
        customerId: {},
        deptId: {},
        roleId: {},
        systemType: "0",
        }
      ];
      userRoleInSysesObj[0].customerId=option.customerId;
      userRoleInSysesObj[0].deptId=option.deptId;
      userRoleInSysesObj[0].roleId=option.roleId;
      userRoleInSyses=userRoleInSysesObj;

      option.userRoleInSyses = userRoleInSyses;
      this.$api[method](option)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            if (this.formData.id) {
               this.$Message.success(Message + this.$context.$t("success"));
              this.$emit("finish", "");
            } else {
               this.$Message.success({
                    content: "新建用户成功，初始密码是"+res.content,
                    duration: 100,
                    closable: true
                });
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
};
</script>
<style lang="less" scoped>
.ivu-form-item-error {
  margin-bottom: 20px;
}
.user-row{
  .ivu-form-item {
    margin-bottom: 20px;
  }
}
</style>
