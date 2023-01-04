<template>
  <div class="user-list">
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-change="search" class="wholeTable" @on-add1="questionareDetails" noDataText="暂没有人参与此考试，可将二维码转发给考试人员"
          @on-page-size-change="changeSize">
        </primaryTable>
      </div>
    </div>
  </div>
</template>

<script>
// 人员状态
import statusMixin from '../../lib/statusMixin';
export default {
  mixins: [statusMixin],
  data() {
    let self = this
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
      molds: [{
        id: '1',
        name: '补考'
      }, {
        id: '2',
        name: '初考'
      }],
      columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "考试人员姓名",
          align: "center",
          minWidth: 100,
          key: "userName",
        },
        {
          title: "手机号",
          align: "center",
          minWidth: 100,
          key: "mobile",
        },
        {
          title: "所属机构",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "org"
        },
        {
          title: "考试结果",
          align: "center",
          minWidth: 120,
          key: "status",
          width: 150,
          render: (h, params) => {
            if (params.row.result) {
              return h('div', {}, params.row.result);
            }
          }
        },
        {
          title: "考试分数",
          align: "center",
          minWidth: 120,
          key: "score",
          width: 150,
        },
        {
          title: "考试开始时间",
          align: "center",
          minWidth: 120,
          key: "start",
          width: 150,
        },
        {
          title: "考试完成时间",
          align: "center",
          minWidth: 120,
          key: "end",
          width: 150,
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          key: "btn",
          width: 150,
          slot: "action",
          btn: {
            add1: {
              text: '答卷详情',
              show: function (item) {
                if (item.result && (self.isAdminCenter || self.button.questionareDetails)) {
                  return true;
                } else {
                  return false;
                }
              }
            },
          }
        }
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
    }
    let type = this.$route.query.type;
    if (type === 'new') {
      let index = this.columns.findIndex(one => {
        return one.key === 'org';
      })

      this.columns.splice(index, 1);
    }
    this.search(1);
  },
  mounted: function () {
  },
  methods: {
    questionareDetails(row, index, item) {
      this.$router.push({ path: '/questionareDetails', query: { logId: row.id, taskId: row.task, start: row.start, end: row.end, score: row.score, times: row.times, result: row.result } });
    },
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
      this.params.task = this.$route.query.id;
      this.$api.examPeopleList(this.params).then(res => {
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
