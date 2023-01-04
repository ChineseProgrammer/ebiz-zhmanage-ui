<template>
  <div class="mobile-wrapper">
    <!-- <div class="top-part">
      <div class="go-back" @click="goBack"></div>
      <div class="head-title">考试</div>
    </div> -->
    <div class="result-body">
      <div class="result-banner">
        <div class="result-baner-title">{{ task.title }}</div>
        <div class="result-baner-title">考试结果：{{ userLog.result }}</div>
        <div class="result-baner-title">考试分数：{{ userLog.score }}</div>
        <div class="result-baner-title">开考时间：{{ userLog.start }}</div>
        <div class="result-baner-title">提交时间：{{ userLog.end }}</div>
      </div>

      <div class="result-content" v-for="(question, index) in questionareList" :key="index">
        <div class="result-question">
          <div class="question-type">{{ question.subject && question.subject.substring(0, 2) }}</div>
          <div class="question-title">第{{ getNum(index) }}题：{{ question.title }}</div>
        </div>
        <ul class="result-content-list">
          <template v-if="question.subject && question.subject.indexOf('判断') >= 0">
            <li>
              <div class="question-option"></div>
              <span class="question-content">A.正确</span>
            </li>
            <li>
              <div class="question-option"></div>
              <span class="question-content">B.错误</span>
            </li>
          </template>
          <li v-if="question.a">
            <div class="question-option"></div>
            <span class="question-content">A.{{ question.a }}</span>
          </li>
          <li v-if="question.b">
            <div class="question-option"></div>
            <span class="question-content">B.{{ question.b }}</span>
          </li>
          <li v-if="question.c">
            <div class="question-option"></div>
            <span class="question-content">C.{{ question.c }}</span>
          </li>
          <li v-if="question.d">
            <div class="question-option"></div>
            <span class="question-content">D.{{ question.d }}</span>
          </li>
          <li v-if="question.e">
            <div class="question-option"></div>
            <span class="question-content">E.{{ question.e }}</span>
          </li>
          <li v-if="question.f">
            <div class="question-option"></div>
            <span class="question-content">F.{{ question.f }}</span>
          </li>
          <li v-if="question.g">
            <div class="question-option"></div>
            <span class="question-content">G.{{ question.g }}</span>
          </li>
        </ul>
        <div class="question-result">
          <div>提交答案：{{ question.submit ? (question.submit.split(/,|、/).join('')) : '未作答' }}</div>
          <div>正确答案：{{ question.answer ? (question.answer.split(/,|、/).join('')) : '' }}</div>
        </div>
        <div class="question-analysis">
          <div class="question-analysis-title">问题解析：</div>
          <div class="question-content">{{ question.parse }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabs: ['全部', '进行中', '未开始', '已完成'],
      tabIndex: 0,
      questionareList: [],
      logId: '',
      taskId: '',
      userId: '',
      task: {},
      userLog: {}
    }
  },
  created() {
    let query = this.$route.query;
    this.logId = query.logId;
    this.taskId = query.taskId;
    this.userId = query.userId;
    this.getList();
    this.getTask();
    document.title = "考试";
  },
  mounted() {
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
      this.getList();
    },
    getTask() {
      this.$api.questionResult({ taskId: this.taskId, logId: this.logId }).then(res => {
        console.log(res);
        this.task = res.data.task;
        this.userLog = res.data.userLog;
      })
    },
    getList() {
      let params = {
        logId: this.logId,
        taskId: this.taskId
      }
      this.$api.answerDetails(params).then(res => {
        console.log(res);
        this.questionareList = res.data;
      })
    },
    goBack() {
      if (this.task.type === 'new') {
        this.$router.push({ path: '/mobileLogin', query: { taskId: this.taskId } })
      } else if (this.task.type === 'regular') {
        this.$router.push({ path: '/questionareHome', query: { userId: this.userId } })
      }
    },
    getNum(index) {
      let nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let num = index + 1;
      let numArray = num.toString().split("");
      let str = '';
      let wei = 0;
      for (let i = numArray.length - 1; i >= 0; i--) {
        if (wei === 1) {
          str = '十' + str;
        } else if (wei === 2) {
          str = '百' + str;
        } else if (wei === 3) {
          str = '千' + str;
        }
        if (i === numArray.length - 1 && numArray[i] === '0') {
          // 这是末尾是零的数
        } else if (i === 0 && numArray.length === 2 && numArray[i] === '1') {
          // 这是一打头的十位数
        } else {
          str = nums[numArray[i]] + str;
        }
        wei++;
      }
      return str;
    },
  }
}
</script>
<style scoped>
.mobile-wrapper {
  font-family: PingFang SC;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f8f8f8;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  display: flex;
  flex-direction: column;
}

.top-part {
  height: 0.88rem;
  background-color: #386DBC;
}

.go-back {
  display: block;
  width: 0.25rem;
  height: 0.45rem;
  background-image: url(../../../assets/questionare/back.png);
  background-size: 100% 100%;
  cursor: pointer;
  float: left;
  margin-left: 0.3rem;
  margin-top: 0.22rem;
}

.head-title {
  height: 0.88rem;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.88rem;
  text-align: center;
  font-weight: bold;
}

.result-body {
  padding: 0.2rem 0.2rem 1rem;
  position: relative;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.result-banner {
  padding-left: 0.37rem;
  height: 3.58rem;
  box-sizing: border-box;
  width: 100%;
  background-image: url(../../../assets/questionare/result-banner.png);
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 0.37rem;
}

.result-baner-title {
  color: #fff;
  font-weight: 500;
  font-size: 0.3rem;
  line-height: 0.32rem;
}

.result-content {
  background-color: #fff;
  padding: 0 0.34rem 0.3rem;
  margin-bottom: 0.2rem;
  border-radius: 0.1rem;
}

.result-question {
  display: flex;
  align-items: center;
  /* height: 0.96rem; */
  box-sizing: border-box;
  padding: 0.26rem 0;
  border-bottom: 0.01rem solid #F4F4F4;
  font-size: 0.3rem;
  color: #333;
}

.question-type {
  color: #999;
  margin-right: 0.46rem;
  white-space: nowrap;
}

.question-title {
  line-height: 0.44rem;
}

.result-content-list li {
  display: flex;
  align-items: center;
  padding: 0.27rem 0;
  /* border-bottom: 1px solid #F4F4F4; */
}

.result-content-list li:last-child {
  border-bottom: 0;
}

.question-option {
  width: 0.28rem;
  height: 0.28rem;
  border: 0.02rem solid #F39E41;
  border-radius: 50%;
  margin-right: 0.3rem;
  flex-shrink: 0;
}

.question-content {
  font-size: 0.3rem;
  line-height: 0.36rem;
  color: #333;
}

.question-analysis .question-content {
  text-indent: 2em;
}

.question-result {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0 0.32rem;
  font-size: 0.3rem;
  color: #999;
  line-height: 0.3rem;
  border-bottom: 1px solid #F4F4F4;
}

.question-analysis-title {
  font-size: 0.3rem;
  color: #333;
  line-height: 0.92rem;
}
</style>