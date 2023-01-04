<template>
  <div class="only-content">
    <Form ref="formValidate"
      :model="formValidate"
      :label-width="100">
      <Row>
        <Col span="6">
        <FormItem label="路由名"
          prop="routeName">
          <Input v-model="formValidate.orderId"
            placeholder="输入路由名进行模糊查询" />
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="路由编码"
          prop="routelCode">
          <Input v-model="formValidate.applicant"
            placeholder="输入路由编码进行模糊查询"></Input>
        </FormItem>
        </Col>
        <Col span="24"
          class="text-right">
        <Button icon="ios-search"
          @click="serachMo">查询</Button>
        <Button @click="resertMo">重置</Button>
        </Col>
      </Row>
    </Form>

    <!-- button -->
    <div class="m-table">
      <div class="m-btn">
        <!--<Button @click="batchDelete">批量删除</Button>-->
        <Button @click="createRoute()" type="success">新增路由</Button>
      </div>
      <!-- table表格 -->
      <primaryTable border
        width="100%"
        :columns="columns"
        :data="tableData"
        ref="selectionTable"
        tableRef="selectionTable"
        @on-check='checkMessage'
        :total='total'
        @on-change='changePage'>
      </primaryTable>
    </div>
    <Modal v-model="modelform"
      title="选择发布环境">
      <Select size="small"
        style="width:100px"
        class="left-float"
        v-model="DEV">
        <Option value="1">DEV</Option>
        <Option value="2">UAT</Option>
        <Option value="3">PRD</Option>
      </Select>
      <div slot="footer">
        <Button type="success"
          @click="saveForm">确定</Button>
        <Button @click='cancelSave'>取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { debug } from "util";
import routeForm from './form/routeForm'

