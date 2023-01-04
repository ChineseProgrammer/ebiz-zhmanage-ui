<template>
    <div id="rule-set-list" class="only-content">
        <!-- 顶部筛选 -->
        <div class="header">
            <div class="left">
                <Form ref="formInline" :model="params" inline :label-width="90">
                    <FormItem prop="position" label="职级">
                        <Select v-model="params.position" style="width:200px">
                            <Option value="str1">理财顾问</Option>
                            <Option value="str2">理财主任</Option>
                            <Option value="str3">理财经理</Option>
                            <Option value="str4">理财总监</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="category" label="基本法类型">
                        <Select v-model="params.category" style="width:200px">
                            <Option value="category1">佣金</Option>
                            <Option value="category2">职级变动</Option>
                            <Option value="category3">组织</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div class="right">
                <Button @click="demoSearch()" class="ivu-btn ivu-btn-primary" style="margin-right:5px">查询</Button>
                <Button @click="reset()">重置</Button>
            </div>
        </div>
        <!-- 列表 -->
        <Row>
            <Col span="11">
                <primaryTable
                        :columns="columns"
                        :data="tableList"
                        ref="primaryTable"
                        :total="total"
                        @on-change="changePage"
                        :loading="tableloading"
                        :current.sync="params.pageNum"
                ></primaryTable>
            </Col>
            <Col span="11" offset="2">
                <h4 style="margin-bottom: 5px">计算说明</h4>
                <primaryTable
                        :columns="columns1"
                        :show-header="false"
                        :data="values"
                        ref="primaryTable"
                        :total="total"
                        @on-change="changePage"
                        :loading="tableloading"
                        :current.sync="params.pageNum"
                        :isPage="false"
                        size="small"
                ></primaryTable>
                <h4 style="margin-bottom: 5px;margin-top: 5px">{{baseTitle}}</h4>
                <Form v-if="formShow" ref="formValidate" :model="inputData" :label-width="230" label-position="right">
                    <FormItem label="对象" prop="min">
                        <Select style="width: 200px" v-model="inputData.object">
                            <Option value="1">寿险首年度保费</Option>
                            <Option value="2">续年度保费</Option>
                            <Option value="3">寿险标保</Option>
                            <Option value="4">被增员人完成当月寿险标保</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="运算符" prop="min">
                        <Select style="width: 200px" v-model="inputData.const">
                            <Option value="1">+</Option>
                            <Option value="2">-</Option>
                            <Option value="3">&times;</Option>
                            <Option value="4">&divide;</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系数" prop="min">
                        <Select style="width: 200px" v-model="inputData.ratio">
                            <Option value="1">费用系数</Option>
                            <Option value="2">寿险首年度保费比率</Option>
                            <Option value="3">续年度佣金率</Option>
                            <Option value="4">绩效奖比率</Option>
                            <Option value="5">增员辅导奖比率</Option>
                        </Select>
                        <Input v-model="inputData.value" style="width: 100px;margin-left: 10px" placeholder="请输入系数" />
                    </FormItem>
                    <!--                <Row>-->
                    <!--                    <Col span="22" offset="1" class="model_html">-->
                    <!--   -->
                    <!--&lt;!&ndash;                        <FormItem label="险种名称" prop="riskName">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.riskName" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <FormItem label="累计保费" prop="premium">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.premium" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <FormItem label="佣金" prop="commission">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.commission" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <Table border :columns="columnsChild" :data="formData.serviceChargeList"></Table>&ndash;&gt;-->
                    <!--                    </Col>-->
                    <!--                </Row>-->
                </Form>
                <Form v-if="formShow1" ref="formValidate" :model="inputData" :label-width="230" label-position="right">
                    <FormItem label="对象" prop="min">
                        <Select style="width: 200px" v-model="inputData.object">
                            <Option value="1">寿险首年度保费</Option>
                            <Option value="2">续年度保费</Option>
                            <Option value="3">寿险标保</Option>
                            <Option value="4">被增员人完成当月寿险标保</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="运算符1" prop="min">
                        <Select style="width: 200px" v-model="inputData.const">
                            <Option value="1">+</Option>
                            <Option value="2">-</Option>
                            <Option value="3">&times;</Option>
                            <Option value="4">&divide;</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系数1" prop="min">
                        <Select style="width: 200px" v-model="inputData.ratio">
                            <Option value="1">费用系数</Option>
                            <Option value="2">寿险首年度保费比率</Option>
                            <Option value="3">续年度佣金率</Option>
                            <Option value="4">绩效奖比率</Option>
                            <Option value="5">增员辅导奖比率</Option>
                        </Select>
                        <Input v-model="inputData.value1" style="width: 100px;margin-left: 10px" placeholder="请输入系数1" />
                    </FormItem>
                    <FormItem label="运算符2" prop="min">
                        <Select style="width: 200px" v-model="inputData.const1">
                            <Option value="1">+</Option>
                            <Option value="2">-</Option>
                            <Option value="3">&times;</Option>
                            <Option value="4">&divide;</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系数2" prop="min">
                        <Select style="width: 200px" v-model="inputData.ratio1">
                            <Option value="1">费用系数</Option>
                            <Option value="2">寿险首年度保费比率</Option>
                            <Option value="3">续年度佣金率</Option>
                            <Option value="4">绩效奖比率</Option>
                            <Option value="5">增员辅导奖比率</Option>
                        </Select>
                        <Input v-model="inputData.value2" style="width: 100px;margin-left: 10px" placeholder="请输入系数2" />
                    </FormItem>
                    <!--                <Row>-->
                    <!--                    <Col span="22" offset="1" class="model_html">-->
                    <!--   -->
                    <!--&lt;!&ndash;                        <FormItem label="险种名称" prop="riskName">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.riskName" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <FormItem label="累计保费" prop="premium">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.premium" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <FormItem label="佣金" prop="commission">&ndash;&gt;-->
                    <!--&lt;!&ndash;                            <Input v-model="formData.commission" />&ndash;&gt;-->
                    <!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
                    <!--&lt;!&ndash;                        <Table border :columns="columnsChild" :data="formData.serviceChargeList"></Table>&ndash;&gt;-->
                    <!--                    </Col>-->
                    <!--                </Row>-->
                </Form>
                <primaryTable v-if="tabShow"
                        :columns="columns2"
                        :data="values1"
                        ref="primaryTable"
                        :total="total"
                        @on-change="changePage"
                        :loading="tableloading"
                        :current.sync="params.pageNum"
                        :isPage="false"
                        size="small"
                ></primaryTable>
