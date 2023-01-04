<template>
  <div class="mobile-wrapper">
    <!-- <div class="top-part">
      <div class="go-back" @click="goBack" v-if="task.type !== 'new'"></div>
      <div class="head-title">考试</div>
    </div> -->
    <div class="result-body">
      <div class="result-banner">
        <div class="result-baner-title">{{ this.task.title }}</div>
        <div class="result-baner-title">
          <div class="result-banner-left">
            <div class="question-top">{{ this.activeIndex + 1 }}/{{ this.questionareList.length }}</div>
            <div class="question-bottom">已答题</div>
          </div>
          <div class="result-banner-right">
            <div class="question-top">{{ lastTime }}</div>
            <div class="question-bottom">倒计时</div>
          </div>
        </div>
      </div>
      <div class="question-tips">
        <div class="question-alarm"></div>倒计时间结束后会自动提交
      </div>
      <div class="result-content">
        <div class="result-question">
          <div class="question-type">{{ activeQuestion.subject && activeQuestion.subject.substring(0, 2) }}</div>
          <div class="question-title">第{{ getNum() }}题：{{ activeQuestion.title }}</div>
        </div>
        <ul class="result-content-list" v-if="activeQuestion.subject === '判断题' || activeQuestion.subject === '判断'">
          <li @click="selectThis('A')">
            <div class="question-option" :class="[activeQuestion.submit === 'A' ? 'active' : '']"></div>
            <span class="question-content">A.正确</span>
          </li>
          <li @click="selectThis('B')">
            <div class="question-option" :class="[activeQuestion.submit === 'B' ? 'active' : '']"></div>
            <span class="question-content">B.错误</span>
          </li>
        </ul>
        <ul class="result-content-list" v-else-if="activeQuestion.subject === '单选题' || activeQuestion.subject === '单选'">
          <li v-if="activeQuestion.a" @click="selectThis('A')">
            <div class="question-option" :class="[activeQuestion.submit === 'A' ? 'active' : '']"></div>
            <span class="question-content">A.{{ activeQuestion.a }}</span>
          </li>
          <li v-if="activeQuestion.b" @click="selectThis('B')">
            <div class="question-option" :class="[activeQuestion.submit === 'B' ? 'active' : '']"></div>
            <span class="question-content">B.{{ activeQuestion.b }}</span>
          </li>
          <li v-if="activeQuestion.c" @click="selectThis('C')">
            <div class="question-option" :class="[activeQuestion.submit === 'C' ? 'active' : '']"></div>
            <span class="question-content">C.{{ activeQuestion.c }}</span>
          </li>
          <li v-if="activeQuestion.d" @click="selectThis('D')">
            <div class="question-option" :class="[activeQuestion.submit === 'D' ? 'active' : '']"></div>
            <span class="question-content">D.{{ activeQuestion.d }}</span>
          </li>
          <li v-if="activeQuestion.e" @click="selectThis('E')">
            <div class="question-option" :class="[activeQuestion.submit === 'E' ? 'active' : '']"></div>
            <span class="question-content">E.{{ activeQuestion.e }}</span>
          </li>
          <li v-if="activeQuestion.f" @click="selectThis('F')">
            <div class="question-option" :class="[activeQuestion.submit === 'F' ? 'active' : '']"></div>
            <span class="question-content">F.{{ activeQuestion.f }}</span>
          </li>
          <li v-if="activeQuestion.g" @click="selectThis('G')">
            <div class="question-option" :class="[activeQuestion.submit === 'G' ? 'active' : '']"></div>
            <span class="question-content">G.{{ activeQuestion.g }}</span>
          </li>
        </ul>
        <ul class="result-content-list" v-else>
          <li v-if="activeQuestion.a" @click="selectThis('A')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('A') >= 0 ? 'active' : '']"></div>
            <span class="question-content">A.{{ activeQuestion.a }}</span>
          </li>
          <li v-if="activeQuestion.b" @click="selectThis('B')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('B') >= 0 ? 'active' : '']"></div>
            <span class="question-content">B.{{ activeQuestion.b }}</span>
          </li>
          <li v-if="activeQuestion.c" @click="selectThis('C')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('C') >= 0 ? 'active' : '']"></div>
            <span class="question-content">C.{{ activeQuestion.c }}</span>
          </li>
          <li v-if="activeQuestion.d" @click="selectThis('D')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('D') >= 0 ? 'active' : '']"></div>
            <span class="question-content">D.{{ activeQuestion.d }}</span>
          </li>
          <li v-if="activeQuestion.e" @click="selectThis('E')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('E') >= 0 ? 'active' : '']"></div>
            <span class="question-content">E.{{ activeQuestion.e }}</span>
          </li>
          <li v-if="activeQuestion.f" @click="selectThis('F')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('F') >= 0 ? 'active' : '']"></div>
            <span class="question-content">F.{{ activeQuestion.f }}</span>
          </li>
          <li v-if="activeQuestion.g" @click="selectThis('G')">
            <div class="question-option"
              :class="[activeQuestion.submit && activeQuestion.submit.indexOf('G') >= 0 ? 'active' : '']"></div>
            <span class="question-content">G.{{ activeQuestion.g }}</span>
          </li>
        </ul>
      </div>
      <div class="question-btns" v-if="(task.type === 'regular' && task.status !== 2) || (task.type === 'new' && task.enable === 1)">
        <div class="quesiton-btn white-bg" v-if="activeIndex > 0" @click="preQuestion">上一题</div>
        <div class="quesiton-btn" v-if="questionareList.length > activeIndex + 1" @click="nextQuestion">下一题</div>
        <div class="quesiton-btn" v-if="questionareList.length === activeIndex + 1" @click="submit">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Notify } from 'vant';
