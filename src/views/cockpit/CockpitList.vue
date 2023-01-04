<template>
  <div id="cockpitList">
    <!-- 顶部筛选 -->
    <div>
      <div>
        <Row>
          <ButtonGroup size="large" style="width: 100%; margin-top: 10px">
            <i-col span="12">
              <Button
                :type="isPrimary ? 'default' : 'primary'"
                style="width: 100%"
                @click="change(0)"
                >客户经营</Button
              >
            </i-col>
            <i-col span="12">
              <Button
                :type="isPrimary ? 'primary' : 'default'"
                style="width: 100%"
                @click="change(1)"
                >保险业务</Button
              >
            </i-col>
          </ButtonGroup>
          <!--  <Button-group size="large" style="width: 100%; margin-top: 10px">
            <i-col span="12">
              <Button style="width: 100%" id="buttonYear1" @click="change(0)"
                >客户经营</Button
              >
            </i-col>
            <i-col span="12">
              <Button style="width: 100%" id="buttonYear2" @click="change(1)"
                >保险业务</Button
              >
            </i-col>
          </Button-group> -->
        </Row>
      </div>
      <div v-show="0 === number">
        <div>
          <p class="mt20 fs16 fwb dt">创新业务累计用户</p>
          <Row :gutter="16">
            <i-col span="8">
              <Card class="user-card">
                <p class="user-card-title">总体</p>
                <div class="population">
                  <Row>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personSunmary.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personSunmary.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personSunmary1.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personSunmary1.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personSunmary2.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personSunmary2.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
            <i-col span="8">
              <Card class="user-card" :bordered="true">
                <p class="user-card-title">北京</p>
                <div class="population">
                  <Row>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personBeijing.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personBeijing.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personBeijing1.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personBeijing1.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personBeijing2.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personBeijing2.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
            <i-col span="8">
              <Card class="user-card" :bordered="true">
                <p class="user-card-title">天津</p>
                <div class="population">
                  <Row>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personTianjin.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personTianjin.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personTianjin1.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personTianjin1.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                    <i-col span="8" class="user-card-content">
                      <div class="user-card-content-title1">
                        {{ personTianjin2.name }}
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          personTianjin2.value
                        }}</span>
                        <span class="user-card-content-title22">人</span>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
          </Row>
        </div>
        <Form ref="formInline" :model="searchCockpitCus" inline>
          <div>
            <Row :gutter="16">
              <i-col span="18">
                <Card style="float: left;">
                  <div class="innerFilter">
                    <FormItem>
                      <Select
                        v-model="searchCockpitCus.select"
                        placeholder="选择时间维度"
                        style="width: 200px; margin-right: 5px"
                        @on-change="selectChange"
                      >
                        <Option value="1">年度</Option>
                        <Option value="2">季度</Option>
                        <Option value="3">月度</Option>
                        <Option value="0">其他</Option>
                      </Select>
                    </FormItem>
                    <FormItem>
                      <DatePicker
                      :clearable="false"
                        type="year"
                        v-if="
                          searchCockpitCus.select === '1' ||
                          searchCockpitCus.select === '2'
                        "
                        v-model="searchCockpitCus.year"
                        style="width: 200px; margin-right: 5px"
                      ></DatePicker>
                      <Select
                        v-if="searchCockpitCus.select === '2'"
                        v-model="searchCockpitCus.quarter"
                        style="width: 200px; margin-right: 5px"
                      >
                        <Option value="1">第一季度</Option>
                        <Option value="2">第二季度</Option>
                        <Option value="3">第三季度</Option>
                        <Option value="4">第四季度</Option>
                      </Select>
                      <DatePicker
                      :clearable="false"
                        type="month"
                        v-if="searchCockpitCus.select === '3'"
                        v-model="searchCockpitCus.year"
                        style="width: 200px; margin-right: 5px"
                      ></DatePicker>
                      <DatePicker
                      :clearable="false"
                        v-if="searchCockpitCus.select === '0'"
                        v-model="searchCockpitCus.time"
                        type="daterange"
                        style="width: 200px"
                      ></DatePicker>
                    </FormItem>
                    <Button @click="fetchDataCustomer" type="primary"
                      >查询</Button
                    >
                    <Button @click="resetCus()">重置</Button>
                  </div>
                  <i-col span="8">
                    <div
                      id="pie-echarts-person-level"
                      style="height: 253px; width: 100%"
                    ></div>
                    <div
                      id="pie-echarts-person-source"
                      style="height: 253px; width: 100%;margin:20px 0"
                    ></div>
                    <div
                      id="pie-echarts-person-activity"
                      style="height: 253px; width: 100%;"
                    ></div>
                  </i-col>
                  <i-col span="16">
                    <div class="population" style="margin-bottom: 20px">
                      <Row :gutter="16">
                        <i-col
                          span="8"
                          class="user-card-content"
                          style="text-align: center"
                        >
                          <div class="user-card-content-title1">
                            {{ priNameList[0] }}
                          </div>
                          <div>
                            <span class="user-card-content-title2">{{
                              priValueList[0]
                            }}</span>
                            <span class="user-card-content-title22">人</span>
                          </div>
                        </i-col>
                        <i-col
                          span="8"
                          class="user-card-content"
                          style="text-align: center"
                        >
                          <div class="user-card-content-title1">
                            {{ priNameList[1] }}
                          </div>
                          <div>
                            <span class="user-card-content-title2">{{
                              priValueList[1]
                            }}</span>
                            <span class="user-card-content-title22">人</span>
                          </div>
                        </i-col>
                        <i-col
                          span="8"
                          class="user-card-content"
                          style="text-align: center"
                        >
                          <div class="user-card-content-title1">
                            {{ priNameList[2] }}
                          </div>
                          <div>
                            <span class="user-card-content-title2">{{
                              priValueList[2]
                            }}</span>
                            <span class="user-card-content-title22">人</span>
                          </div>
                        </i-col>
                      </Row>
                    </div>
                    <div
                      id="column-echarts-obtain-customer"
                      style="height: 260px; width: 100%"
                    ></div>
                    <Row style="padding: 15px;
    padding-bottom: 0px;filter:Alpha(Opacity=60);opacity:0.5;background: #f3f3f3;">
                      <i-col span="8">
                        <div
                          id="funnel-echarts-conversion-rate"
                          style="height: 200px; margin-bottom: 15px"
                        ></div>
                      </i-col>
                      <i-col span="16">
                        <!-- <primaryTable :columns="columnsRate" :data="rateData" style="height:220px;"></primaryTable> -->
                        <Table
                          :columns="columnsRate"
                          :data="rateData"
                          height="200"
                        ></Table>
                      </i-col>
                    </Row>
                    <Row style="filter:Alpha(Opacity=60);opacity:0.5;background: #f3f3f3;padding: 0 5px;
    padding-bottom: 20px;">
                      <i-col span="12">
                        <div
                          id="funnel-echarts-conversion-rate-video"
                          style="height: 12rem"
                        ></div>
                      </i-col>
                      <i-col span="12">
                        <div
                          id="funnel-echarts-conversion-nature-flow"
                          style="height: 12rem"
                        ></div>
                      </i-col>
                    </Row>
                  </i-col>
                </Card>
              </i-col>
              <i-col span="6">
                <p
                  class="mt20 fs16 fwb dt"
                  style="margin: 20px 20px 20px 17px !important"
                >
                  年度客户指标达成率
                </p>
                <Card class="right-card">
                  <div id="pie-echarts-summary" style="height: 199px"></div>
                </Card>
                <Card class="right-card">
                  <div id="pie-echarts-beijing" style="height: 199px"></div>
                </Card>
                <Card class="right-card">
                  <div id="pie-echarts-tainjin" style="height: 199px"></div>
                </Card>
              </i-col>
            </Row>
          </div>
          <div>
            <p class="mt20 fs16 fwb dt">社群活跃度指标</p>
            <i-table :columns="teamDataColumns" :data="teamData"></i-table>
          </div>
        </Form>
      </div>
      <div v-show="1 === number">
        <div>
          <p class="mt20 fs16 fwb dt">年度业务指标达成率</p>
          <Row :gutter="16">
            <i-col span="8">
              <Card class="user-card">
                <p class="user-card-title">总体</p>
                <div class="population">
                  <Row>
                    <i-col
                      v-for="(b, index) in baoChartDataTotal"
                      :key="index"
                      span="12"
                      class="user-card-content"
                    >
                      <div class="user-card-content-title1">{{ b.name }}</div>
                      <div>
                        <span class="user-card-content-title2">{{
                          b.amount
                        }}</span
                        >
                        <span v-if="index==0">件</span>
                        <span v-else>万元</span>
                      </div>
                      <div>
                        <span class="user-card-content-title2">{{
                          b.value
                        }}</span
                        ><span>%</span>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
            <i-col span="8">
              <Card class="user-card" :bordered="true">
                <p class="user-card-title">北京</p>
                <div class="population">
                  <Row>
                    <i-col
                      v-for="(b, index) in baoChartDataBei"
                      :key="index"
                      span="12"
                      class="user-card-content"
                    >
                      <div class="user-card-content-title1">{{ b.name }}</div>
                      <div>
                        <span class="user-card-content-title2">{{
                          b.amount
                        }}</span
                        >
                        <span v-if="index==0">件</span>
                        <span v-else>万元</span>
                      </div>
                      <div>
                          <span class="user-card-content-title2">{{
                          b.value
                        }}</span>
                        <span>%</span>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
            <i-col span="8">
              <Card class="user-card" :bordered="true">
                <p class="user-card-title">天津</p>
                <div class="population">
                  <Row>
                    <i-col
                      v-for="(b, index) in baoChartDataTian"
                      :key="index"
                      span="12"
                      class="user-card-content"
                    >
                      <div class="user-card-content-title1">{{ b.name }}</div>
                      <div>
                         <span class="user-card-content-title2">{{
                          b.amount
                        }}</span
                        >
                        <span v-if="index==0">件</span>
                        <span v-else>万元</span>
                      </div>
                       <div>
                        <span class="user-card-content-title2">{{
                          b.value
                        }}</span>
                        <span>%</span>
                       </div>
                    </i-col>
                  </Row>
                </div>
              </Card>
            </i-col>
          </Row>
          <Form ref="formInline" :model="searchCockpit" inline>
            <Card class="user-card">
              <div class="innerFilter">
                <Row>
                  <FormItem>
                    <Select
                      v-model="searchCockpit.select"
                      placeholder="选择时间维度"
                      style="width: 200px; margin-right: 5px"
                      @on-change="selectChange"
                    >
                      <Option value="1">年度</Option>
                      <Option value="2">季度</Option>
                      <Option value="3">月度</Option>
                      <Option value="0">其他</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <DatePicker
                      type="year"
                      :clearable="false"
                      v-if="
                        searchCockpit.select === '1' ||
                        searchCockpit.select === '2'
                      "
                      v-model="searchCockpit.year"
                      style="width: 200px; margin-right: 5px"
                    ></DatePicker>
                    <Select
                      v-if="searchCockpit.select === '2'"
                      v-model="searchCockpit.quarter"
                      style="width: 200px; margin-right: 5px"
                    >
                      <Option value="1">第一季度</Option>
                      <Option value="2">第二季度</Option>
                      <Option value="3">第三季度</Option>
                      <Option value="4">第四季度</Option>
                    </Select>
                    <DatePicker
                    :clearable="false"
                      type="month"
                      v-if="searchCockpit.select === '3'"
                      v-model="searchCockpit.year"
                      style="width: 200px; margin-right: 5px"
                    ></DatePicker>
                    <DatePicker
                    :clearable="false"
                      v-if="searchCockpit.select === '0'"
                      v-model="searchCockpit.time"
                      type="daterange"
                      style="width: 200px"
                    ></DatePicker>
                  </FormItem>
                  <Button @click="fetchData" type="primary">查询</Button>
                  <Button @click="reset()">重置</Button>
                </Row>
              </div>
            </Card>
            <div>
              <Row class="area-chart">
                <i-col span="24">
                  <Card class="user-card" :bordered="true">
                    <div class="population">
                      <Row>
                        <i-col span="6" class="user-card-content">
                          <div class="user-card-content-title1">
                            {{ chartDataTotal.name }}
                          </div>
                          <div>
                            <span class="user-card-content-title2">{{
                              chartDataTotal.value
                            }}</span
                            >件
                          </div>
                        </i-col>
                        <i-col span="18" class="user-card-content">
                          <div class="user-card-content-title1">
                            {{ percentageDataTotal.name }}
                          </div>
                          <div>
                            <span class="user-card-content-title2">{{
                              percentageDataTotal.value
                            }}</span
                            >万元
                          </div>
                        </i-col>
                      </Row>
                    </div>
                  </Card>
                </i-col>
              </Row>
              <Row :gutter="16">
                <i-col span="12">
                  <Card>
                    <div
                      id="echarts-insurance-policy"
                      style="height: 220px; width: 520px"
                    ></div>
                  </Card>
                </i-col>
                <i-col span="12">
                  <Card>
                    <div
                      id="echarts-new-policy"
                      style="height: 220px; width: 520px"
                    ></div>
                  </Card>
                </i-col>
              </Row>
            </div>
            <div>
              <div>
                <p class="mt20 fs16 fwb dt">产品相关数据</p>
                 <Row style="margin-bottom:15px">
                    <Card style="float:left;width:100%">
                       <i-col span="8">
                      <div
                        id="echarts-product-sales"
                        style="height: 220px; width: 348px"
                      ></div>
                      </i-col>
                       <i-col span="16" style="padding:30px">
                      <i-table
                        :columns="columnsProduct"
                        :data="columnsProductData"
                      ></i-table>
                       </i-col>
                    </Card>
                </Row>
                 <Row style="margin-bottom:15px">
                    <Card style="float:left;width:100%">
                       <i-col span="8">
                      <div
                        id="echarts-product-pay"
                        style="height: 220px; width: 348px"
                      ></div>
                      </i-col>
                       <i-col span="16" style="padding:30px">
                      <i-table
                        :columns="columnsProductPay"
                        :data="columnsProductPayData"
                      ></i-table>
                       </i-col>
                    </Card>
                </Row>
                 <Row style="margin-bottom:15px">
                    <Card style="float:left;width:100%">
                       <i-col span="8">
                      <div
                        id="echarts-product-sales-year"
                        style="height: 220px; width: 348px"
                      ></div>
                      </i-col>
                       <i-col span="16" style="padding:30px">
                     <i-table
                        :columns="columnsProductYear"
                        :data="columnsProductYearData"
                      ></i-table>
                       </i-col>
                    </Card>
                </Row>
              </div>
              <Row>
                <div class="area-chart">
                  <div class="left-product">
                    <Card id="outEchartsAge" style="margin-bottom: 15px">
                      <div
                        id="column-echarts-source-ages"
                        style="height: 265px; width: 100%"
                      ></div>
                    </Card>
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="column-echarts-source-sex"
                          style="height: 265px; width: 346px"
                        ></div>
                      </div>
                    </Card>
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="column-echarts-source-year"
                          style="height: 264px; width: 346px"
                        ></div>
                      </div>
                    </Card>
                  </div>
                  <div class="middle-product">
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="echarts-customer-source"
                          style="height: 420px; width: 274px"
                        ></div>
                      </div>
                    </Card>
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="echarts-new-source-pay"
                          style="height: 420px; width: 274px"
                        ></div>
                      </div>
                    </Card>
                  </div>
                  <div class="right-product">
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="column-echarts-source-products"
                          style="height: 265px; width: 346px"
                        ></div>
                      </div>
                    </Card>
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="column-echarts-source-products-all"
                          style="height: 265px; width: 346px"
                        ></div>
                      </div>
                    </Card>
                    <Card style="margin-bottom: 15px">
                      <div class="w600">
                        <div
                          id="echarts-source-number"
                          style="height: 264px; width: 346px"
                        ></div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Row>
              <Row>
                <div>
                  <p class="mt20 fs16 fwb dt">产品客户画像</p>
                  <div class="area-chart">
                    <div class="left-product">
                      <Card style="margin-bottom: 15px">
                        <div class="w600" style="height: 398.5px">
                          <div
                            id="column-echarts-product-ages"
                            style="height:398.5px; width: 346px"
                          ></div>
                        </div>
                      </Card>
                      <Card style="margin-bottom: 15px">
                        <div class="w600" style="height: 398.5px">
                          <div
                            id="column-echarts-product-sex"
                            style="height: 398.5px; width: 346px"
                          ></div>
                        </div>
                      </Card>
                    </div>
                    <div class="right-product-pic">
                      <Card style="margin-bottom: 15px">
                        <div style="height: 250px">
                          <div
                            id="column-echarts-product-flow-source-ages"
                            style="height: 250px; width: 715px"
                          ></div>
                        </div>
                      </Card>
                      <Card style="margin-bottom: 15px">
                        <div style="height: 250px">
                          <div
                            id="column-echarts-product-flow-year-ages"
                            style="height: 250px; width: 715px"
                          ></div>
                        </div>
                      </Card>
                      <Card style="margin-bottom: 15px">
                        <div style="height: 250px">
                          <div
                            id="column-echarts-source-products-average"
                            style="height: 250px; width: 715px"
                          ></div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          </Form>
        </div>
      </div>
      <div v-show="2 === number">
        <div>
          <Form
            ref="formInline"
            :model="searchCockpit"
            inline
            :label-width="90"
            class="barYear"
          >
            <Row>
              <Button-group>
                <i-button class="buttonYear">年度</i-button>
                <i-button class="buttonYear">季度</i-button>
                <i-button class="buttonYear">月度</i-button>
                <i-button>自定义</i-button>
              </Button-group>
              <Button type="primary">查询</Button>
              <Button @click="reset()">重置</Button>
            </Row>
            <p class="mt20 fs16 fwb dt">外勤人员数指标</p>

            <Card>
              <Row :gutter="16">
                <i-col style="float: left" span="4">
                  <div
                    id="echarts-out-beijing"
                    style="height: 200px; width: 200px"
                  ></div>
                </i-col>
                <i-col style="float: left" span="4">
                  <div
                    id="echarts-out-tainjin"
                    style="height: 200px; width: 200px"
                  ></div>
                </i-col>
                <i-col style="float: left" span="16">
                  <div
                    style="
                      height: 150px;
                      width: 716px;
                      height: 140px;
                      margin-top: 0px;
                      margin-bottom: 20px;
                    "
                  >
                    <i-table
                      :columns="columnsExtension"
                      :data="extensionData"
                    ></i-table>
                  </div>
                </i-col>
              </Row>
            </Card>
            <p class="mt20 fs16 fwb dt">销售相关数据</p>
            <Card style="height: 220px">
              <Row>
                <i-col span="5" style="float: left">
                  <div
                    id="column-echarts-extension-insurance"
                    style="height: 200px; width: 200px"
                  ></div>
                </i-col>
                <i-col span="6" style="float: left">
                  <div
                    id="column-echarts-extension-insurance-new"
                    style="height: 200px; width: 250px"
                  ></div>
                </i-col>
                <i-col span="5" style="float: left">
                  <div
                    id="column-echarts-extension-insurance-income"
                    style="height: 200px; width: 250px"
                  ></div>
                </i-col>
                <i-col span="6" style="float: left">
                  <div
                    id="column-echarts-extension-long-and-short-insurance"
                    style="height: 200px; width: 320px; margin-left: 36px"
                  ></div>
                </i-col>
              </Row>
            </Card>
            <p class="mt20 fs16 fwb dt">客户经营相关数据</p>
            <Row :gutter="16">
              <i-col span="8">
                <Card>
                  <div
                    id="column-echarts-customer-about1"
                    style="height: 200px; width: 358px"
                  ></div>
                </Card>
              </i-col>
              <i-col span="8">
                <Card>
                  <div
                    id="column-echarts-extension-one-to-one"
                    style="height: 200px; width: 358px"
                  ></div>
                </Card>
              </i-col>
              <i-col span="8">
                <Card>
                  <div
                    id="column-echarts-extension-customer-satisfy"
                    style="height: 200px; width: 358px"
                  ></div>
                </Card>
              </i-col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Echarts from 'echarts';
