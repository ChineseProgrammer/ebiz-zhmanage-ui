<template>
  <div>
    <Form
      ref="formValidate"
      :model="formItem"
      :rules="ruleValidate"
      :label-width="100"
      class="form-style"
      :disabled="$route.query.type == 'view'"
    >
      <Row>
        <Col span="12">
          <FormItem label="标题：" prop="title"
            ><Input
              v-model="formItem.title"
              maxlength="50"
              placeholder="请输入标题（1-50字）"
            ></Input
          ></FormItem>
          <FormItem label="Banner图：">
            <div>
              <RadioGroup
                v-model="formItem.bannerStatus"
                @on-change="changeSelectPic"
              >
                <Radio label="0">单图</Radio>
                <Radio label="1">多图</Radio>
              </RadioGroup>
              <span>单张上传最大限制 800K，jpg、png格式</span>
            </div>
            <div
              v-show="formItem.cmsContentImageList[0]"
              style="display: inline-block"
              class="demo-upload-list"
              v-for="(item, index) in formItem.cmsContentImageList[0].linkList"
              :key="index"
            >
              <template>
                <img :src="item" class="imgStyle" />
                <div
                  class="demo-upload-list-cover"
                  v-if="$route.query.type != 'view'"
                >
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemove(1, item, index)"
                  ></Icon>
                </div>
              </template>
            </div>
            <div v-if="$route.query.type != 'view'">
              <Upload
                v-if="
                  (formItem.bannerStatus == '0' &&
                    formItem.cmsContentImageList[0].linkList.length < 1) ||
                  formItem.bannerStatus == '1'
                "
                ref="upload"
                :show-upload-list="false"
                :default-file-list="bannerList"
                :on-success="handleSuccessBanner"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="800"
                :before-upload="beforeUpdateBan"
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
              </Upload>
            </div>
          </FormItem>
          <FormItem label="内容长图">
            <div
              v-show="
                formItem.cmsContentImageList[1] &&
                formItem.cmsContentImageList[1].linkList[0] != null
              "
              style="display: inline-block"
              class="demo-upload-list"
              v-for="(item, index) in formItem.cmsContentImageList[1].linkList"
              :key="index"
            >
              <template>
                <img :src="item" class="imgStyle" />
                <div
                  class="demo-upload-list-cover"
                  v-if="$route.query.type != 'view'"
                >
                  <Icon
                    type="ios-trash-outline"
                    @click.native="handleRemove(2, item, index)"
                  ></Icon>
                </div>
              </template>
            </div>
            <div v-if="$route.query.type != 'view'">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="bannerList"
                :on-success="handleSuccessContent"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="800"
                :before-upload="beforeUpdateFun"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                multiple
                type="drag"
                :action="actionUpload"
                :headers="actionUploadHeaders"
                :data="submitData"
                style="display: inline-block; width: 100px; height: 100px"
              >
                <div style="width: 100px; height: 100px; line-height: 100px">
                  <Icon type="ios-add" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="上传其他图：">
            <div class="up-other-style">
              <p>推荐方图</p>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="recomFlonList"
                :on-success="handleSuccessSide"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="800"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
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
                    formItem.cmsContentImageList[2] &&
                    formItem.cmsContentImageList[2].linkList.length == 1
                  "
                >
                  <Icon
                    type="ios-close-circle"
                    size="20"
                    @click.stop="remove(3)"
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
                  :src="formItem.cmsContentImageList[2].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[2] &&
                    formItem.cmsContentImageList[2].linkList[0] != null
                  "
                />
              </Upload>
              <div v-else>
                <img
                  :src="formItem.cmsContentImageList[2].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[2] &&
                    formItem.cmsContentImageList[2].linkList[0] != null
                  "
                />
              </div>
            </div>
            <div class="up-other-style">
              <p>推荐长图</p>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="recomPiiicList"
                :on-success="handleSuccessLong"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="800"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
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
                    formItem.cmsContentImageList[3] &&
                    formItem.cmsContentImageList[3].linkList.length == 1
                  "
                >
                  <Icon
                    type="ios-close-circle"
                    size="20"
                    @click.stop="remove(4)"
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
                  :src="formItem.cmsContentImageList[3].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[3] &&
                    formItem.cmsContentImageList[3].linkList[0] != null
                  "
                />
              </Upload>
              <div v-else>
                <img
                  :src="formItem.cmsContentImageList[3].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[3] &&
                    formItem.cmsContentImageList[3].linkList[0] != null
                  "
                />
              </div>
            </div>
            <div class="up-other-style">
              <p>分享宣传图</p>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="sharePicList"
                :on-success="handleSuccessshare"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="800"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
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
                    formItem.cmsContentImageList[4] &&
                    formItem.cmsContentImageList[4].linkList.length == 1
                  "
                >
                  <Icon
                    type="ios-close-circle"
                    size="20"
                    @click.stop="remove(5)"
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
                  :src="formItem.cmsContentImageList[4].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[4] &&
                    formItem.cmsContentImageList[4].linkList[0] != null
                  "
                />
              </Upload>
              <div v-else>
                <img
                  :src="formItem.cmsContentImageList[4].linkList[0]"
                  alt=""
                  style="
                    width: 100px;
                    position: absolute;
                    top: 0px;
                    z-index: 100;
                    left: 0px;
                  "
                  v-if="
                    formItem.cmsContentImageList[4] &&
                    formItem.cmsContentImageList[4].linkList[0] != null
                  "
                />
              </div>
            </div>
          </FormItem>
          <!--  <FormItem v-if="formItem.theme=='20002'" label="播放角标：">
               <RadioGroup v-model="formItem.corner">
                   <Radio v-for="(q,index) in lecture_hallList" :label="q.code" :key="index">{{q.name}}</Radio> 
             <Radio label="">否</Radio> 
            </RadioGroup>
          </FormItem> -->
          <FormItem label="添加角标：">
            <RadioGroup v-model="formItem.corner">
              <Radio
                v-for="(q, index) in theme_travelList"
                :label="q.code"
                :key="index"
                >{{ q.name }}</Radio
              >
              <Radio label="">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="副标题：" style="padding-right: 20px">
            <Input
              type="textarea"
              v-model="formItem.subtitle"
              maxlength="50"
              placeholder="请输入副标题（1-50字）"
            ></Input>
          </FormItem>
          <FormItem
            v-for="(item, index) in contentSummaryNum"
            :key="index"
            :label="'内容介绍' + (index + 1) + '：'"
            style="position: resolve; padding-right: 20px"
          >
            <span v-if="$route.query.type != 'view'">
              <Icon
                type="ios-add-circle"
                v-if="index + 1 == contentSummaryNum.length"
                @click="addcontentSummary"
                style="
                  position: absolute;
                  bottom: 0px;
                  right: -20px;
                  z-index: 1000;
                  font-size: 20px;
                  color: #2d8cf0;
                "
              />
              <Icon
                type="ios-close-circle-outline"
                v-if="index !== 0 && index + 1 == contentSummaryNum.length"
                @click="delcontentSummary"
                style="
                  position: absolute;
                  bottom: 0px;
                  right: -40px;
                  z-index: 1000;
                  font-size: 20px;
                  color: red;
                "
              />
            </span>
            <Input
              v-model="formItem.contentIntroduces[index]"
              type="textarea"
              maxlength="200"
              placeholder="请输入（1-200字）"
            ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem v-if="formItem.id" label="内容编号：">
            <div>{{ formItem.id }}</div>
          </FormItem>
          <FormItem label="内容类型：" prop="contentType">
            <Select v-model="formItem.contentType">
              <Option value="travel_detail">图文</Option>
              <!-- <Option
                v-for="item in contentType"
                :value="item.value"
                :key="item.value"
                >{{ item.name }}</Option
              > -->
            </Select></FormItem
          >
          <FormItem label="所属主题：" prop="theme">
            <Select v-model="formItem.theme" @on-change="themeChange()">
              <Option
                v-for="item in channelData"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="所属栏目" prop="choosewblmList">
            <Cascader
              :data="wblmDataList"
              :change-on-select="true"
              v-model="formItem.choosewblmList"
              @on-change="changewbColumn"
              transfer
              placeholder="请选择栏目"
            ></Cascader>
          </FormItem>
          <!-- <FormItem v-if="(showType=='three')||(showType=='four')" label="二级栏目：">
            <Select v-model="formItem.themeId" @on-change="theme2Change()">
              <Option
                v-for="item in theirChannel"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
           <FormItem v-if="showType=='two'" label="二级栏目：">
             <Select multiple v-model="formItem.themeId2">
              <Option
                v-for="item in theirChannel"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
            <FormItem v-if="showType=='four'" label="三级栏目：" >
            <Select v-model="formItem.themeId3" @on-change="theme3Change()">
              <Option
                v-for="item in channelList"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
           <FormItem v-if="(showType=='three')&&channelList[0]" label="三级栏目：" prop="channelIdList">
            <Select v-model="formItem.channelIdList" multiple>
              <Option
                v-for="item in channelList"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem>
            <FormItem v-if="showType=='four'" label="四级栏目：">
            <Select v-model="formItem.channelIdList4" multiple>
              <Option
                v-for="item in channelList4"
                :value="item.id"
                :key="item.id"
                >{{ item.channelName }}</Option
              >
            </Select>
          </FormItem> -->
          <FormItem
            v-if="formItem.theme == '20002' || formItem.theme == '20004'"
            label="直播日期："
          >
            <DatePicker
              :value="formItem.playTime"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 100%"
              placement="bottom-end"
              placeholder="请选择"
              v-model="formItem.playTime"
              @on-change="dateStartChange"
            ></DatePicker>
          </FormItem>
          <FormItem v-else label="单位配置：">
            <div
              style="
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 15px 10px;
              "
            >
              会员价：
              <Input
                type="number"
                prefix="logo-yen"
                v-model="formItem.vipPrice"
                placeholder="请输入会员价"
                :maxlength="15"
                @on-blur="
                  if (formItem.vipPrice.length > 15)
                    formItem.vipPrice = formItem.vipPrice.slice(0, 15);
                "
              ></Input>
              原价：
              <Input
                type="number"
                prefix="logo-yen"
                v-model="formItem.originalPrice"
                placeholder="请输入原价"
                :maxlength="15"
                @on-blur="
                  if (formItem.originalPrice.length > 15)
                    formItem.originalPrice = formItem.originalPrice.slice(
                      0,
                      15
                    );
                "
              ></Input>
            </div>
          </FormItem>
          <FormItem label="外部链接：">
            <Input
              :disabled="externalLinkDisabled"
              v-model="externalLink"
              placeholder="输入URL"
              :maxlength="150"
            ></Input
          ></FormItem>
          <FormItem label="内部链接：">
            <div
              style="
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 15px 10px;
              "
            >
              <Select
                @on-change="themeDataChange()"
                :disabled="themeIdsabled"
                placeholder="请选择主题"
                clearable
                v-model="formItem.theme_id"
              >
                <Option
                  v-for="item in themeList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
              <!-- <Select @on-change="columnDataChange(formItem.column_id)" :disabled="themeIdsabled" placeholder="请选择栏目" clearable v-model="formItem.column_id" style="margin: 8px 0;" v-if="formItem.theme_id=='20001'">
                      <Option
                        v-for="item in themeList2"
                        :value="item.id"
                        :key="item.id"
                        >{{ item.name }}</Option
                      >
            </Select>
            <div v-else>
              <div v-for="(itemList,index) in columnList" :key="index">
                <Select @on-change="columnDataChange(wbljColumnId[index],index)" :disabled="themeIdsabled" placeholder="请选择栏目" clearable v-model.trim="wbljColumnId[index]" style="margin: 8px 0;">
                        <Option
                          v-for="j in itemList"
                          :value="j.id"
                          :key="j.id"
                          >{{ j.name }}</Option
                        >
              </Select>
            </div>
            </div> -->
              <Cascader
                :disabled="themeIdsabled"
                :data="nblmDataList"
                :change-on-select="true"
                v-model="choosenblmList"
                @on-change="changenbColumn"
                transfer
                placeholder="请选择栏目"
              ></Cascader>
              <Select
                :disabled="themeIdsabled"
                placeholder="请选择内容"
                clearable
                v-model.trim="formItem.content_id"
              >
                <Option
                  v-for="item in themeList3"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
          </FormItem>
          <FormItem label="按钮名称：" prop="buttonName">
            <Input
              v-model="formItem.buttonName"
              maxlength="20"
              placeholder="输入中、英文（1-20字）"
            ></Input
          ></FormItem>
          <FormItem label="跳转鉴权：">
            <RadioGroup v-model="formItem.loginFlag">
              <Radio label="0">是</Radio>
              <Radio label="1">否</Radio>
            </RadioGroup></FormItem
          >
          <FormItem label="支持分享：">
            <RadioGroup v-model="formItem.sharedStatus">
              <Radio label="0">是</Radio>
              <Radio label="1">否</Radio>
            </RadioGroup></FormItem
          >
          <FormItem label="分享标题：">
            <Input
              type="textarea"
              v-model="formItem.sharedTitle"
              maxlength="50"
              placeholder="输入标题（1-50字）"
            ></Input
          ></FormItem>
          <FormItem label="分享文案：">
            <Input
              type="textarea"
              v-model="formItem.sharedCopy"
              maxlength="200"
              placeholder="输入标题（1-200字）"
            ></Input
          ></FormItem>
          <FormItem label="管家浮标：">
            <RadioGroup v-model="formItem.stewardBuoy">
              <Radio label="0">展示</Radio>
              <Radio label="1">隐藏</Radio>
            </RadioGroup></FormItem
          >
          <FormItem label="标签：">
            <div
              style="
                border: 1px solid #dcdee2;
                border-radius: 4px;
                padding: 2px;
              "
            >
              <div>
                <span
                  v-for="(item, index) in selectLabel"
                  :key="index"
                  style="
                    border: 1px solid #2d8cf0;
                    border-radius: 4px;
                    padding: 3px 20px 3px 5px;
                    position: relative;
                    color: #2d8cf0;
                    background: rgba(242, 242, 242, 1);
                  "
                  ><Icon
                    type="md-close"
                    style="
                      position: absolute;
                      right: 0px;
                      top: 4px;
                      z-index: 1000;
                    "
                    @click="removeLabelName(index)"
                  />{{ item.labelName }}</span
                >
              </div>
              <Tree
                :data="labelTagTree"
                :check-strictly="false"
                show-checkbox
                ref="labelMenu"
                @on-check-change="checkLabelMenu"
              ></Tree>
            </div>
          </FormItem>
        </Col>
      </Row>
      <!-- <FormItem style="text-align: center">
        <Button @click="goBack()"> 返回 </Button>
        <Button @click="handleSubmit(0)" v-if="$route.query.type != 'view'">
          保存草稿
        </Button>
        <Button
          type="primary"
          @click="handleSubmit(1)"
          v-if="$route.query.type != 'view'&&button.cmsContentRelease"
          >发布</Button
        >
        <Button
          type="primary"
          @click="handleSubmit(4)"
          v-if="$route.query.type != 'view'&&button.commitAudit"
          >提交审核</Button
        >
        <Button
          type="primary"
          @click="clickAudit()"
          v-if="$route.query.type == 'view'&&button.auditBtn"
          >审核</Button
        >
      </FormItem> -->
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
        v-if="$route.query.type != 'view' && button.cmsContentRelease"
        >发布</Button
      >
      <!-- <Button
          type="primary"
          @click="commitSubmit(4)"
          v-if="$route.query.type != 'view'&&button.commitAudit"
          >提交审核</Button
        > -->
      <Button
        type="primary"
        @click="handleSubmit(4)"
        v-if="$route.query.type != 'view' && button.commitAudit"
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
      channelList4: [],
      newArry: [],
      channelLevel: 0,
      theme_travelList: [],
      lecture_hallList: [],
      showType: "two",
      contentSummaryNum: [""],
      isEdit: false,
      submitData: {
        bucket: "contentOther",
      },
      actionUpload: this.$api.uploadImage,
      actionUploadHeaders: { sid: window.sessionStorage.getItem("sid") },
      bannerList: [],
      contentList: [],
      recomFlonList: [],
      recomPiiicList: [],
      sharePicList: [],
      contentType: [
        {
          value: "travel_detail",
          name: "图文",
        },
      ],
      themeIdsabled: false,
      externalLinkDisabled: false,
      formItem: {
        bannerStatus: "0", //banner图是否单图
        buttonName: "", //按钮名称
        channelIdList: [], //所属栏目列表
        cmsContentImageList: [
          {
            //	其他图列表
            linkList: [], //图片链接
            type: 0, //图片类型banner
          },
          {
            linkList: [], //图片链接
            type: 1, //图片类型，内容长图
          },
          {
            linkList: [], //图片链接
            type: 2, //图片类型，推荐方图
          },
          {
            linkList: [], //图片链接
            type: 3, //图片类型，推荐长图
          },
          {
            linkList: [], //图片链接
            type: 4, //图片类型，分享宣传图
          },
        ],
        id: "",
        contentIntroduces: [], //内容介绍
        contentStatus: 0, //保存草稿是0 发布是1 内容状态
        contentSummary: 1, //内容摘要
        contentType: null, //内容类型
        externalLink: "", //外部链接
        labelIdList: [], //标签列表
        linkIdList: [], //内部链接列表
        sharedCopy: "", //分享文案
        sharedStatus: "0", //是否支持分享
        loginFlag: "0",
        /**
         * 登录鉴权，0-鉴权，1-非鉴权
         */ sharedTitle: "", //分享标题
        stewardBuoy: "0", //管家浮标是否展示
        corner: "0", //角标类型
        subscriptPath: "",
        subtitle: "", //副标题
        theme: "20001", //所属主题
        choosewblmList: [], // 所属栏目--选择的值
        title: "", //标题
        vipPrice: "", //单位配置
        originalPrice: "",
        content_id: "", // 内部链接--内容
        theme_id: "", // 内部链接--主题
      },
      externalLink: "", //外部链接
      ruleValidate: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        contentType: [
          { required: true, message: "请选择内容类型", trigger: "change" },
        ],
        theme: [
          { required: true, message: "请选择所属主题", trigger: "change" },
        ],
        choosewblmList: [
          {
            required: true,
            type: "array",
            message: "请选择所属栏目",
            trigger: "change",
          },
        ],
        themeId: [
          { required: true, message: "请选择二级栏目", trigger: "change" },
        ],
        themeId2: [
          {
            required: true,
            type: "array",
            message: "请选择二级栏目",
            /*   trigger: "change", */
          },
        ],
        themeId3: [{ required: true, message: "请选择三级栏目" }],
        channelIdList: [
          {
            required: true,
            type: "array",
            message: "请选择三级栏目",
            trigger: "change",
          },
        ],
        channelIdList4: [
          {
            required: true,
            type: "array",
            message: "请选择四级栏目",
            trigger: "change",
          },
        ],
        buttonName: [
          {
            required: false,
            message: "请输入中英文（1-20字）",
            trigger: "blur",
            pattern: "^[\u4e00-\u9fa5_a-zA-Z]*$",
          },
        ],
      },
      defaultList: [],
      channelData: [], //主题栏目
      themeList: [],
      themeList2: [],
      themeList3: [],
      channelList: [],
      theirChannel: [
        /* {
          channelName: "主题游学",
          channelCode: "2",
          bannerName: "测试20001",
          bannerId: "20001",
          children: null,
        }, */
      ], //所属栏目
      labelTagTree: [], //标签
      selectLabel: [],
      columnList: [], //外部链接--栏目
      wbljColumnId: [], //外部链接--栏目--朝智讲堂绑定值
      nblmDataList: [], // 内部链接栏目--数据-树
      choosenblmList: [], // 内部链接栏目--选择的值

      wblmDataList: [], // 所属栏目--数据-树
      temContentStatus: "", // 判断编辑的内容是不是待审核
    };
  },
  components: { checkModal },

  created() {},
  mounted() {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.getInsideTheme();
    this.getLabelTree();
    this.queryRelationInfo("theme_travel");
    // 默认主题游学下的栏目
    this.getBelongColumn("20001");
    if (this.$route.query.type == "view") {
      this.getDetail(this.$route.query.id);
      console.log(this.$route.query, 5656);
    } else {
      this.channelSearch();
    }
  },
  methods: {
    // 查看
    getDetail(id) {
      this.$api
        .contentQuery({ id: id })
        .then((res) => {
          console.log(res);
          if (res.result == "0") {
            this.formItem = res.content;
            //内容管理角标健康管理:healthy_manage
            //内容管理角标康养旅居	:healthy_travel
            //内容管理角标朝智讲堂	:lecture_hall
            //内容管理角标主题游学	:theme_travel
            // if (res.content.channelTree[0].id == "20001") {
            //   this.queryRelationInfo("theme_travel");
            // } else if (res.content.channelTree[0].id == "20002") {
            //   this.queryRelationInfo("lecture_hall");
            // } else if (res.content.channelTree[0].id == "20003") {
            //   this.queryRelationInfo("healthy_travel");
            // } else if (res.content.channelTree[0].id == "20004") {
            //   this.queryRelationInfo("healthy_manage");
            // }
            if (res.content.treeUrl) {
              let tempList = res.content.treeUrl.split(",");
              if (tempList[0] == "20001") {
                this.queryRelationInfo("theme_travel");
              } else if (tempList[0] == "20002") {
                this.queryRelationInfo("lecture_hall");
              } else if (tempList[0] == "20003") {
                this.queryRelationInfo("healthy_travel");
              } else if (tempList[0] == "20004") {
                this.queryRelationInfo("healthy_manage");
              }
              // 所属主题，所属栏目反显
              this.formItem.theme = tempList[0]; //所属主题
              this.getBelongColumn(this.formItem.theme);
              this.formItem.choosewblmList = tempList.filter((o, i) => i != 0);
            }
            //  else{
            //    this.formItem.theme="20001"//所属主题--默认主题游学
            //  }
            if (!this.formItem.corner) {
              this.formItem.corner = "";
            }

            //this.themeId = this.formItem.themeId;
            if (res.content.linkType === "0") {
              //内部链接有值
              if (res.content.externalLink) {
                let tempNBLinkList = JSON.parse(
                  JSON.stringify(res.content.externalLink)
                ).split("#");
                this.formItem.theme_id = tempNBLinkList[1];
                this.getInsideColumn(this.formItem.theme_id);
                let tempLen = tempNBLinkList.length;
                // externalLink 这个中第一个数字（2--主题，3--栏目，4--内容）
                if (tempNBLinkList[0] == 2) {
                  this.choosenblmList = [];
                } else if (tempNBLinkList[0] == 3) {
                  this.choosenblmList = tempNBLinkList.filter(
                    (ite, i) => i > 1
                  );
                } else if (tempNBLinkList[0] == 4) {
                  this.choosenblmList = tempNBLinkList.filter(
                    (ite, i) => i > 1 && i != tempNBLinkList.length
                  );
                  this.getContentList(
                    this.choosenblmList[this.choosenblmList.length - 1]
                  );
                  this.formItem.content_id = tempNBLinkList[tempLen - 1];
                }
                console.log(this.choosenblmList, "内部链接栏目选择");
              }
            } else if (res.content.linkType == 1) {
              //外部链接有值
              this.externalLink = res.content.externalLink;
            }
            //
            /* if (
              this.formItem.contentType == 'travel_detail'
            ) {
              this.formItem.contentType = this.formItem.contentType.toString();
            } */
            if (
              this.formItem.sharedStatus == 1 ||
              this.formItem.sharedStatus === 0
            ) {
              this.formItem.sharedStatus =
                this.formItem.sharedStatus.toString();
            }
            if (this.formItem.loginFlag == 1 || this.formItem.loginFlag === 0) {
              this.formItem.loginFlag = this.formItem.loginFlag.toString();
            }
            //添加角标：
            // if (
            //   this.formItem.subscriptType == 1 ||
            //   this.formItem.subscriptType === 0 ||
            //   this.formItem.subscriptType === 2 ||
            //   this.formItem.subscriptType === 3 ||
            //   this.formItem.subscriptType === 4
            // ) {
            //   this.formItem.subscriptType = this.formItem.subscriptType.toString();
            // }
            if (
              this.formItem.stewardBuoy == 1 ||
              this.formItem.stewardBuoy === 0
            ) {
              this.formItem.stewardBuoy = this.formItem.stewardBuoy.toString();
            }
            if (
              this.formItem.bannerStatus == 1 ||
              this.formItem.bannerStatus === 0
            ) {
              this.formItem.bannerStatus =
                this.formItem.bannerStatus.toString();
            }
            if (
              !this.formItem.cmsContentImageList &&
              this.formItem.cmsContentImageList.length == 0
            ) {
              this.formItem.cmsContentImageList = [
                {
                  //	其他图列表
                  linkList: [], //图片链接
                  type: 0, //图片类型banner
                },
                {
                  linkList: [], //图片链接
                  type: 1, //图片类型，内容长图
                },
                {
                  linkList: [], //图片链接
                  type: 2, //图片类型，推荐方图
                },
                {
                  linkList: [], //图片链接
                  type: 3, //图片类型，推荐长图
                },
                {
                  linkList: [], //图片链接
                  type: 4, //图片类型，分享宣传图
                },
              ];
            } else {
              let arr = [];
              for (var i = 0; i < 5; i++) {
                if (i + 1 <= this.formItem.cmsContentImageList.length) {
                  arr.push(this.formItem.cmsContentImageList[i]);
                }
              }
              let arraynew = [
                {
                  //	其他图列表
                  linkList: [], //图片链接
                  type: 0, //图片类型banner
                },
                {
                  linkList: [], //图片链接
                  type: 1, //图片类型，内容长图
                },
                {
                  linkList: [], //图片链接
                  type: 2, //图片类型，推荐方图
                },
                {
                  linkList: [], //图片链接
                  type: 3, //图片类型，推荐长图
                },
                {
                  linkList: [], //图片链接
                  type: 4, //图片类型，分享宣传图
                },
              ];
              this.formItem.cmsContentImageList.map((f) => {
                if (f.type === 0) {
                  arraynew[0] = f;
                }
                if (f.type == 1) {
                  arraynew[1] = f;
                }
                if (f.type == 2) {
                  arraynew[2] = f;
                }
                if (f.type == 3) {
                  arraynew[3] = f;
                }
                if (f.type == 4) {
                  arraynew[4] = f;
                }
              });
              //根据type=0的顺序重新排序
              arraynew = this.sortByKey(arraynew, "type");
              arraynew.map((a, i) => {
                if (!a.type) {
                  a = {
                    //	其他图列表
                    linkList: [], //图片链接
                    type: i, //图片类型banner
                  };
                }
              });
              this.formItem.cmsContentImageList = arraynew;
              this.formItem.contentIntroduces =
                res.content.cmsContentIntroduceResVOS;
              if (this.formItem.contentIntroduces.length == 0) {
                this.contentSummaryNum = [""];
              } else {
                this.contentSummaryNum.length =
                  this.formItem.contentIntroduces.length;
              }
              //this.formItem.labelIdList = this.formItem.contentType.toString();
            }
            //9000111
            this.labelTagTree.map((l, index) => {
              if (l.children && l.children[0] && l.children[0].children) {
                if (
                  this.formItem.labelIdList.indexOf(
                    l.children[0].children[0].id
                  ) > -1
                ) {
                  this.$set(l, "checked", true);
                  this.selectLabel.push(l.children[0].children[0]);
                }
              }
            });

            //存储Banner图和内容长图
            // linkList1= this.formItem.cmsContentImageList[0]
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
    },
    dateStartChange(date) {
      this.formItem.playTime = date;
    },
    contentQuery() {
      if (this.$route.query.hasOwnProperty("id")) {
        let contentShow = {};
        if (sessionStorage.getItem("contentShow")) {
          contentShow = JSON.parse(sessionStorage.getItem("contentShow"));
        }
        this.$api
          .contentQuery({ id: contentShow.id })
          .then((res) => {
            console.log(res);
            if (res.result == "0") {
              this.formItem = res.content;
              this.temContentStatus = res.content.contentStatus;
              //内容管理角标健康管理:healthy_manage
              //内容管理角标康养旅居	:healthy_travel
              //内容管理角标朝智讲堂	:lecture_hall
              //内容管理角标主题游学	:theme_travel
              // if (res.content.channelTree[0].id == "20001") {
              //   this.queryRelationInfo("theme_travel");
              // } else if (res.content.channelTree[0].id == "20002") {
              //   this.queryRelationInfo("lecture_hall");
              // } else if (res.content.channelTree[0].id == "20003") {
              //   this.queryRelationInfo("healthy_travel");
              // } else if (res.content.channelTree[0].id == "20004") {
              //   this.queryRelationInfo("healthy_manage");
              // }
              if (res.content.treeUrl) {
                let tempList = res.content.treeUrl.split(",");
                if (tempList[0] == "20001") {
                  this.queryRelationInfo("theme_travel");
                } else if (tempList[0] == "20002") {
                  this.queryRelationInfo("lecture_hall");
                } else if (tempList[0] == "20003") {
                  this.queryRelationInfo("healthy_travel");
                } else if (tempList[0] == "20004") {
                  this.queryRelationInfo("healthy_manage");
                }
                // 所属主题，所属栏目反显
                this.formItem.theme = tempList[0]; //所属主题
                this.getBelongColumn(this.formItem.theme);
                this.formItem.choosewblmList = tempList.filter(
                  (o, i) => i != 0
                );
              }
              //  else{
              //    this.formItem.theme="20001"//所属主题--默认主题游学
              //  }
              if (!this.formItem.corner) {
                this.formItem.corner = "";
              }
              // //第一级
              // this.formItem.theme = res.content.channelTree[0].id;
              // //第二级
              // this.formItem.themeId = res.content.channelTree[0].children[0].id;
              // let newArry = this.convert_tree_data(
              //   JSON.parse(JSON.stringify(res.content.channelTree))
              // );
              // console.log(newArry);
              // let channelLevelArry = [];
              // newArry.map((n) => {
              //   channelLevelArry.push(Number(n.channelLevel));
              // });
              // // 最大层级
              // let channelLevel = Math.max(...channelLevelArry);
              // console.log(channelLevel);
              // this.themeChange();
              // this.theme2Change();
              // if (channelLevel == 2) {
              //   this.showType = "two";
              //   //御医看病
              //   if (
              //     res.content.channelTree[0].children &&
              //     res.content.channelTree[0].children[0].id == "20046"
              //   ) {
              //     this.showType = "three";
              //     this.formItem.themeId = "20046";
              //     console.log(this.showType);
              //   } else {
              //     //二层
              //     let arr = [];
              //     res.content.channelTree[0].children.map((r) => {
              //       arr.push(r.id);
              //     });
              //     this.formItem.themeId2 = arr;
              //   }
              // } else if (channelLevel == 3) {
              //   this.formItem.themeId =
              //     res.content.channelTree[0].children[0].id;
              //   console.log(this.formItem.themeId);
              //   this.showType = "three";
              //   this.theme2Change();
              //   this.theme3Change();
              //   //第三级
              //   let arr = [];
              //   res.content.channelTree[0].children[0].children.map((r) => {
              //     arr.push(r.id);
              //   });
              //   this.formItem.channelIdList = arr;
              // } else if (channelLevel == 4) {
              //   this.formItem.themeId =
              //     res.content.channelTree[0].children[0].id;
              //   this.showType = "four";

              //   this.theme2Change();
              //   //第二级

              //   //第三级
              //   this.formItem.themeId3 =
              //     res.content.channelTree[0].children[0].children[0].id;
              //   this.theme3Change();
              //   //第四级
              //   let arr = [];
              //   res.content.channelTree[0].children[0].children[0].children.map(
              //     (r) => {
              //       arr.push(r.id);
              //     }
              //   );
              //   this.formItem.channelIdList4 = arr;
              // }

              //
              //this.themeId = this.formItem.themeId;
              if (res.content.linkType === "0") {
                //内部链接有值
                if (res.content.externalLink) {
                  // if (res.content.externalLink.split("#")[1]) {
                  //   this.formItem.theme_id = JSON.parse(
                  //     JSON.stringify(res.content.externalLink.split("#")[1])
                  //   );
                  // }
                  // if (this.formItem.theme_id != "20002") {
                  //   if (res.content.externalLink.split("#")[2]) {
                  //     this.formItem.column_id = res.content.externalLink.split(
                  //       "#"
                  //     )[2];
                  //   }
                  //   if (res.content.externalLink.split("#")[3]) {
                  //     this.formItem.content_id = res.content.externalLink.split(
                  //       "#"
                  //     )[3];
                  //   }
                  //   if(this.formItem.theme_id){
                  //      this.getInsideColumn(this.formItem.theme_id);
                  //   }
                  // } else if (this.formItem.theme_id == "20002") {
                  //   let tempLen =
                  //     res.content.externalLink.split("#").length - 1;
                  //   this.wbljColumnId = res.content.externalLink
                  //     .split("#")
                  //     .splice(2, tempLen - 2);
                  //     console.log("8--------------")
                  //     console.log( this.wbljColumnId)
                  //   //栏目--朝智讲堂（多级栏目）
                  //   for (let i = 0; i < this.wbljColumnId.length; i++) {
                  //     this.getInsideColumn(this.wbljColumnId[i]);
                  //   }
                  //   //栏目内容
                  //   if (res.content.externalLink.split("#")[tempLen]) {
                  //     this.formItem.content_id = res.content.externalLink.split(
                  //       "#"
                  //     )[tempLen];
                  //   }
                  // }
                  let tempNBLinkList = JSON.parse(
                    JSON.stringify(res.content.externalLink)
                  ).split("#");
                  this.formItem.theme_id = tempNBLinkList[1];
                  this.getInsideColumn(this.formItem.theme_id);
                  let tempLen = tempNBLinkList.length;
                  // externalLink 这个中第一个数字（2--主题，3--栏目，4--内容）
                  if (tempNBLinkList[0] == 2) {
                    this.choosenblmList = [];
                  } else if (tempNBLinkList[0] == 3) {
                    this.choosenblmList = tempNBLinkList.filter(
                      (ite, i) => i > 1
                    );
                  } else if (tempNBLinkList[0] == 4) {
                    this.choosenblmList = tempNBLinkList.filter(
                      (ite, i) => i > 1 && i != tempNBLinkList.length
                    );
                    this.getContentList(
                      this.choosenblmList[this.choosenblmList.length - 1]
                    );
                    this.formItem.content_id = tempNBLinkList[tempLen - 1];
                  }
                  console.log(this.choosenblmList, "内部链接栏目选择");
                }
              } else if (res.content.linkType == 1) {
                //外部链接有值
                this.externalLink = res.content.externalLink;
              }
              //
              /* if (
              this.formItem.contentType == 'travel_detail'
            ) {
              this.formItem.contentType = this.formItem.contentType.toString();
            } */
              if (
                this.formItem.sharedStatus == 1 ||
                this.formItem.sharedStatus === 0
              ) {
                this.formItem.sharedStatus =
                  this.formItem.sharedStatus.toString();
              }
              if (
                this.formItem.loginFlag == 1 ||
                this.formItem.loginFlag === 0
              ) {
                this.formItem.loginFlag = this.formItem.loginFlag.toString();
              }
              //添加角标：
              // if (
              //   this.formItem.subscriptType == 1 ||
              //   this.formItem.subscriptType === 0 ||
              //   this.formItem.subscriptType === 2 ||
              //   this.formItem.subscriptType === 3 ||
              //   this.formItem.subscriptType === 4
              // ) {
              //   this.formItem.subscriptType = this.formItem.subscriptType.toString();
              // }
              if (
                this.formItem.stewardBuoy == 1 ||
                this.formItem.stewardBuoy === 0
              ) {
                this.formItem.stewardBuoy =
                  this.formItem.stewardBuoy.toString();
              }
              if (
                this.formItem.bannerStatus == 1 ||
                this.formItem.bannerStatus === 0
              ) {
                this.formItem.bannerStatus =
                  this.formItem.bannerStatus.toString();
              }
              if (
                !this.formItem.cmsContentImageList &&
                this.formItem.cmsContentImageList.length == 0
              ) {
                this.formItem.cmsContentImageList = [
                  {
                    //	其他图列表
                    linkList: [], //图片链接
                    type: 0, //图片类型banner
                  },
                  {
                    linkList: [], //图片链接
                    type: 1, //图片类型，内容长图
                  },
                  {
                    linkList: [], //图片链接
                    type: 2, //图片类型，推荐方图
                  },
                  {
                    linkList: [], //图片链接
                    type: 3, //图片类型，推荐长图
                  },
                  {
                    linkList: [], //图片链接
                    type: 4, //图片类型，分享宣传图
                  },
                ];
              } else {
                let arr = [];
                for (var i = 0; i < 5; i++) {
                  if (i + 1 <= this.formItem.cmsContentImageList.length) {
                    arr.push(this.formItem.cmsContentImageList[i]);
                  }
                }
                let arraynew = [
                  {
                    //	其他图列表
                    linkList: [], //图片链接
                    type: 0, //图片类型banner
                  },
                  {
                    linkList: [], //图片链接
                    type: 1, //图片类型，内容长图
                  },
                  {
                    linkList: [], //图片链接
                    type: 2, //图片类型，推荐方图
                  },
                  {
                    linkList: [], //图片链接
                    type: 3, //图片类型，推荐长图
                  },
                  {
                    linkList: [], //图片链接
                    type: 4, //图片类型，分享宣传图
                  },
                ];
                this.formItem.cmsContentImageList.map((f) => {
                  if (f.type === 0) {
                    arraynew[0] = f;
                  }
                  if (f.type == 1) {
                    arraynew[1] = f;
                  }
                  if (f.type == 2) {
                    arraynew[2] = f;
                  }
                  if (f.type == 3) {
                    arraynew[3] = f;
                  }
                  if (f.type == 4) {
                    arraynew[4] = f;
                  }
                });
                //根据type=0的顺序重新排序
                arraynew = this.sortByKey(arraynew, "type");
                arraynew.map((a, i) => {
                  if (!a.type) {
                    a = {
                      //	其他图列表
                      linkList: [], //图片链接
                      type: i, //图片类型banner
                    };
                  }
                });
                this.formItem.cmsContentImageList = arraynew;
                this.formItem.contentIntroduces =
                  res.content.cmsContentIntroduceResVOS;
                if (this.formItem.contentIntroduces.length == 0) {
                  this.contentSummaryNum = [""];
                } else {
                  this.contentSummaryNum.length =
                    this.formItem.contentIntroduces.length;
                }
                //this.formItem.labelIdList = this.formItem.contentType.toString();
              }
              //9000111
              this.labelTagTree.map((l, index) => {
                if (l.children && l.children[0] && l.children[0].children) {
                  if (
                    this.formItem.labelIdList.indexOf(
                      l.children[0].children[0].id
                    ) > -1
                  ) {
                    this.$set(l, "checked", true);
                    this.selectLabel.push(l.children[0].children[0]);
                  }
                }
              });

              //存储Banner图和内容长图
              // linkList1= this.formItem.cmsContentImageList[0]
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
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    },
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key]; //如果要从大到小,把x,y互换就好
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    columnDataChange(val, index) {
      //
      let channelLevel;
      this.channelData.map((c) => {
        c.children.map((i) => {
          if (i.id == val) {
            //找出层级数
            let newArry = this.convert_tree_data(
              JSON.parse(JSON.stringify(i.children))
            );
            let channelLevelArry = [];
            newArry.map((n) => {
              channelLevelArry.push(Number(n.channelLevel));
            });
            // 最大层级
            channelLevel = Math.max(...channelLevelArry);
          }
        });
      });
      //
      // if (this.formItem.column_id) {
      //   this.getContentList(this.formItem.column_id);
      // } else {
      //   this.formItem.content_id = "";
      //   this.themeList3 = [];
      // }
      if (val) {
        if (this.formItem.theme_id == "20001") {
          this.wbljColumnId = [];
          this.formItem.column_id = val;
          this.getContentList(val);
        } else {
          if (this.wbljColumnId.length < channelLevel - 1) {
            this.wbljColumnId.push(val);
          } else {
            this.wbljColumnId.pop();
            this.wbljColumnId.push(val);
          }
          this.getInsideColumn(val);
        }
      } else {
        this.formItem.content_id = null;
        this.themeList3 = [];
      }
      this.$forceUpdate();
    },
    // 内部链接选择
    themeDataChange(e) {
      // 清空栏目
      this.themeList3 = [];
      this.columnList = [];
      this.wbljColumnId = [];
      this.choosenblmList = [];
      this.formItem.content_id = null;
      this.formItem.column_id = null;
      if (this.formItem.theme_id) {
        this.getInsideColumn(this.formItem.theme_id);
        this.externalLinkDisabled = true;
      } else {
        this.formItem.column_id = null;
        this.themeList2 = [];
        this.externalLinkDisabled = false;
        this.formItem.content_id = null;
        this.themeList3 = [];
        this.columnList = [];
        this.choosenblmList = [];
      }
      this.$forceUpdate();
    },
    changeSelectPic() {
      if (this.formItem.cmsContentImageList[0]) {
        this.formItem.cmsContentImageList[0].linkList = [];
      }
    },
    /*  handleSubmit() {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          this.$api
            .cmsCreate({})
            .then((res) => {
              if (res.code == 0 || res.result - 0 == 0) {
              } else {
                this.$emit("error", "");
                this.$Message.error(res.message);
              }
            })
            .catch((error) => {
              this.$emit("error", "");
            });
        } else {
          this.$emit("error", "");
        }
      });
    }, */
    checkLabelMenu() {
      let labelSelect = this.$refs.labelMenu.getCheckedNodes();
      this.selectLabel = labelSelect.filter(
        (item) => item.children.length == 0
      );
    },
    dispose(data, type) {
      data.map((item) => {
        item.title = item.labelName;
        if (item.children && item.children.length > 0) {
          item.children = this.dispose(item.children, 1);
        }
      });
      return data;
    },
    handleMenuList(data, roleMenuId) {
      let arr = [];
      data.map((item) => {
        item.title = item.menuName;
        item.typeName = item.type == 0 ? "菜单" : "按钮";
        item.expand = true;
        if (roleMenuId[item.id + ""]) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        if (item.children) {
          item.children = this.handleMenuList(item.children, roleMenuId);
        }
        arr.push(item);
        // }
      });
      return arr;
    },
    getLabelTree() {
      this.$api
        .getLabelTree({})
        .then((res) => {
          if (res.result == 0) {
            this.labelTagTree = this.dispose(res.content, 0);
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
    theme3Change() {
      this.formItem.channelIdList4 = [];
      //是否有第三级栏目
      let themeList = this.channelList.filter(
        (item) => item.id == this.formItem.themeId3
      );
      console.log(themeList);
      let newArry = this.convert_tree_data(
        JSON.parse(JSON.stringify(themeList))
      );
      let channelLevelArry = [];
      newArry.map((n) => {
        channelLevelArry.push(Number(n.channelLevel));
      });
      // 最大层级
      let channelLevel = Math.max(...channelLevelArry);
      console.log(channelLevel);
      if (channelLevel == 2) {
        this.showType = "two";
      } else if (channelLevel == 3) {
        this.showType = "three";
      } else if (channelLevel == 4) {
        this.showType = "four";
      }
      this.channelList4 = themeList[0] ? themeList[0].children : [];
      //
    },
    theme2Change() {
      this.formItem.channelIdList = [];
      //是否有第三级栏目
      let themeList = this.theirChannel.filter(
        (item) => item.id == this.formItem.themeId
      );
      console.log(themeList);
      //判断几层
      let newArry = this.convert_tree_data(
        JSON.parse(JSON.stringify(themeList))
      );
      let channelLevelArry = [];
      newArry.map((n) => {
        channelLevelArry.push(Number(n.channelLevel));
      });
      // 最大层级
      let channelLevel = Math.max(...channelLevelArry);
      console.log(channelLevel);
      if (channelLevel == 2) {
        this.showType = "two";
      } else if (channelLevel == 3) {
        this.showType = "three";
      } else if (channelLevel == 4) {
        this.showType = "four";
      }
      //如果是"御医看病" id是20046 则展示两层级。第二层级是单选
      if (themeList[0] && themeList[0].id == "20046") {
        this.showType = "three";
      }
      //
      this.channelList = themeList[0] ? themeList[0].children : [];
    },
    themeChange() {
      //全部清空
      this.theirChannel = [];
      this.channelList = [];
      this.formItem.themeId = "";
      this.formItem.themeId2 = [];
      this.formItem.themeId3 = "";
      this.formItem.channelIdList4 = [];
      this.channelList4 = [];
      this.formItem.channelIdList = [];
      this.formItem.choosewblmList = []; // 所属栏目
      // let channel = this.channelData.filter(
      //   (item) => item.id == this.formItem.theme
      // );
      // this.theirChannel = channel[0].children;
      // if (channel[0].id == "20001") {
      //   this.showType = "two";
      // } else if (channel[0].id == "20002") {
      //   this.showType = "three";
      // } else if (channel[0].id == "20003") {
      //   this.showType = "two";
      // } else if (channel[0].id == "20004") {
      //   this.showType = "three";
      // }
      //内容管理角标健康管理:healthy_manage
      //内容管理角标康养旅居	:healthy_travel
      //内容管理角标朝智讲堂	:lecture_hall
      //内容管理角标主题游学	:theme_travel
      if (this.formItem.theme == "20001") {
        this.queryRelationInfo("theme_travel");
      } else if (this.formItem.theme == "20002") {
        this.queryRelationInfo("lecture_hall");
      } else if (this.formItem.theme == "20003") {
        this.queryRelationInfo("healthy_travel");
      } else if (this.formItem.theme == "20004") {
        this.queryRelationInfo("healthy_manage");
      }
      // this.contentQuery();
      // 所属栏目数据获取
      this.getBelongColumn(this.formItem.theme);
    },
    //所属栏目获取
    getBelongColumn(themeId) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            if (res.content && res.content.length > 0) {
              this.wblmDataList = this.convertTree(res.content);
            } else {
              this.wblmDataList = [];
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
    //所属栏目点击
    changewbColumn(data) {
      this.formItem.choosewblmList = data;
    },
    //   主题游学角标查询
    queryRelationInfo(relationCode) {
      const reqData = {
        relationCode: relationCode,
      };
      this.$api
        .queryRelationInfo(reqData)
        .then((res) => {
          if (res.result == 0) {
            this.theme_travelList = res.content.dictionaryResDTOList;
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
    convert_tree_data1(data) {
      console.log(data);
      //所属主题的数据[{ },{ },{ },{ }]
      let allArry = [];
      for (var i = 0; i < data.length; i++) {
        let arry = [];
        if (data[i].children != undefined) {
          var temp = data[i].children;
          // 删除孩子节点
          // delete data[i].children;
          arry.push(data[i]);
          // 孩子节点加入数组末尾
          for (var j = 0; j < temp.length; j++) {
            arry.push(temp[j]);
          }
          allArry.push(arry);
        }
      }
      console.log(allArry);
      return data;
    },
    //
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
    //   栏目查询
    channelSearch() {
      const reqData = {
        insideShowFlag: 0,
      };
      this.$api
        .channelTree(reqData)
        .then((res) => {
          if (res.result == 0) {
            this.channelData = res.content;
            console.log(this.channelData);
            this.newArry = this.convert_tree_data(
              JSON.parse(JSON.stringify(res.content))
            );
            console.log(this.newArry);
            let channelLevelArry = [];
            this.newArry.map((n) => {
              channelLevelArry.push(Number(n.channelLevel));
            });
            // 最大层级
            this.channelLevel = Math.max(...channelLevelArry);
            console.log(this.channelLevel);
            let channel = this.channelData.filter(
              (item) => item.id == this.formItem.theme
            );
            //编辑时候根据详情数据，否则取主题游学的数据

            if (this.$route.query.hasOwnProperty("id")) {
              this.contentQuery();
            } else if (channel[0]) {
              this.theirChannel = channel[0].children;
              //
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
    //   一级主题--内部链接
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
    getInsideColumn(themeId) {
      this.$api
        .getInsideColumn({
          themeId: themeId,
        })
        .then((res) => {
          if (res.result == 0) {
            // if (this.formItem.theme_id == "20001") {
            //   this.themeList2 = res.content;
            // } else {
            //   if (res.content.length != 0) {
            //     console.log(this.columnList);
            //     if (this.columnList.length < 3) {
            //       this.columnList.push(res.content);
            //     } else {
            //       this.columnList.pop();
            //       this.columnList.push(res.content);
            //     }
            //     // console.log(this.columnList)
            //   } else {
            //     this.getContentList(
            //       this.wbljColumnId[this.wbljColumnId.length - 1]
            //     );
            //   }
            // }
            if (res.content && res.content.length > 0) {
              this.nblmDataList = this.convertTree(res.content);
            } else {
              this.nblmDataList = [];
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
    //  不分页查询内容管理
    getContentList(val) {
      this.$api
        .getContentList({
          // themeId:
          //   this.wbljColumnId.length == 0
          //     ? this.formItem.theme_id
          //     : this.wbljColumnId[this.wbljColumnId.length - 2], //主题
          // columnId:
          //   this.formItem.theme_id != "20001" ? val : this.formItem.column_id, //栏目
          columnId: val ? val : this.formItem.theme_id,
        })
        .then((res) => {
          if (res.result == 0) {
            this.themeList3 = res.content;
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
    // 内部链接--栏目选择
    changenbColumn(data) {
      this.formItem.content_id = null; // 清空--内容
      this.formItem.column_id = null; // 清空
      this.choosenblmList = data; //栏目选中值
      if (data && data.length > 0) {
        this.getContentList(
          this.choosenblmList[this.choosenblmList.length - 1]
        );
      }
      this.$forceUpdate();
    },
    // 传图片
    handleFormatError(file) {
      this.$Message.error("请上传最大限制 800K，jpg、png格式的图片");
    },
    handleMaxSize(file) {
      this.$Message.error("请上传最大限制800K的图片.");
    },
    beforeUpdateBan() {
      if (
        this.formItem.cmsContentImageList[0] &&
        this.formItem.cmsContentImageList[0].linkList.length >= 5
      ) {
        this.$Message.error("最多上传5张图片");
        return false;
      }
    },
    beforeUpdateFun() {
      if (
        this.formItem.cmsContentImageList[1] &&
        this.formItem.cmsContentImageList[1].linkList.length >= 5
      ) {
        this.$Message.error("最多上传5张图片");
        return false;
      }
    },
    handleSuccessBanner(value) {
      this.handleSuccess(1, value);
    },
    handleSuccessContent(value) {
      this.handleSuccess(2, value);
    },
    handleSuccessSide(value) {
      this.handleSuccess(3, value);
    },
    handleSuccessLong(value) {
      this.handleSuccess(4, value);
    },
    handleSuccessshare(value) {
      this.handleSuccess(5, value);
    },
    handleSuccess(type, value) {
      //解密
      if (typeof value == "string") {
        value = JSON.parse(decrypt(value));
      }
      if (value.code == 0) {
        if (type == 1 && this.formItem.bannerStatus == 0) {
          if (this.formItem.cmsContentImageList[0]) {
            this.formItem.cmsContentImageList[0].linkList = [
              value.content.content.url,
            ];
            this.formItem.cmsContentImageList[0].toLinkList = [
              value.content.content.absolute_url,
            ];
          }
        } else {
          if (type == 3 || type == 4 || type == 5) {
            this.formItem.cmsContentImageList[type - 1].linkList = [
              value.content.content.url,
            ];
            this.formItem.cmsContentImageList[type - 1].toLinkList = [
              value.content.content.absolute_url,
            ];
          } else {
            // if(type==2){
            //   this.formItem.cmsContentImageList[type - 1].toLinkList=this.bannerList
            // }
            //  if(type==3){
            //   this.formItem.cmsContentImageList[type - 1].toLinkList=this.bannerList
            // }
            this.formItem.cmsContentImageList[type - 1].linkList.push(
              value.content.content.url
            );
            if (!this.formItem.cmsContentImageList[type - 1].toLinkList) {
              this.formItem.cmsContentImageList[type - 1].toLinkList = [];
            }
            //添加页面传absolute_url 编辑页面传url
            if (this.$route.query.hasOwnProperty("id")) {
              this.formItem.cmsContentImageList[type - 1].toLinkList.push(
                value.content.content.url
              );
            } else {
              this.formItem.cmsContentImageList[type - 1].toLinkList.push(
                value.content.content.absolute_url
              );
            }
          }
        }
      }
    },
    handleRemove(type, item, index) {
      this.formItem.cmsContentImageList[type - 1].linkList.splice(index, 1);
    },

    removeLabelName(val) {
      let selectLabel = this.selectLabel;
      this.labelTagTree = this.labelTagTree.map((menu) => {
        function circulation(menu, code) {
          if (
            code.lableCode == menu.lableCode ||
            code.lableCode.indexOf(menu.lableCode) > -1
          ) {
            menu.checked = false;
          }
          if (menu.children && menu.children.length > 0) {
            for (var i = 0; i < menu.children.length; i++) {
              circulation(menu.children[i], code);
            }
          }
        }
        circulation(menu, selectLabel[val]);
        return menu;
      });
      this.selectLabel.splice(val, 1);
      console.log(this.selectLabel, "selectLabel");
    },
    remove(type) {
      this.formItem.cmsContentImageList[type - 1].linkList = [];
    },
    addcontentSummary() {
      if (this.contentSummaryNum.length < 3) {
        this.contentSummaryNum.push("");
      }
    },
    delcontentSummary() {
      if (this.contentSummaryNum.length > 1) {
        this.contentSummaryNum.pop();
        this.formItem.contentIntroduces.pop();
      }
    },
    goBack() {
      this.$router.push({
        name: "contentManagement",
      });
    },
    handleSubmit(type) {
      //新增内容时候传的内容是absolute_url  编辑内容新图和旧图都是传url  不带http的。
      let formItem = JSON.parse(JSON.stringify(this.formItem));
      // formItem.cmsContentImageList.map((i) => {
      //   if (i.toLinkList) {
      //   }
      //   let toLinkList = [];
      //   if (i && i.toLinkList) {
      //     i.toLinkList.map((t) => {
      //       toLinkList.push(t);
      //     });
      //     i.linkList = toLinkList;
      //   }
      // });
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // 图片地址传upload接口返回的absolute_url

          //0 内部 1外部
          let externalLink = "",
            t = "";
          if (this.externalLink) {
          } else {
            //主题是2 栏目3 内容传4
            // if (formItem.theme_id) {
            //   t = "2";
            //   externalLink = t + "#" + formItem.theme_id;
            //   if (formItem.column_id) {
            //     t = "3";
            //     externalLink =
            //       t + "#" + formItem.theme_id + "#" + formItem.column_id;
            //   } else {
            //     t = "3";
            //     externalLink =
            //       t +
            //       "#" +
            //       formItem.theme_id +
            //       "#" +
            //       this.wbljColumnId.join("#");
            //   }
            //   if (formItem.content_id && formItem.column_id) {
            //     t = "4";
            //     externalLink =
            //       t +
            //       "#" +
            //       formItem.theme_id +
            //       "#" +
            //       formItem.column_id +
            //       "#" +
            //       formItem.content_id;
            //   } else {
            //     t = "4";
            //     externalLink =
            //       t +
            //       "#" +
            //       formItem.theme_id +
            //       "#" +
            //       this.wbljColumnId.join("#") +
            //       "#" +
            //       formItem.content_id;
            //   }
            // }
            if (formItem.theme_id) {
              // 主题不为空
              t = "2";
              externalLink = t + "#" + formItem.theme_id;
              if (this.choosenblmList.length > 0) {
                // 有栏目的时候
                t = "3";
                externalLink =
                  t +
                  "#" +
                  formItem.theme_id +
                  "#" +
                  this.choosenblmList.join("#");
              }
              if (this.choosenblmList.length > 0 && formItem.content_id) {
                // 有内容时
                t = "4";
                externalLink =
                  t +
                  "#" +
                  formItem.theme_id +
                  "#" +
                  this.choosenblmList.join("#") +
                  "#" +
                  formItem.content_id;
              }
            }
          }
          if (this.externalLink) {
            formItem.externalLink = this.externalLink;
            formItem.linkType = "1";
          } else {
            formItem.externalLink = externalLink;
            formItem.linkType = "0";
          }
          //subscriptStatus 是否添加角 0是 1否  subscriptType   角标类型
          // if (formItem.subscriptType == "5") {
          //   formItem.subscriptStatus = 1;
          //   formItem.subscriptPath = "否";
          // } else {
          //   formItem.subscriptStatus = 0;
          //   //中文用subscriptPath传过去
          //   if (formItem.subscriptType === "0") {
          //     formItem.subscriptPath = "经典";
          //   } else if (formItem.subscriptType == 1) {
          //     formItem.subscriptPath = "热评";
          //   } else if (formItem.subscriptType == 2) {
          //     formItem.subscriptPath = "当季";
          //   } else if (formItem.subscriptType == 3) {
          //     formItem.subscriptPath = "大咖";
          //   } else if (formItem.subscriptType == 4) {
          //     formItem.subscriptPath = "网红";
          //   } else if (formItem.subscriptType == 5) {
          //     formItem.subscriptPath = "否";
          //   }
          // }
          //当只有二级栏目时候
          // if (this.showType == "two") {
          //   formItem.themeId = this.formItem.theme;
          // }
          // 所属主题，所属栏目id
          formItem.treeUrl = [formItem.theme, ...formItem.choosewblmList].join(
            ","
          );
          formItem.themeId =
            formItem.choosewblmList[formItem.choosewblmList.length - 1];
          this.saveFun(type, formItem);
        } else {
          this.$emit("error", "");
        }
      });
    },
    saveFun(type, formItem) {
      // 编辑
      formItem.cmsContentImageList = formItem.cmsContentImageList.filter(
        (item) => {
          if (item) {
            return item.linkList.length > 0;
          }
        }
      );
      // formItem.channelIdList.map((item) => {
      //   return Number(item);
      // });
      // 标签
      // if (this.selectLabel[0]) {
      formItem.labelIdList =
        this.selectLabel.length > 0
          ? this.selectLabel.map((item) => {
              return item.lableCode;
            })
          : [];
      // }
      formItem.contentSummary = 1;
      formItem.contentType = "travel_detail";
      formItem.contentStatus = type == 4 ? 0 : type;
      //channelIdList是最后一级的数据，themeId动态传倒数第二级的id
      // console.log(this.showType);
      // if (this.showType == "two") {
      //   formItem.channelIdList = this.formItem.themeId2;
      //   formItem.themeId = this.formItem.theme;
      // } else if (this.showType == "three") {
      //   formItem.channelIdList = this.formItem.channelIdList;
      //   formItem.themeId = this.formItem.themeId;
      //   //御医看病 栏目时候传参
      //   if (this.formItem.themeId == "20046") {
      //     formItem.channelIdList = [this.formItem.themeId];
      //     formItem.themeId = this.formItem.theme;
      //   }
      // } else if (this.showType == "four") {
      //   formItem.channelIdList = this.formItem.channelIdList4;
      //   formItem.themeId = this.formItem.themeId3;
      // }

      // if (this.showType == "three" || this.showType == "four") {
      //   if (!this.formItem.themeId) {
      //     return this.$Message.error("请选择栏目");
      //   }
      // }
      // if (this.showType == "two") {
      //   if (!this.formItem.themeId2 || !this.formItem.themeId2[0]) {
      //     return this.$Message.error("请选择栏目");
      //   }
      // }
      // if (!formItem.channelIdList[0] || !formItem.themeId) {
      //   return this.$Message.error("请选择栏目");
      // }
      if (this.isEdit) {
        if (formItem.playTime) {
          formItem.playTime = this.$util.getFormatDate(formItem.playTime);
        } else {
          formItem.playTime = "";
        }
        formItem.contentIntroduces = formItem.cmsContentIntroduceResVOS;
        formItem.cmsContentIntroduceResVOS = null;
        console.log(formItem, "编辑数据");
        let url = type == 4 ? "commitAuditCon" : "contentUpdate";
        // 发布弹框提示
        if (this.temContentStatus == 4&&( type == 1||type == 4)) {
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
                this.$api[url](formItem)
                  .then((res) => {
                    if (res.respCode == 0) {
                      this.$Message.success(res.message);
                      this.$router.push({
                        name: "contentManagement",
                        query: {
                          type: "save",
                        },
                      });
                    } else {
                      this.$Message.error(res.message);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            },
          });
        } else {
          this.$api[url](formItem)
            .then((res) => {
              if (res.respCode == 0) {
                this.$Message.success(res.message);
                this.$router.push({
                  name: "contentManagement",
                  query: {
                    type: "save",
                  },
                });
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        console.log(formItem, "新增数据");
        let url = type == 4 ? "commitAuditCon" : "contentCreate";
        // 新增
        this.$api[url](formItem)
          .then((res) => {
            if (res.respCode == 0) {
              this.$Message.success(res.message);
              this.$router.push({
                name: "contentManagement",
                query: {
                  type: "save",
                },
              });
            } else {
              this.$Message.error(res.message);
            }
          })
          .catch((error) => {
            console.log(error);
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
    // 提交审核
    commitSubmit() {
      this.$api
        .commitAudit({ contentId: this.formItem.id })
        .then((res) => {
          if (res.respCode == 0) {
            this.$Message.success(res.message);
            this.$router.push({
              name: "contentManagement",
              query: {
                type: "save",
              },
            });
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    externalLink(e) {
      if (e) {
        this.themeIdsabled = true;
      } else {
        this.themeIdsabled = false;
      }
    },
    //主题
    "formItem.theme_id"(e) {
      if (e) {
        // this.getInsideColumn(e);
        this.externalLinkDisabled = true;
      } else {
        this.formItem.column_id = "";
        this.themeList2 = [];
        this.externalLinkDisabled = false;
        this.formItem.content_id = "";
        this.themeList3 = [];
        this.columnList = [];
        this.choosenblmList = [];
      }
    },
    //栏目
    // "formItem.column_id"(e) {
    //   if (e) {
    //     this.getContentList(e);
    //   } else {
    //     this.formItem.content_id = "";
    //     this.themeList3 = [];
    //   }
    // },
  },
};
</script>
<style lang="less" scoped>
.form-style {
  margin: 0 auto;
}
.up-other-style {
  display: inline-block;
  margin-right: 10px;
}
.imgStyle {
  width: 100px;
  height: 100px;
  display: inline-block;
}
.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>