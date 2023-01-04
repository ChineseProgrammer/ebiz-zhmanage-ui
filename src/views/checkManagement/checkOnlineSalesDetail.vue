<template>
  <div class="ml10 underwriting">
    <!-- <Button type="primary" class="ph15 pv5" @click="$router.back(-1)"    
        >返 回</Button    
      >    
    <Divider class="mv20" />-->
    <!-- 基本信息 -->
    <div>
      <div class="pl20">
        <Row class="mv10">
          <i-col span="6">
            <span>
              订单号：
              <label>{{ basicList.orderNo }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              投保单号：
              <label>{{ basicList.applyCode }}</label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              是否自主投保：
              <label>{{ basicList.isAutonomy == 1 ? "是" : "不是" }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              产品名称（主险)：
              <label>{{ basicList.productName }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              转人核时间：
              <label>{{ basicList.manualCheckDate }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              代理人名称：
              <label>{{ basicList.agentName }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              代理人编码：
              <label>{{ basicList.agentCode }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              管理机构名称：
              <label>{{ basicList.orgName }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              提交状态：
              <label v-if="$route.params.type == 'already'">已审核</label>
              <label v-else>待审核</label>
            </span>
          </i-col>
          <!--  <i-col span="6">
            <span>
              提交时间：
              <label>{{ basicList.auditTime }}</label>
            </span>
          </i-col> -->
        </Row>
      </div>
    </div>
    <!-- 投保人影像信息
 -->

    <div v-show="policyHolderList.holderCertificateNo">
      <p class="mt20 fs16 fwb">
        {{holderTitle}}
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="policyFilesShow = false"
          v-show="policyFilesShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="policyFilesShow = true"
          v-show="!policyFilesShow"
        />
      </p>
      <!-- <Divider class="mv20" /> -->
      <div class="pl20" v-show="policyFilesShow">
        <!--  -->
        <Row class="mv10">
          <i-col span="6">
            <span>
              姓名：
              <label>{{ policyHolderList.holderName }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              年龄：
              <label>{{ policyHolderList.holderAge }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              性别：
              <label>{{ ["男", "女"][policyHolderList.holderSex] }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              证件类型：
              <label>{{ policyHolderList.holderCertificateType }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              证件号码：
              <label>{{ policyHolderList.holderCertificateNo }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              转人核原因：
              <label>{{ policyHolderList.hrzReason }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              转人核时间：
              <label>{{ policyHolderList.hrzManualTime }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              审批状态：
              <label
                v-if="
                  policyHolderList.status === 0 ||
                  policyHolderList.status === '0'
                "
                >不通过</label
              >
              <label v-if="policyHolderList.status == 1">通过</label>
              <label v-if="policyHolderList.status == 2">部分不通过</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              审批时间：
              <label>{{ policyHolderList.auditTime }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              审批人：
              <label>{{ policyHolderList.auditUser }}</label>
            </span>
          </i-col>
        </Row>
        <div>
          <Row>
            <i-col span="8" style="text-align: center">
              <a
                @click="lookImgClick(policyHolderList.faceImage)"
                style="width: 100%"
              >
                <div style="height: 300px">
                  <img
                    :src="policyHolderList.faceImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">面部识别照片</p>
              </div>
            </i-col>
            <i-col span="8" style="text-align: center">
              <a
                style="width: 100%"
                @click="lookImgClick(policyHolderList.idCardFrontImage)"
              >
                <div style="height: 300px">
                  <img
                    :src="policyHolderList.idCardFrontImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
                <div class="mv5 mh25"></div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">证件照片（正面）</p>
              </div>
            </i-col>
            <i-col span="8" style="text-align: center">
              <a
                style="width: 100%"
                @click="lookImgClick(policyHolderList.idCardBackImage)"
              >
                <div style="height: 300px">
                  <img
                    :src="policyHolderList.idCardBackImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
                <div class="mv5 mh25"></div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">证件照片（反面）</p>
              </div>
            </i-col>
            <!--   <div v-else-if="urlSuffixList[index] == 'pdf'">
                <iframe
                  :src="item"
                  type="application/x-google-chrome-pdf"
                  style="width:80%;height:110px"
                />
                <div class="mv5 mh25">
                   <Button type="primary" @click="previewImg(item)">不通过</Button>
                    <Button type="primary" @click="previewImg(item)">通过</Button>
                  <Button type="primary" @click="previewImg(item)">预览</Button>
                </div>
              </div> -->
            <!-- <div v-else>
                <div style="width:80%;height:115px; line-height:115px;">其他格式请点击查看</div>
                <div class="mv5 mh25">
                  <Button type="primary" @click="previewImg(item)">查看</Button>
                </div>
              </div> -->
          </Row>
        </div>
        <Row style="margin-top: 20px">
          <i-col span="2">
            <span> 审批结果： </span>
          </i-col>
          <i-col span="20">
            <RadioGroup
              v-model="policyHolderList.approvalResult"
              type="button"
              button-style="solid"
            >
              <Radio
                :disabled="$route.params.type == 'already'"
                label="0"
                border
                >不通过</Radio
              >
              <Radio
                :disabled="$route.params.type == 'already'"
                label="1"
                border
                >通过</Radio
              >
            </RadioGroup>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="2">
            <span> 审批结论： </span>
          </i-col>
          <i-col span="20">
            <Input
              maxlength="200"
              show-word-limit
              :disabled="$route.params.type == 'already'"
              style="margin-bottom: 20px"
              v-model="policyHolderList.approvalReason"
              type="textarea"
              :rows="4"
              placeholder="审批结论"
            />
          </i-col>
        </Row>
      </div>
    </div>
    <!-- 被保人影像信息
 -->
    <div v-show="insuredShow">
      <p class="mt20 fs16 fwb" >
         <span v-show="insuredShow">被保人影像信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="policyFilesShow2 = false"
          v-show="insuredShow"
        />
        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="policyFilesShow2 = true"
          v-show="!insuredShow"
        />
        </span>
      </p>
      <!-- <Divider class="mv20" /> -->
      <div class="pl20" >
        <!--  -->
        <Row class="mv10">
          <i-col span="6" v-if="insuredList.insuredName !== undefined">
            <span>
              姓名：
              <label>{{ insuredList.insuredName }}</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.insuredAge !== undefined">
            <span>
              年龄：
              <label>{{ insuredList.insuredAge }}</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.insuredSex !== undefined">
            <span>
              性别：
              <label>{{ ["男", "女"][insuredList.insuredSex] }}</label>
            </span>
          </i-col>
          <i-col
            span="6"
            v-if="insuredList.insuredCertificateType !== undefined"
          >
            <span>
              证件类型：
              <label>{{ insuredList.insuredCertificateType }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col
            span="6"
            v-if="
              insuredList &&
              insuredList.insuredCertificateNo &&
              insuredList.insuredCertificateNo.length > 2
            "
          >
            <span>
              证件号码：
              <label>{{ insuredList.insuredCertificateNo }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span >
              与投保人关系：
              <label v-if="insuredList.holderRelation == '0'">本人</label>
              <label v-if="insuredList.holderRelation == '1'">配偶</label>
              <label v-if="insuredList.holderRelation == '3'">父亲</label>
              <label v-if="insuredList.holderRelation == '4'">母亲</label>
              <label v-if="insuredList.holderRelation == '5'">子女</label>
              <label v-if="insuredList.holderRelation == '7'">祖父母</label>
              <label v-if="insuredList.holderRelation == '15'">兄弟姐妹</label>
              <label v-if="insuredList.holderRelation == '17'">孙子女</label>
              <label v-if="insuredList.holderRelation == '27'">朋友</label>
              <label v-if="insuredList.holderRelation == '28'">雇佣</label>
              <label v-if="insuredList.holderRelation == '30'">其他</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.irzReason !== undefined">
            <span>
              转人核原因：
              <label>{{ insuredList.irzReason }}</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.irzManualTime !== undefined">
            <span>
              转人核时间：
              <label>{{ insuredList.irzManualTime }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6" v-if="insuredList.status !== undefined">
            <span>
              审批状态：
              <label
                v-if="insuredList.status === 0 || insuredList.status === '0'"
                >不通过</label
              >
              <label v-if="insuredList.status == 1">通过</label>
              <label v-if="insuredList.status == 2">部分不通过</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.auditTime !== undefined">
            <span>
              审批时间：
              <label>{{ insuredList.auditTime }}</label>
            </span>
          </i-col>
          <i-col span="6" v-if="insuredList.auditUser !== undefined">
            <span>
              审批人：
              <label>{{ insuredList.auditUser }}</label>
            </span>
          </i-col>
        </Row>
        <div>
          <Row>
            <i-col
              span="8"
              style="text-align: center"
              v-if="insuredList.faceImage !== undefined"
            >
              <a
                style="width: 100%"
                @click="lookImgClick(insuredList.faceImage)"
              >
                <div style="height: 300px">
                  <img
                    :src="insuredList.faceImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">面部识别照片</p>
                <!--  <Button type="primary" @click="previewImg(item)">不通过</Button>
                    <Button type="primary" @click="previewImg(item)">通过</Button> -->
                <!-- <Button type="primary" @click="previewImg(policyHolderList.faceImage)">预览</Button> -->
              </div>
            </i-col>
            <i-col
              span="8"
              style="text-align: center"
              v-if="insuredList.idCardFrontImage !== undefined"
            >
              <a
                style="width: 100%"
                @click="lookImgClick(insuredList.idCardFrontImage)"
              >
                <div style="height: 300px">
                  <img
                    :src="insuredList.idCardFrontImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
                <div class="mv5 mh25"></div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">证件照片（正面）</p>
              </div>
            </i-col>
            <i-col
              span="8"
              style="text-align: center"
              v-if="insuredList.idCardBackImage !== undefined"
            >
              <a
                style="width: 100%"
                @click="lookImgClick(insuredList.idCardBackImage)"
              >
                <div style="height: 300px">
                  <img
                    :src="insuredList.idCardBackImage"
                    alt
                    style="max-width: 80%; max-height: 300px"
                  />
                </div>
                <div class="mv5 mh25"></div>
              </a>
              <div class="mv5 mh25">
                <p class="fs16 fwb">证件照片（反面）</p>
              </div>
            </i-col>
            <!--   <div v-else-if="urlSuffixList[index] == 'pdf'">
                <iframe
                  :src="item"
                  type="application/x-google-chrome-pdf"
                  style="width:80%;height:110px"
                />
                <div class="mv5 mh25">
                   <Button type="primary" @click="previewImg(item)">不通过</Button>
                    <Button type="primary" @click="previewImg(item)">通过</Button>
                  <Button type="primary" @click="previewImg(item)">预览</Button>
                </div>
              </div> -->
            <!-- <div v-else>
                <div style="width:80%;height:115px; line-height:115px;">其他格式请点击查看</div>
                <div class="mv5 mh25">
                  <Button type="primary" @click="previewImg(item)">查看</Button>
                </div>
              </div> -->
          </Row>
          <Row
            style="margin-top: 20px"
            v-if="insuredList.approvalResult !== undefined"
          >
            <i-col span="2">
              <span> 审批结果： </span>
            </i-col>
            <i-col span="20">
              <RadioGroup
                v-model="insuredList.approvalResult"
                type="button"
                button-style="solid"
              >
                <Radio :disabled="$route.params.type == 'already'" label="0"
                  >不通过</Radio
                >
                <Radio :disabled="$route.params.type == 'already'" label="1"
                  >通过</Radio
                >
              </RadioGroup>
            </i-col>
          </Row>
          <Row class="mv10" v-if="insuredList.approvalReason !== undefined">
            <i-col span="2">
              <span> 审批结论： </span>
            </i-col>
            <i-col span="20">
              <Input
                maxlength="200"
                show-word-limit
                :disabled="$route.params.type == 'already'"
                style="margin-bottom: 20px"
                v-model="insuredList.approvalReason"
                type="textarea"
                :rows="4"
                placeholder="审批结论"
              />
            </i-col>
          </Row>
        </div>
      </div>
    </div>
    <div class="button-block">
      <Button @click="$router.back(-1)">返回</Button>
      <Button
        :disabled="$route.params.type == 'already'"
        type="primary"
        @click="submit()"
        >提交</Button
      >
    </div>
    <!-- 蒙层图片放大器 -->
    <Modal title="查看大图" v-model="isLookImgMark" class-name="fl-image-modal">
      <img :src="imgUrl" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import { dateTransfer} from "@/api/sm4";
import $axios from "axios";
export default {
  data() {
    return {
      holderTitle:'投保人影像信息',
      imgUrl: "",
      isLookImgMark: false,
      headers: { sid: this.$util.getSessionStorage("sid") },
      policyId: this.$route.params.policyId,
      //基本信息 展开 关闭
      basicShow: true,
      basicList: {
        orderNo: "C20200428000018",
        applyCode: "C20200428000018",
        policyCode: "C20200428000018",
        name: "李腾",
      }, //基本信息数据
      //是否显示险种信息
      insuranceShow: true,
      //险种表格列
      insuranceColumns: [
        {
          title: "责任名称",
          key: "dutyName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "保额",
          key: "amount",
          align: "center",
          minWidth: 100,
        },
        {
          title: "保费",
          key: "premium",
          align: "center",
          minWidth: 100,
        },
      ],
      //投保人显示
      policyHolderShow: true,
      //投保人信息数据
      policyHolderList: {},
      //被保人显示
      insuredShow: true,
      //被保人信息数据
      insuredList: {},
      //受益人显示
      benneShow: true,
      //受益人信息数据
      benneList: [],
      // 健康告知显示
      healthShow: true,
      //健康告知信息数据
      healthInfoList: [],
      //健康告知列表
      healthColumns: [
        {
          title: "询问事项",
          key: "informText",
          align: "center",
          minWidth: 100,
        },
        {
          title: "投保人",
          key: "holderResult",
          align: "center",
          minWidth: 100,
        },
        {
          title: "被保人",
          key: "insuredResult",
          align: "center",
          minWidth: 100,
        },
      ],
      underwritingShow: true, //核保信息展开（true） 关闭（false）
      underwritingList: [], //核保信息list
      //核保信息--列
      underwritingColumns: [
        {
          title: "核保结论",
          key: "applyResult",
          align: "center",
          minWidth: 100,
        },
        {
          title: "核保时间",
          key: "applyDate",
          align: "center",
          minWidth: 100,
        },
      ],
      //支付信息显示
      paymentShow: true,
      //支付信息数据
      paymentList: [],
      //支付信息表的列
      paymentColumns: [
        {
          title: "支付方式",
          key: "payMethodName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "银行户名",
          key: "accountName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "银行名称",
          key: "bankName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "银行卡号",
          key: "accountCode",
          align: "center",
          minWidth: 100,
        },
        {
          title: "支付状态",
          key: "payStatusName",
          align: "center",
          minWidth: 100,
        },
        {
          title: "支付结果描述",
          key: "payDetails",
          align: "center",
          minWidth: 100,
        },
      ],
      //影像信息显示
      policyFilesShow: true,
      policyFilesShow2: true,
      //影像信息数据
      fileList: [],
      //url后缀
      urlSuffixList: [],
      //受益人---与被保人关系
      benneInsuredRelationList: [
        { name: "本人", value: "00" },
        { name: "配偶", value: "01" },
        { name: "父亲", value: "03" },
        { name: "母亲", value: "04" },
        { name: "子女", value: "05" },
        { name: "祖父母", value: "07" },
        { name: "兄弟姐妹", value: "15" },
        { name: "孙子女", value: "17" },
        { name: "朋友", value: "27" },
        { name: "雇佣", value: "28" },
        { name: "其他", value: "30" },
        { name: "借贷关系", value: "32" },
      ],
      //证件类型--枚举值
      certificateTypeList: [
        { name: "身份证", value: "00" },
        { name: "户口本", value: "01" },
        { name: "出生证", value: "02" },
        { name: "外国护照", value: "03" },
        { name: "军人证(军官证)", value: "04" },
        { name: "士兵证", value: "05" },
        { name: "警官证", value: "06" },
        { name: "台湾居民往来内陆通行证", value: "07" },
        { name: "港澳居民往来内陆通行证", value: "08" },
        { name: "中国护照", value: "09" },
        { name: "护照", value: "10" },
        { name: "无证件", value: "11" },
        { name: "其他", value: "12" },
        { name: "外国人永久居留身份证", value: "13" },
      ],
      //保单状态--枚举值
      policyStatusList: [
        { name: "初始状态", value: "00" },
        { name: "待核保", value: "20" },
        { name: "核保成功", value: "21" },
        { name: "核保失败", value: "22" },
        { name: "承保成功", value: "23" },
        { name: "承保失败", value: "24" },
        { name: "已终止", value: "25" },
        { name: "已失效(已撤单)", value: "26" },
        { name: "已失效A(已撤单)", value: "26A" },
        { name: "待转人工核保", value: "27-0" },
        { name: "转人工核保成功", value: "27-1" },
        { name: "转人工核保失败", value: "27-2" },
        { name: "签收回执", value: "28" },
        { name: "修改中", value: "29" },
      ],
      //支付状态--枚举值
      payStatusList: [
        { name: "初始化", value: "00" },
        { name: "待支付", value: "30" },
        { name: "支付中", value: "31" },
        { name: "支付成功", value: "32" },
        { name: "支付失败", value: "33" },
      ],
    };
  },
  created: function () {
    this.getPolicyList();
  },
  mounted: function () {},
  watch: {},
  methods: {
    lookImgClick(val) {
      this.imgUrl = val;
      this.isLookImgMark = true;
    },
    // 确认保存
    submit() {
      //是否有投保人信息
      if (this.policyHolderList.holderName) {
        if (!this.policyHolderList.approvalResult) {
          return this.$Message.error("请选择投保人的审批结果");
        }
        if (!this.policyHolderList.approvalReason) {
          return this.$Message.error("请填写投保人的审批结论");
        }
      }
      //是否有被保人信息
      if (this.insuredList.insuredName) {
        if (!this.insuredList.approvalResult) {
          return this.$Message.error("请选择被保人的审批结果");
        }
        if (!this.insuredList.approvalReason) {
          return this.$Message.error("请填写被保人的审批结论");
        }
      }
      this.$util.showLoading();
      let data = [];
      //投保人对象添加信息
      if (this.policyHolderList.holderCertificateNo) {
        this.policyHolderList.holderRelation = this.holderRelation;
        // this.policyHolderList.manualTime = this.basicList.manualCheckDate;
        this.policyHolderList.name = this.policyHolderList.holderName;
        this.policyHolderList.age = this.policyHolderList.holderAge;
        this.policyHolderList.certificateType = this.policyHolderList.holderCertificateType;
        this.policyHolderList.certificateNo = this.policyHolderList.holderCertificateNo;
        this.policyHolderList.orderNo = this.basicList.orderNo;
        this.policyHolderList.applyCode = this.basicList.applyCode;
        this.policyHolderList.isAutonomy = this.basicList.isAutonomy;
        this.policyHolderList.productName = this.basicList.productName;
        this.policyHolderList.agentName = this.basicList.agentName;
        this.policyHolderList.agentCode = this.basicList.agentCode;
        this.policyHolderList.orgName = this.basicList.orgName;
        this.policyHolderList.reason = this.policyHolderList.hrzReason; //转人核原因
        this.policyHolderList.manualTime = this.policyHolderList.hrzManualTime; //转人核时间
        /*  HRZ 投保人   IRZ 被保人 */
        // this.policyHolderList.verityType = "HRZ";
        this.policyHolderList.verityType = this.policyHolderList.verityType;
        data.push(this.policyHolderList);
      }
      //被保人对象添加信息
      if (this.insuredList.insuredName) {
        // this.insuredList.manualTime = this.basicList.manualCheckDate;
        this.insuredList.name = this.insuredList.insuredName;
        this.insuredList.age = this.insuredList.insuredAge;
        this.insuredList.certificateType = this.insuredList.insuredCertificateType;
        this.insuredList.certificateNo = this.insuredList.insuredCertificateNo;
        this.insuredList.orderNo = this.basicList.orderNo;
        this.insuredList.applyCode = this.basicList.applyCode;
        this.insuredList.isAutonomy = this.basicList.isAutonomy;
        this.insuredList.productName = this.basicList.productName;
        this.insuredList.agentName = this.basicList.agentName;
        this.insuredList.agentCode = this.basicList.agentCode;
        this.insuredList.orgName = this.basicList.orgName;
        this.insuredList.reason = this.insuredList.irzReason; //转人核原因
        this.insuredList.manualTime = this.insuredList.irzManualTime; //转人核时间
        /*  HRZ 投保人   IRZ 被保人 */
        this.insuredList.verityType = "IRZ";
        data.push(this.insuredList);
      }
      this.$api
        .onlineSalesCommit({
          approvalList: data,
        })
        .then((res) => {
          // loading关闭
          this.$util.hideLoading();
          if (res.result === "0") {
            //跳转回到列表页面
            this.$router.push({
              name: "OnlineSalesCheckNot",
            });
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
          }
        });
    },
    //获取核保信息
    getPolicyList() {
      // loading
      this.$util.showLoading();
      //已审批详情
      let url = "",
        params;
      if (this.$route.params.type == "already") {
        params = {
          approvalNo: this.policyId,
        };
        url = "getApprovalData";
      } else {
        params = {
          policyId: this.policyId,
        };
        //待审批详情
        url = "onlineSalesDetail";
      }
      this.$api[url](params).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        if (res.result === "0") {
          //基本信息、
          this.basicList = res.content.orderContentVO || {};
          this.basicList.manualCheckDate=dateTransfer(this.basicList.manualCheckDate)
          //只获取日期
          if (!this.basicList.orderGenDate) {
            this.basicList.orderGenDate = "——";
          } else {
            let str3 = this.$util.getFormatOnlyDate(
              this.basicList.orderGenDate
            );
            if (str3.substring(0, 3) == "NaN") {
              //是IE浏览器
              this.basicList.orderGenDate = this.basicList.orderGenDate.substring(
                0,
                10
              );
            } else {
              this.basicList.orderGenDate = str3;
            }
          }
          //遍历，获取保单状态
          this.policyStatusList.map((status) => {
            if (status.value == this.basicList.policyStatus) {
              this.basicList.policyStatusName = status.name;
            }
          });
          //投保人信息
          this.policyHolderList = res.content.holderInfoVO || {};
          this.policyHolderList.hrzManualTime=dateTransfer(this.policyHolderList.hrzManualTime)
          this.policyHolderList.auditTime=dateTransfer(this.policyHolderList.auditTime)
          // 如果审批时间为空则不显示审批时间
          if(this.policyHolderList.auditTime === '1970-01-01 08:00:00'){
            this.policyHolderList.auditTime = ''
          }
            // this.insuredList = res.content.insuredInfoVO
          // this.policyHolderList = res.content.holderInfoVO;
          /* 面部识别照片 */
          let imageURL = {imageURL: this.policyHolderList.faceImage}
          this.$api["getImage"](imageURL).then((res) => {
            // 将投保人图片的base64 赋值到 img 的src标签中
            let src1 = "data:image/png;base64," + res.content;
            this.policyHolderList.faceImage = src1;
          })
          // 证件照片 正面
          let idCardFrontImage = {imageURL: this.policyHolderList.idCardFrontImage}
          this.$api["getImage"](idCardFrontImage).then((res) => {
            // 将投保人图片的base64 赋值到 img 的src标签中
            let src1 = "data:image/png;base64," + res.content;
            this.policyHolderList.idCardFrontImage = src1;
          })
          /* 证件照片 反面 */
          let idCardBackImage = {imageURL: this.policyHolderList.idCardBackImage}
          this.$api["getImage"](idCardBackImage).then((res) => {
            // 将投保人图片的base64 赋值到 img 的src标签中
            let src1 = "data:image/png;base64," + res.content;
            this.policyHolderList.idCardBackImage = src1;
          })
          
          if (!this.policyHolderList.validEndDate) {
            this.policyHolderList.validEndDate = "——";
          } else {
            let str3 = this.$util.getFormatOnlyDate(
              this.policyHolderList.validEndDate
            );
            if (str3.substring(0, 3) == "NaN") {
              //是IE浏览器
              this.policyHolderList.validEndDate = this.policyHolderList.validEndDate.substring(
                0,
                10
              );
            } else {
              this.policyHolderList.validEndDate = str3;
            }
          }
          this.certificateTypeList.map((typeData) => {
            if (typeData.value == this.policyHolderList.holderCertificateType) {
              this.policyHolderList.holderCertificateType = typeData.name;
            }
          });
          //被保人信息
          if (res.content.insuredInfoVO) {
            this.holderRelation = res.content.insuredInfoVO.holderRelation;
             if(res.content.insuredInfoVO.holderRelation == '0'){
              this.insuredShow = false
              this.holderTitle = '投保人暨被保险人影像信息'
            }
            this.insuredList = res.content.insuredInfoVO;
            this.insuredList.irzManualTime=dateTransfer(this.insuredList.irzManualTime)
            this.insuredList.auditTime=dateTransfer(this.insuredList.auditTime)
            if(this.insuredList.auditTime === '1970-01-01 08:00:00'){
              this.insuredList.auditTime = ''
            }
            
            if (res.content.insuredInfoVO.holderRelation == "0") {
              this.insuredList = {
                insuredCertificateNo: "1",
                holderRelation: "0",
              };
            } else {
              //不是本人后，再判断身份证号是否为空，不为空则正常显示所有信息， 为空则整块都不显示
              if (!res.content.insuredInfoVO.insuredCertificateNo) {
                this.insuredList = {};
                return;
              }
              this.insuredList = res.content.insuredInfoVO || {};
              /* 面部识别照片 */
              let insuredListfaceImage = {imageURL: this.insuredList.faceImage}
              this.$api["getImage"](insuredListfaceImage).then((res) => {
                let src1 = "data:image/png;base64," + res.content;
                this.insuredList.faceImage = src1;
              })
               /* 证件照片 正面 */
              let insuredListidCardFrontImage = {imageURL: this.insuredList.idCardFrontImage}
              this.$api["getImage"](insuredListidCardFrontImage).then((res) => {
                let src1 = "data:image/png;base64," + res.content;
                this.insuredList.idCardFrontImage = src1;
              })
               /* 证件照片 正面 */
              let insuredListidCardBackImage = {imageURL: this.insuredList.idCardBackImage}
              this.$api["getImage"](insuredListidCardBackImage).then((res) => {
                let src1 = "data:image/png;base64," + res.content;
                this.insuredList.idCardBackImage = src1;
              })

              if (!this.insuredList.validEndDate) {
                this.insuredList.validEndDate = "——";
              } else {
                let str3 = this.$util.getFormatOnlyDate(
                  this.insuredList.validEndDate
                );
                if (str3.substring(0, 3) == "NaN") {
                  //是IE浏览器
                  this.insuredList.validEndDate = this.insuredList.validEndDate.substring(
                    0,
                    10
                  );
                } else {
                  this.insuredList.validEndDate = str3;
                }
              }
              this.certificateTypeList.map((typeData) => {
                if (typeData.value == this.insuredList.insuredCertificateType) {
                  this.insuredList.insuredCertificateType = typeData.name;
                }
              });
            }
          }
          /*  else{
            //当insuredInfoVO是null时候 则被保人影像信息只显示 与投保人关系，其余不显示
              this.insuredList={}
              this.insuredList.holderRelation='0'
              console.log( this.insuredList.insuredSex)
          } */
          //受益人信息
          /*  if (res.content.policyBeneficiaryDTOList.length > 0) {
            this.benneList = res.content.policyBeneficiaryDTOList;
            this.benneList.map((benne) => {
              benne.benefitOrder = this.$util.NoToChinese(benne.benefitOrder);
              this.certificateTypeList.map((typeData) => {
                if (typeData.value == benne.certificateType) {
                  benne.certificateTypeName = typeData.name;
                }
              });
            });
          } */
          //健康告知信息
          /*   this.healthInfoList = res.content.policyHealthInformDTOList.map(
            (el) => {
              return {
                ...el,
                insuredResult: el.insuredResult ? "是" : "否",
              };
            }
          ); */
          //核保信息
          /*  this.underwritingList = res.content.policyApplyDTOList;
          if (!this.underwritingList.applyDate) {
            this.underwritingList.applyDate = "——";
          } else {
            let str1 = this.$util.getFormatOnlyDate(
              this.underwritingList.applyDate
            );
            if (str1.substring(0, 3) == "NaN") {
              //是IE浏览器
              this.underwritingList.applyDate = this.underwritingList.applyDate.substring(
                0,
                10
              );
            } else {
              this.underwritingList.applyDate = str1;
            }
          } */
          /*  let {
            userUploadFileList,
            autographFileList,
          } = res.content.holderInfoVO;
          this.fileList = [
            ...new Set([...userUploadFileList, ...autographFileList]),
          ].filter((el) => el && el.includes("http"));
          this.fileList.map((item, index) => {
            let obj = this.getURLSuffix(item);
            this.urlSuffixList.push(obj);
          }); */
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //数组去重合并
    uniqueArr(userFile, autoFile) {
      userFile.push(...autoFile);
      let file = Array.from(new Set(userFile));
      file.map((item, index) => {
        if (item == null) {
          file.splice(index, 1);
        }
      });
      return file;
    },
    //截取
    getURLSuffix(url) {
      var index = url.lastIndexOf(".");
      url = url.substring(index + 1, url.length);
      return url;
    },
    // 下载
    // fileLoad(url) {
    // console.log(url)
    //  var eleLink = document.createElement('a');
    // eleLink.style.display = 'none';
    // eleLink.download = this.filerName(url);
    // var blob = new Blob([url]);
    // eleLink.href = URL.createObjectURL(blob);
    // document.body.appendChild(eleLink);
    // eleLink.click();
    // document.body.removeChild(eleLink);
    // window.open(url, "_blank");
    //},
    filerName(url) {
      if (url != null) {
        let a = url.split("/");
        return a[a.length - 1];
      }
    },
    // 预览
    previewImg(item) {
      window.open(item, "_blank");
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table th {
  background-color: #1716161c;
}
.button-block {
  text-align: center;
  margin: 20px 0px 20px -200px;
  margin-left: 20px;
  button {
    width: 80px;
  }
}
/* .inner:active{
  color: rgb(255, 255, 255);
    background-color: rgb(45, 140, 240);
    border-color: red!important;
}
.inner:focus{
  color: rgb(255, 255, 255);
    background-color: rgb(45, 140, 240);
    border-color: red!important;
}
.inner:hover{
  color: rgb(255, 255, 255);
    background-color: rgb(45, 140, 240);
    border-color: red!important;
} */
.table-width {
  width: calc(100% - 140px);
}
</style>
