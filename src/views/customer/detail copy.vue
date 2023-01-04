<template>
  <div id="statistics">
    <Row class="mt20">
      <Col span="8" :gutter="16">
        <Card class="bordereee">
          <p slot="title">用户年龄分布</p>
          <div id="age-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee  ml20">
          <p slot="title">用户地域分布</p>
          <div id="region-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee  ml20">
          <p slot="title">用户性别分布</p>
          <div id="gender-echarts"></div>
        </Card>
      </Col>
    </Row>
    <Row class="mt20">
      <Col span="8">
        <Card class="bordereee">
          <p slot="title">会员等级分布</p>
          <div id="level-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee ml20">
          <p slot="title">兴趣爱好分布</p>
          <div id="hobby-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee ml20">
          <p slot="title">保单用户分布</p>
          <div id="policyusers-echarts"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userAgeData: [],
      userRegionData: [],
      userGenderData: [],
      levelData: [],
      policyUsersData: [],
    };
  },
  beforeCreate() {
    this.$nextTick(() => {
      document
        .querySelector(".ivu-card")
        .setAttribute("style", "background-color:#F2F2F2");
    });
  },
  beforeDestroy() {
    document.querySelector(".ivu-card").removeAttribute("style");
  },
  created: function() {
    this.getPortrayalList();
  },
  mounted: function() {},
  watch: {},
  methods: {
    beforeUploadHandler() {
      // debugger;
      document
        .querySelector(".ivu-card")
        .setAttribute("style", "background-color:#F2F2F2");
    },
    getPortrayalList() {
      this.$api.getPortrayal({}).then((res) => {
        if (res.result == "0") {
          let ageDistribution = res.content.ageDistribution;
          for (let i in ageDistribution) {
            let obj = {
              name: i,
              value: ageDistribution[i],
            };
            this.userAgeData.push(obj);
          }

          let districtDistribution = res.content.districtDistribution;
          let city = [];
          let data = [];
          for (let i in districtDistribution) {
            city.push(i);
            data.push(districtDistribution[i]);
          }

          let genderDistribution = res.content.genderDistribution;
          for (let i in genderDistribution) {
            let obj = {
              name: i,
              value: genderDistribution[i],
            };
            this.userGenderData.push(obj);
          }

          if (res.content.memberDistribution !== null) {
            let memberDistribution = res.content.memberDistribution;
            for (let i in memberDistribution) {
              let obj = {
                name: i,
                value: memberDistribution[i],
              };
            }
          } else {
            let obj = {
              name: "暂无数据",
              value: 0,
            };
            this.levelData.push(obj);
          }

          let hobbyXData = [];
          let hobbyData = [];
          if (res.content.hobbyDistribution !== null) {
            let hobbyDistribution = res.content.hobbyDistribution;
            for (let i in hobbyDistribution) {
              hobbyXData.push(i);
              hobbyData.push(hobbyDistribution[i]);
            }
          }

          let policyDistribution = res.content.policyDistribution;
          for (let i in policyDistribution) {
            let obj = {
              name: i,
              value: policyDistribution[i],
            };
            this.policyUsersData.push(obj);
          }

          this.getAgeEcharts(this.userAgeData);
          this.getRegionEcharts();
          this.getGenderEcharts();
          this.getLevelEcharts();
          this.getHobbyEcharts(hobbyXData, hobbyData);
          this.getPolicyEcharts();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    getAgeEcharts(ageData) {
      const dom = document.getElementById("age-echarts");
      let ageChart = this.$echarts.init(dom);
      ageChart.clear();
      let that = this;
      let option = {
        // title: {
        //   text: "用户年龄分布",
        //   top: "center",
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            name: "姓名",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            data: ageData,
            label: {
              show: false,
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      c1: "#fce5ca",
                      c2: "#FF9D62",
                    },
                    {
                      c1: "#E274E9",
                      c2: "#9168F1",
                    },
                    {
                      c1: "#508DFF",
                      c2: "#26C5FE",
                    },
                    {
                      c1: "#63E587",
                      c2: "#5FE2E4",
                    },
                    {
                      c1: "#41C9C2",
                      c2: "#23A3CE",
                    },
                    // {
                    //   c1: "#C284F9",
                    //   c2: "#A996FD",
                    // },
                  ];
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                  /*  return colorList[params.dataIndex]*/
                },
              },
            },
          },
        ],
      };
      ageChart.setOption(option);
    },
    getRegionEcharts() {
      let cities = [
        "北京",
        "上海",
        "深圳",
        "广州",
        "苏州",
        "杭州",
        "南京",
        "福州",
        "青岛",
        "济南",
        "长春",
        "大连",
        "温州",
        "郑州",
        "武汉",
        "成都",
        "东莞",
        "沈阳",
        "烟台",
      ];
      let data = [
        5000,
        4000,
        3000,
        2500,
        2000,
        2000,
        2500,
        1800,
        4000,
        3100,
        2000,
        2000,
        1800,
        2000,
        1500,
        1500,
        1600,
        1500,
        1500,
        1500,
        1500,
      ];
      const dom = document.getElementById("region-echarts");
      let regionChart = this.$echarts.init(dom);
      regionChart.clear();
      let option = {
        // title: {
        //   text: "用户地域分布",
        //   left: "center",
        // },
        tooltip: {
          show: true,
          formatter: function(params) {
            var id = params.dataIndex;
            return cities[id] + "<br>值：" + data[id];
          },
        },
        angleAxis: {
          type: "category",
          data: cities,
        },
        radiusAxis: {},
        polar: {},
        color: ["#FFA200"],
        series: [
          {
            type: "bar",
            data: data,
            coordinateSystem: "polar",
            name: "值",
            stack: "值",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#F885E1" },
                { offset: 0.5, color: "#F643D1" },
                { offset: 1, color: "#F407C4" },
              ]),
            },
          },
        ],
      };
      regionChart.setOption(option);
    },
    getGenderEcharts() {
      const dom = document.getElementById("gender-echarts");
      let genderChart = this.$echarts.init(dom);
      genderChart.clear();
      let that = this;
      let option = {
        // title: {
        //   text: "用户性别分布",
        //   left: "center",
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: false,
        },
        calculable: true,
        series: [
          {
            name: "用户性别分布",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            roseType: "radius",
            sort: "ascending",
            label: {
              show: false,
              position: "center",
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      c1: "#63E587",
                      c2: "#5FE2E4",
                    },
                    {
                      c1: "#41C9C2",
                      c2: "#23A3CE",
                    },
                    {
                      c1: "#C284F9",
                      c2: "#A996FD",
                    },
                  ];
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                  /*  return colorList[params.dataIndex]*/
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: this.userGenderData,
          },
        ],
      };
      genderChart.setOption(option);
    },
    getLevelEcharts() {
      const dom = document.getElementById("level-echarts");
      let levelChart = this.$echarts.init(dom);
      levelChart.clear();
      let that = this;
      let option = {
        // title: {
        //   text: "会员等级分布",
        //   left: "center",
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          top: "bottom",
          data: ["睿华会员", "悦华会员", "芳华会员", "年华会员", "商城会员"],
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            roseType: "area",
            label: {
              show: false,
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      c1: "#E274E9",
                      c2: "#9168F1",
                    },
                    {
                      c1: "#62B1F8",
                      c2: "#6D8CFA",
                    },
                    {
                      c1: "#FB8468",
                      c2: "#FB719B",
                    },
                    {
                      c1: "#42CAC1",
                      c2: "#23A2CF",
                    },
                    {
                      c1: "#F885E1",
                      c2: "#F407C4",
                    },
                    {
                      c1: "#7FA4FC",
                      c2: "#3383EE",
                    },
                    {
                      c1: "#67EBE9",
                      c2: "#77BBF9",
                    },
                    {
                      c1: "#fce5ca",
                      c2: "#FF9D62",
                    },
                  ];
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                  /*  return colorList[params.dataIndex]*/
                },
              },
            },
            data: [
              { value: 100, name: "睿华会员" },
              { value: 50, name: "悦华会员" },
              { value: 150, name: "芳华会员" },
              { value: 250, name: "年华会员" },
              { value: 200, name: "商城会员" },
            ],
          },
        ],
      };
      levelChart.setOption(option);
    },
    getHobbyEcharts(hobbyXData, hobbyData) {
      const dom = document.getElementById("hobby-echarts");
      let hobbyChart = this.$echarts.init(dom);
      hobbyChart.clear();
      let XData = [
        "其他",
        "演讲",
        "绘画",
        "模特",
        "读书",
        "摄影",
        "书法",
        "影视",
        "旅行",
        "音乐",
        "运动",
      ];
      let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 190];
      let option = {
        // title: {
        //   text: "兴趣爱好分布",
        //   left: "center",
        // },
        legend: {
          top: "bottom",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          axisLabel: {
            interval: 0,
          },
          type: "category",
          data: XData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            // emphasis: {
            //   itemStyle: {
            //     color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: "#2378f7" },
            //       { offset: 0.7, color: "#2378f7" },
            //       { offset: 1, color: "#83bff6" },
            //     ]),
            //   },
            // },
            data: data,
          },
        ],
      };
      hobbyChart.setOption(option);
    },
    getPolicyEcharts() {
      const dom = document.getElementById("policyusers-echarts");
      let policyUsersChart = this.$echarts.init(dom);
      policyUsersChart.clear();
      let that = this;
      let option = {
        // title: {
        //   text: "保单用户分布",
        //   left: "center",
        // },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            name: "保单用户分布",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                  ];
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex].c2,
                    },
                  ]);
                  /*  return colorList[params.dataIndex]*/
                },
              },
            },
            data: this.policyUsersData,
          },
        ],
      };
      policyUsersChart.setOption(option);
    },
  },
};
</script>
<style lang="less" scoped>
#statistics {
  #gender-echarts {
    height: 330px;
    width: 100%;
  }
  #region-echarts {
    height: 330px;
    width: 100%;
  }
  #age-echarts {
    height: 330px;
    width: 100%;
  }
  #level-echarts {
    height: 330px;
    width: 100%;
  }
  #hobby-echarts {
    height: 330px;
    width: 100%;
  }
  #policyusers-echarts {
    height: 330px;
    width: 100%;
  }
  .bordereee {
    background: #ffffff;
    border: 1px solid #ddd;
  }
}
// .ivu-card {
//   background-color: #f2f2f2 !important;
// }
</style>
