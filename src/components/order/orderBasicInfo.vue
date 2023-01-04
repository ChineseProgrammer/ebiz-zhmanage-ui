<template>
  <div class="order-section">
    <div class="order-section-header">
      <Icon type="ios-bookmark" size="26" />{{title}}
    </div>
    <div class="section-content">
      <Table width="700" border :columns="columnsBase" :data="baseData"></Table>
    </div>
  </div>
</template>
<style scoped >
.order-section {
  margin-bottom: 30px;
}

.section-content {
  margin-left: 28px;
}
</style>
<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    columnsBase: {
      type: Array,
      default: function() {
        return [
          {
            title: "订单编号",
            key: "orderNumber",
            width: 150,
            align: "center"
          },
          {
            title: "提交时间",
            key: "submitTime",
            align: "center"
          },
          {
            title: "用户账号",
            key: "userAccount",
            align: "center"
          },
          {
            title: "订单金额",
            key: "orderPrice",
            align: "center",
            render: (h, params) => {
              return h("span", "￥" + params.row.orderPrice);
            }
          }
        ];
      }
    },
    baseData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>