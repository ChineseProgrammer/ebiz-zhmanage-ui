<template>
  <Form ref="formData" id="persom-form" v-model="searchPerson">
    <Row class="box--flex">
      <FormItem label="推广人姓名">
        <Input v-model.trim="searchPerson.userName" />
      </FormItem>
      <FormItem label="推广人userid">
        <Input v-model.trim="searchPerson.userId" />
      </FormItem>
      <FormItem label="分公司">
        <Select filterable clearable v-model="searchPerson.orgName" placeholder="请选择">
          <Option
            v-for="(item, index) in manageOrgList"
            :value="item.orgName"
            :key="index"
          >{{ item.orgName }}</Option>
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
      @on-select="selectObj"
      @on-select-cancel="selectObj"
      @on-select-all="selectObj"
      @on-select-all-cancel="selectObj"
      @on-page-size-change="beForeFetchtableData(1, ...arguments)"
      class="table-from"
    ></primaryTable>
  </Form>
</template>
<script>
export default {
  props: {
    selectedArr: {
      type: Array,
      default: () => {
        return [];
      }
    },
    userIdData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    manageOrgList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    showSecond: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchPerson: {
        userName: null,
        userId: null,
        manageOrgCode: null
      },
      searchPersonOld: {
        userName: null,
        userId: null,
        manageOrgCode: null
      },
      paginationPerson: {
        page: 1,
        total: 0,
        pageSize: 10
      },
      tableData: [
        {
          id: 1,
          name: "员工",
          componet: "分公司",
          department: "部门"
        },
        {
          id: 2,
          name: "员工",
          componet: "分公司",
          department: "部门"
        },
        {
          id: 3,
          name: "员工",
          componet: "分公司",
          department: "部门"
        }
      ],
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "推广人userid",
          align: "center",
          key: "userId",
          minWidth: 130
        },
        {
          title: "推广人姓名",
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
        }
      ]
    };
  },
  created() {},
  mounted() {
    if (Object.keys(this.userIdData) !== "0") {
      this.tableData = this.userIdData.list;
      this.paginationPerson.total = this.userIdData.total;
    }
  },
  methods: {
    fetchtableData() {},
    beForeFetchtableData() {},
    // 查询
    searchForm() {
      this.searchPersonOld = this.$util.convertObj(this.searchPerson);
      this.fetchData();
    },
    // 重置
    searchReset() {
      (this.searchPerson = {
        userName: null,
        userId: null,
        manageOrgCode: null
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
      // this.$api.userIdData(reqData).then(res => {
      this.$api.getSalesInfo(reqData).then(res => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableData = res.content.list;
          if (this.selectedArr.length > 0) {
            this.tableData.forEach(item => {
              this.selectedArr.forEach(items => {
                if (items.wxUserId==item.wxUserId&& item.wxUserId) {
                  item._checked = true;
                }
              });
            });
          }
          //分页数据
          this.paginationPerson.total = res.content.pageVO.total;
          this.paginationPerson.page = res.content.pageVO.pageNum;
          this.paginationPerson.pageSize = res.content.pageVO.pageSize;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    selectObj(selection, row, index) {
      this.$emit("selectedFun", selection);
    }
  },
  watch: {
    showSecond(newVal, oldVal) {
      if (newVal == true) {
        this.searchPerson = {
          userName: null,
          userId: null,
          manageOrgCode: null
        };
        this.searchForm();
      }
    }
  },
  computed: {}
};
</script>
<style lang="less" scoped>
#persom-form {
  .box--flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    /deep/.ivu-form-item {
      margin-right: 20px;
      /deep/.ivu-form-item-content {
        display: inline-block;
        .ivu-select-dropdown{
          overflow: auto;
          width:100%;
        }
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
}
</style>