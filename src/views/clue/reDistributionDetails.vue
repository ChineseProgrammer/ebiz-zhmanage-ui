<template>
  <div class="user-list">
    <div class="m-table">
      <p v-for="(item, index) in dataList" :key="item.id" class="detail-item">
        {{index + 1}}.
        <span><b>更新时间：</b>{{item.time2}}</span>
        <span v-if="item.userName">；<b>更新人：</b>{{item.userName}}</span>
        <span v-if="item.refreshStr">；<b>更新内容：</b></span>
        <span v-if="item.refreshStr">{{item.refreshStr}}</span>
        。
      </p>
      <p v-if="dataList.length === 0" class="no-data">暂无数据</p>
    </div>
    <Button type="primary" style="display:block;margin:0 auto;" @click="$router.go(-1)">返回</Button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      dataList: []
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    let query = this.$route.query;

    this.getList();
  },
  mounted: function () {
    console.log(this.treeData);
  },
  methods: {
    //获得角色·
    getList() {
      console.log(this.$route.query);
      this.$api.clueDetails({ clueId: this.$route.query.clueId }).then(res => {
        console.log(res);
        res.data.map(one => {
          one.time2 = this.formatDate(one.createTime);
        })
        this.dataList = res.data;
        /* 
        <span v-if="item.contactTimeFlag">；首联时间：{{item.time}}</span>
          <span v-if="item.modeFlag">；沟通方式：{{item.mode}}</span>
        <span v-if="item.addWxFlag">；是否添加微信：{{item.addWx}}</span>
        <span v-if="item.nickNameFlag">；用户昵称：{{item.nickName}}</span>
        <span v-if="item.insuredProductFlag">；投保产品：{{item.insuredProduct}}</span>
        <span v-if="item.amountFlag">；保额：{{item.amount}}万</span>
        <span v-if="item.premFlag">；保费：{{item.prem}}</span>
        <span v-if="item.desFlag">；情况说明：{{item.des}}</span>
        <span v-if="item.followStatusFlag">；跟进状态更新为{{item.followStatus}}</span>
        */
        for (let i = 0; i < res.data.length; i++) {
          let item1 = res.data[i];
          let refreshStr = "";
          refreshStr += '；情况说明：' + item1.des;
          if(refreshStr){
            refreshStr = refreshStr.substr(1);
          }
          item1.refreshStr = refreshStr;
        }
      })
    },
    formatDate(dateStr) {
      return dateStr.substring(0, 4) + '年' + dateStr.substring(5, 7) + '月' + dateStr.substring(8, 10) + '日' + ' ' + dateStr.substring(11, 13) + '时' + dateStr.substring(14, 16) + '分';
    },
    handleReachBottom() { }
  },
  filters: {},
};
</script>

<style lang="less">
.v-transfer-dom
  .ivu-modal-wrap
  .ivu-modal
  .ivu-modal-content
  .ivu-modal-body
  .ivu-modal-confirm-body {
  height: auto !important;
  max-height: 350px !important;
  color: unset !important;
  overflow: auto;
}

.add-btns {
  display: flex;
  margin-bottom: 10px;
}

.head-line {
  display: flex;
  justify-content: space-between;
  line-height: 36px;
  margin-bottom: 10px;
  background: #f2f2f2;
  padding: 0 10px;
}

.head-line div {
  margin-right: 40px;
}

.question-item {
  display: flex;
}

.question-number {
  white-space: nowrap;
  width: 70px;
  flex-shrink: 0;
}

.question-title {
  margin-bottom: 10px;
}

.question-answer {
  display: flex;
  margin-top: 10px;
}

.question-answer-left {
  margin-right: 30px;
}

.ivu-scroll-wrapper {
  border: 1px solid #ccc;
}
.detail-item {
  line-height: 24px;
  margin-bottom: 5px;
}
.no-data {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>
