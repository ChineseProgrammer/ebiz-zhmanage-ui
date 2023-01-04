<template>
  <div class="only-content">
    <!-- button -->
    <div class="m-table">
      <div class="m-btn">
        <!--<Button @click="batchDelete">批量删除</Button>-->
        <Button @click="showAddChannelApiForm()" type="success">新增渠道接口</Button>

        <Button
          @click="publishChannelApi()"
          type="primary"
          :disabled="select.ids.length <= 0"
        >发布渠道接口</Button>

        <Button
          @click="unPublishChannelApi()"
          type="warning"
          :disabled="select.ids.length <= 0"
        >撤销渠道接口</Button>
      </div>
      <!-- table表格 -->
      <primaryTable
        border
        width="100%"
        :columns="channelApiTable.columns"
        :data="channelApiTable.data"
        ref="selectionTable"
        tableRef="selectionTable"
        @deleteChannelApi="deleteChannelApi"
        @showEditChannelApiForm="showEditChannelApiForm"
        @showChannelApiInfoForm="showChannelApiInfoForm"
        @on-selection-change="handleSelectRow"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { debug } from "util";
import addChannelApiForm from "./form/addChannelApiForm";
import editChannelApiForm from "./form/editChannelApiForm";
import channelApiInfoForm from "./form/channelApiInfoForm";

export default {
  data() {
    return {
      channelId: 0,
      // 删除的id列表
      select: {
        ids: []
      },
      // 表单变量
      channelApiTable: {
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
            width: 80,
            fixed: "left"
          },
          {
            title: "服务名",
            key: "serviceName",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "接口名",
            key: "apiName",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "是否需要验证",
            key: "needAuth",
            align: "center",
            slot: "alarm",
            width: 120,
            tooltip: true,
            render: (h, params) => {
              let needAuthWord = "";
              if (params.row.needAuth == 1) {
                needAuthWord = "需要";
              } else {
                needAuthWord = "不需要";
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
                    needAuthWord,
                    h(
                      "span",
                      {
                        slot: "content",
                        style: {
                          whiteSpace: "normal"
                        }
                      },
                      needAuthWord
                    )
                  ]
                )
              ]);
            }
          },
          {
            title: "加/解密方式",
            key: "decipherType",
            align: "center",
            slot: "alarm",
            width: 120
          },
          {
            title: "编码",
            key: "charset",
            align: "center",
            slot: "alarm",
            width: 80
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
                name: "详情",
                type: "primary",
                method: "showChannelApiInfoForm"
              },
              {
                name: "编辑",
                type: "warning",
                method: "showEditChannelApiForm"
              },
              { name: "删除", type: "error", method: "deleteChannelApi" }
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
    that.channelId = that.$route.query.channelId;
    //列表展示
    this.getChannelApiList();
  },
  computed: mapGetters({}),
  watch: {},
  methods: {
    getChannelApiList() {
      let that = this;
      that.$api
        .channel_api_list({ channelId: that.channelId })
        .then(function(data) {
          if (data.respCode == 0) {
            that.channelApiTable.data = data.data;
          }
        })
        .catch(error => {});
    },
    showAddChannelApiForm(channel) {
      let that = this;
      var params = {
        self: this,
        title: "新增渠道接口",
        width: "50%",
        props: { parentChannelId: that.channelId },
        form: addChannelApiForm,
        success: res => {
          this.getChannelApiList();
        },
        cancel: () => {
          this.getChannelApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    showEditChannelApiForm(channelApi) {
      var params = {
        self: this,
        title: "修改服务接口",
        width: "50%",
        props: { channelApi: channelApi },
        form: editChannelApiForm,
        success: res => {
          this.getChannelApiList();
        },
        cancel: () => {
          this.getChannelApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    deleteChannelApi(channelApi) {
      let that = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: "您确认删除<b>" + channelApi.apiName + "</b>吗?",
        onOk: function() {
          that.$api
            .channel_api_delete({ ids: [channelApi.id] })
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("删除成功");
                that.getChannelApiList();
              } else {
                that.$Message.success("删除失败");
                that.getChannelApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用删除服务接口失败");
            });
        }
      });
    },
    showChannelApiInfoForm(channelApi) {
      var params = {
        self: this,
        title: "渠道接口详情",
        width: "50%",
        props: { channelApi: channelApi },
        form: channelApiInfoForm,
        success: res => {
          this.getChannelApiList();
        },
        cancel: () => {
          this.getChannelApiList();
        }
      };
      this.$util.openModelForm(params);
    },
    publishChannelApi() {
      let that = this;
      this.$Modal.confirm({
        title: "发布渠道接口提醒",
        content: "您确认发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          that.$api
            .gateway_publish_channelapi(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("发布成功");
                that.getChannelApiList();
              } else {
                that.$Message.error("发布失败");
                that.getChannelApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用发布渠道接口失败");
            });
        }
      });
    },
    unPublishChannelApi() {
      let that = this;
      this.$Modal.confirm({
        title: "撤销发布渠道接口提醒",
        content:
          "您确认撤销发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          console.log(that.$api);
          that.$api
            .gateway_unPublish_channelapi(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("撤销发布成功");
                that.getChannelApiList();
              } else {
                that.$Message.error("撤销发布失败");
                that.getChannelApiList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用撤销发布渠道接口失败");
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

