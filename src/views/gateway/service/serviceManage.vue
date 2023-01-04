<template>
  <div class="only-content">
    <!-- button -->
    <div class="m-table">
      <div class="m-btn">
        <!--<Button @click="batchDelete">批量删除</Button>-->
        <Button @click="showAddServiceForm()" type="success">新增服务</Button>

        <Button @click="publishService()" type="primary" :disabled="select.ids.length <= 0">发布服务</Button>

        <Button @click="unPublishService()" type="warning" :disabled="select.ids.length <= 0">撤销服务</Button>
      </div>
      <!-- table表格 -->
      <primaryTable
        border
        width="100%"
        :columns="serviceTable.columns"
        :data="serviceTable.data"
        ref="selectionTable"
        tableRef="selectionTable"
        @deleteService="deleteService"
        @showEditServiceForm="showEditServiceForm"
        @toServiceApiManage="toServiceApiManage"
        @on-selection-change="handleSelectRow"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { debug } from "util";
import addServiceForm from "./form/addServiceForm";
import editServiceForm from "./form/editServiceForm";

export default {
  data() {
    return {
      // 删除的id列表
      select: {
        ids: []
      },
      // 表单变量
      serviceTable: {
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
            title: "服务名",
            key: "serviceName",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "服务编码",
            key: "serviceCode",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "ServiceId(服务注册id)",
            key: "serviceId",
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
            title: "操作",
            slot: "action",
            align: "center",
            width: 400,
            btn: {},
            selfBtn: [
              {
                name: "服务接口管理",
                type: "primary",
                method: "toServiceApiManage"
              },
              { name: "编辑", type: "warning", method: "showEditServiceForm" },
              { name: "删除", type: "error", method: "deleteService" }
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
    //列表展示
    this.getServiceList();
  },
  computed: mapGetters({}),
  watch: {},
  methods: {
    getServiceList() {
      let that = this;
      that.select.ids = [];
      that.$api
        .service_list({})
        .then(function(data) {
          if (data.respCode == 0) {
            that.serviceTable.data = data.data;
          }
        })
        .catch(error => {});
    },
    showAddServiceForm() {
      var params = {
        self: this,
        title: "新增服务",
        width: "50%",
        props: {},
        form: addServiceForm,
        success: res => {
          this.getServiceList();
        },
        cancel: () => {
          this.getServiceList();
        }
      };
      this.$util.openModelForm(params);
    },
    showEditServiceForm(service) {
      var params = {
        self: this,
        title: "修改服务",
        width: "50%",
        props: { service: service },
        form: editServiceForm,
        success: res => {
          this.getServiceList();
        },
        cancel: () => {
          this.getServiceList();
        }
      };
      this.$util.openModelForm(params);
    },
    deleteService(service) {
      let that = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: "您确认删除<b>" + service.serviceName + "</b>吗?",
        onOk: function() {
          that.$api
            .service_delete({ ids: [service.id] })
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("删除成功");
                that.getServiceList();
              } else {
                that.$Message.success("删除失败");
                that.getServiceList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用删除服务接口失败");
            });
        }
      });
    },
    toServiceApiManage(service) {
      this.$router.push({
        name: "serviceApiManage",
        query: { serviceId: service.id }
      });
    },
    publishService() {
      let that = this;
      this.$Modal.confirm({
        title: "发布服务提醒",
        content: "您确认发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          that.$api
            .gateway_publish_service(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("发布成功");
                that.getServiceList();
              } else {
                that.$Message.error("发布失败");
                that.getServiceList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用发布服务接口失败");
            });
        }
      });
    },
    unPublishService() {
      let that = this;
      this.$Modal.confirm({
        title: "撤销发布提醒",
        content:
          "您确认撤销发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          console.log(that.$api);
          that.$api
            .gateway_unPublish_service(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("撤销发布成功");
                that.getServiceList();
              } else {
                that.$Message.error("撤销发布失败");
                that.getServiceList();
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

