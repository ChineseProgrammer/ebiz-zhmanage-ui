<template>
  <div>
    <Form
      ref="formValidate"
      :rules="ruleValidate"
      :model="formValidate"
      inline
      :label-width="80"
      class="search-form"
    >
      <Row>
        <Col span="8">
          <FormItem prop="channelCode" label="渠道标识">
            <Input
              v-model.trim="formValidate.channelCode"
              placeholder="支持英文与数字输入"
              maxlength="100"
            />
          </FormItem>
        </Col>
        <Col span="8" offset="2">
          <FormItem prop="channelName" label="渠道名称">
            <Input v-model.trim="formValidate.channelName" placeholder="请输入" maxlength="255" />
          </FormItem>
        </Col>
        <Col span="4" offset="2">
          <FormItem>
            <Button type="primary" @click="addChannel"
              >新增渠道并生成推广链接</Button
            >
          </FormItem>
        </Col>
      </Row>
    </Form>
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
    <vue-qr
      :logoSrc="imageUrl"
      class="this-img"
      style="visibility: hidden"
      :text="thisText"
      :size="200"
    ></vue-qr>
  </div>
</template>
<script>
import { dateTransfer} from "@/api/sm4";
import vueQr from "vue-qr";
import { deeppink } from "color-name";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      toolPic: "",
      thisText: "",
      imageUrl: null,
      formValidate: {
        channelCode: null,
        channelName: null,
      },
      tableList: [],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center",
        },
        { title: "渠道标识", key: "channelCode", width: 200, align: "center" },
        {
          title: "渠道名称",
          key: "channelName",
          width: 200,
          align: "center",
        },
        {
          title: "推广链接",
          // key: "popularizeLink",
          type: "action",
          minWidth: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  // disabled:params.row.disabled
                },
                attrs: {
                  value: params.row.popularizeLink,
                },
                style: {
                  width: "80%",
                  marginRight: "20px",
                  display:
                    params.row.disabled == true ? "none" : "inline-block",
                },
                on: {
                  "on-blur": (item) => {
                    // console.log(item.srcElement.value);
                    params.row.temporary = item.srcElement.value;
                    // params.row.disabled=!params.row.disabled;
                    // params.row.action="编辑";
                  },
                },
              }),
              h(
                "Div",
                {
                  props: {},
                  attrs: {},
                  style: {
                    width: "80%",
                    marginRight: "20px",
                    display:
                      params.row.disabled == false ? "none" : "inline-block",
                  },
                },
                params.row.popularizeLink
              ),
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
                      if (params.row.disabled) {
                        // 改为输入框显示
                        params.row.disabled = !params.row.disabled;
                        params.row.action = "保存";
                      } else {
                        //点击保存按钮，走接口接口保存成功转为div展示（是否调列表数据刷新接口）
                        let paramsLink = params.row.temporary;
                        if (paramsLink.length == 0){
                           this.$Message.error("推广链接地址不能为空");
                        }else if(paramsLink.length > 255) {
                          this.$Message.error("推广链接地址过长，请重新输入");
                        }else{
                          this.$api
                            .updateChannelLink({
                              id: params.row.id,
                              popularizeLink: params.row.temporary,
                            })
                            .then((res) => {
                              if (res.respCode == "0") {
                                params.row.disabled = !params.row.disabled;
                                params.row.popularizeLink =
                                  params.row.temporary;
                                params.row.action = "编辑";
                              } else {
                                this.$Message.error(res.message);
                              }
                            })
                            .catch((error) => {
                              this.$Message.error(error.message);
                            });
                        }
                      }
                    },
                  },
                },
                params.row.action
              ),
            ]);
          },
        },
        {
          title: "创建时间",
          key: "createdDate",
          width: 250,
          align: "center",
           render: (h, params) => {
            if (params.row.createdDate) {
              return h("div", dateTransfer(params.row.createdDate));
            }
          },
        },
        {
          title: "操作",
          type: "action",
          width: 350,
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h("div", [
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
                      this.lookPic(params.row);
                    },
                    "update-node": (params) => {
                      console.log(params);
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
              ),

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
                      this.copyUrl(params.row.popularizeLink);
                    },
                  },
                },
                "复制链接"
              ),
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
                      this.removeItem(params.row.id);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      paginationCustomer: {
        total: 0,
        page: 1,
        pageSize: 10,
      },
      ruleValidate: {
        channelCode: [
          { required: true, message: "请输入渠道标志", trigger: "blur" },
          {
            pattern: "^[a-zA-Z0-9]+$",
            message: "请输入英文或数字",
            trigger: "blur",
          },
        ],
        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  watch: {},
  methods: {
    fetchData(page = 1, pageSize = 10) {
      // 入参数据
      const reqData = {
        page,
        pagesize: this.paginationCustomer.pageSize,
      };
      this.$api
        .channelPage(reqData)
        .then((res) => {
          if (res.result == "0") {
            this.tableList = res.content.list;
            this.tableList.map((item, index) => {
              item.disabled = true;
              item.action = "编辑";
              item.temporary = item.popularizeLink;
            });
            // console.log(this.tableList);
            this.paginationCustomer.total = res.content.total;
            this.paginationCustomer.page = res.content.pageNum;
            this.paginationCustomer.pageSize = res.content.pageSize;
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$Message.error(error.message);
        });
    },
    beForePagination(thisPage = 1, thisPageSize = 10) {
      this.paginationCustomer.pageSize = thisPageSize;
      let { total, page } = this.paginationCustomer;
      if ((page - 1) * thisPageSize > total) {
        this.$nextTick(() => {
          this.fetchData(thisPage, thisPageSize);
        });
      } else {
        this.fetchData(thisPage, thisPageSize);
      }
    },
    addChannel() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let reqData = this.formValidate;
          this.$api
            .channelCreate(reqData)
            .then((res) => {
              if (res.result == "0") {
                this.formValidate = {
                  channelCode: null,
                  channelName: null,
                };
                this.fetchData();
              } else {
                this.$Message.success(res.message);
              }
            })
            .catch((error) => {
              this.$Message.success(error.message);
            });
        } else {
          this.$emit("error", "");
        }
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
    // 生成二维码
    lookPic(link) {
      this.thisText = link.popularizeLink;
      setTimeout(() => {
        let imgLength = document.querySelectorAll("img.this-img");
        this.toolPic = imgLength[0].currentSrc;
      }, 50);
    },
    // 下载二维码
    downCode(link) {
      this.thisText = link.popularizeLink;
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
    // 删除
    removeItem(data) {
      let content = "确认删除吗？";
      this.$util.confirmDialog(this, "确认", content, (self) => {
        this.$api
          .channelDelete({ ids: [data] })
          .then((res) => {
            this.$Message.success("删除成功");
            this.fetchData();
          })
          .catch((error) => {});
      });
    },
  },
  computed: {},
  components: {
    vueQr,
  },
};
</script>
<style lang="less" scoped>
.search-form {
  margin-bottom: 40px;
}
/deep/.ivu-row .ivu-form-item {
  width: 100%;
}
/deep/.ivu-btn-text:focus {
  box-shadow: 0 0 0;
}
</style>