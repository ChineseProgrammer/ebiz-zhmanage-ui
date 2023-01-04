<template>
  <div class="content-manage">
    <div class="left-tree-content">
      <div style="position: relation">
        <Input
          placeholder="请输入名称"
          v-model.trim="searchWordTree"
          class="tree-select"
        />
        <Button
          type="primary"
          @click="searchTree"
          style="display: inline-block; position: absolute"
        >
          <Icon type="ios-search-outline" />
        </Button>
      </div>
      <div style="height: 400px; overflow-y: auto">
        <Tree
          ref="tree"
          :render="renderContent"
          :data="treeData && treeData.length > 0 ? treeData : []"
          @on-select-change="clickTree"
        ></Tree>
      </div>
    </div>
    <div class="right-table-content">
      <div class="head-block">全部</div>
      <Divider />
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
                  v-for="(item, index) in chooseList"
                  :value="item.val"
                  :key="index"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="推荐类型">
              <Select
                filterable
                clearable
                v-model="searchTable.advertType"
                placeholder="请选择"
              >
                <Option
                  v-for="(item, index) in typeList"
                  :value="item.val"
                  :key="index"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="创建时间">
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
                v-model="searchTable.title"
                class="table-select"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="active-line">
        <span
          v-if="isAdminCenter || button.addContentManage"
          class="add-new"
          @click="addContent"
        >
          <span>+</span>新增内容
        </span>
        <span
          style="color: red; cursor: pointer; margin-left: 20px"
          @click="addCalendar"
          v-if="chooseDateFlag == '033' && button.calendarConfig"
        >
          日历配置
        </span>
        <div class="right-select">
          <Row :gutter="16">
            <Col span="8">
              <Select
                filterable
                clearable
                placeholder="改变状态"
                v-model="screenState"
                @on-change="changeState"
              >
                <Option
                  v-for="(item, index) in chooseList"
                  :key="index"
                  :value="item.val"
                  >{{ item.name }}</Option
                >
              </Select>
            </Col>
            <Col span="8">
              <Select
                filterable
                clearable
                placeholder="选择操作"
                v-model="screenActive"
                @on-change="changeActive"
              >
                <Option
                  v-for="(item, index) in activeList"
                  :key="index"
                  :value="item.val"
                  >{{ item.name }}</Option
                >
              </Select>
            </Col>
            <Col span="8">
              <Select
                filterable
                clearable
                placeholder="改变推荐类型"
                v-model="screenType"
                @on-change="changeType"
              >
                <Option value="1">首推</Option>
                <Option value="2">取消首推</Option>
                <Option value="3">栏目推荐</Option>
                <Option value="4">取消栏目推荐</Option>
              </Select>
            </Col>
          </Row>
        </div>
      </div>
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
          :row-class-name="rowClassName"
          @on-row-click="handleRowClick"
          @on-change="fetchData"
          @on-page-size-change="beForePagination(1, ...arguments)"
          @on-select="selectObj"
          @on-select-cancel="selectObj"
          @on-select-all="selectObj"
          @on-select-all-cancel="selectObj"
        ></primaryTable>
      </div>
    </div>
    <!-- 二维码弹框 -->
    <Modal
      v-model="modal1"
      :title="qrText"
      :mask-closable="false"
      footer-hide
      style="text-align: center"
    >
      <vue-qr
        :logoSrc="imageUrl"
        :text="qrCodePic"
        :size="200"
        :correctLevel="3"
      ></vue-qr>
    </Modal>
    <!-- 审核记录弹框 -->
    <Modal
      v-model="recordListModal"
      title="审核记录"
      :mask-closable="false"
      footer-hide
      :width="850"
    >
      <Timeline v-if="recordConList && recordConList.length > 0">
        <TimelineItem
          v-for="(item, index) in recordConList"
          :key="index"
          :color="item.auditResult == 1 ? 'red' : 'blue'"
          class="timelineStyle"
        >
          <p>
            审核结果：
            <span
              :class="[
                'resultStyle',
                item.auditResult == 1 ? 'redStyle' : 'blueStyle',
              ]"
            >
              {{
                item.auditResult == 0
                  ? "通过"
                  : item.auditResult == 1
                  ? "不通过"
                  : ""
              }}</span
            >
            <span class="resultStyle">提交人：{{ item.commitUser }}</span>
            <span class="resultStyle">提交时间：{{ item.commitDate }}</span>
            <span class="resultStyle">审核人：{{ item.auditUser }}</span>
            <span class="resultStyle">审核时间：{{ item.auditDate }}</span>
          </p>
          <p v-if="item.auditResult == 1">原因描述:{{ item.reason }}</p>
        </TimelineItem>
      </Timeline>
      <div v-else style="width: 100%; text-align: center">暂无记录</div>
    </Modal>
  </div>
