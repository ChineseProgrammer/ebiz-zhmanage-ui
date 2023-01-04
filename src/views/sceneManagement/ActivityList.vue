<template>
    <div id="contentType">
        <Form ref="formValidate"
              :model="formValidate"
              :rules="ruleFormValidate"
              inline
              :label-width="110"
              class="mb-10"
              style="width: 100%"
        >
            <FormItem prop="fileName" label="场次名称">
                <Input
                        placeholder="请输入场次名称"
                        style="width: 185px"
                        v-model="formValidate.fileName"
                />
            </FormItem>
            <FormItem prop="fileName" label="场次时间">
                <DatePicker
                        transfer
                        style="width: 200px"
                        type="daterange"
                        v-model="dateList"
                        @on-change="onDatePickerChange"
                        placement="bottom-end"
                        placeholder="请选择时间阶段"
                ></DatePicker>
            </FormItem>
            <FormItem prop="fileName" label="内容类型">
                <Select clearable
                        filterable
                        placeholder="内容类型"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem prop="fileName" label="活动类型">
                <Select clearable
                        filterable
                        placeholder="活动类型"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem prop="fileName" label="机构">
                <Select clearable
                        filterable
                        placeholder="机构"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem prop="fileName" label="状态">
                <Select clearable
                        filterable
                        placeholder="状态"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <Button
                    @click="search(1)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-right: 5px"
            >查询
            </Button>
            <div class="add-btns">
                <Button type="primary" style="margin-left:10px" @click="addActivity">新增</Button>
            </div>
        </Form>
        <primaryTable
                :columns="columns"
                :data="tableList"
                ref="primaryTable"
                :total="total"
                :pageSize="formValidate.pageSize"
                @on-change="changePage"
                @on-page-size-change="(pageSize) => {formValidate.pageSize = pageSize;search();}"
                :loading="tableloading"
                :current.sync="formValidate.page"
        ></primaryTable>
        <Modal v-model.trim="modal" :title="title" :loading="true" :closable="false"
               :width="1000" :mask-closable="false">
            <person-list></person-list>
            <div slot="footer">
                <Button type="primary" @click="doAdd">提交</Button>
                <Button type="primary" @click="doAdd">回退</Button>
                <Button  @click="close">关闭</Button>
            </div>
        </Modal>
        <Modal v-model.trim="activityModal" :title="title" :loading="true" :closable="false"
               :width="500" :mask-closable="false" @on-ok="ok">
            <activity/>
        </Modal>
    </div>
</template>

<script>
    import PersonList from "./PersonList";
    import Activity from "./Activity";
   var tableData  = [{actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "0", isUpload: 0, isUpload1: 0}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "1", isUpload: 0, isUpload1: 0}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "2", isUpload: 0, isUpload1: 0}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "3", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "4", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "5", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "6", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "7", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "8", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "9", isUpload: 1, isUpload1: 1}, {actName: "场次名称", actTime: "2022-12-07 23:23:23", contentTypeName: "团扇", actType: "拓客", orgName: "北京分公司", state: "10", isUpload: 1, isUpload1: 1},];
   // tableData = tableData.filter(item=>item.state == '1')
    export default {
        name: "ActivityList",
        components: {PersonList, Activity},
        methods: {
            addActivity() {
                this.title = "新增";
                this.activityModal = true;
            }, changePage(page) {
                search(page);
            }, ok() {
                this.activityModal = false;
            },showModal(){
                this.modal = true;
            }

        },
        data() {
            return {
                tableloading: false,
                formValidate: {
                    page: 1,
                    pageSize: 10,
                },
                states: new Map([['0', '预约'], ['1', '名单待核对'], ['2', '名单已核对'], ['3', '名单待分配'], ['4', '名单已分配']
                    , ['5', '名单待审核']
                    , ['6', '名单已审核']
                    , ['7', '活动待启动']
                    , ['8', '活动执行中']
                    , ['9', '资料已上传']
                    , ['10', '活动已完成']]),
                modal: false,
                activityModal: false,
                formData: {},
                title: "名单列表",
                ruleFormValidate: {},
                tableList: tableData,
                total: 0,
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '60'
                    }, {
                        title: "场次名称",
                        align: "center",
                        key: "actName"
                    }, {
                        title: "场次时间",
                        align: "center",
                        width: 140,
                        key: "actTime"
                    }, {
                        title: "内容类型",
                        align: "center",
                        width: 80,
                        key: "contentTypeName"
                    }, {
                        title: "活动类型",
                        align: "center",
                        width: 80,
                        key: "actType"
                    }, {
                        title: "机构",
                        align: "center",
                        width: 100,
                        key: "orgName"
                    }, {
                        title: "状态",
                        align: "center",
                        width: 100,
                        render: (h, params) => {
                            var row = params.row;
                            return h('div', this.states.get(row.state));
                        }
                    }, {
                        title: "操作",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state == 0) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "编辑"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "删除"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state > 0) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "详情"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }


                            return h('div', arry);
                        }
                    }, {
                        title: "用户名单",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state < 2) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "导入"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state ==2) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "下发"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state == 3) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "分配"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state == 5) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "审核"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state >= 1 && row.state != 3 && row.state != 5) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "查看"},
                                    on: {
                                        click: () => {
                                            this.showModal(params.row);
                                        }
                                    }
                                }))
                            }
                            return h('div', arry)
                        }
                    }, {
                        title: "签到配置",
                        align: "center",
                        width: 200,
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state == 6) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "配置"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state > 6) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "下载"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }))
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "复制链接"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            return h('div', arry)
                        }
                    }, {
                        title: "活动资料",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state == 8 || row.state == 9) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "上传"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            if (row.state == 9 || row.state == 10) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "查看"},
                                    on: {
                                        click: () => {
                                            this.uploadBtn(params.row);
                                        }
                                    }
                                }))
                            }
                            return h('div', arry)
                        }
                    }, {
                        title: "备注",
                        align: "center",
                        key: "fileName"
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .add-btns {
        margin-bottom: 10px;
    }
</style>