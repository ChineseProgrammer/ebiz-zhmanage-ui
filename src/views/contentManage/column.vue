<template>
  <div class="content-manage">
    <Modal
      v-model.trim="modelShow"
      title="新增栏目"
      :loading="true"
      :closable="false"
      :width="500"
      :mask-closable="false"
    >
      <Form
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="100"
      >
        <Row class="user-row">
          <Col span="23">
            <FormItem label="栏目类型：" prop="channelType">
              <Select transfer v-model="formData.channelType">
                <Option
                  v-for="item in columnTypeList"
                  :value="item.code"
                  :key="item.code"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="23">
            <FormItem
              label="所属主题："
              prop="themeId"
              class="ivu-form-item-required"
            >
              <Select
                @on-change="themeDataChange1()"
                placeholder="请选择主题"
                clearable
                v-model="formData.themeId"
                transfer
              >
                <Option
                  v-for="item in themeList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="23">
            <FormItem label="上级栏目：" prop="channelParentId">
              <!-- <div>
                <div v-for="(itemList, index) in columnList1" :key="index">
                  <Select
                    transfer
                    @on-change="columnDataChange1(wbljColumnId1[index], index)"
                    placeholder="请选择栏目"
                    clearable
                    v-model.trim="wbljColumnId1[index]"
                    style="margin: 8px 0"
                  >
                    <Option v-for="j in itemList" :value="j.id" :key="j.id">{{
                      j.name
                    }}</Option>
                  </Select>
                </div>
              </div> -->
              <Cascader
                :data="cloumnDataList"
                :change-on-select="true"
                v-model="chooseColumnList"
                @on-change="changeColumn"
                transfer
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="23">
            <FormItem
              label="栏目名称："
              prop="channelName"
              class="ivu-form-item-required"
            >
              <Input v-model="formData.channelName" :maxlength="50" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit">确认</Button>
        <Button @click="handleReset">取消</Button>
      </div>
    </Modal>
    <div class="left-tree-content">
      <!-- <div class="active-line">
        <div
          v-if="isAdminCenter || button.slidesshowImg"
          class="add-new"
          @click="addImg()"
        >
          <span>+</span>新增栏目
        </div>
      </div> -->
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
      <div style="height: 350px; overflow-y: auto">
        <Tree
          ref="tree"
          :render="renderContent"
          :data="treeData && treeData.length > 0 ? treeData : []"
          @on-select-change="clickTree"
        ></Tree>
      </div>
    </div>
    <div class="right-table-content">
      <!-- <Row>
        <Button @click="del" v-if="isAdminCenter || button.column_del"
          >删除</Button
        >
        <Upload
          v-if="isAdminCenter || button.column_export"
          :action="actionTeam"
          ref="upload"
          :show-upload-list="false"
          :on-success="handleTeamSuccess"
          :before-upload="beforeTeamUpload"
          :on-format-error="handleTeamError"
          :format="['xls', 'xlsx']"
          :headers="teamHeaders"
          style="display: inline"
        >
          <Button class="ivu-btn">批量导入</Button>
        </Upload>
        <Button
          v-if="isAdminCenter || button.column_download"
          @click="exportAll"
          >下载模板</Button
        >
      </Row> -->
      <Tabs v-show="treeData[0]" value="name1" v-model="tabName">
        <TabPane label="基本信息" name="name1">
          <Form
            ref="addFormDataPic"
            :model="addFormData"
            :rules="addRuleValidate"
            :label-width="100"
          >
            <Row class="user-row">
              <Col span="23">
                <FormItem label="栏目ID：">
                  {{ addFormData.id }}
                </FormItem>
              </Col>
              <Col span="23">
                <FormItem label="栏目类型：" prop="channelType">
                  <Select disabled transfer v-model="addFormData.channelType">
                    <Option
                      v-for="item in columnTypeList"
                      :value="item.code"
                      :key="item.code"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="23">
                <FormItem
                  label="所属主题："
                  prop="themeId"
                  
                >
                  <!--  <Input disabled
          v-model.trim="addFormData.channelName"
        /> -->
                  <Select
                    disabled
                    @on-change="themeDataChange()"
                    placeholder="请选择主题"
                    clearable
                    v-model="addFormData.themeId"
                    transfer
                  >
                    <Option
                      v-for="item in themeList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col v-if="isShowTheme" span="23">
                <FormItem label="上级栏目：">
                  <!-- <div v-if="wbljColumnId.length > 0">
                    <div v-for="(itemList, index) in columnList" :key="index">
                      <Select
                        transfer
                        @on-change="
                          columnDataChange(wbljColumnId[index], index)
                        "
                        placeholder="请选择栏目"
                        clearable
                        v-model.trim="wbljColumnId[index]"
                        style="margin: 8px 0"
                      >
                        <Option
                          :disabled="j.id == addFormData.id"
                          v-for="j in itemList"
                          :value="j.id"
                          :key="j.id"
                          >{{ j.name }}</Option
                        >
                      </Select>
                    </div>
                  </div> -->
                  <Cascader
                    :data="cloumnDataListEdit"
                    :change-on-select="true"
                    v-model="chooseColumnListEdit"
                    @on-change="changeColumn1"
                    transfer
                  ></Cascader>
                </FormItem>
              </Col>
              <Col span="23">
                <FormItem
                  label="栏目名称："
                  prop="channelName"
                >
                  <Input v-model="addFormData.channelName" :maxlength="50" />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Button type="primary" @click="handleSave">保存</Button>
        </TabPane>
        <!-- 去掉 v-if="isShowTab" 展示扩展配置-->
        <TabPane label="扩展配置" name="name2">
          <Form
            ref="addFormData"
            :model="addFormData"
            :rules="addRuleValidate"
            :label-width="100"
          >
            <FormItem label="栏目图片：">
              <span>支持jpg,png,gif,bmp,psd,jpeg图片格式</span>
              <div>
                <div style="display: inline-block" class="demo-upload-list">
                  <template>
                    <img class="imgStyle" />
                    <div class="demo-upload-list-cover"></div>
                  </template>
                </div>
                <!--  -->
                <Upload
                  ref="upload"
                  :show-upload-list="false"
                  :default-file-list="defaultList"
                  :on-success="handleSuccess"
                  :format="['jpg', 'jpeg', 'png', 'psd', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :action="actionUpload"
                  :headers="actionUploadHeaders"
                  :data="submitData"
                  style="display: inline-block; width: 100px; height: 100px"
                >
                  <div style="width: 100px; height: 100px; line-height: 100px">
                    <Icon type="ios-add" size="20"></Icon>
                  </div>
                  <div v-if="addFormData.channelFilePath">
                    <Icon
                      type="ios-close-circle"
                      size="20"
                      @click.stop="remove()"
                      style="
                        position: absolute;
                        z-index: 1001;
                        top: 0px;
                        right: 0px;
                        color: red;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                      "
                    />
                  </div>
                  <img
                    :src="addFormData.channelFilePath"
                    alt=""
                    style="
                      width: 100px;
                      position: absolute;
                      top: 0px;
                      z-index: 100;
                      left: 0px;
                    "
                  />
                </Upload>
                <!--  -->
              </div>
            </FormItem>
            <FormItem label="内部链接：">
              <Input
                v-model="addFormData.channelInUrl"
                :maxlength="200"
                :disabled="urlDisableIn"
              />
            </FormItem>
            <FormItem label="外部链接：">
              <Input
                v-model="addFormData.channelOutUrl"
                :maxlength="200"
                :disabled="urlDisableOut"
              />
            </FormItem>
            <FormItem label="排序：">
              <Input v-model="addFormData.channelSort" />
            </FormItem>
            <FormItem label="栏目描述：">
              <Input
                type="textarea"
                v-model="addFormData.channelDesc"
                :maxlength="200"
              />
            </FormItem>
            <FormItem label="是否展示：">
              <RadioGroup v-model="addFormData.channelShowFlag">
                <Radio label="0">展示</Radio>
                <Radio label="1">不展示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否作为内部链接展示：">
              <RadioGroup v-model="addFormData.insideShowFlag">
                <Radio label="0">显示</Radio>
                <Radio label="1">不显示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="模板编码：">
              <Input v-model="addFormData.templateCode" />
            </FormItem>
          </Form>
          <Button type="primary" @click="handleSave">保存</Button>
        </TabPane>
        <TabPane label="扩展图片" name="name3">
          <Row
            ><Button
              type="primary"
              @click="addBlock"
              v-if="cmsChannelFileReqRels.length==0
              "
              >新增</Button
            ></Row
          >
          <div
            v-for="(obj, index) in cmsChannelFileReqRels"
            :key="index"
          >
            <Form :rules="addRuleValidate" :label-width="100">
              <FormItem label="栏目图片：">
                <span>支持jpg,png,gif,bmp,psd,jpeg图片格式</span>
                <div>
                  <div style="display: inline-block" class="demo-upload-list">
                    <template>
                      <img class="imgStyle" />
                      <div class="demo-upload-list-cover"></div>
                    </template>
                  </div>
                  <!--  -->
                  <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="(file) => handleSuccessMultiple(file, index)"
                    :format="['jpg', 'jpeg', 'png', 'psd', 'jpeg', 'png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    type="drag"
                    :action="actionUpload"
                    :headers="actionUploadHeaders"
                    :data="submitData"
                    style="display: inline-block; width: 100px; height: 100px"
                  >
                    <div
                      style="width: 100px; height: 100px; line-height: 100px"
                    >
                      <Icon type="ios-add" size="20"></Icon>
                    </div>
                    <div v-if="obj.channelFilePath">
                      <Icon
                        type="ios-close-circle"
                        size="20"
                        @click.stop="remove1(index)"
                        style="
                          position: absolute;
                          z-index: 1001;
                          top: 0px;
                          right: 0px;
                          color: red;
                          border-radius: 50%;
                          width: 20px;
                          height: 20px;
                        "
                      />
                    </div>
                    <img
                      :src="obj.channelFilePath"
                      alt=""
                      style="
                        width: 100px;
                        position: absolute;
                        top: 0px;
                        z-index: 100;
                        left: 0px;
                      "
                    />
                  </Upload>
                  <!--  -->
                </div>
              </FormItem>
              <FormItem label="图片使用类型：">
                <RadioGroup v-model="obj.channelFileType">
                  <Radio label="0">首页</Radio>
                  <Radio label="1">二级页点击</Radio>
                  <Radio label="2">二级页非点击</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="内部链接：">
                <Input
                  v-model="obj.channelInUrl"
                  :maxlength="200"
                  @on-blur="urlLinkchange(obj, index, 'in')"
                />
              </FormItem>
              <FormItem label="外部链接：">
                <Input
                  v-model="obj.channelOutUrl"
                  :maxlength="200"
                  @on-blur="urlLinkchange(obj, index, 'out')"
                />
              </FormItem>
            </Form>
            <Button
              type="primary"
              @click="addBlock"
              v-if="index == cmsChannelFileReqRels.length - 1"
              >新增</Button
            >
            <Button type="error" @click="deleteBlock(obj, index)">删除</Button>
          </div>
          <Button type="primary" @click="handleSave" style="margin-top: 20px"
            >保存</Button
          >
        </TabPane>
      </Tabs>
      <!-- <div>
        <Button type="primary" @click="handleSave">保存</Button>
      </div> -->
    </div>
  </div>