export default {
  data() {
    return {
      tabs: ['全部', '进行中', '未开始', '已完成'],
      tabIndex: 0,
      questionareList: [],
      logId: '',
      taskId: '',
      userId: '',
      activeQuestion: {},
      activeIndex: 0,
      task: {},
      userLog: {},
      timer: null,
      lastTime: ''
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
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
      this.getList();
    },
    getLastTime() {
      if(this.task && this.task.mins){
        let duaritionSeconds = parseInt(this.task.mins) * 60 * 1000;
        console.log("duaritionSeconds", duaritionSeconds,this.userLog);
        let startSeconds = 0;
          startSeconds = new Date().getTime();
        console.log("startSeconds", startSeconds);
        let endSeconds = 0;
        if (this.userLog.end) {
          endSeconds = new Date(this.userLog.end.replace(/-/g, '/')).getTime()
        }
        let currentTime = new Date().getTime();
  
        if (endSeconds) {
          if (endSeconds - startSeconds < duaritionSeconds) {
            duaritionSeconds = (endSeconds - currentTime);
          }
        } else {
          duaritionSeconds = duaritionSeconds - (currentTime - startSeconds);
        }
        if (duaritionSeconds < 0) {
          Notify({
            type: 'warning', message: '考试已结束', onClose: () => {
              this.$router.go(-1);
              // this.$router.replace({ path: '/questionareResult', query: { logId: this.logId, taskId: this.taskId } });
            }
          })
          return
        }
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          duaritionSeconds -= 1000;
          this.lastTime = parseInt(duaritionSeconds / 1000 / 60) + '分' + parseInt(duaritionSeconds / 1000 % 60) + '秒';
          if (duaritionSeconds <= 0) {
            duaritionSeconds = 0;
            clearInterval(this.timer);
            // 超时自动交卷
            this.submitTrue();
          }
        }, 1000)
      }
    },
    getTask() {
      this.$api.questionResult({ taskId: this.taskId, logId: this.logId }).then(res => {
        console.log(res);
        this.task = res.data.task;
        this.userLog = res.data.userLog;
        if (this.userLog.result) {
          this.$router.replace({ path: '/questionareResult', query: { logId: this.logId, taskId: this.taskId, userId: this.userId } });
        } else {
          if (this.task.enable === 2) {
            Notify({
              type: 'warning', message: '考试已下架,请联系管理员!', onClose: () => {
                this.$router.go(-1);
              }
            })
          } else {
            this.getLastTime();
          }
        }
      })
    },
    getList() {
      this.$api.questionStart({ logId: this.logId, taskId: this.taskId }).then(res => {
        console.log(res);
        this.questionareList = res.data;
        this.activeIndex = 0;
        this.activeQuestion = this.questionareList[0] || {};
      })
    },
    getNum() {
      let nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let num = this.activeIndex + 1;
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
    goBack() {
      this.$router.go(-1);
    },
    selectThis(submit) {
      if(this.activeQuestion.subject){
        if (this.activeQuestion.subject.indexOf('单选')>=0 || this.activeQuestion.subject.indexOf('判断') >= 0) {
          this.activeQuestion.submit = submit;
        } else if (this.activeQuestion.subject.indexOf('多选') >= 0) {
          let submits = [];
          if (this.activeQuestion && this.activeQuestion.submit) {
            submits = this.activeQuestion.submit.split(",");
          }
          let index = submits.findIndex(one => { return one === submit });
          if (index >= 0) {
            submits.splice(index, 1);
          } else {
            submits.push(submit);
          }
          submits.sort();
          this.activeQuestion.submit = submits.join(",")
        }
      }
    },
    nextQuestion(type, fn) {
      if (type !== 'submit') {
        this.activeIndex++;
      }
      if (this.activeQuestion.submit) {
        this.$api.questionUpdate({
          logId: this.logId,
          taskId: this.taskId,
          submit: this.activeQuestion.submit,
          questions: this.activeQuestion.questions
        }).then(res => {
          if (type !== 'submit') {
            this.activeQuestion = this.questionareList[this.activeIndex];
          }
          fn && fn();
        })
      } else {
        if (type !== 'submit') {
          this.activeQuestion = this.questionareList[this.activeIndex];
        }
        fn && fn();
      }

    },
    preQuestion() {
      this.activeIndex--;
      this.activeQuestion = this.questionareList[this.activeIndex];
    },
    submitValidate(fn) {
      let submitAll = true;
      for (let i = 0; i < this.questionareList.length; i++) {
        const q = this.questionareList[i];
        if (!q.submit) {
          submitAll = false;
          break;
        }
      }
      if (submitAll) {
        fn && fn();
      } else {
        Dialog.confirm({
          title: '提示',
          message: '题目未完成，确定提交吗？',
        }).then(() => {
          fn && fn();
        }).catch(() => {
        });
      }
    },
    submit() {
      this.submitValidate(() => {
        this.submitTrue();
      })
    },
    submitTrue() {
      this.nextQuestion('submit', () => {
        this.$api.logSubmit({
          id: this.logId,
          task: this.taskId
        }).then(res => {
          this.$router.replace({ path: '/questionareResult', query: { logId: this.logId, taskId: this.taskId, userId: this.userId } });
        })
      })
    }
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
}

