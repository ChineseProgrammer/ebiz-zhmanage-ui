<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <div style="display:flex;justify-content:space-between;">
            <FormItem prop='userName' label="代理人姓名">
              <Input v-model.trim="params.userName" placeholder="请输入" style="width:160px" clearable />
            </FormItem>
            <FormItem prop='orgCode' label="机构名称">
              <Select clearable filterable placeholder="请选择" v-model="params.orgCode">
                <Option v-for="item in orgList" :value="item.creditCode" :key="item.creditCode">{{ item.orgName }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="权重起始时间" prop="timeRange" class="item-margin-left">
              <DatePicker type="daterange" split-panels format="yyyy-MM-dd" placeholder="请选择"
                style="width:260px;" v-model.trim="params.timeRange"></DatePicker>
            </FormItem>
            <i-col class="float-right">
              <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
              <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
            </i-col>
          </div>
          <div class="add-btns">
            <Button type="primary" @click="edit" style="margin-left:10px"
              v-if="isAdminCenter || button.addWeight">新增权重</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-page-size-change="changeSize" @on-edit="edit" @on-del="del" @on-change="search"
          @agentWeight="agentWeight">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="editWeightVisible" :title="title" :loading="modalLoading" :closable="false" :width="800"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <weight-edit-vue ref="weightEditRef" :orgList="orgList" :getNewNumber="getNewNumber" :batch="batch" :orgCode="orgCode">
      </weight-edit-vue>
    </Modal>
  </div>
</template>

<script>
// 任务状态
import statusMixin from '../../lib/statusMixin';
import weightEditVue from './weightEdit.vue';

export default {
  components: { weightEditVue },
  mixins: [statusMixin],
  data() {
    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        orgCode: "",
        userName: "",
        timeRange: [],
        end: '',
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
          title: "权重批次",
          align: "center",
          minWidth: 100,
          key: "batch",
        },
        {
          title: "机构",
          align: "center",
          minWidth: 150,
          key: "orgName",
        },
        {
          title: "权重起始时间",
          align: "center",
          minWidth: 150,
          key: "start",
        },
        {
          title: "代理人权重",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          width: 150,
          slot: "action",
          selfBtn: [{
            name: "代理人权重",
            type: "primary",
            method: "agentWeight",
            permission: 'agentWeight',
            show: function () {
              if (self.isAdminCenter || self.button.agentWeight) {
                return true;
              }
              return false;
            }
          }]
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
              if (self.isAdminCenter || self.button.removeWeight) {
                return true;
              } else {
                return false;
              }
            },
            edit: function (item) {
              if (self.isAdminCenter || self.button.editWeight) {
                return true;
              } else {
                return false;
              }
            },
          }
        },
      ],
      modelShow: false,
      title: '',
      editWeightVisible: false,
      importFormData: {
        file: null,
      },
      batch: "0",
      scanFlag: false,
      orgList: [],
      orgCode: ''
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {

    }
    this.getCompanyList();
    this.search(1);
  },
  mounted: function () {
  },
  methods: {
    getCompanyList() {
      this.$api.getCompanyList({}).then((res) => {
        console.log(res);
        if (res.respCode == "0") {
          this.orgList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置
    resertMo() {
      this.params.orgCode = "";
      this.params.userName = "";
      this.params.timeRange = [];
      this.params.end = "";
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
        // + " " + d.getHours().toString().padStart(2, 0)
        // + ':' + d.getMinutes().toString().padStart(2, 0)
        // + ':' + d.getSeconds().toString().padStart(2, 0)
      return time;
    },
    //获得题库类型列表·
    getList() {
      console.log(this.params);
      if (this.params.timeRange && this.params.timeRange.length === 2 && this.params.timeRange[0]) {
        this.params.start = this.formatDate(this.params.timeRange[0]) + ' 00:00:00';
        this.params.end = this.formatDate(this.params.timeRange[1]) + ' 23:59:59';
      } else {
        this.params.start = '';
        this.params.end = '';
      }
      let params = JSON.parse(JSON.stringify(this.params));
      delete params.timeRange;
      this.$api.getWeightList(params).then(res => {
        console.log(res);
        if (res) {
          this.tableList = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableList = [];
          this.total = 0;
        }
      })
    },
    agentWeight(row) {
      this.$router.push({ path: '/agentWeight', query: {batch: row.batch} })
    },
    ok() {
      console.log("====");
      this.$refs.weightEditRef.handleSubmit((type) => {
        console.log(type);
        if (type) {
          this.editWeightVisible = false;
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
      this.editWeightVisible = false;
      this.$refs.weightEditRef.reset();
    },
    edit(row) {
      if (row && row.batch) {
        this.batch = row.batch;
        console.log(row);
        this.orgCode = row.orgCode
        this.title = '修改权重';
      } else {
        this.batch = "0";
        this.title = '新增权重';
      }
      console.log(row);
      this.getNewNumber++;
      this.editWeightVisible = true;
    },
    del(row) {
      let content = this.$t("deleteTit");
      let params = { batch: row.batch, systemType: 0 };
      console.log(this.$t("confirm"));

      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        console.log(self.$t("delete"));
        self.$api.deleteWeight(params).then((res) => {
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
</style>
