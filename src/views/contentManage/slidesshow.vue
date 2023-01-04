<template>
  <div class="content-manage">
    <div class="left-tree-content">
      <div style="position: relation">
        <Input placeholder="请输入名称" v-model.trim="searchWordTree" class="tree-select"/>
        <Button
          type="primary"
          @click="searchTree"
          style="display: inline-block; position: absolute"
        >
          <Icon type="ios-search-outline"/>
        </Button>
      </div>
      <Tree ref="tree" :render="renderContent" :data="treeData && treeData.length > 0 ? treeData : []" @on-select-change="clickTree"></Tree>
    </div>
    <div class="right-table-content">
      <div class="head-block">全部</div>
      <Divider/>
      <Form :model="searchTable" inline :label-width="65" class="table-search-block">
        <Row :gutter="0" type="flex" justify="end" justify-content="flex-end">
          <Col span="5">
            <FormItem label="选择状态">
              <Select filterable clearable v-model="searchTable.status" palceholder="请选择">
                <Option
                  v-for="(item, index) in stateList"
                  :value="item.val"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="创建时间">
              <DatePicker
                type="daterange"
                v-model.trim="searchTime"
                placement="bottom-end"
                placeholder="请选择"
                @on-change="timeChange"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="标题" style="position: resolve">
              <Input placeholder="请输入标题" v-model="searchTable.fileTitle" class="table-select"/>
            </FormItem>
          </Col>
          <Col span="4">
           <Button
                type="primary"
                @click="searchFun"
                style="display: inline-block; position: absolute"
              >
                <Icon type="ios-search-outline"/>
              </Button>
          </Col>
        </Row>
      </Form>
      <div class="active-line">
        <div v-if="isAdminCenter||button.slidesshowImg" class="add-new" @click="addImg('')">
          <span>+</span>新增图片
        </div>
      </div>
      <div>
        <primaryTable
          :columns="columns"
          :data="tableList"
          :current.sync="pagination.page"
          ref="contentTable"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          @on-change="fetchData"
          @on-page-size-change="beForePagination(1, ...arguments)"
        ></primaryTable>
      </div>
    </div>
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
export default {
  name: "contentManagement",
  data() {
    return {
        isAdminCenter:false,
      button: this.$store.state.app.button,
      searchTime: [],
      searchWordTree: "",
      screenState: "",
      screenActive: "",
      screenType: "",
      pagination: {
        page: 1,
        total: 0,
        pageSize: 10
      },
      queryPageSize: 10, //分页条数
      pageData: [],
      tableList: [
        {
          id: "1",
          title: "这是一个长长的标题A这是一个长长的标题A这是一个长长的标题A",
          contentType: "图文",
          recommend: ["首页推荐", "推荐"],
          classId: ["长途游学", "游学线路"],
          status: "已发布",
          sort: "5",
          url: "admin",
          createdTime: "2021-03-03 16:16:38"
        }
      ],
      columns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center",
        // },
        {
          title: "ID",
          key: "dataCode",
          minWidth: 100,
          align: "center"
        },
        {
          title: "图片",
          key: "title",
          minWidth: 200,
          align: "center",
          render: (h, params) => {
            return h("Img", {
              attrs: {
                src: params.row.filePath
              },
              style: {
                width: "80px",
                height: "80px"
              }
            });
          }
        },
        {
          title: "标题",
          key: "fileTitle",
          minWidth: 200,
          align: "center"
        },
        {
          title: "跳转地址",
          key: "forwardUrl",
          minWidth: 200,
          align: "center"
        },
        {
          title: "状态",
          key: "statusText",
          width: 100,
          align: "center"
        },
        {
          title: "排序",
          key: "showSort",
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
                    size: "small"
                  },
                  style: {
                    display: params.row.isText
                  },
                  on: {
                    click: () => {
                      params.row.isText = "none";
                      params.row.isShow = "block";
                    }
                  }
                },
                params.row.showSort
              )
            );
            arr.push(
              h("InputNumber", {
                props: {
                  value: Number(params.row.showSort),
                  min: 0,
                  step: 1,
                  precision: 0,
                  editable: true,
                    parser: value => `${value}`.replace(/$s?|(,*)/g, '')
                },
                style: {
                  display: params.row.isShow
                },
                on: {
                  click: () => {},
                  "on-focus": () => {},
                  "on-change": event => {
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
                      .updateSort(reqData)
                      .then(res => {
                        if ((res.result = "0") && res.code != 500) {
                          this.$Message.success("排序更新成功");
                          this.searchFun();
                        } else {
                          this.$Message.error(
                            res.resultMessage ? res.resultMessage : res.message
                          );
                        }
                      })
                      .catch(error => {
                        this.$Message.error(
                          error.resultMessage
                            ? error.resultMessage
                            : error.message
                        );
                      });
                  }
                }
              })
            );
            return h("div", arr);
          }
        },
        {
          title: "创建时间",
          key: "createdDate",
          width: 150,
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 80,
          align: "center",
          render: (h, params) => {
            let arr = [];
            if (this.isAdminCenter || this.button.imgAditRecordBtn) {
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
          if(this.isAdminCenter||this.button.slidesshowEditImg){
            arr.push(
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.addImg(params.index);
                    }
                  }
                },
                "编辑"
              )
            );
            }
            if(this.isAdminCenter||this.button.cmsImgRelease){
            arr.push(
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.changePostState(params.row.id, 1);
                    }
                  }
                },
                "发布"
              )
            );
             }
             if(this.isAdminCenter||this.button.cmsImgOut){
            arr.push(
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.changePostState(params.row.id, 2);
                    }
                  }
                },
                "下架"
              )
            );
            }
            if(this.isAdminCenter||this.button.cmsImgDelete){
            arr.push(
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.changePostState(params.row.id, 3);
                    }
                  }
                },
                "删除"
              )
            );
            }
            return h("div", arr);
          }
        }
      ],
      treeData: [],
      treeList: [
        {
          title: "首页",
          expand: true,
          children: [
            {
              title: "会员区域"
            },
            {
              title: "主题游学"
            },
            {
              title: "直播课程"
            }
          ]
        },
        {
          title: "主题游学",
          expand: true,
          children: [
            {
              title: "周边游学"
            },
            {
              title: "长途游学"
            },
            {
              title: "游学推荐"
            },
            {
              title: "游学线路"
            }
          ]
        }
      ],
      searchTable: {
        bannerId: null,
        status: null,
        fileTitle: null,
        createDateStart: null,
        createDateEnd: null
      },
      searchTableOld: {
        bannerId: null,
        status: null,
        fileTitle: null,
        createDateStart: null,
        createDateEnd: null
      },
      stateList: [
        {
          name: "全部",
          val: ""
        },
        {
          name: "已发布",
          val: "1"
        },
        {
          name: "草稿",
          val: "0"
        },
        {
          name: "下架",
          val: "2"
        },
        {
          name: "待审核",
          val: "4",
        },
      ],
      typeList: [
        {
          name: "全部",
          val: "0"
        },
        {
          name: "首推",
          val: "1"
        },
        {
          name: "推荐",
          val: "2"
        },
        {
          name: "无",
          val: "3"
        }
      ],
      activeList: [
        {
          name: "删除",
          val: "0"
        },
        {
          name: "置顶",
          val: "1"
        },
        {
          name: "取消置顶",
          val: "1"
        }
      ],
      recordListModal: false, //审核记录弹窗
      recordConList: [], //审核记录--数据
    };
  },
  create() {},
  mounted() {
      this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.slidesshowEditImg)&&(!this.button.cmsImgRelease)&&(!this.button.cmsImgOut)&&(!this.button.cmsImgDelete)) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    if(sessionStorage.getItem("sildesshow")){
      sessionStorage.removeItem("sildesshow")
    }
    this.getTreeList();
  },
  computed: {},
  watch: {},
  components: {},
  methods: {
    renderContent(h, { root, node, data }){
    return h('span',{
        style:{
            color:'#666',
            cursor:'pointer'
        },
        domProps:{
            className:'btn'
        },
        on:{
            click:(e)=>{
                let btns=this.$refs.tree.$el.querySelectorAll('.btn')
                for(let i=0;i<btns.length;i++){
                    btns[i].style.backgroundColor='#fff'
                }
                e.path[0].style.backgroundColor="#d5e8fc";//当前点击的元素
            }
        }
    },data.title)
},
    // 点击当前树节点
    clickTree (data, e) {
    //清空其余的点击项
    let treeData=this.treeData
     treeData.map((t)=>{
       if(t.children){
         console.log(t)
          t.children.map((c)=>{
               console.log(c)
            if(c.bannerId == e.bannerId){
                c.selected=true
            } else{
                c.selected=false
            }
          })
       }
     })
     console.log(treeData)
      this.$set(this.treeData,treeData)
      if(e.bannerId){
        this.searchTable.bannerId = e.bannerId
         this.searchFun()
      }
    },
    timeChange(val) {
      this.searchTable.createDateStart = new Date(val[0]);
      this.searchTable.createDateEnd = new Date(val[1]);
    },
    // 下架、发布、删除
    changePostState(thisId, thisStatus) {
      const reqData = {
        id: thisStatus == 3 ? null : thisId,
        status: thisStatus == 3 ? null : thisStatus,
        ids: thisStatus == 3 ? [thisId] : null
      };
      let text = "",
        thisUrl;
      if (thisStatus == 1) {
        //   发布
        thisUrl = this.$api.updateBannerStatus;
        text = "发布成功";
      } else if (thisStatus == 2) {
        //   下架
        thisUrl = this.$api.updateBannerStatus;
        text = "下架成功";
      } else if (thisStatus == 3) {
        //   删除
        thisUrl = this.$api.deleteBannerData;
        text = "删除成功";
      }
      thisUrl(reqData)
        .then(res => {
          if (res.result == "0") {
            this.$Message.success(text);
            this.fetchData();
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch(err => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
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
    // 新增
    addImg(row, bannerId) {
      if (row.toString() != "") {
        sessionStorage.setItem(
          "sildesshow",
          JSON.stringify(this.pageData[row])
        );
        console.log(bannerId)
        this.$router.push({
          name: "slidesshowEditImg",
          query: {
            id: this.pageData[row].id
          }
        });
      } else {
        this.$router.push({
          name: "slidesshowImg",
          query: {
            bannerId:this.searchTable.bannerId
          }
        });
      }
    },
    dispose(data, type) {
      data.map(item => {
        if (item.bannerName) {
          item.title = item.bannerName;
        } else {
          item.title = item.columnName;
        }
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
      let reqData = {};
      this.$api
        .BannerList(reqData)
        .then(res => {
          console.log(res);
          if (res.result == "0") {
            this.treeList = this.dispose(res.content, 0);
            this.treeData = JSON.parse(JSON.stringify(this.treeList));
            if(this.treeData[0]&&this.treeData[0].children){
              this.treeData[0].children[0].selected=true;//默认选中第一个的子元素
               this.searchTable.bannerId = this.treeData[0].children[0].bannerId
                this.searchFun();
            }
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        })
        .catch(err => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
    },
    searchTree() {
      if (!this.searchWordTree || this.searchWordTree == "") {
        //内容为空时，查询所有
        this.getTreeList();
        return false;
      }
      let arr = this.treeList;
      const rebuildData = (value, treeData) => {
        let newArr = [];
        treeData.forEach(element => {
          if (element.children && element.children.length) {
            if (element.title.indexOf(value) > -1) {
              element.expand = true;
            }
            const ab = rebuildData(value, element.children);
            const obj = {
              ...element,
              expand: true,
              children: ab
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
      this.treeData = rebuildData(this.searchWordTree, this.treeList);
    },
    changeState() {},
    changeActive() {},
    changeType() {},
    searchFun() {
      this.searchTableOld = this.$util.convertObj(this.searchTable);
      this.fetchData();
    },
    fetchData(page = 1, pageSize = 10) {
      // 入参
      const reqData = {
        ...this.searchTableOld,
        page,
        pageSize: this.queryPageSize
      };
      this.$api
        .photoPage(reqData)
        .then(res => {
          if (res.result == "0") {
            this.pageData = res.content.list;
            let middleContent = JSON.parse(JSON.stringify(res.content.list));
            this.tableList = middleContent.map(item => {
              item.showSort = item.showSort ? item.showSort : 0;
              const filterVal = this.stateList.filter(
                items => items.val == item.status
              );
              item.statusText = filterVal.length > 0 ? filterVal[0].name : null;
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
        .catch(err => {
          this.$Message.error(
            err.resultMessage ? err.resultMessage : err.message
          );
        });
    },
    beForePagination(queryPage=1,queryPageSize=10) {
      this.queryPageSize=queryPageSize;
      let {total,page}=this.pagination;
      if((page-1)*queryPageSize>total){
        this.$nextTick(()=>{
          this.fetchData(queryPage,queryPageSize);
        })
      }else{
        this.fetchData(queryPage,queryPageSize)
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-tree-title{
  padding: 0;
  span{
    display: inline-block;
  }
}
.content-manage {
  position: relative;
  padding-left: 250px;
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
        position: absolute;
        cursor: pointer;
        top: 0px;
        left: 0px;
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