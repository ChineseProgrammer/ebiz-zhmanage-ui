<template>
  <div class="clue-wrapper">
    <div class="tab-list">
      <div class="home-tab" :class="{ 'active': tabIndex === index }" v-for="(tab, index) in tabs" :key="index"
        @click="changeTab(index)">
        {{ tab.name }}</div>
    </div>
    <div class="second-line" v-show="tabIndex === 2">
      <div>线索状态</div>
      <div :class="{'active': (show || activeStatus)}" @click="show=true;">筛选
        <van-icon name="play" style="transform:rotate(90deg);opacity:0.3;" />
      </div>
    </div>
    <van-list class="card-list" :error.sync="loadError" error-text="请求失败，点击重新加载" v-model="loading" :finished="finished"
      finished-text="没有更多了" @load="getClueList">
      <van-cell v-for="item in list" :key="item.id">
        <div class="clue-card" @click="clueDetails(item)" v-if="item.clientName && item.clientName != 'null'">
          <div class="clue-name">姓名：{{item.clientName}}</div>
          <div class="clue-message" :class="item.clientSex === '女' ? 'girl': ''">
            <div class="clue-label" v-if="item.clientSex && item.clientSex != 'null'">{{item.clientSex}}</div>
            <div class="clue-label" v-if="item.clientAge && item.clientAge != 'null'">年龄：{{item.clientAge}}</div>
            <div class="clue-phone" v-if="item.clientPhone && item.clientPhone != 'null'">
              <img src="../../../assets/clue/phone.png" />
              <span>{{item.clientPhone}}</span>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
    <!-- <div class="card-list">
      <div class="clue-card" @click="clueDetails">
        <div class="clue-name">姓名：张三</div>
        <div class="clue-message girl">
          <div class="clue-label">男</div>
          <div class="clue-label">年龄：34</div>
          <div class="clue-phone">
            <img src="../../../assets/clue/phone.png" />
            <span>13333333333</span>
          </div>
        </div>
      </div>
    </div> -->
    <van-popup v-model="show" position="bottom"
      :overlay-style="{'background-color': 'rgba(0,0,0,.3)'}">
      <div class="status-head">筛选</div>
      <div class="status-title">线索状态</div>
      <div class="status-list">
        <div class="status-item" v-for="item in statusList" :class="{'active': activeStatus === item.name}" :key="item.id" @click="checkStatus(item)">{{item.name}}</div>
      </div>
      <div class="status-footer">
        <div class="reset" @click="reset">重置</div>
        <div class="ensure" @click="search">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import wxSdk from 'weixin-js-sdk';
const wxSdk = () => import('weixin-js-sdk');
export default {
  data() {
    return {
      tabs: [
        { key: "1", name: '未查看' },
        { key: "2", name: '已查看' },
        { key: "3", name: '已跟进' },
      ],
      tabIndex: 0,
      show: false,
      userId: '',
      loading: false,
      finished: false,
      list: [],
      page: 1,
      pageSize: 50,
      loadError: false,
      statusList: [],
      activeStatus: ''
    }
  },
  created() {
    this.userId = this.$route.query.userId;
    // this.getClueList();
    this.getStatusList();
    document.title = "线索详情";
  },
  mounted(){
    console.log("wxSdk: ",wxSdk);
    wxSdk().then(wx => {
      wx.hideOptionMenu();
    })
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
      this.list = [];
      this.onRefresh();
    },
    clueDetails(item) {
      this.$router.push({ path: '/clueDetails', query: { id: item.id, logId: item.logId,checked: this.tabIndex,userId: this.userId } })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getClueList();
    },
    reset(){
      this.activeStatus = '';
    },
    search(){
      this.show = false;
      this.list = [];
      this.getClueList();
    },
    getClueList() {
      let activeStatus = this.activeStatus;
      if(this.tabIndex !== 2){
        activeStatus = '';
      }
      this.$api.getApiClueList({ agentId: this.userId, page: this.page, pageSize: this.pageSize,checked: this.tabIndex,followStatus: activeStatus}).then((res) => {
        // 加载状态结束
        this.list = this.list.concat(res.data.list);
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= res.data.total) {
          this.finished = true;
        }
      }).catch(err => {
        this.loadError = true;
      });
    },
    getStatusList() {
      this.params = {
        page: 1,
        parentId: "996065045395800064",
        relationCode: "clue_status",
        pageSize: 20
      }
      this.$api.getClueStatusList(this.params).then((res) => {
        this.statusList = res.data.content.list
      });
    },
    checkStatus(item){
      this.activeStatus = item.name;
    }
  }
}
</script>
<style scoped>
.clue-wrapper {
  font-family: PingFang SC;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #f8f8f8;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
}