export default {
  data() {
    return {
      isPrimary: false,
      AvgPremiumByProductName: [],
      AvgPremiumByProductdata: [],
      PayPeriodByProductSeries: [],
      PayPeriodByProductData: [],
      sourceFromByProductData: [],
      sourceFromByProductSeries: [],
      RegionTotalSeries: [],
      //新单保费数据
      xList:[],
      xList1:[],
      xList2:[],
      RegionPremiumSeries: [],
      RegionPremiumDate: [],
      RegionTotalSource: [],
      //保单客户来源占比
      newUserBySourceName: [],
      newUserBySourceData: [],
      //保险业务创新业务累计用户
      baoChartDataTotal: [],
      baoChartDataBei: [],
      baoChartDataTian: [],
      chartDataTian: [],
      chartDataBei: [],
      AvgPremiumName: [],
      AvgPremiumdata: [],
      PeriodSeries: [],
      sexSeries: [],
      AgeSeries: [],
      sourceDataProduct: [],
      sourceDataProductAge: [],
      sourceDataProductSex: [],
      productSeries: [],
      productSeriesAge: [],
      productSeriesSex: [],
      sourceDataPremium: [],
      sourceDataSex: [],
      sourceDataPeriod: [],
      sourceDataAge: [],
      percentageDataTotal: [],
      chartDataTotal: [],
      columnsData: [],
      saleNumberChart: [],
      saleNumberChartName: [],
      premiumPeriodChart: [],
      premiumPeriodChartName: [],
      premiumChart: [],
      premiumChartName: [],
      // 私域用户中间部分
      priNameList: [],
      priValueList: [],
      // 年度客户指标达成率-总体
      rateSumaryList: [{ name: "" }, { value: "" }],
      // 总体
      personSunmary: [{ name: "" }, { value: "" }],
      personSunmary1: [{ name: "" }, { value: "" }],
      personSunmary2: [{ name: "" }, { value: "" }],
      // 北京
      personBeijing: [{ name: "" }, { value: "" }],
      personBeijing1: [{ name: "" }, { value: "" }],
      personBeijing2: [{ name: "" }, { value: "" }],
      // 天津
      personTianjin: [{ name: "" }, { value: "" }],
      personTianjin1: [{ name: "" }, { value: "" }],
      personTianjin2: [{ name: "" }, { value: "" }],
      number: 0,
      // 外勤人员数指标
      columnsExtension: [
        {
          title: "机构",
          key: "a",
          align: "center",
        },
        {
          title: "合计",
          key: "b",
          align: "center",
        },

        {
          title: "增员人数",
          key: "c",
          align: "center",
        },
        {
          title: "转正人数",
          key: "d",
          align: "center",
        },
        {
          title: "转正率",
          key: "e",
          align: "center",
        },
        {
          title: "晋升人数",
          key: "f",
          align: "center",
        },

        {
          title: "晋升率",
          key: "g",
          align: "center",
        },
        {
          title: "降级人数",
          key: "h",
          align: "center",
        },
        {
          title: "育成团队个数",
          key: "i",
          align: "center",
        },
        {
          title: "留存率（3个月）",
          key: "j",
          align: "center",
        },
        {
          title: "留存率（6个月）",
          key: "k",
          align: "center",
        },

        {
          title: "留存率（13个月）",
          key: "l",
          align: "center",
        },
        {
          title: "离职人数",
          key: "m",
          align: "center",
        },
      ],
      // 外勤人员数指标参数
      extensionData: [
        {
          a: "北京",
          b: "10",
          c: "2",
          d: "5",
          e: "50%",
          f: "3",
          g: "33%",
          h: "0",
          i: "1",
          j: "90%",
          k: "90%",
          l: "90%",
          m: "1",
        },
        {
          a: "天津",
          b: "8",
          c: "2",
          d: "5",
          e: "50%",
          f: "3",
          g: "33%",
          h: "0",
          i: "1",
          j: "90%",
          k: "90%",
          l: "90%",
          m: "1",
        },
      ],
      // 转化率
      columnsRate: [
        {
          title: "机构",
          key: "a",
          minWidth: 60,
        },
        {
          title: "分类",
          key: "b",
          minWidth: 60,
        },
        {
          title: "私域用户",
          key: "c",
          minWidth: 80,
        },
        {
          title: "注册用户",
          key: "d",
          minWidth: 80,
        },
        {
          title: "参加活动用户",
          key: "e",
          minWidth: 80,
        },
        {
          title: "出单用户",
          key: "f",
          minWidth: 80,
        },
        {
          title: "复购用户",
          key: "g",
          minWidth: 80,
        },
      ],
      // 转化率参数
      rateData: [
        { a: "北京", b: "人数", c: 100, d: 90, e: 40, f: 20, g: 5 },
        {
          a: "天津",
          b: "转化率",
          c: "-",
          d: "90.00%",
          e: "44.44%",
          f: "50.00%",
          g: "25.00%",
        },
      ],
      // 社群活跃度指标
      teamDataColumns: [
        {
          title: "机构",
          key: "deptName",
          align: "center",
          minWidth: 130,
        },
        {
          title: "群总数",
          key: "chatTotal",
          align: "center",
          minWidth: 130,
        },
        {
          title: "新增群聊数",
          key: "newChatCnt",
          align: "center",
          minWidth: 150,
        },

        {
          title: "有过消息的群聊数",
          key: "chatHasMsg",
          align: "center",
          minWidth: 150,
        },
        {
          title: "群成员总数",
          key: "memberTotal",
          align: "center",
          minWidth: 130,
        },
        {
          title: "新增群成员数",
          key: "newMemberCnt",
          align: "center",
          minWidth: 100,
        },
        {
          title: "发过消息的群成员数",
          key: "memberHasMsg",
          align: "center",
          minWidth: 110,
        },
        {
          title: "群聊消息总数",
          key: "msgTotal",
          align: "center",
          minWidth: 150,
        },
      ],
      curYear1:"",
      curYear2:"",
      // 社群活跃度指标参数
      teamData: [],
      // 产品销售件数占比
      columnsProduct: [
        {
          title: "机构",
          key: "j",
          align: "center",
          minWidth: 60,
        },
      ],
      // 产品销售件数占比参数
      columnsProductData: [],
      // 产品保费占比
      columnsProductPay: [
        {
          title: "机构",
          key: "j",
          align: "center",
          minWidth: 60,
        },
      ],
      // 产品保费参数
      columnsProductPayData: [],
      // 产品销售件数年份占比
      columnsProductYear: [
        {
          title: "机构",
          key: "j",
          align: "center",
          minWidth: 60,
        },
      ],
      // 产品销售件数年份占比参数
      columnsProductYearData: [],
      legentList: [],
      legentList2: [],
      legentList3: [],
      statData: {},
      yearShow: false, //年度是否可选择
      quarterShow: false, //季度是否可选择
      monthlyShow: false, //月度是否可选择
      startShow: false,
      endShow: false,
      // 保险业务绑定数据
      searchCockpit: {
        select: "1",
        year: new Date(),
        quarter: "1",
        time: [],
      },
      // 客户经营绑定数据
      searchCockpitCus: {
        select: "1",
        year: new Date(),
        quarter: "1",
        time: [],
      },
    };
  },
  beforeCreate() {
    this.$nextTick(() => {
      document
        .querySelector(".ivu-card")
        .setAttribute("style", "background-color:#F2F2F2");
    });
  },
  beforeDestroy() {
    document.querySelector(".ivu-card").removeAttribute("style");
  },
  created: function () {},
  mounted() {
     //社群活跃度指标
      this.getGroupChatStatistic();
    this.fetchData();
    // 客户经营查询
    this.fetchDataCustomer();
    this.getPerson();
    // 客户经营
    // 转化率（俱乐部）
    this.getEchartsDataConversionRate();
    // 转化率（短视频平台）
    this.getEchartsDataConversionRateVideo();
    // 转化率（自然流量）
    this.getEchartsDataConversionNatureFlow();
    //外勤人员数指标-北京
    //this.getEchartsOutBeijing();
    //外勤人员数指标-天津（不显示）
    //this.getEchartsOutTianjin();
    //推广人员人均保单件数（不显示）
    //this.getEchartsDataExtensionInsurance();
    //推广人员人均新单保费（万元）
    //this.getEchartsDataExtensionInsuranceNew();
    //推广人员人均收入
    //this.getEchartsDataExtensionInsuranceIncome();
    //推广人员人均长短险件数比
    //this.getEchartsDataExtensionLongAndShortInsurance();
    //客户经营相关数据表1
    //this.getEchartsDataCustomerAbout1();
    //用户1对1被沟通占比
    //this.getEchartsDataExtensionOneToOne();
    //推广人员客户服务满意度
    //this.getEchartsDataExtensionCustomerSatisfy();
  },
  watch: {},
  methods: {
    //各产品均件保费分布
    getAvgPremiumByProduct(reqData) {
      this.$api.getAvgPremiumByProduct(reqData).then((res) => {
        if (res.result === "0") {
          this.AvgPremiumByProductName = [];
          this.AvgPremiumByProductdata = [];
          res.data.forEach((r) => {
            this.AvgPremiumByProductName.push(r.name);
            this.AvgPremiumByProductdata.push(r.value);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById(
        "column-echarts-source-products-all"
      ).style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-products-average")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各产品件均分布（万元）",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }, },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataPremium,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.AvgPremiumByProductName,
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            data: this.AvgPremiumByProductdata,
            type: "bar",
            color: ["#3399CC"],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    // 各产品来源分布
    getSourceFromByProduct(reqData) {
      this.$api.getSourceFromByProduct(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceFromByProductData = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              if (
                this.sourceFromByProductSeries.length !=
                res.data[0].chartData.length
              ) {
                this.sourceFromByProductSeries.push({ type: "bar" });
              }
            });
          }
          this.sourceFromByProductData.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceFromByProductData.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-product-flow-source-ages")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各产品流量来源分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }, },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"],
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceFromByProductData,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: this.sourceFromByProductSeries,
      };

      businessSourcePersonLevel.setOption(option);
    },
    //社群活跃度指标
    getGroupChatStatistic() {
      this.$api.getGroupChatStatistic().then((res) => {
        console.log(res)
        if (res.result === "0") {
          this.teamData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    // 各产品年期分布
    getPayPeriodByProduct(reqData) {
      this.$api.getPayPeriodByProduct(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.PayPeriodByProductData = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              if (
                this.PayPeriodByProductSeries.length !=
                res.data[0].chartData.length
              ) {
                this.PayPeriodByProductSeries.push({ type: "bar" });
              }
            });
          }
          this.PayPeriodByProductData.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.PayPeriodByProductData.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-product-flow-year-ages")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各产品年期分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"],
        legend: { bottom: 0, left: 0,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }, },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.PayPeriodByProductData,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.PayPeriodByProductSeries,
      };

      businessSourcePersonLevel.setOption(option);
    },
    //保险业务创新业务累计用户
    getBusinessIndicators() {
      let reqData = {
        newPolicyPremium: 10000000,
        policyNum: 2000,
      };
      this.$api.getBusinessIndicators(reqData).then((res) => {
        console.log(res);
        if (res.result === "0") {
          res.data.map((d) => {
            if (d.name == "总体") {
              this.baoChartDataTotal = d.chartData;
            }
            if (d.name == "天津") {
              this.baoChartDataTian = d.chartData;
            }
            if (d.name == "北京") {
              console.log(d);
              this.baoChartDataBei = d.chartData;
            }
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //驾驶舱-各来源新单保费占比
    getNewPremiumBySource(reqData) {
      this.$api.getNewPremiumBySource(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-new-source-pay")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "各来源新单保费占比",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          color: ["#66CC99", "#3399CC", "#FFFF00", "#FFD700", "#FF4500"],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          legend: {
            orient: "horizontal",
            left: 0,
            bottom: 0,
            right: 20,
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            },
          },
          series: [
            {
              name: "各来源新单保费占比",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["50%", "55%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                echartsData.length > 0
                  ? echartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    //各来源保单件数占比
    getNewPolicyBySource(reqData) {
      this.$api.getNewPolicyBySource(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-source-number")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "各来源保单件数占比",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          color: ["#66CC99", "#3399CC", "#FFFF00", "#FFD700", "#FF4500"],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          legend: {
            orient: "vertical",
            right: "10px",
            top: "center",
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          series: [
            {
              name: "各来源保单件数占比",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["30%", "53%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                echartsData.length > 0
                  ? echartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    // 驾驶舱-各来源新单用户占比
    getNewUserBySource(reqData) {
      this.$api.getNewUserBySource(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-customer-source")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "保单客户来源占比（客户数）",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          color: ["#66CC99", "#3399CC", "#FFFF00", "#FFD700", "#FF4500"],
          legend: {
            orient: "horizontal",
            left: 0,
            bottom: 0,
            right: 20,
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          series: [
            {
              name: "保单客户来源占比（客户数）",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["50%", "50%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                echartsData.length > 0
                  ? echartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    // 保险业务获取总体-北京-天津用户人数
    getTotalByDate(reqData) {
      this.$api.getTotalByDate(reqData).then((res) => {
        if (res.result === "0") {
          this.chartDataTotal = res.data.chartData;
          this.percentageDataTotal = res.data.percentageData;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    //各来源产品分布
    getProductBySource(reqData) {
      this.$api.getProductBySource(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataProduct = [];
          this.productSeries = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              this.productSeries.push({ type: "bar" });
            });
          }
          this.sourceDataProduct.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataProduct.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById("column-echarts-source-products").style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-products")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各来源产品分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0 ,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }},
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataProduct,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.productSeries,
        color: [
          "#66CC99",
          "#FF4500",
          "#FFFF00",
          "#FF6600",
          "#FFD700",
          "#339900",
          "#3399CC",
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //各来源件均分布
    getAvgPremiumBySource(reqData) {
      this.$api.getAvgPremiumBySource(reqData).then((res) => {
        if (res.result === "0") {
          this.AvgPremiumName = [];
          this.AvgPremiumdata = [];
          res.data.forEach((r) => {
            this.AvgPremiumName.push(r.name);
            this.AvgPremiumdata.push(r.value);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById(
        "column-echarts-source-products-all"
      ).style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-products-all")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各来源件均分布（万元）",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            } },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataPremium,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          data: this.AvgPremiumName,
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            data: this.AvgPremiumdata,
            type: "bar",
            color: ["#3399CC"],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //交费年期
    getPayPeriodBySource(reqData) {
      this.$api.getPayPeriodBySource(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataPeriod = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            this.PeriodSeries = [];
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              this.PeriodSeries.push({ type: "bar" });
            });
          }
          this.sourceDataPeriod.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataPeriod.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById("column-echarts-source-year").style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-year")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各来源年期分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0 ,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }},
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataPeriod,
        },
        color: ["#66CC99", "#3399CC", "#FFFF00", "#FFD700", "#FF4500"],
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.PeriodSeries,
      };

      businessSourcePersonLevel.setOption(option);
    },
    //性别分布
    getSexBySource(reqData) {
      this.$api.getSexBySource(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataSex = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            this.sexSeries = [];
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              this.sexSeries.push({ type: "bar" });
            });
          }
          this.sourceDataSex.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataSex.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById("column-echarts-source-sex").style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-sex")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各来源性别分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0 ,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }},
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"],
        dataset: {
          source: this.sourceDataSex,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.sexSeries,
      };

      businessSourcePersonLevel.setOption(option);
    },
    //新单保费
    getRegionPremiumByDate(reqData) {
      this.$api.getRegionPremiumByDate(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        if (res.data) {
          if(res.data[0].chartData){
             this.xList2=[];
             res.data[0].chartData.map((x)=>{
               this.xList2.push(x.name);
           })
          }
          res.data.forEach((r) => {
            let indata = [];
            this.legentList3.push(r.name);
            r.chartData.forEach((i) => {
              indata.push(i.value);
            });
            r.data = indata;
            r.type = "bar";
            r.itemStyle = {
              normal: {
                show: false,
              },
            };
          });
        } else {
          data = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-new-policy")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: this.curYear2, 
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          color: ["#3399CC", "#FFD700", "#66CC99"],
          legend: {
            data: this.legentList3,
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              data: this.xList2,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: res.data,
          /* [
            {
              name: "Forest",
              type: "bar",
              barGap: 0,
              data: [320, 332, 301, 334, 390],
              itemStyle: {
                normal: {
                  show: false,
                },
              },
            }
          ], */
        };

        businessSourcePersonLevel.setOption(option);
      });
    },
    //新单保费
    //保单件数
    getRegionTotalByDate(reqData) {
      this.$api.getRegionTotalByDate(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        if (res.data) {
           if(res.data[0].chartData){
             this.xList1=[];
             res.data[0].chartData.map((x)=>{
               this.xList1.push(x.name);
           })
          }
          res.data.forEach((r) => {
            let indata = [];
            this.legentList2.push(r.name);
            r.chartData.forEach((i) => {
              indata.push(i.value);
            });
            r.data = indata;
            r.type = "bar";
            r.itemStyle = {
              normal: {
                show: false,
              },
            };
          });
        } else {
          data = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-insurance-policy")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: this.curYear1,
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          color: ["#3399CC", "#FFD700", "#66CC99"],
          legend: {
            data: this.legentList2,
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              data: this.xList1,
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: res.data,
          /* [
            {
              name: "Forest",
              type: "bar",
              barGap: 0,
              data: [320, 332, 301, 334, 390],
              itemStyle: {
                normal: {
                  show: false,
                },
              },
            }
          ], */
        };

        businessSourcePersonLevel.setOption(option);
      });
    },
    // 保险业务各来源新单用户年龄分布
    getAgeBySource(reqData) {
      this.$api.getAgeBySource(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataAge = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              if (this.AgeSeries.length != res.data[0].chartData.length) {
                this.AgeSeries.push({ type: "bar" });
              }
            });
          }
          this.sourceDataAge.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataAge.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById("column-echarts-source-ages").style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-source-ages")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各来源年龄分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0 ,itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataAge,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.AgeSeries,
        color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"],
      };

      businessSourcePersonLevel.setOption(option);
    },
    // 获取总体-北京-天津用户人数
    getPerson() {
      this.$api.getCumulativeUser().then((res) => {
        if (res.result === "0") {
          //基本信息
          this.personSunmary = res.data[0].chartData[0];
          this.personSunmary1 = res.data[0].chartData[1];
          this.personSunmary2 = res.data[0].chartData[2];
          this.personBeijing = res.data[1].chartData[0];
          this.personBeijing1 = res.data[1].chartData[1];
          this.personBeijing2 = res.data[1].chartData[2];
          this.personTianjin = res.data[2].chartData[0];
          this.personTianjin1 = res.data[2].chartData[1];
          this.personTianjin2 = res.data[2].chartData[2];
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    // 获取年度客户指标达成率
    getCustomerIndicators() {
      //先固定写死。后期改成可配置的
      let reqData = {
        clubIndicators: 20000,
        friendIndicators: 20000,
      };
      // reqData.clubIndicators
      this.$api.getCustomerIndicators(reqData).then((res) => {
        if (res.result === "0") {
          let nameList = [],
            valueList = [],
            amountList=[],
            amount2List=[];
          for (var i = 0; i < res.data[2].chartData.length; i++) {
            nameList.push(res.data[2].chartData[i].name);
            valueList.push(res.data[2].chartData[i].value);
            amountList.push(res.data[2].chartData[i].amount);
             amount2List.push(reqData.friendIndicators-res.data[2].chartData[i].amount);
          }
          this.getEchartsDataSummary(nameList, valueList,amountList,amount2List);

          let nameListBei = [],
            valueListBei = [],
             amountListBei=[],
            amount2ListBei=[];
          for (var i = 0; i < res.data[0].chartData.length; i++) {
            nameListBei.push(res.data[0].chartData[i].name);
            valueListBei.push(res.data[0].chartData[i].value);
              amountListBei.push(res.data[0].chartData[i].amount);
             amount2ListBei.push(reqData.friendIndicators-res.data[0].chartData[i].amount);
          }
          this.getEchartsDataBeijing(nameListBei, valueListBei,amountListBei,amount2ListBei);

          let nameListTian = [],
            valueListTian = [],
              amountListTian=[],
            amount2ListTian=[];
          for (var i = 0; i < res.data[1].chartData.length; i++) {
            nameListTian.push(res.data[1].chartData[i].name);
            valueListTian.push(res.data[1].chartData[i].value);
             amountListTian.push(res.data[1].chartData[i].amount);
             amount2ListTian.push(reqData.friendIndicators-res.data[1].chartData[i].amount);
          }
          this.getEchartsDataTianjin(nameListTian, valueListTian,amountListTian,amount2ListTian);
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },

    // 根据时间获取私域好友部分
    getCustomerDataByTime(reqData) {
      this.$api.getOverallDataByDate(reqData).then((res) => {
        if (res.result == "0") {
          console.log(res)
          this.priValueList=[]
          for (var i = 0; i < res.data.chartData.length; i++) {
            this.priNameList.push(res.data.chartData[i].name);
            this.priValueList.push(res.data.chartData[i].value);
          }
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    // 根据时间获取用户等级
    getUserLevel(reqData) {
      this.$api.getUserLevel(reqData).then((res) => {
        let chartsData = [];
        if (res.result == "0") {
          chartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("pie-echarts-person-level")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "用户等级",
            x: "left",
            y: "top",
            textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          legend: {
            orient: "horizontal",
            left: "0px",
            bottom: "40px",
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          color: ["#3399CC", "#FF4500", "#FFFF00", "#FFD700"], //黄 红 绿  蓝
          series: [
            {
              name: "用户等级",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["50%", "40%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                chartsData.length > 0
                  ? chartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    // 根据时间获取用户来源
    getUserSource(reqData) {
      this.$api.getUserSource(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            if (!r.name) {
              r.name = "其他";
            }
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("pie-echarts-person-source")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "用户来源",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"], //黄 红 绿  蓝
          legend: {
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            },
            orient: "horizontal",
            left: "0px",
            right: "0",
            bottom: "30px",
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
          },
          series: [
            {
              name: "用户来源",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["50%", "40%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "12",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                echartsData.length > 0
                  ? echartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    /**
     * @description: 查询下拉框发生变化
     * @author: L.R.H
     * @date: 2020-09-28 20:02:50
     */
    selectChange(val) {
      this.searchCockpit.year = new Date();
      this.searchCockpit.time = [];
    },
    change(index) {
      if (index == 0) {
        this.isPrimary = false;
        this.number = 0;
        this.fetchDataCustomer();
      } else if (index == 1) {
        this.isPrimary = true;
        //创新业务累计用户
        this.getBusinessIndicators();
        this.number = 1;
        this.fetchData();
      }
    },
    getParamsCustomer() {
      var reqData = {};
      switch (this.searchCockpitCus.select) {
        case "1":
          reqData.startDate =
            this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
            "-01-01";
          reqData.endDate =
            this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
            "-12-31";
          reqData.isCustom = "1";
          break;
        case "2":
          switch (this.searchCockpitCus.quarter) {
            case "1":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-01-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-03-31";
              break;
            case "2":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-04-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-06-30";
              break;
            case "3":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-07-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-09-30";
              break;
            case "4":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-10-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy") +
                "-12-31";
              break;
          }
          reqData.isCustom = "2";
          break;
        case "3":
          reqData.startDate =
            this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy-MM") +
            "-01";
          reqData.endDate =
            this.$util.dateFormat2(this.searchCockpitCus.year, "yyyy-MM") +
            "-31";
          reqData.isCustom = "3";
          break;
        case "0":
          if (this.searchCockpitCus.time.length === 0) {
            return this.$Message.warning("请选择时间");
          } else {
            if (this.searchCockpit.time[0] === "") {
              return this.$Message.warning("请选择时间");
            }
            var date1 = new Date(this.searchCockpitCus.time[0]);
            var date2 = new Date(this.searchCockpitCus.time[1]);
            var date =
              (date2.getTime() - date1.getTime()) /
              (1000 * 60 * 60 * 24); /*不用考虑闰年否*/
            if (date >= 15) {
              return this.$Message.warning("日期区间不能大于15天");
            }
            reqData.startDate = this.$util.dateFormat2(date1, "yyyy-MM-dd");
            reqData.endDate = this.$util.dateFormat2(date2, "yyyy-MM-dd");
          }
          reqData.isCustom = "0";
          break;
      }
      return reqData;
    },
    fetchDataCustomer(page = 1, pageSize = 10) {
      let reqData = this.getParamsCustomer();
      if(!reqData.startDate){
        return
      }
      //获取用户活跃度
      this.getEchartsDataPersonActivity(reqData);
      //获取用户等级
      this.getUserLevel(reqData);
      //获取用户来源
      this.getUserSource(reqData);
      //获客数据
      this.getCustomerData(reqData);
      //指标达成率
      this.getCustomerIndicators(reqData);
      //  私域用户中间部分
      this.getCustomerDataByTime(reqData);
    },
    //根据数组里面对象元素去重
    arrayUnique2(arr, name) {
      var hash = {};

      return arr.reduce(function (item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));

        return item;
      }, []);
    },
    // 时间参数
    getParams() {
      var reqData = {};
      switch (this.searchCockpit.select) {
        case "1":
          reqData.startDate =
            this.$util.dateFormat2(this.searchCockpit.year, "yyyy") + "-01-01";
          reqData.endDate =
            this.$util.dateFormat2(this.searchCockpit.year, "yyyy") + "-12-31";
          reqData.isCustom = "1";
          break;
        case "2":
          switch (this.searchCockpit.quarter) {
            case "1":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-01-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-03-31";
              break;
            case "2":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-04-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-06-30";
              break;
            case "3":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-07-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-09-30";
              break;
            case "4":
              reqData.startDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-10-01";
              reqData.endDate =
                this.$util.dateFormat2(this.searchCockpit.year, "yyyy") +
                "-12-31";
              break;
          }
          reqData.isCustom = "2";
          break;
        case "3":
          reqData.startDate =
            this.$util.dateFormat2(this.searchCockpit.year, "yyyy-MM") + "-01";
          reqData.endDate =
            this.$util.dateFormat2(this.searchCockpit.year, "yyyy-MM") + "-31";
          reqData.isCustom = "3";
          break;
        case "0":
          if (this.searchCockpit.time.length === 0) {
            return this.$Message.warning("请选择时间");
            return
          } else {
            if (this.searchCockpit.time[0] === "") {
              return this.$Message.warning("请选择时间");
            }
            console.log(this.searchCockpit.time[0])
            var date1 = new Date(this.searchCockpit.time[0]);
            var date2 = new Date(this.searchCockpit.time[1]);
             console.log(date1)
             console.log(this.$util.dateFormat2(date1, "yyyy-MM-dd"))
            var date =
              (date2.getTime() - date1.getTime()) /
              (1000 * 60 * 60 * 24); /*不用考虑闰年否*/
            if (date >= 15) {
              return this.$Message.warning("日期区间不能大于15天");
            }
            if(date1){
               reqData.startDate = this.$util.dateFormat2(date1, "yyyy-MM-dd");
            }
            if(date2){
               reqData.endDate = this.$util.dateFormat2(date2, "yyyy-MM-dd");
            }
             reqData.isCustom = "0";
             return reqData;
          }
          reqData.isCustom = "0";
          break;
      }
      console.log(reqData)
      return reqData;
    },
    getProductData(reqData) {
      this.$api.getProductData(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        if (res.result === "0") {
          //产品销售件数
          let saleNumberData = res.data.saleNumberDTO;
          //产品保费占比
          let premiumDTOData = res.data.premiumDTO;
          //产品交费年期占比
          let premiumPeriodDTOData = res.data.premiumPeriodDTO;
          saleNumberData.map((s, index) => {
            if (s.name == "总体") {
              this.saleNumberChart = s.chartData;
              s.chartData.map((inS) => {
                this.saleNumberChartName.push(inS.name);
              });
            }
            if (s.name == "天津") {
              this.columnsProduct = [
                {
                  title: "机构",
                  key: "j",
                  align: "center",
                  minWidth: 60,
                },
              ];
              let obj = { j: "天津" };
              s.chartData.map((inS, i) => {
                this.columnsProduct.push({
                  title: inS.name,
                  key: "x" + i,
                  align: "center",
                  minWidth: 60,
                });
                //天津的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductData.push(obj);
            }
            if (s.name == "北京") {
              let obj = { j: "北京" };
              s.chartData.map((inS, i) => {
                //北京的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductData.push(obj);
            }
            //数组去重
            this.columnsProductData = this.arrayUnique2(
              this.columnsProductData,
              "j"
            );
          });
          //
          premiumDTOData.map((s, index) => {
            if (s.name == "总体") {
              this.premiumChart = s.chartData;
              s.chartData.map((inS) => {
                this.premiumChartName.push(inS.name);
              });
            }
            if (s.name == "天津") {
              this.columnsProductPay = [
                {
                  title: "机构",
                  key: "j",
                  align: "center",
                  minWidth: 60,
                },
              ];
              let obj = { j: "天津" };
              s.chartData.map((inS, i) => {
                this.columnsProductPay.push({
                  title: inS.name,
                  key: "x" + i,
                  align: "center",
                  minWidth: 60,
                });
                //天津的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductPayData.push(obj);
            }
            if (s.name == "北京") {
              let obj = { j: "北京" };
              s.chartData.map((inS, i) => {
                //北京的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductPayData.push(obj);
            }
            //数组去重
            this.columnsProductPayData = this.arrayUnique2(
              this.columnsProductPayData,
              "j"
            );
          }); //
          premiumPeriodDTOData.map((s, index) => {
            if (s.name == "总体") {
              this.premiumPeriodChart = s.chartData;
              s.chartData.map((inS) => {
                this.premiumPeriodChartName.push(inS.name);
              });
            }
            if (s.name == "天津") {
              this.columnsProductYear = [
                {
                  title: "机构",
                  key: "j",
                  align: "center",
                  minWidth: 60,
                },
              ];
              let obj = { j: "天津" };
              s.chartData.map((inS, i) => {
                this.columnsProductYear.push({
                  title: inS.name,
                  key: "x" + i,
                  align: "center",
                  minWidth: 60,
                });
                //天津的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductYearData.push(obj);
            }
            if (s.name == "北京") {
              let obj = { j: "北京" };
              s.chartData.map((inS, i) => {
                //北京的一条数据添加到data里面
                if (inS.value) {
                  inS.value = inS.value + "%";
                }
                obj["x" + i] = inS.value;
              });
              this.columnsProductYearData.push(obj);
            }
            //数组去重
            this.columnsProductYearData = this.arrayUnique2(
              this.columnsProductYearData,
              "j"
            );
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        // 产品销售件数echart
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-product-sales")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option1 = {
          title: {
            text: "产品销售件数占比",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          legend: {
            orient: "vertical",
            right: "50px",
            top: "center",
            data: this.saleNumberChartName,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          series: [
            {
              name: "产品销售件数占比",
              type: "pie",
              radius: ["30%", "70%"],
              center: ["30%", "50%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: this.saleNumberChart,
            },
          ],
          color: [
            "#66CC99",
            "#FF4500",
            "#FFFF00",
            "#FF6600",
            "#FFD700",
            "#339900",
            "#3399CC",
          ],
        };
        businessSourcePersonLevel.setOption(option1);
        // 产品保费echart
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-product-pay")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option2 = {
          title: {
            text: "产品保费占比",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          color: [
            "#66CC99",
            "#FF4500",
            "#FFFF00",
            "#FF6600",
            "#FFD700",
            "#339900",
            "#3399CC",
          ],
          legend: {
            orient: "vertical",
            right: "10px",
            top: "center",
            data: this.premiumChartName,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
             itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          series: [
            {
              name: "产品保费占比",
              type: "pie",
              radius: ["30%", "70%"],
              center: ["30%", "53%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: this.premiumChart,
            },
          ],
        };
        businessSourcePersonLevel.setOption(option2);
        // 产品交费年期echart
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("echarts-product-sales-year")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option3 = {
          title: {
            text: "产品交费年期占比",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          legend: {
            orient: "vertical",
            right: "10px",
            top: "center",
            data: this.premiumPeriodChartName,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
             itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          color: ["#66CC99", "#3399CC", "#FFD700", "#FFFF00", "#FF4500"],
          series: [
            {
              name: "产品销售件数占比",
              type: "pie",
              radius: ["30%", "70%"],
              center: ["30%", "53%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: this.premiumPeriodChart,
            },
          ],
        };
        businessSourcePersonLevel.setOption(option3);
      });
    },
    fetchData() {
      let reqData = this.getParams();
      console.log(reqData)
      if(!reqData.startDate){
        return
      } else{
        //
      this.curYear1=reqData.startDate.slice(0,4)+'年新单件数'
      this.curYear2=reqData.startDate.slice(0,4)+'年新单保费（万元）'
      }
      //产品相关数据
      this.getProductData(reqData);
      //获取保单件数和新单保费
      this.getTotalByDate(reqData);
      //驾驶舱-各来源新单用户年龄分布
      this.getAgeBySource(reqData);
      //驾驶舱-各来源新单用户性别分布
      this.getSexBySource(reqData);
      //驾驶舱-各来源新单交费年期分布
      this.getPayPeriodBySource(reqData);
      //各来源产品分布
      this.getProductBySource(reqData);
      //各来源件均分布
      this.getAvgPremiumBySource(reqData);
      //保单客户来源占比
      this.getNewUserBySource(reqData);
      this.getNewPremiumBySource(reqData);
      //来源保单件数占比
      this.getNewPolicyBySource(reqData);
      //保单件数
      this.getRegionTotalByDate(reqData);
      //新单保费
      this.getRegionPremiumByDate(reqData);
      //各产品来源分布
      this.getSourceFromByProduct(reqData);
      //各产品年期分布
      this.getPayPeriodByProduct(reqData);
      //各产品均件保费分布
      this.getAvgPremiumByProduct(reqData);
      // 保险业务
      //各产品年龄分布
      this.getAgeByProduct(reqData);
      //各产品性别分布
      this.getSexByProduct(reqData);
    },
    reset() {
       this.yearShow = false; //年度是否可选择
      this.quarterShow = false; //季度是否可选择
      this.monthlyShow = false; //月度是否可选择
      this.startShow = false;
      this.endShow = false;
      this.searchCockpit = {
        select: "1",
        year: new Date(),
        quarter: "1",
        monthly: "",
        startDate: "",
        endDate: "",
      };
      this.fetchData();
    },
    resetCus() {
      this.yearShow = false; //年度是否可选择
      this.quarterShow = false; //季度是否可选择
      this.monthlyShow = false; //月度是否可选择
      this.startShow = false;
      this.endShow = false;
      this.searchCockpitCus = {
        select: "1",
        year: new Date(),
        quarter: "1",
        monthly: "",
        startDate: "",
        endDate: "",
      };
      this.fetchDataCustomer();
    },
    //用户活跃度
    getEchartsDataPersonActivity(reqData) {
      this.$api.getUserActivity(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        let nameList = [];
        if (res.data) {
          res.data.forEach((r) => {
            nameList.push(r.name);
          });
        } else {
          nameList = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("pie-echarts-person-activity")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "用户活跃度",
            x: "left",
            y: "top",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {d}%",
          },
          //3399CC
          color: ["#66CC99", "#3399CC", "#FFD700", "#FF4500", "#FFFF00"],
          legend: {
            orient: "horizontal",
            left: "0px",
            right: "0",
            bottom: "10px",
            data: nameList,
            formatter: function (name) {
              if (!name) return "";
              if (name.length > 8) {
                return name.slice(0, 8) + "...";
              } else {
                return name;
              }
            },
            tooltip: {
              show: true,
            },
             itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          series: [
            {
              name: "用户活跃度",
              type: "pie",
              radius: ["30%", "60%"],
              center: ["50%", "40%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data:
                echartsData.length > 0
                  ? echartsData
                  : [
                      {
                        name: "暂无数据",
                        value: 0,
                      },
                    ],
            },
          ],
        };
        businessSourcePersonLevel.setOption(option);
      });
    },
    //获客数据
    getCustomerData(reqData) {
      this.$api.getCustomerData(reqData).then((res) => {
        let echartsData = [];
        if (res.result == "0") {
          echartsData = res.data;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
        console.log(res.data)
        if (res.data) {
          if(res.data[0].chartData){
             this.xList=[];
             res.data[0].chartData.map((x)=>{
               this.xList.push(x.name);
           })
          }
          res.data.forEach((r) => {
            let indata = []
            this.legentList.push(r.name);
            r.chartData.forEach((i) => {
              indata.push(i.value);
            });
            r.data = indata;
            r.type = "bar";
            r.itemStyle = {
              normal: {
                show: false,
              },
            };
          });
        } else {
          data = ["暂无数据"];
        }
        var businessSourcePersonLevel = Echarts.init(
          document.getElementById("column-echarts-obtain-customer")
        );
        window.onresize = function () {
          businessSourcePersonLevel.resize();
        };
        businessSourcePersonLevel.clear();
        let option = {
          title: {
            text: "获客数据",
            top:"10px",
             textStyle: {
                    fontSize: 16,
                }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          color: ["#FFD700", "#66CC99", "#3399CC"],
          legend: {
            top:"20px",
            left:"center",
            data: this.legentList,
             itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
          },
          xAxis: [
            {
              type: "category",
              axisTick: { show: false },
              data:this.xList
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: res.data,
          /* [
            {
              name: "Forest",
              type: "bar",
              barGap: 0,
              data: [320, 332, 301, 334, 390],
              itemStyle: {
                normal: {
                  show: false,
                },
              },
            }
          ], */
        };

        businessSourcePersonLevel.setOption(option);
      });
    },
    //转化率（俱乐部）
    getEchartsDataConversionRate() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("funnel-echarts-conversion-rate")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "转化率（俱乐部）",
          top: 0,
          left: 0,
           textStyle: {
                    fontSize: 16,
                }
        },
        /* tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        }, */
        color: ["#006699", "#66CC99", "#FFD700", "#3399CC", "#FF4500"],
        series: [
          {
            name: "转化率（俱乐部）",
            type: "funnel",
            left: 0,
            top: 35,
            bottom: 10,
            width: "80%",
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: [
              { value: 20, name: "复购" },
              { value: 40, name: "出单" },
              { value: 60, name: "保险意向" },
              { value: 80, name: "参加活动" },
              { value: 100, name: "注册" },
            ],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //转化率（短视频平台）
    getEchartsDataConversionRateVideo() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("funnel-echarts-conversion-rate-video")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "转化率（短视频平台）",
          top: 0,
          left: 0,
           textStyle: {
                    fontSize: 16,
                }
        },
       /*  tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        }, */
        series: [
          {
            name: "转化率（短视频平台）",
            type: "funnel",
            left: 30,
            top: 35,
            bottom: 0,
            width: "60%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: [
              { value: 20, name: "复购" },
              { value: 40, name: "出单" },
              { value: 60, name: "保险意向" },
              { value: 80, name: "企业微信" },
              { value: 100, name: "粉丝" },
            ],
            color: ["#006699", "#66CC99", "#FFD700", "#3399CC", "#FF4500"],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //转化率（自然流量）
    getEchartsDataConversionNatureFlow() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("funnel-echarts-conversion-nature-flow")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "转化率（自然流量）",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        /* tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
        }, */
        color: ["#006699", "#66CC99", "#FFD700", "#3399CC", "#FF4500"],
       grid: {
          top: "0",
          left: "0",
          containLabel: true,
        },
        series: [
          {
            name: "转化率（自然流量）",
            type: "funnel",
            top: 35,
            width: "60%",
            bottom: 0,
            min: 0,
            x: 'center',
            z: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: [
              { value: 20, name: "" },
              { value: 40, name: "复购" },
              { value: 60, name: "出单" },
              { value: 80, name: "保险意向" },
              { value: 100, name: "注册" },
            ],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //总体
    getEchartsDataSummary(nameList, valueList,amountList,amount2List) {
      console.log(valueList)
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("pie-echarts-summary")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "总体",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          right: "25%",
          left: "0",
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          data: nameList,
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
            stack: '指标达成率',
            data: amountList,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#3399CC", "#66CC99", "#3399CC", "#FF4500"];
                  return colorList[0];
                },
                label: {
                  position: 'top',
                  show: true, //开启显示
                  textStyle: {
                    //数值样式
                    color:"rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          },
          {
            type: "bar",
            stack: '指标达成率',
            data: amount2List,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#FFD700", "#87CEFA", "#3399CC", "#FF4500"];
                  return colorList[1];
                },
                label: {
                  position:'top',
                  show: true, //开启显示
                  textStyle: {
                      color:"rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          },
           {
            type: "bar",
            stack: '指标达成率',
            data: valueList,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: "#fff",
                label: {
                  position: "0",
                  show: true, //开启显示
                  formatter: '     '+"{c}%",
                  textStyle: {
                    //数值样式
                      color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  }
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          }
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //北京分公司
    getEchartsDataBeijing(nameListBei, valueListBei,amountList,amount2List) {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("pie-echarts-beijing")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "北京分公司",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          right: "25%",
          left: "0",
          bottom: "0",
          containLabel: true,
        },
        xAxis: { show: false },
        yAxis: {
          data: nameListBei,
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
             stack: '指标达成率',
            data: amountList,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color:"#3399CC",
                label: {
                  show: true, //开启显示
                  position: "top",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
          {
            type: "bar",
            stack: '指标达成率',
            data: amount2List,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#FFD700", "#87CEFA", "#3399CC", "#FF4500"];
                  return colorList[1];
                },
                label: {
                  position:'top',
                  show: true, //开启显示
                  textStyle: {
                      color:"rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          },
           {
            type: "bar",
            stack: '指标达成率',
            data: valueListBei,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: "#fff",
                label: {
                  position: "0",
                  show: true, //开启显示
                  formatter: '     '+"{c}%",
                  textStyle: {
                    //数值样式
                      color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  }
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          }
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //天津分公司
    getEchartsDataTianjin(nameListTian, valueListTian,amountListTian,amount2ListTian) {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("pie-echarts-tainjin")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "天津分公司",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          right: "25%",
          left: "0",
          bottom: "0",
          containLabel: true,
        },
        xAxis: { show: false },
        yAxis: {
          data: nameListTian,
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
       series: [
          {
            type: "bar",
             stack: '指标达成率',
            data: amountListTian,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color:"#3399CC",
                label: {
                  show: true, //开启显示
                  position: "top",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
          {
            type: "bar",
            stack: '指标达成率',
            data: amount2ListTian,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#FFD700", "#87CEFA", "#3399CC", "#FF4500"];
                  return colorList[1];
                },
                label: {
                  position:'top',
                  show: true, //开启显示
                  textStyle: {
                      color:"rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          },
           {
            type: "bar",
            stack: '指标达成率',
            data: valueListTian,
            barWidth: 20,
            barCategoryGap: "50%",
            itemStyle: {
              normal: {
                color: "#fff",
                label: {
                  position: "0",
                  show: true, //开启显示
                  formatter: '     '+"{c}%",
                  textStyle: {
                    //数值样式
                      color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  }
                },
              },
              encode: {
                // Map the "amount" column to X axis.
                x: "",
                // Map the "product" column to Y axis
                y: "product",
              },
            },
          }
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //各产品年龄分布
    getAgeByProduct(reqData) {
      this.$api.getAgeByProduct(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataProductAge = [];
          this.productSeriesAge = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              this.productSeriesAge.push({ type: "bar" });
            });
          }
          this.sourceDataProductAge.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataProductAge.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      document.getElementById("column-echarts-product-ages").style.width =
        document.getElementById("cockpitList").clientWidth / 3.7 + "px";
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-product-ages")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各产品年龄分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0, itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            } },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "5%",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataProductAge,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.productSeriesAge,
        color: [
          "#66CC99",
          "#FF4500",
          "#FFFF00",
          "#FF6600",
          "#FFD700",
          "#339900",
          "#3399CC",
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //各产品性别分布
    getSexByProduct(reqData) {
      this.$api.getSexByProduct(reqData).then((res) => {
        if (res.result === "0") {
          //给legent赋值
          this.sourceDataProductSex = [];
          this.productSeriesSex = [];
          let innerSourceDataAge = ["product"];
          if (res.data[0]) {
            res.data[0].chartData.map((c) => {
              innerSourceDataAge.push(c.name);
              //有几个legent就有几个柱状图。
              this.productSeriesSex.push({ type: "bar" });
            });
          }
          this.sourceDataProductSex.push(innerSourceDataAge);
          res.data.map((r) => {
            //转换格式
            let arr = [];
            arr[0] = r.name;
            r.chartData.map((c) => {
              arr.push(c.value);
            });
            this.sourceDataProductSex.push(arr);
          });
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-product-sex")
      );
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      businessSourcePersonLevel.clear();
      let option = {
        title: {
          text: "各产品性别分布",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: { bottom: 0, left: 0, itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            } },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "15%",
          left: "5%",
          containLabel: true,
        },
        dataset: {
          source: this.sourceDataProductSex,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            rotate: 45, //倾斜度 -90 至 90 默认为0
            margin: 2,
          },
        },
        yAxis: {
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: this.productSeriesSex,
        color: [
          "#66CC99",
          "#FF4500",
          "#FFFF00",
          "#FF6600",
          "#FFD700",
          "#339900",
          "#3399CC",
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //外勤人员数指标-北京
    getEchartsOutBeijing() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("echarts-out-beijing")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "北京",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          bottom: "center",
          left: "center",
          containLabel: true,
        },
        series: [
          {
            name: "外勤人员数指标-北京",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 335, name: "年华会员" },
              { value: 310, name: "悦华会员" },
              { value: 135, name: "芳华会员" },
              { value: 1548, name: "年华会员" },
              { value: 123, name: "睿华会员" },
            ],
          },
        ],
      };
      businessSourcePersonLevel.setOption(option);
    },
    //外勤人员数指标-天津
    getEchartsOutTianjin() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("echarts-out-tainjin")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "天津",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          bottom: "center",
          left: "center",
          containLabel: true,
        },
        series: [
          {
            name: "外勤人员数指标-天津",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 335, name: "年华会员" },
              { value: 310, name: "悦华会员" },
              { value: 135, name: "芳华会员" },
              { value: 1548, name: "年华会员" },
              { value: 123, name: "睿华会员" },
            ],
          },
        ],
      };
      businessSourcePersonLevel.setOption(option);
    },
    //推广人员人均保单件数
    getEchartsDataExtensionInsurance() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-extension-insurance")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "推广人员人均保单件数",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          x: "auto",
          left: "0",
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            lineStyle: { color: "rgb(171, 171, 171)" },
          },
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          minInterval: 5,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
            data: [4, 8],
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["rgb(255,187,0)", "rgb(48,205,134)"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //开启显示
                  position: "right",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //推广人员人均新单保费（万元）
    getEchartsDataExtensionInsuranceNew() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-extension-insurance-new")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "推广人员人均新单保费（万元）",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          x: "auto",
          left: "0",
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            lineStyle: { color: "rgb(171, 171, 171)" },
          },
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          minInterval: 5,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
            data: [4, 8],
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["rgb(255,187,0)", "rgb(48,205,134)"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //开启显示
                  position: "right",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //推广人员人均收入
    getEchartsDataExtensionInsuranceIncome() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-extension-insurance-income")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "推广人员人均收入",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          left: "0",
          right: "40",
          containLabel: true,
        },
        xAxis: {
          min: 7000,
          max: 9000,
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            lineStyle: { color: "rgb(171, 171, 171)" },
          },
          minInterval: 500,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: [8500, 9300],
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["rgb(255,187,0)", "rgb(48,205,134)"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //开启显示
                  position: "right",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //推广人员人均长短险件数比
    getEchartsDataExtensionLongAndShortInsurance() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById(
          "column-echarts-extension-long-and-short-insurance"
        )
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "推广人员人均长短险件数比",
          x: "left",
          y: "top",
           textStyle: {
                    fontSize: 16,
                }
        },
        legend: {
          orient: "vertical",
          data: ["短险", "长险"],
          right: 20,
          top: 0,
           itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }
        },
        grid: {
          x: "auto",
          left: "0",
          containLabel: true,
        },
        xAxis: {
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
            lineStyle: { color: "rgb(171, 171, 171)" },
          },
          minInterval: 20,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            name: "短险",
            type: "bar",
            data: [40, 80],
          },
          {
            name: "长险",
            type: "bar",
            data: [40, 80],
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //客户经营相关数据表1
    getEchartsDataCustomerAbout1() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-customer-about1")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        legend: { bottom: 0, left: "center" , itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 5, // 设置间距
            textStyle: {
              fontSize: 11,
            }},
        tooltip: {},
        grid: {
          top: "15%",
          left: "0",
          containLabel: true,
        },
        dataset: {
          source: [
            ["product", "人均拉新人数", "人均召回人数"],
            ["北京", 430, 280],
            ["天津", 350, 200],
          ],
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
          },
          // 网格线
          splitLine: {
            show: false,
          },
          // 坐标轴线刻度
          axisTick: {
            show: false,
          },
          //坐标轴线
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          minInterval: 50,
        },
        series: [
          { type: "bar", barWidth: 10 },
          { type: "bar", barWidth: 10 },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //用户1对1被沟通占比
    getEchartsDataExtensionOneToOne() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-extension-one-to-one")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "用户1对1被沟通占比",
          x: "left",
          y: "top",
            textStyle: {
                    fontSize: 16,
                }
        },
        grid: {
          x: "auto",
          left: "0",
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          min: 0,
          max: 100,
          minInterval: 20,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
            data: [30, 40],
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["rgb(255,187,0)", "rgb(48,205,134)"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //开启显示
                  position: "right",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
    //推广人员客户服务满意度
    getEchartsDataExtensionCustomerSatisfy() {
      var businessSourcePersonLevel = Echarts.init(
        document.getElementById("column-echarts-extension-customer-satisfy")
      );
      businessSourcePersonLevel.clear();
      window.onresize = function () {
        businessSourcePersonLevel.resize();
      };
      let option = {
        title: {
          text: "推广人员客户服务满意度",
          x: "left",
          y: "top",
        },
        grid: {
          x: "auto",
          left: "0",
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgb(171, 171, 171)",
          },
          min: 0,
          max: 100,
          minInterval: 20,
          nameTextStyle: {
            color: "rgb(171, 171, 171)",
            fontSize: 14,
          },
        },
        yAxis: {
          data: ["天津", "北京"],
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
        },
        series: [
          {
            type: "bar",
            data: [98, 99],
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["rgb(255,187,0)", "rgb(48,205,134)"];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true, //开启显示
                  position: "right",
                  textStyle: {
                    //数值样式
                    color: "rgb(171, 171, 171)",
                    fontSize: 14,
                  },
                },
              },
            },
            encode: {
              // Map the "amount" column to X axis.
              x: "",
              // Map the "product" column to Y axis
              y: "product",
            },
          },
        ],
      };

      businessSourcePersonLevel.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.right-card {
  height: 16.1rem;
  margin-bottom: 15px;
}
.left-card {
  height: 16.1rem;
  margin-bottom: 15px;
}
.dt {
  margin-bottom: 20px !important;
}
.left {
  width: 25%;
  height: 660px;
  float: left;
}
.middle {
  width: 45%;
  height: 720px;
  float: left;
}
.right {
  width: 30%;
  height: 660px;
  float: left;
}
.left-product-pic {
  width: 33.33%;
  height: 620px;
  float: left;
  padding-right: 12px;
}
.right-product-pic {
  width: 65%;
  height: 620px;
  float: left;
  padding-left: 3px;
}
.left-product {
  width: 35%;
  height: 920px;
  float: left;
  padding-right: 12px;
}
.middle-product {
  width: 30%;
  height: 920px;
  float: left;
  padding-left: 4px;
  padding-right: 4px;
}
.right-product {
  width: 35%;
  height: 920px;
  float: left;
  padding-left: 10px;
}
.user-card {
  margin-bottom: 15px;
}
.user-card-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 18px;
}
.user-card-content {
  font-size: 16px;
}
.user-card-content-title1 {
  color: rgb(171, 171, 171);
  margin-bottom: 6px;
}
.user-card-content-title2 {
  color: rgb(24, 119, 255);
  font-size: 20px;
  font-weight: 500;
}
.innerFilter {
  margin-bottom: 20px;
}
.innerFilter .ivu-form-item {
  margin-bottom: 0;
}
.user-card-content-title22 {
  color: rgb(171, 171, 171);
}
.area-chart {
  margin-top: 15px;
}
.barYear {
  margin-top: 10px;
}
#buttonYear1 {
  margin-right: 0px;
}
#buttonYear2 {
  margin-right: 0px;
}
#buttonYear3 {
  margin-right: 0px;
}
.buttonYear {
  margin-right: 0px;
}
.uabutton {
  margin-right: 0px;
}
// #cockpitList {
//   background-color: rgb(242, 242, 242);
//   padding-left: 15px;
//   padding-right: 15px;
// }
</style>
