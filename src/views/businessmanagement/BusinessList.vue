<template>
  <div id="business-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form
        ref="formInline"
        :rules="rules"
        :model="searchBusiness"
        inline
        :label-width="130"
      >
        <!-- <Row>
          <i-col span="6"> -->
         <FormItem label="销售渠道">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.channelCode"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in dropdownBoxList"
              :value="item.code"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="applyCode" label="投保单号">
          <Input
            v-model.trim="searchBusiness.applyCode"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>

          <i-col span="6"> -->
        <FormItem prop="holderName" label="投保人姓名">
          <Input
            v-model.trim="searchBusiness.holderName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem label="投保人证件类型">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.holderCertificateType"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in certificateTypeList"
              :value="item.value"
              :key="item.value"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="holderCertificateNo" label="投保人证件号码">
          <Input
            v-model.trim="searchBusiness.holderCertificateNo"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem label="投保人性别">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.holderGender"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option value="0">男</Option>
            <Option value="1">女</Option>
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
       <!--  <FormItem prop="interest" label="投保人出生日期">
          <DatePicker
            style="width: 160px"
            :value="searchBusiness.holderBirthday"
            type="daterange"
            placeholder="请选择出生日期"
            @on-change="birstDate"
          ></DatePicker>
        </FormItem> -->
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="holderPhone" label="投保人员手机号">
          <Input
            v-model.trim="searchBusiness.holderPhone"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="insuredName" label="被保人姓名">
          <Input
            v-model.trim="searchBusiness.insuredName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <FormItem label="被保人证件类型">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.insuredCertificateType"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in certificateTypeList1"
              :value="item.code"
              :key="item.id"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="insuredCertificateNo	" label="被保人证件号码">
          <Input
            v-model.trim="searchBusiness.insuredCertificateNo	"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
         <FormItem label="被保人与投保人关系">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.holderRelation"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in holderRelationList"
              :value="item.code"
              :key="item.id"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem prop="insuredPhone" label="被保人手机号">
          <Input
            v-model.trim="searchBusiness.insuredPhone"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="source" label="机构">
          <!-- v-model.trim="searchBusiness.organizationCode" -->
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.organizationName"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="(item, index) in orgList"
              :value="item.orgName"
              :key="index"
              >{{ item.orgName }}</Option
            >
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="agentName" label="推广人员姓名">
          <Input
            v-model.trim="searchBusiness.agentName"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="agentPhone" label="推荐人手机号">
          <Input
            v-model.trim="searchBusiness.agentPhone"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
         <i-col span="6"> -->
        <FormItem label="是否自助投保" prop="autonomyStatus">
          <RadioGroup
            v-model.trim="searchBusiness.autonomyStatus"
            style="width: 160px"
          >
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="source" label="险种">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.liabilityCode"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in liabilityList"
              :value="item.productCode"
              :key="item.productCode"
              >{{ item.productName }}</Option
            >
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="isSignFor" label="签收回执">
          <RadioGroup
            v-model.trim="searchBusiness.isSignFor"
            style="width: 160px"
          >
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="source" label="保单状态">
          <Select
            filterable
            clearable
            v-model.trim="searchBusiness.policyStatus"
            style="width: 160px"
            placeholder="请选择"
          >
            <Option
              v-for="item in policyStatusList"
              :value="item.value"
              :key="item.value"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <!-- </i-col>
          <i-col span="6"> -->
        <FormItem prop="policyCode" label="保单号">
          <Input
            v-model.trim="searchBusiness.policyCode"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>

          <i-col span="6"> -->
        <FormItem prop="orderNo" label="订单号">
          <Input
            v-model.trim="searchBusiness.orderNo"
            placeholder="请输入"
            style="width: 160px"
          />
        </FormItem>
        <!-- </i-col>
          <i-col span="9"> -->
        <FormItem label="创建时间">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            v-model.trim="statisticTime"
            @on-change="timeChange"
            style="width: 200px"
          ></DatePicker>
          <!-- <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.appntStartDate"
            ></DatePicker>
          </FormItem>
          -
          <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.appntEndDate"
            ></DatePicker>
          </FormItem> -->
        </FormItem>
        <FormItem label="保单承保时间">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            v-model.trim="underwriteTime"
            @on-change="underwriteTimeChange"
            style="width: 200px"
          ></DatePicker>
          <!-- <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.startUnderwriteTime"
            ></DatePicker>
          </FormItem>
          -
          <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.endUnderwriteTime"
            ></DatePicker>
          </FormItem> -->
        </FormItem>
        <FormItem label="保单生效时间">
          <DatePicker
            type="daterange"
            placeholder="请选择"
            v-model.trim="effectiveTime"
            @on-change="effectiveTimeChange"
            style="width: 200px"
          ></DatePicker>
          <!-- <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.startEffectiveTime"
            ></DatePicker>
          </FormItem>
          -
          <FormItem>
            <DatePicker
              type="date"
              placeholder="请选择"
              v-model.trim="searchBusiness.endEffectiveTime"
            ></DatePicker>
          </FormItem> -->
        </FormItem>
        <!-- </i-col>
          <i-col span="4" class="fr"> -->
        <span style="margin-left: 115px">
          <Button @click="changeFormSearch" type="primary">查询</Button>
          <Button @click="reset()">重置</Button>
        </span>
        <!-- </i-col>
        </Row> -->
      </Form>
    </div>
    <Divider class="mv10" />
    <!-- 添加按钮 -->
    <div class="mb15">
      <Button
        v-if="isAdminCenter || button.businessmanagement_export"
        @click="exportPolicy"
        class="ivu-btn ivu-btn-primary"
        style="margin-top: 10px; width: 100px"
        >导出</Button
      >
    </div>
    <!-- 列表 -->
    <div>
      <primaryTable
        :columns="columns"
        :data="tableList"
        :current.sync="paginationPolicy.page"
        ref="teamTable"
        :total="paginationPolicy.total"
        :pageSize="paginationPolicy.pageSize"
        @on-page-size-change="beForeFetchData(1, ...arguments)"
        @on-change="fetchData"
        @on-check="businessCheck"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentNameList:{},
      statisticTime: null,
      underwriteTime: null,
      effectiveTime: null,
      isAdminCenter: false,
      button: this.$store.state.app.button,
      rules: {
        // policyCode: [this.$util.rules.numberMax50()],
        // orderNo: [this.$util.rules.numberCharMax50()],
        // applyCode: [this.$util.rules.numberCharMax50()],
        // holderCertificateNo: [this.$util.rules.cardNo()],
        // holderPhone: [this.$util.rules.phone()],
        // insuredPhone: [this.$util.rules.phone()],
        // agentPhone: [this.$util.rules.phone()],
        // holderName: [
        //   {
        //     pattern: "^([a-zA-Z .]{1,100}|[\u4e00-\u9fa5 .]{1,100})$",
        //     message: "用户名为1-100位字符，纯字母或者纯汉字！",
        //     trigger: "blur",
        //   },
        // ],
        // insuredName: [
        //   {
        //     pattern: "^([a-zA-Z .]{1,100}|[\u4e00-\u9fa5 .]{1,100})$",
        //     message: "用户名为1-100位字符，纯字母或者纯汉字！",
        //     trigger: "blur",
        //   },
        // ],
        // agentName: [
        //   {
        //     pattern: "^([a-zA-Z .]{1,100}|[\u4e00-\u9fa5 .]{1,100})$",
        //     message: "用户名为1-100位字符，纯字母或者纯汉字！",
        //     trigger: "blur",
        //   },
        // ],
      },
      //更新form查询条件
      searchBusiness: {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        startUnderwriteTime: "", //保单承保开始时间
        endUnderwriteTime: "", //保单承保结束时间
        startEffectiveTime: "", //保单生效开始时间
        endEffectiveTime: "", //保单生效结束时间
        holderBirthday: [],
        holderBirthdayStartDate: "",
        holderBirthdayEndDate: "",
        holderCertificateNo: "",
        holderCertificateType: "",
        holderGender: "",
        holderName: "",
        holderPhone: "",
        insuredName: "",
        insuredPhone: "",
        liabilityCode: "",
        orderNo: "",
        // organizationCode: "",
        organizationName: "", //机构
        policyCode: "",
        policyStatus: "",
        isSignFor: "", //签收回执
        channelCode: "", //渠道编号
        insuredCertificateType: "", //被保人证件类型
        insuredCertificateNo: "", //被保人证件号码
        holderRelation: "", //被保人与投保人关系
      },
      //form查询条件
      searchBusinessOld: {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        startUnderwriteTime: "", //保单承保开始时间
        endUnderwriteTime: "", //保单承保结束时间
        startEffectiveTime: "", //保单生效开始时间
        endEffectiveTime: "", //保单生效结束时间
        holderBirthday: [],
        holderBirthdayStartDate: "",
        holderBirthdayEndDate: "",
        holderCertificateNo: "",
        holderCertificateType: "",
        holderGender: "",
        holderName: "",
        holderPhone: "",
        insuredName: "",
        insuredPhone: "",
        liabilityCode: "",
        orderNo: "",
        // organizationCode: "",
        organizationName: "",
        policyCode: "",
        policyStatus: "",
        isSignFor: "", //签收回执
        channelCode: "", //渠道编号
        insuredCertificateType: "", //被保人证件类型
        insuredCertificateNo: "", //被保人证件号码
        holderRelation: "", //被保人与投保人关系
      },
      // 分页数据--队伍查询
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      orgList: [], //机构list
      sourceList: [],
      liabilityList: [], //险种list
      queryPageSize: 10, //分页条数
      tableList: [],
      //表格
      columns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center",
        },
        {
          title: "订单号",
          key: "orderNo",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "销售渠道",
          key: "channelName",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保单号",
          key: "applyCode",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "保单号",
          key: "policyCode",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "投保人姓名",
          key: "holderName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "投保人性别",
          key: "holderGender",
          align: "center",
          minWidth: 80,
        },
        {
          title: "联系电话",
          key: "holderPhone",
          align: "center",
          minWidth: 100,
        },
        {
          title: "投保人证件类型",
          key: "holderCertificateTypeName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "投保人证件号码",
          key: "holderCertificateNo",
          align: "center",
          minWidth: 150,
        },
        /* {
          title: "投保人出生日期",
          key: "holderBirthday",
          align: "center",
          minWidth: 90,
        }, */
        {
          title: "被保人姓名",
          key: "insuredName",
          align: "center",
          minWidth: 100,
        },
         {
          title: "被保人证件类型",
          key: "insuredCertificateType",
          align: "center",
          minWidth: 100,
        },
        {
          title: "被保人证件号码",
          key: "insuredCertificateNo",
          align: "center",
          minWidth: 150,
        },
        {
          title: "被保人与投保人关系",
          key: "holderRelation",
          align: "center",
          minWidth: 100,
        },
        {
          title: "是否自助投保",
          key: "autonomyStatus",
          align: "center",
          minWidth: 90,
        },
        {
          title: "险种",
          key: "liabilityName",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "保额(元)",
          key: "amount",
          align: "center",
          minWidth: 120,
        },
        {
          title: "保费(元)",
          key: "premium",
          align: "center",
          minWidth: 120,
        },
        {
          title: "交费期间",
          key: "chargePeriod",
          align: "center",
          minWidth: 90,
            render: (h, p) => {
            if (p.row.chargePeriod && p.row.chargePeriodType == 2) {
              return h("div", "按年交费" + p.row.chargePeriod + "年");
            } else if (p.row.chargePeriodType != 2) {
              let a = [
                "无关",
                      "趸交",
                      "按年限交",
                      "按年交至某确定年龄",
                      "终生交费",
                      "不定期交",
                      "按月交",
              ][p.row.chargePeriodType]||'';
              let b = ["", "", "年", "岁", "月", "天"][
                p.row.chargePeriodType
              ]||'';
              if (p.row.chargePeriod != 0) {
                return h("div", a + (p.row.chargePeriod||'') + b);
              } else {
                return h("div", a + b);
              }
            }
          }
        },
        {
          title: "保险期间",
          key: "coveragePeriod",
          align: "center",
          minWidth: 90,
          render: (h, p) => {
            if (p.row.coveragePeriod && p.row.coveragePeriodType == 2) {
              return h("div", "按年限保" + p.row.coveragePeriod + "年");
            } else if (p.row.coveragePeriodType != 2) {
              let a = [
                "无关",
                "保终身",
                "按年限保",
                "保至某确定年龄",
                "按月保",
                "按天保",
              ][p.row.coveragePeriodType]||'';
              let b = ["", "", "年", "岁", "月", "天"][
                p.row.coveragePeriodType
              ]||'';
              if ((p.row.coveragePeriod != 0)&&(p.row.coveragePeriodType!=1)) {
                return h("div", a + (p.row.coveragePeriod||'') + b);
              } else {
                return h("div", a + b);
              }
            }
          },
        },
        {
          title: "保单状态",
          key: "policyStatus",
          align: "center",
          minWidth: 130,
        },
        {
          title: "推广人员姓名",
          key: "agentName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "推广人员手机号",
          key: "agentPhone",
          align: "center",
          minWidth: 110,
        },
        {
          title: "创建时间",
          key: "createdDate",
          align: "center",
          minWidth: 90,
        },
        {
          title: "保单承保时间",
          key: "underwriteTime",
          align: "center",
          minWidth: 100,
        },
        {
          title: "保单生效时间",
          key: "effectiveTime",
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
              // console.log(name,relation.code,params.row.oneChannel)
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
          title: "操作",
          slot: "action",
          width: 170,
          align: "center",
          btn: { check: true },
          //   render: (h, params) => {
          //     return h("div", [
          //       h(
          //         "Button",
          //         {
          //           props: {
          //             type: "primary",
          //             size: "small",
          //           },
          //           style: {
          //             marginRight: "5px",
          //           },
          //           on: {
          //             click: () => {
          //               this.businessInfo(params.row.id);
          //             },
          //           },
          //         },
          //         "查看详情"
          //       ),
          //     ]);
          //   },
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
      policyStatusList: [
        { name: "初始状态", value: "00" },
        { name: "待核保", value: "20" },
        { name: "核保成功", value: "21" },
        { name: "核保失败", value: "22" },
        { name: "承保成功", value: "23" },
        { name: "承保失败", value: "24" },
        { name: "已终止", value: "25" },
        { name: "已失效(已撤单)", value: "26" },
        { name: "已失效A(已撤单)", value: "26A" },
        { name: "待转人工核保", value: "27-0" },
        { name: "转人工核保成功", value: "27-1" },
        { name: "转人工核保失败", value: "27-2" },
        // { name: "签收回执", value: "28" },
        { name: "修改中", value: "29" },
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      dropdownBoxList:[], //销售渠道
      certificateTypeList1:[], //被保人证件类型
      holderRelationList:[], //被保人与投保人关系
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (!this.button.businessmanagementDetail) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.fetchData();
    this.getLiabilityList();
    this.getOrgList();
    this.getDropdownBox(); // 销售渠道
    this.queryRelationInfo(); // 证件类型
    this.queryRelationInfo1(); // 被保人与投保人关系
    this.dictionaryListNoPage();
  },
  mounted: function () {},
  watch: {},
  methods: {
    timeChange(time) {
      this.searchBusiness.appntStartDate = new Date(time[0]);
      this.searchBusiness.appntEndDate = new Date(time[1]);
    },
    underwriteTimeChange(time) {
      this.searchBusiness.startUnderwriteTime = new Date(time[0]);
      this.searchBusiness.endUnderwriteTime = new Date(time[1]);
    },
    effectiveTimeChange(time) {
      this.searchBusiness.startEffectiveTime = new Date(time[0]);
      this.searchBusiness.endEffectiveTime = new Date(time[1]);
    },
    //客户查询
    changeFormSearch() {
      this.searchBusinessOld = this.$util.convertObj(this.searchBusiness);
      this.fetchData();
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchData(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { teamTotal, page } = this.paginationPolicy;
      if ((page - 1) * queryPageSize > teamTotal) {
        this.$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchBusinessOld,
        page,
        pageSize: this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getPolicyPage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list
         /*  this.tableList = res.content.list.map((el) => {
            el.chargePeriod = [
              "无关",
              "趸交",
              "按年限交",
              "按年交至某确定年龄",
              "终生交费",
              "不定期交",
              "按月交",
            ][el.chargePeriod];
            el.coveragePeriod = [
              "无关",
              "保终身",
              "按年限保",
              "保至某确定年龄",
              "按月保",
              "按天保",
            ][el.coveragePeriod];
            return el;
          }); */
          //分页数据
          this.paginationPolicy.total = res.content.total;
          this.tableList.map((item, index) => {
            if (!item.holderBirthday) {
              item.holderBirthday = "——";
            } else {
              let str3 = this.$util.getFormatOnlyDate(item.holderBirthday);
              if (str3.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.holderBirthday = item.holderBirthday.substring(0, 10);
              } else {
                item.holderBirthday = str3;
              }
            }
            if (!item.createdDate) {
              item.createdDate = "——";
            } else {
              let str4 = this.$util.getFormatOnlyDate(item.createdDate);
              if (str4.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.createdDate = item.createdDate.substring(0, 10);
              } else {
                item.createdDate = str4;
              }
            }
            // 承保时间
            if (!item.underwriteTime) {
              item.underwriteTime = "——";
            } else {
              let str5 = this.$util.getFormatOnlyDate(item.underwriteTime);
              if (str5.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.underwriteTime = item.underwriteTime.substring(0, 10);
              } else {
                item.underwriteTime = str5;
              }
            }
            // 生效时间
            if (!item.effectiveTime) {
              item.effectiveTime = "——";
            } else {
              let str6 = this.$util.getFormatOnlyDate(item.effectiveTime);
              if (str6.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.effectiveTime = item.effectiveTime.substring(0, 10);
              } else {
                item.effectiveTime = str6;
              }
            }
            this.certificateTypeList.map((typeData) => {
              if (typeData.value == item.holderCertificateType) {
                item.holderCertificateTypeName = typeData.name;
              }
            });
            this.policyStatusList.map((status) => {
              if (status.value == item.policyStatus) {
                item.policyStatusName = status.name;
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
    //查询险种列表
    getLiabilityList() {
      this.$api.getLiabilityList({}).then((res) => {
        if (res.result == "0") {
          this.liabilityList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //查询机构列表
    getOrgList() {
      this.$api.getOrgList({}).then((res) => {
        if (res.respCode == "0") {
          this.orgList = res.content;
          this.orgList.map((item, index) => {
            if (item == null) {
              this.orgList.splice(index, 1);
            }
          });
          // console.log(this.orgList);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置
    reset() {
      this.statisticTime = null;
      this.underwriteTime = null;
      this.effectiveTime = null;
      this.searchBusiness = {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        startUnderwriteTime: "", //保单承保开始时间
        endUnderwriteTime: "", //保单承保结束时间
        startEffectiveTime: "", //保单生效开始时间
        endEffectiveTime: "", //保单生效结束时间
        holderBirthday: [],
        holderBirthdayStartDate: "",
        holderBirthdayEndDate: "",
        holderCertificateNo: "",
        holderCertificateType: "",
        holderGender: "",
        holderName: "",
        holderPhone: "",
        insuredName: "",
        insuredPhone: "",
        liabilityCode: "",
        orderNo: "",
        // organizationCode: "",
        organizationName: "",
        policyCode: "",
        policyStatus: "",
        isSignFor: "", //签收回执
      };

      this.changeFormSearch();
    },
    birstDate(date) {
      this.searchBusiness.holderBirthdayStartDate = date[0];
      this.searchBusiness.holderBirthdayEndDate = date[1];
    },
    businessCheck(val) {
      this.$router.push({
        name: "businessmanagementDetail",
        params: { policyId: val.policyId },
      });
    },
    exportPolicy() {
      this.$util.showLoading();
      let obj = JSON.parse(JSON.stringify(this.searchBusiness));
      obj.isCustomer = "1";
      this.$api.batchExportPolicy(obj).then((res) => {
        this.$util.hideLoading();
        let elink = document.createElement("a");
        elink.download = "业务列表信息.xlsx";
        // console.log(elink);
        elink.style.display = "none";
        let blob = new Blob([res]);
        // console.log(blob);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        // console.log(elink);
      });
    },
    // 销售渠道下拉
    getDropdownBox(){
       this.$api.dropdownBox({}).then((res) => {
        if (res.result == "0") {
          this.dropdownBoxList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // 被保人证件类型
    queryRelationInfo() {
      this.$api.queryRelationInfo({
        relationCode:'certificateType'
      }).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.certificateTypeList1=res.data.dictionaryResDTOList||[]
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    // 被保人与投保人关系
    queryRelationInfo1() {
      this.$api.queryRelationInfo({
        relationCode:'holderRelation'
      }).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.holderRelationList=res.data.dictionaryResDTOList||[]
        } else {
          this.$Message.error(res.message);
        }
      });
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
        });
    },
  },
};
</script>

<style lang="less" scoped>
#business-list {
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  /deep/ .ivu-radio-group {
    height: 32px;
  }
  .ivu-form-item {
    margin-right: 0;
    margin-bottom: 30px;
    .ivu-form-item-label {
      padding-right: 5px;
    }
    // width: 255px;
  }
}
</style>