.tab-list {
  display: flex;
  justify-content: space-around;
  height: 0.9rem;
  background: #fff;
}

.home-tab {
  height: 0.9rem;
  line-height: 0.88rem;
  color: #666;
  font-size: 0.3rem;
  font-weight: 500;
  cursor: pointer;
}

.home-tab.active {
  border-bottom: 0.05rem solid #386dbc;
  border-radius: 0.03rem;
  color: #386dbc;
}

.second-line {
  display: flex;
  justify-content: space-around;
  height: 0.6rem;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #f8f8f8;
  font-size: 0.28rem;
  color: #999;
}
.second-line .active {
  color: #386dbc;
}

.card-list {
  padding: 0.2rem;
}

.card-list >>> .van-cell {
  padding: 0;
  background-color: transparent;
}

.clue-card {
  margin-bottom: 0.2rem;
  width: 100%;
  padding: 0.2rem 0.3rem;
  background-color: #fff;
  border-radius: 0.1rem;
}

.clue-name {
  font-size: 0.3rem;
  line-height: 0.5rem;
  margin-bottom: 0.24rem;
  color: #333;
}
.clue-message {
  display: flex;
}
.clue-label {
  min-width: 0.7rem;
  padding: 0 0.17rem;
  height: 0.32rem;
  line-height: 0.32rem;
  font-size: 0.22rem;
  color: #1499f3;
  background: rgba(28, 162, 255, 0.16);
  margin-right: 0.22rem;
  border-radius: 0.32rem;
}

.girl .clue-label {
  color: #ea4848;
  background: rgba(236, 70, 70, 0.16);
  text-align: center;
}

.clue-phone {
  display: flex;
  color: #999;
  font-size: 0.28rem;
  align-items: center;
  height: 0.32rem;
}

.clue-phone img {
  display: block;
  width: 0.24rem;
  height: 0.24rem;
  margin-right: 0.1rem;
}

.status-head {
  padding: 0 0.24rem;
  height: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e2e2e2;
  font-size: 0.28rem;
  color: #333;
}

.status-title {
  font-size: 0.24rem;
  color: #999;
  line-height: 0.62rem;
  margin: 0.02rem;
  padding: 0 0.3rem;
}
.status-list {
  padding: 0 0.3rem 0.12rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  width: 45%;
  justify-content: center;
  align-items: center;
  height: 0.55rem;
  font-size: 0.28rem;
  color: #666;
  background-color: #f8f8f8;
  border-radius: 0.06rem;
  margin-bottom: 0.17rem;
  cursor: pointer;
}
.status-item.active {
  background: #1499f3;
  color: #fff;
}
.status-footer{
  display: flex;
  height: 0.92rem;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(24,24,24,0.1000);
}
.reset,.ensure{
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 0.5rem;
  width: 1.78rem;
  font-size: 0.2rem;
  border-radius: 0.25rem;
}
.reset{
  color: #1499F3;
  border: 1px solid #1499F3;
  background-color: #fff;
}
.ensure{
  color: #fff;
  border: 1px solid #1499F3;
  background-color: #1499F3;
}
</style>