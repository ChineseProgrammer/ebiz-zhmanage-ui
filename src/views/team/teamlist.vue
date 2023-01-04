<template>
  <div id="team-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <div>
        <Tabs ref="tabs">
          <TabPane label="队伍查询" name="0">
            <Form ref="formInline" :model="searchTeam" inline :label-width="100">
              <div class="search-box">
                <!-- <Row>
                <i-col span="8">-->
                <div>
                  <FormItem label="管理机构名称">
                    <Select
                      filterable
                      clearable
                      v-model="searchTeam.manageOrgCode"
                        style="width:160px"
                      placeholder="请选择"
                      @on-change="getSalesTeamList(...arguments)"
                    >
                      <Option
                        v-for="(teamOrg, teamOrgIndex) in manageList"
                        :value="teamOrg.manageOrgCode"
                        :key="teamOrgIndex"
                      >{{ teamOrg.manageOrgName }}</Option>
                    </Select>
                  </FormItem>
                  <!-- </i-col>
                  <i-col span="8">-->
                  <FormItem label="销售团队">
                    <Select
                      filterable
                      clearable
                      v-model="searchTeam.salesTeamCode"
                      style="width:160px"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="(team, teamIndex) in salesTeamList"
                        :value="team.salesTeamCode"
                        :key="teamIndex"
                      >{{ team.salesTeamName }}</Option>
                    </Select>
                  </FormItem>
                  <!-- </i-col>
                  <i-col span="6" class="fr">-->
                </div>
                <div class="search-btn">
                  <Button @click="changeFormSearch" type="primary" class="ml50">查询</Button>
                  <Button @click="reset">重置</Button>
                </div>
                <!-- </i-col>
                </Row>-->
              </div>
            </Form>
            <Divider class="mv10" />
            <!-- 按钮 -->
            <div class="mb15">
              <Upload
v-if="isAdminCenter || button.team_import"
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
                <Button class="ivu-btn ivu-btn-primary">批量导入</Button>
              </Upload>
            </div>
            <primaryTable
              :columns="teamColumns"
              :data="teamData"
              :current.sync="paginationTeam.page"
              ref="teamTable"
              :total="paginationTeam.teamTotal"
              :pageSize="paginationTeam.pageSize"
              @on-change="fetchData"
              @on-page-size-change="beForePagination(1,...arguments)"
            ></primaryTable>
          </TabPane>
          <TabPane label="个人查询" name="1">
            <Form ref="formInline1" :model="searchPerson" inline :label-width="100">
              <div class="search-box">
                <!-- <Row>
                <i-col span="6">-->
                <div>
                  <FormItem label="管理机构名称">
                    <Select
                      filterable
                      clearable
                      v-model="searchPerson.manageOrgCode"
                      style="width:160px"
                      placeholder="请选择"
                      @on-change="getSalesmaSalesTeamList(...arguments)"
                    >
                      <Option
                        v-for="(manManage, manManageIndex) in manManageList"
                        :value="manManage.manageOrgCode"
                        :key="manManageIndex"
                      >{{ manManage.manageOrgName }}</Option>
                    </Select>
                  </FormItem>
                  <!-- </i-col>
                  <i-col span="6">-->
                  <FormItem label="销售机构名称">
                    <Select
                      filterable
                      clearable
                      v-model="searchPerson.salesTeamCode"
                      style="width:160px"
                      placeholder="请选择"
                    >
                      <Option
                        v-for="(mam, mamIndex) in manSalesTeamList"
                        :value="mam.salesTeamCode"
                        :key="mamIndex"
                      >{{ mam.salesTeamName }}</Option>
                    </Select>
                  </FormItem>
                  <!-- </i-col>
                  <i-col span="6">-->
                  <FormItem label="推广人姓名">
                    <Input v-model="searchPerson.agentName" style="width:160px" />
                  </FormItem>
                  <!-- </i-col>
                  <i-col span="6">-->
                  <FormItem label="推广人状态">
                    <Select
                      filterable
                      clearable
                      v-model="searchPerson.agentStatus"
                      style="width:160px"
                      placeholder="请选择"
                    >
                      <Option value="在职">在职</Option>
                      <Option value="离职">离职</Option>
                    </Select>
                  </FormItem>
                </div>
                <div class="search-btn">
                  <!-- </i-col>
                  <i-col span="4" class="fr">-->
                  <Button @click="changeFormPerson" class="ivu-btn ivu-btn-primary">查询</Button>
                  <Button @click="personReset()">重置</Button>
                </div>
              </div>
              <!-- </i-col>
              </Row>-->
            </Form>
            <Divider class="mv10" />
            <!-- 按钮 -->
            <div class="mb15">
              <Button v-if="isAdminCenter || button.personal_add" type="default" class="add-button" @click="addPerson()">新增</Button>
              <Upload
                :action="actionPerson"
                ref="upload"
                :show-upload-list="false"
                :on-success="handlePersonSuccess"
                :before-upload="beforePersonUpload"
                :on-format-error="handlePersonError"
                :format="['xls', 'xlsx']"
                :headers="personHeaders"
                style="display: inline"
              >
                <Button v-if="isAdminCenter || button.personal_import" class="ivu-btn ivu-btn-primary import-button">导入</Button>
              </Upload>
              <Button v-if="isAdminCenter || button.personal_downloadTemplate" type="primary" @click="exportAll">下载模板</Button>
               <Button v-if="isAdminCenter || button.personal_pull" type="primary" @click="getPull">手动拉取</Button>
            </div>
            <primaryTable
              :columns="PersonColumns"
              :data="personData"
              :current.sync="paginationPerson.page"
              ref="teamTable"
              :total="paginationPerson.total"
              :pageSize="paginationPerson.pageSize"
              @on-change="fetchPersonData"
              @on-page-size-change="beForeFetchPersonData(1,...arguments)"
              class="person-from"
            ></primaryTable>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
