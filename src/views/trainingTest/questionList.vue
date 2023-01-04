<template>
  <div class="user-list">
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-change="search" class="wholeTable"
          @on-page-size-change="changeSize">
        </primaryTable>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      searchTime: [],
      button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {
        pageSize: 10,
        page: 1,
      },
      getNewNumber: 1,
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      roleList: [],
      companyList: [],
      searchData: [],
      deptList: [],
      columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "题型",
          align: "center",
          minWidth: 100,
          key: "subject",
        },
        {
          title: "题目",
          align: "center",
          minWidth: 300,
          key: "title",
        },
        {
          title: "答案",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "answer",
        },
        {
          title: "解析",
          align: "center",
          minWidth: 120,
          key: "parse",
          width: 300,
        },
        {
          title: "选项A",
          align: "center",
          minWidth: 120,
          key: "a",
          width: 150,
        },
        {
          title: "选项B",
          align: "center",
          minWidth: 120,
          key: "b",
          width: 150,
        },
        {
          title: "选项C",
          align: "center",
          minWidth: 120,
          key: "c",
          width: 150,
        },
        {
          title: "选项D",
          align: "center",
          minWidth: 120,
          key: "d",
          width: 150,
        },
        {
          title: "选项E",
          align: "center",
          minWidth: 120,
          key: "e",
          width: 150,
        },
        {
          title: "选项F",
          align: "center",
          minWidth: 120,
          key: "f",
          width: 150,
        },
        {
          title: "选项G",
          align: "center",
          minWidth: 120,
          key: "g",
          width: 150,
        },
      ],
      modelShow: false,
      formData: {
        channelName: "",
        channelCode: "",
      },
      ruleValidate: {
        channelCode: [
          { required: true, message: "请输入渠道标识", trigger: "blur" },
        ],
      },
      title: '',
      addQuestionBankVisible: false,
      questionBank1: [],
      questionBank2: [],
      questionBank3: [],
      questionBank4: [],
      importQuestionsVisible: false,
      importFormData: {
        file: null,
      },
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.search(1);
  },
  mounted: function () {
    console.log(this.treeData);
  },
  methods: {
    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
      this.params.page = page ? page : 1;

      this.getList();
    },
    //获得角色·
    getList() {
      console.log(this.$route.query);
      this.params.type = this.$route.query.id;
      this.$api.questionList(this.params).then(res => {
        console.log(res);
        this.tableList = res.data.list;
        this.total = res.data.total;
      })
    },
  },
  filters: {},
};
</script>

<style lang="less">
.v-transfer-dom .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body .ivu-modal-confirm-body {
  height: auto !important;
  max-height: 350px !important;
  color: unset !important;
  overflow: auto;
}

.add-btns {
  display: flex;
  margin-bottom: 10px;
}
</style>
