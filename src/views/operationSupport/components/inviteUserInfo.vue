<template>
  <div>
    <Form
      ref="formInline"
      :model="formInline"
      :rules="ruleInline"
      inline
      :label-width="100"
    >
    </Form>
      <primaryTable
        v-on:my-event="doSomething"
        :columns="viewData2"
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

export default {
  props:{
    invite:Object,
    default:{}
  },
  data() {
    return {
      viewData2 : [
        {
          width: 100,
          align: "center",
          title: "用户昵称",
          key: "userNickName",
          fixed: "left",
        },
        {
          title: "邀请人昵称",
          key: "invitedUserNickName",
          width: 100,
        },
        {
          title: "累计观看时长(秒)",
          key: "cumulativeViewingTime",
          width: 100,
        },
        {
          title: "直播观看时长",
          key: "liveViewingDuration",
          width: 100,
        },
        {
          title: "真实姓名",
          key: "realName",
          width: 100,
        },
        {
          title: "邀请人",
          key: "invitedUser",
          width: 200,
        },
        {
          title: "用户id",
          key: "userId",
          width: 200,
        },
        {
          title: "生日",
          key: "birthday",
          width: 80,
        },
        {
          title: "性别",
          key: "gender",
          width: 80,
        },
        {
          title: "行业",
          key: "industry",
          width: 100,
        },
        {
          title: "职位",
          key: "position",
          width: 100,
        },
        {
          title: "城市",
          key: "city",
          width: 100,
        },
        {
          title: "手机号码",
          key: "phoneNum",
          width: 100,
        },
        {
          title: "邮箱",
          key: "email",
          width: 100,
        },
        {
          title: "来源渠道",
          key: "sourceChannel",
          width: 100,
        },
        {
          title: "年龄",
          key: "age",
          width: 80,
        },
        {
          title: "地址",
          key: "address",
          width: 100,
        },
        {
          title: "公司名称",
          key: "companyName",
          width: 100,
        },
        {
          title: "微信",
          key: "wechatNumber",
          width: 100,
        },
      ],
      props : [],
      ruleInline:{},
      tableData:[],
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
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo"))
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
  },
  components: {
    primaryTable
  },
   watch: {
     invite: {
     handler: function() {
       console.log(this.invite)
       this.formInline.nickName=this.invite.nickName
      this.fetchData();
     },
     deep: true
   }
  },
  mounted: function () {},
  methods: {
    doSomething(){
console.log("00000000000000")
    },
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
      this.$api.getImportDataInviteUserInfo(reqData).then((res) => {        
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
      console.log(this.$route.params.num)
      this.fetchData();
    },
    //重置
    resertMo() {
      this.formInline.nickName = null;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>