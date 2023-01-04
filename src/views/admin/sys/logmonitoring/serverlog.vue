<template>
  <div id="loginlog-list" class="only-content">
    <!-- 顶部筛选 -->
    <div class="header">
      <div class="left">
        <Form ref="formInline" :model="params" inline :label-width="90">
          <FormItem prop="serverIp" label="服务器Ip">
           <DatePicker type="date"  style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem prop="status" label="状态">
            <Select v-model="params.status" style="width:180px" placeholder="请选择状态">
                    <!--              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.typename }}</Option>-->
                    <Option value="0" >停止</Option>
                    <Option value="1" >正常</Option>
                    <Option value="2" >异常</Option>
                </Select>
          </FormItem>
        </Form>
      </div>
      <div class="right">
        <Button @click="search(1)" class="ivu-btn ivu-btn-primary" style="margin-right:5px">查询</Button>
        <Button @click="reset()">重置</Button>
      </div>
    </div>
    <!-- 添加按钮 -->
    <!-- <div class="mb-10">
      <Button
        @click="addsyslog()"
        class="ivu-btn ivu-btn-primary"
        style="margin-bottom: 5px;width: 100px;"
      >新增登录日志</Button>
      
    </div> -->
    <!-- 列表 -->
    <div>
      <primaryTable
        :columns="columns"
        :data="tableList"
        ref="primaryTable"
        :total="5"
        @on-change="changePage"
        :loading="tableloading"
        :current.sync="params.page"
      ></primaryTable>
    </div>
    <!-- 添加系统日志弹框 -->
        <!-- <Modal v-model="modalForm" title="新增登录日志" :draggable="false" :loading="true" :closable="false" :width="700">
            <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="100" label-position="left">
                <Row>
                    <Col span="22" offset="1" class="model_html">
                   
                    <FormItem label="登录时间" prop="serverIp">
                       <DatePicker type="Date"  style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="登录人" prop="operaName">
                        <Input v-model="formData.operaName" />
                    </FormItem>

                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="doAdd">确定</Button>
                <Button type="primary" @click="close">关闭</Button>
            </div>
        </Modal> -->

  </div>
</template>

<script>
export default {
  data() {
    return {
      modalForm: false,
      formData: {
        name: ""
      },
      params: {
        pageSize: 10,
        page: 1,
        name: "",
        num:"",
        type: ""
      },
      tableloading: false,
      ruleValidate: {
        name: [
          this.$util.rules.required("请输入名称"),
          this.$util.rules.max(100, "输入限制100位")
        ]
      },
      searchParams: {},

      left: 24, //左侧表格比例
      tableList: [
       {
           serverIp:"119.29.29.29",
           status:"正常", 
           starttime:"2019/11/3 09:00:00",
           endtime:"2019/11/3 18:00:00",
           serverDate:"9"        
       },
        {
           serverIp:"180.76.76.76",
           status:"停止", 
            starttime:"2019/11/3 09:00:33",
           endtime:"2019/11/3 12:00:33",
           serverDate:"3"           
       },
        {
           serverIp:"115.159.157.26",
           status:"正常",
            starttime:"2019/11/2 09:00:40",
           endtime:"2019/11/3 18:00:40",
           serverDate:"33"              
       },
       {
           serverIp:"123.206.21.48",
           status:"异常",
            starttime:"2019/11/3 09:30:33",
           endtime:"2019/11/3 13:30:33",
           serverDate:"4"             
       },
       
       {
           serverIp:"156.154.70.1",
           status:"正常",
           starttime:"2019/11/3 09:00:33",
           endtime:"2019/11/3 18:00:33",
           serverDate:"9"         
       },
      ],
      total: 0,
      ids: [], //选中的id
      //表格
      columns: [
        {
          type: 'selection',
          width : 50,
          align: "center"
        },
        {
          title: "序号",
          type: 'index',
          width: 80,
          align: "center"
        },
        {
          title: "服务器Ip",
          key: "serverIp",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center"
        },
         {
          title: "开始时间",
          key: "starttime",
          align: "center"
        },
        {
          title: "结束时间",
          key: "endtime",
          align: "center"
        },
         {
          title: "运行时长",
          key: "serverDate",
          align: "center"
        },
        
        {
          title: "操作",
          slot: "action",
          align: "center",
          render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                          this.del(params.row.id);
                      }
                    }
                  },
                  "删除"
                ),
              
              ]);
          }
        }
      ],
      userInfo:JSON.parse(window.sessionStorage.getItem('userInfo')),
      importModal:false,
      file:null
    };
  },
  created: function() {
    // this.search(1);
  },
  mounted: function() {},
  watch: {},
  methods: {
    // addProtocol(id) {
    //   this.modalForm = true;
    //   if (id) {
    //     this.modalName = "编辑营业员";
    //   } else {
    //     this.modalName = "新增营业员";
    //   }
    // },
    //关闭弹窗
    close() {
      this.formData = {
        name: "",
        num: "",
      };
      this.modalForm = false;
    },
    // 获得列表
    search(page) {
      this.params.page = page ? page : 1;
      //注意：不能使用直接使用 this.params，因为根据 key-value 处理后的查询数据 下次查询还会存在
      let { pageSize, name, type } = this.params;
      let searchData = {
        pageSize: pageSize,
        page: page
      };
      if (this.params.key) {
        searchData[this.params.key] = this.params.value;
      }
      this.getList(searchData);
      this.searchParams = searchData;
    },
    //获取列表
    getList(searchData) {
      this.tableloading = true;
      //调用接口
      this.$api.getAgentList(searchData).then(res => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.tableList = res.data.records;
          this.total = res.data.total;
        } else {
          this.$Message.error(res.message);
        }
        this.tableloading = false;
      });
    },
     //新增系统日志方法
    // addsyslog() {
    //   this.modalForm = true;
    //   this.modalName = "新增系统日志";
    // },
    //重置
    reset() {
      this.params.num = "";
      this.params.name = "";
      this.params.type = "";
      this.search(1);
    },
    //删除
     del(id) {
                let data = {
                    ids: []
                }
                data.ids.push(id)
                let content = "确认删除吗？";
                this.$util.confirmDialog(this, "确认", content, self => {
                    this.$api.delCompetition(data).then(res => {
                        this.$Message.success("删除成功");
                        //this.search(1);
                    })
                });
            },
    doAdd(){},
    //换页
    changePage(page) {
      this.params.page = page;
      this.searchParams.page = page;
      this.getList(this.searchParams);
    },
     
   
  }
};
</script>

<style lang='less'>
#loginlog-list {
  .header {
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
    .left {
      width: 0px;
      flex-grow: 1;
    }
    .right {
      width: auto;
    }
  }
}

</style>
