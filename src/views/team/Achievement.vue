<template>
  <div id="achievement-list" class="only-content">
    <!-- 顶部筛选 -->
    <div class="header">
      <div class="left">
        <Tabs>
          <TabPane label="队伍概览" name="0">
            <Form
              ref="formInline"
              :model="searchTeamView"
              inline
              :label-width="90"
            >
            <div class="search-box">
              <div>
              <!-- <Row>
                <i-col span="6"> -->
                  <FormItem label="管理机构名称">
                    <Select
                      filterable
                      clearable
                      v-model.trim="searchTeamView.manageOrgCode"
                      placeholder="请选择"
                      @on-change='getSalesTeamList(...arguments)'
                    >
                      <Option
                        v-for="(teamOrg, teamOrgIndex) in manageList"
                        :value="teamOrg.manageOrgCode"
                        :key="teamOrgIndex"
                        >{{ teamOrg.manageOrgName }}</Option
                      >
                    </Select>
                  </FormItem>
                <!-- </i-col>
                <i-col span="6"> -->
                  <FormItem label="团队名称">
                    <Select
                      filterable
                      clearable
                      v-model.trim="searchTeamView.salesTeamCode"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="(team, teamIndex) in teamList"
                        :value="team.salesTeamCode"
                        :key="teamIndex"
                        >{{ team.salesTeamName }}</Option
                      >
                    </Select>
                  </FormItem>
                <!-- </i-col>
                <i-col span="6" style="width:32%"> -->
                  <FormItem label="时间">
                    <!-- <Row>
                      <Col span="11"> -->
                        <FormItem>
                          <DatePicker
                            type="date"
                            placeholder="请选择"
                            v-model.trim="searchTeamView.beginDate"
                            @on-change="dateStartChange"
                          ></DatePicker>
                        </FormItem>
                      <!-- </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11"> -->
                      - 
                        <FormItem>
                          <DatePicker
                            type="date"
                            placeholder="请选择"
                            v-model.trim="searchTeamView.endDate"
                            @on-change="dateEndChange"
                          ></DatePicker>
                        </FormItem>
                      <!-- </Col>
                    </Row> -->
                  </FormItem>
                  </div>
                <!-- </i-col>
                <i-col span="4" class="fr"> -->
                  <div class="search-btn">
                  <Button style="margin-left:20px;" @click="changeFormSearch" type="primary" class="ml50"
                    >查询</Button
                  >
                  <Button @click="reset()">重置</Button>
                  </div>
                </div>
                <!-- </i-col>
              </Row> -->
            </Form>
            <Divider class="mv10" />
            <!-- 表格 -->
            <primaryTable
              :columns="teamColumns"
              :data="teamTable"
              :current.sync="paginationTeam.page"
              ref="teamTable"
              :total="paginationTeam.total"
              :pageSize="paginationTeam.pageSize"
              @on-change="fetchData"
              @on-page-size-change="beForeFetchData(1,...arguments)"
            ></primaryTable>
          </TabPane>
          <TabPane label="个人业绩" name="1">
            <Form
              ref="formInline1"
              :model="searchPersonPerfo"
              inline
              :label-width="90"
            >
              <!-- <Row>
                <i-col span="6"> -->
                  <FormItem label="管理机构名称">
                    <Select
                      filterable
                      clearable
                      v-model.trim="searchPersonPerfo.manageOrgCode"
                      style="width:160px"
                      placeholder="请选择"
                      @on-change='getSalesmaSalesTeamList(...arguments)'
                    >
                      <Option
                        v-for="(manOrg, manOrgIndex) in manManageList"
                        :value="manOrg.manageOrgCode"
                        :key="manOrgIndex"
                        >{{ manOrg.manageOrgName }}</Option
                      >
                    </Select>
                  </FormItem>
                <!-- </i-col>
                <i-col span="6"> -->
                  <FormItem label="推广人团队">
                    <Select
                      filterable
                      clearable
                      v-model.trim="searchPersonPerfo.salesTeamCode"
                      style="width:160px"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="(manTeam, manTeamIndex) in manSalesTeamList"
                        :value="manTeam.salesTeamCode"
                        :key="manTeamIndex"
                        >{{ manTeam.salesTeamName }}</Option
                      >
                    </Select>
                  </FormItem>
                <!-- </i-col>
                <i-col span="6"> -->
                  <FormItem label="推广人姓名" prop="agentName">
                    <Input
                      v-model.trim="searchPersonPerfo.agentName"
                      placeholder="请输入"
                      style="width:160px"
                    />
                  </FormItem>
                <!-- </i-col>
                <i-col span="6"> -->
                  <FormItem label="推广人状态">
                    <Select
                      filterable
                      clearable
                      v-model.trim="searchPersonPerfo.agentStatus"
                      style="width:160px"
                      placeholder="请选择"
                    >
                      <Option value="在职">在职</Option>
                      <Option value="离职">离职</Option>
                    </Select>
                  </FormItem>
                <!-- </i-col>
              </Row> -->
              <!-- <Row>
                <i-col span="6" style="width:32%"> -->
                  <FormItem class="label--small" label="时间">
                    <!-- <Row> -->
                      <!-- <Col span="11"> -->
                        <FormItem>
                          <DatePicker
                          style="width:110px;"
                            type="date"
                            placeholder="请选择"
                            v-model.trim.trim="searchPersonPerfo.beginDate"
                            @on-change="manBeginChange"
                          ></DatePicker>
                        </FormItem>
                      <!-- </Col> -->
                      <!-- <Col span="2" style="text-align: center">-</Col>
                      <Col span="11"> -->
                      -
                        <FormItem>
                          <DatePicker
                          style="width:110px;"
                            type="date"
                            placeholder="请选择"
                            v-model.trim="searchPersonPerfo.endDate"
                            @on-change="manEndChange"
                          ></DatePicker>
                        </FormItem>
                      <!-- </Col>
                    </Row> -->
                  </FormItem>
                <!-- </i-col> -->
                <!-- <i-col span="4" class="fr"> -->
                  <Button style="margin-left:20px;"  @click="changeFormPerson" type="primary">查询</Button>
                  <Button @click="personReset()">重置</Button>
                <!-- </i-col> -->
              <!-- </Row> -->
            </Form>
            <Divider class="mv10" />
            <primaryTable
              :columns="PersonColumns"
              :data="personData"
              :current.sync="paginationPerson.page"
              ref="teamTable"
              :total="paginationPerson.total"
              :pageSize="paginationPerson.pageSize"
              @on-page-size-change="beForeFetchPersonData(1,...arguments)"
              @on-change="fetchPersonData"
            ></primaryTable>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      manageList: [], //管理机构list
      teamList: [], //销售团队list
      queryPersonPageSize:10,//人条数
      queryPageSize:10,//队伍条数
      //条件查询--队伍查询
      searchTeamView: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        beginDate: "",
        endDate: "",
      },
      //列表搜索的值--队伍查询
      searchTeamViewOld: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        beginDate: "",
        endDate: "",
      },
      // 分页数据--队伍查询
      paginationTeam: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      teamTable: [], //队伍查询表格

      //表格----队伍查询
      teamColumns: [
        {
          title: "序号",
          width: "80",
          type: "index",
          align: "center",
        },
        {
          title: "管理机构名称",
          key: "manageOrgName",
          align: "center",
          minWidth: 150,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "团队名称",
          key: "teamName",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保中数量",
          key: "underInsuranceNum",
          align: "center",
          minWidth: 100,
        },

        {
          title: "投保成功数量",
          key: "successInsuredNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "撤单数量",
          key: "cancelOrderNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "私域好友数量",
          key: "privateFriendNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "商城注册数量",
          key: "mallRegisterNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "俱乐部注册数量",
          key: "clubRegisterNum",
          align: "center",
          minWidth: 110,
        },
      ],
      //条件查询---个人查询
      searchPersonPerfo: {
        manageOrgCode: "", //公司编码
        salesTeamCode: "", //公司名称
        agentName: "",
        beginDate: "",
        endDate: "",
        agentStatus: "", // 0有效  1 无效
      },
      //列表搜索的值---个人查询
      searchPersonPerfoOld: {
        manageOrgCode: "", //公司编码
        salesTeamCode: "", //公司名称
        agentName: "",
        beginDate: "",
        endDate: "",
        agentStatus: "", // 0有效  1 无效
      },
      // 分页数据---个人查询
      paginationPerson: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      manManageList: [],
      manSalesTeamList: [],
      //数据列表
      personData: [],
      //个人查询--表格列
      PersonColumns: [
        {
          title: "推广人编码",
          key: "agentCode",
          align: "center",
          minWidth: 130,
        },
        {
          title: "推广人姓名",
          key: "agentName",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "管理机构名称",
          key: "manageOrgName",
          align: "center",
          minWidth: 150,
          ellipsis: true,
          tooltip: true,
        },

        {
          title: "推广人团队",
          key: "teamName",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "推广人状态",
          key: "agentStatus",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保中数量",
          key: "underInsuranceNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "投保成功数量",
          key: "successInsuredNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "撤单数量",
          key: "cancelOrderNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "私域好友数量",
          key: "privateFriendNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "商城注册数量",
          key: "mallRegisterNum",
          align: "center",
          minWidth: 100,
        },
        {
          title: "俱乐部注册数量",
          key: "clubRegisterNum",
          align: "center",
          minWidth: 110,
        },
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
    };
  },
  created: function() {
    //搜索分页查询
    this.fetchData();
    this.fetchPersonData();
  },
  mounted: function() {
    this.getManageOrgList();
    this.getSalesTeamList();
    this.getSalesmanManageOrgList();
    this.getSalesmaSalesTeamList();
  },
  computed: {},
  methods: {
    dateStartChange(date) {
      this.searchTeamView.beginDate = date;
    },
    dateEndChange(date) {
      this.searchTeamView.endDate = date;
    },
    // 更换队伍概览form搜索
    changeFormSearch() {
      this.searchTeamViewOld = this.$util.convertObj(this.searchTeamView);
      this.fetchData();
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchData(queryPage = 1, queryPageSize = 10){
        this.queryPageSize = queryPageSize
        let {teamTotal ,page} = this.paginationTeam
        if((page - 1) * queryPageSize > teamTotal){
          this.$nextTick(()=>{
            this.fetchData(queryPage,queryPageSize)
          })
        }else{
            this.fetchData(queryPage,queryPageSize)
        }
    },
    //队伍概览获取分页数据
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchTeamViewOld,
        page,
        pageSize:this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getAchievementTeamPage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.teamTable = res.content.list;
          //分页数据
          this.paginationTeam.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //队伍概览 ---管理机构不分页查询
    getManageOrgList() {
      this.$api.getManageOrgList({}).then((res) => {
        if (res.result == "0") {
          this.manageList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //队伍概览 ---销售团队不分页查询
    getSalesTeamList(val) {
      this.$api.getSalesTeamList({manageOrgCode:val}).then((res) => {
        if (res.respCode == "0") {
          this.teamList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //个人 --开始时间
    manBeginChange(date) {
      this.searchPersonPerfo.beginDate = date;
    },
    //个人 --结束时间
    manEndChange(date) {
      this.searchPersonPerfo.endDate = date;
    },
    // 更换个人业绩form搜索
    changeFormPerson() {
      this.searchPersonPerfoOld = this.$util.convertObj(this.searchPersonPerfo);
      this.fetchPersonData();
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchPersonData(queryPage = 1, queryPageSize = 10){
        this.queryPersonPageSize = queryPageSize
        let {teamTotal ,page} = this.paginationPerson
        if((page - 1) * queryPageSize > teamTotal){
          this.$nextTick(()=>{
            this.fetchPersonData(queryPage,queryPageSize)
          })
        }else{
            this.fetchPersonData(queryPage,queryPageSize)
        }
    },
    //分页获取个人业绩信息
    fetchPersonData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchPersonPerfoOld,
        page,
        pageSize:this.queryPersonPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getAchievementPersonPage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.personData = res.content.list;
          //分页数据
          this.paginationPerson.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //个人业绩 ---管理机构不分页查询
    getSalesmanManageOrgList() {
      this.$api.getSalesmanManageOrgList({}).then((res) => {
        if (res.result == "0") {
          this.manManageList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //个人业绩 ---销售团队不分页查询
    getSalesmaSalesTeamList(val) {
      this.$api.getSalesmaSalesTeamList({manageOrgCode:val}).then((res) => {
        if (res.respCode == "0") {
          this.manSalesTeamList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置队伍概览信息
    reset() {
      this.searchTeamView = {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        beginDate: "",
        endDate: "",
      };
      this.changeFormSearch();
    },
    //重置个人业绩信息
    personReset() {
      this.searchPersonPerfo = {
        manageOrgCode: "",
        salesTeamCode: "",
        agentName: "",
        beginDate: "",
        endDate: "",
        agentStatus: "",
      };
      this.changeFormPerson();
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
#achievement-list {
  .search-box{
    display: flex;
    justify-content: space-between;
    .search-btn{
      min-width: 200px;
    }
  }
  .ivu-modal-body {
    max-height: 500px;
    overflow: scroll;
  }
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
}
</style>
