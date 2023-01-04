<template>
  <div>
    <Form
      ref="formInline"
      :model="formInline"
      :rules="ruleInline"
      inline
      :label-width="100"
    >
      <FormItem label="用户昵称" prop="nickName">
        <Input type="text" v-model="formInline.nickName" placeholder="用户昵称"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="search('formInline')">{{
          $t("query")
        }}</Button>
        <Button @click="resertMo('formInline')">{{ $t("reset") }}</Button>
      </FormItem>
    </Form>
    <Tabs v-model="tabsName">
      <TabPane label="邀请达人榜" name="dailyData">
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
      </TabPane>
      <TabPane label="邀请用户信息" name="monthlyData">
        <inviteUserInfo :invite="formInvite"></inviteUserInfo>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import primaryTable from "@/components/table/primaryTable.vue"; //此组件为全局组件 测试开发用
import inviteUserInfo from "./inviteUserInfo.vue"; 
//import { getTableList } from "@/api/data"; //mock.js 定义的接口
import {viewData1} from "../js/viewData"
export default {
  data() {
    return {
      formInvite:{},
      ruleInline:{},
      tableData:[],
      props : [],
      tabsName: "dailyData",
      isAdminCenter: false,
      button: this.$store.state.app.button,
      personHeaders: { sid: window.sessionStorage.getItem("sid") },
      formInline: {
        searchTime: [],
        title: null,
        nickName: null,
      },
      importId: this.$route.params.id,
      // 分页数据--队伍查询
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      queryPageSize: 10, //分页条数
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      // 邀请达人榜
      columns: viewData1,
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (!this.button.importInfo) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.fetchData();
    this.props = {
        ...this.formInline,
        page,
        pageSize: this.queryPageSize,
        importId: this.$route.params.id,
      };
  },
  components: {
    primaryTable,
    inviteUserInfo
  },
  watch: {
    tabsName(newVal,oldVal){
      if(newVal == "dailyData"){

      }else{

      }

    }
  },
  mounted: function () {},
  methods: {
     //分页展示条数
    changeSize(size) {
      this.paginationPolicy.pageSize = size;
      this.fetchData(this.paginationPolicy.page,this.paginationPolicy.pageSize);
    },
    //切换分页
    changePage(page) {
      this.paginationPolicy.page = page;
      this.fetchData(this.paginationPolicy.page,this.paginationPolicy.pageSize);
    }, 
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.formInline,
        page,
        pageSize: this.queryPageSize,
        importId: this.$route.params.id,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getImportDataInviteTalent(reqData).then((res) => {        
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableData = res.data.list;
          //分页数据
          this.paginationPolicy.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
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
    //查询
    search() {
      this.formInvite = JSON.parse(JSON.stringify(this.formInline))
      this.fetchData();
    },
    //重置
    resertMo() {
      this.formInline.nickName = null;
      this.props =[];
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>