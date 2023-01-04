<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="渠道类型">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l1"
              @on-change="levelChange($event, 1)">
              <Option v-for="item in questionBank1" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="一级渠道">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l2"
              @on-change="levelChange($event, 2)">
              <Option v-for="item in questionBank2" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="二级渠道">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l3"
              @on-change="levelChange($event, 3)">
              <Option v-for="item in questionBank3" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="三级渠道">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l4">
              <Option v-for="item in questionBank4" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" @click="addQuestionBankType" style="margin-left:10px" v-if="isAdminCenter || button.channelMenu">渠道目录</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-change="search" class="wholeTable" @on-page-size-change="changeSize">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="addQuestionBankVisible" :title="title" :loading="addQuestionBankLoading" :closable="false"
      :width="500" :mask-closable="false" @on-ok="ok">
      <tree-vue :getNewNumber="getNewNumber" ref="treeVue"></tree-vue>
    </Modal>
  </div>
</template>

<script>
import treeVue from './tree.vue';

export default {
  components: { treeVue },
  data() {
    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {
        l1: "",
        l2: "",
        l3: "",
        l4: "",
        pageSize: 10,
        page: 1,
      },
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
          title: "渠道类型",
          align: "center",
          minWidth: 100,
          key: "name1",
        },
        {
          title: "一级渠道",
          align: "center",
          minWidth: 100,
          key: "name2",
        },
        {
          title: "二级渠道",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "name3",
        },
        {
          title: "三级渠道",
          align: "center",
          minWidth: 100,
          key: "name4",
        },
      ],
      modelShow: false,
      formData: {
        channelName: "",
        channelCode: "",
      },
      title: '',
      addQuestionBankVisible: false,
      addQuestionBankLoading: true,
      questionBank1: [],
      questionBank2: [],
      questionBank3: [],
      questionBank4: [],
      importFormData: {
        file: null,
      },
      uploadLoading: true
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
      if (!this.isAdminCenter) {
        // this.columns.pop();
      }
    }
    this.search(1);

    this.getQuestionBankList(0, 1);
  },
  mounted: function () {
  },
  watch: {
  },
  methods: {
    levelChange(e, level) {
      this.getQuestionBankList(e, level + 1);
    },
    scanQuestionDetails(row, index, item) {
      this.$router.push({ path: '/questionList', query: { id: row.id } });
    },
    getQuestionBankList(pid, level) {
      pid = pid || 0;
      this.$api.channelTypeList({ pid: pid, level: level }).then(res => {
        console.log(res);
        if (level === 1) {
          this.questionBank1 = res.data;
          this.questionBank2 = [];
          this.questionBank3 = [];
          this.questionBank4 = [];
          this.params.l2 = '';
          this.params.l3 = '';
          this.params.l4 = '';
        } else if (level === 2) {
          this.questionBank2 = res.data;
          this.questionBank3 = [];
          this.questionBank4 = [];
          this.params.l3 = '';
          this.params.l4 = '';
        } else if (level === 3) {
          this.questionBank3 = res.data;
          this.questionBank4 = [];
          this.params.l4 = '';
        } else if (level === 4) {
          this.questionBank4 = res.data;
        }
      })
    },
    //重置
    resertMo() {
      this.params.l1 = "";
      this.params.l2 = '';
      this.params.l3 = '';
      this.params.l4 = '';
      this.search(1);
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
    //获得题库类型列表·
    getList() {
      console.log(this.params);
      this.$api.channelList(this.params).then(res => {
        console.log(res);
        this.tableList = res.data.list;
        if (this.tableList.length === 0 && this.params.page > 1) {
          this.params.page -= 1;
          this.search(this.params.page);
          return
        }
        this.total = res.data.total;
      })
    },
    addQuestionBankType() {
      this.title = '渠道类型'
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
    },
    ok() {
      this.addQuestionBankVisible = false;
      this.getQuestionBankList(0, 1);
      this.search(1);
      this.$refs.treeVue.data5 = [];
      console.log(this.$refs.treeVue.data5);
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

.header {
  padding-top: 10px;
}

.add-btns {
  display: flex;
  margin-bottom: 10px;
}
</style>
