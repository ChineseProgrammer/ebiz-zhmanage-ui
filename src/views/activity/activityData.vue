<template>
  <div class="activityData">
    <Card>
      <Row>
        <Col span="6">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="所属公司机构">
            <Select clearable filterable style="width: 162px" placeholder="请选择所属公司机构" v-model="deptCode">
              <Option v-for="item in companyList" :value="item.creditCode" :key="item.creditCode">{{ item.orgName }}
              </Option>
            </Select>
          </FormItem>
        </Form>
        </Col>
        <Col span="13" style="text-align:right">
        <Button style="float:right" type="text" @click="showFilter=!showFilter">筛选
          <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
        </Button>
        <div style="float:right;margin-top:0.3rem" v-show="showFilterDate">
          <span>
            <b>活动类别：</b>{{activityFirstCategoryN}};
          </span>
          <span v-show="activitySecondCategoryN">
            <b>细分类别：</b>{{activitySecondCategoryN}};
          </span>
          <span v-show="activityThemeN&&activityThemeN[0]">
            <b>活动主题：</b>
            <span v-for="(q,index) in activityThemeN" :key="index">
              {{q}}
            </span>
          </span>
          <Icon style="cursor:pointer" @click="delFilter()" type="md-close-circle" />
        </div>
        </Col>
        <Col span="3">
        <DatePicker :clearable="false" v-model="timeList" type="daterange" @on-change="onDatePickerChange"
          :options="options2" placement="bottom-end" placeholder="请选择时间"></DatePicker>
        </Col>
        <Col span="2">
        <i-col class="float-right">
          <Button type="primary" @click="searchAll(1)" style="margin-left: 10px">{{ $t("query") }}</Button>
        </i-col>
        </Col>
      </Row>
    </Card>
    <Card v-show="showFilter" style="background: #eee;">
      <Card>
        <Form inline :label-width="100">
          <FormItem style="margin: 0" label="添加活动类别">
            <Select clearable @on-change="queryChildInfo(activityFirstCategory,'',parentRelationCodeOne)" filterable
              style="width: 162px" placeholder="请选择活动类别" v-model="activityFirstCategory">
              <Option v-for="item in listOne" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Card>
      <Card style="margin-top: 15px">
        <Form inline :label-width="100">
          <FormItem style="margin: 0" label="添加细分类别">
            <Select @on-change="queryChildInfo('',activitySecondCategory,parentRelationCodeTwo)" clearable
              :disabled="!activityFirstCategory" filterable style="width: 162px" placeholder="请选择细分类别"
              v-model="activitySecondCategory">
              <Option v-for="item in divisionList" :value="item.id" :key="item.id">{{ item.name }}&nbsp;&nbsp;</Option>
            </Select>
          </FormItem>
        </Form>
      </Card>
      <Card style="margin-top: 15px">
        <Form inline :label-width="100">
          <FormItem style="margin: 0" label="添加活动主题">
            <Select :disabled="!activitySecondCategory" clearable v-model="activityTheme" filterable multiple
              @on-create="handleCreate">
              <Option v-for="item in activityNameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
            <!--  {{activityTheme}} -->
            <!--  <Input
             :disabled="!activitySecondCategory"
             style="width:162px"
            v-model="activityTheme"
            placeholder="请输入活动主题"
            :maxlength="100"
          /> -->
          </FormItem>
        </Form>
      </Card>
      <Button style="margin: 15px 9px 0 0px;" @click="confirmFilter()" type="primary">确定</Button>
      <Button style="margin-top: 15px;" @click="cancelFilter()">取消</Button>
    </Card>
    <!--  <Row style="padding:20px">
         <Form inline :label-width="100">
           <Card>
          <FormItem  label="添加活动类别">
            <Select
              clearable
              filterable
              style="width:162px"
              placeholder="请选择所属公司机构"
              v-model=""
            >
              <Option
                v-for="item in companyList"
                :value="item.id"
                :key="item.id"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
          </Card>
          </Form>
      </Row> -->
    <Card style="margin-top: 15px">
      <div class="mb-10">
        <Row>
          <Col span="24">
          <div id="charts" style="width: 85%; height: 400px"></div>
          </Col>
        </Row>
      </div>
      <div>
        <Button v-if="isAdminCenter || button.activityData_export" type="primary" style="margin-bottom: 10px"
          @click="exportAll">导出</Button>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @on-change="changePage" class="wholeTable">
        </primaryTable>
      </div>

      <!--<urlTable :configure='configure' ref='signTable'> </urlTable>-->
    </Card>
  </div>
