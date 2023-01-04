<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem prop='title' label="考试主题">
            <Input v-model.trim="params.title" placeholder="请输入" style="width:160px" />
          </FormItem>
          <FormItem label="是否上架" prop='enable' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.enable">
              <Option v-for="item in enables" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem prop='pass' label="及格分数">
            <Input v-model.trim="params.pass" placeholder="请输入" style="width:160px" />
          </FormItem> -->
          <FormItem prop='mins' label="考试时长(min)" class="form-item item-margin-left">
            <Input v-model.trim="params.mins" placeholder="请输入" style="width:160px" />
          </FormItem>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" @click="addExamTask()" style="margin-left:10px" v-if="isAdminCenter || button.newExamManageAdd">新增考试任务</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @examPeopleList="examPeopleList" @on-page-size-change="changeSize" @on-edit="edit" @on-del="del"
          @on-add1="add1" @on-add2="add2" @on-check="check" @on-change="search">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="addQuestionBankVisible" :title="title" :loading="modalLoading" :closable="false" :width="1200"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <add-new-exam-task-vue :getNewNumber="getNewNumber" ref="addExamTaskRef" :enables="enables" :id="editId"
        :scanFlag="scanFlag">
      </add-new-exam-task-vue>
      <div slot="footer" v-if="scanFlag">
        <Button type="primary" @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import addNewExamTaskVue from './addNewExamTask';

export default {
  components: { addNewExamTaskVue },
  data() {
      let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        title: "",
        enable: "",
        mins: "",
        pageSize: 10,
        page: 1,
      },
      enables: [{
        id: '1',
        name: '是'
      }, {
        id: '2',
        name: '否'
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
          title: "考试时长(min)",
          align: "center",
          minWidth: 120,
          key: "mins",
        },
        {
          title: "是否上架",
          align: "center",
          minWidth: 120,
          key: "mold",
          render: (h, params) => {
            let index = this.enables.findIndex(one => {
              return one.id == params.row.enable;
            })
            return h('div', {}, this.enables[index].name);
          }
        },
        {
          title: "操作",
          align: "center",
          minWidth: 180,
          slot: "action",
          key: "btn",
          btn: {
            del: function (item) {
              if (item.enable == '2'&& (self.isAdminCenter || self.button.newExamManageDel) ) {
                return true;
              } else {
                return false;
              }
            },
            edit: function (item) {
             if (item.enable == '2'&& (self.isAdminCenter || self.button.newExamManageUpdate) ) {
                return true;
              } else {
                return false;
              }
            },
            check: function (item) {
              if (self.isAdminCenter || self.button.newExamManageGetInfo) {
                return true;
              } else {
                return false;
              }
            },
            add1: {
              text: '下架',
              show: function (item) {
                if (item.enable == '1' &&(self.isAdminCenter || self.button.newExamManageOffShelf)) {
                  return true;
                } else {
                  return false;
                }
              }
            },
            add2: {
              text: '二维码',
              show: function (item) {
                if (item.enable == '1' &&(self.isAdminCenter || self.button.newExamManageQrcode)) {
                  return true;
                } else {
                  return false;
                }
              }
            },
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
            method: "examPeopleList",
            permission: 'newExamManagePeopleList',
            show: function () {
              if(self.isAdminCenter || self.button.newExamManagePeopleList){
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
      this.$router.push({ path: '/examPeopleList', query: { id: row.id, type: 'new' ,title:row.title} });
    },
    getQuestionBankList(pid, level) {
      pid = pid || 0;
    },
    //重置
    resertMo() {
      this.params.title = "";
      this.params.mins = "";
      this.params.enable = "";
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
      this.params.type = 'new';
      this.$api.examTaskList(this.params).then(res => {
        console.log(res);
        this.tableList = res.data.list;
        this.total = res.data.total;
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
    add1(row) {
      let params = { id: row.id, enable: 2, systemType: 0 };
      this.$util.confirmDialog(this, this.$t("confirm"), '确定下架该任务吗？', (self) => {
        self.$api.recallExamTask(params).then((res) => {
          if (res) {
            self.search(1);
            self.$Message.success('下架' + self.$t("success"));
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    add2(row) {
      this.$api.getQrCode( {id:row.id}).then(res => {
        this.$util.hideLoading();
        let elink = document.createElement("a");
        elink.download = row.title + ".jpg";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      })
    },
    down_qr(src, name) {
        var image = new Image()
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous')
        console.log(src);
        image.onload = function () {
            console.log("===");
            var canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height

            var context = canvas.getContext('2d')
            context.drawImage(image, 0, 0, image.width, image.height)
            var url = canvas.toDataURL('image/png')
            var a = document.createElement('a')
            // 创建一个单击事件
            var event = new MouseEvent('click')
            a.download = name;
            a.href = url
            // 触发a的单击事件
            a.dispatchEvent(event)
        }
        image.src = src;
    },
    del(row) {
      let content = this.$t("deleteTit");
      let params = { id: row.id, systemType: 0 };
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
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

<style lang="less" scoped>
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

.form-item{
  margin-left: 20px;
}
.form-item .ivu-form-item-label {
  white-space: nowrap;
}

.item-margin-left{
  margin-left: 100px;
}
</style>
