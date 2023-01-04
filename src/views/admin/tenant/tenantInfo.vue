<template>
  <div id="team-list" class="only-content">
    <!-- 顶部筛选 -->
    <div class="header">
      <div class="left">
        <Form ref="formInline" :model="params" inline :label-width="90">
<!--          <FormItem prop="type" label="管理机构">-->
<!--            <Select v-model="params.type" style="width:180px" placeholder="请选择分类">-->
<!--              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.typename }}</Option>-->
<!--            </Select>-->
<!--          </FormItem>-->
          <FormItem prop="name" label="租户名称">
            <Input v-model="params.name" />
          </FormItem>
          <FormItem prop="num" label="租户编号">
            <Input v-model="params.num" />
          </FormItem>
          <FormItem prop="level" label="租户类型">
            <Select v-model="params.level" style="width:180px" placeholder="请选择分类">
<!--              <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.typename }}</Option>-->
              <Option >保险公司</Option>
              <Option >公司机构</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="right">
        <Button @click="search(1)" class="ivu-btn ivu-btn-primary" style="margin-right:5px">查询</Button>
        <Button @click="reset()">重置</Button>
      </div>
    </div>
    <div>
      <primaryTable
        :columns="columns"
        :data="tableList"
        ref="primaryTable"
        :total="3"
        @on-change="changePage"
        :loading="tableloading"
        :current.sync="params.page"
        @on-selection-change="select"
      ></primaryTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
          companyCode: "1111",
          companyName: "隽天",
          status: "1",
          contactPeople:"管月",
          contactPhone : "15997186261",
          email: "xietianguanyue@163.com",
          address: "上海市黄浦区广东路500号三层",
          paymenttime: '2019-11-03',
          companyType : "",
          usingTime : "",
          payTime : "",
          companyId: ""
      },
      modalForm: false,
      modalName: "",
      typeList: [{ id: 1, name: "影视代金" }, { id: 2, name: "分类2" }],
      params: {
        pageSize: 10,
        page: 1,
        name: "",
        num:"",
        level:"",
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
        selection : [],
      left: 24, //左侧表格比例
      tableList: [
          {
            companyCode: 'DX3906',
            companyName: '隽天',
            contactPeople: '管月',
            contactPhone: '15997186261',
            paymenttime: '2019-11-03',
            endTime: '2019-11-22',
            status: '启用'
          },
          {
            companyCode: 'DX3907',
            companyName: '富卫',
            contactPeople: '桂念双',
            contactPhone: '15997186261',
            paymenttime: '2019-11-03',
            endTime: '2019-11-22',
            status: '启用'
          },
                    {
            companyCode: 'DX3908',
            companyName: '新诚',
            contactPeople: '奚宏儒',
            contactPhone: '15071271411',
            paymenttime: '2019-11-03',
            endTime: '2019-11-22',
            status: '启用'
          }
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
          type: "index",
          width : 80,
          align: "center"
        },

        {
          title: "租户编号",
          key: "companyCode",
          align: "center"
        },
        {
          title: "租户名称",
          key: "companyName",
          align: "center"
        },
        {
          title: "联系人",
          key: "contactPeople",
          align: "center"
        },
        {
          title: "联系电话",
          key: "contactPhone",
          align: "center"
        },
        {
          title: "缴费时间",
          key: "paymenttime",
          align: "center"
        },
        {
          title: "租户类型",
          key: "companyType",
          align: "center",
            render:(h,params) =>{
                return h('div',params.row.companyType == '1' ? '保司' : '经代')
            }
        },
        {
          title: "到期时间",
          key: "endTime",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
        },
        {
          title: "操作",
          slot: "action",
          width: 230,
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
                      this.$router.push('tenantManage-detail')
                    }
                  }
                },
                "查看"
              ),
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "primary",
              //       size: "small"
              //     },
              //     style: {
              //       marginRight: "5px"
              //     },
              //     on: {
              //       click: () => {
              //         this.toTeamDetail(params.row.id);
              //       }
              //     }
              //   },
              //   "删除"
              // ),
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
                            this.updateStatus(params.row);
                          }
                        }
                      },
                      "停用"
              )
            ]);
          }
        }
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo"))
    };
  },
  created: function() {
    //  this.search(1);
  },
  mounted: function() {},
  watch: {},
  methods: {
      dateChange1(date){
          this.formData.payTime = date
      },
      updateStatus(row) {
          let status;
          if (row.status == 1) {
              status = 0;
          } else {
              status = 1;
          }
          let input = {
              companyId: row.companyId,
              status : status
          }
          this.$api.updateCompanyStatus(input).then(res => {
              this.close()
              if (res.respCode == 0) {
                  this.$Message.success("修改成功");
                  this.search(1);
              } else {
                  this.$Message.error(res.message);
              }
          });
      },
    // 获得列表
    search(page) {
      this.params.page = page ? page : 1;
      //注意：不能使用直接使用 this.params，因为根据 key-value 处理后的查询数据 下次查询还会存在
      let { pageSize, name, type } = this.params;
      let searchData = {
        pageSize: pageSize,
          pageNum: page,
          data : {}
      };
      // if (this.params.key) {
      //   searchData[this.params.key] = this.params.value;
      // }
      console.log(searchData)
      this.getList(searchData);
      this.searchParams = searchData;
    },

      //选择checkbox
      select(selection){
          this.selection = selection
      },
      //删除
      del(){
          if(this.selection.length>0){
              this.selection.map(item => {
                  this.ids.push(item.companyId)
              })
              let input = {
                  ids : this.ids
              }
              this.$api.companyBatchDelete(input).then(res => {
                  if (res.respCode == 0) {
                      this.$Message.success("删除成功");
                      this.search(1);
                  } else {
                      this.$Message.error(res.message)
                  }
                  this.ids = [];
              });
          }else{
              this.$Message.error("请至少选择一条数据");
          }
          console.log(this.ids)
      },
    //获取列表
    getList(searchData) {
      this.tableloading = true;
      //调用接口
      this.$api.companyPage(searchData).then(res => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.tableList = res.data.records;
          this.total = res.data.total;
        } else {
          this.$Message.error(res.message);
        }
        this.tableloading = false;
      });
    },
    //重置
    reset() {
      this.params.name = "";
      this.params.num = "";
      this.params.level = "";
      this.params.type = "";
      this.search(1);
    },
    //换页
    changePage(page) {
      this.params.page = page;
      this.searchParams.page = page;
      this.getList(this.searchParams);
    },
    //新增/编辑弹窗部分
    //新增
    addTeam() {
      this.modalForm = true;
      this.modalName = "新增租户";
    },
    //附件详情
    editTeam(id) {
      this.modalForm = true;
        this.$api.getCompany(id).then(res => {
            if (res && res.data) {
                res.data.companyType = res.data.companyType.toString();
                res.data.status = res.data.status.toString();
            }
            this.formData = res.data;
        });
      this.modalName = "编辑租户";
    },
    //关闭弹窗
    close() {
      this.formData = {
        name: "",
        num: "",
      };
      this.modalForm = false;
    },
    doAdd() {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
            if (this.formData.companyId) {
                this.$api.updateTeam(this.formData).then(res => {
                    this.close()
                    if (res.respCode == 0) {
                        this.$Message.success("修改成功");
                        this.search(1);
                    } else {
                        this.$Message.error(res.message);
                    }
                });

            } else {
                this.$api.addTeam(this.formData).then(res => {
                    this.close()
                    if (res.respCode == 0) {
                        this.$Message.success("新增成功");
                        this.search(1);
                    } else {
                        this.$Message.error(res.message);
                    }
                });

            }
        }
    })

    },
    //查看团队成员
    toMember(id) {
      this.$router.push({
        name: "member-list",
        query: { id: id }
      });
    },
    //查看团队信息
    toTeamDetail(id) {

    }
  }
};
</script>

<style lang='less'>
#team-list {
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
