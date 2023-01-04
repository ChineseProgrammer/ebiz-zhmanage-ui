<template>
  <div id="statistics">
    <Row class="mt20">
      <Col span="16">
        <Card class="bordereee">
          <p slot="title">兴趣爱好分布</p>
          <div id="hobby-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee ml20">
          <p slot="title">会员等级分布</p>
          <div id="level-echarts"></div>
        </Card>
      </Col>
    </Row>
    <Row class="mt20">
      <Col span="8">
        <Card class="bordereee">
          <p slot="title">用户性别分布</p>
          <div id="gender-echarts"></div>
        </Card>
      </Col>
      <Col span="16">
        <Card class="bordereee ml20">
          <p slot="title">用户注册年龄分布</p>
          <div id="age-echarts"></div>
        </Card>
      </Col>
    </Row>
    <Row class="mt20">
      <Col span="16">
        <Card class="bordereee">
          <p slot="title">用户地域分布</p>
          <div id="region-echarts"></div>
        </Card>
      </Col>
      <Col span="8">
        <Card class="bordereee ml20">
          <p slot="title">用户保单分布</p>
          <div id="policyusers-echarts"></div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Echarts from 'echarts';
export default {
  data() {
    return {
      hobbyDistributionValue:[],
      hobbyDistributionX:[],
      hobbyChart: {},
      levelChart: {},
      userAgeData: [],
      yAgeData: [],
      userRegionData: [],
      userGenderData: [],
      yGenderData: [],
      levelData: [],
      policyUsersData: [],
      hobbyDistributionData: [], //兴趣爱好
      districtDistributionKey: [], //城市名称
      districtDistributionValue: [], //城市值
      memberDistribution: [], //会员分布
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
  created: function () {
    this.getPortrayalList();
  },
  updated() {
    settimeout(() => {
      this.hobbyChart.resize();
    });
  },
  mounted: function () {
    let that = this;
    setTimeout(() => {
      this.getLevelEcharts();
    });
    window.onresize = () => {
      that.hobbyChart.resize();
    };
  },
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
          this.userAgeData = ageDistribution;
          this.yAgeData = ageDistribution.map((el) => el.name);

          // 地区
          this.districtDistributionKey = res.content.districtDistribution.map(
            (el) => el.name
          );
          this.districtDistributionValue = res.content.districtDistribution.map(
            (el) => el.value
          );

          let genderDistribution = res.content.genderDistribution;
          this.yGenderData = genderDistribution.map((el) => el.name);
          this.userGenderData = genderDistribution;

          this.memberDistribution = res.content.memberDistribution || [
            {
              name: "暂无数据",
              value: 0,
            },
          ];

          let hobbyXData = [];
          let hobbyData = [];
          if (res.content.hobbyDistribution !== null) {
            let hobbyDistribution = res.content.hobbyDistribution;
            for (let i in hobbyDistribution) {
              hobbyXData.push(i);
              hobbyData.push(hobbyDistribution[i]);
            }
          }

          this.policyUsersData = res.content.policyDistribution;
          let xArry=[
            -1000,-900,-650,-450,-100,600,500,600,800,290,100,-200,-400,400,300,800,100,260,380
          ];
           let yArry=[
            500,600,600,330,600,620,400,310,310,560,300,340,600,610,400,600,600,560,330,390,600,600
          ];
          let colorArr = [
            "#ff7f50",
            "#87cefa",
            "#da70d6",
            "#32cd32",
            "#6495ed",
            "#ff69b4",
            "#ba55d3",
            "#cd5c5c",
            "#ffa500",
            "#40e0d0",
            "#1e90ff",
            "#ff6347",
            "#7b68ee",
            "#00fa9a",
            "#ffd700",
            "#6b8e23",
            "#ff00ff",
            "#3cb371",
            "#b8860b",
            "#30e0e0",
          ];
          console.log(res.content.hobbyDistribution);
          if(res.content.hobbyDistribution){
            res.content.hobbyDistribution.map((h)=>{
                this.hobbyDistributionX.push(h.name)
            })
             this.hobbyDistributionValue = res.content.hobbyDistribution.map(
            (el) => el.value
          );
          }
          // 兴趣爱好
         /*  this.hobbyDistributionData = res.content.hobbyDistribution.map(
            (el, index) => {
               console.log(el.value);
               if(el.value>0&&el.value<0.1){
                 console.log(el)
              el.symbolSize=1600*el.value
            } else if(0.1<=el.value&&el.value<1){
              el.symbolSize=200*el.value
            }  else if(1<=el.value&&el.value<5){
              console.log(el)
              el.symbolSize=8*el.value
            }  else if(5<=el.value&&el.value<10){
              console.log(el)
              el.symbolSize=5*el.value
            }  else if(10<=el.value&&el.value<15){
              console.log(el)
              el.symbolSize=4*el.value
            } else{
              console.log(el)
               el.symbolSize=el.value
            }
              return {
                 name: `${el.name}\n${el.value}%`,
                x: xArry[index], 
                y: yArry[index],
                symbolSize: el.symbolSize,
                 value: el.value,
                  symbol: "circle",
                itemStyle: {
                  normal: {
                    color:
                      colorArr[Math.round(Math.random() * colorArr.length - 1)],
                  },
                },
              };
            }
          ); */
          //  [[0,0,100,'Finland'],[29476,77.1,200,'France'],[37062,75.4,300,'United States']];
          let hobbyDistributionData=[]
         /*  res.content.hobbyDistribution.map((h,i)=>{
            let x,y,w;
            if(h.value<=1){
              w=h.value*10000
            } else{
              w=h.value*100
            }
            //偶数
            if(i%2 ==0){
              y=100*i*Math.floor(Math.random())
               console.log(y)
            }else{
              //基数
              y=10*aA[Math.round(Math.random() * aA.length - 1)]
            }
            x=i*i
            hobbyDistributionData[i]=[x,y,w,h.name,h.value]
            this.hobbyDistributionData.push(hobbyDistributionData[i])
          }) */
          console.log(this.hobbyDistributionData)
          this.getAgeEcharts(this.userAgeData);
          this.getRegionEcharts();
          this.getGenderEcharts();
          this.getLevelEcharts();
          this.getHobbyEcharts();
          this.getPolicyEcharts();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    getAgeEcharts(ageData) {
      const dom = document.getElementById("age-echarts");
      let ageChart = Echarts.init(dom);
      ageChart.clear();
      let that = this;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b} : {c} %",
        },
        legend: {
          top: "bottom",
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.yAgeData,
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: this.userAgeData,
            barWidth: 30,
            itemStyle: {
              normal: {
                label: {
                  formatter: "{c}" + "%",
                  show: true,
                  position: "right",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#333",
                  },
                },
                color: new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#91C9DC" },
                  { offset: 1, color: "#0AA6DC" },
                ]),
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
        1500,
        1800,
        1650,
        1800,
        4000,
      ];
      const dom = document.getElementById("region-echarts");
      let regionChart = Echarts.init(dom);
      regionChart.clear();
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: " {c}%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     start: 65,
        //     end: 85,
        //   },
        //   {
        //     type: "inside",
        //     realtime: true,
        //     start: 45,
        //     end: 85,
        //   },
        // ],
        xAxis: {
          type: "category",
          data: this.districtDistributionKey,
          axisTick: {
            alignWithLabel: true,
          }
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            barWidth: 18,
            itemStyle: {
              normal: {
                label: {
                 formatter: "{c}" + "%",
                  show: true,
                  position: "top",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#333",
                  },
                },
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" },
                ]),
              },
            },
            // emphasis: {
            //   itemStyle: {
            //     color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: "#2378f7" },
            //       { offset: 0.7, color: "#2378f7" },
            //       { offset: 1, color: "#83bff6" },
            //     ]),
            //   },
            // },
            data: this.districtDistributionValue,
          },
        ],
      };
      regionChart.setOption(option);
    },
    getGenderEcharts() {
      const dom = document.getElementById("gender-echarts");
      let genderChart = Echarts.init(dom);
      genderChart.clear();
      let that = this;
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b} : {c} %",
        },
        legend: {
          top: "bottom",
        },
        color: ["#5D9CEC", "#62C87F", "#F15755"],
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: this.yGenderData,
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: this.userGenderData,
            barWidth: 30,
            itemStyle: {
              normal: {
                label: {
                  formatter: "{c}" + "%",
                  show: true,
                  position: "right",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#333",
                  },
                },
                color: new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: "#89CD9C" },
                  { offset: 1, color: "#0BC13F" },
                ]),
              },
            },
          },
        ],
      };
      genderChart.setOption(option);
    },
    getLevelEcharts() {
      const dom = document.getElementById("level-echarts");
      this.levelChart = Echarts.init(dom);
      this.levelChart.clear();
      let that = this;
      //散点图
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        color: ["#9168F1", "#6D8CFA", "#F15755", "#3AD2DC", "#62C87F"],
        series: [
          {
            name: "会员等级分布",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: this.memberDistribution,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} {d}%",
                },
                labelLine: { show: true },
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.levelChart.setOption(option);
    },
    getHobbyEcharts() {
      const dom = document.getElementById("hobby-echarts");
      this.hobbyChart = Echarts.init(dom);
      this.hobbyChart.clear();
      var data = 
    [[0,0,100,'Finland'],[29476,77.1,200,'France'],[37062,75.4,300,'United States']];
    let that = this;
    //散点图
/* let option = {
    xAxis: {
         show : false,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
         show : false,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        scale: true
    },
    tooltip: {
        padding: 10,
                backgroundColor: '#222',
                borderColor: '#777',
                borderWidth: 1,
                formatter: function (obj) {
                  console.log(obj)
                    var value = obj.value;
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + value[3]
                        + '</div>'
                        +value[4]+"%";
                }
      },
    series: [{
        name: '1990',
        data: this.hobbyDistributionData,
        type: 'scatter',
        symbolSize: function (data) {
            return Math.sqrt(data[2]);
        },
        label: {
                normal: {
                    show: false,
                    position: 'top',
                    formatter: function (param) {
                     var strs = param.data[3].split(''); //字符串数组
                    var str = ''
                    for(var i = 0, s; s = strs[i++];) { //遍历字符串数组
                    str += s;
                    if(!(i % 3)) str += '\n'; //按需要求余
                  }
                    return str+ '\n'+param.data[4]+"%";
                },
                }
            },
        itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  console.log(params)
                  var colorList = [
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
                    },
                  ];
                  return new that.$echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                      offset: 0,
                      color: colorList[params.dataIndex]?colorList[params.dataIndex].c1:colorList[0].c1,
                    },
                    {
                      offset: 1,
                      color: colorList[params.dataIndex]?colorList[params.dataIndex].c2:colorList[0].c2,
                    },
                  ]);
                },
              },
            },
    }]
} */
 let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: " {c}%",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
          dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        }
    ],
        xAxis: {
          type: "category",
          data: this.hobbyDistributionX,
           axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          }
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            barWidth: 18,
            itemStyle: {
              normal: {
                label: {
                    rotate: 45,
                  align: 'top',
                  position: 'top',
                  distance: 8,
                  formatter: "{c}" + "%"+"\n",
                  show: false,
                  offset:"10",
                  textStyle: {
                    fontWeight: "bolder",
                    fontSize: "12",
                    color: "#333",
                  },
                  
                },
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" },
                ]),
              },
            },
            // emphasis: {
            //   itemStyle: {
            //     color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //       { offset: 0, color: "#2378f7" },
            //       { offset: 0.7, color: "#2378f7" },
            //       { offset: 1, color: "#83bff6" },
            //     ]),
            //   },
            // },
            data: this.hobbyDistributionValue,
          },
        ],
      };
      this.hobbyChart.setOption(option);
    },
    getPolicyEcharts() {
      const dom = document.getElementById("policyusers-echarts");
      let policyUsersChart = Echarts.init(dom);
      policyUsersChart.clear();
      let that = this;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          top: "bottom",
          orient: "vertical",
          selectedMode: false,
          x: "left",
        },
        series: [
          {
            name: "用户保单分布",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "50%"],
            label: {
              //展示文本设置
              normal: {
                show: true, //展示
                formatter: "{c}" + "%",
                position: "outside", // outside表示文本显示位置为外部
              },
              emphasis: {
                //文本样式
                show: true, //展示
                textStyle: {
                  //文本样式
                  fontSize: "14",
                  fontWeight: "600",
                },
              },
            },
            labelLine: {
              normal: {
                show: true, //引导线显示
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  var colorList = [
                    {
                      c1: "#FDD47A",
                      c2: "#FBA043",
                    },
                    {
                      c1: "#F77F88",
                      c2: "#F06673",
                    },
                    {
                      c1: "#70C62F",
                      c2: "#85EA38",
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
  /deep/ .ivu-card-body {
    padding: 0;
  }
}
// .ivu-card {
//   background-color: #f2f2f2 !important;
// }
</style>
