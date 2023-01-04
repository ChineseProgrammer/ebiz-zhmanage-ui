<template>
  <div id="batchProgressLog" class="only-content">
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleFormValidate"
      inline
      :label-width="110"
      class="mb-10"
      style="width: 100%"
    >
      <Row>
        <Col span="8">
          <FormItem style="width: 100%" label="时间阶段">
            <DatePicker
                    transfer
                    style="width: 200px"
                    type="daterange"
                    v-model="dateList"
                    @on-change="onDatePickerChange"
                    placement="bottom-end"
                    placeholder="请选择时间阶段"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="fileName" label="文件名称">
            <Input
              placeholder="请输入文件名称"
              style="width: 185px"
              v-model="formValidate.fileName"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="exportRealName" label="操作用户名">
            <Input
              placeholder="请输入操作用户名"
              style="width: 185px"
              v-model="formValidate.exportRealName"
            />
          </FormItem>
        </Col>
      </Row>
      <Row style="margin-bottom: 10px;">
        <Col span="3" style="float: right">
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
    <primaryTable
      :columns="columns"
      :data="tableList"
      ref="primaryTable"
      :total="total"
      :pageSize="formValidate.pageSize"
      @on-change="changePage"
      @on-page-size-change="
        (pageSize) => {
          formValidate.pageSize = pageSize;
          search();
        }
      "
      :loading="tableloading"
      :current.sync="formValidate.page"
    ></primaryTable>
  </div>
</template>
<script>
import { post, get, put, del, download } from "../../api/api.js";
import baseUrl from "../../api/setBaseUrl";
import { dateTransfer} from "@/api/sm4";
export default {
  name: "downloadLosList",
  data() {
    return {
      tableloading: false,
      formValidate: {
        page: 1,
        pageSize: 10,
      },
      ruleFormValidate: {},
      tableList: [],
      total: 0,
      dateList: [],
      detailModal: false,
      logId: "",
      logDetail: {},
      tableloadingDetail: false,
      formValidateDetail: {
        page: 1,
        pageSize: 10,
      },
      columns:[
        {
          type: "index",
                  title: "序号",
                align: "center",
                width:'80'
        },
        {
          title: "导出文件名称",
                  align: "center",
                key: "fileName",
        },
        {
          title: "导出时间",
                  align: "center",
                key: "exportTime",
        },
        {
          title: "所属模块",
                  align: "center",
                key: "module",
        },
        {
          title: "操作人",
                  align: "center",
                key: "exportRealName",
        },
        {
          title: "下载",
                  align: "center",
                key: "",
                btn:{edit:true,del:true},
          render: (h, params) => {
            var text = params.row
            console.log(params.row);
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                domProps: { // 添加标签,使用自己引入的iconfont图标
                  innerHTML: "下载"
                },
                on: {
                  click: () => {
                    this.downloadFile(params.row);
                  }
                }
              }),
            ])
          }
        }
      ],
      totalDetail: 0,
    };
  },
  created() {
    this.search();
  },
  mounted() {},
  methods: {
    //获取列表
    search(page) {
      this.formValidate.page = page ? page : 1;
      this.tableloading = true;
      //调用接口
      this.$api
        .downloadLogList(this.formValidate)
        .then((res) => {
          if (res && res.success) {
            if (res.data) {
              this.tableList = res.data.records;
              this.total = res.data.total;
              this.tableList.map((t)=>{
              t.operateDate=dateTransfer(t.operateDate)
          })  
            } else {
              this.tableList = [];
              this.total = 0;
            }
          } else {
            this.$Message.error(res.message);
          }
          this.tableloading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reset() {
      this.dateList=""
      this.formValidate = {};
      this.formValidate.page = 1;
      this.formValidate.pageSize = 10;
      this.search();
    },
    downloadFile(row){
      //todo 下载
      this.$api.downloadLogFile({"id":row.id}).then((res) => {
                this.$util.hideLoading();
                let elink = document.createElement("a");
                elink.download = row.fileName+".xlsx";
                elink.style.display = "none";
                let blob = new Blob([res]);
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
      }).catch();
    },
    onDatePickerChange(val) {
      if (val[0]) {
        this.formValidate.startTime = val[0];
        this.formValidate.endTime = val[1];
      } else {
        this.formValidate.startTime = null;
        this.formValidate.endTime = null;
      }
    },
    changePage(page) {
      this.search(page);
    },
  },
  watch: {},
};
</script>
<style scope>
#batchProgressLog .ivu-spin-fix {
  background-color: rgba(255, 255, 255, 0.9) !important;
}
</style>