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

            <FormItem prop="name" label="内容类型">
                <Input
                        placeholder="请输入类型名称"
                        style="width: 185px"
                        v-model="formValidate.name"
                />
            </FormItem>
            <Button
                    @click="search(1)"
                    class="ivu-btn ivu-btn-primary"
                    style="margin-right: 5px"
            >查询
            </Button>
            <div class="add-btns">
                <Button type="primary" style="margin-left:10px" @click="toTreeMenu">内容类型目录</Button>
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
        <Modal v-model.trim="contentTypeTree" :title="title" :loading="true" :closable="false"
               :width="500" :mask-closable="false" @on-ok="ok">
            <tree-content-type-vue :getNewNumber="5" ref="treeVue"></tree-content-type-vue>
        </Modal>
    </div>
</template>

<script>
    import treeContentTypeVue from './tree.vue';

    export default {
        name: "contentTypeList",
        components: {treeContentTypeVue},
        created() {
            this.search(1);
        },
        methods: {
            changePage(page) {
                this.search(page);
            },
            ok() {
                this.contentTypeTree = false;
            },
            toTreeMenu() {
                this.contentTypeTree = true;
            },search(page){
                this.formValidate.page = page ? page : 1;
                this.$api.contentTypeList(this.formValidate).then(res => {
                    this.tableList = res.list;
                    this.total = res.total;
                    this.tableloading = false;
                });
            }
        },
        data() {
            return {
                tableloading: false,
                formValidate: {
                    page: 1,
                    pageSize: 10,
                },
                ruleFormValidate: {},
                tableList: [
                    {oneLevelName:"非遗",twoLevelName:"团扇"},
                    {oneLevelName:"非遗",twoLevelName:"兔爷"},
                    {oneLevelName:"其他",twoLevelName:"扎染"}
                ],
                total: 0,
                contentTypeTree: false,
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '80'
                    }, {
                        title: "一级类型",
                        align: "center",
                        key: "oneLevelName"
                    }, {
                        title: "二级类型",
                        align: "center",
                        key: "twoLevelName",
                    }, {
                        title: "操作",
                        align: "center",
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {props: {type: 'primary',size: 'small'},
                                    domProps: {innerHTML: "编辑"},
                                    on: {click: () => {
                                            this.downloadFile(params.row);
                                        }
                                    }
                                }),
                                h('Button', {props: {type: 'primary',size: 'small'},
                                    domProps: {innerHTML: "删除"},
                                    on: {click: () => {
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
.add-btns{
    margin-bottom: 10px;
}
</style>