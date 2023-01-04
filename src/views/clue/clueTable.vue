<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="产品名称" prop='productName' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.productName">
              <Option v-for="(item, index) in productNameList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="产品版本名称" prop='productVersion' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.productVersion">
              <Option v-for="(item, index) in productVersionList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="渠道名称" prop='channelName' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.channelName">
              <Option v-for="(item, index) in channelNameList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="活动名称" prop='activityName' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.activityName">
              <Option v-for="(item, index) in activityNameList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="线索分配时间" prop="clueAllotTime">
            <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="请选择" style="width:160px;"
              v-model.trim="params.clueAllotTime"></DatePicker>
          </FormItem>
          <FormItem label="线索归属机构" prop='clueOrgCode' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.clueOrgCode">
              <Option v-for="item in orgList" :value="item.creditCode" :key="item.creditCode">{{ item.orgName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="线索状态" prop='clueAllotStatus' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.clueAllotStatus">
              <Option v-for="item in clueAllotStatus" :value="item.key" :key="item.key">{{ item.text }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="线索跟进人" prop='agentName' class="item-margin-left" v-if="isMain">
            <Input placeholder="请填入" v-model="params.agentName"></Input>
          </FormItem>
          <FormItem label="留资日期" prop="liuziTime" class="item-margin-left">
            <DatePicker type="daterange" format="yyyy-MM-dd" placeholder="请选择" style="width:160px;"
              v-model.trim="params.liuziTime"></DatePicker>
          </FormItem>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" style="margin-left:10px" v-if="isAdminCenter || button.exportData"
              @click="exportData">批量导出</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @reDistribution="reDistribution" @reDistributionDetails="reDistributionDetails"
          @on-page-size-change="changeSize" @on-change="search">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="reDistributionVisible" :title="title" :loading="modalLoading" :closable="false" :width="800"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <re-distribution-vue ref="redisributionRef" :getNewNumber="getNewNumber" :orgList="orgList" :id="editId"
        :agentId="agentId"></re-distribution-vue>
    </Modal>
  </div>
</template>

<script>
// 任务状态
import statusMixin from '../../lib/statusMixin';
import reDistributionVue from './reDistribution.vue';
export default {
  components: { reDistributionVue },
  mixins: [statusMixin],
  data() {
    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        productName: "",
        productVersion: "",
        channelName: "",
        activityName: "",
        clueOrgCode: "",
        clueAllotStatus: '',
        liuziTime: '',
        clueAllotTimeStart: '',
        clueAllotTimeEnd: '',
        liuziTimeStart: '',
        liuziTimeEnd: '',
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
      clueAllotStatus: [{ key: 0, text: '待分配' }, { key: 1, text: '已分配' }, { key: 2, text: '再分配' }],
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
          title: "姓名",
          align: "center",
          minWidth: 100,
          key: "clientName",
        },
        {
          title: "性别",
          align: "center",
          minWidth: 150,
          key: "clientSex",
        },
        {
          title: "年龄",
          align: "center",
          minWidth: 150,
          key: "clientAge",
          render: (h, params) => {
            if (params.row.clientAge && params.row.clientAge !== 'null') {
              return h('div', {}, params.row.clientAge);
            } else {
              return h('div', {}, '');
            }
          },
        },
        {
          title: "联系电话",
          align: "center",
          minWidth: 120,
          key: "clientPhone",
          width: 150,
        },
        {
          title: "基本保额(万元)",
          align: "center",
          minWidth: 120,
          key: "clientPrem",
          width: 150,
        },
        {
          title: "产品名称",
          align: "center",
          minWidth: 120,
          key: "productName",
          width: 150,
        },
        {
          title: "产品版本名称",
          align: "center",
          minWidth: 120,
          key: "productVersion",
          width: 150,
          notMain: true
        },
        {
          title: "渠道名称",
          align: "center",
          minWidth: 120,
          key: "channelName",
          width: 150,
          notMain: true
        },
        {
          title: "活动名称",
          align: "center",
          minWidth: 120,
          key: "activityName",
          width: 150,
          notMain: true
        },
        {
          title: "留资时间",
          align: "center",
          minWidth: 120,
          key: "liuziTime",
          width: 150,
        },
        {
          title: "线索分配时间",
          align: "center",
          minWidth: 120,
          key: "clueAllotTime",
          width: 150,
        },
        {
          title: "线索归属机构",
          align: "center",
          minWidth: 120,
          key: "clueOrgName",
          width: 150,
          // 线索分配状态 0待分配、1已分配、2再分配
          render: (h, params) => {
            let str = '';
            if (params.row.clueAllotStatus == 0) {
              str = '';
            } else if (params.row.clueAllotStatus == 1) {
              str = params.row.clueOrgName;
            } else if (params.row.clueAllotStatus == 2) {
              str = params.row.clueOrgName;
            }
            return h('div', {}, str);
          },
          notMain: true
        },
        {
          title: "线索跟进人",
          align: "center",
          minWidth: 120,
          key: "agentName",
          width: 150,
        },
        {
          title: "线索状态",
          align: "center",
          minWidth: 120,
          key: "clueAllotStatus",
          width: 150,
          // 线索分配状态 0待分配、1已分配、2再分配
          render: (h, params) => {
            let str = '';
            if (params.row.clueAllotStatus == 0) {
              str = '待分配';
            } else if (params.row.clueAllotStatus == 1) {
              str = '已分配'
            } else if (params.row.clueAllotStatus == 2) {
              str = '再分配'
            }
            return h('div', {}, str);
          },
          notMain: true
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          width: 150,
          slot: "action",
          notMain: true,
          selfBtn: [{
            name: "重新分配",
            type: "primary",
            method: "reDistribution",
            permission: 'reDistribution',
            show: function () {
              if (self.isAdminCenter || self.button.reDistribution) {
                return true;
              }
              return false;
            }
          }]
        },
        {
          title: "首联时间",
          align: "center",
          minWidth: 120,
          key: "contactTime",
          width: 150,
        },
        {
          title: "首次沟通方式",
          align: "center",
          minWidth: 120,
          key: "mode",
          width: 150,
        },
        {
          title: "是否添加微信",
          align: "center",
          minWidth: 120,
          key: "addWx",
          width: 150,
          render: (h, params) => {
            let str = '';
            if (params.row.addWx == '是') {
              str = params.row.nickName;
            } else if(params.row.addWx == '否'){
              str = '否';
            } else if(params.row.contactTime){
              str = '否';
            }
            return h('div', {}, str);
          },
        },
        {
          title: "是否面访",
          align: "center",
          minWidth: 120,
          key: "interview",
          width: 150,
        },
        // {
        //   title: "是否已进群",
        //   align: "center",
        //   minWidth: 120,
        //   key: "groupIn",
        //   width: 150,
        //   render: (h, params) => {
        //     let str = '';
        //     if (params.row.groupIn == 1) {
        //       str = '是';
        //     } else if(params.row.groupIn == 0){
        //       str = '否';
        //     } else if(params.row.contactTime){
        //       str = '否';
        //     }
        //     return h('div', {}, str);
        //   },
        // },
        // {
        //   title: "所在群",
        //   align: "center",
        //   minWidth: 120,
        //   key: "groupName",
        //   width: 150,
        // },
        {
          title: "跟进状态",
          align: "center",
          minWidth: 120,
          key: "followStatus",
          width: 150,
        },
        {
          title: "详情说明",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          width: 150,
          slot: "action",
          selfBtn: [{
            name: "详情说明",
            type: "primary",
            method: "reDistributionDetails",
            permission: 'reDistributionDetails',
            show: function () {
              if (self.isAdminCenter || self.button.reDistributionDetails) {
                return true;
              }
              return false;
            }
          }]
        },
        {
          title: "投保产品",
          align: "center",
          minWidth: 120,
          key: "insuredProduct",
          width: 150,
        },
        {
          title: "保额（万元）",
          align: "center",
          minWidth: 120,
          key: "amount",
          width: 150,
        },
        {
          title: "保费",
          align: "center",
          minWidth: 120,
          key: "prem",
          width: 150,
        },
      ],
      modelShow: false,
      title: '',
      reDistributionVisible: false,
      importQuestionsVisible: false,
      importFormData: {
        file: null,
      },
      editId: 0,
      agentId: "",
      scanFlag: false,
      orgList: [],
      productNameList: [],
      channelNameList: [],
      productVersionList: [],
      activityNameList: [],
      isMain: true
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
    }
    this.isMain = this.$store.state.app.userInfo.otherInfo20 === "860000"
    if (!this.isMain) {
      this.columns = this.columns.filter(one => {
        if (one.notMain) {
          return false;
        }
        return true;
      })
    }
    this.search(1);
    this.getCompanyList();
    this.getProductList();
  },
  mounted: function () {
  },
  methods: {
    exportData() {
      let params = JSON.parse(JSON.stringify(this.params));
      if (params.clueAllotTime && params.clueAllotTime[0]) {
        params.clueAllotTimeStart = this.formatDate(params.clueAllotTime[0]) + ' 00:00:00';
        params.clueAllotTimeEnd = this.formatDate(params.clueAllotTime[1]) + ' 23:59:59';
      }

      if (params.liuziTime && params.liuziTime[0]) {
        params.liuZiTimeStart = this.formatDate(params.liuziTime[0]) + ' 00:00:00';
        params.liuZiTimeEnd = this.formatDate(params.liuziTime[1]) + ' 23:59:59';
      }
      delete params.clueAllotTime
      delete params.liuziTime
      this.$api.export(params).then(res => {
        let elink = document.createElement("a");
        elink.download = "线索报表.xlsx";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      })
    },
    examPeopleList(row, index, item) {
      this.$router.push({ path: '/examPeopleList', query: { id: row.id } });
    },
    getProductList() {
      this.$api.getProductList({}).then(res => {
        this.productNameList = res.data.productName.filter(one => {
          if(one === null)return false;
          return true;
        })
        this.channelNameList = res.data.channelName.filter(one => {
          if(one === null)return false;
          return true;
        })
        this.productVersionList = res.data.productVersion.filter(one => {
          if(one === null)return false;
          return true;
        })
        this.activityNameList = res.data.activityName.filter(one => {
          if(one === null)return false;
          return true;
        })
      })
    },
    //重置
    resertMo() {
      this.params.productName = "";
      this.params.productVersion = "";
      this.params.channelName = "";
      this.params.activityName = "";
      this.params.clueOrgCode = "";
      this.params.clueAllotStatus = '';
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
      let params = JSON.parse(JSON.stringify(this.params));
      if (params.clueAllotTime && params.clueAllotTime[0]) {
        params.clueAllotTimeStart = this.formatDate(params.clueAllotTime[0]) + ' 00:00:00';
        params.clueAllotTimeEnd = this.formatDate(params.clueAllotTime[1]) + ' 23:59:59';
      }

      if (params.liuziTime && params.liuziTime[0]) {
        params.liuZiTimeStart = this.formatDate(params.liuziTime[0]) + ' 00:00:00';
        params.liuZiTimeEnd = this.formatDate(params.liuziTime[1]) + ' 23:59:59';
      }
      delete params.clueAllotTime
      delete params.liuziTime
      console.log("=====",params);
      this.$api.getClueList(params).then(res => {
       
        if (res) {
          this.tableList = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableList = [];
          this.total = 0;
        }
      })
    },
    getCompanyList() {
      this.$api.getCompanyList({}).then((res) => {
        if (res.respCode == "0") {
          this.orgList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    reDistribution(item) {
      console.log(item);
      this.reDistributionVisible = true;
      this.title = '重新分配'
      this.editId = item.id;
      this.agentId = item.agentId;
      this.getNewNumber++;
      console.log(this.getNewNumber);
    },
    reDistributionDetails(item) {
      console.log(item);
      this.$router.push({ path: '/reDistributionDetails', query: { clueId: item.id } })
    },
    ok() {
      this.$refs.redisributionRef.handleSubmit((type) => {
        console.log(type);
        if (type) {
          this.reDistributionVisible = false;
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
      this.reDistributionVisible = false;
      this.$refs.redisributionRef.cancel();
    },
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
</style>
