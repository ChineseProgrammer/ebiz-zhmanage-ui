<template>
  <div class="user-list">
    <!-- 搜索 -->
    <div class="left">
      <Form ref="formValidate" :model="searchParams" inline :label-width="100">
        <FormItem prop="commitUser" label="提交人">
          <Input
            placeholder="提交人"
            v-model="searchParams.commitUser"
            class="width200"
          />
        </FormItem>
        <FormItem prop="auditUser" label="审核人">
          <Input
            placeholder="审核人"
            v-model="searchParams.auditUser"
            class="width200"
          />
        </FormItem>
        <FormItem label="审核结果">
          <Select
            clearable
            filterable
            placeholder="审核结果"
            v-model="searchParams.auditResult"
            class="width200"
          >
            <Option
              v-for="item in auditResultList"
              :value="item.code"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>

        <FormItem prop="email" label="提交时间段">
          <DatePicker
            class="width200"
            v-model.trim="commitDateRange"
            type="daterange"
            placement="bottom-start"
            format="yyyy-MM-dd"
            placeholder="请选择提交时间段"
            @on-change="timeChange($event, '1')"
          ></DatePicker>
        </FormItem>
        <FormItem prop="email" label="审核时间段">
          <DatePicker
            class="width200"
            v-model.trim="auditDateRange"
            type="daterange"
            placement="bottom-start"
            format="yyyy-MM-dd"
            placeholder="请选择审核时间段"
            @on-change="timeChange($event, '2')"
          ></DatePicker>
        </FormItem>
        <FormItem label="审核类型">
          <Select
            class="width200"
            clearable
            filterable
            placeholder="审核类型"
            v-model="searchParams.auditType"
          >
            <Option
              v-for="item in auditTypeList"
              :value="item.code"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <div class="float-right">
          <Button
            type="primary"
            @click="searchData()"
            style="margin-left: 10px"
            >{{ $t("query") }}</Button
          >
          <Button type="default" @click="resetData">{{ $t("reset") }}</Button>
        </div>
      </Form>
    </div>
    <!-- 表格 -->
    <div class="m-table">
      <primaryTable
        :columns="columns"
        :data="tableDataList"
        :total="total"
        :pageSize="searchParams.pageSize"
        :current.sync="searchParams.page"
        ref="primaryTable"
        @on-change="changePage"
        class="wholeTable"
        @on-page-size-change="changeSize"
        :page-size-opts="[10, 20, 30, 40, 50]"
      >
      </primaryTable>
    </div>
    <!-- 二维码弹框 -->
    <Modal
      v-model="modal1"
      :title="qrText"
      :mask-closable="false"
      footer-hide
      style="text-align: center"
    >
      <vue-qr
        :logoSrc="imageUrl"
        :text="qrCodePic"
        :size="200"
        :correctLevel="3"
      ></vue-qr>
    </Modal>
    <!-- 审核弹框 -->
    <checkModal ref="checkModal" @sure="modalSure" />
  </div>
</template>

