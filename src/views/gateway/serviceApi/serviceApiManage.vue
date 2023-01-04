<template>
  <div class="only-content">
    <!-- button -->
    <div class="m-table">
      <div class="m-btn">
        <!--<Button @click="batchDelete">批量删除</Button>-->
        <Button @click="showAddServiceApiForm()" type="success">新增服务接口</Button>

        <Button
          @click="publishServiceApi()"
          type="primary"
          :disabled="select.ids.length <= 0"
        >发布服务接口</Button>

        <Button
          @click="unPublishServiceApi()"
          type="warning"
          :disabled="select.ids.length <= 0"
        >撤销服务接口</Button>
      </div>
      <!-- table表格 -->
      <primaryTable
        border
        width="100%"
        :columns="serviceApiTable.columns"
        :data="serviceApiTable.data"
        ref="selectionTable"
        tableRef="selectionTable"
        @deleteServiceApi="deleteServiceApi"
        @showEditServiceApiForm="showEditServiceApiForm"
        @showServiceApiInfoForm="showServiceApiInfoForm"
        @on-selection-change="handleSelectRow"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { debug } from "util";
import addServiceApiForm from "./form/addServiceApiForm";
import editServiceApiForm from "./form/editServiceApiForm";
import serviceApiInfoForm from "./form/serviceApiInfoForm";

