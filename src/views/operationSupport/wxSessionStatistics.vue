<template>
  <div id="set-list" class="only-content header">
    <Form
      ref="formValidateGroup"
      :model="queryDataDto"
      inline
      :label-width="110"
      style="width: 100%"
    >
      <Row class="box--flex">
          <FormItem label="会话统计时间">
            <DatePicker
            transfer
              type="daterange"
              v-model="dateList"
              @on-change="onDatePickerChange"
              placement="bottom-end"
              placeholder="请选择会话统计时间"
            ></DatePicker>
          </FormItem>
        <Col span="4" style="float: right">
          <Button
            @click="search(1)"
            class="ivu-btn ivu-btn-primary"
            style="margin-right: 5px"
            >查询</Button
          >
          <Button @click="reset()">重置</Button>
        </Col>
      </Row>
    </Form>
    <Button v-if="isAdminCenter || button.WxSessionStatisticsExport" type="primary" @click="exportAll">批量导出</Button>
    <primaryTable
      :columns="deptColumns"
      :data="deptTableList"
      ref="primaryTable"
      :total="deptTotal"
       :current.sync="queryDataDto.page"
      :pageSize="queryDataDto.pageSize"
      @on-change="changePageDept"
      @on-selection-change="selectionChange"
      @on-page-size-change="
        (size) => {
          pageSize = size;
          search(1);
        }
      "
      :loading="deptTableload"
      style="margin-top: 10px"
    ></primaryTable>
  </div>
</template>

<script>
import { dateTransfer} from "@/api/sm4";
export default {
  name: "queryData",
  data() {
    return {
      queryDataDto:{},
      dateList: [],
      selectNum: [],
      tabIndex: "1",
      button: this.$store.state.app.button,
      paramsDept: {},
      paramsGroup: {
        page:1,
        pageSize:10,
        location: "",
        agentName: "",
        productCode: "",
        budget: "",
        phoneNumber: "",
        nameOrCode: "",
        organizationName: "",
        questionCode: "",
        customerSource: "",
        dateType: "",
        date: [],
        registerTimeStart: null,
        registerTimeEnd: null,
      },
      deptColumns: [
        {
          title: "本月发送消息数",
          key: "sendCount",
          align: "center"
        },
        {
          title: "消息类型",
          key: "msgType",
          align: "center"
        },
         {
          title: "发送者",
          key: "from",
          align: "center"
        },
        {
          title: "发送者名称",
          key: "fromName",
          align: "center"
        },
        {
          title: "接收者名称",
          key: "toUserName",
          align: "center"
        },
       
        {
          title: "发送日期",
          key: "msgTime",
          align: "center"
        }
      ],
      modalTitle: "",
      deptTableList: [],
      deptTotal: 0,
      deptPageSize: 10,
      deptPage: 1,
      deptTableload: false,
      modalTitle: "",
      pageSize: 10,
      isAdminCenter: false,
    };
  },
  created() {
    this.search()
  },
  mounted() {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.roleId = JSON.parse(window.sessionStorage.getItem("userRoleInSyses"));
    this.roleId = this.roleId[0].roleId;
  },
  watch: {
  },
  methods: {
    search(page) {
      if (!page) {
        page = 1;
      }
      let _self = this;
      this.queryDataDto.page = page;
      this.queryDataDto.pageSize =Number( _self.pageSize);
      this.$api
        .wxSessionStatistics(_self.queryDataDto)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            if (res.data) {
              this.deptTableList = res.data.list;
              this.deptTotal = res.data.total;
            } else {
              this.deptTableList = [];
              this.deptTotal = 0;
            }
          } else {
            this.$Message.error(res.content ? res.content : res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    exportAll() {
      this.$api
        .wxSessionStatisticsExport(this.queryDataDto)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "会话统计导出.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    onDatePickerChange(val) {
      if (val[0]) {
        this.queryDataDto.startTime = val[0]+" 00:00:00";
        this.queryDataDto.endTime = val[1]+" 23:59:59";
      } else {
        this.queryDataDto.startTime = null;
        this.queryDataDto.endTime = null;
      }
    },
    selectionChange(row) {
      this.selectNum = row;
    },
    reset() {
      this.dateList=[]
      this.queryDataDto.startTime = null;
      this.queryDataDto.endTime = null;
      this.search(1);
    },
    changePageDept(page) {
      this.search(page);
    },
    changePageGroup() {},
  },
};
</script>

<style lang="less" scoped>
.box {
  width: 90%;
  height: 30px;
  line-height: 30px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 6px;
  text-align: center;
}
.bg-blue {
  background-color: #3399ff;
}
.bg-gray {
  background-color: #f2f2f2;
}
.ivu-input,
.ivu-select,
.ivu-date-picker {
  width: 162px;
}
</style>