<script>
import checkModal from "./form/checkModal.vue";
import vueQr from "vue-qr";
export default {
  data() {
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      qrCodePic: "", //二维码路径
      imageUrl: null,
      qrText: "", //标体
      modal1: false, //二维码弹框
      searchParams: {
        pageSize: 10,
        page: 1,
        auditResult: "",
        commitUser: "",
        commitStartDate: "",
        commitEndDate: "",
        auditUser: "",
        auditStartDate: "",
        auditEndDate: "",
        auditType: 0, //审核类型 0：内容审核 1：轮播图审核
      },
      total: 0,
      auditTypeList: [
        { code: 0, name: "内容审核" },
        { code: 1, name: "轮播图审核" },
      ],
      columns: [
        {
          type: "index",
          align: "center",
          width: 70,
          title: "序号",
        },
        {
          title: "ID",
          align: "center",
          minWidth: 150,
          key: "foreignNo",
        },
        {
          title: "标题",
          align: "center",
          minWidth: 150,
          key: "title",
        },
        {
          title: "审核类型",
          align: "center",
          minWidth: 150,
          key: "auditType",
          render: (h, params) => {
            let text =
              params.row.auditType == 0
                ? "内容审核"
                : params.row.auditType == 1
                ? "轮播图审核"
                : "";
            return h("span", text);
          },
        },
        {
          title: "审核结果",
          align: "center",
          minWidth: 150,
          key: "auditResult",
          render: (h, params) => {
            let text =
              params.row.auditResult == 0
                ? "通过"
                : params.row.auditResult == 1
                ? "不通过"
                : "";
            return h("span", text);
          },
        },
        {
          title: "原因描述",
          align: "center",
          minWidth: 200,
          ellipsis: true,
          key: "reason",
        },
        {
          title: "提交人",
          align: "center",
          minWidth: 150,
          key: "commitUser",
        },
        {
          title: "审核提交时间",
          align: "center",
          minWidth: 170,
          key: "commitDate",
        },
        {
          title: "审核人",
          align: "center",
          minWidth: 150,
          key: "auditUser",
        },
        {
          title: "审核时间",
          align: "center",
          minWidth: 170,
          key: "auditDate",
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.checkButton) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.checkRecordDetail(params.row);
                      },
                    },
                  },
                  "查看"
                )
              );
            }
            if (
              (this.isAdminCenter || this.button.previewBtn) &&
              params.row.auditType == 0
            ) {
              arr.push(
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "text",
                //       size: "small",
                //     },
                //     style: {},
                //     on: {
                //       click: () => {
                //         this.privewCode(params.row);
                //       },
                //     },
                //   },
                //   "预览"
                // )
                h(
                  "Tag",
                  {
                    props: {
                      color: "blue",
                    },
                    style: {},
                    nativeOn: {
                      click: () => {
                        this.privewCode(params.row);
                      },
                    },
                  },
                  "预览"
                )
              );
            }
            if (
              (this.isAdminCenter || this.button.auditBtn) &&
              params.row.auditResult != 0 &&
              params.row.auditResult != 1
            ) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.auditRecord(params.row);
                      },
                    },
                  },
                  "审核"
                )
              );
            }
            return h("div", arr);
          },
        },
      ], // 表格列名
      tableDataList: [], // 表格数据
      commitDateRange: [], // 审核提交时间段
      auditDateRange: [], // 审核结束时间段
      auditResultList: [
        {
          code: 0,
          name: "通过",
        },
        {
          code: 1,
          name: "不通过",
        },
      ],
    };
  },
  components: { checkModal, vueQr },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.getDataList();
  },
  mounted: function () {},
  watch: {},
  methods: {
    // 时间段选择
    timeChange(data, type) {
      if (type == "1") {
        if (data && data.length > 0) {
          this.searchParams.commitStartDate = data[0];
          this.searchParams.commitEndDate = data[1];
        }
      } else if (type == "2") {
        if (data && data.length > 0) {
          this.searchParams.auditStartDate = data[0];
          this.searchParams.auditEndDate = data[1];
        }
      }
    },
    //重置
    resetData() {
      this.searchParams = {
        pageSize: 10,
        page: 1,
        auditResult: "",
        commitUser: "",
        commitStartDate: "",
        commitEndDate: "",
        auditUser: "",
        auditStartDate: "",
        auditEndDate: "",
        auditType: 0, //审核类型 0：内容审核 1：轮播图审核
      };
      this.commitDateRange = [];
      this.auditDateRange = [];
      this.getDataList();
    },
    //搜索
    searchData() {
      this.getDataList();
    },
    changeSize(size) {
      this.searchParams.pageSize = size;
      this.getDataList();
    },
    changePage(page) {
      this.searchParams.page = page;
      this.getDataList();
    },
    getDataList() {
      let data = {
        ...this.searchParams,
      };
      this.$api.contentAuditList(data).then((res) => {
        if (res.result == "0") {
          this.tableDataList = res.content.list;
          this.total = res.content.total;
        }
      });
    },
    //查看
    checkRecordDetail(row) {
      let linkPage =
        row.auditType == 0
          ? "editContentManage"
          : row.auditType == 1
          ? "slidesshowEditImg"
          : null;
      this.$router.push({
        name: linkPage,
        query: {
          id: row.foreignKey,
          type: "view",
          param: row,
        },
      });
    },
    // 审核
    auditRecord(row) {
      this.$refs.checkModal.openModal(row);
    },
    // 弹框点击确定
    modalSure() {
      this.getDataList();
    },
    // 生成二维码
    privewCode(data) {
      this.modal1 = true;
      this.qrText = data.title;
      let typeInfo = "NR" + data.foreignKey;
      if (typeInfo) {
        setTimeout(() => {
          this.qrCodePic = process.env.VUE_APP_QR_CODE_URL+`#/PreviewHome?primaryKey=${typeInfo}`
        }, 50);
      }
      console.log(this.qrCodePic, '二维码链接');
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
.left {
  zoom: 1;
}
.left:after {
  content: "020";
  display: block;
  clear: both;
  visibility: hidden;
}
.width200 {
  width: 200px;
}
</style>