export default {
  data() {
    return {
      serviceId: 0,
      // 删除的id列表
      select: {
        ids: []
      },
      // 表单变量
      serviceApiTable: {
        // 表单列
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "id",
            key: "id",
            align: "center",
            slot: "alarm",
            width: 80
          },
          {
            title: "接口名",
            key: "apiName",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "接口编码",
            key: "apiCode",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "url",
            key: "url",
            align: "center",
            slot: "alarm",
            width: 200
          },
          {
            title: "发布状态",
            key: "publishStatus",
            align: "center",
            slot: "alarm",
            width: 90,
            tooltip: true,
            render: (h, params) => {
              let publishStatusWord = "";
              let color = "#2d8cf0";
              if (params.row.publishStatus == 1) {
                publishStatusWord = "已发布";
              } else {
                publishStatusWord = "未发布";
                color = "#ed4014";
              }
              return h(
                "div",
                {
                  style: {
                    color: color
                  }
                },
                [
                  h(
                    "Tooltip",
                    {
                      props: {
                        placement: "bottom",
                        transfer: true
                      }
                    },
                    [
                      publishStatusWord,
                      h(
                        "span",
                        {
                          slot: "content",
                          style: {
                            whiteSpace: "normal"
                          }
                        },
                        publishStatusWord
                      )
                    ]
                  )
                ]
              );
            }
          },
          {
            title: "发布时间",
            key: "publishDate",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "限流状态",
            key: "flowRuleStatus",
            align: "center",
            slot: "alarm",
            width: 90,
            tooltip: true,
            render: (h, params) => {
              let enableStatusWord = "";
              if (params.row.flowRuleStatus == 1) {
                enableStatusWord = "开启";
              } else {
                enableStatusWord = "未开启";
              }
              return h("div", [
                h(
                  "Tooltip",
                  {
                    props: {
                      placement: "bottom",
                      transfer: true
                    }
                  },
                  [
                    enableStatusWord,
                    h(
                      "span",
                      {
                        slot: "content",
                        style: {
                          whiteSpace: "normal"
                        }
                      },
                      enableStatusWord
                    )
                  ]
                )
              ]);
            }
          },
          {
            title: "降级状态",
            key: "degradeRuleStatus",
            align: "center",
            slot: "alarm",
            width: 90,
            tooltip: true,
            render: (h, params) => {
              let enableStatusWord = "";
              if (params.row.degradeRuleStatus == 1) {
                enableStatusWord = "开启";
              } else {
                enableStatusWord = "未开启";
              }
              return h("div", [
                h(
                  "Tooltip",
                  {
                    props: {
                      placement: "bottom",
                      transfer: true
                    }
                  },
                  [
                    enableStatusWord,
                    h(
                      "span",
                      {
                        slot: "content",
                        style: {
                          whiteSpace: "normal"
                        }
                      },
                      enableStatusWord
                    )
                  ]
                )
              ]);
            }
          },
          {
            title: "操作",
            slot: "action",
            align: "center",
            width: 400,
            btn: {},
            selfBtn: [
              {
                name: "详情",
                type: "primary",
                method: "showServiceApiInfoForm"
              },
              {
                name: "编辑",
                type: "warning",
                method: "showEditServiceApiForm"
              },
              { name: "删除", type: "error", method: "deleteServiceApi" }
            ]
          }
        ],
        // 表单内数据
        data: []
      }
    };
  },
  created: function() {},
  mounted: function() {
    let that = this;
    that.serviceId = that.$route.query.serviceId;
    //列表展示
    this.getServiceApiList();
  },
  computed: mapGetters({}),
  watch: {},
  methods: {
    getServiceApiList() {
      let that = this;
      that.select.ids = [];
      that.$api
        .service_api_list({ serviceId: that.serviceId })
        .then(function(data) {
          if (data.respCode == 0) {
            that.serviceApiTable.data = data.data;
          }
        })
        .catch(error => {});
    },
    showAddServiceApiForm(service) {
      let that = this;
      var params = {
        self: this,
        title: "新增服务接口",
        width: "50%",
        props: { parentServiceId: that.serviceId },
        form: addServiceApiForm,
        success: res => {
          this.getServiceApiList();
        },
        cancel: () => {
          this.getServiceApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    showEditServiceApiForm(serviceApi) {
      var params = {
        self: this,
        title: "修改服务接口",
        width: "50%",
        props: { serviceApi: serviceApi },
        form: editServiceApiForm,
        success: res => {
          this.getServiceApiList();
        },
        cancel: () => {
          this.getServiceApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    deleteServiceApi(serviceApi) {
      let that = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: "您确认删除<b>" + serviceApi.apiName + "</b>吗?",
        onOk: function() {
          that.$api
            .service_api_delete({ ids: [serviceApi.id] })
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("删除成功");
                that.getServiceApiList();
              } else {
                that.$Message.error("删除失败");
                that.getServiceApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用删除服务接口失败");
            });
        }
      });
    },
    showServiceApiInfoForm(serviceApi) {
      var params = {
        self: this,
        title: "服务接口详情",
        width: "50%",
        props: { serviceApi: serviceApi },
        form: serviceApiInfoForm,
        success: res => {
          this.getServiceApiList();
        },
        cancel: () => {
          this.getServiceApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    publishServiceApi() {
      let that = this;
      this.$Modal.confirm({
        title: "发布服务提醒",
        content: "您确认发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          that.$api
            .gateway_publish_serviceapi(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("发布服务接口");
                that.getServiceApiList();
              } else {
                that.$Message.error("发布服务接口");
                that.getServiceApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用发布服务接口失败");
            });
        }
      });
    },
    unPublishServiceApi() {
      let that = this;
      this.$Modal.confirm({
        title: "撤销发布服务接口提醒",
        content:
          "您确认撤销发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          console.log(that.$api);
          that.$api
            .gateway_unPublish_serviceapi(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("撤销发布服务接口成功");
                that.getServiceApiList();
              } else {
                that.$Message.error("撤销发布服务接口失败");
                that.getServiceApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用撤销发布服务接口失败");
            });
        }
      });
    },
    handleSelectRow(selection) {
      let that = this;
      that.select.ids = [];
      selection.forEach(function(item) {
        that.select.ids.push(item.id);
      });
    }
  },
  filters: {},
  components: {
    //注册组件
  }
};
</script>

<style lang='less'>
</style>

