<template>
  <div class="order-section">
    <div class="order-section-header">
      <Icon type="ios-bookmark" size="26" />{{title}}
    </div>
    <div class="section-content">
      <Table width="700" border :columns="columnsConsignee" :data="consigneeData"></Table>
    </div>
  </div>
</template>
<style scoped >
.order-section {
  margin-top: 30px;
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
    columnsConsignee: {
      type: Array,
      default: function() {
        return [
          {
            title: "联系人",
            key: "consignee",
            align: "center"
          },
          {
            title: "电话",
            key: "mobileNo",
            align: "center"
          },
          {
            title: "收货地址",
            width: 400,
            key: "address",
            align: "center"
          }
        ];
      }
    },
    consigneeData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>