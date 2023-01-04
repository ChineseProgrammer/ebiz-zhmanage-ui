<template>
  <div id="set-list" class="only-content header">
    <Form
      ref="formValidateGroup"
      :model="queryDataDto"
      inline
      :label-width="110"
      style="width: 100%"
    >
      <Row class="box--flex">
        <FormItem prop="productName" label="产品名称">
          <Input
            v-model="queryDataDto.productName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="launchPlatForm" label="投放平台">
          <Input
            v-model="queryDataDto.launchPlatForm"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="resourceBit" label="资源位">
          <Input
            v-model="queryDataDto.resourceBit"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="advertisingVersion" label="广告版本">
          <Input
            v-model="queryDataDto.advertisingVersion"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="添加好友时间">
          <DatePicker
          transfer
            type="daterange"
            v-model="dateList"
            @on-change="onDatePickerChange"
            placement="bottom-end"
            placeholder="请选择添加好友时间"
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
    <Button v-if="isAdminCenter || button.queryDataExport" type="primary" @click="exportAll">批量导出</Button>
    <primaryTable
      :columns="deptColumns"
      :data="deptTableList"
      ref="primaryTable"
      :total="deptTotal"
       :current.sync="queryDataDto.page"
      :pageSize="queryDataDto.pageSize"
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
import { dateTransfer} from "@/api/sm4";
export default {
  name: "queryData",
  data() {
    return {
      queryDataDto:{},
      channelList:[],
      productActivityList:[],
      productList:[],
      dateList: [],
      selectNum: [],
      formValidate1: {
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
      button: this.$store.state.app.button,
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
          title: "添加好友时间",
          key: "addFriendTime",
          align: "center",
          minWidth: 180
        },
         {
          title: "微信昵称",
          key: "wechatNickname",
          align: "center",
          minWidth: 150,
        },
        {
          title: "微信ID",
          key: "wechatId",
          align: "center",
          minWidth: 180,
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center",
          minWidth: 60,
        },
       
        {
          title: "投放平台",
          key: "launchPlatForm",
          align: "center",
          minWidth: 180,
        },
         {
          title: "资源位",
          key: "resourceBit",
          align: "center",
          minWidth: 180,
        },
         {
          title: "广告版本",
          key: "advertisingVersion",
          align: "center",
          minWidth: 180,
        }
        
      ],
      modalTitle: "",
      deptTableList: [],
      deptTotal: 0,
      deptPageSize: 10,
      deptPage: 1,
      deptTableload: false,
      modalTitle: "",
      pageSize: 10,
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
    this.search()
  },
  mounted() {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.roleId = JSON.parse(window.sessionStorage.getItem("userRoleInSyses"));
    this.roleId = this.roleId[0].roleId;
  },
  watch: {
  },
  methods: {
    search(page) {
      if (!page) {
        page = 1;
      }
      let _self = this;
      this.queryDataDto.page = page;
      this.queryDataDto.pageSize =Number( _self.pageSize);
      this.$api
        .queryData(_self.queryDataDto)
        .then((res) => {
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
    exportAll() {
      this.$api
        .queryDataExport(this.queryDataDto)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "数据查询导出.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    onDatePickerChange(val) {
      if (val[0]) {
        this.queryDataDto.addFriendStartTime = val[0]+" 00:00:00";
        this.queryDataDto.addFriendEndTime = val[1]+" 23:59:59";
      } else {
        this.queryDataDto.addFriendStartTime = null;
        this.queryDataDto.addFriendEndTime = null;
      }
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
    reset() {
      this.queryDataDto.productName=""
      this.queryDataDto.launchPlatForm=""
      this.queryDataDto.resourceBit=""
      this.queryDataDto.advertisingVersion=""
      this.dateList=[]
      this.queryDataDto.addFriendStartTime = null;
      this.queryDataDto.addFriendEndTime = null;
      this.search(1);
    },
    changePageDept(page) {
      this.search(page);
    },
    changePageGroup() {},
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
