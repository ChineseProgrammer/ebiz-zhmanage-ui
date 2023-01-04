<template>
    <div id="contentType">
        <Form ref="formValidate"
              :model="formValidate"
              inline
              :label-width="110"
              class="mb-10"
              style="width: 100%"
        >
            <FormItem prop="fileName" label="活动内容">
                <Input
                        placeholder="请输入查询内容"
                        style="width: 185px"
                        v-model="formValidate.fileName"
                />
            </FormItem>
            <Button
                    @click="search(1)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-right: 5px"
            >查询
            </Button>
            <div class="add-btns">
                <Button type="primary" style="margin-left:10px" @click="addApplication">新增</Button>
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
               :width="500" :mask-closable="false" @on-ok="ok">
            <Form
                    ref="formData"
                    :model="formData"
                    :label-width="130"
            >
                <FormItem label="活动内容" prop="activityTypeName">
                    <Select
                            placeholder="选择活动类型"
                            style="width: 200px; margin-right: 5px"
                            @on-change="selectChange"
                    >
                        <Option value="1">拓客</Option>
                        <Option value="2">升温</Option>
                        <Option value="0">其他</Option>
                    </Select>
                </FormItem>
                <FormItem label="活动人数" prop="actPersonNum">
                    <Input v-model="formData.actPersonNum"/>
                </FormItem>
                <FormItem label="活动时间" prop="actTime">
                    <Input v-model="formData.actTime"/>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="formData.remark"/>
                </FormItem>
            </Form>
        </Modal>
        <div style="display: none">
            <Upload :action="actionUpload"
                    multiple
                    :show-upload-list="false"
                    :before-upload="handleBeforeUpload"
                    accept=".xlsx"
                    :on-success="(value) => handleSuccess(value)"
                    :headers="actionUploadHeaders">
                <Button icon="ios-cloud-upload-outline" id="desc1" :loading="uploadLoading" @click="handleUploadFile">
                    上传文件
                </Button>
            </Upload>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ContentTypeList",
        modal:true,
        title:"",
        methods: {
            addApplication() {
                this.title = "新增";
                this.modal = true;
            }, changePage(page) {
                search(page);
            }, ok() {
                this.modal = false;
            }, selectChange() {

            }, uploadBtn(row) {
                // IE
                if (document.all) {
                    document.getElementById("desc1").click();
                }
                // 其它浏览器
                else {
                    var e = document.createEvent("MouseEvents");
                    e.initEvent("click", true, true);
                    document.getElementById("desc1").dispatchEvent(e);
                }
            }, handleSuccess(value) {

            }, handleUploadFile() {

            }, uploadLoading() {

            }, actionUploadHeaders() {

            }, actionUpload() {

            }, handleBeforeUpload() {

            }

        },
        data() {
            return {
                tableloading: false,
                formValidate: {
                    page: 1,
                    pageSize: 10,
                },
                formData: {},
                modal: false,
                title: "新增",
                tableList: [
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 0,
                        isUpload1: 0,
                        state: 0,
                        remark: "参加活动,赠送铁锅"
                    },
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 1,
                        isUpload1: 1,
                        state: 0,
                        remark: "参加活动,赠送铁锅"
                    },
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 1,
                        isUpload1: 1,
                        state: 0,
                        remark: "参加活动,赠送铁锅"
                    },
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 1,
                        isUpload1: 1,
                        state: 1,
                        remark: "参加活动,赠送铁锅"
                    },
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 1,
                        isUpload1: 1,
                        state: 1,
                        remark: "参加活动,赠送铁锅"
                    },
                    {
                        actTypeName: "拓客",
                        actPersonNum: 20,
                        actTime: "2022-12-09 23:34:56",
                        isUpload: 1,
                        isUpload1: 1,
                        state: 1,
                        remark: "参加活动,赠送铁锅"
                    },
                ],
                total: 0,
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '80'
                    }, {
                        title: "活动内容",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "活动人数",
                        align: "center",
                        key: "actPersonNum"
                    }, {
                        title: "活动名单",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state == 0) {
                                if (row.isUpload == 0)
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "名单导入"},
                                        on: {
                                            click: () => {
                                                this.uploadBtn(params.row);
                                            }
                                        }
                                    }))
                                if (row.isUpload == 1) {
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "重新导入"},
                                        on: {
                                            click: () => {
                                                this.uploadBtn(params.row);
                                            }
                                        }
                                    }))
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "查看"},
                                        on: {
                                            click: () => {
                                                this.updateBtn(params.row);
                                            }
                                        }
                                    }))
                                }
                            } else {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "查看"},
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
                        title: "活动时间",
                        align: "center",
                        key: "actTime"
                    }, {
                        title: "审批附件",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            var row = params.row;
                            if (row.state == 0) {
                                if (row.isUpload == 0)
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "上传审批资料"},
                                        on: {
                                            click: () => {
                                                this.uploadBtn(params.row);
                                            }
                                        }
                                    }))
                                if (row.isUpload == 1) {
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "重新上传"},
                                        on: {
                                            click: () => {
                                                this.uploadBtn(params.row);
                                            }
                                        }
                                    }))
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "查看"},
                                        on: {
                                            click: () => {
                                                this.updateBtn(params.row);
                                            }
                                        }
                                    }))
                                }
                            } else {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "查看"},
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
                        title: "状态",
                        align: "center",
                        key: "state",
                        render: (h, params) => {
                            if (params.row.state == 0) {
                                return h('div', "草稿");
                            } else {
                                return h('div', "已提交");
                            }
                        }
                    }, {
                        title: "备注",
                        align: "center",
                        key: "remark"
                    }, {
                        title: "操作",
                        align: "center",
                        render: (h, params) => {
                            var arry = [];
                            if (params.row.state == 1) {
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "查看详情"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }));
                            }
                            if (params.row.state == 0) {
                                if (params.row.isUpload1 == 1 && params.row.isUpload == 1) {
                                    arry.push(h('Button', {
                                        props: {type: 'primary', size: 'small'},
                                        domProps: {innerHTML: "提交"},
                                        on: {
                                            click: () => {
                                                this.updateBtn(params.row);
                                            }
                                        }
                                    }));
                                }
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "编辑"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }));
                                arry.push(h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "删除"},
                                    on: {
                                        click: () => {
                                            this.del(params.row);
                                        }
                                    }
                                }))
                            }
                            return h('div', arry)
                        }
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