export default {
  data() {
    return {
      //发布环境
      DEV: "DEV",
      modelform: false,
      // 列表总页数
      total: 0,
      //举办时间
      meetingTime: [],
      //列表
      formValidate: {
        page: 1,
        pageSize: 10,
        proposalNo: "",
        firstYear: "",
        orderId: "",
        productName: "",
        applicant: "",
        saleChannel: "",
        status: ""
      },
      saleChannel: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "个险"
        },
        {
          value: "2",
          label: "银保"
        }
      ],
      productType: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "寿险"
        },
        {
          value: "2",
          label: "财险"
        }
      ],
      ruleNameList: [],
      orderStatus: [
        {
          value: "１",
          label: "进行中"
        },
        {
          value: "2",
          label: "已完成"
        },
        {
          value: "3",
          label: "已失败"
        }
      ],
      //删除操作时需要的数据
      deleteObj: {
        ids: []
      },
      //table中
      columns: [
        {
          title: "id",
          key: "id",
          align: "center",
          slot: "alarm",
          width: 80,
          fixed: "left"
        },
        {
          title: "路由名",
          key: "routeName",
          align: "center",
          slot: "alarm",
          width: 130
        },

        {
          title: "路由编码",
          key: "routeCode",
          align: "center",
          slot: "alarm",
          width: 150
        },
        {
          title: "服务编码",
          key: "serviceId",
          align: "center",
          slot: "alarm",
          width: 200
        },
        {
          title: "url",
          key: "url",
          align: "center",
          slot: "alarm",
          width: 200
        },
        {
          title: "启用",
          key: "enable",
          align: "center",
          slot: "alarm",
          width: 70
        },
        {
          title: "认证",
          key: "needAuth",
          align: "center",
          slot: "alarm",
          width: 70
        },
        {
          title: "认证方式",
          key: "authType",
          align: "center",
          slot: "alarm",
          width: 100
        },
        {
          title: "请求方式",
          key: "reqType",
          align: "center",
          slot: "alarm",
          width: 100
        },
        {
          title: "返回方式",
          key: "resType",
          align: "center",
          slot: "alarm",
          width: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 200,
          btn: {},
          selfBtn: [{ name: "详情", type: "primary", method: "on-check" },{ name: "编辑", type: "warning", method: "on-check" },{ name: "删除", type: "error", method: "on-check" }]
        }
      ],
      tableData: [
        {
          id: "1",
          routeName: "普通登录",
          routeCode: "account_login",
          serviceId:"ebiz-customer",
          url: "/customer/account/login",
          enable:"是",
          needAuth:"否",
          authType:"",
          reqType:"json",
          resType:"json"
        },{
          id: "2",
          routeName: "修改用户信息",
          routeCode: "customer_modify",
          serviceId:"ebiz-customer",
          url: "/customer/customer/modify",
          enable:"是",
          needAuth:"是",
          authType:"token",
          reqType:"json",
          resType:"json"
        }]
    };
  },
  created: function() {},
  mounted: function() {
    //列表展示
    this.obtainList();
  },
  computed: mapGetters({}),
  watch: {},
  methods: {


    createRoute(){
      var params={
            self:this,
            title:"新增路由",
            width:'50%',//默认600
            props:{id:1},//向表单传递的参数 一般为表单绑定的数据 可不传
            form:routeForm,//弹窗中的表单
            success:(res)=>{
              this.obtainList()
            },
            cancel:()=>{
              this.obtainList()
            }
      }
      this.$util.openModelForm(params);
    },


    cancelSave() {
      this.modelform = false;
    },
    //确定发布
    saveForm() {
      if (this.DEV) {
        this.$Message.info("发布规则成功");
        this.modelform = false;
      } else {
        this.$Message.info("请选择发布环境");
      }
    },

    //发布
    release() {
      this.modelform = true;
    },

    //新建
    createMo(row) {
      this.$router.push({ name: "rule" });
    },
    editMo(row, type) {
      console.log(row);
      this.$router.push({ name: "rule", query: { Id: row.id, type: type } });
    },
    //更改启用/停用状态
    updateState(row) {
      let self = this;
      if (row.isUse == 0) {
        row.isUse = 1;
      } else {
        row.isUse = 0;
      }
    },
    //获取列表
    obtainList() {
      var self = this;
      console.log(this.formValidate)
      this.$api
        .getRulsSelectApi(this.formValidate)
        .then(res => {
            console.log(res)
          if (res.respCode == 0) {
            // this.tableData = res.data.list;
            // this.tableData.sort((a,b)=>a.systemId-b.systemId);//升序
            this.total = res.data.count;
            // var obj = {};
            // for (let i = 0; i < res.data.list.length; i++) {
            //     self.ruleNameList.push({value:res.data.list[i].id,label:res.data.list[i].ruleName});
            // }
          } else {
            self.$Message.info("获取列表失败");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkMessage(params) {
      console.log(params,"");
       this.$router.push({ name: "orderDetails", query: { params: params } });
    },
    //分页
    changePage(page) {
      this.formValidate.page = page;
      this.obtainList();
    },
    //批量删除
    batchDelete() {
      var self = this;
      //判断是否有选中记录
      if (this.deleteObj.ids.length == 0) {
        self.$Message.info("请选择删除数据");
      } else {
        self.$Modal.confirm({
          title: "删除数据",
          content: "确认批量删除？",
          onOk: () => {
            var that = this;

            that.$api
              .deleteRules(this.deleteObj.ids)
              .then(res => {
                if (res.respCode == 0) {
                  self.$Message.info("删除成功");
                  this.obtainList();
                } else {
                  self.$Message.info("删除失败");
                }
              })
              .catch(error => {
                console.log(error);
              });
          },
          onCancel: () => {
            self.$refs.selectionTable.handleSelectAll(false);
          }
        });
      }
    },
    //删除
    deleteMo(row) {
      this.deleteObj.ids = [row.meetingId];
      var self = this;
      self.$Modal.confirm({
        title: "删除",
        content: "确定删除所选数据吗？",
        onOk: () => {
          var that = this;
          that.$api
            .meet_batchDelete(this.deleteObj)
            .then(res => {
              if (res.respCode == 0) {
                self.$Message.info("删除成功");
                this.obtainList();
              } else {
                self.$Message.info("删除失败");
              }
            })
            .catch(error => {
              console.log(error);
            });
        },
        onCancel: () => {}
      });
    },
    //查询
    serachMo() {
      this.obtainList();
    },
    //导出
    exportData() {
      // this.$refs.selectionTable.exportCsv({
      //     filename: '导出表格'
      // })
      window.location = "http://118.190.156.116:7001/insuranceOrder/downFile/3";
    },
    // 重置
    resertMo() {
      this.$refs["formValidate"].resetFields();
      this.formValidate.firstYear = "";
      this.formValidate.status = "";
      this.formValidate.saleChannel="";
      this.obtainList();
      // let data = {
      //     json: "1234567890sdfghjkl;"
      // };
      // this.$api.ceshi(data).then(res => {
      //
      // })
    },
    //获取选中行
    handleSelectRow(row) {
      this.deleteObj.ids = row.map(i => i.id);
    }
  },
  filters: {},
  components: {
    //注册组件
  }
};
</script>

<style lang='less'>
</style>

