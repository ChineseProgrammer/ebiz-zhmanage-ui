<template>
  <div>
    <Form
      :model="formItem"
      :label-width="100"
      class="form-style"
      :disabled="$route.query.type == 'view'"
    >
      <FormItem v-if="!isEdit">
        <RadioGroup v-model="radio" @on-change="changeRadio">
          <Radio label="0">单图添加</Radio>
          <Radio label="1">批量添加</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if="isEdit" label="ID">
        <div>{{ formItem.list[0].id }}</div>
      </FormItem>
      <Row v-for="(item, index) in bannerNum" :key="index">
        <Col span="12"
          ><FormItem>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="(value) => handleSuccess(index, value)"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              :action="actionUpload"
              :headers="actionUploadHeaders"
              :data="submitData"
              style="display: inline-block; width: 100px; height: 100px"
              v-if="$route.query.type != 'view'"
            >
              <div style="width: 100px; height: 100px; line-height: 100px">
                <Icon type="ios-add" size="20"></Icon>
              </div>
              <div
                v-if="
                  isEdit &&
                  formItem.list[item].filePath != null &&
                  formItem.list[item].filePath != ''
                "
              >
                <Icon
                  type="ios-close-circle"
                  size="20"
                  @click.stop="remove(index)"
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
                :src="formItem.list[item].filePath"
                alt=""
                style="
                  width: 100px;
                  position: absolute;
                  top: 0px;
                  z-index: 100;
                  left: 0px;
                "
                v-if="
                  formItem.list[item].filePath != '' &&
                  formItem.list[item].filePath != null
                "
              />
            </Upload>
            <div v-else style="width: 100px; heigth: 100px">
              <img
                :src="formItem.list[item].filePath"
                alt=""
                style="width: 100px; heigth: 100%"
                v-if="
                  formItem.list[item].filePath != '' &&
                  formItem.list[item].filePath != null
                "
              />
            </div>
            <p>单张上传最大限制2M，jpg、png格式</p>
          </FormItem>
        </Col>
        <Col span="12"
          ><FormItem label="标题：">
            <Input
              v-model="formItem.list[item].fileTitle"
              placeholder="输入标题（1-50字）"
            ></Input>
          </FormItem>
          <FormItem label="图片链接：">
            <Input
              v-model="formItem.list[item].filePath"
              placeholder="输入URL"
            ></Input>
          </FormItem>
          <FormItem label="外部链接：">
            <Input
              v-model="formItem.list[item].forwardUrl"
              @on-change="forwardUrlInput($event, index)"
              placeholder="输入URL"
              :disabled="formItem.list[item].externalLinkDisabled"
            ></Input>
          </FormItem>
          <FormItem label="内部链接：">
            <div
              style="
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 15px 10px;
              "
            >
              <Select
                :disabled="formItem.list[item].themeIdsabled"
                placeholder="请选择主题"
                clearable
                v-model="formItem.list[item].theme_id"
                @on-change="themeIdChange($event, index)"
              >
                <Option
                  v-for="item in themeList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
              <Cascader
                :disabled="formItem.list[item].themeIdsabled"
                :data="formItem.list[item].nblmDataList"
                :change-on-select="true"
                v-model="formItem.list[item].choosenblmList"
                @on-change="changenbColumn($event, index)"
                transfer
                placeholder="请选择栏目"
              ></Cascader>
              <Select
                :disabled="formItem.list[item].themeIdsabled"
                placeholder="请选择内容"
                clearable
                v-model="formItem.list[item].content_id"
              >
                <Option
                  v-for="item in formItem.list[item].themeList3"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <!-- <Button style="" @click="handleSubmit(2)"> 返回 </Button>
        <Button style="" @click="handleSubmit(0)"> 保存草稿 </Button>
        <Button type="primary" @click="handleSubmit(1)">发布</Button> -->
      </FormItem>
    </Form>
    <!-- 按钮 -->
    <div style="text-align: center">
      <Button @click="$router.go(-1)"> 返回 </Button>
      <Button @click="handleSubmit(0)" v-if="$route.query.type != 'view'">
        保存草稿
      </Button>
      <Button
        type="primary"
        @click="handleSubmit(1)"
        v-if="$route.query.type != 'view' && button.cmsImgRelease"
        >发布</Button
      >
      <Button
        type="primary"
        @click="handleSubmit(4)"
        v-if="$route.query.type != 'view' && button.bannerCommitAudit"
        >提交审核</Button
      >
      <Button
        type="primary"
        @click="clickAudit()"
        v-if="
          $route.query.type == 'view' &&
          button.auditBtn &&
          $route.query.param.auditResult != 0 &&
          $route.query.param.auditResult != 1
        "
        >审核</Button
      >
    </div>
    <!-- 审核弹框 -->
    <checkModal ref="checkModal" @sure="modalSure" />
  </div>
