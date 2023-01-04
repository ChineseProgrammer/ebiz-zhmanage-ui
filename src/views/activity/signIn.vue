<template>
  <div id="business-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form ref="formValidate" :model="searchBusiness" inline :label-width="100">
        <FormItem prop="phone" label="手机号">
          <Input
            v-model.trim="searchBusiness.phone"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="是否现场注册">
          <Select filterable clearable v-model.trim="searchBusiness.isSit" style="width: 160px" placeholder="请选择">
            <Option v-for="item in isSitList" :value="item.id" :key="item.id" >{{ item.isSitName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="渠道类型">
          <Select clearable filterable style="width:162px" placeholder="请选择" v-model="searchBusiness.channelType"
            @on-change="levelChange($event, 1)">
            <Option v-for="item in questionBank1" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="一级渠道">
          <Select clearable filterable style="width:162px" placeholder="请选择" v-model="searchBusiness.oneChannel"
            @on-change="levelChange($event, 2)">
            <Option v-for="item in questionBank2" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="二级渠道">
          <Select clearable filterable style="width:162px" placeholder="请选择" v-model="searchBusiness.twoChannel"
            @on-change="levelChange($event, 3)">
            <Option v-for="item in questionBank3" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="三级渠道">
          <Select clearable filterable style="width:162px" placeholder="请选择" v-model="searchBusiness.sourceChannel">
            <Option v-for="item in questionBank4" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <i-col class="float-right">
          <Button type="primary" @click="changeFormSearch(1)" style="margin-left:10px">{{ $t("query") }}</Button>
          <Button type="default" @click="reset()">{{ $t("reset") }}</Button>
        </i-col>
      </Form>
    </div>
    <!-- 列表 -->
    <Button
      v-if="isAdminCenter || button.exportSignInData" type="primary" style="margin-bottom: 10px"  @click="exportAll">导出</Button
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
      parentNameList:[],
      questionBank1: [],
      questionBank2: [],
      questionBank3: [],
      questionBank4: [],
      isSitList:[{isSitName:'是',id:1},{isSitName:'否',id:2}],
      isAdminCenter: false,
      button: this.$store.state.app.button,
      //更新form查询条件
      searchBusiness: {
        phone: "",
        isSit: "" ,
        channelType: "",
        oneChannel: "",
        twoChannel: "",
        sourceChannel: ""
      },
      // 分页数据--队伍查询
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      queryPageSize: 10, //分页条数
      tableList: [],
      //表格
      columns: [
        {
          title: "手机号",
          key: "phone",
          align: "center",
          minWidth: 100,
        },
        {
          title: "一级渠道",
          key: "oneChannel",
          align: "center",
          minWidth: 100,
           // 匹配渠道名称
           render: (h, params) => {
            let name = params.row.oneChannel;
            this.parentNameList.map(relation =>{
              if( relation.code == params.row.oneChannel){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
        {
          title: "二级渠道",
          key: "twoChannel",
          align: "center",
          minWidth: 120,
           // 匹配渠道名称
           render: (h, params) => {
            let name = params.row.twoChannel;
            this.parentNameList.map(relation =>{
              if( relation.code == params.row.twoChannel){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
        {
          title: "三级渠道",
          key: "sourceChannel",
          align: "center",
          minWidth: 90,
           // 匹配渠道名称
           render: (h, params) => {
            let name = params.row.sourceChannel;
            this.parentNameList.map(relation =>{
              if( relation.code == params.row.sourceId){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
         {
          title: "签到时间",
          key: "signTime",
          align: "center",
          minWidth: 90,
        },
        {
          title: "是否现场注册",
          key: "isSit",
          align: "center",
          minWidth: 120,
          // 匹配渠道名称
          render: (h, params) => {
            if( params.row.isSit == 1){
              return h('div', {}, '是'); 
              }else if(params.row.isSit == 2){
                return h('div', {}, '否'); 
              }
            return h('div', {}, params.row.isSit);
          }
        }
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
      console.log(this.$store.state.app.button.exportSignInData)
    this.fetchData();
    this.getQuestionBankList(0, 1);
    this.dictionaryListNoPage();
  },
  mounted: function () {},
  watch: {},
  methods: {
    exportAll() {
      this.$api
        .exportSignInData(this.searchBusiness)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "签到列表.xlsx";
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
      this.$api.signIn(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list;
          //分页数据
          this.paginationPolicy.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
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
    levelChange(e, level) {
      this.getQuestionBankList(e, level + 1);
    },
    getQuestionBankList(pid, level) {
      pid = pid || 0;
      this.$api.channelTypeList({ pid: pid, level: level }).then(res => {
        if (level === 1) {
          this.questionBank1 = res.data;
          this.questionBank2 = [];
          this.questionBank3 = [];
          this.questionBank4 = [];
          this.searchBusiness.oneChannel = '';
          this.searchBusiness.twoChannel = '';
          this.searchBusiness.sourceChannel = '';
        } else if (level === 2) {
          this.questionBank2 = res.data;
          this.questionBank3 = [];
          this.questionBank4 = [];
          this.searchBusiness.twoChannel = '';
          this.searchBusiness.sourceChannel = '';
        } else if (level === 3) {
          this.questionBank3 = res.data;
          this.questionBank4 = [];
          this.searchBusiness.sourceChannel = '';
        } else if (level === 4) {
          this.questionBank4 = res.data;
        }
      })
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
    //重置
    reset() {
      this.searchBusiness = {
        phone: "",
        oneChannel: "",
        twoChannel: "",
        sourceChannel: "",
        isSit: "" ,
        channelType : "",
        oneChannel : '',
        twoChannel : '',
        sourceChannel : ''
      };
      this.changeFormSearch();
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
