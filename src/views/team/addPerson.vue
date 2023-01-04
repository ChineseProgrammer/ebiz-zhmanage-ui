<template>
  <div id="add">
    <div class="person-head">
      <img src="../../assets/user.png" ref="head-photo" alt />
      <Upload
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg', 'jpeg', 'png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        action=" "
      >
        <Button type="default" class>
          上传头像
        </Button>
      </Upload>
    </div>
    <Form
      ref="fromValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="110"
      class="person-center"
    >
      <Row>
        <Col span="11">
          <FormItem label="推广人编码" prop="agentCode">
            <Input :disabled="isNew==2" v-model="formValidate.agentCode" placeholder="请输入推广人编码"></Input>
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="推广人姓名" prop="agentName">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.agentName" placeholder="请输入姓名" />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="推广人手机号" prop="mobilePhoneOne">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.mobilePhoneOne" placeholder="请输入手机号" maxlength="11" />
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="人员类型" prop="agentType">
            <Select
              filterable
              v-model="formValidate.agentType"
              placeholder="请选择"
              disabled
              @on-select="selectedSex(...arguments)"
            >
              <Option value="内勤">内勤</Option>
              <Option value="外勤">外勤</Option>
              <!-- <Option
                v-for="item in getUserType"
                :value="item.value"
                :key="item.value"
              >{{ item.text }}</Option-->
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="11" :class="{ isred: isProfessionCertificate }">
          <FormItem label="执业证编码" prop="professionCertificate">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.professionCertificate" placeholder="请输入执业证编码" />
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="企业微信userid" prop="wxUserId">
            <Input v-model="formValidate.wxUserId" readonly placeholder="请匹配人员">
              <Icon class="click-search" ref="userIdSearch" @click="userIdSearch" slot="suffix"></Icon>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="管理机构代码" prop="manageOrgCode">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.manageOrgCode" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="管理机构名称" prop="manageOrgName">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.manageOrgName" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="销售团队代码" prop="salesTeamCode">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.salesTeamCode" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="销售团队名称" prop="salesTeamName">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.salesTeamName" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="推广人性别" prop="sex">
            <Select :disabled="formValidate.agentType=='外勤'" filterable v-model="formValidate.sex" placeholder="请选择">
              <Option value="0">男</Option>
              <Option value="1">女</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="推广人职级" prop="agentLevel">
             <Input disabled v-model="formValidate.agentLevel" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="证件类型" prop="idType">
            <!-- <Select filterable v-model="formValidate.idType" disabled placeholder="请选择"> -->
            <Select filterable v-model="formValidate.idType" disabled placeholder="请选择">
              <Option value="身份证">身份证</Option>
              <Option value="台胞证">台胞证</Option>
              <Option value="军官证">军官证</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="证件号码" prop="idNo">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.idNo" placeholder="请输入" />
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="推荐人" prop="recommendName">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.recommendName" readonly placeholder="请输入">
              <Icon
                class="click-search"
                ref="recommendSearch"
                @click="recommendSearch"
                slot="suffix"
              ></Icon>
            </Input>
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="育成人" prop="fosterName">
            <Input :disabled="formValidate.agentType=='外勤'" v-model="formValidate.fosterName" readonly placeholder="请输入">
              <Icon
                class="click-search"
                ref="fosterNameSearch"
                @click="fosterNameSearch"
                slot="suffix"
              ></Icon>
            </Input>
          </FormItem>
        </Col>
        <Col span="11">
          <FormItem label="入职时间" prop="entryDate">
            <DatePicker
             :disabled="formValidate.agentType=='外勤'"
              :value="formValidate.entryDate"
              v-model="formValidate.entryDate"
              type="date"
              placeholder="请选择"
              format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="11" offset="1">
          <FormItem label="离职时间" prop="leaveDate">
            <DatePicker
             :disabled="formValidate.agentType=='外勤'"
              :value="formValidate.leaveDate"
              v-model="formValidate.leaveDate"
              type="date"
              placeholder="请选择"
              format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <FormItem class="button-block">
        <Button @click="back()">返回</Button>
        <Button type="primary" @click="submit()">确认保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import personForm from "./form/personForm";
