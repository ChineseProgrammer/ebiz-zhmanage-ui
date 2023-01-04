<template>
  <div class="content-manage">
    <Form
      :model="searchTable"
      inline
      :label-width="65"
      class="table-search-block"
    >
      <Row :gutter="0" type="flex" justify="end" justify-content="flex-end">
        <Col span="5">
          <FormItem label="选择状态">
            <Select
              filterable
              clearable
              v-model="searchTable.contentStatus"
              palceholder="请选择"
            >
              <Option value="all">全部</Option>
              <Option
                v-for="(item, index) in stateList"
                :value="item.val"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="播放标识">
            <Select
              filterable
              clearable
              v-model="searchTable.contentCorner"
              palceholder="请选择"
            >
              <Option value="all">全部</Option>
              <Option
                v-for="(item, index) in playTagList"
                :value="item.val"
                :key="index"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="选择日期">
            <DatePicker
              type="daterange"
              placement="bottom-end"
              placeholder="请选择"
              v-model="searchTime"
              @on-change="changeTime"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="标题">
            <Input
              search
              @on-search="searchFun"
              enter-button
              placeholder="请输入标题"
              v-model="searchTable.contentTitle"
              class="table-select"
            />
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div>
      <primaryTable
        :columns="columns"
        @on-sort-change="sortChange"
        :data="tableList"
        :current.sync="pagination.page"
        ref="contentTable"
        :total="pagination.total"
        :pageSize="pagination.pageSize"
        :highlight-row="true"
        @on-change="fetchData"
        @on-page-size-change="beForePagination(1, ...arguments)"
      ></primaryTable>
    </div>
  </div>
