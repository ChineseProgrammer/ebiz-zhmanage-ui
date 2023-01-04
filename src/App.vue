<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
import "./style/common.less";
import { isOperateFun } from '@/api/isOperate.js'
export default {
  data() {
    return {orgBackground: '',};
  },
  mounted() {},
  beforeDestroy() {},
  created() {
    isOperateFun()
  },
  methods: {},
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
.ivu-notice{
bottom: 24px !important;
top: auto !important;
width: auto !important;
}
.ivu-notice-desc{
white-space: nowrap;
}
</style>
