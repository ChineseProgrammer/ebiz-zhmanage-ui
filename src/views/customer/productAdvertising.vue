<template>
  <div id="set-list" class="only-content header">
    <Form
      ref="formValidateGroup"
      :model="paramsGroup"
      inline
      :label-width="110"
      style="width: 100%"
    >
      <Row class="box--flex">
          <FormItem prop="nameOrCode" label="产品名称">
              <Select
              clearable
              filterable
              v-model="paramsGroup.productCode"
              placeholder="请选择产品名称"
            >
              <Option
                v-for="(item, index) in productList"
                :value="item.productCode"
                :key="index"
                >{{ item.productName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="versionCode" label="产品版本名称">
            <Select
              clearable
              filterable
              v-model="paramsGroup.versionCode"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in versionList"
                :value="item.productVersionCode"
                :key="index"
                >{{ item.productVersionName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="productChannelCode1" label="渠道名称">
            <Select
              clearable
              filterable
              v-model="paramsGroup.productChannelCode1"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in channelList"
                :value="item.id"
                :key="index"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="productActivityCode" label="活动名称">
            <Select
              clearable
              filterable
              v-model="paramsGroup.productActivityCode"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in productActivityList"
                :value="item.activityCode"
                :key="index"
                >{{ item.activityName }}</Option
              >
            </Select>
          </FormItem>
           <FormItem label="留资日期">
            <DatePicker
            transfer
              type="daterange"
              v-model="dateList2"
              @on-change="onDatePickerChange2"
              placement="bottom-end"
              placeholder="请选择留资日期"
            ></DatePicker>
          </FormItem>
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
    <Button v-if="isAdminCenter || button.product_promotionExport" type="primary" @click="exportAll">批量导出</Button>
    <!-- <Button
    v-if="isAdminCenter || button.channel_activity"
          @click="promotion"
          class="custom"
          >渠道活动码表</Button
        >
         <Button
         v-if="isAdminCenter || button.product_link"
          @click="productLink"
          class="custom"
          >产品链接配置</Button
        > -->
    <primaryTable
      :columns="deptColumns"
      :data="deptTableList"
      ref="primaryTable"
      :total="deptTotal"
       :current.sync="paramsGroup.page"
      :pageSize="paramsGroup.pageSize"
      @on-change="changePageDept"
      @on-selection-change="selectionChange"
      @on-page-size-change="
        (size) => {
          pageSize = size;
          search(1);
        }
      "
      :loading="deptTableload"
      style="margin-top: 10px"
    ></primaryTable>
  </div>
</template>

<script>
let wx = window.wx;
import { dateTransfer} from "@/api/sm4";
export default {
  name: "setCheck",
  data() {
    return {
      parentNameList:{},
      channelList:[],
      productActivityList:[],
      productList:[],
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
      dateList: [],
      dateList2: [],
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
        page:1,
        pageSize:10,
        location: "",
        agentName: "",
        productCode: "",
        budget: "",
        phoneNumber: "",
        nameOrCode: "",
        organizationName: "",
        questionCode: "",
        customerSource: "",
        dateType: "",
        date: [],
        registerTimeStart: null,
        registerTimeEnd: null,
      },
      manageOrgListAll: [],
      saleOrgListAll: [],
      manageCompanyList: [],
      deptColumns: [
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 80,
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
          title: "年龄",
          key: "age",
          align: "center",
          minWidth: 60,
        },
        {
          title: "联系电话",
          key: "phoneNumber",
          align: "center",
          minWidth: 150,
        },
        {
          title: "基本保额（万元）",
          key: "basicCoverage",
          align: "center",
          minWidth: 180,
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center",
          minWidth: 180,
        },
         {
          title: "产品版本名称",
          key: "productVersionName",
          align: "center",
          minWidth: 180,
        },
         {
          title: "渠道名称",
          key: "channelName",
          align: "center",
          minWidth: 180,
        },
         {
          title: "活动名称",
          key: "activityName",
          align: "center",
          minWidth: 180,
        },
        {
          title: "推广三级渠道",
          key: "sourceId",
          align: "center",
          minWidth: 180,
          // 匹配渠道名称
          render: (h, params) => {
            let name = params.row.sourceId;
            this.parentNameList.map(relation =>{
              if(relation.code == params.row.sourceId){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
           {
          title: "留资日期",
          key: "retainedCapitalDate",
          align: "center",
          minWidth: 180,
            render: (h, params) => {
            if (params.row.retainedCapitalDate) {
              return h("div", dateTransfer(params.row.retainedCapitalDate));
            }
          },
        }
      ],
      modalTitle: "",
      versionList:[], 
      deptTableList: [],
      deptTotal: 0,
      deptPageSize: 10,
      deptPage: 1,
      deptTableload: false,
      shareModelShow: false,
      modalGroup: false,
      modalTitle: "",
      pageSize: 10,
      companyList: [],
      formDept: {},
      formGroup: {},
      formRuleDept: {
        sharedDesc: [this.$util.rules.required()],
      },
      formRuleGroup: {
        productName: [this.$util.rules.required()],
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
    this.productAdvertisementChannelList()
    this.productAdvertisementInfoList();
    this.getManageOrgList();
    this.getCompanyList();
    this.getQuestionList();
    this.dictionaryListNoPage();
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.roleId = JSON.parse(window.sessionStorage.getItem("userRoleInSyses"));
    this.roleId = this.roleId[0].roleId;
    this.search();
  },
    watch: {
    "paramsGroup.productCode"(o) {
      if (o) {
        //查询产品版本名称
        this.$api
          .getByProductCode({
            productCode: o,
          })
          .then((res) => {
            if (res.respCode == "0") {
              this.versionList = res.data;
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          });
      } else {
        this.versionList = [];
         this.paramsGroup.versionCode=''
      }
    },
    "paramsGroup.productChannelCode1"(o) {
      if (o) {
        //查询活动名称
        this.$api
          .productAdvertisementActivityList({
            channelId: o,
          })
          .then((res) => {
            if (res.respCode == "0") {
              this.productActivityList = res.data;
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          });
      } else {
        this.productActivityList = [];
           this.paramsGroup.productActivityCode=''
      }
    },
  },
  methods: {
        // 获取渠道名称
    productAdvertisementChannelList() {
      this.$api.productAdvertisementChannelList({}).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.channelList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
     //获取产品名称
    productAdvertisementInfoList() {
      this.$api.productAdvertisementInfoList({}).then((res) => {
        if (res.respCode == "0") {
          this.productList = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
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
    exportAll() {
      this.$api
        .product_promotionExport(this.paramsGroup)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "产品广告信息.xlsx";
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
        this.paramsGroup.registerTimeStart = val[0]+" 00:00:00";
        this.paramsGroup.registerTimeEnd = val[1]+" 23:59:59";
      } else {
        this.paramsGroup.registerTimeStart = null;
        this.paramsGroup.registerTimeEnd = null;
      }
    },
      onDatePickerChange2(val) {
      if (val[0]) {
        this.paramsGroup.retainedCapitalDateStart = val[0]+" 00:00:00";
        this.paramsGroup.retainedCapitalDateEnd = val[1]+" 23:59:59";
      } else {
        this.paramsGroup.retainedCapitalDateStart = null;
        this.paramsGroup.retainedCapitalDateEnd = null;
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
        //加载父级字段和父级码值
    dictionaryListNoPage() {
      this.$api
        .queryByRelationCode({
          relationCode: 'PromotionChannels',
        })
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            this.parentNameList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    search(page) {
      if (!page) {
        page = 1;
      }
      //this.deptTableload = true;
      let _self = this;
      this.paramsGroup.page = page;
      this.paramsGroup.pageSize =Number( _self.pageSize);
      /* if (this.paramsGroup.registerTimeStart) {
        this.paramsGroup.startDate = new Date(
          this.paramsGroup.registerTimeStart
        ).getTime();
      }
      if (this.paramsGroup.registerTimeEnd) {
        this.paramsGroup.endDate = new Date(this.paramsGroup.registerTimeEnd).getTime();
      } */
      delete this.paramsGroup.date;
      this.channelList.map((c)=>{
        if(this.paramsGroup.productChannelCode1==c.id ){
this.paramsGroup.productChannelCode=c.channelCode
        }
      })
      this.$api
        .product_promotion(_self.paramsGroup)
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
      this.paramsGroup.productCode=""
       this.paramsGroup.productChannelCode=""
        this.paramsGroup.productChannelCode1=""
         this.paramsGroup.productActivityCode=""
           this.paramsGroup.versionCode=""
      this.dateList=[]
      this.dateList2=[]
      this.paramsGroup.registerTimeStart = null;
      this.paramsGroup.registerTimeEnd = null;
      this.paramsGroup.retainedCapitalDateStart = null;
      this.paramsGroup.retainedCapitalDateEnd = null;
      this.paramsGroup.organizationName=""
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
