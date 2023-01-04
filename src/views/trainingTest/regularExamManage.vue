<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <Row>
            <FormItem prop='title' label="考试主题">
              <Input v-model.trim="params.title" placeholder="请输入" style="width:160px" />
          </FormItem>
          <FormItem label="任务类型" prop='kind' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.kind">
              <Option v-for="item in taskTypes" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="考试类型" prop='mold' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.mold">
              <Option v-for="item in molds" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem prop='mins' label="考试时长(min)" class="form-item item-margin-left">
            <Input v-model.trim="params.mins" placeholder="请输入" style="width:160px" />
          </FormItem>
            </Row>
            <Row>
          <FormItem label="考试起始时间" prop="start">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择" style="width:160px;"
              v-model.trim="params.start"></DatePicker>
          </FormItem>
          <FormItem label="考试截止时间" prop="end" class="item-margin-left">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择" style="width:160px;"
              v-model.trim="params.end"></DatePicker>
          </FormItem>
          <FormItem prop='mark' label="考试人员" class="item-margin-left">
            <Input v-model.trim="params.mark" placeholder="请输入" style="width:160px" />
          </FormItem>
          </Row>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" @click="addExamTask()" style="margin-left:10px"  v-if="isAdminCenter || button.examUserAdd">新增考试任务</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @examPeopleList="examPeopleList" @on-page-size-change="changeSize" @on-edit="edit" @on-del="del"
          @on-recall="recall" @on-check="check" @on-change="search">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="addQuestionBankVisible" :title="title" :loading="modalLoading" :closable="false" :width="1200"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <add-exam-task-vue :getNewNumber="getNewNumber" ref="addExamTaskRef" :molds="molds" :id="editId" :taskTypes="taskTypes"
        :scanFlag="scanFlag">
      </add-exam-task-vue>
      <div slot="footer" v-if="scanFlag">
        <Button type="primary" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import addExamTaskVue from './addExamTask';
// 任务状态
import statusMixin from '../../lib/statusMixin';