export default {
  data() {
    return {
      imgUrl: "../../assets/user.png",
      uploadList: [],
      recommendName: null,
      fosterName: null,
      formValidate: {
        agentCode: "", // 推广人编码
        agentName: "", //推广人姓名
        mobilePhoneOne: "", //推广人手机号
        agentType: "", //人员类型
        professionCertificate: "", //执行证编码
        wxUserId: "", //企业微信 userId
        manageOrgCode: "", //管理机构代码
        manageOrgName: "", //管理机构名称
        salesTeamCode: "", //销售团队代码
        salesTeamName: "", //销售团队名称
        sex: "", //推广人性别
        agentLevel: "", //推广人职级
        idType: "身份证", //证件类型
        idNo: "", //证件号码
        recommendNo: "", //推荐人编码
        recommendName: "", //推荐人姓名
        fosterNo: "", //育成人编码
        fosterName: "", //育成人姓名
        entryDate: "", //入职时间
        leaveDate: "", //离职时间
        file: {}
      },
      isProfessionCertificate: false,
      // 人员类型
      getUserType: [
        {
          text: "内勤",
          value: "内勤"
        },
        {
          text: "外勤",
          value: "内勤"
        }
      ],
      ruleValidate: {
        agentCode: [
          { required: true, message: "推广人编码不能为空", trigger: "blur" }
        ],
        agentName: [
          { required: true, message: "推广人姓名不能为空", trigger: "blur" }
        ],
        mobilePhoneOne: [
          { required: true, message: "推广人手机号不能为空", trigger: "blur" },
          {
            pattern:
              "^1(3[0-9]|4[5-9]|5[0|1|2|3|5|6|7|8|9]|6[2|5|6|7]|7[0-8]|8[0|1|2|3|4|6|7|8|9]|9[0|1|2|3|5|6|7|8|9])\\d{8}$",
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        agentType: [
          { required: true, message: "人员类型不能为空", trigger: "change" }
        ],
        professionCertificate: [
          { required: false, message: "执行证编码不能为空", trigger: "blur" }
        ],
        manageOrgCode: [
          { required: true, message: "管理机构代码不能为空", trigger: "blur" }
        ],
        manageOrgName: [
          { required: true, message: "管理机构名称不能为空", trigger: "blur" }
        ],
        salesTeamCode: [
          { required: true, message: "销售团队代码不能为空", trigger: "blur" }
        ],
        salesTeamName: [
          { required: true, message: "销售团队名称不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "推广人性别不能为空", trigger: "change" }
        ],
        idNo: [this.$util.rules.cardNo()]
      },
      // 当前是编辑还是新增
      isNew: 1
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    'formValidate.wxUserId'(n){
      if((this.isNew==1)&&n){
          this.formValidate.agentCode=n
      }
    }
  },
  methods: {
    // 页面初始化
    init() {
      let thisUrl = window.location.href,
        thisSize = thisUrl.indexOf("?");
      if (thisSize > 0) {
        // 编辑情况下
        this.formValidate = JSON.parse(
          window.sessionStorage.getItem("personRow")
        );
        this.formValidate.idType = "身份证"; // 证件类型
        if (
          this.formValidate.entryDate != null &&
          this.formValidate.entryDate != "" &&
          this.formValidate.entryDate != "——"
        ) {
          this.formValidate.entryDate = new Date(this.formValidate.entryDate); //入职时间
        } else {
          this.formValidate.entryDate = "";
        }
        if (
          this.formValidate.leaveDate != null &&
          this.formValidate.leaveDate != "" &&
          this.formValidate.leaveDate != "——"
        ) {
          this.formValidate.leaveDate = new Date(this.formValidate.leaveDate); //离职时间
        } else {
          this.formValidate.leaveDate = "";
        }
         if (
          this.formValidate.agentImageUrl=='null'
        ) {
         this.formValidate.agentImageUrl="";
        }
        if (
          this.formValidate.agentImageUrl
        ) {
          this.$refs["head-photo"].src = this.formValidate.agentImageUrl;
        }
         if (
          !this.formValidate.wxUserId
        ) {
         this.formValidate.wxUserId="";
        }
        // 编辑
        this.isNew = 2;
      } else {
        // 新增情况下
        this.isNew = 1;
        this.formValidate.agentType = "内勤";
      }
    },
    selectedSex(data) {
      if (data.value == "外勤") {
        this.ruleValidate.professionCertificate[0].required = true;
        this.isProfessionCertificate = true;
      } else {
        this.ruleValidate.professionCertificate[0].required = false;
        this.$refs["fromValidate"].validateField(
          "professionCertificate",
          valid => ""
        );
        this.isProfessionCertificate = false;
      }
    },
    // 返回
    back() {
      this.$router.push({
        name: "team-list",
        query: { id: "1" }
      });
    },
    // 确认保存
    submit() {
      this.$refs.fromValidate.validate(valid => {
        if (valid) {
          this.savePerson();
        } else {
          this.$emit("error", "");
        }
      });
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    timeFormat(timestamp) {
      var time = new Date(timestamp);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return (
        year +
        "-" +
        this.add0(month) +
        "-" +
        this.add0(date) +
        " " +
        this.add0(hours) +
        ":" +
        this.add0(minutes) +
        ":" +
        this.add0(seconds)
      );
    },
    savePerson() {
      let beginDate =
        this.formValidate.entryDate == ""
          ? ""
          : new Date(this.formValidate.entryDate).getTime();
      let endDate =
        this.formValidate.leaveDate == ""
          ? ""
          : new Date(this.formValidate.leaveDate).getTime();
      if (beginDate && endDate && beginDate > endDate) {
        this.$Message.error("入职时间应该早于离职时间");
        return false;
      }
      if (
        this.formValidate.entryDate == "" ||
        this.formValidate.entryDate == "——" ||
        this.formValidate.entryDate == null
      ) {
        delete this.formValidate.entryDate;
      } else {
        this.formValidate.entryDate = new Date(this.formValidate.entryDate);
      }
      if (
        this.formValidate.leaveDate == "" ||
        this.formValidate.leaveDate == "——" ||
        this.formValidate.leaveDate == null
      ) {
        delete this.formValidate.leaveDate;
      } else {
        this.formValidate.leaveDate = new Date(this.formValidate.leaveDate);
      }
      this.formValidate.noEncryption=true;
      let reqData = this.formValidate;
      const formData = new FormData();
      Object.keys(reqData).forEach(key => {
        formData.append(key, reqData[key]);
      });
      console.log('8----------')
         formData.append('noEncryption', 'true')
         console.log(formData)
      // 编辑
      if (this.isNew != 1) {
        this.$api
          .editPerson(formData)
          .then(res => {
            if (res.respCode == 0) {
              this.$Message.success(res.message);
              this.$router.push({
                name: "team-list",
                query: { id: "1" }
              });
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(error => {
          });
      } else {
        // 新增
        this.$api
          .addPerson(formData)
          .then(res => {
            if (res.respCode == 0) {
              this.$Message.success(res.message);
              this.$router.push({
                name: "team-list",
                query: { id: "1" }
              });
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch(error => {
          });
      }
    },
    //   图片上传
    handleSuccess(res, file) {
      this.uploadList = file;
    },
    handleFormatError(file) {
      this.$Message.info("上传头像支持jpg,png格式");
    },
    handleMaxSize(file) {},
    handleBeforeUpload(file) {
      const check = this.uploadList.length < 2;
      if (!check) {
      } else {
        this.formValidate.file = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const _base64 = reader.result;
          this.$refs["head-photo"].src = _base64;
        };
        return false;
      }
      return check;
    },
    async userIdSearch() {
      let props = {},
        title = "选择人员";
      props.id = 1;
      let data = await this.$api.getSalesInfo({ page: 1, pageSize: 10 }),
        getDepartment = await this.$api.getDepartment({ orgName: null }),
        getCompany = await this.$api.getCompanyList({});
      props.tableData = data.content.list;
      props.total = data.content.pageVO.total;
      props.departmentList = getDepartment.content;
      props.OrgList = getCompany.content;
      props.labelWidth = 60;
      var params = {
        self: this,
        title: title,
        width: 800,
         height:800,
        props: props,
        form: personForm,
        success: res => {
          this.formValidate.wxUserId = res.code;
        },
        cancel: () => {}
      };
      this.$util.openModelForm(params, this);
    },
    async recommendSearch() {
      let props = {},
        title = "选择人员";
      props.id = 2;
      let data = await this.$api.getSalesmanPage({ page: 1, pageSize: 10 }),
        getManageOrg = await this.$api.getSalesmanManageOrgList({});
        console.log(data)
      props.tableData = data.content.list;
      props.total = data.content.total;
      props.manageOrgList = getManageOrg.content;
      var params = {
        self: this,
        title: title,
        width: 800,
        height:800,
        props: props,
        form: personForm,
        success: res => {
          this.recommendName = res.name + " / " + res.code;
          this.formValidate.recommendName = res.name;
          this.formValidate.recommendNo = res.code;
        },
        cancel: () => {}
      };
      this.$util.openModelForm(params, this);
    },
    async fosterNameSearch() {
      let props = {},
        title = "选择人员";
      props.id = 3;
      let data = await this.$api.getSalesmanPage({ page: 1, pageSize: 10 }),
        getManageOrg = await this.$api.getSalesmanManageOrgList({});
      props.tableData = data.content.list;
      props.total = data.content.total;
      props.manageOrgList = getManageOrg.content;
      var params = {
        self: this,
        title: title,
        width: 800,
         height:800,
        props: props,
        form: personForm,
        success: res => {
          this.fosterName = res.name + " / " + res.code;
          this.formValidate.fosterName = res.name;
          this.formValidate.fosterNo = res.code;
        },
        cancel: () => {}
      };
      this.$util.openModelForm(params, this);
    }
  },
  computed: {},
  components: {
    personForm
  }
};
</script>
<style lang="less" scoped>
#add {
  display: flex;
  .red {
    color: red;
    vertical-align: middle;
  }
  .person-head {
    width: 200px;
    flex: none;
    text-align: center;
    img {
      width: 128px;
      height: 128px;
      border-radius: 50%;
    }
    button {
      margin: 0px;
    }
  }
  .person-center {
    flex: 1;
    .click-search {
      width: 22px;
      height: 22px;
      margin: 5px;
      display: inline-block;
      background: url("../../assets/search-click.png") no-repeat;
      background-size: conver;
      background-size: 100% 100%;
    }
    /deep/.ivu-date-picker {
      width: 100%;
    }
    .button-block {
      text-align: center;
      margin: 20px 0px 20px -200px;
      button {
        width: 80px;
      }
    }
    .ivu-col {
      margin-bottom: 20px;
    }
    .isred {
      /deep/.ivu-form-item-label:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
      }
    }
  }
}
</style>