</template>
<script>
import { decrypt, encrypt } from "@/api/sm4";
export default {
  name: "contentManagement",
  data() {
    return {
      submitData: {
        bucket: "contentOther",
      },
      actionUpload: this.$api.uploadImage,
      actionUploadHeaders: { sid: window.sessionStorage.getItem("sid") },
      defaultList: [],
      themeList: [],
      columnTypeList: [],
      isShowTheme: false,
      isShowTab: false,
      tabName: "name1",
      channelData: [],
      modelShow: false,
      formData: {
        parentFiledCode: "",
        relationCode: "",
        parentCode: "",
        name: "",
        code: "",
      },
      addFormData: {
        parentFiledCode: "",
        relationCode: "",
        parentCode: "",
        channelName: "",
        code: "",
        channelOutUrl: "",
        channelInUrl: "",
      },
      cmsChannelFileReqRels: [],// 扩展图片
      themeList2: [],
      themeList21: [],
      wbljColumnId: [],
      wbljColumnId1: [],
      teamHeaders: { sid: window.sessionStorage.getItem("sid") },
      actionTeam: this.$api.channelImport,
      isAdminCenter: false,
      button: this.$store.state.app.button,
      searchTime: [],
      searchWordTree: "",
      screenState: "",
      screenActive: "",
      screenType: "",
      pagination: {
        page: 1,
        total: 0,
        pageSize: 10,
      },
      queryPageSize: 10, //分页条数
      pageData: [],
      columnList: [],
      columnList1: [],
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
          createdTime: "2021-03-03 16:16:38",
        },
      ],
      addRuleValidate: {
        // themeId: [
        //   { required: true, message: "请选择所属主题", trigger: "blur" },
        // ],
        // channelType: [
        //   { required: true, message: "请选择栏目类型", trigger: "change" },
        // ],
        // superiorColumn: [
        //   { required: true, message: "请选择上级栏目", trigger: "change" },
        // ],
        // channelName: [
        //   {
        //     required: true,
        //     message: "请输入栏目名称",
        //     trigger: "change",
        //   },
        // ],
        // path: [
        //   {
        //     required: true,
        //     message: "请输入访问路径",
        //     trigger: "blur",
        //   },
        // ],
      },
      ruleValidate: {
        channelType: [
          { required: true, message: "请选择栏目类型", trigger: "change" },
        ],
        themeId: [
          { required: true, message: "请选择所属主题", trigger: "change" },
        ],

        superiorColumn: [
          { required: true, message: "请选择上级栏目", trigger: "change" },
        ],
        channelName: [
          {
            required: true,
            message: "请输入栏目名称",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "请输入访问路径",
            trigger: "blur",
          },
        ],
      },
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
          align: "center",
        },
        {
          title: "图片",
          key: "title",
          minWidth: 200,
          align: "center",
          render: (h, params) => {
            return h("Img", {
              attrs: {
                src: params.row.filePath,
              },
              style: {
                width: "80px",
                height: "80px",
              },
            });
          },
        },
        {
          title: "标题",
          key: "fileTitle",
          minWidth: 200,
          align: "center",
        },
        {
          title: "跳转地址",
          key: "forwardUrl",
          minWidth: 200,
          align: "center",
        },
        {
          title: "状态",
          key: "statusText",
          width: 100,
          align: "center",
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
                    size: "small",
                  },
                  style: {
                    display: params.row.isText,
                  },
                  on: {
                    click: () => {
                      params.row.isText = "none";
                      params.row.isShow = "block";
                    },
                  },
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
                      .updateSort(reqData)
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
            if (this.isAdminCenter || this.button.slidesshowEditImg) {
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
                        this.addImg(params.index);
                      },
                    },
                  },
                  "编辑"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsImgRelease) {
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
                        this.changePostState(params.row.id, 1);
                      },
                    },
                  },
                  "发布"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsImgOut) {
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
                        this.changePostState(params.row.id, 2);
                      },
                    },
                  },
                  "下架"
                )
              );
            }
            if (this.isAdminCenter || this.button.cmsImgDelete) {
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
                        this.changePostState(params.row.id, 3);
                      },
                    },
                  },
                  "删除"
                )
              );
            }
            return h("div", arr);
          },
        },
      ],
      treeData: [],
      channelLevel: 0,
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
      curParantId: "",
      searchTable: {
        columnId: null,
        status: null,
        fileTitle: null,
        createDateStart: null,
        createDateEnd: null,
      },
      searchTableOld: {
        columnId: null,
        status: null,
        fileTitle: null,
        createDateStart: null,
        createDateEnd: null,
      },
      stateList: [
        {
          name: "全部",
          val: "",
        },
        {
          name: "已发布",
          val: "1",
        },
        {
          name: "草稿",
          val: "0",
        },
        {
          name: "下架",
          val: "2",
        },
      ],
      typeList: [
        {
          name: "全部",
          val: "0",
        },
        {
          name: "首推",
          val: "1",
        },
        {
          name: "推荐",
          val: "2",
        },
        {
          name: "无",
          val: "3",
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
          val: "1",
        },
      ],
      maxColumnLevel: "", //判断该主题下几级
      maxColumnLevelE: "", //判断该主题下几级
      cloumnDataList: [], // 该主题下的栏目树--新增
      cloumnDataListEdit: [], // 该主题下的栏目树--修改
      chooseColumnList: [], // 栏目选中的值--新增
      chooseColumnListEdit: [], // 栏目选中的值--修改
      urlDisableIn: false, //内部链接
      urlDisableOut: false, //内=外部链接
    };
  },
  create() {},
  mounted() {
    this.queryRelationInfo();
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if (
      !this.button.slidesshowEditImg &&
      !this.button.cmsImgRelease &&
      !this.button.cmsImgOut &&
      !this.button.cmsImgDelete
    ) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    if (sessionStorage.getItem("sildesshow")) {
      sessionStorage.removeItem("sildesshow");
    }
    this.getTreeList();
    this.getInsideTheme();
  },
  computed: {},
  watch: {
    /*    wbljColumnId: { 
      deep: true,
      handler(val, oldVal,index) {
        console.log(val, "==数据==");
        val=val.toString()
          this.getInsideColumn(val);
          console.log( this.wbljColumnId)
      },
    }, */
    isShowTab(val) {
      this.tabName = "name1";
    },
    "addFormData.channelInUrl"(val) {
      if (val) {
        this.urlDisableOut = true;
      } else {
        this.urlDisableOut = false;
      }
    },
    "addFormData.channelOutUrl"(val) {
      if (val) {
        this.urlDisableIn = true;
      } else {
        this.urlDisableIn = false;
      }
    },
  },
  components: {},
  methods: {
    del(row, type) {
      let content = this.$t("deleteTit");
      let params = { ids: "", systemType: 0 };
      if (this.searchTable.columnId) {
        params.ids = this.searchTable.columnId;
      } else {
        return this.$Message.info("请至少选择一条数据");
      }
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.channeldelete(params).then((res) => {
          console.log(res);
          if (res.result == 0) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
            self.getTreeList();
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    remove(type) {
      this.addFormData.channelFilePath = "";
    },
    remove1(index) {
      this.cmsChannelFileReqRels[index].channelFilePath =""
    },
    handleSuccess(value) {
       //解密
      if(typeof value=='string'){
      value = JSON.parse(decrypt(value));
    }
      if (value.code == 0) {
        this.addFormData.channelFilePath = value.content.content.url;
        /*  if (type == 1 && this.formItem.bannerStatus == 0) {
          if (this.formItem.cmsContentImageList[0]) {
            this.formItem.cmsContentImageList[0].linkList = [value.content.url];
            this.formItem.cmsContentImageList[0].toLinkList = [
              value.content.absolute_url,
            ];
          }
        } */
      }
    },
    handleSuccessMultiple(val, index) {
        //解密
      if(typeof val=='string'){
      val = JSON.parse(decrypt(val));
    }
      if (val.code == 0) {
        this.cmsChannelFileReqRels[index].channelFilePath =
          val.content.content.url;
      }
    },
    handleFormatError(file) {
      this.$Message.error("文件格式是jpg,jpeg,png,psd,jpeg或者png.");
    },
    handleMaxSize(file) {
      this.$Message.error("单张上传最大限制2M.");
    },
    queryRelationInfo(option) {
      this.$api
        .queryRelationInfo({
          relationCode: "channelType",
        })
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.columnTypeList = res.data.dictionaryResDTOList || [];
          } else {
            this.$Message.error(res.message);
          }
        });
    },
    //   一级主题
    getInsideTheme() {
      this.$api
        .getInsideTheme()
        .then((res) => {
          if (res.result == 0) {
            this.themeList = res.content;
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
    // 栏目树数据处理
    convertTree(dataTree) {
      let result = [];
      dataTree.map((first, i) => {
        let obj = {
          ...first,
          label: first.channelName,
          value: first.id,
          children: first.children,
        };
        if (first.children && first.children.length > 0) {
          obj.children = this.convertTree(first.children);
        }
        result[i] = obj;
      });
      return result;
    },
    //获取主题下的栏目树--新增
    getColumnList(themeId) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            if (res.content && res.content.length > 0) {
              this.cloumnDataList = this.convertTree(res.content);
            } else {
              this.cloumnDataList = [];
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
    //获取主题下的栏目树--修改
    getColumnListEdit(themeId) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            if (res.content && res.content.length > 0) {
              this.cloumnDataListEdit = this.convertTree(res.content);
            } else {
              this.cloumnDataListEdit = [];
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
    // 上级栏目树选择--新增
    changeColumn(value) {
      this.chooseColumnList = value;
    },
    // 上级栏目树选择--修改
    changeColumn1(value) {
      this.chooseColumnListEdit = value;
    },
    columnDataChange1(val, index) {
      // let channelLevel;
      // this.channelData.map((c) => {
      //   c.children.map((i) => {
      //     if (i.id == val) {
      //       //找出层级数
      //       let newArry = this.convert_tree_data(
      //         JSON.parse(JSON.stringify(i.children))
      //       );
      //       let channelLevelArry = [];
      //       newArry.map((n) => {
      //         channelLevelArry.push(Number(n.channelLevel));
      //       });
      //       // 最大层级
      //       // channelLevel = Math.max(...channelLevelArry);
      //     }
      //   });
      // });
      //选择主题后获取该主题下有几级
      this.maxColumnLevel = this.getMaxLevel(this.channelData, val);
      if (val) {
        // if (this.wbljColumnId1.length < channelLevel - 1) {
        if (
          this.wbljColumnId1.length < this.maxColumnLevel - 1 &&
          this.wbljColumnId1.indexOf(val) < 0
        ) {
          this.wbljColumnId1.push(val);
        } else {
          this.wbljColumnId1.pop();
          this.wbljColumnId1.push(val);
        }
        this.getInsideColumn1(val);
      } else {
        this.formData.content_id = null;
      }
      this.$forceUpdate();
    },
    convert_tree_data(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children != undefined) {
          var temp = data[i].children;
          // 删除孩子节点
          delete data[i].children;
          // 孩子节点加入数组末尾
          for (var j = 0; j < temp.length; j++) {
            data.push(temp[j]);
          }
        }
      }

      return data;
    },
    // 获取层级数
    getMaxLevel(treeData, val) {
      let maxLevel = 0;
      const loop = (data, level) => {
        data.forEach((element) => {
          if (element.id == val) {
            element.level = level;
            if (level > maxLevel) {
              maxLevel = level;
            }
          }
          if (element.children && element.children.length > 0) {
            loop(element.children, level + 1);
          }
        });
      };
      loop(treeData, 1);
      return maxLevel;
    },
    columnDataChange(val, index) {
      /*  //当要查询到此栏目的下拉列表时候 不查询。
      if(this.curParantId==val) return */
      // let channelLevel;
      // this.channelData.map((c) => {
      //   c.children.map((i) => {
      //     if (i.id == val) {
      //       //找出层级数
      //       let newArry = this.convert_tree_data(
      //         JSON.parse(JSON.stringify(i.children))
      //       );
      //       let channelLevelArry = [];
      //       newArry.map((n) => {
      //         channelLevelArry.push(Number(n.channelLevel));
      //       });
      //       // 最大层级
      //       channelLevel = Math.max(...channelLevelArry);
      //     }
      //   });
      // });
      //选择主题后获取该主题下有几级
      this.maxColumnLevelE = this.getMaxLevel(this.channelData, val);
      if (val) {
        if (
          this.wbljColumnId.length < this.maxColumnLevelE - 1 &&
          this.wbljColumnId.indexOf(val) < 0
        ) {
          this.wbljColumnId.push(val);
        } else {
          this.wbljColumnId.pop();
          this.wbljColumnId.push(val);
        }
        this.getInsideColumn(val, index);
      } else {
        this.addFormData.content_id = null;
      }
      this.$forceUpdate();
    },
    //   获取主题下的栏目
    getInsideColumn(themeId, index) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            if (res.content.length != 0) {
              // if (this.columnList.length < 4) {
              if (this.columnList.length < this.maxColumnLevelE) {
                this.columnList.push(res.content);
              } else {
                this.columnList.pop();
                this.columnList.push(res.content);
              }
              console.log(this.columnList, "this.columnList");
            } else {
            }
            // this.columnList.sort(function (x, y) {
            //   return x[0] - y[0];
            // });
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
    //   获取主题下的栏目
    getInsideColumn1(themeId) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            console.log(this.formData.themeId, "this.formData.themeId");
            if (res.content.length != 0) {
              if (this.columnList1.length < this.maxColumnLevel) {
                this.columnList1.push(res.content);
              } else {
                this.columnList1.pop();
                this.columnList1.push(res.content);
              }
            }
            console.log(this.columnList1, "this.columnList1");
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
    themeDataChange(e) {
      // 清空栏目
      this.columnList = [];
      this.wbljColumnId = [];
      this.addFormData.content_id = null;
      console.log(this.addFormData.themeId);
      if (this.addFormData.themeId) {
        this.getInsideColumn(this.addFormData.themeId);
      } else {
        this.addFormData.channelParentId = null;
        this.themeList2 = [];
        this.addFormData.content_id = null;
        this.columnList = [];
        this.chooseColumnListEdit = [];
      }
      this.$forceUpdate();
    },
    // 所属主题-新增
    themeDataChange1(e) {
      // 清空栏目
      this.columnList1 = [];
      this.wbljColumnId1 = [];
      this.chooseColumnList = [];
      this.formData.content_id = null;
      if (this.formData.themeId) {
        //获取栏目
        // this.getInsideColumn1(this.formData.themeId);
        this.getColumnList(this.formData.themeId);
      } else {
        this.formData.channelParentId = null;
        this.themeList21 = [];
        this.formData.content_id = null;
        this.columnList1 = [];
        this.chooseColumnList = [];
      }
      this.$forceUpdate();
    },
    // 扩展图片--新增多个
    addBlock() {
      this.cmsChannelFileReqRels.push({
        channelFilePath: "",
        channelFileType: "",
        channelId: this.addFormData.id,
        channelInUrl: "",
        channelOutUrl: "",
        channelUrlFlag: "", //0-内部链、1-外部链
      });
      
    },
    // 多行删除
    deleteBlock(obj, index) {
      this.cmsChannelFileReqRels.splice(index, 1);
    },
    urlLinkchange(obj, index, type) {
      if (type == "in") {
        if (obj.channelOutUrl) {
          this.cmsChannelFileReqRels[index].channelInUrl = "";
          this.$Message.warning("外部链接已经有地址，不可输入内部链接");
        }
      } else if (type == "out") {
        if (obj.channelInUrl) {
          this.cmsChannelFileReqRels[index].channelOutUrl = "";
          this.$Message.warning("内部链接已经有地址，不可输入外部链接");
        }
      }
    },
    handleSave() {
      // this.$refs.addFormDataPic.validate((valid) => {
      //   if (valid) {
          this.addFormData.systemType = 0;
          let option = JSON.parse(JSON.stringify(this.addFormData));
          // if (!this.wbljColumnId[0]) {
          //   option.channelParentId = this.addFormData.themeId;
          // } else {
          //   option.channelParentId =
          //     this.wbljColumnId[this.wbljColumnId.length - 1];
          // }
          if (this.chooseColumnListEdit.length > 0) {
            option.channelParentId =
              this.chooseColumnListEdit[this.chooseColumnListEdit.length - 1];
          } else {
            option.channelParentId = this.addFormData.themeId;
          }
          option.treeUrl = [option.themeId, ...this.chooseColumnListEdit].join(
            ","
          );
          // option.channelInUrl = option.parentTreeDTO.channelInUrl;
          // option.channelSort = option.parentTreeDTO.channelSort;
          // option.channelOutUrl = option.parentTreeDTO.channelOutUrl;
          // 扩展配置处理
          option.channelUrlFlag=option.channelInUrl?'0':option.channelOutUrl?'1':''
          // 扩展图片处理
          if (this.cmsChannelFileReqRels.length > 0) {
            this.cmsChannelFileReqRels.map((e) => {
              if (e.channelInUrl) {
                e.channelUrlFlag = 0;
              } else if (e.channelOutUrl) {
                e.channelUrlFlag = 1;
              } else {
                e.channelUrlFlag = "";
              }
            });
          }
          option.cmsChannelFileReqRels=this.cmsChannelFileReqRels
          this.$api
            .addOrEdit(option)
            .then((res) => {
              if (res.code == 0 || res.result - 0 == 0) {
                this.$Message.success("编辑成功");
                this.$refs.addFormDataPic.resetFields();
                this.getTreeList();
              } else {
                this.$emit("error", "");
                this.$Message.error(res.message);
              }
            })
            .catch((error) => {
              this.$emit("error", "");
            });
        // } else {
        //   this.$emit("error", "");
        // }
      // });
    },
    /*
               提交
            */
    handleSubmit() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.saveUser();
        } else {
          this.$emit("error", "");
        }
      });
    },

    /*
               保存
            */
    saveUser() {
      this.formData.systemType = 0;
      let option = this.formData;
      console.log(this.formData, "保存数据");
      let userRoleInSyses = [];
      // if (!this.wbljColumnId1[0]) {
      //   option.channelParentId = this.formData.themeId;
      // } else {
      //   option.channelParentId =
      //     this.wbljColumnId1[this.wbljColumnId1.length - 1];
      // }

      if (this.chooseColumnList.length > 0) {
        option.channelParentId =
          this.chooseColumnList[this.chooseColumnList.length - 1];
      } else {
        option.channelParentId = this.formData.themeId;
      }
      //option.userRoleInSyses = userRoleInSyses;
      option.treeUrl = [option.themeId, ...this.chooseColumnList].join(",");
      this.$api
        .addOrEdit(option)
        .then((res) => {
          if (res.code == 0 || res.result - 0 == 0) {
            this.$Message.success("新增成功");
            this.modelShow = false;
            this.$refs.formData.resetFields();
            this.getTreeList();
          } else {
            this.$emit("error", "");
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    btKeyUp(name) {
      // console.log(name);
      // console.log(this.formData[name]);
      //只能输入英文字母和数字
      if (name == "code") {
        // console.log(this.formData[name]);
        let a = /^[a-z0-9\.-]*$/g;
        if (!a.test(this.formData[name])) {
          // return
          this.formData[name] = "";
        }
        //this.formData[name] = this.formData[name].replace(/^[\w-\s]+$/, "");
      }
      //只能输入中文和数字
      if (name == "name") {
        this.formData[name] = this.formData[name].replace(
          /[^\u4e00-\u9fa50-9]/g,
          ""
        );
      }
    },
    handleReset() {
      this.$refs.formData.resetFields();
      this.modelShow = false;
    },
    //上传之前事件
    beforeTeamUpload(res) {
      this.$util.showLoading();
    },
    //---上传文件格式错误
    handleTeamError(res, file) {
      this.$util.hideLoading();
      this.$Notice.warning({
        title: "上传文件",
        desc: "支持Excel格式",
      });
    },
    //---上传成功
    handleTeamSuccess(res, file, fileList) {
      this.$util.hideLoading();
      if (res.code == "0") {
        if (res.content != null) {
          if (res.content.result != "0") {
            this.$Message.error(res.content.resultMessage);
          }
        } else {
          this.$Message.success("导入成功");
        }
        this.getTreeList();
      } else {
        this.$Message.error(res.content ? res.content : res.message);
        this.getTreeList();
      }
    },
    exportAll() {
      this.$api
        .exportChannelTemplate()
        .then((res) => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "栏目管理模板.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    renderContent(h, { root, node, data }) {
      if (data.title == "朝智讲堂") {
        data.disabled = true;
      }
      console.log(data.selected)
      return h(
        "span",
        {
          style: {
            color: "#666",
            cursor: "pointer",
            backgroundColor:data.selected?"#d5e8fc":''
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
              e.path[0].style.backgroundColor = "#d5e8fc"; //当前点击的元素
              //没有父级id 那么详情里面没有 所属主题选项
              this.isShowTheme = data.channelParentId;
              // 1是栏目 显示扩展配置页面,其余不显示。
              if (data.channelType == "1") {
                this.isShowTab = true;
              } else {
                this.isShowTab = false;
              }
              this.addFormData = data;
              this.searchTable.columnId = data.id;
              /*  e.path[0].style.backgroundColor =
                data.title == "朝智讲堂" ? "" : "#d5e8fc"; //当前点击的元素 */
            },
          },
        },
        data.title
      );
    },
    // 点击当前树节点
    clickTree(data, e) {
      this.columnList = [];
      //清空其余的点击项
      let treeData = this.treeData;
      treeData.map((t) => {
        if (t.children) {
          // console.log(t);
          t.children.map((c) => {
            if (c.id == e.id) {
              c.selected = true;
            } else {
              c.selected = false;
            }
          });
        }
      });
      // console.log(e);
      this.$set(this.treeData, treeData);
      if (e.id) {
        this.searchTable.columnId = e.id;
        this.searchFun();
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
        ids: thisStatus == 3 ? [thisId] : null,
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
        .then((res) => {
          if (res.result == "0") {
            this.$Message.success(text);
            this.fetchData();
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
    addImg() {
      this.modelShow = true;
      this.$nextTick(() => {
        this.formData = {};
        this.$refs.formData.resetFields();
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
        channelName: this.searchWordTree,
      };
      this.$api
        .channelTree(reqData)
        .then((res) => {
          console.log(res);
          if (res.result == "0") {
            this.channelData = res.content;
            this.newArry = this.convert_tree_data(
              JSON.parse(JSON.stringify(res.content))
            );
            // console.log(this.newArry);
            let channelLevelArry = [];
            this.newArry.map((n) => {
              channelLevelArry.push(Number(n.channelLevel));
            });
            // 最大层级
            this.channelLevel = Math.max(...channelLevelArry);
            console.log(this.channelLevel, "channelLevel");
            this.treeList = this.dispose(res.content, 0);
            this.treeData = JSON.parse(JSON.stringify(this.treeList));
            if (this.treeData[0] && this.treeData[0].children) {
              // let btns = this.$refs.tree.$el.querySelectorAll(".btn");
              // for (let i = 0; i < btns.length; i++) {
              //   btns[i].style.backgroundColor = "#fff";
              // }
              this.treeData[0].children[0].selected = true; //默认选中第一个的子元素
              this.searchTable.columnId = this.treeData[0].children[0].id;
              // console.log(this.searchTable.columnId);
              //没有父级id 那么详情里面没有 所属主题选项
              this.isShowTheme = this.treeData[0].children[0].channelParentId;
              if (this.treeData[0].children[0].channelType == "1") {
                this.isShowTab = true;
              } else {
                this.isShowTab = false;
              }
              this.searchFun();
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
    searchTree() {
      this.getTreeList();
      // if (!this.searchWordTree || this.searchWordTree == "") {
      //   //内容为空时，查询所有
      //   this.getTreeList();
      //   return false;
      // }
      // let arr = this.treeList;
      // const rebuildData = (value, treeData) => {
      //   let newArr = [];
      //   treeData.forEach((element) => {
      //     if (element.children && element.children.length) {
      //       if (element.title.indexOf(value) > -1) {
      //         element.expand = true;
      //       }
      //       const ab = rebuildData(value, element.children);
      //       const obj = {
      //         ...element,
      //         expand: true,
      //         children: ab,
      //       };
      //       if (ab && ab.length) {
      //         newArr.push(obj);
      //       }
      //     } else {
      //       if (element.title.indexOf(value) > -1) {
      //         newArr.push(element);
      //       }
      //     }
      //   });
      //   console.log(newArr,5555555555)
      //   return newArr;
      // };
      // this.treeData = [];
      // this.treeData = rebuildData(this.searchWordTree, this.treeList);
    },

    changeState() {},
    changeActive() {},
    changeType() {},
    searchFun() {
      this.searchTableOld = this.$util.convertObj(this.searchTable);
      console.log(this.searchTable.columnId);
      this.fetchData();
    },
    jsonToArray(nodes) {
      var r = [];
      if (Array.isArray(nodes)) {
        for (var i = 0, l = nodes.length; i < l; i++) {
          r.push(nodes[i]); // 取每项数据放入一个新数组
          if (
            Array.isArray(nodes[i]["childrens"]) &&
            nodes[i]["childrens"].length > 0
          )
            // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
            r = r.concat(this.jsonToArray(nodes[i]["childrens"]));
          delete nodes[i]["childrens"];
        }
      }
      return r;
    },
    // 反显专用
    getInsideColumnDetail(themeId) {
      return new Promise((resolve, reject) => {
        this.$api
          .getInsideColumn({
            themeId: themeId,
          })
          .then((res) => {
            if (res.result == 0) {
              if (res.content.length != 0) {
                this.columnList.push(res.content);
                resolve(this.columnList);
              }
            } else {
              this.$Message.error(
                res.resultMessage ? res.resultMessage : res.message
              );
            }
          })
          .catch((err) => {
            // this.$Message.error(
            //   err.resultMessage ? err.resultMessage : err.message
            // );
            reject(err);
          });
      });
    },
    fetchData() {
      // 入参
      const reqData = {
        id: this.searchTable.columnId,
      };
      this.$api
        .channelView(reqData)
        .then(async (res) => {
          if (res.result == "0") {
            console.log(res, "详情接口");
            this.addFormData = res.content;
            this.addFormData.themeId =
              res.content.treeUrl != null
                ? res.content.treeUrl.split(",")[0]
                : ""; // 所属主题回显
            console.log(this.addFormData.themeId, "主题");
            this.getColumnListEdit(this.addFormData.themeId); // 获取栏目树
            this.chooseColumnListEdit =
              res.content.treeUrl != null
                ? res.content.treeUrl.split(",").filter((e, i) => i != 0)
                : []; // 栏目回显
            // 扩展图片
              this.cmsChannelFileReqRels =res.content.cmsChannelFileResRels;
            // if (res.content.parentTreeDTO) {
            //    this.addFormData.themeId = res.content.parentTreeDTO.id;
            //   this.columnList = [];
            //   // this.columnDataChange(this.addFormData.parentTreeDTO.id);
            //   await this.getInsideColumnDetail(
            //     this.addFormData.parentTreeDTO.id
            //   );
            //   this.wbljColumnId = [];
            //   let a = [];
            //   if (this.addFormData.parentTreeDTO) {
            //     a = this.addFormData.parentTreeDTO.childrens;
            //   }
            //   var newArr = this.jsonToArray(a).concat();
            //   newArr.pop();
            //   console.log(newArr);
            //   if (newArr) {
            //     newArr.map((i) => {
            //       this.wbljColumnId.push(i.id);
            //     });
            //   }
            //   console.log(this.wbljColumnId, "反显wbljColumnId");
            //   //当前栏目的父级id
            //   this.curParantId =
            //     this.wbljColumnId[this.wbljColumnId.length - 1];
            //   //栏目--朝智讲堂（多级栏目）
            //   // for (let i = 0; i < this.wbljColumnId.length; i++) {
            //   //   this.getInsideColumn(this.wbljColumnId[i]);
            //   // }
            //   //
            //   // 最后一级栏目不显示
            //   let tempIds = JSON.parse(JSON.stringify(this.wbljColumnId)).slice(
            //     0,
            //     -1
            //   );
            //   tempIds.map(async (ite) => {
            //     this.maxColumnLevelE = this.getMaxLevel(this.channelData,ite);
            //     let aa=await this.getInsideColumnDetail(ite);
            //     console.log(ite,'5656')
            //   });

            //   console.log(this.columnList, "columnList");
            // }
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
  min-height: 34rem;
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
  .right-table-content {
    padding-top: 10px;
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
  /deep/ .ivu-tree-title-selected{
    background-color:#fff
  }
}
</style>