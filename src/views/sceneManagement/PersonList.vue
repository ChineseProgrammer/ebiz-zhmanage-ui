<template>
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
</template>

<script>
    export default {
        name: "PersonList",
        methods:{
            changePage(page){
                search(page);
            }
        },
        data() {
            return {
                tableloading: false,
                formValidate: {
                    page: 1,
                    pageSize: 10,
                },
                total:0,
                ruleFormValidate: {},
                tableList:[
                    {actTypeName:"哇卡卡"}
                ],
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '60'
                    }, {
                        title: "称呼",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "手机号",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "同行儿童数",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "来源",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "代理人",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "代理人机构",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "备注",
                        align: "center",
                        key: "actTypeName"
                    }, {
                        title: "操作",
                        align: "center",
                        render: (h, params) => {
                            var btn = [h('Button', {
                                props: {type: 'primary', size: 'small'},
                                domProps: {innerHTML: "编辑"},
                                on: {
                                    click: () => {
                                        this.updateBtn(params.row);
                                    }
                                }
                            })]
                            return h('div', btn);
                        }
                    }
                ]
            }
        }
        ,

    }
</script>

<style scoped>

</style>