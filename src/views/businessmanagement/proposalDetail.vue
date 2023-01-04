<template>
  <div id="proposal_detail">
    <div>
      <Form ref="formInline" :model="searchForm" inline :label-width="150">
        <Row>
          <Col span="6">
            <FormItem prop="holderName" label="建议书推送客户姓名">
              <Input
                v-model.trim="searchForm.holderName"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span="6" offset="2">
            <FormItem prop="productName" label="建议书产品名称">
              <Input
                v-model.trim="searchForm.productName"
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span="4" offset="6">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="reset()">重置</Button>
          </Col>
        </Row>
      </Form>
    </div>
    <Divider class="mv10" />
    <div>
      <primaryTable
        :columns="columns"
        :data="tableData"
        :current.sync="pagination.page"
        :total="pagination.total"
        :pageSize="pagination.pageSize"
        @on-page-size-change="beforeFetchData(1, ...arguments)"
        @on-change="fetchData"
      ></primaryTable>
    </div>
  </div>
</template>
<script>
import { dateTransfer} from "@/api/sm4";
export default {
  data() {
    return {
      type:this.$route.params.type,
      searchForm: {
        holderName: null,
        productName: null,
        agentCode: this.$route.params.proposalId
          ? this.$route.params.proposalId
          : null,
        startTime: this.$route.params.yearDate
          ? this.$route.params.yearDate
          : null,
        endTime: this.$route.params.yearDate
          ? this.$route.params.yearDate
          : null,
      },
      searchFormOld: {
        holderName: null,
        productName: null,
        agentCode: this.$route.params.proposalId
          ? this.$route.params.proposalId
          : null,
        startTime: this.$route.params.yearDate
          ? this.$route.params.yearDate
          : null,
        endTime: this.$route.params.yearDate
          ? this.$route.params.yearDate
          : null,
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      queryPageSize: 10,
      columns: [
          {
          title: "建议书编码",
          key: "recordId",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
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
          title: "建议书推送客户姓名",
          key: "holderName",
          minWidth: 120,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "建议书客户手机号",
          key: "phone",
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
        },
        {
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
          minWidth: 120,
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
          minWidth: 100,
          align: "center",
          ellipsis: true,
          tooltip: true,
           render: (h, params) => {
            if (params.row.recordTime) {
              return h("div", dateTransfer(params.row.recordTime));
            }
          },
        },
      ],
      tableData: [],
    };
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  methods: {
    search() {
      this.searchFormOld = this.$util.convertObj(this.searchForm);
      this.fetchData();
    },
    fetchData(page = 1, pageSize = 10) {
      const reqData = {
        ...this.searchFormOld,
        page,
        pageSize: this.queryPageSize,
      };
      let thisUrl;
      if(this.type=="1"){
        thisUrl=this.$api.proposalPushDetail;
      }else{
        thisUrl=this.$api.proposalDetail;
      }
      thisUrl(reqData)
        .then((res) => {
          if (res.respCode == "0") {
            // 汇总表
            this.tableData = res.content.list;
            this.pagination.pageSize = res.content.pageSize;
            this.pagination.total = res.content.total;
            this.pagination.page = res.content.pageNum;
            // 处理数据
            this.tableData.map((item, index) => {
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
          }
        })
        .catch((error) => {
          this.$Message.error(error.message);
        });
    },
    // 切换页条数
    beforeFetchData(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { total, page } = this.pagination;
      if ((page - 1) * queryPageSize > total) {
        this.$$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    reset() {
      this.searchForm.holderName = null;
      this.searchForm.productName = null;
      this.search();
    },
  },
  // 计算
  computed: {},
  // 组件
  components: {},
};
</script>
<style lang="less" scoped>
#proposal_detail {
  /deep/.ivu-form-item-content {
    width: 250px;
  }
}
</style>