<template>
  <div class="ml10 underwriting">
    <!-- <Button type="primary" class="ph15 pv5" @click="$router.back(-1)"    
        >返 回</Button    
      >    
    <Divider class="mv20" />-->
    <!-- 基本信息 -->
    <!-- 蒙层图片放大器 -->
    <Modal title="查看大图" v-model="isLookImgMark" class-name="fl-image-modal">
      <img v-if="!imgType" :src="imgUrl" style="width: 100%" />
      <iframe
        v-if="imgType"
        :src="imgUrl"
        type="application/x-google-chrome-pdf"
        style="width: 100%; max-height: 200px"
      />
    </Modal>
    <div>
      <p class="mt20 fs16 fwb">
        基本信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="basicShow = false"
          v-show="basicShow"
        />
        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="basicShow = true"
          v-show="!basicShow"
        />
      </p>
      <Divider class="mv20" />
      <div v-show="basicShow" class="pl20">
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
              保单号：
              <label>{{ basicList.policyCode }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              订单生成时间：
              <label>{{ basicList.orderGenDate }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              保单生效日期：
              <label>{{ basicList.effectiveDate }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              销售渠道：
              <label>{{ basicList.channelName }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              保费金额(元)：
              <label>{{ basicList.premium }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              保单状态：
              <label>{{ basicList.policyStatusName }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              推广人员编码：
              <label>{{ basicList.agentCode }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              推广人员姓名：
              <label>{{ basicList.agentName }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              推广人员手机号：
              <label>{{ basicList.agentPhone }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              管理机构：
              <label>{{ basicList.manageOrgName }}</label>
            </span>
          </i-col>
        </Row>
        <Row class="mv10">
          <i-col span="6">
            <span>
              服务机构：
              <label>{{ basicList.serverOrgName }}</label>
            </span>
          </i-col>
        </Row>
      </div>
    </div>

    <!-- 险种信息 -->
    <div>
      <p class="mt20 fs16 fwb">
        险种信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="insuranceShow = false"
          v-show="insuranceShow"
        />
        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="insuranceShow = true"
          v-show="!insuranceShow"
        />
      </p>
      <Divider class="mv20" />
      <div class="pl20" v-show="insuranceShow">
        <div
          v-for="(insurance, insuranceIndex) in insuranceList"
          :key="insuranceIndex"
        >
          <Row :gutter="24">
            <i-col span="6">
              <span>
                险种名称：
                <label>{{ insurance.productName }}</label>
              </span>
            </i-col>
            <i-col span="6">
              <span>
                险种类型：
                <label>{{ insurance.masterFlagName }}</label>
              </span>
            </i-col>
            <i-col span="6">
              <span>
                保险期间：
                <label
                  v-show="
                    insurance.coveragePeriod &&
                    insurance.coveragePeriodType == 2
                  "
                >
                  按年限保{{ insurance.coveragePeriod }}年
                </label>
                <label v-show="insurance.coveragePeriodType != 2">
                  {{
                    [
                      "无关",
                      "保终身",
                      "按年限保",
                      "保至某确定年龄",
                      "按月保",
                      "按天保",
                    ][insurance.coveragePeriodType]
                  }}
                  <span
                    v-show="
                      insurance.coveragePeriod != 0 &&
                      insurance.coveragePeriodType != 1
                    "
                  >
                    {{ insurance.coveragePeriod }}</span
                  >
                  {{
                    ["", "", "年", "岁", "月", "天"][
                      insurance.coveragePeriodType
                    ]
                  }}
                </label>
              </span>
            </i-col>
            <i-col span="6">
              <span>
                交费期间：
                <label
                  v-show="
                    insurance.chargePeriod && insurance.chargePeriodType == 2
                  "
                >
                  按年交费{{ insurance.chargePeriod }}年
                </label>
                <label v-show="insurance.chargePeriodType != 2">
                  {{
                    [
                      "无关",
                      "趸交",
                      "按年限交",
                      "按年交至某确定年龄",
                      "终生交费",
                      "不定期交",
                      "按月交",
                    ][insurance.chargePeriodType]
                  }}
                  <span v-show="insurance.chargePeriod != 0">{{
                    insurance.chargePeriod
                  }}</span
                  >{{
                    ["", "", "年", "岁", "月", "天"][insurance.chargePeriodType]
                  }}
                </label>
              </span>
            </i-col>
          </Row>

          <div class="inline-block mt20 text-right float-left">责任信息：</div>
          <div class="inline-block mt20 table-width">
            <Table
              :columns="insuranceColumns"
              :max-height="400"
              :data="insurance.dutyDTOList"
              border
              v-show="insuranceShow"
            ></Table>
          </div>
        </div>
      </div>
    </div>

    <!-- 投保人信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        投保人信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="policyHolderShow = false"
          v-show="policyHolderShow"
        />

        <Icon
          class="fs255 mr2"
          type="ios-arrow-back"
          @click="policyHolderShow = true"
          v-show="!policyHolderShow"
        />
      </p>

      <Divider class="mv20" />

      <div v-show="policyHolderShow" class="pl20">
        <Row class="mv10">
          <i-col span="6">
            <span>
              姓名：
              <label>{{ policyHolderList.name }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              性别：
              <label>{{ ["男", "女"][policyHolderList.gender] }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              证件类型：
              <label>
                {{ policyHolderList.certificateTypeName }}
              </label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              证件号码：
              <label>
                {{ policyHolderList.certificateNo }}
              </label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
          <!--  <i-col span="6">
            <span>
              证件有效期：
              <label>
                {{ policyHolderList.validEndDate }}
              </label>
            </span>
          </i-col> -->
          <i-col span="6">
            <span>
              手机号：
              <label>{{ policyHolderList.mobile }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              电子邮箱：
              <label>{{ policyHolderList.email }}</label>
            </span>
          </i-col>

         <!--  <i-col span="6">
            <span>
              身高(cm)：
              <label>{{ policyHolderList.height }}</label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              体重(kg)：
              <label>{{ policyHolderList.weight }}</label>
            </span>
          </i-col> -->
           <i-col span="6">
            <span>
              国籍：
              <label>{{ policyHolderList.nationality }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              职业：
              <label>{{ policyHolderList.job }}</label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
        <!--   <i-col span="6">
            <span>
              年收入(元)：
              <label>{{ policyHolderList.income }}</label>
            </span>
          </i-col> -->
          <i-col span="6">
            <span>
              收入来源：
              <label>{{ policyHolderList.incomeWay }}</label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              收入描述：
              <label>{{ policyHolderList.incomeDesc }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              税收居民类型：
              <label>
                {{
                  [
                    "中国税收居民",
                    "非居民",
                    "既是中国税收居民又是其他国家（地区）税收居民",
                  ][policyHolderList.revenueCertificateType]
                }}
              </label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              是否有社保：
              <label>
                {{ policyHolderList.socialInsuFlag }}
              </label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
    <i-col span="6">
            <span>
              社保归属地：
              <label>
                {{ policyHolderList.socialInsuAddress }}
              </label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              所在地区：
              <label>{{ policyHolderList.district }}</label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
         <!--  <i-col span="6">
            <span>
              详细地址：
              <label>
                {{ policyHolderList.detailAddress }}
              </label>
            </span>
          </i-col> -->
        </Row>
      </div>
    </div>

    <!-- 被保人信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        被保人信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="insuredShow = false"
          v-show="insuredShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="insuredShow = true"
          v-show="!insuredShow"
        />
      </p>

      <Divider class="mv20" />

      <div v-show="insuredShow" class="pl20">
        <Row>
          <i-col>
            <span>
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
        </Row>
      </div>

      <div
        v-show="insuredShow & (insuredList.holderRelation != '0')"
        class="pl20"
      >
        <Row class="mv10">
          <i-col span="6">
            <span>
              姓名：
              <label>{{ insuredList.name }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              性别：
              <label>{{ ["男", "女"][insuredList.gender] }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              证件类型：
              <label>
                {{ insuredList.certificateTypeName }}
              </label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              证件号码：
              <label>{{ insuredList.certificateNo }}</label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
        <!--   <i-col span="6">
            <span>
              证件有效期：
              <label>{{ insuredList.validEndDate }}</label>
            </span>
          </i-col> -->

          <i-col span="6">
            <span>
              手机号：
              <label>{{ insuredList.mobile }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              电子邮箱：
              <label>{{ insuredList.email }}</label>
            </span>
          </i-col>
          <i-col span="6">
            <span>
              国籍：
              <label>{{ insuredList.nationality }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              职业：
              <label>{{ insuredList.job }}</label>
            </span>
          </i-col>
         <!--  <i-col span="6">
            <span>
              身高(cm)：
              <label>{{ insuredList.height }}</label>
            </span>
          </i-col>
            <i-col span="6">
            <span>
              体重(kg)：
              <label>{{ insuredList.weight }}</label>
            </span>
          </i-col> -->
        </Row>

        <Row class="mv10">
        <!--   <i-col span="6">
            <span>
              年收入(万元)：
              <label>{{ insuredList.income }}</label>
            </span>
          </i-col> -->
 <i-col span="6">
            <span>
              收入来源：
              <label>{{ insuredList.incomeWay }}</label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              收入描述：
              <label>{{ insuredList.incomeDesc }}</label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              税收居民类型：
              <label>
                {{
                  [
                    "中国税收居民",
                    "非居民",
                    "既是中国税收居民又是其他国家（地区）税收居民",
                  ][insuredList.revenueCertificateType]
                }}
              </label>
            </span>
          </i-col>

          <i-col span="6">
            <span>
              是否有社保：
              <label>{{ insuredList.socialInsuFlag }}</label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
           <i-col span="6">
            <span>
              社保归属地：
              <label>
                {{ insuredList.socialInsuAddress }}
              </label>
            </span>
          </i-col>
           <i-col span="6">
            <span>
              所在地区：
              <label>{{ insuredList.district }}</label>
            </span>
          </i-col>
        </Row>

        <Row class="mv10">
        <!--   <i-col span="6">
            <span>
              详细地址：
              <label>{{ insuredList.detailAddress }}</label>
            </span>
          </i-col> -->
        </Row>
      </div>
    </div>

    <!-- 受益人信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        受益人信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="benneShow = false"
          v-show="benneShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="benneShow = true"
          v-show="!benneShow"
        />
      </p>

      <Divider class="mv20" />

      <div
        v-show="
          benneShow &
          (basicList.legalStatus == '0' || basicList.legalStatus == null)
        "
        class="pl20"
      >
        <Row>
          <i-col>
            <span>法定受益人</span>
          </i-col>
        </Row>
      </div>
      <div v-show="benneShow & (basicList.legalStatus == '1')" class="pl20">
        <div v-if="benneList && benneList.length > 0">
          <div v-for="(benne, benneIndex) in benneList" :key="benneIndex">
            <Row class="mv10">
              <i-col span="24" class="mb10">
                <span>第{{ benne.benefitOrder }}顺序受益人</span>
              </i-col>

              <i-col span="6">
                <span>
                  姓名：
                  <label>{{ benne.name }}</label>
                </span>
              </i-col>

              <i-col span="6">
                <span>
                  与被保人关系：
                  <label v-if="insuredList.insuredRelation == '0'">本人</label>
                  <label v-if="insuredList.insuredRelation == '1'">配偶</label>
                  <label v-if="insuredList.insuredRelation == '3'">父亲</label>
                  <label v-if="insuredList.insuredRelation == '4'">母亲</label>
                  <label v-if="insuredList.insuredRelation == '5'">子女</label>
                  <label v-if="insuredList.insuredRelation == '7'"
                    >祖父母</label
                  >
                  <label v-if="insuredList.insuredRelation == '15'"
                    >兄弟姐妹</label
                  >
                  <label v-if="insuredList.insuredRelation == '17'"
                    >孙子女</label
                  >
                  <label v-if="insuredList.insuredRelation == '27'">朋友</label>
                  <label v-if="insuredList.insuredRelation == '28'">雇佣</label>
                  <label v-if="insuredList.insuredRelation == '30'">其他</label>
                  <!--  <label>
                    {{
                      [
                        ["0", "本人"],
                        ["1", "配偶"],
                        ["3", "父亲"],
                        ["4", "母亲"],
                        ["5", "子女"],
                        ["7", "祖父母"],
                        ["15", "兄弟姐妹"],
                        ["17", "孙子女"],
                        ["27", "朋友"],
                        ["28", "雇佣"],
                        ["30", "其他"],
                        ["32", "借贷关系"],
                      ].find((el) => el[0] == benne.insuredRelation)[1]
                    }}
                  </label> -->
                </span>
              </i-col>

              <i-col span="6">
                <span>
                  证件类型：
                  <label>
                    {{ benne.certificateTypeName }}
                  </label>
                </span>
              </i-col>

              <i-col span="6">
                <span>
                  证件号码；
                  <label>{{ benne.certificateNo }}</label>
                </span>
              </i-col>
            </Row>

            <Row class="mv10">
             <!--  <i-col span="6">
                <span>
                  证件有效期：
                  <label>{{
                    benne.validEndDate ? benne.validEndDate.slice(0, 10) : ""
                  }}</label>
                </span>
              </i-col> -->

              <i-col span="6">
                <span>
                  性别：
                  <label>{{ ["男", "女"][benne.gender] }}</label>
                </span>
              </i-col>

             <!--  <i-col span="6">
                <span>
                  出生日期：
                  <label>{{ benne.birthday }}</label>
                </span>
              </i-col> -->

              <i-col span="6">
                <span>
                  受益比例(%)：
                  <label>{{ benne.benefitRatio }}</label>
                </span>
              </i-col>
                 <i-col span="6">
                <span>
                  税收居民类型：
                  <label>
                    {{ benne.revenueCertificateType }}
                  </label>
                </span>
              </i-col>
            </Row>
          </div>
        </div>
      </div>
    </div>

    <!-- 健康告知信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        健康告知信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="healthShow = false"
          v-show="healthShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="healthShow = true"
          v-show="!healthShow"
        />
      </p>

      <div>
        <Table
          class="mb20"
          v-show="healthShow"
          :max-height="300"
          :columns="healthColumns"
          :data="healthInfoList"
          border
        ></Table>
      </div>
    </div>

    <!-- 核保信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        核保信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="underwritingShow = false"
          v-show="underwritingShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="underwritingShow = true"
          v-show="!underwritingShow"
        />
      </p>

      <div>
        <Table
          class="mb20"
          v-show="underwritingShow"
          :max-height="300"
          :columns="underwritingColumns"
          :data="underwritingList"
          border
        ></Table>
      </div>
    </div>

    <!-- 支付信息 -->

    <div>
      <p class="mt20 fs16 fwb">
        支付信息
        <Icon
          class="fs25"
          type="ios-arrow-down"
          @click="paymentShow = false"
          v-show="paymentShow"
        />

        <Icon
          class="fs25 mr2"
          type="ios-arrow-back"
          @click="paymentShow = true"
          v-show="!paymentShow"
        />
      </p>

      <div>
        <Table
          class="mb20"
          v-show="paymentShow"
          :max-height="300"
          :columns="paymentColumns"
          :data="paymentList"
          border
        ></Table>
      </div>
    </div>

    <!-- 影像信息 -->

  <!--   <div>
      <p class="mt20 fs16 fwb">
        影像信息
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
      <div v-if="policyFilesShow">
        <div>
          <Row>
            <i-col
              span="4"
              class="mv20"
              v-for="(item, index) in fileList"
              :key="index"
            >
              <span
                v-if="
                  ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(
                    urlSuffixList[index]
                  )
                "
                style="width: 100%"
                target="_blank"
              >
                <div>
                  <img
                    id="img"
                    :src="item"
                    alt
                    style="width: 80%; max-height: 200px"
                  />
                </div>
                <div class="mv5 mh35">
                  <Button type="primary" @click="lookImgClick(item)"
                    >预览</Button
                  >
                </div>
              </span>
              <div v-else-if="urlSuffixList[index] == 'pdf'">
                <iframe
                  :src="item"
                  type="application/x-google-chrome-pdf"
                  style="width: 80%; max-height: 200px"
                />
                <div class="mv5 mh35">
                  <Button type="primary" @click="lookImgClick(item, 'iframe')"
                    >预览</Button
                  >
                </div>
              </div>
              <div v-else>
                <div style="width: 80%; height: 115px; line-height: 115px">
                  其他格式请点击查看
                </div>
                <div class="mv5 mh35">
                  <Button type="primary" @click="lookImgClick(item)"
                    >查看</Button
                  >
                </div>
              </div>
            </i-col>
          </Row>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { get } from "@/api/api.js";
import { dateTransfer} from "@/api/sm4";
import $axios from "axios";
export default {
  data() {
    return {
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
      //险种信息数据
      insuranceList: [],
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
      policyHolderList: {
        name: "泽泽",
        sex: "男",
        cardType: "身份证",
      },
      //被保人显示
      insuredShow: true,
      //被保人信息数据
      insuredList: {
        relation: "本人",
        holderRelation: "0",
      },
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
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: { placement: "top" },
              },
              [
                params.row.insuredResult,
                h(
                  "span",
                  {
                    slot: "content",
                    style: { whiteSpace: "normal", wordBreak: "break-all" },
                  },
                  params.row.informRemarks
                ),
              ]
            );
          },
          //
        },
      ],
      imgType: "",
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
      /*   {
          title: "银行卡号",
          key: "accountCode",
          align: "center",
          minWidth: 100,
        }, */
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
      imgUrl: "",
      isLookImgMark: false,
      //影像信息显示
      policyFilesShow: true,
      //影像信息数据
      fileList: [],
       fileList2: [],
      //url后缀
      urlSuffixList: [],
      //受益人---与被保人关系
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
  mounted: function () {
  },
  watch: {},
  methods: {
    lookImgClick(val, type) {
      this.imgType = type;
      this.imgUrl = val;
      this.isLookImgMark = true;
    },
    //获取核保信息
    getPolicyList() {
      let params = {
        policyId: this.policyId,
      };
      // loading
      this.$util.showLoading();
      this.$api.getPolicyByIdList(params).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        if (res.result === "0") {
          //基本信息
          this.basicList = res.content.policyBaseDTO;
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
             this.basicList.effectiveDate= dateTransfer(this.basicList.effectiveDate,1)
            }
          });
          //险种信息
          this.insuranceList = res.content.policyLiabilityDTOList;
          this.insuranceList.map((item) => {
            item.masterFlagName = item.masterFlag == 0 ? "附加险" : "主险";
            item.dutyDTOList.forEach((el) => {
              el.amount += "(元)";
              el.premium += "(元)";
            });
            return item;
          });

          //投保人信息
          this.policyHolderList = res.content.policyHolderDTO;
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
            if (typeData.value == this.policyHolderList.certificateType) {
              this.policyHolderList.certificateTypeName = typeData.name;
            }
          });
          //被保人信息
          if (!this.$util.isEmptyObject(res.content.policyInsuredDTO)) {
            if (res.content.policyInsuredDTO.holderRelation == "0") {
              this.insuredList = {
                relation: "本人",
                holderRelation: "0",
              };
            } else {
              this.insuredList = res.content.policyInsuredDTO;
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
                if (typeData.value == this.insuredList.certificateType) {
                  this.insuredList.certificateTypeName = typeData.name;
                }
              });
            }
          }
          //受益人信息p
          if (
            res.content.policyBeneficiaryDTOList &&
            res.content.policyBeneficiaryDTOList.length > 0
          ) {
            this.benneList = res.content.policyBeneficiaryDTOList;
            this.benneList.map((benne) => {
              benne.benefitOrder = this.$util.NoToChinese(benne.benefitOrder);
              this.certificateTypeList.map((typeData) => {
                if (typeData.value == benne.certificateType) {
                  benne.certificateTypeName = typeData.name;
                }
              });
            });
          }
          //健康告知信息
          this.healthInfoList = res.content.policyHealthInformDTOList.map(
            (el) => {
              return {
                ...el,
                insuredResult: el.insuredResult ? "否" : "是",
              };
            }
          );
          //核保信息
          this.underwritingList = res.content.policyApplyDTOList;
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
          }
          this.underwritingList.map((u)=>{
            u.applyDate=dateTransfer(u.applyDate)
          })
          //支付信息
          this.payStatusList.map((paystatus) => {
            if (paystatus.value == res.content.policyChargeDTO.payStatus) {
              res.content.policyChargeDTO.payStatusName = paystatus.name;
            }
          });
          res.content.policyChargeDTO.payMethodName =
            res.content.policyChargeDTO.payMethod == "dkpay" ? "代扣" : "";
          this.paymentList.push(res.content.policyChargeDTO);
          //影像信息

          let {
            userUploadFileList,
            autographFileList,
          } = res.content.policyFilesDTO;
          this.fileList2 = [
            ...new Set([...userUploadFileList, ...autographFileList]),
          ].filter((el) => el && el.includes("http"));
          //去掉null数据
          for (var i = 0; i < this.fileList2.length; i++) {
            if (
              this.fileList2[i].split("/")[
                this.fileList2[i].split("/").length - 1
              ] == "null"
            ) {
              this.fileList2.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
              i--; // 如果不减，将漏掉一个元素
            }
          }
          this.fileList2.map((item, index) => {
            let obj = this.getURLSuffix(item);
            this.urlSuffixList.push(obj);
          });
          //application/pdf;base64
          let xhr = new XMLHttpRequest();
          let a = document.createElement("a"); // 转换完成，创建一个a标签用于下载
          let fileList1 = [];
          //给图片的格式转换为base64
          this.fileList2.map((item, index) => {
            //
            var xmlhttp;
            xmlhttp = new XMLHttpRequest();
            xmlhttp.open(
              "GET",
             item,
              true
            );
            let _this=this;
  xmlhttp.setRequestHeader('sid', sessionStorage.getItem('sid'));
  xmlhttp.setRequestHeader('menu', sessionStorage.getItem('menu'));
            xmlhttp.responseType = "blob";
            xmlhttp.onload = function () {
              if (this.status == 200) {
                var blob = this.response;
                   // _this.fileList[index]=window.URL.createObjectURL(blob);
                      _this.$set(_this.fileList,index,window.URL.createObjectURL(blob))
              }
            };
             //this.$set(this.fileList,this.fileList)
             xmlhttp.send();
            //
            /*     $axios({
                            method: 'get',
                            url: item,
                            responseType: 'arraybuffer',
                        }).then(res=>{
                            const bufferUrl = btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                            let src1 = 'application/pdf;base64,' + bufferUrl;
                            this.fileList1[index]=res
                        }).catch(e=>{
                            throw e;
                        }) */
          });
          //
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    transformArrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      for (var len = bytes.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
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

.table-width {
  width: calc(100% - 140px);
}
</style>
