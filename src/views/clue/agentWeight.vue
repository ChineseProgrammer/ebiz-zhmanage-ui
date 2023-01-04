<template>
  <div class="user-list">
    <primaryTable :columns="columns" :data="tableList" ref="primaryTable" :isPage="false">
        </primaryTable>
  </div>
</template>

<script>

export default {
  data() {
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "代理人姓名",
          align: "center",
          minWidth: 100,
          key: "userName",
        },
        {
          title: "权重(%)",
          align: "center",
          minWidth: 100,
          key: "weight",
        },
      ],
      tableList: [],
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    let query = this.$route.query;
    this.batch = query.batch;
    this.getOneWeight();
  },
  mounted: function () {
  },
  methods: {
    getOneWeight() {
      if (this.batch) {
        this.$api.getOneWeight({ batch: this.batch }).then(res => {
          this.tableList = res.data.agentsWeight;
          this.tableList.map(one => {
            one.weight = this.toFixedTwo(one.weight / 100);
            return one;
          })
        })
      }
    },
    handleReachBottom() { },
    toFixedTwo(str) {
      const tails = 2;
      if (str === 0 || str === '0' || str === '0.0' || str === '0.00') {
        return '0.'.padEnd(tails + 2, '0');
      }
      if (!str) {
        return '-'
      }

      if (str) {
        str = str.toString();
        if (isNaN(Number(str))) {
          return '-'
        }
      }
      str = Math.round(Number(str) * 100) / 100 + '';
      let pointIndex = str.indexOf(".");
      if (pointIndex === -1) {
        return str + '.'.padEnd(tails + 1, '0');
      } else {
        let tailLength = str.split('.')[1].length;
        for (let i = 0; i < (tails - tailLength); i++) {
          str += '0';
        }
        return str;
      }
    },
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
