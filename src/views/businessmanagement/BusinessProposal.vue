<template>
  <div id="business_proposal">
    <!-- 顶部筛选 -->
    <div>
      <Form
        ref="formInline"
        :model="searchProposal"
        :rules="formRules"
        inline
        :label-width="200"
      >
        <FormItem prop="agentName" label="推广人员姓名">
          <Input v-model.trim="searchProposal.agentName" placeholder="请输入" />
        </FormItem>
        <FormItem prop="agentCode" label="推广人员工号">
          <Input v-model.trim="searchProposal.agentCode" placeholder="请输入" />
        </FormItem>
        <FormItem prop="orgName" label="推广人员管理机构名称">
          <Select
            filterable
            clearable
            v-model.trim="searchProposal.orgName"
            placeholer="请输入"
          >
            <Option
              v-for="item in orgNameList"
              :value="item.orgName"
              :key="item.orgCode"
              >{{ item.orgName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="summaryType" label="汇总类型">
          <Select
            filterable
            v-model.trim="searchProposal.summaryType"
            placeholer="请输入"
            @on-change="selectType"
          >
            <Option
              v-for="item in aggregateType"
              :value="item.val"
              :key="item.val"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="time" label="统计时间">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            v-model.trim="statisticTime"
            @on-change="timeChange"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <span style="margin-left: 115px">
          <Button @click="changeFromSearch" type="primary">查询</Button>
          <Button @click="reset()">重置</Button>
        </span>
      </Form>
    </div>
    <Divider class="mv10" />
    <!-- 操作按钮 -->
    <div class="mb15">
      <Button
        type="primary"
        @click="downSummary"
        :disabled="!isSummary"
        v-if="isAdminCenter || button.down_summary"
        >下载汇总报表</Button
      >
      <Button
        type="primary"
        :disabled="isSummary"
        @click="exportDetail(1, null)"
        v-if="isAdminCenter || button.down_detail"
        >下载明细报表</Button
      >
    </div>
    <!-- 列表 -->
    <div v-if="isSummary">
      <!-- @lookDetail="lookDetail" -->
      <primaryTable
        class="summary-table"
        :columns="columnsSummary"
        :data="dataSummary"
        :current.sync="summaryPagination.page"
        :total="summaryPagination.total"
        :pageSize="summaryPagination.pageSize"
        @on-page-size-change="beforeFetchData(1, ...arguments, 0)"
        @on-change="fetchData"
      ></primaryTable>
    </div>
    <div v-if="!isSummary">
      <primaryTable
        :columns="columnsDetail"
        :data="dataDetail"
        :current.sync="detailPagination.page"
        :total="detailPagination.total"
        :pageSize="detailPagination.pageSize"
        @on-page-size-change="beforeFetchData(1, ...arguments, 1)"
        @on-change="fetchDetailData"
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
      // 校验规则
      formRules: {
        summaryType: [
          { required: true, message: "请选择汇总类型", trigger: "change" },
        ],
      },
      // 参数
      statisticTime: "",
      searchProposal: {
        agentName: null, //姓名
        agentCode: null, //工号
        orgName: null, //机构名称
        summaryType: "0", //汇总类型
        startTime: null,
        endTime: null,
      },
      searchProposalOld: {
        agentName: null, //姓名
        agentCode: null, //工号
        orgName: null, //机构名称
        summaryType: "0", //汇总类型
        startTime: null,
        endTime: null,
      },
      querySummaryPageSize: 10,
      queryDetailPageSize: 10,
      //   汇总表格页码
      summaryPagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      // 明细表格页码
      detailPagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      //   查询条件中的机构列表
      orgNameList: [],
      //   查询条件中的汇总类型
      aggregateType: [
        {
          name: "每日汇总",
          val: "0",
        },
        {
          name: "推送明细",
          val: "1",
        },
      ],
      isSummary: true,
      dataSummary: [],
      columnsSummary: [
        {
          title: "年月日",
          key: "createTime",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员管理机构名称",
          key: "orgName",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员工号",
          key: "agentCode",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员姓名",
          key: "agentName",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书推送数量",
          // key: "pushCount",
          key: "action",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
          render:(h,params)=>{
            return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small",
                  disabled:this.$store.state.app.button.businessProposalDetail==true||this.isAdminCenter?false:true
                  // disabled:false
                },
                style: {},
                on: {
                  click: () => {
                    this.$router.push({
                      name: "businessProposalDetail",
                      params: {
                        proposalId: params.row.agentCode,
                        yearDate: params.row.copyCreateTime
                          ? new Date(params.row.copyCreateTime).getTime()
                          : null,
                        type:1
                      },
                    });
                  },
                },
              },
               params.row.pushCount
            );
          }
        },
        {
          title: "建议书点击打开量",
          // key: "openCount",
          key: "action",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
           return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small",
                  disabled:this.$store.state.app.button.businessProposalDetail==true||this.isAdminCenter?false:true
                  //  disabled:false
                },
                style: {},
                on: {
                  click: () => {
                    this.$router.push({
                      name: "businessProposalDetail",
                      params: {
                        proposalId: params.row.agentCode,
                        yearDate: params.row.copyCreateTime
                          ? new Date(params.row.copyCreateTime).getTime()
                          : null,
                        type:2
                      },
                    });
                  },
                },
              },
               params.row.openCount
            );
          },
        },
        {
          title: "建议书投保量",
          key: "insureCount",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书最终承保量",
          key: "underwritingCount",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "操作",
          minWidth: 150,
          align: "center",
          key: "action",
          render: (h, params) => {
            let arr = [];
            // arr.push(
            //   h(
            //     "Button",
            //     {
            //       props: {
            //         type: "text",
            //         size: "small",
            //       },
            //       style: {},
            //       on: {
            //         click: () => {
            //           this.$router.push({
            //             name: "businessProposalDetail",
            //             params: { proposalId: params.row.agentCode,yearDate:params.row.copyCreateTime?new Date(params.row.copyCreateTime).getTime():null},
            //           });
            //         },
            //       },
            //     },
            //     "查看明细"
            //   )
            // );
            if (this.isAdminCenter || this.button.export_detail) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.exportDetail(2, params.row);
                      },
                    },
                  },
                  "导出明细"
                )
              );
            }
            return h("div", arr);
          },
          //   selfBtn: [
          //     {
          //       name: "查看明细",
          //       type: "primary",
          //       method: "lookDetail",
          //     },
          //     {
          //       name: "导出明细",
          //       type: "primary",
          //       method: "exportDetail",
          //     },
          //   ],
        },
      ],
      columnsDetail: [
        {
          title: "年月日",
          key: "createTime",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员管理机构名称",
          key: "orgName",
          minWidth: 150,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员工号",
          key: "agentCode",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人员姓名",
          key: "agentName",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          // title: "建议书推送客户姓名",
          title: "建议书推送客户昵称",
          key: "holderName",
          minWidth: 120,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        // {
        //   title: "建议书客户手机号",
        //   key: "phone",
        //   minWidth: 100,
        //   align: "center",
        //   ellipsis: true,
        //   tooltip: true,
        // },
        {
          title: "建议书编码",
          key: "recordId",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        }, {
          title: "建议书产品类别",
          key: "productType",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书产品名称",
          key: "productName",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书产品交费年期",
          key: "period",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书产品保费",
          key: "premium",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "客户是否点击打开",
          key: "isOpen",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "客户是否投保",
          key: "isInsure",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "产品是否承保",
          key: "isUnderwriting",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "创建时间",
          key: "recordTime",
          minWidth: 150,
          align: "center",
          ellipsis: true,
          tooltip: true,
          render:(h,params)=>{
            let time=this.$util.datetimeFormat(params.row.recordTime)
            return h("span", time);
          }
        },
      ],
      dataDetail: [],
    };
  },
  created() {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
  },
  mounted() {
    //   获取管理机构下拉列表数据
    this.getOrg();
    //   获取汇总表格数据
    this.fetchData();
    // 获取推送明细表格数据
    this.fetchDetailData();
  },
  methods: {
    // 查询机构
    getOrg() {
      this.$api
        .getOrgList({})
        .then((res) => {
          if (res.respCode == 0) {
            this.orgNameList = res.content;
            this.orgNameList.map((item, index) => {
              if (item == null) {
                this.orgNameList.splice(index, 1);
              }
            });
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$Message.error(error.message);
        });
    },
    //   统计时间选择
    timeChange(time) {
      console.log(time);
      this.searchProposal.startTime = new Date(time[0]).getTime();
      this.searchProposal.endTime = new Date(time[1]).getTime();
    },
    //   查询
    changeFromSearch() {
      this.searchProposalOld = this.$util.convertObj(this.searchProposal);
      if (this.searchProposalOld.summaryType == "0") {
        this.summaryPagination.page = 1;
        this.fetchData();
      } else {
        this.detailPagination.page = 1;
        this.fetchDetailData();
      }
    },
    // 获取汇总表格数据
    fetchData(page = 1, pageSize = 10) {
      const reqData = {
        ...this.searchProposalOld,
        page: this.summaryPagination.page,
        pageSize: this.querySummaryPageSize,
      };
      this.$api
        .proposalSummarySearch(reqData)
        .then((res) => {
          if (res.respCode == "0") {
            // 汇总表
            this.dataSummary = res.content.list;
            this.summaryPagination.pageSize = res.content.pageSize;
            this.summaryPagination.total = res.content.total;
            this.summaryPagination.pageNum = res.content.pageNum;
            // 处理数据
            this.dataSummary.map((item, index) => {
              item.copyCreateTime = JSON.parse(JSON.stringify(item.createTime));
              if (!item.createTime) {
                item.createTime = "——";
              } else {
                let strData = this.$util.getFormatOnlyDate(item.createTime);
                if (strData.substring(0, 3) == "NaN") {
                  // 是ie浏览器
                  item.createTime = item.createTime.substring(0, 10);
                } else {
                  item.createTime = strData;
                }
              }
            });
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$Message.error(error.message);
        });
    },
    // 获取明细表格数据
    fetchDetailData(page = 1, pageSize = 10) {
      const reqData = {
        ...this.searchProposalOld,
        page: this.detailPagination.page,
        pageSize: this.queryDetailPageSize,
      };
      this.$api
        .proposalSummaryDetailSearch(reqData)
        .then((res) => {
          if (res.respCode == "0") {
            //   明细表
            this.dataDetail = res.content.list;
            this.detailPagination.pageSize = res.content.pageSize;
            this.detailPagination.total = res.content.total;
            this.detailPagination.pageNum = res.content.pageNum;
            this.dataDetail.map((item, index) => {
              if (!item.createTime) {
                item.createTime = "——";
              } else {
                let strData = this.$util.getFormatOnlyDate(item.createTime);
                if (strData.substring(0, 3) == "NaN") {
                  // 是ie浏览器
                  item.createTime = item.createTime.substring(0, 10);
                } else {
                  item.createTime = strData;
                }
              }
              if (!item.recordTime) {
                item.recordTime = "——";
              } else {
                // let recordData = this.$util.getFormatOnlyDate(item.recordTime);
                // if (recordData.substring(0, 3) == "NaN") {
                //   // 是ie浏览器
                //   item.recordTime = item.recordTime.substring(0, 10);
                // } else {
                //   item.recordTime = recordData;
                // }
              }
            });
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$Message.error(error.message);
        });
    },
    // 页数切换的回调
    beforeFetchData(queryPage = 1, queryPageSize = 10, type = 0) {
      if (type == 0) {
        // 汇总表
        this.querySummaryPageSize = queryPageSize;
        let { total, page } = this.summaryPagination;
        if ((page - 1) * queryPageSize > total) {
          this.$nextTick(() => {
            this.fetchData(queryPage, queryPageSize);
          });
        } else {
          this.fetchData(queryPage, queryPageSize);
        }
      } else {
        // 明细表
        this.queryDetailPageSize = queryPageSize;
        let { total, page } = this.detailPagination;
        if ((page - 1) * queryPageSize > total) {
          this.$nextTick(() => {
            this.fetchDetailData(queryPage, queryPageSize);
          });
        } else {
          this.fetchDetailData(queryPage, queryPageSize);
        }
      }
    },
    //   重置
    reset() {
      this.searchProposal.agentName = null; //姓名
      this.searchProposal.agentCode = null; //工号
      this.searchProposal.orgName = null; //机构名称
      // summaryType: this.searchProposalOld.summaryType, //汇总类型
      this.searchProposal.startTime = null;
      this.searchProposal.endTime = null;
      this.statisticTime = null;
      this.changeFromSearch();
    },
    // 切换选中的类型汇总
    selectType(item) {
      if (item == 0) {
        this.isSummary = true;
      } else {
        this.isSummary = false;
      }
      this.reset();
    },
    // 下载汇总表
    downSummary() {
      this.$util.showLoading();
      let params = this.searchProposalOld;
      // 参数处理
      this.$api
        .proposalExportSummary(params)
        .then((res) => {
          this.$util.hideLoading();
          // if (res.respCode == "0") {
          let elink = document.createElement("a");
          elink.download = "推广人员建议书汇总报表.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
          // } else {
          //    this.$Message.error(res.message);
          // }
        })
        .catch((error) => {
          this.$util.hideLoading();
          this.$Message.error(error.message);
        });
    },
    // 下载明细表
    // // 查看详情
    // lookDetail(item) {
    //   this.$router.push({
    //     name: "businessProposalDetail",
    //     params: { proposalId: 1 },
    //   });
    // },
    // 下载明细/导出明细
    exportDetail(type, row) {
      this.$util.showLoading();
      let params;
      if (type == 2) {
        params = {
          agentCode: row.agentCode,
          startTime: row.copyCreateTime
            ? new Date(row.copyCreateTime).getTime()
            : null,
          endTime: row.copyCreateTime
            ? new Date(row.copyCreateTime).getTime()
            : null,
        };
      } else {
        params = this.searchProposalOld;
        params.summaryType = "1";
      }
      // 参数处理
      this.$api
        .proposalExportDerail(params)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "推广人员建议书明细统计报表.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch((error) => {
          this.$util.hideLoading();
          this.$Message.error(error.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
#business_proposal {
  /deep/.ivu-form-item-content {
    width: 250px;
  }
  /deep/.ivu-btn-primary[disabled] {
    background-color: rgba(170, 170, 170, 1);
    color: #fff;
  }
  .summary-table {
    /deep/button {
      background: transparent;
      color: #2d8cf0;
      border: 0px;
    }
    /deep/.ivu-btn-text:focus {
      box-shadow: 0 0 0 0px rgba(45, 140, 240, 0.2);
    }
  }
}
</style>