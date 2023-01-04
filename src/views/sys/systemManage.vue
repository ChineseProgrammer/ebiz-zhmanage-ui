/*
* @Author: masiwei
* @Date: 2019-06-25 13:23:50
* @Last Modified by: masiwei
* @Last Modified time:
*/
<template>
    <div id="menu_index" class="only-content">
        <router-view></router-view>
        <Form ref="params" :model="params" :label-width="100">
            <Row>
                <Col span="7">
                    <FormItem :label="$t('rolename')" prop="roleName">
                        <Input v-model="params.roleName"
                               :placeholder="$t('pleaseEnter')+$t('blankOrSpace')+$t('rolename')" :maxlength="50"/>
                    </FormItem>
                </Col>
            </Row>
        </Form>

        <div style="margin-left: 90px">
            <Row>
                <Col span="12">
                    <Button style="margin:10px" type="dashed" icon="ios-search" @click="searchMo">{{$t('query')}}
                    </Button>
                    <Button style="margin:10px" type="primary" icon="md-refresh" @click="resetMo">{{$t('reset')}}
                    </Button>
                </Col>
                <Col span="12" class="text-right">
                    <Button type="dashed" @click="addRole()" style="margin:10px 3px 10px 10px"
                            icon="ios-cloud-download-outline">导出
                    </Button>
                </Col>
            </Row>
        </div>
        <!--<Button v-has='"role:add"' type="info" @click="addRole()" style="margin-botttom:10px">新建</Button>-->
        <div style="margin-top: 10px">
            <Row>
                <Col :span="left">
                    <div>
                        <primaryTable
                                class="wholeTable"
                                :current='params.page'
                                :columns="columns"
                                :data="tableList"
                                :total='total'
                                :pageSize='params.pageSize'
                                ref='primaryTable'
                                @on-edit='editRole'
                                @on-del='delRole'
                                @on-change='changePage'
                                @on-set='setPermission'
                        >
                        </primaryTable>
                    </div>
                </Col>
                <Col :span="right" style="border-left:1px solid #d9d9d9" v-if="right>0">
                    <Card dis-hover>
                        <div slot="title" class="right-title">
                            <p style="color: #fff!important;">{{$t('permissionsettings')}}： {{roleName}}</p>
                            <Icon type="ios-backspace-outline" @click="close"/>
                        </div>
                        <p>
                            {{$t('route.menu')}}:
                        </p>
                        <Tree :data="treeMenuData" :check-strictly='false' show-checkbox ref='treeMenu'
                              style="color: #fff!important;"></Tree>
                        <Button type='primary' style='margin-right:5px' size='small' @click='savePermission'>
                            {{$t('preservation')}}
                        </Button>
                        <Button type='info' size='small' @click="close">{{$t('cancel')}}</Button>
                    </Card>

                </Col>
            </Row>
        </div>


    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import roleForm from './form/roleForm'

    export default {
        data() {
            return {
                params: {
                    roleName: "",
                    pageSize: 10,
                    systemType: 0,
                    page: 1
                },
                left: 24,//左侧表格比例
                right: 0,
                treeMenuData: [],
                roleName: '',
                roleId: '',
                tableList: [
                    {"name": "核心系统", "code": "10001", "data": "已同步2300条保单数据到销管系统", "time": "2019/9/20"},
                    {"name": "核心系统", "code": "10001", "data": "已同步2100条保单数据到销管系统", "time": "2019/9/19"},
                    {"name": "SAP系统", "code": "10002", "data": "已同步35条人员信息数据到销管系统", "time": "2019/8/1"},
                    {"name": "SAP系统", "code": "10002", "data": "已同步40条人员信息数据到销管系统", "time": "2019/9/30"},
                    {"name": "财务系统", "code": "10003", "data": "已同步300条财务信息数据到销管系统", "time": "2019/9/30"},
                    {"name": "财务系统", "code": "10003", "data": "已同步300条财务信息数据到销管系统", "time": "2019/8/30"},
                    {"name": "SAP系统", "code": "10002", "data": "已同步430条人员信息数据到销管系统", "time": "2019/9/30"},
                    {"name": "财务系统", "code": "10003", "data": "已同步1300条财务信息数据到销管系统", "time": "2019/9/30"},
                    {"name": "财务系统", "code": "10003", "data": "已同步3030条财务信息数据到销管系统", "time": "2019/8/30"},
                    {"name": "核心系统", "code": "10001", "data": "已同步2300条保单数据到销管系统", "time": "2019/7/20"},
                ],
                total: 10,


            }
        },
        created: function () {
            console.log(this.$t('edit'));
            // this.getRoleList();

        },
        mounted: function () {


        },
        computed: {
            columns(vue) {
                return [
                    {
                        title: "系统名称",
                        key: 'name',
                        slot: "alarm"//添加可实现表格edit
                    },
                    {
                        title: "系统编码",
                        key: 'code',
                        slot: "alarm",
                    },
                    {
                        title: "同步数据",
                        key: 'data',
                        align: 'center',
                    },
                    {
                        title: "同步时间",
                        key: 'time',
                        align: 'center',
                    }
                ]

            }

        },
        watch: {},
        methods: {
            //分页
            changePage(page) {
                this.params.page = page;
                if (page == 2) {
                    this.tableList = [
                        {"name": "SAP系统", "code": "10302", "data": "已同步35条人员信息数据到销管系统", "time": "2019/8/1"},
                        {"name": "SAP系统", "code": "10052", "data": "已同步40条人员信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "14003", "data": "已同步300条财务信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "10003", "data": "已同步11300条财务信息数据到销管系统", "time": "2019/8/30"},
                        {"name": "SAP系统", "code": "10002", "data": "已同步430条人员信息数据到销管系统", "time": "2019/9/19"},
                    ]
                } else {
                    this.tableList = [
                        {"name": "核心系统", "code": "10001", "data": "已同步2300条保单数据到销管系统", "time": "2019/9/20"},
                        {"name": "核心系统", "code": "10001", "data": "已同步2100条保单数据到销管系统", "time": "2019/9/19"},
                        {"name": "SAP系统", "code": "10002", "data": "已同步35条人员信息数据到销管系统", "time": "2019/8/1"},
                        {"name": "SAP系统", "code": "10002", "data": "已同步40条人员信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "10003", "data": "已同步300条财务信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "10003", "data": "已同步300条财务信息数据到销管系统", "time": "2019/8/30"},
                        {"name": "SAP系统", "code": "10002", "data": "已同步430条人员信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "10003", "data": "已同步1300条财务信息数据到销管系统", "time": "2019/9/30"},
                        {"name": "财务系统", "code": "10003", "data": "已同步3030条财务信息数据到销管系统", "time": "2019/8/30"},
                        {"name": "核心系统", "code": "10001", "data": "已同步2300条保单数据到销管系统", "time": "2019/7/20"},
                    ];
                }
                // this.getRoleList();
            },
            //查询
            searchMo() {
                this.params.pageNum = 1;
                this.current = 1;
                // this.getRoleList();
            },
            // 重置
            resetMo() {
                //this.$refs['formValidate'].resetFields();
                this.params.roleName = null;
                this.params.pageNum = 1;
                this.params.pageSize = 10;
                this.getRoleList();
            },
            /*
               获得列表

             */
            getRoleList() {
                this.$api.getRoleList(this.params).then(res => {

                    if (res.respCode == 0 || (res.result) - 0 == 0) {
                        this.total = res.data.count;
                        this.tableList = res.data.list;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            changePage(page) {
                this.params.page = page;
                this.getRoleList();
            },

            //新增
            addRole(formData) {
                // let props={},title=this.$t('newBuilt')+this.$t('roles');
                // props.menuList=this.treeData;
                // var $tot={
                //     t_rolename:this.$t('rolename'),
                //     t_remark:this.$t('remarks')
                // }
                // props.Formt=$tot;
                // if(formData)
                // {
                //     props.formValidate=formData;
                //     title=this.$t('edit')+this.$t('roles');
                //
                // }
                // let self=this;
                // var params={
                //     self:this,
                //     title:title,
                //     width:600,//默认600
                //     props:props,
                //     form:roleForm,//弹窗中的表单
                //     success:(res)=>{
                //         this.getRoleList();
                //         this.changePage(1)
                //     },
                //     cancel:()=>{
                //     }
                // }
                // this.$util.openModelForm(params,this);
            },
            //编辑
            editRole(row) {
                let {roleName, id, remark} = row;
                let params = {
                    roleName: roleName,
                    id: id,
                    remark: remark
                }
                this.addRole(params)
            },
            //删除
            delRole(row) {
                this.$util.confirmDialog(this, this.$t('confirm'), this.$t('confirm') + this.$t('delete') + this.$t('roles') + ':' + `${row.roleName}`, self => {
                    self.$api.delRole({roleIds: [row.id], systemType: 0}).then(res => {
                        if (res.result == 0) {
                            self.$Message.success(this.$t('delete') + this.$t('success'));
                            self.getMenuList();
                            self.getRoleList();
                        } else {
                            self.$Message.error(res.message);
                        }
                    })

                })
            },
            // 设置权限
            setPermission(row) {
                this.left = 16;
                this.right = 0;
                var self = this;
                setTimeout(function () {
                    self.right = 8
                }, 500)
                this.roleName = row.roleName;
                this.roleId = row.id;
                this.getRoleMenu()
            },
            /* 保存权限
             */
            savePermission() {

                let menu = this.$refs.treeMenu.getCheckedAndIndeterminateNodes();
                // if(menu.length==0)
                // {
                //     this.$Message.error('请选择菜单！');
                //     return;
                // }
                let params = {
                    authIds: [],
                    roleId: this.roleId,
                    systemType: 0,
                    userId: sessionStorage.userId
                };
                for (let item of menu) {
                    params.authIds.push(item.id);
                }
                this.$util.confirmDialog(this, '确认', '确认添加角色权限', self => {
                    self.$api.setAuthsForRole(params).then(res => {
                        if (res.result == 0 || res.respCode == 0) {
                            self.$Message.success('保存成功');
                            self.close();
                        } else {
                            self.$Message.error(res.resultMessage ? res.resultMessage : res.message);
                        }
                    })
                })
            },
            close() {
                this.left = 24;
                this.right = 0;
                this.roleName = '';
            },
            getRoleMenu() {
                this.$api.queryAuthsByRole({roleId: this.roleId, systemType: 0}).then(res => {
                    if (res.respCode == 0 || res.result == 0) {
                        let roleMenuId = {};
                        for (let item of res.data) {
                            roleMenuId[item.id + ''] = true;
                        }
                        this.getMenuList(roleMenuId);
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },

            getMenuList(roleMenuId) {
                this.$api.getMenuList({systemType: 0}).then(res => {
                    if (res.respCode == 0 || (res.result) - 0 == 0) {
                        this.handleMenuList(res.data, roleMenuId);
                        this.treeMenuData = res.data;
                    } else {
                        this.$Message.error(res.message);
                    }
                })
            },
            //如果返回的事树形数据
            handleMenuList(data, roleMenuId) {
                for (let item of data) {
                    item.title = item.menuName;
                    item.typeName = item.type == 0 ? "菜单" : '按钮'
                    item.expand = true;
                    if (roleMenuId[item.id + '']) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                    if (item.children) {
                        this.handleMenuList(item.children, roleMenuId)
                    }
                }
            },

        },
        filters: {},
        components: {
            roleForm
        }
    }

</script>

<style lang='less'>
    #menu_index {
        .ivu-col {
            transition: width 0.5s;
            -moz-transition: width 0.5s;; /* Firefox 4 */
            -webkit-transition: width 0.5s;; /* Safari 和 Chrome */
            -o-transition: width 0.5s;; /* Opera */
        }

        .right-title {
            display: -webkit-flex;
            display: flex;
            justify-content: space-around;

            .ivu-card {
                width: 100%;
                overflow: hidden;
            }

            i {
                font-size: 18px;
                cursor: pointer;

                &:hover {
                    color: #2d8cf0;
                }
            }

            p {
            }
        }

    }
</style>

