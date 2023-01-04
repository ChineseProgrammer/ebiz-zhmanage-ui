<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="paramsQuery" inline :label-width="100">
          <Row>
            <Col span="8">
              <FormItem style="width: 100%" prop="username" label="员工姓名：">
                <Input
                  placeholder="请输入员工姓名"
                  v-model="paramsQuery.username"
                />
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem style="width: 100%" label="分公司名称：">
                <Select
                  clearable
                  filterable
                  placeholder="请选择分公司"
                  v-model="paramsQuery.orgName"
                >
                  <Option
                    v-for="item in companyList"
                    :value="item.orgName"
                    :key="item.orgName"
                    >{{ item.orgName }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem style="width: 100%" label="会话类型：">
                <Select
                  clearable
                  filterable
                  placeholder="请选择会话类型"
                  v-model="paramsQuery.sessionType"
                >
                  <Option value="0" key="0">内部</Option>
                  <Option value="1" key="1">外部</Option>
                  <Option value="2" key="2">群聊</Option>
                </Select>
              </FormItem>
            </Col>
            <!--  <Col span="8">
              <FormItem style="width: 100%" label="时间范围：">
                <DatePicker
                  style="width: 100%"
                  type="daterange"
                  v-model="dateList"
                  @on-change="onDatePickerChange"
                  :options="options2"
                  placement="bottom-end"
                  placeholder="请选择时间范围"
                ></DatePicker>
              </FormItem>
            </Col> -->
          </Row>
          <Row>
            <Col span="18">
              <FormItem style="width: 100%" label="关键词：">
                <Select
                  placeholder="请选择关键字（限制五个）"
                  class="keyword"
                  style="width: 45.33rem"
                  v-model="paramsQuery.keywords"
                  multiple
                >
                  <Option
                    :value="lable.name"
                    v-for="lable in keyList"
                    :key="lable.name"
                    >{{ lable.name }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <i-col class="float-right">
                <Button
                  type="primary"
                  @click="search(1)"
                  style="margin-left: 10px"
                  >{{ $t("query") }}</Button
                >
                <Button style="margin-right: 0" type="default" @click="reset">{{
                  $t("reset")
                }}</Button>
              </i-col>
            </Col>
          </Row>
          <Row :class="bussinessType ? 'show' : 'hidde'">
            <div>
              <CheckboxGroup
                style="margin-left: 100px"
                v-model="paramsQuery.keywords"
                @on-change="changeCheckBox"
              >
                <div id="getHeight">
                  <Checkbox
                    v-for="lable in keyList"
                    :key="lable.name"
                    :label="lable.name"
                    :disabled="forbidSel && !lable.isCheck"
                    border
                  ></Checkbox>
                </div>
              </CheckboxGroup>
            </div>
            <div style="position: absolute; left: 45px; top: -7px">
              <i
                class="unfold"
                @click="bussinessType = !bussinessType"
                v-show="bussinessHeight > 43"
              >
                {{ bussinessType ? "收起" : "更多" }}
                <Icon
                  :type="bussinessType ? 'ios-arrow-up' : 'ios-arrow-down'"
                ></Icon>
              </i>
            </div>
          </Row>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div style="margin-top: 20px">
        <primaryTable
          @on-row-click="clickRow"
          :columns="columns"
          :data="tableList"
          :total="total"
          :pageSize="paramsQuery.pageSize"
          ref="primaryTable"
          @on-change="changePage"
          class="wholeTable"
          @on-page-size-change="changeSize"
        >
        </primaryTable>
      </div>

      <!--<urlTable :configure='configure' ref='signTable'> </urlTable>-->
    </div>
    <Drawer :closable="false" width="660" v-model="drawerModel">
      <div id="content-file" class="demo-drawer-profile content">
        <div class="content-body">
          <span style="font-size: 16px">{{ title }}</span>
          <div class="content-head">
            <Row>
                 <Col span="21">
             <Input
                  type="text"
                  @on-enter="searchList"
                  @on-click="searchList"
                  v-model="converDeatilSize.detailMsg"
                  icon="ios-search"
                  placeholder="搜索"
                />
                </Col>
             <!--  <Col span="22">
                <Select
                  @on-change="innerSear"
                  filterable
                  allow-create
                  clearable
                  v-model="converDeatilSize.msgContent"
                  multiple
                >
                  <Option
                    :value="lable.name"
                    v-for="lable in keyList"
                    :key="lable.name"
                    >{{ lable.name }}</Option
                  >
                </Select> -->
               <!--   <Select
                     v-show="!converDeatilSize.msgContent[0]"
                 class="keyword"
                  @on-change="innerSear"
                  filterable
                  allow-create
                  clearable
                  placeholder="请选择关键字（限制五个）"
                  v-model="converDeatilSize.msgContent"
                  multiple
                >
                  <Option
                    :value="lable.name"
                    v-for="lable in keyList"
                    :key="lable.name"
                    >{{ lable.name }}</Option
                  >
                </Select> -->
              </Col>
              <Col span="2">
 <Button style="margin-left: 5px;" type="default" @click="resetSearchDetail">
                 重置
                </Button>
              </Col>
            </Row>
          </div>
          <Tabs name="conversatioonTabs" @on-click="changeTab">
            <TabPane
              v-scroll="scrollGetConverList"
              ref="tabPaneRef"
              tab="conversatioonTabs"
              name="all"
              label="全部"
            >
              <!-- 消息列表 -->
              <div
                :class="[
                  'message-box',
                  {
                    'user--send': item.align == 'right',
                  },
                ]"
                v-for="(item, index) in userConverDetailMessage"
                :key="index"
              >
                <div class="message-img-box">
                  <div class="img-box">
                    <img :src="item.img" />
                  </div>
                  <div class="message-name">{{ item.name }}</div>
                  <div class="message-time">{{ item.time }}</div>
                </div>
                <!-- 内容 -->
                <div class="message-text-box">
                  <!-- 图片 -->
                  <img
                    :ref="`messageImg${index}`"
                    :onerror="defaultImg"
                    @click="lookImgClick(item.message)"
                    class="message-img"
                    v-if="item.msgType == 'image'"
                    :src="item.message"
                  />
                  <!-- 文字 -->
                  <div v-else-if="item.msgType == 'text'" class="message-text">
                    {{ item.message }}
                  </div>
                  <!-- 音频 -->
                  <div
                    v-else-if="item.msgType == 'voice'"
                    class="message-voice"
                  >
                    <audio :src="item.message" controls="controls">
                      您的浏览器不支持 audio 标签。
                    </audio>
                  </div>
                  <!-- 视频 -->
                  <div
                    v-else-if="item.msgType == 'video'"
                    class="message-video"
                  >
                    <video :src="item.message" controls="controls">
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 其他不支持 -->
                  <div v-else class="message-text">该类型消息暂不支持展示</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="conversatioonTabs" name="file" label="文件">
              <!-- 消息列表 -->
              <div
                :class="[
                  'message-box',
                  {
                    'user--send': item.align == 'right',
                  },
                ]"
                v-for="(item, index) in userConverDetailMessage"
                :key="index"
              >
                <div class="message-img-box">
                  <div class="img-box">
                    <img :src="item.img" />
                  </div>
                  <div class="message-name">{{ item.name }}</div>
                  <div class="message-time">{{ item.time }}</div>
                </div>
                <!-- 内容 -->
                <div class="message-text-box">
                  <!-- 图片 -->
                  <img
                    :ref="`messageImg${index}`"
                    :onerror="defaultImg"
                    @click="lookImgClick(item.message)"
                    class="message-img"
                    v-if="item.msgType == 'image'"
                    :src="item.message"
                  />
                  <!-- 文字 -->
                  <div v-else-if="item.msgType == 'text'" class="message-text">
                    {{ item.message }}
                  </div>
                  <!-- 音频 -->
                  <div
                    v-else-if="item.msgType == 'voice'"
                    class="message-voice"
                  >
                    <audio :src="item.message" controls="controls">
                      您的浏览器不支持 audio 标签。
                    </audio>
                  </div>
                  <!-- 视频 -->
                  <div
                    v-else-if="item.msgType == 'video'"
                    class="message-video"
                  >
                    <video :src="item.message" controls="controls">
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 其他不支持 -->
                  <div v-else class="message-text">该类型消息暂不支持展示</div>
                </div>
              </div></TabPane
            >
            <TabPane tab="conversatioonTabs" name="video" label="图片与视频">
              <!-- 消息列表 -->
              <div
                :class="[
                  'message-box',
                  {
                    'user--send': item.align == 'right',
                  },
                ]"
                v-for="(item, index) in userConverDetailMessage"
                :key="index"
              >
                <div class="message-img-box">
                  <div class="img-box">
                    <img :src="item.img" />
                  </div>
                  <div class="message-name">{{ item.name }}</div>
                  <div class="message-time">{{ item.time }}</div>
                </div>
                <!-- 内容 -->
                <div class="message-text-box">
                  <!-- 图片 -->
                  <img
                    :ref="`messageImg${index}`"
                    :onerror="defaultImg"
                    @click="lookImgClick(item.message)"
                    class="message-img"
                    v-if="item.msgType == 'image'"
                    :src="item.message"
                  />
                  <!-- 文字 -->
                  <div v-else-if="item.msgType == 'text'" class="message-text">
                    {{ item.message }}
                  </div>
                  <!-- 音频 -->
                  <div
                    v-else-if="item.msgType == 'voice'"
                    class="message-voice"
                  >
                    <audio :src="item.message" controls="controls">
                      您的浏览器不支持 audio 标签。
                    </audio>
                  </div>
                  <!-- 视频 -->
                  <div
                    v-else-if="item.msgType == 'video'"
                    class="message-video"
                  >
                    <video :src="item.message" controls="controls">
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 其他不支持 -->
                  <div v-else class="message-text">该类型消息暂不支持展示</div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="conversatioonTabs" name="link" label="链接">
              <!-- 消息列表 -->
              <div
                :class="[
                  'message-box',
                  {
                    'user--send': item.align == 'right',
                  },
                ]"
                v-for="(item, index) in userConverDetailMessage"
                :key="index"
              >
                <div class="message-img-box">
                  <div class="img-box">
                    <img :src="item.img" />
                  </div>
                  <div class="message-name">{{ item.name }}</div>
                  <div class="message-time">{{ item.time }}</div>
                </div>
                <!-- 内容 -->
                <div class="message-text-box">
                  <!-- 图片 -->
                  <img
                    :ref="`messageImg${index}`"
                    :onerror="defaultImg"
                    @click="lookImgClick(item.message)"
                    class="message-img"
                    v-if="item.msgType == 'image'"
                    :src="item.message"
                  />
                  <!-- 文字 -->
                  <div v-else-if="item.msgType == 'text'" class="message-text">
                    {{ item.message }}
                  </div>
                  <!-- 音频 -->
                  <div
                    v-else-if="item.msgType == 'voice'"
                    class="message-voice"
                  >
                    <audio :src="item.message" controls="controls">
                      您的浏览器不支持 audio 标签。
                    </audio>
                  </div>
                  <!-- 视频 -->
                  <div
                    v-else-if="item.msgType == 'video'"
                    class="message-video"
                  >
                    <video :src="item.message" controls="controls">
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <!-- 其他不支持 -->
                  <div v-else class="message-text">该类型消息暂不支持展示</div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Drawer>
    <!-- 蒙层图片放大器 -->
    <Modal title="查看大图" v-model="isLookImgMark" class-name="fl-image-modal">
	    <img :src="imgUrl"  style="width: 100%">
	</Modal>
   <!--  <div
      class="look_img-box"
      @click="isLookImgMark = false"
      v-if="isLookImgMark"
    >
      <img :src="imgUrl" />
    </div> -->
  </div>
