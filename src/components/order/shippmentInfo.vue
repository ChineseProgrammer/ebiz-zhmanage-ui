<template>
  <div class="order-section">
    <div class="order-section-header">
      <Icon type="ios-bookmark" size="26" />{{title}}
    </div>
    <div class="section-content">
      <Timeline>
        <TimelineItem color="green" v-for="item in logisticsList">
          <p>{{item.text}}</p>
          <p>{{item.time}}</p>
        </TimelineItem>
      </Timeline>
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
    logisticsList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>