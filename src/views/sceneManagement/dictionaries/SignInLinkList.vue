<template>
    <div id="contentType">
        <Form ref="formValidate"
              :model="formValidate"
              inline
              :label-width="110"
              class="mb-10"
              style="width: 100%"
        >

            <FormItem prop="fileName" label="链接名称">
                <Input
                        placeholder="请输入链接名称"
                        style="width: 185px"
                        v-model="formValidate.linkName"
                />
            </FormItem>
            <Button
                    @click="search(1)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-right: 5px"
            >查询
            </Button>
            <div class="add-btns">
                <Button type="primary" style="margin-left:10px" @click="addLink">新增</Button>
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
                <FormItem label="链接名称" prop="linkName">
                    <Input v-model="formData.linkName"/>
                </FormItem>
                <FormItem label="链接地址" prop="linkUrl">
                    <Input v-model="formData.linkUrl"/>
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>

<script>
    export default {
        name: "ContentTypeList",
        methods: {
            addLink() {
                this.title = "新增";
                this.formData ={};
                this.modal = true;
            }, updateBtn(row) {
                this.title = "编辑";
                this.formData.linkName = row.linkName;
                this.formData.linkUrl = row.linkUrl;
                this.modal = true;
            },
            changePage(page) {
                search(page);
            }, ok() {
                this.modal = false;
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
                title:'',
                modal:false,
                tableList: [
                    {linkName: "百度", linkUrl: "https://www.baidu.com/"},
                    {linkName: "阿里巴巴", linkUrl: "https://www.Alibaba.com/"},
                ],
                total: 0,
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '80'
                    }, {
                        title: "链接名称",
                        align: "center",
                        key: "linkName"
                    }, {
                        title: "链接地址",
                        align: "center",
                        key: "linkUrl"
                    }, {
                        title: "操作",
                        align: "center",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "编辑"},
                                    on: {
                                        click: () => {
                                            this.updateBtn(params.row);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    domProps: {innerHTML: "删除"},
                                    on: {
                                        click: () => {
                                            this.downloadFile(params.row);
                                        }
                                    }
                                }),
                            ])
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