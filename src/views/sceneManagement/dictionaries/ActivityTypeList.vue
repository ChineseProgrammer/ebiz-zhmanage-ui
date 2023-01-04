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

            <FormItem prop="fileName" label="活动类型">
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
               :width="500" :mask-closable="false" @on-ok="ok">
            <Form
                    ref="formData"
                    :model="formData"
                    :label-width="130"
            >
                <FormItem label="活动类型" prop="name">
                    <Input v-model="formData.name"/>
                </FormItem>
            </Form>

        </Modal>
    </div>
</template>

<script>
    export default {
        name: "ContentTypeList",
        methods: {
            addActivity() {
                this.title = "新增";
                this.formData.name ='';
                this.formData.id ='';
                this.modal = true;
            }, updateBtn(row) {
                this.title = "编辑";
                this.formData.name = row.name;
                this.formData.id = row.id;
                this.modal = true;
            },
            changePage(page) {
                search(page);
            }, ok() {
                if(this.formData.id){
                    this.$api.updateActivity(this.formData).then(res => {
                        this.search(1);
                    });
                }else{
                    this.$api.addActivity(this.formData).then(res => {
                        this.search(1);
                    });
                }
                this.modal = false;
            }, search(page){
                this.formValidate.page = page ? page : 1;
                this.$api.activityTypeList(this.formValidate).then(res => {
                    this.tableList = res.list;
                    this.total = res.total;
                    this.tableloading = false;
                });
            }, delete(id){
                this.$api.deleteActivityById({'id':id}).then(res=>{
                    this.search();
                });
            }
        },
        created(){
            this.search(1);
        },
        data() {
            return {
                tableloading: false,
                formValidate: {
                    page: 1,
                    pageSize: 10,
                },
                modal: false,
                title: '新增',
                ruleFormValidate: {},
                tableList: [
                    {name: "拓客"},
                    {name: "升温"},
                ],
                formData: {name: ""},
                total: 0,
                columns: [
                    {
                        type: "index",
                        title: "序号",
                        align: "center",
                        width: '80'
                    }, {
                        title: "类型名称",
                        align: "center",
                        key: "name"
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
                                            this.delete(params.row.id);
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