import $axios from "axios";
export default {
  data() {
    return {
      isAdminCenter:false,
        button: this.$store.state.app.button,
      actionTeam: this.$api.batchImportSalesTeam,
      actionPerson: this.$api.batchImportSalesMam,
      teamHeaders: { sid: window.sessionStorage.getItem("sid") },
      personHeaders: { sid: window.sessionStorage.getItem("sid") },
      actionPortrait: this.$api.salesMamImportImage,
      portraitHeaders: { sid: window.sessionStorage.getItem("sid") },
      show: false,
      queryPersonPageSize: 10, //人条数
      queryPageSize: 10, //队伍条数
      manageList: [], //管理机构list
      salesTeamList: [], //销售团队list
      //条件查询--队伍查询
      searchTeam: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "" //销售团队名称
      },
      //列表搜索的值--队伍查询
      searchTeamOld: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "" //销售团队名称
      },
      // 分页数据--队伍查询
      paginationTeam: {
        page: 1,
        pageSize: 10,
        teamTotal: 0
      },
      teamTotal: 0, //队伍查询表格total
      //表格----队伍查询
      teamColumns: [
        {
          title: "序号",
          width: "80",
          type: "index",
          align: "center"
        },
        {
          title: "管理机构代码",
          key: "manageOrgCode",
          align: "center",
          minWidth: 130
        },
        {
          title: "管理机构名称",
          key: "manageOrgName",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: "销售机构代码",
          key: "salesTeamCode",
          align: "center",
          minWidth: 150
        },

        {
          title: "销售团队",
          key: "salesTeamName",
          align: "center",
          minWidth: 150
        },
        {
          title: "主管代码",
          key: "leaderCode",
          align: "center",
          minWidth: 130
        },
        {
          title: "主管姓名",
          key: "leaderName",
          align: "center",
          minWidth: 100
        },
        {
          title: "成立日期",
          key: "teamCreateDate",
          align: "center",
          minWidth: 110
        },
        {
          title: "停业日期",
          key: "teamCloseDownDate",
          align: "center",
          minWidth: 150
        },
        {
          title: "停业标志",
          key: "teamCloseDownFlagName",
          align: "center",
          minWidth: 150
        },
        {
          title: "在职人数",
          key: "incumbentNum",
          align: "center",
          minWidth: 150
        }
      ],
      //条件查询---个人查询
      searchPerson: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        agentName: "", //推广人姓名
        agentStatus: "" //
      },
      //列表搜索的值---个人查询
      searchPersonOld: {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        agentName: "", //推广人姓名
        agentStatus: "" //
      },
      // 分页数据---个人查询
      paginationPerson: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      //数据列表
      teamData: [], //个人查询表格total
      personData: [],
      manManageList: [],
      manSalesTeamList: [],
      //个人查询--表格列
      PersonColumns: [
        {
          title: "序号",
          width: "80",
          type: "index",
          align: "center"
        },
        {
          title: "管理机构代码",
          key: "manageOrgCode",
          align: "center",
          minWidth: 130
        },
        {
          title: "管理机构名称",
          key: "manageOrgName",
          align: "center",
          minWidth: 130,
          ellipsis: true,
          tooltip: true
        },
        {
          title: "推广人团队代码",
          key: "salesTeamCode",
          align: "center",
          minWidth: 150
        },

        {
          title: "推广人团队名称",
          key: "salesTeamName",
          align: "center",
          minWidth: 150
        },
        {
          title: "推广人员编码",
          key: "agentCode",
          align: "center",
          minWidth: 130
        },
        {
          title: "推广人员姓名",
          key: "agentName",
          align: "center",
          minWidth: 130
        },
        {
          title: "推广人员手机号",
          key: "mobilePhoneOne",
          align: "center",
          minWidth: 130
        },
        {
          title: "人员类型",
          key: "agentType",
          align: "center",
          minWidth: 130
        },
         {
          title: "执业证编码",
          key: "professionCertificate",
          align: "center",
          minWidth: 150
        },
        {
          title: "企业微信userid",
          key: "wxUserId",
          align: "center",
          minWidth: 130
        },
        {
          title: "推广人头像",
          key: "agentImageUrl",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            if (params.row.agentImageUrl) {
              return h("div", [
                h("img", {
                  attrs: {
                    src: params.row.agentImageUrl
                  },
                  style: {
                    width: "40px",
                    height: "40px"
                  },
                  on:{
                    click:()=>{
                      this.preview(params.row.agentImageUrl);
                    }
                  }
                })
              ]);
            } else {
              return h("div", [
                h(
                  "Upload",
                  {
                    props: {
                      action: this.actionPortrait,
                      data: {
                        //sid:this.portraitHeaders,
                        id: params.row.id,
                        imgType: 1
                        //file:
                      },
                      headers: this.portraitHeaders,
                      format: ["jpg", "png"],
                      "on-success": this.handlePortraitSuccess,
                      "before-upload": this.beforePortraitUpload,
                      "on-format-error": this.handlePortraitError
                    },
                    style: {
                      marginRight: "5px",
                      color: "blue"
                    }
                  },
                  "上传"
                )
              ]);
            }
          }
        },
        {
          title: "微信二维码",
          key: "wxCodeImgUrl",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            if (params.row.wxCodeImgUrl) {
              return h("div", [
                h("img", {
                  attrs: {
                    src: params.row.wxCodeImgUrl
                  },
                  style: {
                    width: "40px",
                    height: "40px"
                  },
                  on:{
                    click:()=>{
                      this.preview(params.row.wxCodeImgUrl);
                    }
                  }
                })
              ]);
            }
            /*  else {
              return h("div", [
                h(
                  "Upload",
                  {
                    props: {
                      action: this.actionPortrait,
                      data: {
                        //sid:this.portraitHeaders,
                        id: params.row.id,
                        imgType: 2
                        //file:
                      },
                      headers: this.portraitHeaders,
                      format: ["jpg", "png"],
                      "on-success": this.handlePortraitSuccess,
                      "before-upload": this.beforePortraitUpload,
                      "on-format-error": this.handlePortraitError
                    },
                    style: {
                      marginRight: "5px",
                      color: "blue"
                    }
                  },
                  "上传"
                )
              ]);
            } */
          }
        },
        {
          title: "入司时间",
          key: "entryDate",
          align: "center",
          minWidth: 110
        },
        {
          title: "离职时间",
          key: "leaveDate",
          align: "center",
          minWidth: 110
        },
        {
          title: "推广人员职级",
          key: "agentLevel",
          align: "center",
          minWidth: 140
        },

        {
          title: "证件类型",
          key: "idType",
          align: "center",
          minWidth: 130
        },
        {
          title: "证件号码",
          key: "idNo",
          align: "center",
          minWidth: 130
        },
        {
          title: "性别",
          key: "sex",
          align: "center",
          minWidth: 130,
          render: (h, params) => {
            if (params.row.sex == "0") {
              return h("div", [h("span", {}, "男")]);
            } else {
              return h("div", [h("span", {}, "女")]);
            }
          }
        },
        // {
        //   title: "推广人状态",
        //   key: "agentStatus",
        //   align: "center",
        //   minWidth: 130,
        // },
        {
          title: "推荐人工号",
          key: "recommendNo",
          align: "center",
          minWidth: 130
        },
        {
          title: "推荐人姓名",
          key: "recommendName",
          align: "center",
          minWidth: 130
        },
        {
          title: "育成人工号",
          key: "fosterNo",
          align: "center",
          minWidth: 130
        },
        {
          title: "育成人姓名",
          key: "fosterName",
          align: "center",
          minWidth: 130
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 130,
          fixed: "right",
          render: (h, params) => {
             let arr = [];
            if (this.isAdminCenter || this.button.personal_edit) {
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
                      // 将当前这条数据进行存储
                      window.sessionStorage.setItem(
                        "personRow",
                        JSON.stringify(params.row)
                      );
                      // 跳转页面
                      this.$router.push({
                        name: "personal_edit",
                        query: {
                          id: params.row.id
                        }
                      });
                    }
                  }
                },
                "编辑"
              )
              );
            }
             if (this.isAdminCenter || this.button.personal_recapture) {
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
                      if(!params.row.wxUserId){
                        this.$Message.error("微信用户ID为空，请补全信息")
                      } else{
                         this.recoverWxCode(params.row)
                      }
                    }
                  }
                },
                "重新获取"
              )
              );
            }
            return h("div", arr);
          }
        }
      ],
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
    };
  },
  created: function() {
    //分页查询
    this.fetchData();
    this.fetchPersonData();
    this.getManageOrgList();
    this.getSalesTeamList();
    this.getSalesmanManageOrgList();
    this.getSalesmaSalesTeamList();
    sessionStorage.removeItem("personRow");
   
  },
  mounted(){
     this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
   if(window.location.href.indexOf("?")>-1){
      this.$refs.tabs.activeKey ="1";
    }else{
      this.$refs.tabs.activeKey ="0";
    }
     if (
      !this.button.personal_edit &&
      !this.button.personal_edit
    ) {
      if (!this.isAdminCenter) {
        this.PersonColumns.pop();
      }
    }
  },
  computed: {},
  methods: {
    // 预览
    preview(link){
      this.$Modal.info({
        render:(h)=>{
          return h("Img",{
            attrs:{
              src:link,
            },
            style:{
              width:"100%",
              height:"100%"
            }
          })
        }
      })
    },
    cancel(){
      this.isPreview=false;
    },
    getPull(){
      this.$util.showLoading();
 this.$api
        .callScheduleMission()
        .then(res => {
           this.$util.hideLoading();
          if (res.code == "0") {
             this.$Message.success(res.message);
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch(error => {});
    },
    exportAll() {
      this.$api
        .personDownTemplate()
        .then(res => {
          this.$util.hideLoading();
          let elink = document.createElement("a");
          elink.download = "个人查询模板.xlsx";
          elink.style.display = "none";
          let blob = new Blob([res]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        })
        .catch();
    },
    // 更换队伍查询form搜索
    changeFormSearch() {
      this.searchTeamOld = this.$util.convertObj(this.searchTeam);
      this.fetchData();
    },
    //
    recoverWxCode(params){
      this.$util.showLoading();
      this.$api.recoverWxCode({
        id:params.id,
        wxUserId:params.wxUserId
      }).then(res => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
         this.$Message.success("重新获取"+res.resultMessage);
         this.fetchPersonData();
        } else {
         this.$Message.error("重新获取"+res.resultMessage);
        }
      });
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForePagination(queryPage = 1, queryPageSize = 10) {
      this.queryPageSize = queryPageSize;
      let { teamTotal, page } = this.paginationTeam;
      if ((page - 1) * queryPageSize > teamTotal) {
        this.$nextTick(() => {
          this.fetchData(queryPage, queryPageSize);
        });
      } else {
        this.fetchData(queryPage, queryPageSize);
      }
    },
    //队伍查询 ---分页查询数据
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchTeamOld,
        page,
        pageSize: this.queryPageSize
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getSalesTeamPage(reqData).then(res => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.teamData = res.content.list;
          //分页数据
          this.paginationTeam.teamTotal = res.content.total;
          this.teamData.map(item => {
            let str = this.$util.getFormatOnlyDate(item.teamCreateDate);
            if (str.substring(0, 3) == "NaN") {
              //是IE浏览器
              item.teamCreateDate = item.teamCreateDate.substring(0, 10);
            } else {
              item.teamCreateDate = str;
            }
            //
            if (!item.teamCloseDownDate) {
              item.teamCloseDownDate = "——";
            } else {
              let str2 = this.$util.getFormatOnlyDate(item.teamCloseDownDate);
              if (str2.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.teamCloseDownDate = item.teamCloseDownDate.substring(
                  0,
                  10
                );
              } else {
                item.teamCloseDownDate = str2;
              }
            }
            item.teamCloseDownFlagName =
              item.teamCloseDownFlag == "N" ? "否" : "是";
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //队伍查询 ---管理机构不分页查询
    getManageOrgList() {
      this.$api.getManageOrgList({}).then(res => {
        if (res.result == "0") {
          this.manageList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //队伍查询 ---销售团队不分页查询
    getSalesTeamList(val) {
      this.$api.getSalesTeamList({ manageOrgCode: val }).then(res => {
        if (res.respCode == "0") {
          this.salesTeamList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //队伍查询 ---上传成功
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
        this.fetchData();
      } else {
        this.$Message.error(res.content ? res.content : res.message);
        this.fetchData();
      }
    },
    //队伍查询 上传之前事件
    beforeTeamUpload(res) {
      this.$util.showLoading();
    },
    //队伍查询---上传文件格式错误
    handleTeamError(res, file) {
      this.$util.hideLoading();
      this.$Notice.warning({
        title: "上传文件",
        desc: "支持Excel格式"
      });
    },
    //队伍查询----重置
    reset() {
      this.searchTeam = {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "" //销售团队名称
      };
      this.changeFormSearch();
    },
    // 更换个人查询form搜索
    changeFormPerson() {
      this.searchPersonOld = this.$util.convertObj(this.searchPerson);
      this.fetchPersonData();
    },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchPersonData(queryPage = 1, queryPageSize = 10) {
      this.queryPersonPageSize = queryPageSize;
      let { teamTotal, page } = this.paginationPerson;
      if ((page - 1) * queryPageSize > teamTotal) {
        this.$nextTick(() => {
          this.fetchPersonData(queryPage, queryPageSize);
        });
      } else {
        this.fetchPersonData(queryPage, queryPageSize);
      }
    },
    //个人查询---分页获取数据
    fetchPersonData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchPersonOld,
        page,
        pageSize: this.queryPersonPageSize
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.getSalesmanPage(reqData).then(res => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.personData = res.content.list;
          //分页数据
          this.paginationPerson.total = res.content.total;
          this.personData.map(item => {
            //
              if (
          item.agentImageUrl=='null'
        ) {
         item.agentImageUrl="";
        }
         /* 推广人头像	 */
          $axios({
            method: "get",
            url: item.agentImageUrl,
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
              item.agentImageUrl = src1;
            })
            .catch((e) => {
              throw e;
            });
        /*  */
            if (!item.entryDate) {
              item.entryDate = "——";
            } else {
              let str3 = this.$util.getFormatOnlyDate(item.entryDate);
              if (str3.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.entryDate = item.entryDate.substring(0, 10);
              } else {
                item.entryDate = str3;
              }
            }
            //
            if (!item.leaveDate) {
              item.leaveDate = "——";
            } else {
              let str3 = this.$util.getFormatOnlyDate(item.leaveDate);
              if (str3.substring(0, 3) == "NaN") {
                //是IE浏览器
                item.leaveDate = item.leaveDate.substring(0, 10);
              } else {
                item.leaveDate = str3;
              }
            }
            // item.entryDate = this.$util.getFormatOnlyDate(item.entryDate);
            //item.agentImageUrl = item.agentImageUrl == null ? null :item.agentImageUrl;
            // item.leaveDate = item.leaveDate
            //   ? this.$util.getFormatOnlyDate(item.leaveDate)
            //   : "——";
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //个人查询 ---管理机构不分页查询
    getSalesmanManageOrgList() {
      this.$api.getSalesmanManageOrgList({}).then(res => {
        if (res.result == "0") {
          this.manManageList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //个人查询 ---销售团队不分页查询
    getSalesmaSalesTeamList(val) {
      this.$api.getSalesmaSalesTeamList({ manageOrgCode: val }).then(res => {
        if (res.respCode == "0") {
          this.manSalesTeamList = res.content;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //个人查询 上传之前事件
    beforePersonUpload(res) {
      this.$util.showLoading();
    },
    //个人查询--上传文件格式错误
    handlePersonError(res, file) {
      this.$util.hideLoading();
      this.$Notice.warning({
        title: "上传文件",
        desc: "支持Excel格式"
      });
    },
    //个人查询--导入成功
    handlePersonSuccess(res, file, fileList) {
      this.$util.hideLoading();
      if (res.code == "0") {
        if (res.content != null) {
          if (res.content.result != "0") {
            this.$Message.error(res.content.resultMessage);
          }
        } else {
          this.$Message.success("导入成功");
        }
        //刷新页面
        this.fetchPersonData();
      } else {
        this.$Message.error(res.content ? res.content : res.message);
        this.fetchPersonData();
      }
    },
    //个人 --头像上传
    portraitImport() {
      this.show = true;
    },
    //portraitImp() {},
    handlePortraitSuccess(res, file) {
      if (res.code == "0") {
        if (res.content != null) {
          if (res.content.result != "0") {
            this.$Message.error(res.content.resultMessage);
          }
        } else {
          this.$Message.success("上传成功");
        }
        //刷新页面
        this.fetchPersonData();
      } else {
        this.$Message.error(res.content ? res.content : res.message);
        this.fetchPersonData();
      }
    },
    beforePortraitUpload() {},
    handlePortraitError(res, file) {
      this.$Message.info("上传头像支持jpg,png格式");
    },
    //个人查询---重置
    personReset() {
      this.searchPerson = {
        manageOrgCode: "", //管理机构名称
        salesTeamCode: "", //销售团队名称
        agentName: "", //业务员姓名
        agentStatus: "" //
      };
      this.changeFormPerson();
    },
    // 新增/编辑个人
    addPerson() {
      this.$router.push({
        name: "personal_add",
        query: {}
      });
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
#team-list {
  .search-box {
    display: flex;
    justify-content: space-between;
    .search-btn {
      // min-width: 200px;
      min-width: 150px;
    }
  }
  .ivu-modal-body {
    max-height: 500px;
    overflow: scroll;
  }
  /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  // 新增按钮样式
  .add-button {
    width: 80px;
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
  .import-button {
    width: 80px;
  }
  /deep/ .person-from {
    button {
      margin: 0px;
    }
  }
}
</style>