</template>

<script>
import $axios from "axios";
import index from "../../components/cropper/index.vue";
export default {
  data() {
    return {
      forbidSel: false,
      bussinessHeight: 0,
      bussinessType: false,
      //
      treeDataInsurance: [],
      innerList: [],
      outerList: [],
      managerList: [],
      conversationList: [],
      defaultImg: 'this.src = "' + require("../../assets/errorImg.png") + '"',
      deptUserQuery: null, //员工列表搜索条件
      overDeptUserTree: [], //部门人员树
      UserChatList: [], //会话列表
      userConverDetailMessage: [], //会话详情
      paramsQuery: {
        //startTime:null,
        //endTime:null,
        sessionType: "",
        keywords: [],
        internalStatus: 1,
        username: "",
        orgName: "",
        pageSize: 10,
        page: 1,
      },
      dateList: [],
      converDeatilSize: {
        //会话详情的分页信息
        page: 1,
        pageSize: 20,
        msgType: [],
        msgContent: [],
        roomId: "",
        detailMsg: "",
      },
      isScrollMark: false, //无限滚动标记
      chatUserDetailUserId: null, //点击内外部人员时候存的id
      chatUserDetailmainUserId: null, //点击内外部人员时候存的mainUserId
      isOverScrollMark: false, //无限滚动没有数据了
      scrollLastHeight: 0, //上次滚动条位置
      isLookImgMark: false, //图片放大器开关
      imgUrl: "", //放大图片路径
      msgTimeStart: undefined, //会话开始时间
      msgTimeEnd: undefined, //会话结束时间
      //
      drawerModel: false,
      keyList: [
        /* {
          name:"现金"
        },
        {
          name:"银行账号11 "
        },
        {
          name:"长违规词51"
        },
        {
          name:"现金2"
        },
        {
          name:"现金3"
        },{
          name:"违规词23"
        },
         {
          name:"现金4"
        },
        {
          name:"银行账号1"
        },
        {
          name:"长违规词"
        },
        {
          name:"现金5"
        },
        {
          name:"现金6"
        },{
          name:"违规词31"
        },
         {
          name:"现金7"
        },
        {
          name:"银行账号2"
        },
        {
          name:"长违规词52"
        },
        {
          name:"现金8"
        },
        {
          name:"现金9"
        },{
          name:"违规词13"
        }, */
      ],
      options2: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
        shortcuts: [
          {
            text: "一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
          },
          {
            text: "一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
          },
          {
            text: "三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            },
          },
        ],
      },
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      companyList: [],
      title: "",
    };
  },
  methods: {
    /* innerSear(val) {
      if (val.length > 5) {
        this.$Message.warning("最多选择五个关键字");
        this.converDeatilSize.msgContent.pop();
      }
    }, */
    changeCheckBox(val) {
      this.keyList.map((k) => {
        k.isCheck = false;
      });
      val.map((v) => {
        this.keyList.map((l) => {
          if (v == l.name) {
            l.isCheck = true;
            return;
          }
        });
      });
    },
    resetSearchDetail() {
      this.converDeatilSize.msgContent = [];
      this.converDeatilSize.detailMsg = "";
      this.searchList();
    },
    searchList() {
      // 重置消息
      this.converDeatilSize.page = 1;
      this.userConverDetailMessage = [];
      // 拿新消息
      this.getConversation();
    },
    changeTab(msgType) {
      if (msgType == "all") {
        this.converDeatilSize.msgType = [];
      } else if (msgType == "video") {
        //图片和视频
        this.converDeatilSize.msgType = ["image", "video"];
      } else if (msgType == "file") {
        this.converDeatilSize.msgType = ["file"];
      } else if (msgType == "link") {
        this.converDeatilSize.msgType = ["link"];
      }
      this.converDeatilSize.page = 1;
      this.userConverDetailMessage = [];
      this.getConversation("", true);
    },
    /**
     * @description: 打开图片放大器
     * @Date: 2020-08-13 14:44:41
   
     */
    lookImgClick(val) {
      this.imgUrl = val;
      this.isLookImgMark = true;
    },

    /**
     * @description: 无限滚动
     * @Date: 2020-08-13 09:10:27
     * @Author: 周靖松
     */
    async scrollGetConverList() {
      let { isOverScrollMark, isScrollMark } = this;
      // 正在加载或不满足滚动
      if (
        isOverScrollMark ||
        isScrollMark ||
        !this.userConverDetailMessage.length
      )
        return;
      // 开始加载
      this.isScrollMark = true;
      this.converDeatilSize.page++;
      await this.getConversation();
      this.isScrollMark = false;
    },
    timeFormat(ts) {
      var time = new Date(Number(ts));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    //时分秒换算
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    async getConversation(chatUserDetail, type) {
      let { userId } = this.paramsQuery;
      //if (!userId) return;
      // 是否同一个人
      if (chatUserDetail) {
        //let isLastUserMark = this.chatUserDetailUserId == chatUserDetail.userId;
        // if (isLastUserMark) return;
        // 换人的话初始化
        this.converDeatilSize.page = 1;
        this.userConverDetailMessage = [];
      }
      let { msgTimeStart, msgTimeEnd } = this;
      this.chatUserDetailUserId = chatUserDetail
        ? chatUserDetail.userId
        : this.chatUserDetailUserId;
      this.chatUserDetailmainUserId = chatUserDetail
        ? chatUserDetail.mainUserId
        : this.chatUserDetailmainUserId;
      // 参数对象
      let model = {
        chatUserId: this.chatUserDetailUserId,
        mainUserId: this.chatUserDetailmainUserId,
        msgTimeStart,
        msgTimeEnd,
        ...this.converDeatilSize,
      };
      let result;
      if ((await this.$api.getChatDetail(model)).content) {
        result = (await this.$api.getChatDetail(model)).content.list;
      } else {
        return;
      }
      // 时间戳排序并过滤数据
      let detailMessageList = result
        .sort((fast, last) => (fast.msgTime > last.msgTime ? 1 : -1))
        .map((el) => {
          let isMainUser = this.chatUserDetailUserId == el.fromId;
          let {
            msgFilePath,
            fromName,
            msgTime,
            fromAvatar,
            msgContent,
            msgType,
          } = el;
          let message =
            msgType == "text" ? JSON.parse(msgContent).content : msgFilePath;
          return {
            align: isMainUser ? "right" : "left",
            name: fromName,
            time: this.timeFormat(msgTime),
            img: fromAvatar,
            msgType,
            message,
          };
        });
      if (type) {
        this.converDeatilSize.page = 1;
        this.userConverDetailMessage = [];
      }
      this.userConverDetailMessage.unshift(...detailMessageList);
      console.log(this.userConverDetailMessage);
      //访问图片地址
      this.userConverDetailMessage.map((imgObj)=>{
        console.log(imgObj)
        if((imgObj.msgType!='text')){
           $axios({
          method: "get",
          url: imgObj.message,
          responseType: "arraybuffer",
        })
          .then((res) => {
            const bufferUrl = btoa(
              new Uint8Array(res).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            let src1 = "data:image/png;base64," + bufferUrl;
            imgObj.message = src1;
          })
          .catch((e) => {
            throw e;
          });
        }
      })
      // 判断后端是否还有数据
      let { pageSize } = this.converDeatilSize;
      this.isOverScrollMark = pageSize > detailMessageList.length;
      // 设置滚动条
      let isInitScrollMark = !this.userConverDetailMessage.length;
      this.scrollLastHeight = this.$refs.tabPaneRef.$el.scrollHeight;
      if (isInitScrollMark) {
        this.$nextTick((_) => {
          this.$refs.tabPaneRef.$el.scrollTop = this.$refs.tabPaneRef.$el.scrollHeight;
        });
      } else {
        this.$nextTick((_) => {
          this.$refs.tabPaneRef.$el.scrollTop =
            this.$refs.tabPaneRef.$el.scrollHeight - this.scrollLastHeight;
        });
      }
    },
    clickRow(row, index) {
      this.converDeatilSize.detailMsg = "";
      this.converDeatilSize.msgContent = this.paramsQuery.keywords;
      this.title = row.roomName;
      this.converDeatilSize.roomId = row.roomId;
      this.getConversation(row);
      this.drawerModel = true;
    },
    onDatePickerChange(val) {
      if (val[0]) {
        var date = new Date(val[0].replace(/-/g, "/"));
        var date1 = new Date(val[1].replace(/-/g, "/"));
        this.paramsQuery.startTime = date.getTime();
        this.paramsQuery.endTime = date1.getTime();
      } else {
        this.paramsQuery.startTime = null;
        this.paramsQuery.endTime = null;
      }
    },
    //重置
    reset() {
      this.dateList = [];
      this.paramsQuery.username = "";
      //this.paramsQuery.startTime = null;
      //this.paramsQuery.endTime =null;
      this.paramsQuery.keywords = [];
      this.paramsQuery.orgName = "";
      this.paramsQuery.email = "";
      this.paramsQuery.sessionType = "";
      this.search(1);
    },
    changeSize(size) {
      this.paramsQuery.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
      this.paramsQuery.page = page ? page : 1;
      this.getUserChatList(this.paramsQuery);
      sessionStorage.setItem("paramsQuery", JSON.stringify(this.paramsQuery));
    },
    //加载列表e
    getUserChatList(option) {
      this.$api.getUserChatList(option).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
          this.tableList = res.data.list;
        } else {
          this.total = 0;
          this.tableList = [];
          this.$Message.error(res.message);
        }
      });
    },
    changePage(page) {
      this.paramsQuery.page = page;
      this.paramsQuery.page = page;
      this.getUserChatList(this.paramsQuery);
    },
    getOrgDepList() {
      this.$api.getOrgDepList({ systemType: 0 }).then((res) => {
        if (res.respCode == 0 || res.result == 0) {
          this.depTreeData = this.getTreeOrgDept(res.data);
        } else {
          this.$Message.error(res.message ? res.message : res.resultMessage);
        }
      });
    },
    /*
              生成树形组织结构(适用于 返回不是树形数据)
            */

    getTreeOrgDept(list, treeData, id) {
      let itemArr = [];
      let that = this;
      filter(itemArr, null);
      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }
      //遍历过滤
      function filter(tree, id) {
        let array = list.filter((item) => {
          //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
          if (id == null) {
            item.title = item.deptName;
          }
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        //依次遍历
        if (array.length > 0) {
          get(array);
        }
      }

      return itemArr;
    },
    //获取公司机构
    getCompanyList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getCompanyList({}).then((res) => {
        if (res.respCode == "0") {
          this.companyList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置密码
    resetPwd(row) {
      let data = {
        userId: row.id,
      };
      let that = this;
      this.$Modal.confirm({
        title: "确认重置",
        content: "<p>确认对当前帐号重置密码？重置后恢复为默认密码！</p>",
        onOk: () => {
          that.$api.resetPassword(data).then((res) => {
            if (res.respCode == "0") {
              that.$Message.success("重置密码成功");
            } else {
              that.$Message.error(res.message);
            }
          });
        },
      });
    },
  },
  components: { index },
  created: function () {
    //当ssession里面有参数了，则查询页面 否则不查询
    if (sessionStorage.getItem("paramsQuery")) {
      this.paramsQuery = JSON.parse(sessionStorage.getItem("paramsQuery"));
      if (
        !(
          !this.paramsQuery.username &&
          !this.paramsQuery.orgName &&
          !this.paramsQuery.sessionType &&
          !this.paramsQuery.keywords[0]
        )
      ) {
        this.search(1);
      }
    }
    this.getCompanyList();
  },
  mounted() {
    let that = this;
    this.$api.tabooWordsList().then((res) => {
      if (res.respCode == 0 || res.result - 0 == 0) {
        //数组去重
        var obj = {};
        for (var i = 0; i < res.content.length; i++) {
          if (!obj[res.content[i].name]) {
            that.keyList.push(res.content[i]);
            obj[res.content[i].name] = true;
          }
        }
        //
        //初始化的时候确保置灰的置灰 关键字选择项没到五个则不置灰
        this.paramsQuery.keywords.map((v) => {
          this.keyList.map((l) => {
            if (v == l.name) {
              l.isCheck = true;
              return;
            }
          });
        });
        //
        that.$nextTick(() => {
          this.bussinessHeight = document.getElementById(
            "getHeight"
          ).offsetHeight;
        });
      } else {
        this.$Message.error(res.message);
      }
    });
  },
  computed: {
    columns(vue) {
      return [
        {
          title: "分公司",
          align: "center",
          minWidth: 100,
          key: "orgName",
        },
        {
          title: "部门",
          align: "center",
          minWidth: 100,
          key: "departmentName",
        },
        {
          title: "员工ID",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "userId",
        },
        {
          title: "员工姓名",
          align: "center",
          minWidth: 120,
          key: "name",
          width: 150,
        },
        {
          title: "会话对象",
          align: "center",
          minWidth: 110,
          key: "sessionObject",
          /*  render: (h, p) => {
              let text;
              if(p.row.msgType=="text"){
                text="文本信息"
              } else if(p.row.msgType=="image"){
                text="图片消息"
              }
               else if(p.row.msgType=="revoke"){
                text="撤回消息"
              }
               else if(p.row.msgType=="agree"){
                text="同意消息"
              }
               else if(p.row.msgType=="disagree"){
                text="不同意消息"
              }
               else if(p.row.msgType=="voice"){
                text="语音消息"
              } else if(p.row.msgType=="video"){
                text="视频消息"
              } else if(p.row.msgType=="text"){
                text="名片消息：card"
              } else if(p.row.msgType=="text"){
                text="位置消息：location"
              } else if(p.row.msgType=="emotion"){
                text="表情消息"
              } else if(p.row.msgType=="file"){
                text="文件消息"
              } else if(p.row.msgType=="link"){
                text="链接消息"
              } else if(p.row.msgType=="weapp"){
                text="小程序消息"
              } else if(p.row.msgType=="chatrecord"){
                text="会话记录消息"
              } else if(p.row.msgType=="todo"){
                text="待办消息"
              } else if(p.row.msgType=="vote"){
                text=" 投票消息"
              } else if(p.row.msgType=="collect"){
                text="填表消息"
              } else if(p.row.msgType=="redpacket"){
                text="红包消息"
              } else if(p.row.msgType=="meeting"){
                text="会议邀请消息"
              } else if(p.row.msgType=="docmsg"){
                text="在线文档消息"
              } else if(p.row.msgType=="markdown"){
                text="MarkDown格式消息"
              } else if(p.row.msgType=="news"){
                text="图文消息"
              } else if(p.row.msgType=="calendar"){
                text="日程消息"
              } else if(p.row.msgType=="mixed"){
                text="混合消息"
              } else if(p.row.msgType=="meeting_voice_call"){
                text="音频存档消息"
              } else if(p.row.msgType=="voip_doc_share"){
                text="音频共享文档消息"
              }
            return h('span',text)
          } */
        },
        // {
        //   title: "会话ID",
        //   align: "center",
        //   minWidth: 200,
        //   key: "roomId",
        // },
        {
          title: "群名称",
          align: "center",
          minWidth: 90,
          key: "roomName",
        },
      ];
    },
  },
  watch: {
    "paramsQuery.keywords"(n) {
      if (n.length >= 5) {
        //禁止选择了
        this.forbidSel = true;
      } else {
        this.forbidSel = false;
      }
    },
  },
  filters: {},
};
</script>

<style scoped lang="less">
.show {
  height: auto;
  border-bottom: 1px solid #ebebeb;
}
.hidde {
  height: 40px;
  overflow: hidden;
  border-bottom: 1px solid #ebebeb;
}
.list-filter {
  position: relative;
  margin-bottom: 20px;
  font-size: 14px;
}

.list-filter dl {
  overflow: hidden;
}

.list-filter dt {
  float: left;
  font-weight: 400;
  height: 40px;
  line-height: 40px;
}

.list-filter dd {
  margin-left: 30px;
  float: left;
  width: 85%;
  line-height: 40px;
}
.unfold {
  font-size: 12px;
  color: #00a971;
  cursor: pointer;
  font-style: normal;
  vertical-align: middle;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}
.list-filter a {
  color: #333;
  display: inline-block;
  margin-right: 20px;
  padding: 0 5px;
  text-decoration: none;
  line-height: 2em;
  z-index: 0;
}
// 主发送方的样式
.user--send {
  text-align: right;
  justify-self: end;
  .message-img-box {
    flex-direction: row-reverse;
  }
  .message-text {
    margin-left: auto;
    justify-content: end;
    background-color: rgb(207, 207, 245);
    &::after {
      content: "";
      position: absolute;
      bottom: 100%;
      right: 5px;
      left: auto;
      width: 0;
      height: 0;
      border-width: 8px;
      border-style: solid;
      border-color: transparent;
      margin-bottom: -6px;
      border-bottom-width: 13px;
      border-bottom-color: currentColor;
      color: rgb(207, 207, 245);
    }
  }
  .message-name,
  .message-time {
    margin-right: 10px;
    margin-left: 0;
  }
}
.content {
  width: 100%;
  height: 100%;
  float: left;
  padding: 10px;
  margin-top: -6px;
  border-right: 1px solid #ddd;
  .content-head {
    margin: 0 auto;
    margin-top: 25px;
    width: 80%;
    padding-bottom: 20px;
  }
  .content-body {
    height: 100%;
    .ivu-tabs {
      height: 100%;
    }

    .ivu-tabs-tabpane {
      height: calc(100% - 40px);
      overflow: auto;
    }
  }
}
.v-transfer-dom
  .ivu-modal-wrap
  .ivu-modal
  .ivu-modal-content
  .ivu-modal-body
  .ivu-modal-confirm-body {
  height: auto !important;
  max-height: 350px !important;
  color: unset !important;
  overflow: auto;
}
.ivu-checkbox-group-item {
  margin-bottom: 10px;
}
#content-file {
  .list-title {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ddd;
    clear: both;
    content: "";
    display: inline-block;
    .title {
      height: 40px;
      float: left;
      padding: 10px;
      border-right: 1px solid #ddd;
    }
    .title:last-child {
      border-right: none;
    }
  }
  .tabs--not {
    .content-body {
      height: calc(100% - 92px);
      // height: 750px;
      overflow: auto;
    }
  }

  .content:last-child {
    border-right: none;
  }
  .ivu-tabs-bar {
    border-bottom: none !important;
  }
  // 会话列表盒子
  .conver-box {
    height: 40px;
    display: flex;
    margin-top: 10px;
    .conver-img {
      max-height: 40px;
    }
    .conver-text {
      margin-left: 20px;
      font-weight: bold;
      line-height: 20px;
    }
  }
  // 消息盒子
  .message-box {
    color: red;
    margin-bottom: 20px;
    .message-img-box {
      display: flex;
      .img-box {
        width: 30px;
        height: 30px;
        img {
          width: 100%;
        }
      }
      .message-name,
      .message-time {
        font-size: 14px;
        line-height: 30px;
        margin-left: 10px;
      }
    }

    .message-video {
      margin-top: 20px;
      height: 200px;
      video {
        width: 50%;
        height: 100%;
      }
    }
    .message-text {
      background-color: rgb(250, 204, 204);
      color: #333;
      padding: 5px;
      border-radius: 5px;
      min-height: 30px;
      margin-top: 10px;
      // width: max-content;
      max-width: 45%;
      width: -ms-max-content;
      width: expression(max-content);
      -ms-width: inherit;
      min-width: 20px;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 5px;
        width: 0;
        height: 0;
        border-width: 8px;
        border-style: solid;
        border-color: transparent;
        margin-bottom: -6px;
        border-bottom-width: 13px;
        border-bottom-color: currentColor;
        color: rgb(250, 204, 204);
      }
    }
  }
  .message-img {
    margin-top: 30px;
    width: 150px;
  }
}
// 图片放大器
.look_img-box {
  position: absolute;
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #f7f7f7;
  img {
    position: relative;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, -50%);
  }
}
.width240 {
  width: 240px;
}
.width--auto {
  padding-right: 0px !important;
  width: calc(100% - 480px);
  .ivu-tabs-tabpane {
    padding-right: 10px;
  }
}
.ivu-tabs-bar {
  border-bottom: none !important;
}
.keyword /deep/ .ivu-select-dropdown {
  display: none;
  z-index: -99999;
}
.keyword /deep/ .ivu-icon-ios-arrow-down:before {
  content: "";
}
</style>