export default {
  components: { addExamTaskVue },
  mixins: [statusMixin],
  data() {
    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        title: "",
        mold: "",
        kind: '',
        mins: "",
        start: "",
        end: "",
        mark: '',
        type: 'regular',
        pageSize: 10,
        page: 1,
      },
      molds: [{
        id: '1',
        name: '补考'
      }, {
        id: '2',
        name: '初考'
      }],
      taskTypes: [{
        id: '1',
        name: '常规'
      }, {
        id: '2',
        name: '临时'
      }],
      getNewNumber: 1,
      total: 0,
      tableList: [],
      columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "考试主题",
          align: "center",
          minWidth: 100,
          key: "title",
        },
        {
          title: "任务类型",
          align: "center",
          minWidth: 100,
          key: "kind",
          render: (h, params) => {
            let index = this.taskTypes.findIndex(one => {
              return one.id == params.row.kind;
            })
            return h('div', {}, this.taskTypes[index].name);
          }
        },
        {
          title: "考试起始时间",
          align: "center",
          minWidth: 150,
          key: "start",
        },
        {
          title: "考试截止时间",
          align: "center",
          minWidth: 150,
          key: "end",
        },
        {
          title: "考试时长(min)",
          align: "center",
          minWidth: 120,
          key: "mins",
          width: 150,
        },
        {
          title: "考试人数",
          align: "center",
          minWidth: 120,
          key: "num",
          width: 120,
          render: (h, params) => {
            let total = params.row.userList.length;
            let joinNum = 0;

            params.row.userList.map(one => {
              if (one.status === 2) {
                joinNum++;
              }
            })
            return h('div', {}, joinNum + '/' + total);
          }
        },
        {
          title: "考试类型",
          align: "center",
          minWidth: 120,
          key: "mold",
          width: 120,
          render: (h, params) => {
            let index = this.molds.findIndex(one => {
              return one.id == params.row.mold;
            })
            return h('div', {}, this.molds[index].name);
          }
        },
        {
          title: "考试状态",
          align: "center",
          minWidth: 120,
          key: "status",
          width: 120,
          render: (h, params) => {
            let index = this.status.findIndex(one => {
              return one.key == params.row.status;
            })
            return h('div', {}, this.status[index].name);
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          slot: "action",
          key: "btn",
          width: 200,
          btn: {
            del: function (item) {
              if (item.status <= 2 && (self.isAdminCenter || self.button.regularExamManageDelete)) {
                return true;
              } else {
                return false;
              }
            },
            edit: function (item) {
              if (item.status <= 2 && (self.isAdminCenter || self.button.regularExamManageUpdate)) {
                return true;
              } else {
                return false;
              }
            },
            check: function (item) {
              if (self.isAdminCenter || self.button.regularExamManageInfo) {
                return true;
              } else {
                return false;
              }
            },
            recall: function (item) {
              if (item.status === 3 && (self.isAdminCenter || self.button.regularExamManageRecall)) {
                return true;
              } else {
                return false;
              }
            }
          }
        },
        {
          title: "参考人员",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          width: 150,
          slot: "action",
          selfBtn: [{
            name: "考试人员列表",
            type: "primary",
            method: "examPeopleList" ,
            permission: 'examPeopleList',
            show: function () {
              if(self.isAdminCenter || self.button.examPeopleList){
                return true;
              }
              return false;
            }
          }]
        }
      ],
      modelShow: false,
      title: '',
      addQuestionBankVisible: false,
      importQuestionsVisible: false,
      importFormData: {
        file: null,
      },
      editId: 0,
      scanFlag: false
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
     
    }
    this.search(1);
  },
  mounted: function () {
  },
  methods: {
    examPeopleList(row, index, item) {
      this.$router.push({ path: '/examPeopleList', query: { id: row.id ,title:row.title}});
    },
    getQuestionBankList(pid, level) {
      pid = pid || 0;
    },
    //重置
    resertMo() {
      this.params.title = "";
      this.params.mold = "";
      this.params.kind = "";
      this.params.mins = "";
      this.params.start = "";
      this.params.end = "";
      this.params.mark = "";
      this.search(1);
    },

    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
      console.log(page);
      this.params.page = page ? page : 1;

      this.getList();
    },
    formatDate(date) {
      let d = new Date(date);
      let time = d.getFullYear()
        + "-" + (d.getMonth() + 1).toString().padStart(2, 0)
        + "-" + d.getDate().toString().padStart(2, 0)
        + " " + d.getHours().toString().padStart(2, 0)
        + ':' + d.getMinutes().toString().padStart(2, 0)
        + ':' + d.getSeconds().toString().padStart(2, 0)
      return time;
    },
    //获得题库类型列表·
    getList() {
      this.params.type = 'regular';
      console.log(this.params);
      if (this.params.start) {
        this.params.start = this.formatDate(this.params.start)
      }
      if (this.params.end) {
        this.params.end = this.formatDate(this.params.end)
      }
      this.$api.examTaskList(this.params).then(res => {
        console.log(res);
        if (res.data) {
          this.tableList = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableList = [];
          this.total = 0;
        }
      })
    },
    addExamTask() {
      this.title = '新增考试任务'
      this.editId = 0;
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
    },
    ok() {
      this.$refs.addExamTaskRef.handleSubmit((type) => {
        console.log(type);
        if (type) {
          this.addQuestionBankVisible = false;
          this.search(1);
        }
        this.modalLoading = false;
        setTimeout(() => {
          this.modalLoading = true;
        }, 0)
      })
    },
    cancel() {
      this.scanFlag = false;
      this.addQuestionBankVisible = false;
      this.$refs.addExamTaskRef.cancel();
    },
    edit(row) {
      console.log(row);
      this.editId = row.id;
      this.title = '编辑考试任务'
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
    },
    check(row) {
      this.editId = row.id;
      this.title = '查看考试任务'
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
      this.scanFlag = true;
    },
    recall(row) {
      let params = { id: row.id, status: 5, systemType: 0 };
      this.$util.confirmDialog(this, this.$t("confirm"), '确定撤回该任务吗？', (self) => {
        self.$api.recallExamTask(params).then((res) => {
          if (res) {
            self.search(1);
            self.$Message.success(self.$t("withdraw") + self.$t("success"));
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    del(row) {
      let content = this.$t("deleteTit");
      let params = { id: row.id, systemType: 0 };
      console.log(this.$t("confirm"));

      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        console.log(self.$t("delete"));
        self.$api.delExamTask(params).then((res) => {
          if (res) {
            self.search(1);
            self.$Message.success(self.$t("delete") + self.$t("success"));
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    }
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

.header {
  padding-top: 10px;
}

.add-btns {
  display: flex;
  margin-bottom: 10px;
}

.form-item .ivu-form-item-label {
  white-space: nowrap;
}

.item-margin-left{
  margin-left: 20px;
}
</style>
