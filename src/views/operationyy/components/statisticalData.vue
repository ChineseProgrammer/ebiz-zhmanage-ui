<template>
  <div>
    <div style="text-align: center">法商直播用户清单明细数据收集截止时间</div>
      <primaryTable
        :columns="columns"
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
import primaryTable from "@/components/table/primaryTable.vue"; //此组件为全局组件 测试开发用
//import { getTableList } from "@/api/data"; //mock.js 定义的接口
import {viewData1} from "../js/statisticalData"

export default {
  data() {
    return {
      importId: this.$route.params.id,
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
      tableData: [],
      columns: viewData1,
    };
  },
  components: {
    primaryTable,
  },
  created: function() {
    //这个地方想判断是否是同一个人？ 
    this.isAdminCenter = (window.sessionStorage.getItem("username") == "adminCenter")
      if (!this.button.importInfo) {
        if (!this.isAdminCenter) {
          this.columns.pop();
        }
      }
    this.fetchData(); //查询列表   
  },
  methods: {
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
      // this.$util.showLoading();
      this.$api.getStatisticalData(reqData).then((res) => {
        console.log(res)
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
        ...this.importId
      };
      this.$api.getStatisticalData(params).then((res) => {
       // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          console.log("res-----",res)

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