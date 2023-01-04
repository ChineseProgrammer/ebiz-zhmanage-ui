<template>
  <div id="customer-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form
        class="box--flex"
        ref="formInline"
        :rules="ruleValidate"
        :model="searchCustomer"
        inline
        :label-width="100"
      >
        <!-- <Row class="mt--20"> -->
        <i-col span="6">
          <!-- <FormItem prop="name" label="姓名/用户账号"> -->
           <FormItem prop="name" label="用户账号">
            <Input
              v-model="searchCustomer.name"
              placeholder="请输入"
              style="width: 160px"
            />
          </FormItem>
        <!-- </i-col>
         <i-col span="6"> -->
          <FormItem label="来源">
            <Cascader
              :data="sourceList"
              style="width: 160px"
              placeholder="请选择"
              v-model="searchCustomer.original"
            ></Cascader>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem prop="phone" label="联系电话">
            <Input
              v-model="searchCustomer.phone"
              placeholder="请输入"
              style="width: 160px"
            />
          </FormItem>
        <!-- </i-col>
        <i-col span="6"> -->
          <FormItem label="状态">
            <Select
              filterable
              clearable
              v-model="searchCustomer.status"
              style="width: 160px"
              placeholder="请选择"
            >
              <Option value="0">启用</Option>
              <Option value="1">停用</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem label="年龄">
            <InputNumber
              :min="null"
              v-model="searchCustomer.startAge"
              placeholder="请输入"
              style="width: 75px"
            />—<InputNumber
              :min="null"
              v-model="searchCustomer.endAge"
              placeholder="请输入"
              style="width: 75px"
            />
          </FormItem>
        </i-col>
       
        
        <i-col span="6">
          <FormItem label="会员等级">
            <Select
              filterable
              clearable
              v-model="searchCustomer.memberLevelCode"
              style="width: 160px"
              placeholder="请选择"
            >
              <!-- <Option
                  v-for="item in memberLevelList"
                  :value="item.memberLevelCode"
                  :key="item.memberLevelCode"
                  >{{ item.memberLevelName }}</Option
            >-->
              <Option value="4">睿华会员</Option>
              <Option value="3">悦华会员</Option>
              <Option value="2">芳华会员</Option>
              <Option value="1">年华会员</Option>
            </Select>
          </FormItem>
        </i-col>
        <i-col span="6">
          <FormItem prop="agentName" label="推广人姓名">
            <Input
              v-model="searchCustomer.agentName"
              placeholder="请输入"
              style="width: 160px"
            />
          </FormItem>
        </i-col>
          <!-- 临时删除 -->
        <!-- <i-col span="6">
          <FormItem prop="email" label="邮箱">
            <Input
              v-model="searchCustomer.email"
              placeholder="请输入"
              style="width: 160px"
            />
          </FormItem>
        </i-col> -->
         <!-- 临时删除 -->
        <!-- <i-col span="6">
          <FormItem label="地域">
            <Cascader
              :data="cityList"
              :change-on-select="changeOnSelect"
              @on-visible-change="handleChangeOnSelect"
              style="width: 160px"
              placeholder="请选择"
              v-model="searchCustomer.cityData"
              :load-data="loadData"
            ></Cascader>
          </FormItem>
        </i-col> -->
        <i-col span="6">
          <FormItem label="推广人管理机构">
            <Select
              clearable
              filterable
              style="width: 162px"
              placeholder="请选择"
              v-model="searchCustomer.agentOrgCode"
            >
              <Option
                v-for="item in companyList"
                :value="item.creditCode"
                :key="item.creditCode"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
        </i-col>
        <i-col span="6">
        <FormItem prop="agentPhone" label="推广人手机号">
          <Input
            v-model="searchCustomer.agentPhone"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        </i-col>
        <i-col span="6">
        <FormItem prop="agentPhone" label="时间阶段">
          <DatePicker
            type="datetimerange"
            placeholder="请选择"
            v-model="searchCustomer.agentTime"
            @on-change="timeChange"
            style="width: 160px"
          ></DatePicker>
        </FormItem>
        </i-col>

        <i-col span="4">
        <div class="search-btn">
          <Button @click="changeFormSearch" type="primary" class="ml8"
            >查询</Button
          >
          <Button @click="reset()">重置</Button>
        </div>
        </i-col>
        <!-- </Row> -->
      </Form>
    </div>
    <Divider class="mv10" />
    <!-- 列表 -->
    <div>
      <Button
        v-if="isAdminCenter || button.customer_export"
        type="primary"
        style="margin-bottom: 10px"
        @click="exportAll"
        >导出</Button
      >
      <primaryTable
        :columns="columns"
        :data="tableList"
        :current.sync="paginationCustomer.page"
        ref="teamTable"
        :total="paginationCustomer.total"
        :pageSize="paginationCustomer.pageSize"
        @on-change="fetchData"
        @on-page-size-change="beForePagination(1, ...arguments)"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentNameList:{},
      changeOnSelect: "",
      changeOnSelect2: "",
      data4: [
        {
          value: "beijing",
          label: "北京",
          children: [],
          loading: false,
        },
        {
          value: "hangzhou",
          label: "杭州",
          children: [],
          loading: false,
        },
      ],
      ruleValidate: {
        name: [
          {
            pattern: "^([a-zA-Z .]{1,100}|[\u4e00-\u9fa5 .]{1,100})$",
            message: "用户名为1-100位字符，纯字母或者纯汉字！",
            trigger: "blur",
          },
        ],
        agentName: [
          {
            pattern: "^([a-zA-Z .]{1,100}|[\u4e00-\u9fa5 .]{1,100})$",
            message: "用户名为1-100位字符，纯字母或者纯汉字！",
            trigger: "blur",
          },
        ],
        idNo: [this.$util.rules.cardNo()],
        agentPhone: [this.$util.rules.phone()],
        phone: [this.$util.rules.phone()],
        email: [this.$util.rules.mail()],
      },
      companyList: [],
      //更新form查询条件
      searchCustomer: {
        original:[],
        name: "", //姓名
        phone: "", //联系电话
        email: "", //邮箱
        age: "", //年龄
        startAge: null,
        endAge: null,
        hobby: "", //兴趣
        idNo: "", //证件号码
        status: "", //状态
        memberLevelCode: "", //会员等级
        agentName: "", //推广人姓名
        city: "", //地域
        agentOrgCode: "", //推广人管理机构
        agentPhone: "", //推广人手机号
        cityData: [],
        agentTime: [], //时间阶段
        startTime: "",
        endTime: "",
        nickName: "", //微信昵称
      },
      //form查询条件
      searchCustomerOld: {
        name: "", //姓名
        phone: "", //联系电话
        email: "", //邮箱
        age: "", //年龄
        startAge: null,
        endAge: null,
        hobby: "", //兴趣
        original: "", //来源
        idNo: "", //证件号码
        status: "", //状态
        memberLevelCode: "", //会员等级
        agentName: "", //推广人姓名
        city: "", //地域
        agentOrgCode: "", //推广人管理机构
        agentPhone: "", //推广人手机号
        cityData: [],
        nickName: "", //微信昵称
      },
      // 分页数据--队伍查询
      paginationCustomer: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      queryPageSize: 10, //分页条数
      hobbyList: [
        {
          id: 1,
          name: "运动",
        },
        {
          id: 2,
          name: "音乐",
        },
        {
          id: 3,
          name: "旅行",
        },
        {
          id: 4,
          name: "影视",
        },
        {
          id: 5,
          name: "书法",
        },
        {
          id: 6,
          name: "摄影",
        },
        {
          id: 7,
          name: "读书",
        },
        {
          id: 8,
          name: "模特",
        },
        {
          id: 9,
          name: "绘画",
        },
        {
          id: 10,
          name: "演讲",
        },
        {
          id: 999,
          name: "其他",
        },
      ], //兴趣list
      memberLevelList: [], //会员list
      cityList: [], //地域list
      sourceList: [], //来源
      manageOrgList: [
        {
          label: "北京分公司",
          value: "北京分公司",
        },
        {
          label: "天津分公司",
          value: "天津分公司",
        },
      ], //推广人员管理机构list
      tableList: [],
      total: 0,
      //表格
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
        },

        {
          title: "用户账号",
          key: "customerNo",
          align: "center",
          minWidth: 90,
        },
          // 临时注释
        // {
        //   title: "姓名",
        //   key: "name",
        //   align: "center",
        //   minWidth: 90,
        // },
        {
          title: "性别",
          key: "genderName",
          align: "center",
          minWidth: 80,
        },
        {
          title: "年龄",
          key: "age",
          align: "center",
          minWidth: 50,
        },
        {
          title: "微信昵称",
          key: "nickName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "联系电话",
          key: "phone",
          align: "center",
          minWidth: 100,
        },
          // 临时注释
        // {
        //   title: "证件类型",
        //   key: "idTypeName",
        //   align: "center",
        //   minWidth: 90,
        // },
        // {
        //   title: "证件号码",
        //   key: "idNo",
        //   align: "center",
        //   minWidth: 150,
        // },
        // {
        //   title: "出生日期",
        //   key: "birthday",
        //   align: "center",
        //   minWidth: 90,
        // },
        // {
        //   title: "邮箱",
        //   align: "center",
        //   key: "email",
        //   minWidth: 100,
        //   ellipsis: true,
        //   tooltip: true,
        // },
        {
          title: "会员等级",
          key: "memberLevelName",
          align: "center",
          minWidth: 90,
        },
       /*  {
          title: "兴趣",
          key: "hobbies",
          align: "center",
          minWidth: 100,
        }, */
        // 临时注释
        // {
        //   title: "地域",
        //   align: "center",
        //   key: "city",
        //   ellipsis: true,
        //   tooltip: true,
        //   minWidth: 100,
        // },
        // {
        //   title: "地址",
        //   key: "address",
        //   align: "center",
        //   minWidth: 130,
        //   ellipsis: true,
        //   tooltip: true,
        // },
        {
          title: "商城来源",
          key: "mallSourceFrom",
          align: "center",
          minWidth: 100,
        },
        {
          title: "俱乐部来源",
          key: "clubSourceFrom",
          align: "center",
          minWidth: 100,
        },
         {
          title: "推广一级渠道",
          key: "oneChannel",
          align: "center",
          minWidth: 100,
          // 匹配渠道名称
          render: (h, params) => {
            let name = params.row.oneChannel;
            this.parentNameList.map(relation =>{
              if( relation.code == params.row.oneChannel){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
         {
          title: "推广二级渠道",
          key: "twoChannel",
          align: "center",
          minWidth: 100,
          // 匹配渠道名称
          render: (h, params) => {
            let name = params.row.twoChannel;
            this.parentNameList.map(relation =>{
              if( relation.code == params.row.twoChannel){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
         {
          title: "推广三级渠道",
          key: "sourceId",
          align: "center",
          minWidth: 100,
          // 匹配渠道名称
          render: (h, params) => {
            let name = params.row.sourceId;
            this.parentNameList.map(relation =>{
              if(relation.code == params.row.sourceId){
                 name=relation.name
              }
            })
            return h('div', {}, name);
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 80,
        },
        {
          title: "推广人姓名",
          key: "agentName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "推广人管理机构",
          align: "center",
          key: "agentOrgName",
          ellipsis: true,
          tooltip: true,
          minWidth: 130,
        },
        {
          title: "推广人手机号",
          key: "agentPhone",
          align: "center",
          minWidth: 110,
        },
        {
          title: "创建时间",
          key: "createdDate",
          align: "center",
          minWidth: 100,
        },
      ],
      certificateTypeList: [
        { name: "身份证", value: "00" },
        { name: "户口本", value: "01" },
        { name: "出生证", value: "02" },
        { name: "外国护照", value: "03" },
        { name: "军人证(军官证)", value: "04" },
        { name: "士兵证", value: "05" },
        { name: "警官证", value: "06" },
        { name: "台湾居民往来内陆通行证", value: "07" },
        { name: "港澳居民往来内陆通行证", value: "08" },
        { name: "中国护照", value: "09" },
        { name: "护照", value: "10" },
        { name: "无证件", value: "11" },
        { name: "其他", value: "12" },
        { name: "外国人永久居留身份证", value: "13" },
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      isAdminCenter: false,
      button: this.$store.state.app.button,
    };
  },
  created: function () {
    this.fetchData();
    this.getCompanyList();
    // this.dictionaryListNoPage();
  },
  mounted: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.getCityList();
    this.userSourceList();
    this.dictionaryListNoPage();
    // this.getHobbiesList();
    // this.getManagerOrgList();
  },
  watch: {},
  methods: {
    /**
     * @description: 导出
     * @author: L.R.H
     * @date: 2020-09-23 11:06:06
     */
    exportAll() {
      //this.$util.showLoading();
      //入参对象
      // console.log(this.searchCustomer.original)
      if (this.searchCustomer.original&&(this.searchCustomer.original[0] == 1)) {
        //俱乐部来源
        this.searchCustomer.clubOrigin = this.searchCustomer.original[2]||this.searchCustomer.original[1];
         this.searchCustomer.mallOrigin =''
        //delete this.searchCustomer.original;
      } else {
        //商城来源
        this.searchCustomer.mallOrigin = this.searchCustomer.original[2]||this.searchCustomer.original[1];
         this.searchCustomer.clubOrigin =""
        //delete this.searchCustomer.original;
      }
      let obj = JSON.parse(JSON.stringify(this.searchCustomer));
      console.log(obj);
      obj.isCustomer = "0";
      this.$api
        .batchExportPolicy(obj)
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "客户信息.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    /**
     * @description: 日期变化 触发
     * @author: L.R.H
     * @date: 2020-09-23 10:55:46
     */
    timeChange(time) {
      this.searchCustomer.agentTime = time;
      this.searchCustomer.startTime = time[0];
      this.searchCustomer.endTime = time[1];
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    handleChangeOnSelect2(value) {
      this.changeOnSelect2 = value;
      // console.log(value);
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
    handleChangeOnSelect(value) {
      this.changeOnSelect = value;
      // console.log(value);
    },
    //查询地域信息
    loadData(item, callback) {
      item.children = [];
      item.loading = true;
      // console.log("909090");
      let that = this;
      //调用下级接口
      this.$api
        .childCityList({
          cityCode: item.value,
        })
        .then((res) => {
          if (res.result == "0") {
            item.loading = false;
            let map = {
              value: "code",
              label: "name",
              children: "childList",
            };
            // this.childCityList = this.convertCityTree(res.content[0].childList, map);
            // this.childCityList.map(function (i) {
            //   i.loading = false;
            // });
            res.content.map(function (c) {
              if (c.code) {
                c.value = c.code;
              }
              if (c.name) {
                c.label = c.name;
              }
              c.children = c.childList;
              if (c.children) {
                c.loading = false;
              }
            });
            if (res.content) {
              // console.log(item.children);
              item.children = res.content;
              that.$set(res.content, "", item.children);
              callback();
            }
          } else {
            that.$Message.error(res.message);
          }
        });
      item.loading = false;
    },
    beForePagination(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { total, page } = this.paginationCustomer;
      if ((page - 1) * queryPageSize > total) {
        this.$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    //客户查询
    changeFormSearch() {
      this.searchCustomerOld = this.$util.convertObj(this.searchCustomer);
      // console.log(this.searchCustomer);
      this.searchCustomerOld.city =
        this.searchCustomerOld.cityData.length > 0
          ? this.searchCustomerOld.cityData.pop()
          : "";
      // console.log(this.searchCustomerOld);
      if(this.searchCustomer.original[0]==1){
        //origin是1是俱乐部来源传clubOrigin
        this.searchCustomerOld.clubOrigin=this.searchCustomerOld.mallOrigin
        this.searchCustomerOld.mallOrigin=""
      }
      this.fetchData();
    },
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      // console.log(this.searchCustomerOld.original);
      if (this.searchCustomerOld.original[0] == 1) {
        //俱乐部来源
        this.searchCustomerOld.clubOrigin = this.searchCustomerOld.original[2]||this.searchCustomerOld.original[1];
      } else {
        //商城来源
        this.searchCustomerOld.mallOrigin = this.searchCustomerOld.original[2]||this.searchCustomerOld.original[1];
      }
      const reqData = {
        ...this.searchCustomerOld,
        page,
        pageSize: this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getCustomerPage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list;
          //分页数据
          this.paginationCustomer.total = res.content.total;
          this.tableList.map((table, index) => {
            if(table.gender == 0){
              table.genderName = "男"
            } else if(table.gender == 1){
              table.genderName = "女"
            }else{
              table.genderName = ""
            }
            // table.genderName = table.gender == 0 ? "男" : "女";
            table.status = table.status == 0 ? "启用" : "停用";
            if (!table.birthday) {
              table.birthday = "——";
            } else {
              let str3 = this.$util.getFormatOnlyDate(table.birthday);
              if (str3.substring(0, 3) == "NaN") {
                //是IE浏览器
                table.birthday = table.birthday.substring(0, 10);
              } else {
                table.birthday = str3;
              }
            }
            if (!table.createdDate) {
              table.createdDate = "——";
            } else {
              let str4 = this.$util.getFormatOnlyDate(table.createdDate);
              if (str4.substring(0, 3) == "NaN") {
                //是IE浏览器
                table.createdDate = table.createdDate.substring(0, 10);
              } else {
                table.createdDate = str4;
              }
            }
            this.certificateTypeList.map((type) => {
              if (table.idType) {
                if (type.value == table.idType) {
                  table.idTypeName = type.name;
                } else {
                  table.idTypeName = table.idType;
                }
              } else {
                table.idTypeName = "暂无类型";
              }
            });
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //查询来源
    userSourceList() {
      this.$api.userSourceList({}).then((res) => {
        if (res.result == "0") {
          // this.cityList = this.convertCityTree(res.content, map);
          res.content.map(function (i) {
            if (!i.children) {
              i.children = i.childList;
            }
            i.children.map((j) => {
              if (!j.children) {
                j.children = j.childList;
              }
              j.value=j.label
            });
          });
          // console.log(res.content);

          this.sourceList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //查询地域信息
    getCityList() {
      this.$api.getCityList({}).then((res) => {
        if (res.result == "0") {
          let map = {
            value: "code",
            label: "name",
            children: "childList",
          };
          // this.cityList = this.convertCityTree(res.content, map);
          res.content.map(function (i) {
            if (!i.children) {
              i.children = [];
            }
          });
          this.cityList = res.content;

          this.cityList.map(function (i) {
            i.loading = false;
          });
          // console.log(this.cityList);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //查询爱好
    getHobbiesList() {
      this.$api.getHobbiesList({}).then((res) => {
        if (res.result == "0") {
          this.hobbyList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //查询管理机构
    getManagerOrgList() {
      this.$api.getManageOrgList({}).then((res) => {
        if (res.result == "0") {
          // this.manageOrgList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //遍历获取地域数据
    convertCityTree(tree, map) {
      // console.log(tree);
      const result = [];
      // 遍历 tree
      tree.forEach((item) => {
        // 读取 map 的键值映射
        const value = item[map.value];
        const label = item[map.label];
        // let children = item[map.children];
        let children = [];
        // 如果有子节点，递归
        if (children) {
          children = this.convertCityTree(children, map);
        }

        result.push({
          value,
          label,
          children,
        });
      });
      // console.log(result);
      return result;
    },
    //重置
    reset() {
      this.searchCustomer = {
        name: "", //姓名
        phone: "", //联系电话
        email: "", //邮箱
        age: "", //年龄
        startAge: null,
        endAge: null,
        hobby: "", //兴趣
        original: "", //来源
        idNo: "", //证件号码
        status: "", //状态
        memberLevelCode: "", //会员等级
        agentName: "", //推广人姓名
        city: "", //地域
        agentOrgCode: "", //推广人管理机构
        agentPhone: "", //推广人手机号
        cityData: [],
        agentTime: [],
        startTime: "",
        endTime: "",
      };
      this.$refs.formInline.resetFields();
      this.changeFormSearch();
    },
    //加载父级字段和父级码值
    dictionaryListNoPage() {
      this.$api
        .queryByRelationCode({
          relationCode: 'PromotionChannels',
        })
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            this.parentNameList = res.data;
          } else {
            this.$Message.error(res.message);
          }
        //  console.log( "--===",this.parentNameList ,res);
        });
    },
  },
};
</script>
<style lang="less" scoped>
#customer-list {
  .box--flex {
    // display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .search-btn {
      text-align: right;
      min-width: 250px;
    }
  }
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  .mt--20 {
    margin-top: 20px;
  }
  .ivu-form-item {
    margin-bottom: 30px;
  }
}
</style>