</template>
<script>
import { decrypt, encrypt } from "@/api/sm4";
import checkModal from "./checkModal.vue";
export default {
  name: "",
  data() {
    return {
      isAdminCenter: false,
      button: this.$store.state.app.button,
      isEdit: false,
      submitData: {
        bucket: "contentBanner",
      },
      actionUpload: this.$api.uploadImage,
      actionUploadHeaders: { sid: window.sessionStorage.getItem("sid") },
      bannerNum: [0],
      radio: "0",
      formItem: {
        list: [
          {
            fileTitle: "", //图片标题
            filePath: "", //图片地址
            toFilePath: "",
            forwardUrl: "", //跳转链接
            themeIdsabled: false,
            externalLinkDisabled: false,
            status: 0, //草稿
            theme_id: "",
            content_id: "",
            themeList3: [],
            choosenblmList: [], // 栏目选择的id集合
            nblmDataList: [], // 内部链接栏目--数据-树
          },
          {
            fileTitle: "", //图片标题
            filePath: "", //图片地址
            toFilePath: "",
            forwardUrl: "", //跳转链接
            themeIdsabled: false,
            externalLinkDisabled: false,
            status: 0, //草稿
            theme_id: "",
            content_id: "",
            themeList3: [],
            choosenblmList: [], // 栏目选择的id集合
            nblmDataList: [], // 内部链接栏目--数据-树
          },
          {
            fileTitle: "", //图片标题
            filePath: "", //图片地址
            toFilePath: "",
            forwardUrl: "", //跳转链接
            themeIdsabled: false,
            externalLinkDisabled: false,
            status: 0, //草稿
            theme_id: "",
            content_id: "",
            themeList3: [],
            choosenblmList: [], // 栏目选择的id集合
            nblmDataList: [], // 内部链接栏目--数据-树
          },
          {
            fileTitle: "", //图片标题
            filePath: "", //图片地址
            toFilePath: "",
            forwardUrl: "", //跳转链接
            themeIdsabled: false,
            externalLinkDisabled: false,
            status: 0, //草稿
            theme_id: "",
            content_id: "",
            themeList3: [],
            choosenblmList: [], // 栏目选择的id集合
            nblmDataList: [], // 内部链接栏目--数据-树
          },
          {
            fileTitle: "", //图片标题
            filePath: "", //图片地址
            toFilePath: "",
            forwardUrl: "", //跳转链接
            themeIdsabled: false,
            externalLinkDisabled: false,
            status: 0, //草稿
            theme_id: "",
            column_id: "",
            content_id: "",
            themeList3: [],
            choosenblmList: [], // 栏目选择的id集合
            nblmDataList: [], // 内部链接栏目--数据-树
          },
        ],
      },
      themeList: [],
      defaultList: [],
      uploadList: [],
      bannerId: "",
      temContentStatus: "", // 判断编辑的内容是不是待审核
    };
  },
  components: { checkModal },
  watch: {},
  created() {
    let that = this;
    that.getInsideTheme();
    that.isEdit = that.$route.query.hasOwnProperty("id") ? true : false;
    that.bannerId = that.$route.query.bannerId;
    if (that.$route.query.hasOwnProperty("id")) {
      that.getDetail(that.$route.query.id);
    }
  },
  mounted() {},
  methods: {
    getDetail(id) {
      this.$api
        .bannerViewDetail({ id: id })
        .then(async (res) => {
          if (res.result == 0) {
            // 编辑，查看都是单条的数据  新增可以新增多条
            this.formItem.list = [
              Object.assign(this.formItem.list[0], res.content),
            ];
            if (res.content.forwardUrl && res.content.forwardUrlType == "0") {
              //判断内部链接
              let arr = res.content.forwardUrl.split("#"); // arr中第一个数字（2--主题，3--栏目，4--内容）
              this.formItem.list[0].theme_id = arr[1];
              let resultColumn = await this.getInsideColumn(
                this.formItem.list[0].theme_id,
                0
              ); // 获取该主题下的栏目list
              if (resultColumn) {
                if (arr[0] == 2) {
                  // 只有主题
                  this.formItem.list[0].choosenblmList = [];
                } else if (arr[0] == 3) {
                  // 主题栏目
                  this.formItem.list[0].choosenblmList = arr.filter(
                    (ite, i) => i > 1
                  );
                } else if (arr[0] == 4) {
                  // 主题栏目内容
                  this.formItem.list[0].choosenblmList = arr.filter(
                    (ite, i) => i > 1 && i != arr.length
                  );
                  this.getContentList(
                    this.formItem.list[0].theme_id,
                    this.formItem.list[0].choosenblmList[
                      this.formItem.list[0].choosenblmList.length - 1
                    ],
                    0
                  ); // 获取内部链接此栏目下内容list
                  this.formItem.list[0].content_id =
                    arr[this.formItem.list[0].choosenblmList.length - 1];
                }
                // 内部链接有值，外链接只读
                this.formItem.list[0].externalLinkDisabled = true;
                this.formItem.list[0].themeIdsabled = false;
                this.formItem.list[0].forwardUrl = "";
              }
            } else {
              if (this.formItem.list[0].forwardUrl) {
                this.formItem.list[0].themeIdsabled = true;
                this.formItem.list[0].externalLinkDisabled = false;
              }
            }
            // 这条数据状态--拥有与区别发布时是否弹框
            this.temContentStatus = res.content.status;
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
    // 外部链接在输入 清空内部链接的选项
    forwardUrlInput(e, index) {
      let that = this;
      if (e.data) {
        that.formItem.list[index].themeIdsabled = true;
        that.formItem.list[index].theme_id = "";
        that.formItem.list[index].column_id = "";
        that.formItem.list[index].content_id = "";
        that.formItem.list[index].choosenblmList = [];
      } else {
        that.formItem.list[index].themeIdsabled = false;
      }
    },
    // 内部链接选择主题change
    themeIdChange(e, index) {
      console.log("themeID主题" + e);
      this.formItem.list[index].choosenblmList = []; // 清空栏目选择内容
      this.formItem.list[index].content_id = ""; // 清空内容
      if (e) {
        this.getInsideColumn(e, index);
        this.formItem.list[index].externalLinkDisabled = true;
      } else {
        this.$set(this.formItem.list[index], "externalLinkDisabled", false);
        this.formItem.list[index].content_id = "";
        this.formItem.list[index].themeList3 = [];
      }
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
    //   获取主题下的栏目
    getInsideColumn(themeId, index) {
      return new Promise((resolve, reject) => {
        this.$api
          .getInsideColumn({
            themeId: themeId,
          })
          .then((res) => {
            if (res.result == 0) {
              if (res.content && res.content.length > 0) {
                this.formItem.list[index].nblmDataList = this.convertTree(
                  res.content
                );
                resolve(true);
              } else {
                this.formItem.list[index].nblmDataList = [];
                resolve(false);
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
            reject(err);
          });
      });
    },
    // 内部链接--栏目选择
    changenbColumn(data, index) {
      this.formItem.list[index].content_id = null; // 清空
      this.formItem.list[index].choosenblmList = data; //栏目选中值
      if (data && data.length > 0) {
        let columnList = this.formItem.list[index].choosenblmList;
        this.getContentList(
          this.formItem.list[index].theme_id,
          columnList[columnList.length - 1],
          index
        );
      }
      this.$forceUpdate();
    },
    //  不分页查询内容管理
    getContentList(themeId, columnId, index) {
      this.$api
        .getContentList({
          themeId, //主题
          columnId, //栏目
        })
        .then((res) => {
          if (res.result == 0) {
            console.log(this.formItem.list);
            this.$set(this.formItem.list[index], "themeList3", res.content);
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
    remove(index) {
      this.formItem.list[index].filePath = null;
      this.formItem.list[index].toFilePath = null;
    },
    changeRadio(val) {
      if (val == "0") {
        this.bannerNum = [0];
      } else {
        this.bannerNum = [0, 1, 2, 3, 4];
      }
    },
    handleFormatError(file) {
      this.$Message.error("文件格式是jpg或者png.");
    },
    handleMaxSize(file) {
      this.$Message.error("单张上传最大限制2M.");
    },
    handleBeforeUpload(value) {},
    handleSuccess(index, value) {
      //解密
      if (typeof value == "string") {
        value = JSON.parse(decrypt(value));
      }
      if (value.code == 0) {
        this.formItem.list[index].filePath = value.content.content.url;
        this.formItem.list[index].toFilePath =
          value.content.content.absolute_url;
      }
    },
    handleSubmit(type) {
      console.log(this.formItem);
      let formItem = {};
      formItem = JSON.parse(JSON.stringify(this.formItem));
      //formItem.filePath=formItem.toFilePath
      if (type == 2) {
        this.$router.push({
          name: "slidesshow",
        });
        return false;
      }
      let list = [];
      if (this.radio == "0") {
        list = formItem.list.slice(0, 1);
      } else {
        list = formItem.list;
      }
      let reqData = list.filter((item) => {
        if (item.filePath != "") {
          item.status = type;
          return item;
        }
      });
      if (reqData.length < 1) {
        this.$Message.success("图片不能为空");
        return false;
      }
      console.log(reqData, "提交数据");
      reqData.map((r) => {
        if (r.toFilePath) {
          r.filePath = r.toFilePath;
        }
        if (r.forwardUrl) {
          r.forwardUrlType = "1";
        }
      });
      reqData.map((e) => {
        if (!e.forwardUrl && e.theme_id) {
          let columnId =
            e.choosenblmList && e.choosenblmList.length > 0
              ? e.choosenblmList.join("#")
              : "";
          if (e.content_id && columnId) {
            // 主题，栏目，内容都有值
            e.forwardUrl = `4#${e.theme_id}#${columnId}#${e.content_id}`;
          } else if (columnId) {
            // 主题，栏目都有值
            e.forwardUrl = `3#${e.theme_id}#${columnId}`;
          } else {
            // 主题有值
            e.forwardUrl = `2#${e.theme_id}`;
          }
          //连接类型(0:内部链 1:外部链)
          e.forwardUrlType = "0";
        }
        e.bannerId = this.bannerId;
      });
      let thisUrl = null;
      if (type == 4) {
        thisUrl = this.isEdit
          ? this.$api.batchUpdateAndCommit
          : this.$api.batchAddAndCommit;
      } else {
        thisUrl = this.isEdit
          ? this.$api.updateBannerData
          : this.$api.newBannerData;
      }
      // 发布弹框提示
      if (this.temContentStatus == 4&&( type == 1||type == 4 )) {
        let title = type == 1 ? "确认发布" : type == 4 ? "提交审核" : "";
        let content =
          type == 1
            ? "<p>当前内容正在审核中，点击确定将发布内容并完结审核流程</p>"
            : type == 4
            ? "<p>当前内容正在审核中，请不要重复提交</p>"
            : "";
        let tip = type == 1 ? "发布成功" : type == 4 ? "提交审核成功" : "";
        this.$Modal.confirm({
          title: title,
          content: content,
          onOk: () => {
            if (type != 4) {
              thisUrl(reqData)
                .then((res) => {
                  if (res.result == "0" && res.code != 500) {
                    this.$Message.success(tip);
                    this.$router.push({
                      name: "slidesshow",
                    });
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
            }
          },
        });
      } else {
        thisUrl(reqData)
          .then((res) => {
            if (res.result == "0" && res.code != 500) {
              let mes =
                type == 0
                  ? "保存草稿成功"
                  : type == 1
                  ? "发布成功"
                  : type == 4
                  ? "提交审核成功"
                  : "";
              this.$Message.success(mes);
              this.$router.push({
                name: "slidesshow",
              });
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
      }
    },
    // 审核
    clickAudit() {
      this.$refs.checkModal.openModal(this.$route.query.param);
    },
    // 弹框点击确定
    modalSure() {
      this.$router.replace({ name: "auditRecordList" });
    },
  },
};
</script>
<style lang="less" scoped>
.form-style {
  width: 600px;
  margin: 0 auto;
}
</style>