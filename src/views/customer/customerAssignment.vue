<template>
  <div id="set-list" class="only-content header">
    <Form
      ref="formValidateGroup"
      :model="paramsGroup"
      inline
      :label-width="110"
      style="width: 100%"
    >
      <Row>
        <Col span="6">
          <FormItem prop="nameOrCode" label="客户编号">
            <Input
              @keyup.native="validse($event.target.value)"
              placeholder="请输入客户编号"
              v-model.trim="paramsGroup.code"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="nameOrCode" label="姓名">
            <Input
              placeholder="请输入姓名"
              v-model.trim="paramsGroup.name"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="联系电话">
            <Input
              style="width: 200px"
              v-model="paramsGroup.phoneNumber"
              placeholder="请输入联系电话"
            ></Input>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="nameOrCode" label="年龄">
            <Input
              placeholder="请输入年龄"
              v-model.trim="paramsGroup.age"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="customerId" label="所在地">
            <Select
              clearable
              filterable
              style="width: 200px"
              placeholder="请选择"
              v-model="paramsGroup.location"
            >
              <Option
                v-for="item in companyList"
                :value="item.creditCode"
                :key="item.creditCode"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="nameOrCode" label="推广人姓名">
            <Input
              placeholder="请输入推广人姓名"
              v-model.trim="paramsGroup.agentName"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="nameOrCode" label="推广人手机号码">
            <Input
              placeholder="请输入推广人手机号码"
              v-model.trim="paramsGroup.agentPhoneNumber"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="customerId" label="推广人管理机构">
            <Select
              clearable
              filterable
              style="width: 200px"
              placeholder="请选择"
              v-model="paramsGroup.agentOrgName"
            >
              <Option
                v-for="item in companyList"
                :value="item.orgName"
                :key="item.orgName"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem style="width: 100%" label="时间阶段">
            <DatePicker
            transfer
              style="width: 200px"
              type="daterange"
              v-model="dateList"
              @on-change="onDatePickerChange"
              placement="bottom-end"
              placeholder="请选择时间阶段"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="customerSource" label="用户来源">
            <Select
              transfer
              style="width: 200px"
              placeholder="请选择用户来源"
              v-model.trim="paramsGroup.customerSource"
              filterable
              clearable
            >
              <Option value="0">会员</Option>
              <Option value="1">非会员</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="年预算">
            <Select
              transfer
              style="width: 200px"
              placeholder="请选择年预算"
              v-model.trim="paramsGroup.budget"
              filterable
              clearable
            >
              <Option value="0">3000以下</Option>
              <Option value="1">5000以下</Option>
              <Option value="2">1万以下</Option>
              <Option value="3">其他</Option>
                <Option value="4">每年5000元-1万元</Option>
              <Option value="5">每年1万-5万元</Option>
              <Option value="6">每年5万元以上</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="customerId" label="需求场景">
            <Select
              clearable
              filterable
              style="width: 200px"
              placeholder="请选择问题编码"
              v-model="paramsGroup.questionCode"
            >
              <Option
                v-for="item in questionList"
                :value="item.questionCode"
                :key="item.questionCode"
                >{{ item.questionCode }}</Option
              >
            </Select>
          </FormItem>
        </Col>
          <Col span="6">
          <FormItem prop="customerId" label="保障对象">
            <Select
              style="width: 200px"
              placeholder="请选择保障对象"
              v-model="paramsGroup.safeguardTarget1"
                 multiple
            >
              <Option
                v-for="item in safeguardTargetList"
                :value="item.value"
                :key="item.value"
                >{{ item.text }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem prop="wechatNick" label="微信昵称">
            <Input
              placeholder="请输入微信昵称"
              v-model.trim="paramsGroup.wechatNick"
              style="width: 200px"
            />
          </FormItem>
        </Col>
        <Col span="4" style="float: right">
          <Button
            @click="search(1)"
            class="ivu-btn ivu-btn-primary"
            style="margin-right: 5px"
            >查询</Button
          >
          <Button @click="reset()">重置</Button>
        </Col>
      </Row>
    </Form>
    <Button  v-if="isAdminCenter || button.customer_listExport" type="primary" @click="exportAll">列表导出</Button>
    <Button  v-if="isAdminCenter || button.customer_trackExport" type="primary" @click="approval">轨迹导出</Button>
    <primaryTable
      :columns="deptColumns"
      :data="deptTableList"
      ref="primaryTable"
      :total="deptTotal"
      :pageSize="deptPageSize"
      @on-change="changePageDept"
      @on-selection-change="selectionChange"
      @on-page-size-change="
        (size) => {
          pageSize = size;
          search(1);
        }
      "
      :loading="deptTableload"
      :current.sync="deptPage"
      style="margin-top: 10px"
    ></primaryTable>
    <Modal
      v-model.trim="shareModelShow"
      :title="modalTitle"
      :loading="true"
      :closable="false"
      :width="900"
      :mask-closable="false"
    >
      <Form
        ref="shareInfo"
        :model="shareInfo"
        :label-width="90"
        :rules="formRuleDept"
        style="margin: 10px"
      >
        <Row>
          <Col span="10" offset="1">
            <FormItem label="客户编号：" prop="deptCode">
              {{ shareInfo.code }}
            </FormItem>
          </Col>
          <Col span="10" offset="2">
            <FormItem label="姓名：" prop="deptName">
              {{ shareInfo.name }}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10" offset="1">
            <FormItem label="手机号：" prop="deptCode">
              {{ shareInfo.phoneNumber }}
            </FormItem>
          </Col>
          <Col span="10" offset="2">
            <FormItem label="所在地：" prop="deptName">
              {{ shareInfo.location }}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <!-- 客户分配 -->
          <Col v-show="modalTitle == '分配说明'" span="22" offset="1">
            <FormItem label="分配说明：" prop="sharedDesc">
              <Input
                type="textarea"
                v-model.trim="shareInfo.sharedDesc"
                maxlength="200"
              />
            </FormItem>
          </Col>
          <!-- 需求场景查看 -->
          <Col v-show="modalTitle == '需求场景'" span="22" offset="1">
            <FormItem label="选择需求：" prop="auditOpinion1">
              <Table border :columns="sharedColumns" :data="sharedList"></Table>
            </FormItem>
          </Col>
          <!-- 用户足迹 -->
          <Col v-show="modalTitle == '用户足迹'" span="22" offset="1">
            <FormItem label="所在群：">
              <Table border :columns="tracksColumns" :data="tracksList"></Table>
            </FormItem>
          </Col>
          <!-- 活动参与 -->
          <Col v-show="modalTitle == '活动参与'" span="22" offset="1">
            <FormItem label="参与活动：">
              <Table border
                :columns="activitiesColumns"
                :data="activitiesList"
              ></Table>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button
          v-show="modalTitle == '分配说明'"
          type="primary"
          @click="agreeDept"
          >确认</Button
        >
        <Button v-show="modalTitle == '分配说明'" @click="closeDept"
          >取消</Button
        >
        <Button v-show="modalTitle != '分配说明'" @click="closeDept"
          >关闭</Button
        >
      </div>
    </Modal>
    <Modal
      v-model.trim="modalBatch"
      title="批量审批"
      :loading="true"
      :closable="false"
      :width="450"
      class="modalBatch"
    >
      <div slot="footer">
        <Button @click="modalBatch = false">返回</Button>
        <Button type="primary" @click="agreeDeptAll(0)">审批通过</Button>
        <Button @click="agreeDeptAll(1)">审批不通过</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
let wx = window.wx;
import { dateTransfer} from "@/api/sm4";
export default {
  name: "setCheck",
  data() {
    return {
      config: "",
      agent_config: "",
      shareInfo: {
        sharedDesc: "",
      },
      tracksColumns: [
        {
          title: "会话ID",
          key: "roomId",
          align: "center",
          width: 90,
        },
        {
          title: "群名称",
          key: "roomName",
          align: "center",
        },
      ],
      manageList: [], //管理机构list
      tracksList: [],
      activitiesColumns: [
        {
          title: "活动类型",
          key: "activityFirstCategory",
          align: "center",
          minWidth: 90,
        },
        {
          title: "活动细分",
          key: "activitySecondCategory",
          align: "center",
          minWidth: 90,
        },
        {
          title: "活动主题",
          key: "activityTheme",
          align: "center",
          minWidth: 90,
        },
        {
          title: "活动场次",
          key: "activityAmount",
          align: "center",
          minWidth: 90,
        },
        {
          title: "活动地点",
          key: "activityVenue",
          align: "center",
          minWidth: 230,
        },
        {
          title: "活动开始时间",
          key: "activityStartDate",
          align: "center",
          minWidth: 210,
        },
        {
          title: "活动结束时间",
          key: "activityStartDate",
          align: "center",
          minWidth: 190,
        },
      ],
      activitiesList: [],
      sharedColumns: [
        {
          title: "问题编号",
          key: "questionCode",
          align: "center",
          width: 90,
        },
        {
          title: "内容",
          key: "question",
          align: "center",
        },
      ],
      sharedList: [],
      questionList: [],
      safeguardTargetList:[
          {
          value: 0,
          text: "给自己",
        },
        {
          value: 1,
          text: "给父母",
        },
        {
          value: 2,
          text: "给子女",
        },
        {
          value: 3,
          text: "给配偶",
        },
      ],
      dateList: [],
      selectNum: [],
      formValidate1: {
        isAdd: 1,
        relCustomerCode: "",
        relCustomerId: "",
        parentCode: "",
        parentId: "",
        relDeptCode: "",
        relDeptName: "",
        agentInfoId: "",
        agentCode: "",
        agentName: "",
        rankCode: "",
        foundStatus: "",
        foundDate: "",
        // foundDate:"",
        recommendId: "",
        recommendCode: "",
        recommendName: "",
        deptPhone: "",
        directlyStatus: "",
        phone: "",
      },
      tabIndex: "1",
      modalForm_areaApply: false,
      deptCode: "",
      deptName: "",
      auditNo: "",
      modalBatch: false,
      taskId: null,
      objKey: null,
      process: null,
      remarks: null,
      labelDept: {
        code: "营业区代码",
        name: "营业区名称",
        opinion: "审批意见",
      },
      labelGroup: {
        code: "营业组代码",
        name: "营业组名称",
        opinion: "审批意见",
      },
      button: this.$store.state.app.button,
      auditModal: false,
      auditList: [
        {
          name: "中支机构人管提交",
          state: "0",
          active: true,
          auditor: "审核人1",
          auditTime: "",
          remake: "蛇和意见",
        },
        {
          name: "中支机构个险经理",
          state: "1",
          active: true,
          auditor: "审核人1",
          auditTime: "",
          remake: "蛇和意见",
        },
        {
          name: "分公司人管提交",
          state: "0",
          active: false,
          auditor: "审核人2",
          auditTime: "",
          remake: "蛇和意见",
        },
        {
          name: "分公司个险部经理",
          state: "0",
          active: false,
          auditor: "审核人4",
          auditTime: "",
          remake: "蛇和意见",
        },
        {
          name: "总公司人管室经理",
          state: "0",
          active: false,
          auditor: "审核人5",
          auditTime: "",
          remake: "蛇和意见",
        },
      ],
      paramsDept: {},
      paramsGroup: {
        wechatNick: "",
        location: "",
        agentName: "",
        code: "",
        budget: "",
        phoneNumber: "",
        nameOrCode: "",
        agentOrgName: "",
        questionCode: "",
        customerSource: "",
        dateType: "",
        date: [],
        startTime: null,
        endTime: null,
        safeguardTargetArr:[]//保障对象
      },
      manageOrgListAll: [],
      saleOrgListAll: [],
      manageCompanyList: [],
      deptColumns: [
        {
          type: "selection",
          align: "center",
          fixed: "left",
          width: 70,
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 80,
        },
        {
          title: "客户编号",
          key: "code",
          align: "center",
          minWidth: 180,
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          minWidth: 110,
        },
        {
          title: "性别",
          key: "gender",
          align: "center",
          minWidth: 60,
          render: (h, params) => {
            if (params.row.gender == 0) {
              return h("div", "男");
            } else {
              return h("div", "女");
            }
          },
        },
        {
          title: "微信昵称",
          key: "wechatNick",
          align: "center",
          minWidth: 150,
        },
        {
          title: "年龄",
          key: "age",
          align: "center",
          minWidth: 60,
        },
        {
          title: "保障对象",
          key: "safeguardTarget",
          align: "center",
          minWidth: 200,
        },
        {
          title: "联系电话",
          key: "phoneNumber",
          align: "center",
          minWidth: 150,
        },
        {
          title: "所在地",
          key: "location",
          align: "center",
          minWidth: 180,
        },
        {
          title: "年预算",
          key: "budget",
          align: "center",
          minWidth: 180,
          render: (h, params) => {
            let text = "";
            if (params.row.budget === "0" || params.row.budget == 0) {
              text = "3000以下";
            } else if (params.row.budget == "1") {
              text = "5000以下";
            } else if (params.row.budget == "2") {
              text = "1万以下";
            } else if (params.row.budget == "3") {
              text = "其他";
            } else if (params.row.budget == "4") {
              text = "每年5000元-1万元";
            } else if (params.row.budget == "5") {
              text = "每年1万-5万元";
            } else if (params.row.budget == "6") {
              text = "每年5万元以上";
            }
            return h("span", text);
          },
        },
        {
          title: "推广人员",
          key: "agentName",
          align: "center",
          minWidth: 180,
        },
        {
          title: "推广人员管理机构",
          key: "agentOrgName",
          align: "center",
          minWidth: 180,
        },
        {
          title: "推广人员手机号",
          key: "agentPhoneNumber",
          align: "center",
          minWidth: 180,
        },
        {
          title: "推广页面",
          key: "extendPage",
          align: "center",
          minWidth: 150,
        },
        {
          title: "用户来源",
          key: "customerSource",
          align: "center",
          minWidth: 180,
          render: (h, params) => {
            let text = "";
            if (params.row.customerSource === "0" || params.row.customerSource == 0) {
              text = "会员";
            } else if (params.row.customerSource == "1") {
              text = "非会员";
            }
            return h("span", text);
          },
        },
        {
          title: "创建时间",
          key: "createdDate",
          align: "center",
          minWidth: 180,
           render: (h, params) => {
            if (params.row.createdDate) {
              return h("div", dateTransfer(params.row.createdDate));
            }
          },
        },
        {
          fixed: "right",
          title: "需求场景",
          key: "agentName",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.customer_scenario) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    on: {
                      click: () => {
                        this.shareModel(params.row, "需求场景");
                      },
                    },
                  },
                  "查看"
                )
              );
            }
            return h("div", arr);
          },
        },
        {
          fixed: "right",
          title: "分配说明",
          key: "sharedDesc",
          align: "center",
          minWidth: 200,
          render: (h, params) => {
            let arr = [];
            arr.push(h("span", params.row.sharedDesc));
            if (this.isAdminCenter || this.button.customer_distribution) {
              arr.push(
              h(
                "Icon",
                {
                  domProps: {
                    // 添加标签,使用自己引入的iconfont图标
                    innerHTML: "<i class='iconfont icon-pen'></i>",
                  },
                  style: {
                    marginLeft: "10px",
                    fontSize: "18px", // 改变icon的样式
                    color: "#559DF9",
                    verticalAlign: "baseline",
                    cursor: "pointer",
                  },
                  on: {
                    click: () => {
                      this.shareModel(params.row, "分配说明");
                    },
                  },
                }
              )
            );
            }
            return h("div", arr);
          },
        },
        /*  {
          title: "审批状态",
          key: "checkStatus",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            let status = "发起流程";
            if (params.row.deleteReason == "发起流程") {
              return h("span", status);
            }
            return h("span", status);
          },
        }, */
        {
          title: "操作",
          key: "operation",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.customer_footprint) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    on: {
                      click: () => {
                        this.shareModel(params.row, "用户足迹");
                      },
                    },
                  },
                  "用户足迹"
                )
              );
            }
            if (this.isAdminCenter || this.button.customer_activity) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: {
                      marginRight: "5px",
                    },
                    on: {
                      click: () => {
                        this.shareModel(params.row, "活动参与");
                      },
                    },
                  },
                  "活动参与"
                )
              );
            }
            return h("div", arr);
          },
        },
      ],
      modalTitle: "",
      deptTableList: [],
      deptTotal: 0,
      deptPageSize: 10,
      deptPage: 1,
      deptTableload: false,
      shareModelShow: false,
      modalGroup: false,
      modalTitle: "",
      pageSize: "10",
      companyList: [],
      formDept: {},
      formGroup: {},
      formRuleDept: {
        sharedDesc: [this.$util.rules.required()],
      },
      formRuleGroup: {
        code: [this.$util.rules.required()],
        name: [this.$util.rules.required()],
      },
      isAdminCenter: false,
    };
  },
  created() {
    //this.getConfig("config");
   // this.companyConfigInit()
   /*  wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: "", // 必填，企业微信的corpID
      timestamp: "", // 必填，生成签名的时间戳
      nonceStr: "", // 必填，生成签名的随机串
      signature: "", // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: [], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    });
    wx.ready(function () {
      console.log("wxwxwx");
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    }); */
  },
  mounted() {
    this.getManageOrgList();
    this.getCompanyList();
    this.getQuestionList();
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.roleId = JSON.parse(window.sessionStorage.getItem("userRoleInSyses"));
    this.roleId = this.roleId[0].roleId;
    this.search();
    if (
      !this.button.customer_footprint &&
      !this.button.customer_activity
    ) {
      if (!this.isAdminCenter) {
        this.deptColumns.pop();
      }
    }
  },
  methods: {
    //
    //获取相关验证配置信息
    getConfig(type) {
      let url = "获取config或agentConfig配置的参数接口";
      //该paramUrl 为你使用微信sdk-js相关接口的页面地址 该地址需要配置到应用后台的可信域名下
      let paramUrl = window.location.href.split("#")[0];
      let that = this;
      let param = { url: paramUrl };
      if (type === "agent_config") {
        param.type = type;
      }
       this.$api.getCompanyList({
          params: param,
        }).then((res) => {
        if (res.respCode == "0") {
            that[type] = res.data;
           /*  if (type === "config") { */
              that.companyConfigInit(that[type]);
          /*   } else {
              that.appConfigInit(that[type]);
            } */
        } else {
          this.$Message.error(res.message);
        }
      });
    },

    //企业验证配置
    companyConfigInit() {
      let that = this;
      wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'ww0e8640b4eef0a19c', // 必填，企业微信的corpID
        timestamp: "", // 必填，生成签名的时间戳
        nonceStr: "", // 必填，生成签名的随机串
        signature:"xHwxrZ256n4FnfCvT07WeA1qrL92LDFG8gcnncuJYrk", // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: [], //你要调用的sdk接口
      });
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
      // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，
      // 则须把相关接口放在ready函数中调用来确保正确执行。
      // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

      wx.ready(function () {
        console.log("555");
        //执行你的业务逻辑代码
        //......
        //如果要使用到agent_config相关接口 初始化agentConfig配置
       // that.getConfig("agent_config");
      });
      wx.error(function (res) {
         console.log("6666");
        console.log(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败
        // ，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
        // 对于SPA可以在这里更新签名。
      });
    },
    //应用验证配置
    appConfigInit(config) {
      let that = this;
      wx.agentConfig({
        corpid: config.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: config.agentid, // 必填，企业微信的应用id （e.g. 1000247）
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
        jsApiList: [], //你要调用的sdk接口必填

        success: function () {
          //查看相关接口是否可以调用
          //that.checkJsApi();
        },
        fail: function (res) {
          if (res.errMsg.indexOf("function not exist") > -1) {
            alert("版本过低请升级");
          }
        },
      });
    },
    //查看可调用的接口
    checkJsApi() {
      wx.checkJsApi({
        jsApiList: [], // 需要检测的JS接口列表
        success: function (res) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          let obj = res.checkResult;
          alert(
            obj["getCurExternalContact"] +
              "," +
              obj["getContext"] +
              "," +
              obj["agentConfig"] +
              "," +
              obj["selectExternalContact"] +
              ","
          );
        },
      });
    },
    //
    validse(value) {
      this.paramsGroup.code = value.replace(/\s+/g, "");
    },
    exportAll() {
      this.$api
        .customerSharExport(this.paramsGroup)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "客户分配信息.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    shareModel(row, type) {
      this.modalTitle = type;
      this.shareModelShow = true;
      this.shareInfo = JSON.parse(JSON.stringify(row));
      if (type == "需求场景") {
        this.sharedQuestionList(row.id);
      } else if (type == "用户足迹") {
        this.sharedTracksList(row.id);
      } else if (type == "活动参与") {
        this.sharedaActivitiesList(row.id);
      }
    },
    onDatePickerChange(val) {
      if (val[0]) {
        this.paramsGroup.startTime = val[0];
        this.paramsGroup.endTime = val[1];
      } else {
        this.paramsGroup.startTime = null;
        this.paramsGroup.endTime = null;
      }
    },
    getManageOrgList() {
      this.$api.getManageOrgList({}).then((res) => {
        if (res.result == "0") {
          this.manageList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    approval() {
      if (this.selectNum.length === 0) {
        return this.$Message.warning("请先选择数据");
      }
      let params = { ids: [], systemType: 0 };
      this.selectNum.map((s) => {
        params.ids.push(s.id);
      });
      this.$api
        .exportTracks(params)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "轨迹信息.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    selectionChange(row) {
      console.log(row);
      this.selectNum = row;
    },
    //关闭弹框
    close() {
      this.$refs.formValidate1.resetForm();
      this.formValidate1 = {
        isAdd: 1,
        relCustomerCode: "",
        relCustomerId: "",
        parentCode: "",
        parentId: "",
        relDeptCode: "",
        relDeptName: "",
        agentInfoId: "",
        agentCode: "",
        agentName: "",
        rankCode: "",
        foundStatus: "",
        foundDate: "",
        // foundDate:"",
        recommendId: "",
        recommendCode: "",
        recommendName: "",
        deptPhone: "",
        directlyStatus: "",
      };
      this.modalForm_areaApply = false;
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
    //获取问题列表
    getQuestionList() {
      this.$api.getQuestionList({}).then((res) => {
        if (res.respCode == "0") {
          this.questionList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获取关联的问题列表
    sharedQuestionList(id) {
      this.$api
        .sharedQuestionList({
          id: id,
        })
        .then((res) => {
          if (res.respCode == "0") {
            this.sharedList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    //获取用户足迹列表
    sharedTracksList(id) {
      this.$api
        .sharedTracksList({
          id: id,
        })
        .then((res) => {
          if (res.respCode == "0") {
            this.tracksList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    //获取用户参与的活动列表
    sharedaActivitiesList(id) {
      this.$api
        .sharedaActivitiesList({
          id: id,
        })
        .then((res) => {
          if (res.respCode == "0") {
            this.activitiesList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    search(page) {
      if (!page) {
        page = "1";
      }
      //this.deptTableload = true;
      let _self = this;
      this.paramsGroup.page = page;
      this.paramsGroup.pageSize = _self.pageSize;
      this.paramsGroup.safeguardTarget=this.paramsGroup.safeguardTargetArr.toString();
      /* if (this.paramsGroup.startTime) {
        this.paramsGroup.startDate = new Date(
          this.paramsGroup.startTime
        ).getTime();
      }
      if (this.paramsGroup.endTime) {
        this.paramsGroup.endDate = new Date(this.paramsGroup.endTime).getTime();
      } */
      delete this.paramsGroup.date;
      let safeguardTarget=_self.paramsGroup.safeguardTarget1
       if(safeguardTarget){
        safeguardTarget=safeguardTarget.join(',')
      } else{
        safeguardTarget=""
      }
        this.paramsGroup.safeguardTarget=safeguardTarget
      this.$api
        .customerSharedList(_self.paramsGroup)
        .then((res) => {
          this.deptTableload = false;
          console.log(res)
          if (res.respCode == 0 || res.result - 0 == 0) {
            if (res.data) {
              this.deptTableList = res.data.list;
              this.deptTotal = res.data.total;
            } else {
              this.deptTableList = [];
              this.deptTotal = 0;
            }
          } else {
            this.$Message.error(res.content ? res.content : res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    reset() {
      this.dateList=""
      this.paramsGroup.date = [];
       this.paramsGroup.safeguardTarget1=""
      this.paramsGroup.agentOrgName = "";
      this.paramsGroup.questionCode = "";
      this.paramsGroup.location = "";
      this.paramsGroup.startTime = null;
      this.paramsGroup.endTime = null;
      this.paramsGroup.code = "";
      this.paramsGroup.phoneNumber = "";
      this.paramsGroup.agentName = "";
      this.paramsGroup.customerSource = "";
      this.paramsGroup.budget = "";
      this.$refs.formValidateGroup.resetFields();
      this.paramsGroup.startTime = null;
      this.paramsGroup.endTime = null;
      this.paramsGroup.age=""
       this.paramsGroup.name=""
       this.paramsGroup.agentPhoneNumber="";
       this.paramsGroup.safeguardTargetArr=[];//保障对象
      this.search(1);
    },
    audit() {
      this.modalBatch = true;
    },
    checkGroup() {
      this.modalGroup = true;
    },
    // 查看营业区
    lookDept(row) {
      this.modalForm_areaApply = true;
      this.$api
        .getMarketById({
          id: row.deptId,
        })
        .then((res) => {
          if (res.result === "0") {
            console.log(res.content);
            this.formValidate1 = res.content;
            this.formValidate1.relCustomerCode = res.content.customerCode;
            this.formValidate1.relDeptCode = res.content.marketCode;
            this.formValidate1.relDeptName = res.content.marketName;
            this.formValidate1.agentCode = res.content.agentInfoCode;
            this.formValidate1.commitUser = res.content.modifiedUser;
            this.formValidate1.commitDate = res.content.modifiedDate;
            this.formValidate1.deptPhone = res.content.phone;
            this.formValidate1.foundStatus = res.content.foundStatus.toString();
            this.formValidate1.directlyStatus = res.content.directlyStatus.toString();
            // this.formValidate1.agentName = res.content.agentName
            // this.formValidate1.rankCode = res.content.rankCode
            // this.formValidate1.directlyStatus = res.content.directlyStatus
            // this.formValidate1.foundDate = res.content.foundDate

            console.log(this.formValidate1);
          }
        });
    },
    changePageDept(page) {
      this.search(page);
    },
    changePageGroup() {},
    checkLogDept(row) {
      this.auditModal = true;
      /*  this.$api.getActivityHis({processInstanceId:row.processInstanceId}).then(res=>{
                    if(res.respCode==0||(res.result)-0==0)
                    {
                        this.auditModal=true;
                        this.auditList = res.data;
                    }
                    else{
                        this.$Message.error(res.content?res.content:res.resultMessage);
                    }
                }).catch(error => {
                    this.$emit('error','');

                }) */
    },
    agreeDeptAll(flag) {
      let array = [];
      this.selectNum.map((item) => {
        let obj = {
          taskId: item.taskId,
          process: item.process,
          objKey: item.id,
          passFlag: flag,
          flag: 0,
        };
        array.push(obj);
      });
      this.$api
        .completeMyPersonalTaskBach(array)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success("操作成功");
            this.modalBatch = false;
            this.search();
          } else {
            this.$Message.error(res.content ? res.content : res.resultMessage);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    agreeDept() {
      if (!this.shareInfo.sharedDesc) {
        this.$Message.error("请填写分配说明");
        return;
      }
      let shareInfo = {
        id: this.shareInfo.id,
        sharedDesc: this.shareInfo.sharedDesc,
      };
      console.log(shareInfo);
      this.$api
        .pushShared(shareInfo)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success("分配成功");
            this.search();
            this.shareModelShow = false;
          } else {
            this.$Message.error(res.content ? res.content : res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    // 审批不通过（营业区）
    disAgreeDept() {
      let params = {
        taskId: this.taskId,
        process: this.process,
        objKey: this.objKey,
        user: "adminCenter",
        passFlag: 1,
        flag: 0,
        salesmanNo: this.salesmanNo,
        remarks: this.remarks,
      };
      this.$api
        .completeMyPersonalTask(params)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success("驳回成功");
            this.search();
            this.shareModelShow = false;
          } else {
            this.$Message.error(res.content ? res.content : res.resultMessage);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    agreeGroup() {},
    disAgreeGroup() {},
    closeDept() {
      this.shareModelShow = false;
    },
    closeGroup() {
      this.modalGroup = false;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 90%;
  height: 30px;
  line-height: 30px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 6px;
  text-align: center;
}
.bg-blue {
  background-color: #3399ff;
}
.bg-gray {
  background-color: #f2f2f2;
}
.ivu-input,
.ivu-select,
.ivu-date-picker {
  width: 162px;
}
</style>