<!--                <Form v-if="formShow" ref="formValidate" :model="inputData" label-position="left">-->
<!--                            <FormItem :label="baseTitle" prop="min">-->
<!--                                <Input style="width: 200px" v-model="inputData.value" />-->
<!--                            </FormItem>-->
<!--                    &lt;!&ndash;                <Row>&ndash;&gt;-->
<!--                    &lt;!&ndash;                    <Col span="22" offset="1" class="model_html">&ndash;&gt;-->
<!--                    &lt;!&ndash;   &ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        <FormItem label="险种名称" prop="riskName">&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                            <Input v-model="formData.riskName" />&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        </FormItem>&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        <FormItem label="累计保费" prop="premium">&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                            <Input v-model="formData.premium" />&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        </FormItem>&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        <FormItem label="佣金" prop="commission">&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                            <Input v-model="formData.commission" />&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        </FormItem>&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;&lt;!&ndash;                        <Table border :columns="columnsChild" :data="formData.serviceChargeList"></Table>&ndash;&gt;&ndash;&gt;-->
<!--                    &lt;!&ndash;                    </Col>&ndash;&gt;-->
<!--                    &lt;!&ndash;                </Row>&ndash;&gt;-->
<!--                </Form>-->
            </Col>
        </Row>
        <div class="first-btn" style="overflow: hidden">
            <!--            <Row>-->
            <!--            <div style="text-align: left;float: left">-->
            <!--                &lt;!&ndash;                    <Button v-if="!parameter" @click="addRules" type="primary">&ndash;&gt;-->
            <!--                &lt;!&ndash;                        <Icon type="md-add"/>&ndash;&gt;-->
            <!--                &lt;!&ndash;                        添加规则&ndash;&gt;-->
            <!--                &lt;!&ndash;                    </Button>&ndash;&gt;-->
            <!--                &lt;!&ndash;                    <Button v-else @click="addRulesNot" type="primary">&ndash;&gt;-->
            <!--                &lt;!&ndash;                        <Icon type="md-add"/>&ndash;&gt;-->
            <!--                &lt;!&ndash;                        {{$context.$t('ruleList.AddRules')}}&ndash;&gt;-->
            <!--                &lt;!&ndash;                    </Button>&ndash;&gt;-->
            <!--                <Button @click="saveRules" type="dashed" style='margin-left:30px'>{{$context.$t('preservation')}}-->
            <!--                </Button>-->
            <!--            </div>-->
            <div style="text-align: right;float: right">
                <Button @click="executivePromotionRules" type="primary" style='margin-left:30px'>
                    <Icon type="md-add" />
                    保存
                </Button>
                <Button @click="executivePromotionRules" type="primary" style='margin-left:30px'>
                    <Icon type="ios-cloud-download-outline" />
                    执行
                </Button>
                <!--                <Button @click="" type="primary" style='margin-left:30px'>-->
                <!--                    <Icon type="ios-cloud-download-outline" />-->
                <!--                    导出规则-->
                <!--                </Button>-->
                <!--                <Button @click="saveRules" type="dashed" style='margin-left:30px'>{{$context.$t('preservation')}}-->
                <!--                </Button>-->
            </div>
            <!--            </Row>-->
        </div>
        <Modal v-model="modalForm" title="编辑" :draggable="false" :loading="true" :closable="false" :width="700">

            <Form ref="formValidate" :model="modalFormData" :rules="ruleValidate" :label-width="100" label-position="left">
                <Row>
                    <Col span="16" offset="3">
                        <FormItem label="范围较小值" prop="min">
                            <Input v-model="modalFormData.min" />
                        </FormItem>
                        <FormItem label="范围较大值" prop="max">
                            <Input v-model="modalFormData.max" />
                        </FormItem>
                        <FormItem label="结果" prop="max">
                            <Input v-model="modalFormData.result" />
                        </FormItem>
                        <FormItem label="对象" prop="riskType">
                            <Select disabled v-model="modalFormData.content">
                                <Option value="寿险标保">寿险标保</Option>
                                <Option value="2">健康险</Option>
                                <Option value="3">医疗险</Option>
                                <Option value="4">重疾险</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
