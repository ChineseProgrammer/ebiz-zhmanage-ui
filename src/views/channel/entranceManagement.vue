<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <Row>
            <FormItem prop='name' label="入口名称">
              <Input v-model.trim="params.name" placeholder="请输入" style="width:160px" />
            </FormItem>
            <FormItem label="入口链接" prop='link' class="item-margin-left">
              <Input v-model.trim="params.link" placeholder="请输入" style="width:160px" />
            </FormItem>
            <i-col class="float-right">
              <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
              <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
            </i-col>
          </Row>
          <div class="add-btns">
            <Button type="primary" @click="addExamTask()" style="margin-left:10px"
              v-if="isAdminCenter || button.addChannelEntrance">新增</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
        @on-page-size-change="changeSize" @on-edit="edit" @on-del="del" @on-change="search">
      </primaryTable>
    </div>

    <Modal v-model.trim="addQuestionBankVisible" :title="title" :loading="modalLoading" :closable="false" :width="500"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="130">
        <Row class="user-row">
          <Col span="24">
          <FormItem label="入口名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请输入" />
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="入口链接" prop="link">
            <Input v-model="formData.link" placeholder="请输入" />
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
// 任务状态

export default {
  data() {
    function IsURL(rule, value, callback) {
      var strRegex = /[a-zA-z]+:\/\/[^\s]*/;
      var re = new RegExp(strRegex);
      console.log(value, re.test(value));
      if (re.test(value)) {
        callback();
      } else {
        callback(new Error('不正确的URL'));
      }
    }

    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        name: "",
        link: "",
        pageSize: 10,
        page: 1,
      },
      formData: {
        name: "",
        link: "",
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
          title: "入口名称",
          align: "center",
          minWidth: 100,
          key: "name",
        },
        {
          title: "入口链接",
          align: "center",
          minWidth: 100,
          key: "link",
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
              if (self.isAdminCenter || self.button.deleteChannelEntrance) {
                return true;
              } else {
                return false;
              }
            },
            edit: function (item) {
              console.log(self.button.editChannelEntrance);
              if (self.isAdminCenter || self.button.editChannelEntrance) {
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
      addQuestionBankVisible: false,
      editId: 0,
      ruleValidate: {
        name: [
          { required: true, message: "请输入入口名称", trigger: "blur" },
        ],
        link: [
          { required: true, validator: IsURL, message: "请输入正确的入口链接", trigger: "blur" },
        ],
      }
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
    //重置
    resertMo() {
      this.params.name = "";
      this.params.link = "";
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
      console.log(this.params);
      this.$api.channelEntranceList(this.params).then(res => {
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
      this.title = '新增推广入口'
      this.editId = 0;
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
    },
    ok() {
      this.$refs.formData.validate((valid) => {
        console.log(valid, this.formData, '__--')
        if (valid) {
          if (this.formData.id) {
            this.$api.editChannelEntrance(this.formData).then(res => {
              console.log(res);
              this.addQuestionBankVisible = false;
              this.getList();
              this.modalLoading = false;
              this.$nextTick(() => {
                this.modalLoading = true;
              })
            })
          } else {
            this.$api.addChannelEntrance(this.formData).then(res => {
              console.log(res);
              this.addQuestionBankVisible = false;
              this.getList();
              this.modalLoading = false;
              this.$nextTick(() => {
                this.modalLoading = true;
              })
            }).catch(err => {
              this.modalLoading = false;
            })
          }
        } else {
          this.modalLoading = false;
          this.$nextTick(() => {
            this.modalLoading = true;
          })
          this.$Message.error('Fail!');
        }
      })
    },
    cancel() {
      this.addQuestionBankVisible = false;
    },
    edit(row) {
      console.log(row);
      this.title = '编辑推广入口'
      this.addQuestionBankVisible = true;
      this.$api.oneChannelEntrance({ id: row.id }).then(res => {
        console.log(res);
        let data = res.data;
        this.formData.name = data.name;
        this.formData.link = data.link;
        this.formData.id = data.id;
      })
    },
    del(row) {
      let content = this.$t("deleteTit");
      let params = { id: row.id, systemType: 0 };
      console.log(this.$t("confirm"));

      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        console.log(self.$t("delete"));
        self.$api.deleteChannelEntrance(params).then((res) => {
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
.v-transfer-dom
  .ivu-modal-wrap
  .ivu-modal
  .ivu-modal-content
  .ivu-modal-body
  .ivu-modal-confirm-body {
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

.item-margin-left {
  margin-left: 20px;
}
</style>