</template>
<script>
export default {
  name: "calendarConfige",
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      isAdminCenter: false,
      button: this.$store.state.app.button,
      index: null,
      pagination: {
        page: 1,
        total: 0,
        pageSize: 5,
      },
      queryPageSize: 5, //分页条数
      selectTable: [],
      tableList: [],
      columns: [
        {
          title: "选择日期",
          key: "markDate",
          minWidth: 100,
          sortable: true,
          align: "center",
          render: (h, params) => {
            let arr = [];
            arr.push(
              h(
                "div",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: { display: params.row.isText },
                  on: {
                    click: () => {
                      params.row.isText = "none";
                      params.row.isShow = "block";
                      let date = new Date();
                      let year = date.getFullYear();
                      let month = date.getMonth() + 1;
                      let day = date.getDate();
                      let myDate = year + "-" + month + "-" + day;
                        this.$api
                          .getMarkDate({
                            date: myDate,
                          })
                          .then((res) => {
                            if ((res.result = "0") && res.code != 500) {
                              params.row.disableDate = res.content;
                            } else {
                              this.$Message.error(
                                res.resultMessage
                                  ? res.resultMessage
                                  : res.message
                              );
                            }
                          });
                    },
                  },
                },
                params.row.markDate
              )
            );
            arr.push(
              h("DatePicker", {
                props: {
                  type: "date",
                  placeholder: "选择日期",
                  placement: "top",
                  value: params.row.markDate,
                  transfer: true,
                  size: "small",
                  editable: false,
                  open: params.row.isShow == "block" ? true : false,
                  clearable: false,
                  options: {
                    disabledDate: (date) => {
                      //当前年份
                      var DateYear = date.getFullYear();
                      //当前月份
                      var DateMonth =
                        date.getMonth() + 1 < 10
                          ? "0" + (date.getMonth() + 1)
                          : date.getMonth() + 1;
                      //当前日期
                      var DateDay =
                        date.getDate() < 10
                          ? "0" + date.getDate()
                          : date.getDate();
                      // 将所获得的日期拼接起来，格式为YY-MM-DD
                      var FullDate = DateYear + "-" + DateMonth + "-" + DateDay;
                      //判断，日期禁用
                      if (params.row.disableDate.indexOf(FullDate) != -1) {
                        return DateDay;
                      }
                    },
                  },
                },
                style: {
                  display: params.row.isShow,
                },
                on: {
                  click: () => {},
                  "on-open-change": (val) => {
                    params.row.isShow = val ? "block" : "none";
                    params.row.isText = val ? "none" : "block";
                  },
                  "on-change": (event) => {
                    // params.row.markDate = event;
                    let reqData = {
                      contentId: params.row.contentId,
                      markDates: [event],
                    };
                    this.$api
                      .updateMarkDate(reqData)
                      .then((res) => {
                        if ((res.result = "0") && res.code != 500) {
                          params.row.isText = "block";
                          params.row.isShow = "none";
                          this.$Message.success("日期更新成功");
                          this.searchFun();
                        } else {
                          this.$Message.error(
                            res.resultMessage ? res.resultMessage : res.message
                          );
                        }
                      })
                      .catch((error) => {
                        this.$Message.error(
                          error.resultMessage
                            ? error.resultMessage
                            : error.message
                        );
                      });
                  },
                },
              })
            );
            return h("div", arr);
          },
        },
        {
          title: "ID",
          key: "contentCode",
          minWidth: 100,
          align: "center",
        },
        {
          title: "标题",
          key: "contentTitle",
          minWidth: 200,
          align: "center",
        },
        // {
        //   title: "日历播放标签",
        //   key: "calendatType",
        //   minWidth: 100,
        //   align: "center",
        // },
        {
          title: "播放标识",
          key: "contentCorner",
          minWidth: 100,
          align: "center",
        },

        {
          title: "状态",
          key: "contentStatusText",
          width: 100,
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.clearDateButton) {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                    },
                    style: { color: "#ee0a24" },
                    on: {
                      click: () => {
                        params.row.isText = "block";
                        params.row.isShow = "none";
                        this.clearDate(params.row);
                      },
                    },
                  },
                  "清空日期"
                )
              );
            }
            return h("div", arr);
          },
        },
      ],
      curOrder: "",

      pageData: [],
      searchTime: [],
      searchTable: {
        calendatType: null, // 播放标签
        contentCorner: null, //	播放标识
        contentStatus: null, //内容状态
        markDateEnd: null, //创建时间查询结束
        markDateStart: null, //	创建时间查询开始
        contentTitle: null, //标题
      },
      searchTableOld: {
        calendatType: null, // 播放标签
        contentCorner: null, //	播放标识
        contentStatus: null, //内容状态
        markDateEnd: null, //创建时间查询结束
        markDateStart: null, //	创建时间查询开始
        contentTitle: null, //标题
      },
      stateList: [
        {
          name: "草稿",
          val: "0",
        },
        {
          name: "发布",
          val: "1",
        },
        {
          name: "下架",
          val: "2",
        },
      ],
      //播放标签
      playTagList: [
        {
          name: "预告",
          val: "预告",
        },
        {
          name: "进行中",
          val: "进行中",
        },
        {
          name: "回放",
          val: "回放",
        },
      ],
    };
  },
  create() {},
  mounted() {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (
      !this.button.editContentManage &&
      !this.button.cmsContentRelease &&
      !this.button.cmsContentOut &&
      !this.button.cmsContentMore
    ) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    if (sessionStorage.getItem("contentShow")) {
      sessionStorage.removeItem("contentShow");
    }
    this.searchFun();
  },
  computed: {},
  watch: {},
  components: {},
  methods: {
    sortChange(data) {
      if (data.order == "normal") {
        this.curOrder = "";
      } else if (data.order == "desc") {
        this.curOrder = "DESC";
      } else if (data.order == "asc") {
        this.curOrder = "ASC";
      }
      this.searchFun();
    },
    changeTime(val) {
      this.searchTable.markDateStart = new Date(this.searchTime[0]).getTime();
      this.searchTable.markDateEnd = new Date(this.searchTime[1]).getTime();
    },

    searchFun() {
      this.searchTableOld = this.$util.convertObj(this.searchTable);
      if (this.searchTableOld.contentStatus === "all") {
        this.searchTableOld.contentStatus = "";
      }
      this.searchTableOld.calendatType =
        this.searchTableOld.calendatType === "all"
          ? ""
          : this.searchTableOld.calendatType;
      this.searchTableOld.contentCorner =
        this.searchTableOld.contentCorner === "all"
          ? ""
          : this.searchTableOld.contentCorner;
      this.fetchData();
    },

    fetchData(page = 1, pageSize = 5) {
      // 入参
      const reqData = {
        ...this.searchTableOld,
        page,
        pageSize: this.queryPageSize,
      };
      this.$api
        .getCalendarList(reqData)
        .then((res) => {
          if (res.result == "0") {
            this.pageData = res.content.list;
            this.tableList = res.content.list.map((item) => {
              const filterVal = this.stateList.filter(
                (items) => items.val == item.contentStatus
              );
              item.contentStatusText =
                filterVal.length > 0 ? filterVal[0].name : null;

              item.isShow = "none";
              item.isText = "block";
              item.disableDate = [];
              item.markDate = !item.markDate ? "——" : item.markDate;
              return item;
            });
            this.pagination.pageSize = res.content.pageSize;
            this.pagination.total = res.content.total;
            this.pagination.page = res.content.pageNum;
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch((err) => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
    },
    beForePagination(queryPage = 1, queryPageSize = 5) {
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
    // 清空日期
    clearDate(data) {
      let params = [data.id];
      this.$api.clearMarkDate(params).then((res) => {
        if ((res.result = "0") && res.code != 500) {
          this.$Message.success("清空成功");
          this.searchFun();
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.table-search-block {
  padding: 5px;
  background-color: rgba(242, 242, 242, 1);
  height: 45px;
  margin-bottom: 20px;
}
</style>