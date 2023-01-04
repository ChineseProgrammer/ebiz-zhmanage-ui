<template>
  <div id="customer-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form :rules="ruleValidate" ref="search" :model="search">
        <!-- inline :label-width="110" -->
        <Row class="box--flex">
          <FormItem prop="productCode" label="产品名称">
            <Select
              clearable
              filterable
              v-model="search.productCode"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in productList"
                :value="item.productCode"
                :key="index"
                >{{ item.productName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="productId" label="产品版本名称">
            <Select
              clearable
              filterable
              v-model="search.productId"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in versionList"
                :value="item.id"
                :key="index"
                >{{ item.productVersionName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="productChannelId" label="渠道名称">
            <Select
              clearable
              filterable
              v-model="search.productChannelId"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in channelList"
                :value="item.id"
                :key="index"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem prop="productActivityId" label="活动名称">
            <Select
              clearable
              filterable
              v-model="search.productActivityId"
              placeholder="请选择"
            >
              <Option
                v-for="(item, index) in productActivityList"
                :value="item.id"
                :key="index"
                >{{ item.activityName }}</Option
              >
            </Select>
          </FormItem>
        </Row>
        <div class="search-btn">
          <Button
            v-if="isAdminCenter || button.addLink"
            @click="addLink"
            class="custom"
            >新增链接</Button
          >
          <Button @click="searchFun" type="primary" class="ml8">查询</Button>
          <Button @click="reset()">重置</Button>
        </div>
      </Form>
    </div>
    <Divider class="mv10" />
    <div>
      <primaryTable
        :columns="columns"
        :data="tableList"
        :current.sync="pagination.page"
        ref="teamTable"
        :total="pagination.total"
        :pageSize="pagination.pageSize"
        @on-change="fetchData"
        @on-page-size-change="beForePagination(1, ...arguments)"
      ></primaryTable>
      <vue-qr
        :logoSrc="imageUrl"
        class="this-img"
        style="visibility: hidden"
        :text="thisText"
        :size="200"
      ></vue-qr>
    </div>
  </div>
</template>

<script>
import vueQr from "vue-qr";
import Axios from "axios";
import addlink from "./form/addlink";
export default {
  data() {
    return {
      search: {
        productCode: "",
        versionId: "",
        productActivityId: "",
        productChannelId: "",
      },
      ruleValidate: {
        productChannelId: [
          { required: true, message: "请选择渠道名称", trigger: "change" },
        ],
        productActivityId: [
          { required: true, message: "请选择活动名称", trigger: "change" },
        ],
        productId: [
          { required: true, message: "请选择产品版本名称", trigger: "change" },
        ],
        productCode: [
          { required: true, message: "请选择产品名称", trigger: "change" },
        ],
      },
      productList: [],
      versionList: [],
      imageUrl: null,
      thisText: "",
      isAdminCenter: false,
      button: this.$store.state.app.button,
      //更新form查询条件
      agentTime: null,
      //form查询条件
      searchOld: {
        wxUserId: null,
        wxUserName: null,
        orgName: null,
        channelCode: null,
        createdDateEnd: null,
        createdDateStart: null,
        page: null,
        pageSize: null,
      },
      // 分页数据--队伍查询
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      queryPageSize: 10, //分页条数
      orgList: [], //首页推广人员管理机构
      channelList: [], //渠道list
      productActivityList: [],
      manageOrgList: [], //推广人员管理机构list
      tableList: [],
      total: 0,
      toolPic: null,
      //表格
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "产品链接",
          key: "productUrl",
          align: "center",
          minWidth: 220,
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center",
          minWidth: 90,
        },
        {
          title: "产品编码",
          key: "productCode",
          align: "center",
          minWidth: 50,
        },
        {
          title: "产品版本名称",
          key: "productVersionName",
          align: "center",
          minWidth: 50,
        },
        {
          title: "产品版式编码",
          align: "center",
          key: "productVersionCode",
          ellipsis: true,
          tooltip: true,
          minWidth: 80,
        },
        {
          title: "渠道名称",
          key: "productChannelName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "活动名称",
          key: "productActivityName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "操作",
          align: "center",
          key: "action",
          minWidth: 150,
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.copy_link) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: {},
                    on: {
                      click: () => {
                        this.copyUrl(params.row.productUrl);
                      },
                    },
                  },
                  "复制链接"
                )
              );
            }
            if (this.isAdminCenter || this.button.download_link) {
              arr.push(
                h(
                  "Poptip",
                  {
                    props: {
                      placement: "top",
                      transfer: true,
                      trigger: "hover",
                    },
                    on: {
                      "on-popper-show": () => {
                        // this.lookPic(params.row.wxUserId);
                        this.lookPic(params.row);
                      },
                    },
                  },
                  [
                    h(
                      "Button",
                      {
                        props: {
                          type: "text",
                          size: "small",
                        },
                        style: {},
                        on: {
                          click: () => {
                            // this.exportQrCode(params.row.wxUserId);
                            this.downCode(params.row);
                          },
                        },
                      },
                      "下载二维码"
                    ),
                    h("Img", {
                      slot: "content",
                      attrs: {
                        src: this.toolPic,
                        alt: "暂无二维码",
                      },
                      style: {
                        width: "100px",
                        height: "100px",
                      },
                    }),
                  ]
                )
              );
            }
             if (this.isAdminCenter || this.button.link_delete) {
              arr.push(
                h("Button", {
                  props: {
                    type: "text",
                      size: "small",
                  },
                  domProps: {
                    innerHTML: "删除",
                  },
                  on: {
                    click: () => {
                      this.delUser(params.row);
                    },
                  },
                })
              );
            }
            return h("div", arr);
          },
        },
      ],
      thisHrefs: null,
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
  },
  mounted: function () {
    this.getCompanyList();
    this.productAdvertisementInfoList();
    this.productAdvertisementChannelList();
    this.fetchData();
  },
  watch: {
    "search.productCode"(o) {
      if (o) {
        //查询产品版本名称
        this.$api
          .getByProductCode({
            productCode: o,
          })
          .then((res) => {
            if (res.respCode == "0") {
              this.versionList = res.data;
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          });
      } else {
        this.versionList = [];
      }
    },
    "search.productChannelId"(o) {
      if (o) {
        //查询活动名称
        this.$api
          .productAdvertisementActivityList({
            channelId: o,
          })
          .then((res) => {
            if (res.respCode == "0") {
              this.productActivityList = res.data;
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          });
      } else {
        this.productActivityList = [];
      }
    },
  },
  methods: {
     delUser(row,) {
      let content = this.$t("deleteTit");
      let params = { ids: [], systemType: 0 };
      if (row) {
        params.ids.push(row.id);
      }
      let method="productAdvertisementUrlbatchDelete"
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api[method](params).then((res) => {
          if (res.result == 0) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
              self.fetchData();
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    //   新增链接
    async addLink() {
      let props = {},
        title = "新增链接";
      this.$refs.search.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.$util.confirmDialog(
            this,
            "确认",
            "请确认是否新增链接？",
            (self) => {
              //
              this.channelList.map((i)=>{
                if(i.id==this.search.productChannelId){
                  this.search.channelCode=i.channelCode
                }
              })
              this.productActivityList.map((i)=>{
                if(i.id==this.search.productActivityId){
                  this.search.activityCode=i.activityCode
                }
              })
              this.$api
                .productAdvertisementUrlCreate(this.search)
                .then((res) => {
                  if (res.code == 0 || res.result - 0 == 0) {
                    this.$Message.success("新增成功");
                    this.search.page = 1;
                    this.fetchData();
                  } else {
                    this.$Message.error(res.message);
                  }
                });
            }
          );
        } else {
          this.$emit("error", "");
        }
      });
    },
    // 渠道推广
    promotion() {
      this.$router.push({
        name: "customerChannel",
      });
    },
    // 删除
    removeItem(data) {
      let content = "确认删除吗？";
      this.$util.confirmDialog(this, "确认", content, (self) => {
        this.$api
          .linkDelete({ ids: [data] })
          .then((res) => {
            if (res.result == "0") {
              this.$Message.success(
                res.resultMessage ? res.resultMessage : res.message
              );
              this.fetchData();
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          })
          .catch((error) => {
            this.$Message.error(
              error.resultMessage ? error.resultMessage : error.message
            );
          });
      });
    },
    // 复制
    copyUrl(data) {
      if (data == null) {
        this.$Message.error("此条数据无链接地址");
        return;
      }
      var url = data;
      var oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$Message.success("复制成功", url);
    },
    // // 查看图片
    // lookPic(code){
    //  this.$api.qrCode({ wxUserId: code }).then(res=>{
    //    if(res.result==0){
    //       // this.toolPic=res.content.wxCodeImgUrl;
    //       this.toolPic=res.content;
    //    }else{
    //      this.toolPic="暂无数据";
    //    }
    //  }).catch((error)=>{
    //    this.toolPic="暂无数据";
    //  })
    // },
    // dataURLtoBlob (dataurl, filename) {
    //   let arr = dataurl.split(",");
    //   let mime = arr[0].match(/:(.*?);/)[1];
    //   let bstr = atob(arr[1]);
    //   let n = bstr.length;
    //   let u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   return new Blob([u8arr], { type: mime });
    // },
    // 生成二维码
    lookPic(link) {
      this.thisText = link.productUrl;
      setTimeout(() => {
        let imgLength = document.querySelectorAll("img.this-img");
        // debugger;
        console.log(imgLength);
        this.toolPic = imgLength[0].currentSrc;
      }, 50);
    },
    // 下载二维码
    downCode(link) {
      this.thisText = link.productUrl;
      let imgLength = document.querySelectorAll("img.this-img");
      let a = document.createElement("a");
      a.href = imgLength[0].currentSrc;
      a.target = "_blank";
      a.style.display = "none";
      a.download = imgLength[0].id + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    // // 下载二维码
    // exportQrCode(code) {
    //   this.$util.showLoading();
    //   this.$api
    //     .qrCode({ wxUserId: code })
    //     .then(res => {
    //       this.$util.hideLoading();
    //           let result=res.content;
    //           let elink = document.createElement("a");
    //           elink.download =  code+".png";
    //           elink.style.display = "none";
    //           elink.target = "_blank";
    //           let blob = this.dataURLtoBlob(result);
    //           elink.href = URL.createObjectURL(blob);
    //           elink.href = result;
    //           document.body.appendChild(elink);
    //           elink.click();
    //           document.body.removeChild(elink);
    //     })
    //     .catch(error => {
    //       this.$Message.error(
    //         error.resultMessage ? error.resultMessage : error.message
    //       );
    //     });
    // },
    /**
     * @description: 导出
     * @author: L.R.H
     * @date: 2020-09-23 11:06:06
     */
    exportAll() {
      this.$util.showLoading();
      //入参对象
      let obj = this.searchOld;
      this.$api
        .linkExport({})
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "推广链接.xlsx";
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
    //获取产品名称
    productAdvertisementInfoList() {
      this.$api.productAdvertisementInfoList({}).then((res) => {
        if (res.respCode == "0") {
          this.productList = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //获取公司机构
    getCompanyList() {
      this.$api.linkOrg({}).then((res) => {
        if (res.respCode == "0") {
          this.orgList = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    // 获取渠道名称
    productAdvertisementChannelList() {
      this.$api.productAdvertisementChannelList({}).then((res) => {
        if (res.code == 0 || res.result - 0 == 0) {
          this.channelList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    beForePagination(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { total, page } = this.pagination;
      if ((page - 1) * queryPageSize > total) {
        this.$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    //查询
    searchFun() {
      this.search.versionId = this.search.productId;
      this.searchOld = this.$util.convertObj(this.search);
      this.fetchData();
    },
    // 分页
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchOld,
        page,
        pageSize: this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.productAdvertisementUrlList(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableList = res.content.list;
          //分页数据
          this.pagination.total = res.content.total;
          this.pagination.page = res.content.pageNum;
          this.pagination.pageSize = res.content.pageSize;
          this.tableList.map((table, index) => {
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
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //重置
    reset() {
      this.search = {
        productCode: "",
        versionId: "",
        productActivityId: "",
        productChannelId: "",
        productId: "",
      };
      this.agentTime = null;
      this.$refs.search.resetFields();
      this.searchFun();
    },
  },
  computed: {},
  components: { addlink, vueQr },
};
</script>
<style lang="less" scoped>
/deep/.ivu-modal-header {
  border-bottom: 0px !important;
  line-height: 43px;
  /deep/.ivu-modal-header-inner {
    display: inline-block;
    vertical-align: middle;
    margin-left: 12px;
    font-size: 16px;
    color: #17233d;
    font-weight: 700;
  }
}
#customer-list {
  .box--flex {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    /deep/.ivu-form-item {
      margin-right: 30px;
      /deep/.ivu-form-item-content {
        display: inline-block;
        .ivu-select-dropdown {
          overflow: auto;
          width: 100%;
        }
      }
    }
  }
  .search-btn {
    text-align: right;
    min-width: 250px;
  }
  .action-button {
    margin-bottom: 20px;
    /deep/button.custom {
      color: #2d8cf0;
      border-color: #2d8cf0;
    }
  }
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  .mt--20 {
    margin-top: 20px;
  }
  .ivu-form-item {
    // margin-bottom: 30px;
  }
}
</style>
