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
          <FormItem prop="operateName" label="操作名称">
            <Input
              placeholder="请输入操作名称"
              style="width: 185px"
              v-model="formValidate.operateName"
            />
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem prop="operateUserName" label="操作用户名">
            <Input
              placeholder="请输入操作用户名"
              style="width: 185px"
              v-model="formValidate.operateUserName"
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
    <Modal v-model="detailModal" title="日志详情" width="800">
      <div style="padding: 20px">
        <div class="mb-10">
          <Row>
            <Col span="8">
              <span>日志编号：</span>
              <span>{{ logDetail.code }}</span>
            </Col>
            <Col span="8">
              <span>批处理时间：</span>
              <span>{{
                $util.getFormatDate(new Date(logDetail.batchDate).getTime())
              }}</span>
            </Col>
            <Col span="8">
              <span>批处理结果：</span>
              <span>{{ resultArray[logDetail.batchResult] }}</span>
            </Col>
          </Row>
        </div>
        <primaryTable
          :columns="columnsDetailNew"
          :data="tableListDetail"
          ref="primaryTableDetail"
          :total="totalDetail"
          :pageSize="formValidateDetail.pageSize"
          @on-change="changePageDetail"
          @on-page-size-change="
            (pageSize) => {
              formValidateDetail.pageSize = pageSize;
              getDetail(logId);
            }
          "
          :loading="tableloadingDetail"
          :current.sync="formValidateDetail.page"
        ></primaryTable>
      </div>
    </Modal>
  </div>
</template>
<script>
import { post, get, put, del, download } from "../../api/api.js";
import baseUrl from "../../api/setBaseUrl";
import { dateTransfer} from "@/api/sm4";
export default {
  name: "batchLog",
  data() {
    return {
      columnsDetailNew: [],
      columnsDetail: [
        {
          type: "index",
          title: "序号",
          align: "center",
        },
        {
          title: "处理对象",
          align: "center",
          key: "targetType",
          render: (h, p) => {
            if (p.row.targetType) {
              return h("div", this.targetTypeArray[p.row.targetType]);
            } else {
              return "";
            }
          },
        },
        {
          title: "处理对象代码",
          align: "center",
          key: "targetCode",
        },
        {
          title: "处理类型",
          align: "center",
          key: "batchType",
          render: (h, p) => {
            if (p.row.batchType) {
              return h("div", this.batchTypeArray[p.row.batchType]);
            } else {
              return "";
            }
          },
        },
        {
          title: "失败原因",
          align: "center",
          key: "reason",
        },
      ],
      resultArray: ["失败", "成功"],
      targetTypeArray: ["", "业务员", "机构", "资格证"],
      batchTypeArray: [
        "",
        "离职申请",
        "关系调整",
        "人员调动",
        "团队合并",
        "执业证状态更新",
      ],
      tableloading: false,
      formValidate: {
        page: 1,
        pageSize: 10,
        operateName: "",
        operateUserName: "",
      },
      ruleFormValidate: {},
      tableList: [],
      total: 0,

      detailModal: false,
      logId: "",
      logDetail: {},
      tableloadingDetail: false,
      formValidateDetail: {
        page: 1,
        pageSize: 10,
      },
      tableListDetail: [],
      totalDetail: 0,
    };
  },
  computed: {
    columns: (vm) => {
      return [
        {
          type: "index",
          title: "序号",
          align: "center",
          width:'80'
        },
        {
          title: "操作名称",
          align: "center",
          key: "operateName",
        },
        {
          title: "操作微服务",
          align: "center",
          key: "operateService",
        },
        {
          title: "操作url",
          align: "center",
          key: "operateUrl",
        },
         {
          title: "请求参数",
          align: "center",
          tooltip:true,
          key: "requestParam",
           render: (h, params) => {
          return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                domProps: {
                  title: params.row.requestParam,
                },
              },
              params.row.requestParam
            );
          },
        },
        {
          title: "响应内容",
          align: "center",
          key: "respContent",
            tooltip:true,
          render: (h, params) => {
              console.log(params)
           return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
                domProps: {
                  title: params.row.respContent,
                },
              },
              params.row.respContent
            );
          },
        },
        {
          title: "是否成功",
          align: "center",
          key: "isSuccess",
          width:'80',
            render: (h, p) => {
            if (p.row.isSuccess==1) {
              return h("div", '成功');
            } else {
              return  h("div", '失败');
            }
          },
        },
        {
          title: "操作用户编号",
          align: "center",
          key: "operateUserName",
        },
        {
          title: "操作用户名",
          align: "center",
          key: "operateRealName",
        },
          {
          title: "操作时间",
          align: "center",
          key: "operateDate",
        }
      ];
    },
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
        .getOperateList(this.formValidate)
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
      this.formValidate = {};
      this.formValidate.page = 1;
      this.formValidate.pageSize = 10;
      this.search();
    },
    changePage(page) {
      this.search(page);
    },
    // 手动批处理
    batchHandle(row) {
      let url = (params) => get(baseUrl.api + row.batchRelUrl, params);
      this.$util.confirmDialog(this, "批处理确认", "确认重新批处理", () => {
        url({
          batchDate: row.batchDate,
        })
          .then((res) => {
            if (res && res.code == 200) {
              this.$Message.success("批处理成功");
              this.search();
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    // 详情
    getDetail() {
      this.$api
        .getBatchDetailById({
          id: this.logId,
          page: this.formValidateDetail.page,
          pageSize: this.formValidateDetail.pageSize,
        })
        .then((res) => {
          if (res && res.success) {
            this.tableListDetail = res.data.list;
            this.totalDetail = res.data.total;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changePageDetail(page) {
      this.formValidateDetail.page = page;
      this.getDetail(this.logId);
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