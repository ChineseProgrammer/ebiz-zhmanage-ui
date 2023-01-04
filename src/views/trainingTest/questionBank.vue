<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="题库大类">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l1"
              @on-change="levelChange($event, 1)">
              <Option v-for="item in questionBank1" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="题库二类">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l2"
              @on-change="levelChange($event, 2)">
              <Option v-for="item in questionBank2" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="题库三类">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l3"
              @on-change="levelChange($event, 3)">
              <Option v-for="item in questionBank3" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="题库四类">
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
            <Button type="primary" @click="addQuestionBankType" style="margin-left:10px" v-if="isAdminCenter || button.examTypeTree">管理题库类型</Button>
            <Button type="primary" @click="download" style="margin-left:10px" v-if="isAdminCenter || button.examDownload" >下载试题导入模板</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-del="delQuestionType" @on-change="search" class="wholeTable" @importQuestion="importQuestion"
          @scanQuestionDetails="scanQuestionDetails" @on-page-size-change="changeSize">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="addQuestionBankVisible" :title="title" :loading="addQuestionBankLoading" :closable="false"
      :width="500" :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <tree-vue :getNewNumber="getNewNumber" ref="treeVue"></tree-vue>
    </Modal>
    <Modal v-model.trim="importQuestionsVisible" :title="title" :loading="uploadLoading" :closable="false" :width="900"
      :mask-closable="false" @on-ok="importOk" @on-cancel="importCancel">
      <label>
        <input type="file" @change="fileChange" id="uploadFile">注：只能上传.xls、.xlsx文件
      </label>
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
          title: "题库大类",
          align: "center",
          minWidth: 100,
          key: "name1",
        },
        {
          title: "题库二类",
          align: "center",
          minWidth: 100,
          key: "name2",
        },
        {
          title: "题库三类",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "name3",
        },
        {
          title: "题库四类",
          align: "center",
          minWidth: 100,
          key: "name4",
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          slot: "action",
          key: "btn",
          width: 150,
          btn: {
            del: function () {
              if(self.isAdminCenter || self.button.examTypeTree){
                return true;
              }
              return false;
            }
          }
        },
        {
          title: "题库试题",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          width: 150,
          slot: "action",
          selfBtn: [{
            name: "查看",
            type: "primary",
            method: "scanQuestionDetails",
            permission: 'questionBankInfo',
            show: function () {
              // console.log('------------',self.button.questionBankInfo);
              if(self.isAdminCenter || self.button.questionBankInfo){
                return true;
              }
              return false;
            }
          }, {
            name: "导入",
            type: "primary",
            method: "importQuestion",
            permission: 'questionBankImport',
            show: function () {
              if(self.isAdminCenter || self.button.questionBankImport){
                return true;
              }
              return false;
            }
          }]
        }
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
      importQuestionsVisible: false,
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
    importQuestion(row, index, item) {
      this.title = "试题导入"
      if (!row.name4) {
        this.$Message.info('请修改试题分类，需录入到4级分类');
      } else {
        this.importQuestionsVisible = true;
        this.importFormData.id = row.id;
      }
    },
    getQuestionBankList(pid, level) {
      pid = pid || 0;
      this.$api.questionBankTypeList({ pid: pid, level: level }).then(res => {
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
      this.$api.questionBankList(this.params).then(res => {
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
    delQuestionType(row) {
      let content = this.$t("deleteTit");
      console.log(row);
      let params = { id: row.id, systemType: 0 };
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.deleteQuestionBankType(params).then((res) => {
          console.log(res);
          if (res.data) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
            self.search(this.params.page);
          } else {
            self.$Message.error("存在使用该分类的考试任务，不可删除");
          }
        });
      });
    },
    addQuestionBankType() {
      this.title = '题库类型'
      this.getNewNumber++;
      this.addQuestionBankVisible = true;
    },
    download() {
      this.$api.downloadQuestionModule({}).then(res => {
        this.$util.hideLoading();
        let elink = document.createElement("a");
        elink.download = "question.xlsx";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      })
    },
    getChildrenLength(arr) {
      let flag = true;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          flag = this.getChildrenLength(arr[i].children);
        } else {
          if (arr[i].level != 4) {
            return false;
          } else {
            return true;
          }
        }
      }
      return flag;
    },
    ok() {
      this.addQuestionBankVisible = false;
      this.getQuestionBankList(0, 1);
      this.search(1);
      this.$refs.treeVue.data5 = [];
      console.log(this.$refs.treeVue.data5);

      // let hasFour = this.getChildrenLength(this.$refs.treeVue.data5);
      // if (hasFour) {
      //   this.addQuestionBankVisible = false;
      //   this.getQuestionBankList(0, 1);
      //   this.search(1);
      //   this.$refs.treeVue.data5 = [];
      // } else {
      //   this.$Message.info('试题分类需录入到4级分类');
      //   this.addQuestionBankLoading = false;
      //   setTimeout(() => {
      //     this.addQuestionBankLoading = true;
      //   })
      // }
    },
    cancel() {
      this.$refs.treeVue.cancel();
    },
    fileChange(e) {
      let name = e.target.files[0].name;
      let ext = name.substr(name.lastIndexOf('.'));
      if(ext === '.xls' || ext=== '.xlsx'){
        this.importFormData.file = e.target.files[0];
      } else {
        this.$util.showToast(this, 'warning', '只能上传.xls、.xlsx文件!');
        e.target.value = '';
      }
      
      console.log(e, ext);
    },
    importOk() {
      this.params.type = this.importFormData.id;
      this.uploadLoading = false;
      this.$nextTick(() => {
        this.uploadLoading = true;
      })
      if (!this.importFormData.file) {
        this.$util.showToast(this, 'error', '请先上传文件!')
        return
      }
      this.$api.questionList(this.params).then(res => {
        console.log(res);
        if (res.data.total) {
          this.$util.confirmDialog(this, this.$t("confirm"), '将覆盖该类型已有的试题以本次导入试题为准，确定导入吗？', (self) => {
            this.saveImportFile();
          });
        } else {
          this.saveImportFile();
        }
      })
    },
    saveImportFile() {
      let formData = new FormData();
      formData.append("file", this.importFormData.file);
      formData.append('id', this.importFormData.id);
      this.$api.importFile(formData).then(res => {
        console.log(res);
        this.importQuestionsVisible = false;
        document.getElementById("uploadFile").value = '';
      }).catch(err => {
        this.importQuestionsVisible = false;
      })
    },
    importCancel() {
      this.importQuestionsVisible = false;
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
</style>