.result-banner {
  height: 2.31rem;
  box-sizing: border-box;
  width: 100%;
  background-image: url(../../../assets/questionare/result-banner.png);
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  padding: 0.26rem 0.72rem 0 0.34rem;
  position: relative;
  z-index: 2;
}

.result-baner-title {
  color: #fff;
  font-weight: 500;
  font-size: 0.3rem;
  line-height: 0.32rem;
  display: flex;
  justify-content: space-between;
}

.result-banner-left {
  display: flex;
  flex-direction: column;
  font-weight: 400;
}

.result-banner-right {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-weight: 400;
}

.question-top {
  font-size: 0.48rem;
  color: #fff;
  line-height: 0.6rem;
  margin-top: 0.48rem;
}

.question-bottom {
  font-size: 0.24rem;
  color: #fff;
  line-height: 0.36rem;
  margin-top: 0.2rem;
}

.result-content {
  margin-top: 0.37rem;
  background-color: #fff;
  padding: 0 0.34rem;
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
  cursor: pointer;
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.question-option.active:after {
  display: block;
  content: "";
  width: 0.2rem;
  height: 0.2rem;
  background-color: #F39E41;
  border-radius: 50%;
}

.question-content {
  font-size: 0.3rem;
  line-height: 0.36rem;
  text-align: justify;
  color: #333;
}

.question-tips {
  position: relative;
  margin-top: -0.5rem;
  z-index: 1;
  padding-top: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.24rem;
  color: #234A85;
  display: flex;
  align-items: center;
  padding-left: 0.53rem;
  background: #E7EFFC;
  box-shadow: 0px 0px 29px 2px rgba(100, 184, 255, 0.3);
  border-radius: 0px 0px 20px 20px;
}

.question-alarm {
  width: 0.32rem;
  height: 0.29rem;
  margin-right: 0.28rem;
  background-image: url(../../../assets/questionare/alarm.png);
  background-size: 100% 100%;
}

.question-btns {
  display: flex;
  justify-content: space-evenly;
  margin-top: 0.5rem;
}

.quesiton-btn {
  width: 2.83rem;
  height: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.3rem;
  border: 0.02rem solid #F39E41;
  border-radius: 0.14rem;
  background-color: #F39E41;
  color: #fff;
  cursor: pointer;
}

.quesiton-btn.white-bg {
  background-color: #fff;
  color: #F39E41;
}
</style>