</template>

<script>
const getEchart = () => import('echarts')
export default {
  data() {
    return {
      timeList: [],
      options2: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
        shortcuts: [
          {
            text: '一周',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '一个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '三个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      queryDate: '',
      parentRelationCodeOne: "",
      parentRelationCodeTwo: "",
      showFilterDate: false,
      showFilter: false,
      isAdminCenter: false,
      button: this.$store.state.app.button,
      activityNameList: [
      ],
      /*  //查询结束时间	
       queryEndDate:"",
       //结束开始时间
       queryStartDate:"", */
      activityFirstCategory: "",
      //二级
      activitySecondCategory: "",
      activityTheme: [],
      activityFirstCategoryN: "",
      //二级
      activitySecondCategoryN: "",
      activityThemeN: [],
      listOne: [],
      queryDTO: {
        //一级分类
        activityFirstCategory: "",
        //二级
        activitySecondCategory: "",
        activityTheme: [],
      },
      divisionList: [],
      deptCode: "",
      params: {
        pageSize: 10,
        page: 1,
      },
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      roleList: [],
      companyList: [],
      deptList: [],
    };
  },
  methods: {
    delFilter() {
      this.showFilterDate = false
      this.queryDTO.activityFirstCategory = ""
      this.queryDTO.activitySecondCategory = ""
      this.queryDTO.activityTheme = []
      this.activityFirstCategory = ""
      this.activitySecondCategory = ""
      this.activityTheme = []
      this.activityFirstCategoryN = ""
      this.activitySecondCategoryN = ""
      this.activityThemeN = []
    },
    exportAll() {
      this.$api
        .activityexport(this.queryDTO)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "活动数据信息.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    onDatePickerChange(val) {
      this.queryDTO.queryStartDate = val[0]
      this.queryDTO.queryEndDate = val[1]
    },
    confirmFilter() {
      if (this.activityFirstCategory) {
        //活动类别
        this.listOne.map((i) => {
          if (this.activityFirstCategory == i.id) {
            //接口需要传递code，页面需要显示中文
            this.activityFirstCategoryN = i.name
            this.activityFirstCategory = i.code
          }
        })
        if (this.activitySecondCategory) {
          //细分类别中文
          this.divisionList.map((i) => {
            if (this.activitySecondCategory == i.id) {
              //接口需要传递code，页面需要显示中文
              this.activitySecondCategoryN = i.name
              this.activitySecondCategory = i.code
            }
          })
        } else {
          this.activitySecondCategoryN = ""
        }
        this.activityThemeN = []
        // console.log(this.activityTheme)  
        //  console.log(this.activityThemeN)  
        if (this.activityTheme[0]) {
          this.activityTheme.map((a) => {
            this.activityNameList.map((d) => {
              if (a == d.name) {
                if (this.activityThemeN.indexOf(d.name) == -1) {
                  this.activityThemeN.push(d.name)
                }
              }
            })
          })
        } else {
          this.activityThemeN = []
        }
        this.showFilter = false
        this.showFilterDate = true
        //将这些数据赋值给查询图表的参数对象里面
        this.queryDTO.activityFirstCategory = this.activityFirstCategory
        this.queryDTO.activitySecondCategory = this.activitySecondCategory
        this.queryDTO.activityTheme = this.activityTheme
      }
    },
    cancelFilter() {
      this.activityFirstCategory = "",
        this.activitySecondCategory = "",
        this.activityTheme = [],
        this.showFilter = !this.showFilter
    },
    handleCreate(val) {
      this.activityNameList.push({
        value: val,
        label: val,
      });
    },
    changeSearchParams2(val) {
      if (val == "02") {
        this.activityNameList = [
          {
            label: "健步走",
            value: "walking"
          },
          {
            label: "插花",
            value: "flower"
          },
          {
            label: "摄影",
            value: "photography"
          },
          {
            label: "唱歌",
            value: "sing"
          },
        ];
      } else if (val == "01") {
        this.activityNameList = [
          {
            label: "爱国月",
            value: "01"
          },
        ];
      } else if (val == "03") {
        this.activityNameList = [
          {
            label: "书画",
            value: "书画"
          },
          {
            label: "古玩圈",
            value: "古玩圈"
          },
          {
            label: "美搭",
            value: "美搭"
          },
          {
            label: "茶艺",
            value: "茶艺"
          },
          {
            label: "瑜伽",
            value: "瑜伽"
          },
          {
            label: "阅读",
            value: "阅读"
          },
          {
            label: "棋牌",
            value: "棋牌"
          },
          {
            label: "乐器",
            value: "乐器"
          }
        ];
      } else if (val == "04") {
        this.activityNameList = [
          {
            label: "摄影旅拍",
            value: "摄影旅拍"
          },
          {
            label: "红色记忆",
            value: "红色记忆"
          },
          {
            label: "美食旅行",
            value: "美食旅行"
          },
          {
            label: "康养体验",
            value: "康养体验"
          },
          {
            label: "旅居自由",
            value: "旅居自由"
          },
          {
            label: "温泉疗养",
            value: "温泉疗养"
          },
          {
            label: "徒步远足",
            value: "徒步远足"
          },
          {
            label: "天然氧吧",
            value: "天然氧吧"
          },
          {
            label: "寺庙修禅",
            value: "寺庙修禅"
          },
          {
            label: "深度人文",
            value: "深度人文"
          },
          {
            label: "远古追溯",
            value: "远古追溯"
          },
          {
            label: "茶艺制扇",
            value: "茶艺制扇"
          },
          {
            label: "制笔打墨",
            value: "制笔打墨"
          },
          {
            label: "素描花艺",
            value: "素描花艺"
          },
          {
            label: "中医文化",
            value: "中医文化"
          },
          {
            label: "自然探索",
            value: "自然探索"
          },
          {
            label: "游轮帆船",
            value: "游轮帆船"
          },
          {
            label: "乡村体验",
            value: "乡村体验"
          }
        ];
      } else if (val == "05") {
        this.activityNameList = [
          {
            label: "齿科义诊",
            value: "07"
          },
        ];
      }
      //清空活动主题
      //this.activityTheme=[]
    },
    //右上角查询
    searchAll() {
      this.queryDTO.deptCode = this.deptCode
      // console.log(this.queryDTO.queryEndDate)
      //   console.log(this.queryEndDate)
      /*  this.queryDTO.queryEndDate=this.queryEndDate
       this.queryDTO.queryStartDate=this.queryStartDate */
      this.statistics()
      this.search()
    },
    statistics() {
      this.$api.statistics(this.queryDTO).then((res) => {
        //  console.log(res)
        let nameList = [], seriesList = []
        if (res.data) {
          res.data.map((n) => {
            nameList.push(n.name)
            n.data = n.dataList;
            // n.stack="总量";
            n.type = "line"
            /* n.smooth= 0.6 */
          })
        }
        seriesList = res.data

        getEchart().then(echarts => {
          var businessSourcePersonLevel = echarts.init(
            document.getElementById("charts")
          );
          window.onresize = function () {
            businessSourcePersonLevel.resize();
          };
          businessSourcePersonLevel.clear();
          let option = {
            title: {
              text: "用户综合统计",
            },
            tooltip: {
              trigger: "axis",
            },
            dataZoom: [
              {
                show: true,
                realtime: true,
                start: 0,
                end: 100
              },
              {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
              }
            ],
            legend: {
              data: nameList,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: (res.data && res.data[0]) ? res.data[0].dateList : [],
            },
            yAxis: {
              type: "value",
            },
            series: seriesList
          };
          businessSourcePersonLevel.setOption(option);
        })
      });
    },

    //更改启用/停用状态
    async updateState(row) {
      let self = this;
      if (row.status == 1) {
        row.status = 0;
        var text = this.$t("enable");
      } else {
        row.status = 1;
        var text = "停用";
      }
      //判断当前会议室启用状态  还是停用状态
      let params = row;
      let result = await this.$api.user_info({ userId: row.id });
      params.userRoleInSyses = result.content.userRoleInSyses;
      this.$api
        .updateUser(params)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success(text + this.$t("success"));
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //表格的查询
    search(page) {
      let queryDTO = JSON.parse(JSON.stringify(this.queryDTO))
      queryDTO.page = page ? page : 1;
      queryDTO.pageSize = this.params.pageSize
      this.getActivityList(queryDTO);
    },
    //获取活动类别下拉
    queryRelationInfo(option) {
      this.$api.queryRelationInfo({
        relationCode: 'series'
      }).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          // console.log(res)
          this.listOne = res.data.dictionaryResDTOList || []
          this.parentRelationCodeOne = res.data.relationCode
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获取细分类别和活动主题下拉
    queryChildInfo(id, id2, parentRelationCode) {
      // console.log(id)
      //  console.log(id2)
      if ((!id && (!id2)) || (!parentRelationCode)) return
      this.$api.queryChildInfo({
        "parentId": id || id2,
        "parentRelationCode": parentRelationCode
      }).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          if (id) {
            this.divisionList = res.data.dictionaryList || []
            this.parentRelationCodeTwo = res.data.relationCode
          } else {
            this.activityNameList = res.data.dictionaryList || []
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //加载用户列表e
    getActivityList(option) {
      this.$api.getActivityList(option).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
          for (var i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].userName == "adminCenter") {
              this.tableList[i]._disabled = true;
            }
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获得角色·
    getRoleAllList() {
      this.$api.getRoleAllList({ roleStatus: 0 }).then((res) => {
        if (res.respCode == "0") {
          this.roleList = res.data;
        }
      });
    },
    changePage(page) {
      // console.log( this.params)
      // console.log( page)
      this.params.page = page;
      this.search(page)
    },
    addUser(formData) {
      let props = {},
        title = this.$t("addUser");
      props.deptList = this.deptList;
      props.roleList = this.roleList;
      props.companyList = this.companyList;
      if (formData) {
        props.formValidate = formData;
        title = this.$t("editUser");
      }
      let self = this;
      var params = {
        self: this,
        title: title,
        width: 800, //默认600
        props: props,
        success: (res) => {
          if ((res = 1)) {
            this.params.page = 1;
            this.params.userName = "";
            this.params.realName = "";
          }
          this.search(1);
        },
        cancel: () => { },
      };
      this.$util.openModelForm(params, this);
    },
    async editUser(row) {
      let params = row;
      let result = await this.$api.user_info({ userId: row.id });
      for (let item of result.content.userRoleInSyses) {
        params.roleId = item.roleId;
        params.deptId = item.deptId;
      }
      this.addUser(params);
    },
    getOrgDepList() {
      this.$api.getOrgDepList({ systemType: 0 }).then((res) => {
        if (res.respCode == 0 || res.result == 0) {
          this.depTreeData = this.getTreeOrgDept(res.data);
        } else {
          this.$Message.error(res.message ? res.message : res.resultMessage);
        }
      });
    },
    /*
              生成树形组织结构(适用于 返回不是树形数据)
            */

    getTreeOrgDept(list, treeData, id) {
      let itemArr = [];
      let that = this;
      filter(itemArr, null);
      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }
      //遍历过滤
      function filter(tree, id) {
        let array = list.filter((item) => {
          //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
          if (id == null) {
            item.title = item.deptName;
          }
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        //依次遍历
        if (array.length > 0) {
          get(array);
        }
      }

      return itemArr;
    },
    //获取公司机构
    getCompanyList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getCompanyList({}).then((res) => {
        if (res.respCode == "0") {
          this.companyList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获取部门
    getDeptList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getDeptController({}).then((res) => {
        if (res.respCode == "0") {
          this.deptList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置密码
    resetPwd(row) {
      let data = {
        userId: row.id,
      };
      let that = this;
      this.$Modal.confirm({
        title: "确认重置",
        content: "<p>确认对当前帐号重置密码？重置后恢复为默认密码！</p>",
        onOk: () => {
          that.$api.resetPassword(data).then((res) => {
            if (res.respCode == "0") {
              that.$Message.success("重置密码成功");
            } else {
              that.$Message.error(res.message);
            }
          });
        },
      });
    },
  },
  created: function () {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.timeList = [start, end];
    this.queryDTO.queryStartDate = this.$util.dateFormat2(start, "yyyy-MM-dd")
    this.queryDTO.queryEndDate = this.$util.dateFormat2(end, "yyyy-MM-dd")
    this.search(1);
    //调用部门
    // this.getOrgDepList();
    this.getRoleAllList();
    this.getCompanyList();
    this.getDeptList();
  },
  watch: {
    'activityFirstCategory'(o) {
      if (!o) {
        this.activitySecondCategory = ""
        this.activityTheme = []
      }
    },
    'activitySecondCategory'(o) {
      /* if(!o){ */
      this.activityTheme = []
      /* } */
    }
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
  computed: {
    columns(vue) {
      return [
        {
          title: "客户姓名",
          align: "center",
          minWidth: 100,
          key: "customerName",
        },
        {
          title: "注册年龄",
          align: "center",
          minWidth: 100,
          key: "customerAge",
        },
        {
          title: "性别",
          align: "center",
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          key: "customerGender",
          // render: (h, params) => {
          //   let label = "";
          //   this.roleList.map((item) => {
          //     if (item.id == params.row.userRoleInSyses[0].roleId) {
          //       label = item.roleName;
          //     } else if (params.row.userRoleInSyses[0].roleId == "0") {
          //       label = "超级管理员";
          //     }
          //   });
          //   return h("div", label);
          // },
        },
        {
          title: "手机号",
          align: "center",
          minWidth: 120,
          key: "customerPhone",
          width: 150,
          // render: (h, params) => {
          //   let label = "";
          //   this.companyList.map((item) => {
          //     if (item.id == params.row.userRoleInSyses[0].deptId) {
          //       label = item.deptName;
          //     } else if (params.row.userRoleInSyses[0].roleId == "0") {
          //       label = "超级管理员";
          //     }
          //   });
          //   return h("div", label);
          // },
        },
        {
          title: "会员等级",
          align: "center",
          // slot:"alarm",
          minWidth: 110,
          key: "customerMemberLevel",
        },
        {
          title: "俱乐部注册时间",
          align: "center",
          // slot:"alarm",
          minWidth: 150,
          key: "clubRegisterDate",
          render: (h, params) => {
            return h("div", this.$util.datetimeFormat(params.row.clubRegisterDate));
          },
        },
        {
          title: "会员属性",
          align: "center",
          // slot:"alarm",
          minWidth: 90,
          key: "memberLevelType",
        },
        {
          title: "活动类别",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "activityFirstCategory",
        },
        {
          title: "类型细分",
          align: "center",
          // slot:"alarm",
          minWidth: 100,
          key: "activitySecondCategory",
        },
        {
          title: "活动主题",
          align: "center",
          minWidth: 100,
          key: "activityTheme",
        },
        {
          title: "活动场次",
          align: "center",
          minWidth: 100,
          key: "activityAmount",
        },
        {
          title: "活动地点",
          align: "center",
          minWidth: 100,
          key: "activityVenue",
        },
        {
          title: "活动开始时间",
          align: "center",
          minWidth: 100,
          key: "activityStartDate",
          render: (h, params) => {
            return h("div", this.$util.datetimeFormat(params.row.activityStartDate));
          },
        },
        {
          title: "活动结束时间",
          align: "center",
          minWidth: 100,
          key: "activityEndDate",
          render: (h, params) => {
            return h("div", this.$util.datetimeFormat(params.row.activityEndDate));
          },
        },
        {
          title: "报名时间",
          align: "center",
          minWidth: 100,
          key: "activityRegisterDate",
          render: (h, params) => {
            return h("div", this.$util.datetimeFormat(params.row.activityRegisterDate));
          },
        },
        {
          title: "签到时间",
          align: "center",
          minWidth: 100,
          key: "checkInDate",
          render: (h, params) => {
            return h("div", this.$util.datetimeFormat(params.row.checkInDate));
          },
        },
        {
          title: "机构名称",
          align: "center",
          minWidth: 200,
          key: "orgName",
        },
        {
          title: "推广人",
          align: "center",
          minWidth: 100,
          key: "agentName",
        },
      ];
    },
  },
  mounted: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.statistics();
    this.queryRelationInfo()
  },
  filters: {},
};
</script>

<style lang="less">
.activityData {
  .ivu-btn-text:focus,
  .ivu-btn-text:focus {
    box-shadow: 0 0 0 0px #fff !important;
  }
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
}
</style>