</template>
<script>
import vueQr from "vue-qr";
export default {
  name: "contentManagement",
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      isAdminCenter: false,
      button: this.$store.state.app.button,
      index: null,
      searchWordTree: "",
      screenState: "",
      screenActive: "",
      screenType: "",
      pagination: {
        page: 1,
        total: 0,
        pageSize: 5,
      },
      queryPageSize: 5, //分页条数
      selectTable: [],
      tableList: [],
      columns: [],
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "ID",
          key: "contentCode",
          minWidth: 100,
          align: "center",
        },
        {
          title: "标题",
          key: "title",
          minWidth: 200,
          align: "center",
        },
        {
          title: "内容类型",
          key: "contentType",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.contentType == "travel_detail") {
              return h("div", "图文");
            }
          },
        },
        {
          title: "推荐类型",
          key: "advertList",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let arr = [];
            for (var i in params.row.advertList) {
              arr.push(
                h(
                  "div",
                  {
                    props: {
                      size: "small",
                    },
                    class: ["recommend-style"],
                    style: {},
                  },
                  params.row.advertList[i]
                )
              );
            }
            return h("div", arr);
          },
        },
        {
          title: "所属栏目",
          key: "channelList",
          width: 100,
          align: "center",
          render: (h, params) => {
            let arr = [];
            for (var i in params.row.channelList) {
              arr.push(
                h(
                  "div",
                  {
                    props: {
                      size: "small",
                    },
                    class: ["classId-style"],
                    style: {},
                  },
                  params.row.channelList[i]
                )
              );
            }
            return h("div", arr);
          },
        },
        {
          title: "状态",
          key: "contentStatusText",
          width: 100,
          align: "center",
        },
        {
          title: "排序",
          key: "sort",
          sortable: "custom",
          width: 100,
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
                    },
                  },
                },
                params.row.sort
              )
            );
            arr.push(
              h("InputNumber", {
                props: {
                  value: Number(params.row.sort),
                  min: 0,
                  step: 1,
                  precision: 0,
                  parser: (value) => `${value}`.replace(/$s?|(,*)/g, ""),
                },
                style: {
                  display: params.row.isShow,
                },
                on: {
                  click: () => {},
                  "on-focus": () => {},
                  "on-change": (event) => {
                    params.row.showSort = event;
                  },
                  "on-blur": () => {
                    params.row.isText = "block";
                    params.row.isShow = "none";
                    let reqData = JSON.parse(
                      JSON.stringify(this.pageData[params.index])
                    );
                    reqData.sort = params.row.showSort;
                    this.$api
                      .updateSortContent(reqData)
                      .then((res) => {
                        if ((res.result = "0") && res.code != 500) {
                          this.$Message.success("排序更新成功");
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
          title: "创建人",
          key: "createdUser",
          width: 100,
          align: "center",
        },
        {
          title: "创建时间",
          key: "createdDate",
          width: 150,
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.auditRecordBtn) {
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
                        this.checkRecordList(params.row);
                      },
                    },
                  },
                  "审核记录"
                )
              );
            }
            if (this.isAdminCenter || this.button.privewButton) {
              if (params.row.contentStatus == 3) {
                arr.push(
                  h(
                    "Tag",
                    {
                      props: {
                        color: "blue",
                      },
                      style: {},
                      nativeOn: {
                        click: () => {
                          this.qrCode(params.row,'cont');
                        },
                      },
                    },
                    "预览"
                  )
                );
              } else {
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
                          this.changePrivew(params.row);
                        },
                      },
                    },
                    "预览"
                  )
                );
              }
            }
            if (this.isAdminCenter || this.button.editContentManage) {
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
                        sessionStorage.setItem(
                          "contentShow",
                          JSON.stringify(params.row)
                        );
                        this.$router.push({
                          name: "editContentManage",
                          query: {
                            id: params.row,
                          },
                        });
                      },
                    },
                  },
                  "编辑"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentRelease) {
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
                        if (params.row.contentStatus == 4) {
                          this.$Modal.confirm({
                            title: "确认发布",
                            content:
                              "<p>当前内容正在审核中，点击确定将发布内容并完结审核流程</p>",
                            onOk: () => {
                              this.postInterface(this.$api.releasedStatus, [
                                params.row.id,
                              ]);
                            },
                          });
                        } else {
                          this.postInterface(this.$api.releasedStatus, [
                            params.row.id,
                          ]);
                        }
                      },
                    },
                  },
                  "发布"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentOut) {
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
                        this.postInterface(this.$api.removedStatus, [
                          params.row.id,
                        ]);
                      },
                    },
                  },
                  "下架"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentMore) {
              arr.push(
                h(
                  "Poptip",
                  {
                    props: {
                      placement: "top",
                      transfer: true,
                      trigger: "click",
                    },
                    style: {},
                    on: {
                      "on-popper-show": () => {
                        // this.index = params.row;
                      },
                      "on-popper-hide": () => {
                        // this.index = null;
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
                          click: () => {},
                        },
                      },
                      "更多"
                    ),
                    h(
                      "div",
                      {
                        slot: "content",
                        props: {},
                        attrs: {},
                        style: {
                          width: "80px",
                          height: "230px",
                        },
                      },
                      [
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(1, params.row.id);
                              },
                            },
                          },
                          "删除"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(2, params.row.id);
                              },
                            },
                          },
                          "置顶"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(
                                  3,
                                  params.row.id,
                                  params.row.sort
                                );
                              },
                            },
                          },
                          "取消置顶"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(4, params.row.id);
                              },
                            },
                          },
                          "首推"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(5, params.row.id);
                              },
                            },
                          },
                          "取消首推"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(6, params.row.id);
                              },
                            },
                          },
                          "栏目推荐"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(7, params.row.id);
                              },
                            },
                          },
                          "取消栏目推荐"
                        ),
                      ]
                    ),
                  ]
                )
              );
            }
            return h("div", arr);
          },
        },
      ], // 非朝智讲堂
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          title: "ID",
          key: "contentCode",
          minWidth: 100,
          align: "center",
        },
        {
          title: "标题",
          key: "title",
          minWidth: 200,
          align: "center",
        },
        {
          title: "内容类型",
          key: "contentType",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            if (params.row.contentType == "travel_detail") {
              return h("div", "图文");
            }
          },
        },
        {
          title: "推荐类型",
          key: "advertList",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let arr = [];
            for (var i in params.row.advertList) {
              arr.push(
                h(
                  "div",
                  {
                    props: {
                      size: "small",
                    },
                    class: ["recommend-style"],
                    style: {},
                  },
                  params.row.advertList[i]
                )
              );
            }
            return h("div", arr);
          },
        },
        {
          title: "所属栏目",
          key: "channelList",
          width: 100,
          align: "center",
          render: (h, params) => {
            let arr = [];
            for (var i in params.row.channelList) {
              arr.push(
                h(
                  "div",
                  {
                    props: {
                      size: "small",
                    },
                    class: ["classId-style"],
                    style: {},
                  },
                  params.row.channelList[i]
                )
              );
            }
            return h("div", arr);
          },
        },
        {
          title: "状态",
          key: "contentStatusText",
          width: 100,
          align: "center",
        },
        {
          title: "排序",
          key: "sort",
          sortable: "custom",
          width: 100,
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
                    },
                  },
                },
                params.row.sort
              )
            );
            arr.push(
              h("InputNumber", {
                props: {
                  value: Number(params.row.sort),
                  min: 0,
                  step: 1,
                  precision: 0,
                  parser: (value) => `${value}`.replace(/$s?|(,*)/g, ""),
                },
                style: {
                  display: params.row.isShow,
                },
                on: {
                  click: () => {},
                  "on-focus": () => {},
                  "on-change": (event) => {
                    params.row.showSort = event;
                  },
                  "on-blur": () => {
                    params.row.isText = "block";
                    params.row.isShow = "none";
                    let reqData = JSON.parse(
                      JSON.stringify(this.pageData[params.index])
                    );
                    reqData.sort = params.row.showSort;
                    this.$api
                      .updateSortContent(reqData)
                      .then((res) => {
                        if ((res.result = "0") && res.code != 500) {
                          this.$Message.success("排序更新成功");
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
          title: "阅读量",
          key: "pageViews",
          sortable: "custom",
          width: 100,
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
                  style: { display: params.row.isText2 },
                  on: {
                    click: () => {
                      params.row.isText2 = "none";
                      params.row.isShow2 = "block";
                    },
                  },
                },
                params.row.pageViews
              )
            );
            arr.push(
              h("InputNumber", {
                props: {
                  value: Number(params.row.pageViews),
                  min: 0,
                  step: 1,
                  precision: 0,
                  parser: (value) => `${value}`.replace(/$s?|(,*)/g, ""),
                },
                style: {
                  display: params.row.isShow2,
                },
                on: {
                  click: () => {},
                  "on-focus": () => {},
                  "on-change": (event) => {
                    params.row.pageViews = event;
                  },
                  "on-blur": () => {
                    params.row.isText2 = "block";
                    params.row.isShow2 = "none";
                    // let reqData = JSON.parse(
                    //   JSON.stringify(this.pageData[params.index])
                    // );
                    let reqData = {
                      id: params.row.id,
                      pageViews: params.row.pageViews + "",
                    };
                    this.$api
                      .updatePageViews(reqData)
                      .then((res) => {
                        if ((res.result = "0") && res.code != 500) {
                          this.$Message.success("阅读量更新成功");
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
          title: "播放标识",
          key: "corner",
          width: 100,
          align: "center",
        },
        {
          title: "创建人",
          key: "createdUser",
          width: 100,
          align: "center",
        },
        {
          title: "创建时间",
          key: "createdDate",
          width: 150,
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.auditRecordBtn) {
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
                        this.checkRecordList(params.row);
                      },
                    },
                  },
                  "审核记录"
                )
              );
            }
            if (this.isAdminCenter || this.button.privewButton) {
              if (params.row.contentStatus == 3) {
                arr.push(
                  h(
                    "Tag",
                    {
                      props: {
                        color: "blue",
                      },
                      style: {},
                      nativeOn: {
                        click: () => {
                          this.qrCode(params.row,'cont');
                        },
                      },
                    },
                    "预览"
                  )
                );
              } else {
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
                          this.changePrivew(params.row);
                        },
                      },
                    },
                    "预览"
                  )
                );
              }
            }
            if (this.isAdminCenter || this.button.editContentManage) {
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
                        sessionStorage.setItem(
                          "contentShow",
                          JSON.stringify(params.row)
                        );
                        this.$router.push({
                          name: "editContentManage",
                          query: {
                            id: params.row,
                          },
                        });
                      },
                    },
                  },
                  "编辑"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentRelease) {
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
                        if (params.row.contentStatus == 4) {
                          this.$Modal.confirm({
                            title: "确认发布",
                            content:
                              "<p>当前内容正在审核中，点击确定将发布内容并完结审核流程</p>",
                            onOk: () => {
                              this.postInterface(this.$api.releasedStatus, [
                                params.row.id,
                              ]);
                            },
                          });
                        } else {
                          this.postInterface(this.$api.releasedStatus, [
                            params.row.id,
                          ]);
                        }
                      },
                    },
                  },
                  "发布"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentOut) {
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
                        this.postInterface(this.$api.removedStatus, [
                          params.row.id,
                        ]);
                      },
                    },
                  },
                  "下架"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsContentMore) {
              arr.push(
                h(
                  "Poptip",
                  {
                    props: {
                      placement: "top",
                      transfer: true,
                      trigger: "click",
                    },
                    style: {},
                    on: {
                      "on-popper-show": () => {
                        // this.index = params.row;
                      },
                      "on-popper-hide": () => {
                        // this.index = null;
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
                          click: () => {},
                        },
                      },
                      "更多"
                    ),
                    h(
                      "div",
                      {
                        slot: "content",
                        props: {},
                        attrs: {},
                        style: {
                          width: "80px",
                          height: "230px",
                        },
                      },
                      [
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(1, params.row.id);
                              },
                            },
                          },
                          "删除"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(2, params.row.id);
                              },
                            },
                          },
                          "置顶"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(
                                  3,
                                  params.row.id,
                                  params.row.sort
                                );
                              },
                            },
                          },
                          "取消置顶"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(4, params.row.id);
                              },
                            },
                          },
                          "首推"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(5, params.row.id);
                              },
                            },
                          },
                          "取消首推"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(6, params.row.id);
                              },
                            },
                          },
                          "栏目推荐"
                        ),
                        h(
                          "Button",
                          {
                            props: {},
                            style: {
                              display: "block",
                              padding: "5px 10px",
                              border: "0px",
                              background: "transparent",
                            },
                            on: {
                              click: () => {
                                this.singleDelete(7, params.row.id);
                              },
                            },
                          },
                          "取消栏目推荐"
                        ),
                      ]
                    ),
                  ]
                )
              );
            }
            return h("div", arr);
          },
        },
      ], //非朝智讲堂
      curOrder: "",
      treeData: [],
      treeList: [
        {
          title: "首页",
          expand: true,
          children: [
            {
              title: "会员区域",
            },
            {
              title: "主题游学",
            },
            {
              title: "直播课程",
            },
          ],
        },
        {
          title: "主题游学",
          expand: true,
          children: [
            {
              title: "周边游学",
            },
            {
              title: "长途游学",
            },
            {
              title: "游学推荐",
            },
            {
              title: "游学线路",
            },
          ],
        },
      ],
      pageData: [],
      searchTime: [],
      searchTable: {
        themeId: null,
        columnId: null,
        advertType: null, //	推荐类型
        contentStatus: null, //内容状态
        createdDateEnd: null, //创建时间查询结束
        createdDateStart: null, //	创建时间查询开始
        title: null, //标题
      },
      searchTableOld: {
        themeId: null,
        columnId: null,
        advertType: null, //	推荐类型
        contentStatus: null, //内容状态
        createdDateEnd: null, //创建时间查询结束
        createdDateStart: null, //	创建时间查询开始
        title: null, //标题
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
        {
          name: "预览",
          val: "预览",
        },
        {
          name: "待审核",
          val: "待审核",
        },
        // {
        //   name: "预告",
        //   val: "3",
        // },
        // {
        //   name: "进行中",
        //   val: "4",
        // },
        // {
        //   name: "回放",
        //   val: "5",
        // },
      ], //非朝智讲堂--选择状态
      typeList: [
        {
          name: "全部",
          val: "null",
        },
        {
          name: "首推",
          val: "0",
        },
        {
          name: "推荐",
          val: "1",
        },
        {
          name: "无",
          val: "2",
        },
      ],
      activeList: [
        {
          name: "删除",
          val: "0",
        },
        {
          name: "置顶",
          val: "1",
        },
        {
          name: "取消置顶",
          val: "2",
        },
      ],
      chooseDateFlag: "", //日历设置
      tempList: [
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
        {
          name: "预览",
          val: "预览",
        },
        {
          name: "待审核",
          val: "待审核",
        },
        {
          name: "预告",
          val: "3",
        },
        {
          name: "进行中",
          val: "4",
        },
        {
          name: "回放",
          val: "5",
        },
      ], // 朝智讲堂--选择状态
      chooseList: [], //选择状态list
      isJTFlag: "", //朝智讲堂标识
      qrCodePic: "", //二维码路径
      imageUrl: null,
      qrText: "", //标体
      modal1: false, //二维码弹框
      recordListModal: false, //审核记录弹窗
      recordConList: [], //审核记录--数据
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
    this.getTreeList();
  },
  computed: {},
  watch: {
    //朝智讲堂--显示
    isJTFlag(val) {
      if (val == "朝智讲堂" || val == "健康管理") {
        this.chooseList = this.tempList;
        this.columns = this.columns2;
      } else {
        this.chooseList = this.stateList;
        this.columns = this.columns1;
      }
    },
  },
  components: { vueQr },
  methods: {
    //childName为子节点集合的属性名，可不传，默认为children；
    getAllNode(arr, name, childName) {
      let str = "";
      const arrs = [];
      if (!arr) {
        return;
      }
      if (!name) {
        name = "id";
      }
      if (!childName) {
        childName = "children";
      }
      const getChild = (arr) => {
        for (let i = 0; i < arr.length; i++) {
          arrs.push(arr[i][name]);
          if (arr[i][childName] && arr[i][childName].length > 0) {
            getChild(arr[i].children);
          }
        }
        str = arrs.join();
        return str;
      };
      return getChild(arr);
    },
    sortChange(data) {
      console.log(data);
      if (data.order == "normal") {
        this.curOrder = "";
      } else if (data.order == "desc") {
        this.curOrder = "DESC";
      } else if (data.order == "asc") {
        this.curOrder = "ASC";
      }
      this.searchFun();
    },
    renderContent(h, { root, node, data }) {
      if (data.title == "朝智讲堂") {
        data.disabled = true;
      }
      // return h(
      //   "span",
      //   {
      //     style: {
      //       color: "#666",
      //       cursor: "pointer",
      //       disabled: true,
      //       background:
      //         this.$route.query.type == "save" &&
      //         data.id == window.sessionStorage.getItem("columnId")
      //           ? "#d5e8fc"
      //           : "",
      //     },
      //     domProps: {
      //       className: "btn",
      //       disabled: true,
      //     },
      //     on: {
      //       click: (e) => {
      //         let btns = this.$refs.tree.$el.querySelectorAll(".btn");
      //         for (let i = 0; i < btns.length; i++) {
      //           btns[i].style.backgroundColor = "#fff";
      //         }
      //         console.log(e);
      //         e.path[0].style.backgroundColor =
      //           data.title == "朝智讲堂" ? "" : "#d5e8fc"; //当前点击的元素
      //       },
      //     },
      //   },
      //   data.title
      // );
      let arr = null;
      let privewBtn = h(
        "Tag",
        {
          props: {
            color: "blue",
          },
          style: {
            // marginLeft: "20px",
          },
          nativeOn: {
            click: () => {
              this.qrCode(data,'tree');
            },
          },
        },
        "预览"
      );
      let title = [
        "10001",
        "20001",
        "20002",
        "20003",
        "20004",
        "2000406",
        "2000405",
        "2000404",
        "2000403",
      ];
      if (
        title.includes(data.id) &&
        (this.isAdminCenter || this.button.privewButton)
      ) {
        arr = privewBtn;
      }
      return h(
        "span",
        {
          style: {
            color: "#666",
            cursor: "pointer",
            disabled: true,
            width: "75px",
            padding: "0 3px",
            borderRadius: "4px",
            background:
              this.$route.query.type == "save" &&
              data.id == window.sessionStorage.getItem("columnId")
                ? "#d5e8fc"
                : "",
          },
          domProps: {
            className: "btn",
            disabled: true,
          },
          on: {
            click: (e) => {
              let btns = this.$refs.tree.$el.querySelectorAll(".btn");
              for (let i = 0; i < btns.length; i++) {
                btns[i].style.backgroundColor = "#fff";
              }
              e.path[1].style.backgroundColor =
                data.title == "朝智讲堂" ? "" : "#d5e8fc"; //当前点击的元素
              console.log(e, 555555);
            },
          },
        },
        [
          h(
            "span",
            {
              style: {
                width: "75px",
              },
            },
            data.title
          ),
          arr,
        ]
      );
    },
    // 点击当前树节点
    clickTree(data, e) {
      console.log(e);
      this.chooseDateFlag = e.channelCode; //线上直播
      if (e.children && e.children.length > 0) {
        this.searchTable.themeId = "";
        this.searchTable.columnId = null;
      } else if (!e.children || (e.children && e.children.length == 0)) {
        this.searchTable.themeId = "";
        this.searchTable.columnId = e.id;
      }
      window.sessionStorage.setItem("columnId", e.id);
      window.sessionStorage.setItem("themeId", e.themeId); //主题id
      this.searchTable.columnId = e.id;
      this.findParentNode(window.sessionStorage.getItem("themeId"));
      this.searchFun();
    },
    // 生成二维码
    qrCode(data, type) {
      this.modal1 = true;
      this.qrText = data.title;
      let typeInfo = "";
      if (type == "tree") {
        let ztIdList=['20001','20002','20003','20004']
        typeInfo=data.id=='10001'?'HOME':ztIdList.includes(data.id)?'ZT'+data.id:'ZT20004-'+data.id
      }else if(type == "cont"){
        typeInfo='NR'+data.id
      }
      if(typeInfo){
        setTimeout(() => {
            this.qrCodePic = process.env.VUE_APP_QR_CODE_URL+`#/PreviewHome?primaryKey=${typeInfo}`
      console.log(this.qrCodePic, '二维码链接');
          }, 50);
      }
    },
    //审核记录点击
    checkRecordList(row) {
      this.recordListModal = true;
      this.$api
        .auditRecord({ foreignKey: row.id })
        .then((res) => {
          if (res.result == 0) {
            this.recordConList = res.content;
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
    handleRowClick(row, index) {
      row = this.index;
      console.log(row);
    },
    rowClassName(row, rowIndex) {
      if (rowIndex == this.index) {
        return "success-row";
      }
      return "";
    },
    changeTime(val) {
      this.searchTable.createdDateStart = new Date(
        this.searchTime[0]
      ).getTime();
      this.searchTable.createdDateEnd = new Date(this.searchTime[1]).getTime();
    },
    addContent() {
      this.$router.push({
        name: "addContentManage",
      });
    },
    addCalendar() {
      this.$router.push({
        name: "calendarConfige",
      });
    },
    dispose(data, type) {
      data.map((item) => {
        item.title = item.channelName;
        if (type == 0) {
          item.expand = true;
        }
        if (item.children && item.children.length > 0) {
          item.children = this.dispose(item.children, 1);
        }
      });
      return data;
    },
    getTreeList() {
      let reqData = {
        channelType: 1, // 当有栏目管理版本时候加此参数 否则不加。
        channelName: this.searchWordTree,
      };
      this.$api
        .channelTree(reqData)
        .then((res) => {
          if (res.result == "0") {
            if (res.content[0]) {
              this.treeList = this.dispose(res.content, 0);
              this.treeData = JSON.parse(JSON.stringify(this.treeList));
              if (this.treeList[0]) {
                this.searchFun();
              }
              // this.treeData[0].selected = true; //默认选中第一个
              // if(this.treeData[1]){
              //    this.treeData[1].disabled = true;
              // }
              console.log(this.$route.query.type != "save", 4545);
              if (this.$route.query.type != "save") {
                //是否--保存编辑跳转
                //默认选中第一个做底层中的第一个
                const chooseData = (item) => {
                  if (item.children && item.children.length > 0) {
                    chooseData(item.children[0]);
                  } else {
                    item.selected = true;
                    window.sessionStorage.setItem("columnId", item.id); //所选id
                    window.sessionStorage.setItem("themeId", item.themeId); //主题id
                  }
                };
                chooseData(this.treeData[0]);
              }
              //选中节点的父节点
              this.findParentNode(window.sessionStorage.getItem("themeId"));
            } else {
              this.treeList = [];
              this.treeData = [];
            }
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
    //根据选中节点找到父节点
    findParentNode() {
      let obj = this.treeData.find(
        (item) => item.id == window.sessionStorage.getItem("themeId")
      );
      console.log(obj);
      this.isJTFlag = obj.channelName;
    },
    searchTree() {
      this.getTreeList();
      /*   if (!this.searchWordTree || this.searchWordTree == "") {
        //内容为空时，查询所有
        this.getTreeList();
        return false;
      } */
      /*  let arr = this.treeList;
      const rebuildData = (value, treeData) => {
        let newArr = [];
        treeData.forEach((element) => {
          if (element.children && element.children.length) {
            if (element.title.indexOf(value) > -1) {
              element.expand = true;
            }
            const ab = rebuildData(value, element.children);
            const obj = {
              ...element,
              expand: true,
              children: ab,
            };
            if (ab && ab.length) {
              newArr.push(obj);
            }
          } else {
            if (element.title.indexOf(value) > -1) {
              newArr.push(element);
            }
          }
        });
        return newArr;
      };
      this.treeData = [];
      this.treeData = rebuildData(this.searchWordTree, this.treeList); */
    },
    searchFun() {
      this.searchTableOld = this.$util.convertObj(this.searchTable);
      if (this.searchTableOld.advertType === "null") {
        this.searchTableOld.advertType = null;
      }
      if (this.searchTableOld.contentStatus === "all") {
        this.searchTableOld.contentStatus = "";
      }
      //searchTable.contentStatus
      console.log(this.searchTableOld.contentStatus);
      if (this.searchTableOld.contentStatus == "5") {
        this.searchTableOld.corner = "回放";
        this.searchTableOld.contentStatus = "";
      } else if (this.searchTableOld.contentStatus == "3") {
        this.searchTableOld.corner = "预告";
        this.searchTableOld.contentStatus = "";
      } else if (this.searchTableOld.contentStatus == "4") {
        this.searchTableOld.corner = "进行中";
        this.searchTableOld.contentStatus = "";
      } else if (this.searchTableOld.contentStatus == "预览") {
        this.searchTableOld.corner = "";
        this.searchTableOld.contentStatus = "3";
      } else if (this.searchTableOld.contentStatus == "待审核") {
        this.searchTableOld.corner = "";
        this.searchTableOld.contentStatus = "4";
      } else if (
        this.searchTableOld.contentStatus === "" ||
        this.searchTableOld.contentStatus === "1" ||
        this.searchTableOld.contentStatus === "0" ||
        this.searchTableOld.contentStatus === "2"
      ) {
        this.searchTableOld.corner = "";
      }
      this.fetchData();
    },

    fetchData(page = 1, pageSize = 5) {
      // 入参
      const reqData = {
        ...this.searchTableOld,
        page,
        pageSize: this.queryPageSize,
        orderBySort: this.curOrder,
      };
      reqData.columnId = window.sessionStorage.getItem("columnId");
      this.$api
        .contentPage(reqData)
        .then((res) => {
          if (res.result == "0") {
            console.log(res.content.list);
            this.pageData = res.content.list;
            this.tableList = res.content.list.map((item) => {
              const filterVal = this.stateList.filter(
                (items) => items.val == item.contentStatus
              );
              item.contentStatusText =
                filterVal.length > 0 ? filterVal[0].name : null;
              if (item.contentStatus == 3 || item.contentStatus == 4) {
                item.contentStatusText =
                  item.contentStatus == 3
                    ? "预览"
                    : item.contentStatus == 4
                    ? "待审核"
                    : null;
              }
              if (!item.createdDate) {
                item.createdDate = "——";
              } else {
                let strData = this.$util.getFormatOnlyDate(item.createdDate);
                if (strData.substring(0, 3) == "NaN") {
                  // 是ie浏览器
                  item.createdDate = item.createdDate.substring(0, 10);
                } else {
                  item.createdDate = strData;
                }
              }
              item.isShow = "none";
              item.isText = "block";
              item.isShow2 = "none";
              item.isText2 = "block";
              item.pageViews = item.pageViews ? item.pageViews : 0;
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
    selectObj(selection, row, index) {
      this.selectTable = selection;
    },
    // 状态改变
    changeState(type) {
      let thisUrl;
      if (type == 1) {
        // 发布
        thisUrl = this.$api.releasedStatus;
      } else if (type == 0) {
        // 草稿
        thisUrl = this.$api.draft;
      } else if (type == 2) {
        // 下架
        thisUrl = this.$api.removedStatus;
      } else if (type == 3) {
        // 预告
        thisUrl = this.$api.advanceNotice;
      } else if (type == 4) {
        // 进行中
        thisUrl = this.$api.lineStreaming;
      } else if (type == 5) {
        // 回放
        thisUrl = this.$api.playback;
      }
      this.batchActive(thisUrl);
    },
    // 置顶改变
    changeActive(type) {
      let thisUrl;
      if (type == 0) {
        // 删除
        thisUrl = this.$api.contentDelete;
      } else if (type == 1) {
        // 置顶
        thisUrl = this.$api.contentTop;
      } else if (type == 2) {
        // 取消置顶
        thisUrl = this.$api.contentCancelTop;
      }
      if (this.selectTable.length == 0) {
        this.$Message.error("请至少选择一条数据");
        return false;
      } else {
        let t;
        this.selectTable.map((s) => {
          if (s.sort == 1) {
            t = true;
            return;
          }
        });
        if (type == 2 && !t) {
          return this.$Message.error("所选数据非置顶状态");
        }
      }

      this.batchActive(thisUrl);
    }, // 推荐改变
    changeType(type) {
      let thisUrl;
      if (type == 1) {
        // 首推
        thisUrl = this.$api.homeAdvert;
      } else if (type == 2) {
        // 取消首推
        thisUrl = this.$api.cancelHomeAdvert;
      } else if (type == 3) {
        // 推荐(推荐即主题推)
        thisUrl = this.$api.themeAdvert;
      } else if (type == 4) {
        // 取消推荐
        thisUrl = this.$api.cancelThemeAdvert;
      }
      this.batchActive(thisUrl);
    },
    // 批量操作
    batchActive(thisUrl) {
      if (thisUrl && this.selectTable.length == 0) {
        this.$Message.error("请至少选择一条数据");
        return false;
      }
      let ids = this.selectTable.map((item) => {
        return item.id;
      });
      if (thisUrl) {
        this.postInterface(thisUrl, ids);
      }
    },
    // 单个更多操作
    singleDelete(type, idsArr, sort) {
      let thisUrl;
      if (type == 1) {
        thisUrl = this.$api.contentDelete;
      } else if (type == 2) {
        thisUrl = this.$api.contentTop;
      } else if (type == 3) {
        thisUrl = this.$api.contentCancelTop;
      } else if (type == 4) {
        thisUrl = this.$api.homeAdvert;
      } else if (type == 5) {
        thisUrl = this.$api.cancelHomeAdvert;
      } else if (type == 6) {
        thisUrl = this.$api.themeAdvert;
      } else if (type == 7) {
        thisUrl = this.$api.cancelThemeAdvert;
      }
      console.log(sort);
      //当数据里面含有排序是1的数据才可以执行取消置顶
      if (sort && sort != 1) {
        return this.$Message.error("此数据非置顶状态");
      }
      this.postInterface(thisUrl, [idsArr]);
    },

    // 请求接口
    postInterface(thisUrl, idsArr) {
      const reqData = {
        ids: idsArr,
      };
      thisUrl(reqData)
        .then((res) => {
          if (res.respCode == "0") {
            this.$Message.success("操作成功");
            this.selectTable = [];
            this.searchFun();
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
    // 将状态变更为预览
    changePrivew(row) {
      let reqData = {
        contentId: row.id,
      };
      this.$api
        .statusToPreview(reqData)
        .then((res) => {
          if (res.respCode == "0") {
            this.$Message.success("操作成功");
            this.selectTable = [];
            this.searchFun();
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
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-tree-title {
  padding: 0;
  span {
    display: inline-block;
  }
}
.content-manage {
  position: relative;
  padding-left: 250px;
  min-height: 500px;
  .left-tree-content {
    position: absolute;
    left: 0px;
    width: 250px;
    border: 1px solid #dcdee2;
    padding: 20px;
    .tree-select {
      margin-bottom: 20px;
      width: 170px;
    }
  }
  .right-table-content {
    padding-left: 10px;
    .head-block {
      border-bottom: 4px solid #108ee9;
      padding: 15px 0px;
      width: 100px;
      text-align: center;
    }
    .ivu-divider-horizontal {
      margin-top: 0px;
    }
    .table-search-block {
      padding: 5px;
      background-color: rgba(242, 242, 242, 1);
      height: 45px;
    }
    .active-line {
      position: relative;
      width: 100%;
      height: 40px;
      margin-top: 10px;
      .add-new {
        // position: absolute;
        cursor: pointer;
        // top: 0px;
        // left: 0px;
        color: #169bd5;
        span {
          margin-right: 5px;
        }
      }
      .right-select {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 100;
        select {
          display: inline-block;
          width: 200px;
        }
      }
    }
    .success-row td {
      background: #ebf7ff;
    }
    /deep/.recommend-style {
      background-color: rgba(242, 242, 242, 1);
      color: #2db7f5;
      margin: 5px 0px;
      padding: 5px 10px;
    }
    /deep/.classId-style {
      background-color: rgba(242, 242, 242, 1);
      color: #70b603;
      margin: 5px 0px;
      padding: 5px 10px;
    }
  }
}
// 审核记录弹窗
.timelineStyle {
  font-size: 16px;
  .resultStyle {
    margin-right: 25px;
  }
  .redStyle {
    color: #ed4317;
  }
  .blueStyle {
    color: #57a3f3;
  }
}
</style>