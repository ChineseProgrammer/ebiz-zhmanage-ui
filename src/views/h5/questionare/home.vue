<template>
  <div class="mobile-wrapper">
    <div class="top-part">
      <!-- <div class="head-title">首页</div> -->
    </div>
    <div class="home-body">
      <div class="home-banner">
        <div class="home-baner-title1">中华人寿创新渠道</div>
        <div class="home-baner-title2">通关考试</div>
      </div>
      <div class="home-content">
        <div class="home-tabs">
          <div class="home-tab" :class="{ 'active': tabIndex === index }" v-for="(tab, index) in tabs" :key="index"
            @click="changeTab(index)">
            {{ tab }}</div>
        </div>
        <van-empty v-if="tasks.length === 0" description="暂无任务" />
        <ul class="home-content-list">
          <li v-for="(task, index) in tasks" :key="index">
            <div class="hcl-top">
              <div class="hcl-top-left">
                <span class="product-name">{{ task.title }}</span>
                <span class="product-status">{{ task.statusName }}</span>
              </div>
              <div class="hcl-top-btn" @click="goToResult(task)" v-if="task.btnStatus == 'done'">查看</div>
              <div class="hcl-top-btn" @click="goToAnswer(task)" v-if="task.btnStatus == 'doing'">考试</div>
            </div>
            <div class="hcl-bottom">
              <span>{{ task.mins }}分钟</span>
              <span>评分：{{ task.score ? task.score : '未评分' }}</span>
            </div>
            <div class="hcl-bottom">
              <span>{{ task.start }} 至 {{ task.end }}</span>
            </div>
          </li>
          <!-- <li>
            <div class="hcl-top">
              <div class="hcl-top-left">
                <span class="product-name">保险产品1</span>
                <span class="product-status">进行中</span>
              </div>
              <div class="hcl-top-btn" @click="goToAnswer()" >考试</div>
            </div>
            <div class="hcl-bottom">
              <span>120分钟</span>
              <span>评分：未评分</span>
              <span>2022-02-09至2-22-5-5</span>
            </div>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// 2未开始 3进行中 4已结束 5已撤回
export default {
  data() {
    return {
      tabs: ['全部', '进行中', '未开始', '已完成'],
      tabIndex: 0,
      allTask: [],
      doingTask: [],
      doneTask: [],
      notStartTask: [],
      tasks: [],
      userId: '',
    }
  },

  created() {
    this.userId = this.$route.query.userId;
    this.getList();
    document.title = "首页";
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
      if (index === 0) {
        this.tasks = this.allTask;
      } else if (index === 1) {
        this.tasks = this.doingTask;
      } else if (index === 2) {
        this.tasks = this.notStartTask;
      } else if (index === 3) {
        this.tasks = this.doneTask;
      }
    },
    getList() {
      this.$api.taskList({ userId: this.userId }).then(res => {
        console.log(res);
        this.notStartTask = res.data.notstart;
        this.notStartTask.map(one => {
          one.statusName = '未开始';
          one.btnStatus = 'notStart';
          return one;
        })
        this.doingTask = res.data.doing;
        this.doingTask.map(one => {
          one.statusName = '进行中';
          one.btnStatus = 'doing';
          return one;
        })

        this.doneTask = res.data.done;
        this.doneTask.map(one => {
          one.statusName = '已完成';
          one.btnStatus = 'done';
          return one;
        })

        this.allTask = [ ...this.doingTask,...this.notStartTask, ...this.doneTask];
        this.tasks = this.allTask;
      })
    },
    goToAnswer(task) {
      this.$api.questionResult({ taskId: task.taskId, logId: task.logId }).then(res => {
        if (res.data.userLog.result) {
          this.$router.push({ path: '/questionareResult', query: { logId: task.logId, taskId: task.taskId, userId: this.userId } });
        } else {
          this.$router.push({ path: '/questionareQuestions', query: { logId: task.logId, taskId: task.id, userId: this.userId } })
        }
      })
    },
    goToResult(task) {
      this.$router.push({ path: '/questionareResult', query: { logId: task.logId, taskId: task.id, userId: this.userId } })
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
  height: 3.02rem;
  background-color: #386DBC;
}

.head-title {
  height: 0.88rem;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.88rem;
  text-align: center;
  font-weight: bold;
}

.home-body {
  padding: 0.2rem;
  position: relative;
  margin-top: -3rem;
}

.home-banner {
  padding-top: 1.09rem;
  height: 3.58rem;
  box-sizing: border-box;
  width: 100%;
  background-image: url(../../../assets/questionare/home-banner.png);
  background-size: 100% 100%;
}

.home-baner-title1,
.home-baner-title2 {
  color: #fff;
  margin-left: 0.53rem;
  font-weight: 500;
}

.home-baner-title1 {
  font-size: 0.6rem;
  line-height: 0.6rem;
}

.home-baner-title2 {
  margin-top: 0.35rem;
  font-size: 0.48rem;
  line-height: 0.48rem;
}

.home-content {
  margin-top: 0.37rem;
  background-color: #fff;
  padding: 0 0.34rem;
}

.home-tabs {
  display: flex;
  justify-content: space-between;
  height: 0.96rem;
  border-bottom: 0.01rem solid #F4F4F4;
}

.home-tab {
  height: 0.96rem;
  line-height: 0.92rem;
  color: #666;
  font-size: 0.3rem;
  font-weight: 500;
  cursor: pointer;
}

.home-tab.active {
  border-bottom: 0.05rem solid #386DBC;
  border-radius: 0.03rem;
  color: #386DBC;
}

.home-content-list li {
  padding: 0.35rem 0 0.3rem;
  border-bottom: 1px solid #F4F4F4;
}

.home-content-list li:last-child {
  border-bottom: 0;
}

.hcl-top {
  display: flex;
  justify-content: space-between;
  height: 0.54rem;
}

.hcl-top-left {
  display: flex;
  align-items: center;
}

.product-name {
  font-size: 0.3rem;
  color: #333;
}

.product-status {
  color: #fff;
  font-size: 0.24rem;
  background: #F27E5F;
  height: 0.36rem;
  padding: 0 0.15rem;
  display: flex;
  align-items: center;
  margin-left: 0.23rem;
  border-radius: 0.06rem;
}

.hcl-top-btn {
  color: #fff;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
  height: 0.54rem;
  width: 1rem;
  justify-content: center;
  background: #386DBC;
  border-radius: 0.06rem;
  cursor: pointer;
}

.hcl-bottom {
  display: flex;
  font-size: 0.24rem;
  color: #999999;
  line-height: 0.28rem;
  margin-top: 0.36rem;
}

.hcl-bottom span {
  margin-right: 0.42rem;
}

.hcl-bottom span:last-child {
  margin-right: 0;
}
</style>