<!--                <Row>-->
<!--                    <Col span="22" offset="1" class="model_html">-->
<!--   -->
<!--&lt;!&ndash;                        <FormItem label="险种名称" prop="riskName">&ndash;&gt;-->
<!--&lt;!&ndash;                            <Input v-model="formData.riskName" />&ndash;&gt;-->
<!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
<!--&lt;!&ndash;                        <FormItem label="累计保费" prop="premium">&ndash;&gt;-->
<!--&lt;!&ndash;                            <Input v-model="formData.premium" />&ndash;&gt;-->
<!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
<!--&lt;!&ndash;                        <FormItem label="佣金" prop="commission">&ndash;&gt;-->
<!--&lt;!&ndash;                            <Input v-model="formData.commission" />&ndash;&gt;-->
<!--&lt;!&ndash;                        </FormItem>&ndash;&gt;-->
<!--&lt;!&ndash;                        <Table border :columns="columnsChild" :data="formData.serviceChargeList"></Table>&ndash;&gt;-->
<!--                    </Col>-->
<!--                </Row>-->
            </Form>
            <div slot="footer">
                <Button type="primary" @click="doAdd">确定</Button>
                <Button type="primary" @click="close">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelForm" title="编辑" :draggable="false" :loading="true" :closable="false" :width="700">

            <Form ref="formValidate" :model="modelFormData" :rules="ruleValidate" :label-width="100" label-position="left">
                <Row>
                    <Col span="16" offset="3">
                        <FormItem label="对象" prop="min">
                            <Select v-model="modelFormData.obj">
                                <Option value="寿险标保">寿险标保</Option>
                                <Option value="晋升考核期">晋升考核期</Option>
                                <Option value="行为考察">行为考察</Option>
                                <Option value="综合出勤率">综合出勤率</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="条件" prop="max">
                            <Select v-model="modelFormData.rule">
                                <Option value="为">为</Option>
                                <Option value="不为">不为</Option>
                                <Option value="大于">大于</Option>
                                <Option value="等于">等于</Option>
                                <Option value="小于">等于</Option>
                                <Option value="大于等于">大于等于</Option>
                                <Option value="小于等于">小于等于</Option>
                                <Option value="包含">包含</Option>
                                <Option value="不包含">不包含</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="值" prop="max">
                            <Input v-model="modelFormData.value" />
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="doAdd">确定</Button>
                <Button type="primary" @click="close">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import rules from '../../../../mock/rule.json'
    export default {
        data() {
            return {
                formShow1 : false,
                formShow : false,
                modelForm : false,
                modelFormData : {
                    "obj" : "",
                    "rule" : "",
                    "value" : ""
                },
                tabShow : false,
                inputData : {},
                ruleCode : "",
                modalForm : false,
                formData: {
                    name: ""
                },
                params: {
                    pageSize: 10,
                    pageNum: 1,
                    position:"",
                    category:"",
                },
                oldModalFormData : {},
                tableloading: false,
                ruleValidate: {
                    name: [
                        this.$util.rules.required("请输入名称"),
                        this.$util.rules.max(100, "输入限制100位")
                    ]
                },
                searchParams: {},

                left: 24, //左侧表格比例
                tableList: [
                ],
                baseTitle : "",
                total: 0,
                ids: [], //选中的id
                values:[{
                    "baseName" : "寿险首年度佣金(FYC) = 寿险首年度保费 ✖ 寿险首年度保费比率"
                }],
                values1:[],
                modalFormData : {
                    min : "",
                    max : "",
                    content: "",
                    result : ""
                },
                columns1:[
                    {
                        title: "基本法名称",
                        key: "content",
                        align: "center",
                    },
                ],
                columns2Last:{
                    title: "操作",
                    slot: "action",
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.toBaseDetail(params.row)
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            // h(
                            //     "Button", {
                            //         props: {
                            //             type: "primary",
                            //             size: "small"
                            //         },
                            //         style: {
                            //             marginRight: "5px"
                            //         },
                            //         on: {
                            //             click: () => {
                            //                 this.del(params.row.id);
                            //             }
                            //         }
                            //     },
                            //     "删除"
                            // )
                        ]);
                    }
                },
                columns2Back:[
                    {
                        title: "范围较小值",
                        key: "min",
                        align: "center"
                    },
                    {
                        title: "内容",
                        key: "content",
                        align: "center"
                    }
                    ,
                    {
                        title: "范围较大值",
                        key: "max",
                        align: "center"
                    }
                    ,
                    {
                        title: "结果",
                        key: "result",
                        align: "center"
                    }
                ],
                columns2:[
                    {
                        title: "范围较小值",
                        key: "min",
                        align: "center"
                    },
                    {
                        title: "内容",
                        key: "content",
                        align: "center"
                    }
                    ,
                    {
                        title: "范围较大值",
                        key: "max",
                        align: "center"
                    }
                    ,
                    {
                        title: "结果",
                        key: "result",
                        align: "center"
                    },{
                        title: "操作",
                        slot: "action",
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.toBaseDetail(params.row)
                                            }
                                        }
                                    },
                                    "编辑"
                                ),
                                // h(
                                //     "Button", {
                                //         props: {
                                //             type: "primary",
                                //             size: "small"
                                //         },
                                //         style: {
                                //             marginRight: "5px"
                                //         },
                                //         on: {
                                //             click: () => {
                                //                 this.del(params.row.id);
                                //             }
                                //         }
                                //     },
                                //     "删除"
                                // )
                            ]);
                        }
                    }
                ],
                columnLast : {
                    title: "操作",
                    slot: "action",
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            this.toBaseDetail(params.row)
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            // h(
                            //     "Button", {
                            //         props: {
                            //             type: "primary",
                            //             size: "small"
                            //         },
                            //         style: {
                            //             marginRight: "5px"
                            //         },
                            //         on: {
                            //             click: () => {
                            //                 this.del(params.row.id);
                            //             }
                            //         }
                            //     },
                            //     "删除"
                            // )
                        ]);
                    }
                },
                //表格
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: "序号",
                        type: 'index',
                        width: 80,
                        align: "center"
                    },

                    {
                        title: "基本法名称",
                        key: "baseName",
                        align: "center"
                    },
                    // {
                    //     title: "公司机构代码",
                    //     key: "jdCompanyCode",
                    //     align: "center",
                    // },
                    // {
                    //     title: "结算日期",
                    //     key: "calculationDate",
                    //     align: "center"
                    // },
                    // {
                    //     title: "成交保单数量",
                    //     key: "successPolicyNum",
                    //     align: "center"
                    // },
                    // {
                    //     title: "总保费",
                    //     key: "premium",
                    //     align: "center"
                    // },
                    // {
                    //     title: "总佣金",
                    //     key: "calculationCommission",
                    //     align: "center"
                    // },
                    {
                        title: "操作",
                        slot: "action",
                        align: "center",
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small"
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.toDetail(params.row)
                                            }
                                        }
                                    },
                                    "查看"
                                )
                            ]);
                        }
                    }
                ],
                userInfo:JSON.parse(window.sessionStorage.getItem('userInfo')),
                importModal:false,
                file:null
            };
        },
        created: function() {
            // this.search(1);
        },
        mounted: function() {},
        watch: {},
        methods: {
            executivePromotionRules () {
                let self = this;
                this.$api.executivePromotionRules(self.ruleCode).then(res => {
                    if (res.respCode == 0) {
                        this.$Message.success("执行成功");
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            close() {
                this.modalForm = false;
                this.modelForm = false;
            },
            doAdd() {
                this.modalForm = false;
                this.modelForm = false;
            },
            delBase() {

            },
            toBaseDetail(row) {
                if (row.obj) {
                    this.modelForm = true;
                    this.modelFormData = row;
                } else {
                    this.modalForm = true;
                    this.modalFormData = row;
                }
            },
            searchtableList(){
                this.tableListEnd = this.tableList.filter(order => {
                    return Object.keys(this.tableListItem).reduce((flag,item) => {
                        if(!flag){
                            return false
                        }else{
                            return this.tableListItem[item].trim() ? String (order[item]).indexOf(this.tableListItem[item]) !== -1 :   true
                        }
                    },true)
                })
                this.total = this.tableListEnd.length;

            },
            demoSearch() {
                if (this.params.category != "category1" && this.params.category != "category2") {
                    this.$Message.error("暂无数据")
                    return;
                }

                if (this.params.position == "str1") {
                    if (this.params.category != "category1") {
                        if (rules.dataUp.columns.length < 5) {
                            rules.dataUp.columns.push(this.columnLast);
                        }
                        this.columns2 = rules.dataUp.columns;
                        this.tableList = rules.dataUp.records;
                        this.total = rules.dataUp.total;
                        this.ruleCode = rules.dataUp.ruleCode;
                    } else {
                        if (this.columns2Back.length < 5) {
                            this.columns2Back.push(this.columns2Last);
                        }
                        this.columns2 = this.columns2Back;
                        this.tableList = rules.data1.records;
                        this.total = rules.data1.total;
                        this.ruleCode = rules.data1.ruleCode;
                    }
                } else if (this.params.position == "str2") {
                    if (this.params.category != "category1") {
                        if (rules.dataHeadUp.columns.length < 5) {
                            rules.dataHeadUp.columns.push(this.columnLast);
                        }
                        this.columns2 = rules.dataHeadUp.columns;
                        this.tableList = rules.dataHeadUp.records;
                        this.total = rules.dataHeadUp.total;
                        this.ruleCode = rules.dataHeadUp.ruleCode;
                    } else {
                        if (this.columns2Back.length < 5) {
                            this.columns2Back.push(this.columns2Last);
                        }
                        this.columns2 = this.columns2Back;
                        this.tableList = rules.data.records;
                        this.total = rules.data.total;
                        this.ruleCode = rules.data.ruleCode;
                    }
                } else if (!this.params.position) {
                    this.$Message.error("暂未开放")
                } else if (this.params.position == "str3") {
                    if (this.params.category != "category1") {
                        if (rules.dataHeadUp.columns.length < 5) {
                            rules.dataHeadUp.columns.push(this.columnLast);
                        }
                        this.columns2 = rules.dataHeadUp.columns;
                        this.tableList = rules.dataHeadUp.records;
                        this.total = rules.dataHeadUp.total;
                        this.ruleCode = rules.dataHeadUp.ruleCode;
                    } else {
                        if (this.columns2Back.length < 5) {
                            this.columns2Back.push(this.columns2Last);
                        }
                        this.columns2 = this.columns2Back;
                        this.tableList = rules.dataNew.records;
                        this.total = rules.dataNew.total;
                        this.ruleCode = rules.dataNew.ruleCode;
                    }
                } else {
                    this.$Message.error("请选择职级")
                }
            },
            // 获得列表
            search(page) {
                this.params.page = page ? page : 1;
                //注意：不能使用直接使用 this.params，因为根据 key-value 处理后的查询数据 下次查询还会存在
                let { pageSize, jdCompanyName,calculationDate } = this.params;
                let searchData = {
                    pageSize: pageSize,
                    pageNum: page,
                    data:{
                        jdCompanyName:jdCompanyName,
                        calculationDate:calculationDate,
                        calculationType:1
                    }
                };
                if (this.params.key) {
                    searchData[this.params.key] = this.params.value;
                }
                // console.log(searchData);
                this.getList(searchData);
                this.searchParams = searchData;
            },
            //获取列表
            getList(searchData) {
                this.tableloading = true;
                //调用接口
                this.$api.getPremiumPage(searchData).then(res => {
                    if (res.respCode == 0 || res.result - 0 == 0) {
                        this.tableList = res.data.records;
                        this.total = res.data.total;
                    } else {
                        this.$Message.error(res.message);
                    }
                    this.tableloading = false;
                });
            },
            //重置
            reset() {
                this.params.jdCompanyName = "";
                this.params.pageNum = "1";

                this.search(1);
            },
            //换页
            changePage(page) {
                this.params.pageNum = page;
                this.searchParams.pageNum = page;
                this.getList(this.searchParams);
            },
            toDetail(row){
                this.inputData = {}
                let title = "计算方法"
                if (row.rules && row.rules.length > 0) {
                    this.formShow = false;
                    this.tabShow = true;
                } else {
                    this.formShow = true;
                    this.tabShow = false;
                    title = "";
                }

                if (row.inputData) {
                    this.inputData = row.inputData;
                    this.formShow = true;
                }

                if (row.baseName == "增员辅导奖") {
                    this.formShow = false;
                    this.formShow1 = true;
                } else {
                    this.formShow1 = false;
                }

                if (row.type == "check") {
                    title = "晋升方法"
                }
                this.values1 = row.rules;
                this.values = row.contents;
                this.baseTitle = row.baseTitle+title;
            }
        }
    };
</script>

<style lang='less'>
    #rule-set-list {
        .header {
            display: -webkit-flex;
            display: flex;
            justify-content: space-around;
            .left {
                width: 0px;
                flex-grow: 1;
            }
            .right {
                width: auto;
            }
        }
        .first-btn {
            margin: 20px 1px 30px;
        }
    }
</style>
