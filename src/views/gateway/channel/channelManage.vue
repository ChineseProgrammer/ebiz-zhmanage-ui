<template>
  <div class="only-content">
    <!-- button -->
    <div class="m-table">
      <div class="m-btn">
        <!--<Button @click="batchDelete">批量删除</Button>-->
        <Button @click="showAddChannelForm()" type="success">新增渠道</Button>

        <Button @click="publishChannel()" type="primary" :disabled="select.ids.length <= 0">发布渠道</Button>

        <Button @click="unPublishChannel()" type="warning" :disabled="select.ids.length <= 0">撤销渠道</Button>
      </div>
      <!-- table表格 -->
      <primaryTable
        border
        width="100%"
        :columns="channelTable.columns"
        :data="channelTable.data"
        ref="selectionTable"
        tableRef="selectionTable"
        @deleteChannel="deleteChannel"
        @showEditChannelForm="showEditChannelForm"
        @toChannelApiManage="toChannelApiManage"
        @on-selection-change="handleSelectRow"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { debug } from "util";
import addChannelForm from "./form/addChannelForm";
import editChannelForm from "./form/editChannelForm";

export default {
  data() {
    return {
      // 删除的id列表
      select: {
        ids: []
      },
      // 表单变量
      channelTable: {
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
            title: "渠道名",
            key: "channelName",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "渠道编码",
            key: "channelCode",
            align: "center",
            slot: "alarm",
            width: 150
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
            title: "验证方式",
            key: "authType",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "请求类型",
            key: "reqType",
            align: "center",
            slot: "alarm",
            width: 150
          },
          {
            title: "返回类型",
            key: "resType",
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
                name: "渠道接口管理",
                type: "primary",
                method: "toChannelApiManage"
              },
              { name: "编辑", type: "warning", method: "showEditChannelForm" },
              { name: "删除", type: "error", method: "deleteChannel" }
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
    this.getChannelList();
  },
  computed: mapGetters({}),
  watch: {},
  methods: {
    getChannelList() {
      let that = this;
      that.select.ids = [];
      that.$api
        .channel_list({})
        .then(function(data) {
          if (data.respCode == 0) {
            that.channelTable.data = data.data;
          }
        })
        .catch(error => {});
    },
    showAddChannelForm() {
      var params = {
        self: this,
        title: "新增渠道",
        width: "50%",
        props: {},
        form: addChannelForm,
        success: res => {
          this.getChannelList();
        },
        cancel: () => {
          this.getChannelList();
        }
      };
      this.$util.openModelForm(params);
    },
    showEditChannelForm(channel) {
      var params = {
        self: this,
        title: "修改渠道",
        width: "50%",
        props: { channel: channel },
        form: editChannelForm,
        success: res => {
          this.getChannelList();
        },
        cancel: () => {
          this.getChannelList();
        }
      };
      this.$util.openModelForm(params);
    },
    deleteChannel(channel) {
      let that = this;
      this.$Modal.confirm({
        title: "删除确认",
        content: "您确认删除渠道:[<b>" + channel.channelName + "</b>]吗?",
        onOk: function() {
          that.$api
            .channel_delete({ ids: [channel.id] })
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("删除成功");
                that.getChannelList();
              } else {
                that.$Message.success("删除失败");
                that.getChannelList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用删除服务接口失败");
            });
        }
      });
    },
    toChannelApiManage(channel) {
      this.$router.push({
        name: "channelApiManage",
        query: { channelId: channel.id }
      });
    },
    publishChannel() {
      let that = this;
      this.$Modal.confirm({
        title: "发布渠道提醒",
        content: "您确认发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          that.$api
            .gateway_publish_channel(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("发布成功");
                that.getChannelList();
              } else {
                that.$Message.error("发布失败");
                that.getChannelList();
              }
            })
            .catch(error => {
              that.$Message.warning("调用发布渠道接口失败");
            });
        }
      });
    },
    unPublishChannel() {
      let that = this;
      this.$Modal.confirm({
        title: "撤销发布渠道提醒",
        content:
          "您确认撤销发布选中的<b>" + that.select.ids.length + "项</b>吗?",
        onOk: function() {
          console.log(that.$api);
          that.$api
            .gateway_unPublish_channel(that.select.ids)
            .then(function(data) {
              if (data.respCode == 0) {
                that.$Message.success("撤销发布成功");
                that.getChannelList();
              } else {
                that.$Message.error("撤销发布失败");
                that.getChannelList();
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

