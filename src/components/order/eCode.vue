<template>
  <div class="order-section">
    <div class="section-content">
      <Table width="135" border :columns="columnsECode" :data="eCode"></Table>
    </div>
  </div>
</template>
<style scoped >
.order-section {
  margin-top: -1px;
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
    columnsECode: {
      type: Array,
      default: function() {
        return [
          {
            title: "票券编码",
            key: "code",
            width: 133,
            align: "center"
          }
        ];
      }
    },
    eCode: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>