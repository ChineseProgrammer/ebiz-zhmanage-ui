<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="渠道类型" prop='productName' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.productName">
              <Option v-for="(item, index) in productNameList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="一级渠道" prop='productVersion' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.productVersion">
              <Option v-for="(item, index) in productVersionList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="二级渠道" prop='channelName' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.channelName">
              <Option v-for="(item, index) in channelNameList" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="三级渠道" prop='activityName' class="item-margin-left" v-if="isMain">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.activityName">
              <Option v-for="(item, index) in activityNameList" :value="item" :key="index">{{ item }}
              </Option>
            </Select>
          </FormItem>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" style="margin-left:10px" @click="toChannelMenu">渠道目录</Button>
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
    </Modal>
  </div>
</template>

<script>
// 任务状态
import statusMixin from '../../lib/statusMixin';
export default {
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
        clueAllotTime: '',
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
          title: "渠道类型",
          align: "center",
          minWidth: 100,
          key: "channelType",
        },
        {
          title: "一级渠道",
          align: "center",
          minWidth: 150,
          key: "firstLevel",
        },
        {
          title: "二级渠道",
          align: "center",
          minWidth: 150,
          key: "secondLevel",
        },
        {
          title: "三级渠道",
          align: "center",
          minWidth: 150,
          key: "thirdLevel",
        },
      ],
      title: '',
      reDistributionVisible: false,
      editId: 0,
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
    toChannelMenu() {
      this.$router.push({ path: '/channelMenu' });
    },
    getProductList() {
      this.$api.getProductList({}).then(res => {
        console.log(res);
        this.productNameList = res.data.productName;
        this.channelNameList = res.data.channelName;
        this.productVersionList = res.data.productVersion;
        this.activityNameList = res.data.activityName;
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
        params.start = this.formatDate(params.clueAllotTime[0]) + ' 00:00:00';
        params.end = this.formatDate(params.clueAllotTime[1]) + ' 23:59:59';
      }

      if (params.liuziTime && params.liuziTime[0]) {
        params.start2 = this.formatDate(params.liuziTime[0]) + ' 00:00:00';
        params.end2 = this.formatDate(params.liuziTime[1]) + ' 23:59:59';
      }

      delete params.clueAllotTime;
      delete params.liuziTime;

      this.$api.getClueList(params).then(res => {
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
      this.getNewNumber++;
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
