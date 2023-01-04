<template>
  <div id="business-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form
        ref="formInline"
        :rules="rules"
        :model="searchBusiness"
        inline
        :label-width="100"
      >
        <FormItem prop="orderNo" label="订单号">
          <Input
            v-model.trim="searchBusiness.orderNo"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="applyCode" label="投保单号">
          <Input
            v-model.trim="searchBusiness.applyCode"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="holderName" label="投保人姓名">
          <Input
            v-model.trim="searchBusiness.holderName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="insuredName" label="被保人姓名">
          <Input
            v-model.trim="searchBusiness.insuredName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="insuredName" label="代理人名称">
          <Input
            v-model.trim="searchBusiness.agentName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem prop="holderName" label="代理人编码">
          <Input
            v-model.trim="searchBusiness.agentCode"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="管理机构名称">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.orgName"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in orgList"
              :value="item.orgName"
              :key="index"
              >{{ item.orgName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="source" label="是否自主投保">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.isAutonomy"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option value="1" key="1">是</Option>
            <Option value="0" key="0">否</Option>
          </Select>
        </FormItem>
        <FormItem label="产品名称">
          <Input
            v-model.trim="searchBusiness.productName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="被保人证件号码">
          <Input
            v-model.trim="searchBusiness.insuredCardNo"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="投保人证件号码">
          <Input
            v-model.trim="searchBusiness.holderCardNo"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="转人核时间">
          <DatePicker
            style="width: 160px"
            :clearable="false"
            v-model="searchBusiness.time"
            type="daterange"
          ></DatePicker>
        </FormItem>
        <!-- </i-col>
          <i-col span="4" class="fr"> -->
        <!-- <span style="margin-left: 100px"> -->
          <FormItem >
          <Button @click="changeFormSearch" type="primary">查询</Button>
          <Button @click="reset()">重置</Button>
          </FormItem>
        <!-- </span> -->
        <!-- </i-col>
        </Row> -->
      </Form>
    </div>
    <!-- 列表 -->
    <Button
      v-if="isAdminCenter || button.checkManagementNotExport" type="primary" style="margin-bottom: 10px"  @click="exportAll"
>导出</Button
    >
    <div>
      <primaryTable
        style="margin-top: 10px"
        :columns="columns"
        :data="tableList"
        :current.sync="paginationPolicy.page"
        ref="teamTable"
        :total="paginationPolicy.total"
        :pageSize="paginationPolicy.pageSize"
        @on-page-size-change="beForeFetchData(1, ...arguments)"
        @on-change="fetchData"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdminCenter: false,
      button: this.$store.state.app.button,
      //与投保人关系
      insuredRelationList: [
        { name: "本人", value: "0" },
        { name: "配偶", value: "1" },
        { name: "父亲", value: "3" },
        { name: "母亲", value: "4" },
        { name: "子女", value: "5" },
        { name: "祖父母", value: "7" },
        { name: "兄弟姐妹", value: "15" },
        { name: "孙子女", value: "17" },
        { name: "朋友", value: "27" },
        { name: "雇佣", value: "28" },
        { name: "其他", value: "30" },
      ],
      rules: {
        policyCode: [this.$util.rules.numberMax50()],
        orderNo: [this.$util.rules.numberCharMax50()],
        applyCode: [this.$util.rules.numberCharMax50()],
        holderCertificateNo: [this.$util.rules.cardNo()],
        holderPhone: [this.$util.rules.phone()],
        insuredPhone: [this.$util.rules.phone()],
        agentPhone: [this.$util.rules.phone()],
      },
      //更新form查询条件
      searchBusiness: {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        holderBirthday: [],
        holderBirthdayStartDate: "",
        holderBirthdayEndDate: "",
        holderCertificateNo: "",
        holderCertificateType: "",
        holderGender: "",
        holderName: "",
        holderPhone: "",
        insuredName: "",
        insuredPhone: "",
        liabilityCode: "",
        orderNo: "",
        organizationCode: "",
        policyCode: "",
        policyStatus: "",
      },
      //form查询条件
      searchBusinessOld: {
        agentCode: "",
        agentName: "",
        applyCode: "",
        approvalStatus: "",
        endTime: null,
        holderCardNo: "",
        holderName: "",
        insuredCardNo: "",
        insuredName: "",
        isAutonomy: "",
        orderNo: "",
        orgName: "",
        organizationName: "",
        productName: "",
        startIndex: 0,
        startTime: null,
      },
      // 分页数据--队伍查询
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      orgList: [], //机构list
      sourceList: [],
      liabilityList: [], //险种list
      queryPageSize: 10, //分页条数
      tableList: [],
      //表格
      columns: [
        {
          title: "订单号",
          key: "orderNo",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保单号",
          key: "applyCode",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "是否自主投保",
          key: "isAutonomy",
          align: "center",
          minWidth: 80,
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            let name = "";
            if (params.row.isAutonomy == "1") {
              name = "是";
            } else if (
              params.row.isAutonomy === "0" ||
              params.row.isAutonomy === 0
            ) {
              name = "否";
            }
            return h("div", name);
          },
        },
        {
          title: "产品名称（主险）",
          key: "productName",
          align: "center",
          minWidth: 120,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保人姓名",
          key: "holderName",
          align: "center",
          minWidth: 90,
        },
         {
          title: "投保人年龄",
          key: "holderAge",
          align: "center",
          minWidth: 90,
        },
        {
          title: "证件类型",
          key: "holderCertificateType",
          align: "center",
          minWidth: 120,
        },
        {
          title: "投保人证件号",
          key: "holderCertificateNo",
          align: "center",
          minWidth: 150,
        },
        {
          title: "被保人姓名",
          key: "insuredName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "被保人年龄",
          key: "insuredAge",
          align: "center",
          minWidth: 90,
        },
        {
          title: "证件类型",
          key: "insuredCertificateType",
          align: "center",
          minWidth: 90,
        },
        {
          title: "被保人证件号",
          key: "insuredCertificateNo",
          align: "center",
          minWidth: 150,
        },
        {
          title: "与投保人关系",
          key: "holderRelation",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            let name;
            this.insuredRelationList.map((relation) => {
              if (relation.value == params.row.holderRelation) {
                name = relation.name;
              }
            });
            return h("div", name);
          },
        },
         {
          title: "代理人编码",
          key: "agentCode",
          align: "center",
          minWidth: 90,
        },
        {
          title: "代理人名称",
          key: "agentName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "管理机构名称",
          key: "orgName",
          align: "center",
          minWidth: 130,
        },
        {
          title: "转人核原因",
          key: "reason",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            let hrzReason=params.row.hrzReason?'投保人:'+params.row.hrzReason:''
            let irzReason=params.row.irzReason?'被保人:'+params.row.irzReason:''
              return h('div', [
                  h('p',hrzReason),
                  h('p',irzReason)
              ]);
          }
        },
        {
          title: "转人核时间",
          key: "manualTime",
          align: "center",
          minWidth:150,
          render: (h, params) => {
            let hrzManualTime=params.row.hrzManualTime?'投保人:'+params.row.hrzManualTime:''
            let irzManualTime=params.row.irzManualTime?'被保人:'+params.row.irzManualTime:''
              return h('div', [
                  h('p',hrzManualTime),
                  h('p',irzManualTime)
              ]);
          }
        },
        {
          title: "操作",
          slot: "action",
          width: 170,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.businessCheck(params.row);
                    },
                  },
                },
                "审核"
              ),
            ]);
          },
        },
      ],
      certificateTypeList: [
        { name: "身份证", value: "00" },
        { name: "户口本", value: "01" },
        { name: "出生证", value: "02" },
        { name: "外国护照", value: "03" },
        { name: "军人证(军官证)", value: "04" },
        { name: "士兵证", value: "05" },
        { name: "警官证", value: "06" },
        { name: "台湾居民往来内陆通行证", value: "07" },
        { name: "港澳居民往来内陆通行证", value: "08" },
        { name: "中国护照", value: "09" },
        { name: "护照", value: "10" },
        { name: "无证件", value: "11" },
        { name: "其他", value: "12" },
        { name: "外国人永久居留身份证", value: "13" },
      ],
      policyStatusList: [
        { name: "部分未通过", value: "00" },
        { name: "全部通过", value: "20" },
        { name: "审批中", value: "21" },
        { name: "待审批", value: "22" },
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
    };
  },
  created: function () {
    console.log(this.button);
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (!this.button.checkManagementDetail) {
      console.log(this.button);
      if (!this.isAdminCenter) {
        console.log(this.button);
        this.columns.pop();
      }
    }
    this.fetchData();
    this.getLiabilityList();
    this.getOrgList();
  },
  mounted: function () {},
  watch: {},
  methods: {
    exportAll() {
      this.$api
        .exportNotApprovalTemplate(this.searchBusiness)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "待审批信息.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    //客户查询
    changeFormSearch() {
      if (this.searchBusiness.time && this.searchBusiness.time[0]) {
        this.searchBusiness.startTime = this.searchBusiness.time[0].getTime();
        this.searchBusiness.endTime = this.searchBusiness.time[1].getTime();
      }
      this.searchBusinessOld = this.$util.convertObj(this.searchBusiness);
      this.fetchData();
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchData(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { teamTotal, page } = this.paginationPolicy;
      if ((page - 1) * queryPageSize > teamTotal) {
        this.$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchBusinessOld,
        page,
        pageSize: this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      //notApprovalPage  getPolicyPage
      this.$api.notApprovalPage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list.map((el) => {
            el.chargePeriod = [
              "无关",
              "趸交",
              "按年限交",
              "按年交至某确定年龄",
              "终生交费",
              "不定期交",
              "按月交",
            ][el.chargePeriod];
            el.coveragePeriod = [
              "无关",
              "保终身",
              "按年限保",
              "保至某确定年龄",
              "按月保",
              "按天保",
            ][el.coveragePeriod];
            return el;
          });
          //分页数据
          this.paginationPolicy.total = res.content.total;
          this.tableList.map((item, index) => {
            item.holderGender = item.holderGender == 0 ? "男" : "女";
            if (!item.holderBirthday) {
              item.holderBirthday = "——";
            } else {
              let str3 = this.$util.getFormatOnlyDate(item.holderBirthday);
              if (str3.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.holderBirthday = item.holderBirthday.substring(0, 10);
              } else {
                item.holderBirthday = str3;
              }
            }
            if (!item.createdDate) {
              item.createdDate = "——";
            } else {
              let str4 = this.$util.getFormatOnlyDate(item.createdDate);
              if (str4.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.createdDate = item.createdDate.substring(0, 10);
              } else {
                item.createdDate = str4;
              }
            }
            this.certificateTypeList.map((typeData) => {
              if (typeData.value == item.holderCertificateType) {
                item.holderCertificateType = typeData.name;
              }
            });
            /* 被保人证件类型 */
            this.certificateTypeList.map((typeData) => {
              if (typeData.value == item.insuredCertificateType) {
                item.insuredCertificateType = typeData.name;
              }
            });
            this.policyStatusList.map((status) => {
              if (status.value == item.policyStatus) {
                item.policyStatusName = status.name;
              }
            });
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //查询险种列表
    getLiabilityList() {
      this.$api.getLiabilityList({}).then((res) => {
        if (res.result == "0") {
          this.liabilityList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //查询机构列表
    getOrgList() {
      this.$api.getOrgList({}).then((res) => {
        if (res.respCode == "0") {
          this.orgList = res.content;
          this.orgList.map((item, index) => {
            if (item == null) {
              this.orgList.splice(index, 1);
            }
          });
          console.log(this.orgList);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置
    reset() {
      this.searchBusiness = {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        holderBirthday: [],
        holderBirthdayStartDate: "",
        holderBirthdayEndDate: "",
        holderCertificateNo: "",
        holderCertificateType: "",
        holderGender: "",
        holderName: "",
        holderPhone: "",
        insuredName: "",
        insuredPhone: "",
        liabilityCode: "",
        orderNo: "",
        organizationCode: "",
        policyCode: "",
        policyStatus: "",
      };

      this.changeFormSearch();
    },
    birstDate(date) {
      this.searchBusiness.holderBirthdayStartDate = date[0];
      this.searchBusiness.holderBirthdayEndDate = date[1];
    },
    businessCheck(val) {
      this.$router.push({
        name: "checkManagementDetail1",
        params: { policyId: val.policyId },
      });
    }
  },
};
</script>

<style lang="less" scoped>
#business-list {
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  /deep/ .ivu-radio-group {
    height: 32px;
  }
  .ivu-form-item {
    margin-right: 0;
    .ivu-form-item-label {
      padding-right: 5px;
    }
    // width: 255px;
  }
}
</style>
