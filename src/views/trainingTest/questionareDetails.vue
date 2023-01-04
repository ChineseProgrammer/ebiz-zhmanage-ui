<template>
  <div class="user-list">
    <div class="m-table">
      <div class="head-line">
        <div>考试开始时间：{{ baseMsg.start }}</div>
        <div>提交时间：{{ baseMsg.end }}</div>
        <div>考试分数：{{ baseMsg.score }}</div>
        <div>进入考试次数：{{ baseMsg.times }}</div>
        <div>考试结果：{{ baseMsg.result }}</div>
      </div>

      <Scroll :on-reach-bottom="handleReachBottom" :height="height">
        <Card dis-hover v-for="(item, index) in dataList" :key="index" style="margin-bottom: 16px">
          <div class="question-item">
            <div class="question-number">第{{ index + 1 }}题：</div>
            <div class="question-content">
              <div class="question-title">{{ item.title }} ()</div>
              <template v-if="item.subject && item.subject.indexOf('判断') >= 0">
                <div>A.正确</div>
                <div>B.错误</div>
              </template>
              <div v-if="item.a">A.{{ item.a }}</div>
              <div v-if="item.b">B.{{ item.b }}</div>
              <div v-if="item.c">C.{{ item.c }}</div>
              <div v-if="item.d">D.{{ item.d }}</div>
              <div v-if="item.e">E.{{ item.e }}</div>
              <div v-if="item.f">F.{{ item.f }}</div>
              <div v-if="item.g">G.{{ item.g }}</div>
              <div class="question-answer">
                <div class="question-answer-left">提交答案： {{ item.submit ? (item.submit.split(/,|、/).join('')) : '未作答' }}
                </div>
                <div>正确答案： {{ item.answer ? (item.answer.split(/,|、/).join('')) : '' }}</div>
              </div>
            </div>
          </div>
        </Card>
      </Scroll>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {
        pageSize: 10,
        page: 1,
      },
      baseMsg: {},
      height: '600'
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    let query = this.$route.query;
    this.baseMsg.start = query.start;
    this.baseMsg.end = query.end;
    this.baseMsg.score = query.score;
    this.baseMsg.result = query.result;
    this.baseMsg.times = query.times;

    this.getList();
  },
  mounted: function () {
    console.log(this.treeData);
  },
  methods: {
    //获得角色·
    getList() {
      console.log(this.$route.query);
      this.params.logId = this.$route.query.logId;
      this.params.taskId = this.$route.query.taskId;
      this.$api.getPeopleAnswers(this.params).then(res => {
        console.log(res);
        this.dataList = res.data;
      })
    },
    handleReachBottom() { }
  },
  filters: {},
};
</script>

<style lang="less">
.v-transfer-dom .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body .ivu-modal-confirm-body {
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
</style>
