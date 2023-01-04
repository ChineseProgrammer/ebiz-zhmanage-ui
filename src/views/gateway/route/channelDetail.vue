<template>
  <div class="only-content">
    
    <!-- <div class="main-detial">
          <p><label>id:</label><span>1</span></p>
          <p><label>渠道名:</label><span>默认渠道</span></p>
          <p><label>渠道编码:</label><span>api</span></p>
    </div>
    <div  style="margin-top: 10px">
          
           
     </div> -->
    <Form ref="formValidate"
      :model="formValidate"
      :label-width="100">
      <Row>
        <Col span="6">
        <FormItem label="子系统名"
          prop="subSystemName">
          <Input v-model="formValidate.orderId"
            placeholder="输入子系统名进行模糊查询" />
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="子系统编码"
          prop="subSystemCode">
          <Input v-model="formValidate.applicant"
            placeholder="输入子系统编码进行模糊查询"></Input>
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
        <Button @click="createMo()" type="success">添加子系统</Button>
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
        @subSystemDetail='subSystemDetail'
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
          title: "子系统名",
          key: "subSystemName",
          align: "center",
          slot: "alarm",
          width: 180
        },

        {
          title: "子系统编码",
          key: "subSystemCode",
          align: "center",
          slot: "alarm",
          width: 150
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 400,
          btn: {},
          selfBtn: [{ name: "详情", type: "primary", method: "subSystemDetail" },{ name: "编辑", type: "warning", method: "on-check" },{ name: "删除", type: "error", method: "on-check" }]
        }
      ],
      tableData: [
        {
          id: "1",
          subSystemCode: "customer",
          subSystemName: "客户子系统"
        },{
          id: "2",
          subSystemCode: "bi",
          subSystemName: "报表子系统"
        },{
          id: "3",
          subSystemCode: "sale",
          subSystemName: "新契约核保子系统"
        },{
          id: "4",
          subSystemCode: "claim",
          subSystemName: "理赔子系统"
        },{
          id: "5",
          subSystemCode: "reward",
          subSystemName: "积分系统"
        },{
          id: "6",
          subSystemCode: "renewal",
          subSystemName: "续期子系统"
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
    subSystemDetail(params){
      this.$router.push({ name: "subSystemDetail", query: { id:params.id } });
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

