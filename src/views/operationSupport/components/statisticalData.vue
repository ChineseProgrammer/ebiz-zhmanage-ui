<template>
  <div>
    <div style="text-align: center">法商直播用户清单明细</div>
    <Button type="primary"   style="margin-bottom: 10px" @click="exportAll"  >导出</Button>
      <primaryTable
        :columns="viewData1"
        :data="tableData"
        :current.sync="paginationPolicy.page"
        ref="teamTable"
        :total="paginationPolicy.total"
        :pageSize="paginationPolicy.pageSize"
        @on-page-size-change="changeSize"
        @on-change="changePage"
      ></primaryTable>
  </div>
</template>

<script>
import primaryTable from "@/components/table/primaryTable.vue"; //此组件为全局组件 测试开发用"

export default {
  data() {
    return {
      isAdminCenter: false,
      button: this.$store.state.app.button,
      viewData1 : [
        {
          type: "index",
          //width: 60,
          align: "center",
          title: "序号",
          fixed: "left",
        },
        {
          title: "微信昵称",
          key: "wechatNickname",
          //width: 100,
        },
        {
          title: "被邀层级",
          key: "invitedLevel",
          //width: 80,
        },
        {
          title: "原始邀请人",
          key: "originalInvitee",
          //width: 100,
        },
        {
          title: "所属机构",
          key: "organization",
          width: 80,
        },
        {
          title: "俱乐部会员",
          key: "clubMember",
          width: 100,
          render: (h, params) => {
          let name = "";
            if (params.row.clubMember == 1 ) {
              name = "是";
            } else if (params.row.clubMember === "0"||params.row.clubMember === 0) {
              name = "否";
            }
            return h("div", name);
          }
        },
        {
          title:"注册时间",
          key: "clubCreateTime",
          width: 140,
        },
        {
          title:"邀请注册人",
          key: "agentName",
          //width: 80,
        },
        {
          title:"邀请注册机构",
          key: "agentOrganizationName",
          //width: 80,
        },
        // {
        //   title: "本次直播新增注",
        //   key: "newUser",
        //   width: 80,
        //   render: (h, params) => {
        //   let name = "";
        //     if (params.row.newUser == "1" ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        // {
        //   title: "官方客服",
        //   key: "customerService",
        //   width: 80,
        //   render: (h, params) => {
        //   let name = "";
        //     if (params.row.customerService == "1" ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        {
          title: "直播观看时长",
          key: "viewingDuration",
          //width: 110,
        },
        {
          title: "直播观看的秒数",
          key: "viewingSeconds",
         //width: 80,
        },
        // {
        //   title: "有效观看",
        //   key: "effectiveViewing",
        //   width: 80,
        //   render: (h, params) => {
        //   let name = "";
        //     if (params.row.effectiveViewing == "1" ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        {
          title: "邀请人数",
          key: "invitedNum",
          //width: 80,
        },
        // {
        //   title: "礼品资格邀约三人",
        //   key: "giftQualification",
        //   width: 80,
        //   render: (h, params) => {
        //   let name = "";
        //     if (params.row.giftQualification == 1 ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        // {
        //   title: "礼品资格邀请榜前5",
        //   key: "topFive",
        //   width: 80,
        //    render: (h, params) => {
        //   let name = "";
        //     if (params.row.topFive == 1 ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        // {
        //   title: "填写邮寄地址",
        //   key: "mailingAddress",
        //   width: 80,
        //    render: (h, params) => {
        //   let name = "";
        //     if (params.row.mailingAddress == "1" ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        // },
        // {
        //   title: "咨询",
        //   key: "consultingService",
        //   width: 80,
        //   render: (h, params) => {
        //   let name = "";
        //     if (params.row.consultingService == "1" ) {
        //       name = "是";
        //     } else {
        //       name = "否";
        //     }
        //     return h("div", name);
        //   }
        //  }
      ],
      importId: this.$route.params.id,
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
      tableData: []
    };
  },
  components: {
    primaryTable,
  },
  created: function() {
    //这个地方想判断是否是同一个人？ 
    this.isAdminCenter = (window.sessionStorage.getItem("username") == "adminCenter")
      console.log("--009110",this.button.operationSupportExport)
       console.log("--00",this.button)
       console.log(this.isAdminCenter || this.button.operationSupportExport )
      if (!this.button.importInfo) {
        if (!this.isAdminCenter) {
          // this.viewData1.pop();
        }
      }
    this.fetchData(); //查询列表   
  },
  methods: {
    exportAll(){
       const reqData = {
        ...this.searchBusiness,
        pageSize: 10,
        importId: this.$route.params.id,
      };
      this.$api
      .exportStatisticalData(reqData)
      .then((res) => {
        this.$util.hideLoading();
        let elink = document.createElement("a");
        elink.download = "统计数据.xlsx";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      })
      .catch();
     },
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchBusiness,
        page,
        pageSize:this.queryPageSize,
        importId: this.$route.params.id,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getStatisticalData(reqData).then((res) => {
        // console.log(res)
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableData = res.content.list
          //分页数据
          this.paginationPolicy.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //分页展示条数
    changeSize(size) {
      this.paginationPolicy.pageSize = size;
      this._getTableList();
    },
    //切换分页
    changePage(page) {
      this.paginationPolicy.page = page;
      this._getTableList();
    },
    //mock模拟表格数据
    _getTableList() {
      //params 为数据的查询条件 分页 导入标题 导入时间
      let params = {
        ...this.paginationPolicy,
        ...this.searchBusiness,
       // ...this.importId,
        importId: this.$route.params.id,
      };
      this.$api.getStatisticalData(params).then((res) => {
       // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableData = res.content.list
          //分页数据
          this.paginationPolicy.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>