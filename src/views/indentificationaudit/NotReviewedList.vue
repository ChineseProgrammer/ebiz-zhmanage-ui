<template>
  <div id="NotReviewed-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form
      class="box--flex"
        ref="formInline"
        :model="searchNotReviewed"
        inline
        :label-width="100"
      >
        <!-- <Row>
          <i-col span="6"> -->
            <FormItem label="投保人姓名">
              <Input
                v-model="searchNotReviewed.holderName"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem label="投保人证件号码">
              <Input
                v-model="searchNotReviewed.holderCertificateNo"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem label="被保人姓名">
              <Input
                v-model="searchNotReviewed.insuredName"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem label="被保人证件号码">
              <Input
                v-model="searchNotReviewed.insuredIDNo"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem prop="source" label="管理机构">
              <Select
                filterable
                clearable
                v-model="searchNotReviewed.organizationCode"
                style="width:160px"
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
            <FormItem label="是否自助投保">
              <RadioGroup
                v-model.trim="searchNotReviewed.channelStatus"
                style="width:160px"
              >
                <Radio :label="0">是</Radio>
                <Radio :label="1">否</Radio>
              </RadioGroup>
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem prop="source" label="产品名称">
              <Select
                filterable
                clearable
                v-model="searchNotReviewed.productCode"
                style="width:160px"
                placeholder="请选择"
              >
                <Option
                  v-for="item in productList"
                  :value="item.productCode"
                  :key="item.productCode"
                  >{{ item.productName }}</Option
                >
              </Select>
            </FormItem>
          <!-- </i-col>

          <i-col span="6"> -->
            <FormItem label="订单号">
              <Input
                v-model="searchNotReviewed.orderNo"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem label="推广人员姓名">
              <Input
                v-model="searchNotReviewed.agentName"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>
          <i-col span="6"> -->
            <FormItem label="推广人员手机号">
              <Input
                v-model="searchNotReviewed.agentPhone"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>

          <i-col span="6"> -->
            <FormItem label="投保单号">
              <Input
                v-model="searchNotReviewed.applyCode"
                placeholder="请输入"
                style="width:160px"
              />
            </FormItem>
          <!-- </i-col>

          <i-col span="6"> -->
            <FormItem label="转人核时间" class="picker--small">
              <!-- <Row>
                <i-col span="11"> -->
                  <FormItem style="width:102px; margin-right:0;">
                    <DatePicker
                      type="date"
                      placeholder="请选择开始时间"
                      v-model="searchNotReviewed.appntStartDate"
                    ></DatePicker>
                  </FormItem>
                <!-- </i-col>
                <i-col span="2" style="text-align: center">-</i-col>
                <i-col span="11"> -->
                  -
                  <FormItem style="width:102px; margin-right:0;">
                    <DatePicker
                      type="date"
                      placeholder="请选择结束时间"
                      v-model="searchNotReviewed.appntEndDate"
                    ></DatePicker>
                  </FormItem>
                <!-- </i-col>
              </Row> -->
            </FormItem>
          <!-- </i-col> -->
          <!-- <i-col span="4" class="fr"> -->
            <div class="search-btn">
            <Button @click="changeFormSearch" type="primary">查询</Button>
            <Button @click="reset()">重置</Button>
            </div>
          <!-- </i-col>
        </Row> -->
      </Form>
    </div>
    <Divider class="mv10" />
    <!-- 添加按钮 -->
    <div class="mb15">
      <Button
        @click="exportReviewed"
        class="ivu-btn ivu-btn-primary"
        style="margin-top: 10px;width: 100px;"
        >导出</Button
      >
    </div>
    <!-- 列表 -->
    <div>
      <primaryTable
        :columns="columns"
        :data="tableList"
        :current.sync="pagination.page"
        ref="teamTable"
        :total="pagination.total"
        :pageSize="pagination.pageSize"
        @on-change="fetchData"
        @to-examine="toExamine"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //更新form查询条件
      searchNotReviewed: {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        holderCertificateNo: "",
        holderName: "",
        insuredName: "",
        productCode: "",
        orderNo: "",
        organizationCode: "",
        policyCode: "",
        examineType: "1",
      },
      //form查询条件
      searchNotReviewedOld: {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        holderCertificateNo: "",
        holderName: "",
        insuredName: "",
        productCode: "",
        orderNo: "",
        organizationCode: "",
        policyCode: "",
        examineType: "1",
      },
      // 分页数据--队伍查询
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      orgList: [], //机构list
      productList: [], //产品list
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
          title: "投保单号",
          key: "applyCode",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: "产品名称(主险)",
          key: "productName",
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
          title: "年龄",
          key: "holderAge",
          align: "center",
          minWidth: 80,
        },
        {
          title: "证件类型",
          key: "holderCertificateTypeName",
          align: "center",
          minWidth: 120,
        },
        {
          title: "证件号码",
          key: "holderCertificateNo",
          align: "center",
          minWidth: 150,
        },
        {
          title: "被保人姓名",
          key: "insuredName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "年龄",
          key: "insuredAge",
          align: "center",
          minWidth: 90,
        },
        {
          title: "与投保人关系",
          key: "holderRelation",
          align: "center",
          minWidth: 100,
        },
        {
          title: "证件类型",
          key: "insuredCertificateTypeName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "证件号码",
          key: "insuredCertificateNo",
          align: "center",
          minWidth: 150,
        },
        {
          title: "是否自主投保",
          key: "isAutonomy",
          align: "center",
          minWidth: 80,
        },
        {
          title: "推广人员姓名",
          key: "agentName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "推广人员编号",
          key: "agentCode",
          align: "center",
          minWidth: 110,
        },
        {
          title: "状态",
          key: "auditStatus",
          align: "center",
          minWidth: 90,
        },
        {
          title: "审核人",
          key: "auditUser",
          align: "center",
          minWidth: 90,
        },
        {
          title: "审核时间",
          key: "auditDate",
          align: "center",
          minWidth: 100,
        },
        {
          title: "操作",
          slot: "action",
          width: 170,
          align: "center",
          selfBtn: [
            {
              name: "审核",
              type: "text",
              method: "to-examine",
            },
          ],
        },
      ],
      //证件类型--枚举值
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
      //保单状态--枚举值
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
        { name: "签收回执", value: "28" },
        { name: "修改中", value: "29" },
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
    };
  },
  created: function() {
    this.fetchData();
    this.getExamineProductList();
  },
  mounted: function() {},
  watch: {},
  methods: {
    //客户查询
    changeFormSearch() {
      this.searchNotReviewedOld = this.$util.convertObj(this.searchNotReviewed);
      this.fetchData();
    },
    //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchNotReviewedOld,
        page,
        pageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getExaminePage(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list;
          //分页数据
          this.pagination.total = res.content.total;
          this.tableList.map((item, index) => {
            item.holderGender = item.holderGender == 0 ? "男" : "女";
             if (!item.auditDate) {
              item.auditDate = "——";
            } else {
              let str2 = this.$util.getFormatOnlyDate(item.auditDate);
              if (str2.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.auditDate = item.auditDate.substring(
                  0,
                  10
                );
              } else {
                item.auditDate = str2;
              }
            }
            item.isAutonomy = item.isAutonomy == 1 ? "是" :"不是";
            item.auditStatus = item.auditStatus == 1 ? "未审批" : "已审核";
            this.certificateTypeList.map((typeData) => {
              if (typeData.value == item.holderCertificateType) {
                item.holderCertificateTypeName = typeData.name;
              }
              if (typeData.value == item.insuredCertificateType) {
                item.insuredCertificateTypeName = typeData.name;
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
    getExamineProductList() {
      this.$api.getExamineProductList({}).then((res) => {
        if (res.result == "0") {
          this.productList = res.content;
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
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置
    reset() {
      this.searchNotReviewed = {
        agentName: "",
        agentPhone: "",
        applyCode: "",
        appntEndDate: "",
        appntStartDate: "",
        holderCertificateNo: "",
        holderName: "",
        insuredName: "",
        productCode: "",
        orderNo: "",
        organizationCode: "",
        policyCode: "",
      };

      this.changeFormSearch();
    },
    //跳转到审核详情页面
    toExamine(val) {
      this.$router.push({
        name: "notrevieweddetail",
        params: { policyId: val.policyId },
      });
    },
    //导出
    exportReviewed() {
      this.$util.showLoading();
      this.$api.batchexportReviewed(this.searchNotReviewed).then((res) => {
        this.$util.hideLoading();
        let elink = document.createElement("a");
        elink.download = "业务列表信息.xlsx";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box--flex{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .ivu-form-item{
      width: 320px;
    }
    .search-btn{
      width: 320px;
    }
  }
  .picker--small{
    width: 320px;
  }
/deep/ .ivu-radio-group {
  height: 32px;
}
</style>
