<template>
  <Form ref="formData" id="persom-form" v-model="selected">
    <Row class="box--flex" v-if="id==1">
      <FormItem label="员工姓名">
        <Input v-model="searchPerson.userName" />
      </FormItem>
      <FormItem label="员工id">
        <Input v-model="searchPerson.userId" />
      </FormItem>
      <FormItem label="分公司">
        <Select
          filterable
          clearable
          v-model="searchPerson.orgName"
          placeholder="请选择"
          @on-change="getDepartmentFun(...arguments)"
        >
          <Option
            v-for="(item, index) in OrgList"
            :value="item.orgName"
            :key="index"
          >{{ item.orgName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="部门">
        <Select
          filterable
          clearable
          v-model="deptName"
          placeholder="请选择"
          @on-select="getOrgFun(...arguments)"
        >
          <Option
            v-for="(item,index) in departmentList"
            :value="item.deptName+'/'+item.orgName"
            :key="index"
          >{{ item.deptName }}</Option>
        </Select>
      </FormItem>
    </Row>
    <Row class="box--flex" v-if="id!=1">
      <FormItem label="姓名">
        <Input v-model="searchPerson.agentName" />
      </FormItem>
      <FormItem label="编号">
        <Input v-model="searchPerson.agentCode" />
      </FormItem>
      <FormItem label="管理机构名称">
        <Select filterable clearable v-model="searchPerson.manageOrgName" placeholder="请选择">
          <Option
            v-for="(item, index) in manageOrgList"
            :value="item.manageOrgName"
            :key="index"
          >{{ item.manageOrgName }}</Option>
        </Select>
      </FormItem>
    </Row>
    <Row>
      <Col span="6" offset="18" style="text-align:right;" class="search-button-block">
        <Button type="primary" class="ivu-btn ivu-btn-primary" @click="searchForm()">查询</Button>
        <Button @click="searchReset()">重置</Button>
      </Col>
    </Row>
    <primaryTable
    height="300"
      :columns="tableColumns"
      :data="tableData"
      :current.sync="paginationPerson.page"
      ref="teamTable"
      :total="paginationPerson.total"
      :pageSize="paginationPerson.pageSize"
      @on-change="fetchData"
      @on-page-size-change="beForeFetchtableData(1, ...arguments)"
      class="table-from"
    ></primaryTable>
  </Form>
</template>
<script>
export default {
  props: {
    id: {
      type: Number
    },
    labelWidth: {
      type: Number,
      default: 84
    },
    propSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    tableData:{
      type:Array,
      default:()=>{
        return [];
      }
    },
    total:{
      type:Number,
      default:0
    },
    departmentList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    OrgList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    manageOrgList:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    return {
      deptName:null,
      searchPerson: {
        userName: null, //姓名
        userId: null, //企业微信编码
        deptName: null, //部门
        orgName: null, //分公司
        manageOrgName: null, //组织机构
        agentCode: null, //推荐人编码
        agentName: null //推荐人名称
      },
      searchPersonOld: {
        userName: null, //姓名
        userId: null, //企业微信编码
        deptName: null, //部门
        orgName: null, //分公司
        manageOrgName: null, //组织机构
        agentCode: null, //推荐人编码
        agentName: null //推荐人名称
      },
      // departmentList: [],
      // OrgList: [],
      // manageOrgList: [],
      paginationPerson: {
        page: 1,
        total: 0,
        pageSize: 10
      },
      selected: {
        id: "",
        name: "",
        code: ""
      },
      // tableData: [
      //   {
      //     id: 1,
      //     name: "员工",
      //     componet: "分公司",
      //     deptName: "部门"
      //   },
      //   {
      //     id: 2,
      //     name: "员工",
      //     componet: "分公司",
      //     deptName: "部门"
      //   },
      //   {
      //     id: 3,
      //     name: "员工",
      //     componet: "分公司",
      //     deptName: "部门"
      //   }
      // ],
      tableColumns: [],
      tableColumns1: [
        {
          title: "员工id",
          align: "center",
          key: "userId",
          minWidth: 130
        },
        {
          title: "员工姓名",
          align: "center",
          key: "userName",
          minWidth: 100
        },
        {
          title: "分公司",
          align: "center",
          key: "orgName",
          minWidth: 100
        },
        {
          title: "部门",
          align: "center",
          key: "deptName",
          minWidth: 100
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          minWidth: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled:
                      this.selected.id == params.row.userId ? true : false //单选
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.selectItem(params.row);
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ],
      tableColumns2: [
        {
          title: "推广人编码",
          align: "center",
          key: "agentCode",
          minWidth: 130
        },
        {
          title: "推广人姓名",
          align: "center",
          key: "agentName",
          minWidth: 100
        },
        {
          title: "管理机构代码",
          align: "center",
          key: "manageOrgCode",
          minWidth: 100
        },
        {
          title: "管理机构名称",
          align: "center",
          key: "manageOrgName",
          minWidth: 100
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          minWidth: 60,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: this.selected.id == params.row.id ? true : false //单选
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.selectItem(params.row);
                    }
                  }
                },
                "选择"
              )
            ]);
          }
        }
      ]
    };
  },
  created() {},
  mounted() {
    if (this.id == 1) {
      this.tableColumns = this.tableColumns1;
      // this.getDepartmentFun();
      // this.getCompanyList();
    } else {
      this.tableColumns = this.tableColumns2;
      // this.getManageOrgList();
    }
    this.paginationPerson.total=this.total;
    // this.fetchData();
  },
  methods: {
    // 获取部门
    getDepartmentFun(data) {
      let reqData = {
        orgName: this.searchPerson.orgName
      };
      this.$api
        .getDepartment(reqData)
        .then(res => {
          if (res.result == "0") {
            this.departmentList = res.content;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {});
    },
    // 通过部门反推分公司
    getOrgFun(data) {
      this.searchPerson.orgName = data.value.split("/")[1];
      this.searchPerson.deptName = data.value.split("/")[0];
    },
    // 获取分公司
    getCompanyList() {
      this.$api
        .getCompanyList({})
        .then(res => {
          if (res.result == "0") {
            this.OrgList = res.content;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {});
    },
    //管理机构不分页查询
    getManageOrgList() {
      this.$api.getSalesmanManageOrgList({}).then(res => {
        if (res.result == "0") {
          this.manageOrgList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    beForeFetchtableData(thisPage = 1, thisPageSize = 10) {
      this.paginationPerson.pageSize = thisPageSize;
      let { total, page } = this.paginationPerson;
      if ((page - 1) * thisPageSize > total) {
        this.$nextTick(() => {
          this.fetchData(thisPage, thisPageSize);
        });
      } else {
        this.fetchData(thisPage, thisPageSize);
      }
    },
    // 查询
    searchForm() {
      this.searchPersonOld = this.$util.convertObj(this.searchPerson);
      this.fetchData();
    },
    // 重置
    searchReset() {
      (this.searchPerson = {
        userName: null, //姓名
        userId: null, //企业微信编码
        deptName: null, //部门
        orgName: null, //分公司
        manageOrgName: null, //组织机构
        agentCode: null, //推荐人编码
        agentName: null //推荐人名称
      }),
        this.searchForm();
    },
    // 表格数据
    fetchData(page = 1, pageSize = 10) {
      // 入参数据
      const reqData = {
        ...this.searchPersonOld,
        page,
        pageSize: this.paginationPerson.pageSize
      };
      // 调用接口
      // loading
      this.$util.showLoading();
      let self = this;
      let url =
        this.id == 1 ? this.$api.getSalesInfo : this.$api.getSalesmanPage;
      url(reqData)
        .then(res => {
          // loading关闭
          self.$util.hideLoading();
          // 成功判断
          if (res.result === "0") {
            //表格数据
            this.tableData = res.content.list;
            if (this.id == 1) {
              //分页数据
              this.paginationPerson.total = res.content.pageVO.total;
            } else {
              //分页数据
              this.paginationPerson.total = res.content.total;
            }
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch(error => {
          self.$util.hideLoading();
        });
    },
    selectItem(row) {
      if (this.id == 1) {
        this.selected.id = row.userId;
        this.selected.name = row.userName;
        this.selected.code = row.userId;
      } else {
        this.selected.id = row.id;
        this.selected.name = row.agentName;
        this.selected.code = row.agentCode;
      }
    },
    handleSubmit() {
      this.$emit("finish", this.selected);
    }
  },
  watch: {},
  computed: {}
};
</script>
<style lang="less" scoped>
#persom-form {
  .box--flex {
    display: flex;
    flex-wrap: wrap;
    /deep/.ivu-form-item {
      margin-right: 30px;
      /deep/.ivu-form-item-content {
        display: inline-block;
      }
    }
  }
  .search-button-block {
    button {
      margin: 0px;
    }
    /deep/.ivu-btn-primary {
      margin-right: 20px;
    }
  }
  .table-from {
    margin-top: 20px;
  }
  /deep/.ivu-select-dropdown {
    width: 180px;
    overflow-x: hidden;
  }
  /deep/.ivu-select-dropdown-list {
    overflow: auto;
  }
}
</style>