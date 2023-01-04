<template>
    <div>
        <div class="header">
            <div class="left">
                <Form ref="formValidate" :model="params" inline :label-width="100">
                     <FormItem label="用户账号" prop="userName">
                        <Input v-model="params.userName " placeholder="请输入用户账号"></Input>
                    </FormItem>
                    <FormItem prop="phoneNo" label="联系电话">
                        <Input placeholder="请输入联系电话" v-model="params.phoneNo" />
                    </FormItem>
                    <FormItem prop="realName" label="负责人姓名">
                        <Input placeholder="请输入负责人姓名" v-model="params.realName" />
                    </FormItem>
                    <FormItem prop="status" label="状态">
                        <Select clearable style="width:162px" placeholder="请选择状态" v-model="params.status">
                            <Option value="0">启用</Option>
                            <Option value="1">停用</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="partmentId" label="所属公司机构">
                        <Select clearable filterable style="width:162px" placeholder="请输入所属公司机构" v-model="params.partmentId">
                            <Option
                                v-for="item in companyList"
                                :value="item.id"
                                :key="item.id"
                            >{{item.deptName}}</Option>
                            </Select>
                    </FormItem>
                </Form>
            </div>
        </div>
       <div class="m-table">
           <div class="mb-10">
               <Row>
                   <Col span="12" >
                   <Button type="primary" @click="addUser()" class="marginRight3"      style="margin-bottom: 5px;">{{$t('newBuilt')}}</Button>
                    <!-- <Button type="error" @click="delUser()"      style="margin-bottom: 5px;">{{$t('batchdeletion')}}</Button> -->
                   </Col>
                   <i-col class="float-right">
                       <Button  type="primary" @click="search(1)"  style="margin-left:10px">{{$t('query')}}</Button>
                       <Button type="default" @click="resertMo">{{$t('reset')}}</Button>
                   </i-col>
               </Row>
           </div>
           <div>
               <primaryTable
                       :columns="columns" :data="tableList"
                       :total='total'
                       :pageSize='params.pageSize'
                       ref='primaryTable'
                       @on-edit='editUser'
                       @on-del='delUser'
                       @on-selection-change='handleSelect'
                       @on-change='changePage'
                       class="wholeTable"
               >
               </primaryTable>
           </div>

           <!--<urlTable :configure='configure' ref='signTable'> </urlTable>-->
       </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
      import userForm from './form/userForm'
import { parse } from 'path';


    export default {
        data() {
            return {
                // configure:{
                //     //查询方法
                //     url:'search',
                //     //查询参数
                //     params:{
                //         pageSize:2,
                //         page:1,
                //         realName:"",
                //     },
                //     //是否分页 （对应接口访问参数名称）
                //     page:{
                //         page:'page',
                //         pageSize:'pageSize'
                //     },
                //     //接口访问成功后的回调
                //     callback:(res)=>{
                //
                //         if(res.respCode==0||(res.result)-0==0)
                //         {
                //             for(let item of res.data.list)
                //             {
                //                 item.typeDesc=item.type==0?'肿瘤类':'非肿瘤类';
                //                 item.isContactDesc=item.isContact==1?'是':'否';
                //             }
                //             return {
                //                 list:res.data.list,//表格数据
                //                 total:res.data.count
                //             }
                //         }
                //         else{
                //             this.$Message.error(res.message);
                //         }
                //
                //     },
                //     //表头
                //     columns:[
                //         {
                //             type: 'selection',
                //             width: 60,
                //             align: 'center'
                //         },
                //
                //         {
                //             title: '报名编号',
                //             key: 'serialNumber',
                //             slot:"alarm"//添加可实现表格edit
                //         },
                //
                //         {
                //             title: '项目名称',
                //             key: 'projectName',
                //             slot:"alarm"//添加可实现表格edit
                //         },
                //         {
                //             title: '姓名',
                //             slot:"alarm",
                //             width:100,
                //             key: 'name'
                //         },
                //         {
                //             title: '类型',
                //             width:100,
                //             slot:"alarm",
                //             key: 'typeDesc'
                //         },
                //         {
                //             title: '联系电话',
                //             slot:"alarm",
                //             key: 'mobileNo'
                //         },
                //         {
                //             title: '所在城市',
                //             slot:"alarm",
                //             key: 'city'
                //         },
                //         {
                //             title: '是否联系',
                //             slot:"alarm",
                //             width:90,
                //             key: 'isContactDesc'
                //         },
                //         {
                //             title: '报名时间',
                //             slot:"alarm",
                //             sortable: true,
                //             key: 'signUpTime'
                //         },
                //         {
                //             title: '操作',
                //             slot: 'action',
                //             width: 150,
                //             align: 'center',
                //             selfBtn:[
                //                 {name:"编辑",method:"on-edit",type:"primary",permission:'sign:edit'},
                //                 {name:"查看",method:"on-check",permission:'sign:check'},
                //
                //             ]
                //         }
                //     ]
                // },

                params:{
                    phoneNo:'',
                    userName:'',
                    realName:'',
                    status:"",
                    partmentId:"",
                    pageSize:10,
                    page:1,
                },
                depTreeData:[],
                total:0,
                 selectIds:[],


                tableList:[],
                roleList:[],
                companyList:[],
                searchData:[]



            }
        },
        created: function () {
            this.search(1);
            //调用部门
            // this.getOrgDepList();
            this.getRoleAllList();
            this.getCompanyList();
            this.getCompanyEnableList()

        },
        mounted:function()
        {


        },
        computed:{
            columns(vue){
                return [
                    // {
                    //     type:'selection',
                    //     align:'center',
                    //     width:60
                    // },
                    {
                        type:'index',
                        align:'center',
                        width:80,
                        title:"序号"
                    },
                    {
                        title: "模板主键",
                        align:'center',
                        // slot:"alarm",
                        key: 'id'
                    },
                    {
                        title: "模板名称",
                        align:'center',
                        // slot:"alarm",
                        key: 'name'
                    },
                    {
                        title: "流程标识",
                        // slot:"alarm",
                        align:'center',
                        key: 'category'
                    },
                    {
                        title: "部署主键",
                        // slot:"alarm",
                        align:'center',
                        key: 'deploymentId'
                    },
                    // {
                    //     title: "备注",
                    //     align:'center',
                    //     // slot:"alarm",
                    //     key: 'metaInfo.description'
                    // },
                    {
                        title: "创建时间",
                        align:'center',
                        // slot:"alarm",
                        key: 'createTime',
                        render: (h, params) => {
                            return h("span", params.row.createTime.substring(0,10));
                        }
                    },
                    {
                        title: "操作",
                        slot: 'action',
                        width: 350,
                        align: 'center',
                        btn:{edit:true,del:true},
                        render: (h, params) => {
                            var text=params.row
                            console.log(params.row);
                            return h('div', [
                                    [
                                       [
                                            h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                domProps: { // 添加标签,使用自己引入的iconfont图标
                                                    // innerHTML: "<i class='iconfont icon-pen'></i>"
                                                    innerHTML: "编辑"
                                                },
                                                on: {
                                                    click: () => {
                                                        this.updateMode(params.row.id)
                                                    }
                                                }
                                            }),
                                       ]
                                    // )
                                ],
                                [

                                    [h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        domProps: { // 添加标签,使用自己引入的iconfont图标
                                            innerHTML: "部署"
                                        },
                                        on: {
                                            click: () => {
                                                this.deployModel(params.row.id)
                                            }
                                        }
                                    })
                                    ]
                                    // )
                                ],
                                [

                                    [h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        domProps: { // 添加标签,使用自己引入的iconfont图标
                                            innerHTML: "发起审批"
                                        },
                                        on: {
                                            click: () => {
                                                this.startProcess(params.row)
                                            }
                                        }
                                    })
                                    ]
                                    // )
                                ],
                                    [

                                         [h('Button', {
                                                props: {
                                                    type: 'primary',
                                                    size: 'small'
                                                },
                                                domProps: { // 添加标签,使用自己引入的iconfont图标
                                                    innerHTML: "删除"
                                                },
                                                on: {
                                                    click: () => {
                                                        this.deleteModel(params.row.id)
                                                         }
                                                    }
                                                })
                                    ]
                                    // )
                                ],

                            ]);
                        }

                    }
                ]

            }
        },
        watch: {

        },
        methods: {
            startProcess(row) {
                let params = {
                    licenceApply : "714792346864058368",
                    flag:"0"
                    // licenceApply : "717520933870370816",
                    // flag:"1"
                }
                this.$api.getApply(params).then(res=>{
                    if(res.respCode==0||(res.result)-0==0)
                    {
                        this.$Message.success("发起成功");
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                    this.$emit('error','');

                })
            },
            deleteModel(modelId){
                let params = {
                    modelId : modelId
                };
                let self = this;
                this.$api.deleteModel(params).then(res=>{
                    if(res.respCode==0||(res.result)-0==0)
                    {
                        self.search(1);
                        this.$Message.success("删除成功");
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                    this.$emit('error','');

                })
            },
            deployModel(modelId){
                let params = {
                    modelId : modelId
                };
                let self = this;
                this.$api.deployModel(params).then(res=>{
                    if(res.respCode==0||(res.result)-0==0)
                    {
                        self.search(1);
                        this.$Message.success("部署成功");
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                    this.$emit('error','');

                })
            },
            updateMode(modelId){
                let params = {
                    modelId : modelId
                };
                this.$router.push({
                    name: "approve-new",
                    query: {
                        modelId: modelId
                    }
                });
                this.$router.query
            },
            //重置
            resertMo(){
                this.params.userName=''
                this.params.realName=''
                this.params.phoneNo=''
                this.params.status=''
                this.params.partmentId=''
                this.search(1);;
            },

            //更改启用/停用状态
            updateState(row){
                let self=this;
                console.log(row)
                if(row.status==1){
                    row.status=0
                    var text=this.$t('enable');
                }else {
                    row.status=1
                    var text = "停用";
                }
                //判断当前会议室启用状态  还是停用状态
                let params= row;
                this.$api.updateUser(params).then(res=>{
                    if(res.respCode==0||(res.result)-0==0)
                    {
                        this.$Message.success(text+this.$t('success'));
                    }
                    else{
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                    this.$emit('error','');

                })

            },
              //查询
            search(page){
                this.params.page = page ? page : 1;
                let searchData = {
                    userName:this.params.userName,
                    realName:this.params.realName,
                    phoneNo:this.params.phoneNo,
                    status:this.params.status,
                    partmentId:this.params.partmentId,
                    page:this.params.page,
                    pageSize:this.params.pageSize
                }
                this.getAppprovePage(searchData);
                this.searchData = searchData
                // this.query=true;
                // this.params.page=1;
                // this.getUserList()
            },

              //加载用户列表e
            getAppprovePage(option) {
                 this.$api.getAppprovePage(option).then(res=>{
                  if(res.respCode==0||(res.result)-0==0)
                    {
                        let resData = JSON.parse(res.data);
                        res.data = resData.list;
                        this.tableList=resData.list;
                        this.total = resData.total;
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },
            //获得角色·
            getRoleAllList()
            {
                this.$api.getRoleAllList({roleStatus:0}).then(res=>{

                    if(res.respCode=='0')
                    {
                        this.roleList=res.data;


                    }
                })
            },
            //处理选中
            handleSelect(data) {
                this.selectIds=[];
                for(let item of data)
                {
                    this.selectIds.push(item.id);
                }

            },

           changePage(page)
           {
                this.params.page=page;
                this.searchData.page = page
                this.getAppprovePage(this.searchData);

           },

            addUser(formData)
            {
                this.$router.push({
                    name: "approve-new",
                    query: {
                        id: 1,
                        agreementType:2,
                    }
                });
                this.$router.query
                // this.$router.push({
                //     name: "approve-new"
                // });
            },
            editUser(row){
                let {id,userName,realName,phoneNo,userSex,userType,mobileNo,status,email,otherInfo2}=row;
                let params={
                      id:id,
                    //   userNo:userNo,
                      userName:userName,
                      realName:realName,
                    //   remark:remark,
                      phoneNo:phoneNo,
                      userSex:userSex,
                      userType:userType,
                      mobileNo:mobileNo,
                      status:status,
                      email:email,
                      roleIds:[],
                      isdisabled:true,
                      otherInfo2:otherInfo2
                }

                for(let item of row.userRoleInSyses)
                {
                    if(item.roleId)
                    {
                          params.roleIds.push(item.roleId);
                    }
                    if(item.deptId)
                    {
                        params.deptId=item.deptId;
                    }
                }
                this.addUser(params);
            },
            delUser(row){
                let content=this.$t('deleteTit')
                let params={ids:[],systemType:0}
                if(row)
                {
                    params.ids.push(row.id);

                }
                 else if (this.selectIds.length==0){
                    this.$Message.error(this.$t('departmentManagement.pleaseDelete'));
                    return;
                }
                else {
                    params.ids=this.selectIds;
                }

                 this.$util.confirmDialog(this,this.$t('confirm'),content,self=>{
                     self.$api.delUser(params).then(res=>{
                         if(res.respCode==0)
                         {
                             self.$Message.success(this.$t('delete')+this.$t('success'));
                             self.search(1)
                         }
                         else{
                             self.$Message.error(res.message);
                         }
                     })

                  })

            },
            chooseDep(data)
            {
                this.params.deptName=data[0].title;
                this.params.partmentId=data[0].id;

            },

           getOrgDepList()
            {
                console.log()
                this.$api.getOrgDepList({systemType:0}).then(res=>{
                    if(res.respCode==0||res.result==0)
                    {

                        this.depTreeData= this.getTreeOrgDept(res.data);
                        console.log(this.depTreeData)

                    }
                    else{
                        this.$Message.error(res.message?res.message:res.resultMessage);
                    }

                })
            },
              /*
              生成树形组织结构(适用于 返回不是树形数据)
            */


          getTreeOrgDept(list,treeData,id)
            {
                let itemArr=[];
                let that=this;
                filter(itemArr,null)
                function get(array)
                {
                    for(let item of array)
                    {
                        filter(item,item.id)
                    }
                }
                //遍历过滤
                function filter(tree,id){

                    let array=list.filter(item=>{
                        //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
                        if(id==null)
                        {
                             item.title=item.deptName;
                        }
                         return item.parentId==id;
                    })
                    if(id==null||id==0)
                    {
                        itemArr=array;
                    }
                    else{
                        tree.children=array;
                    }
                    //依次遍历
                    if(array.length>0)
                    {
                         get(array)
                    }

                }

                return itemArr;

            },
            //获取公司机构
            getCompanyList(){
                let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
                let data = {
                    // enable: 0,
                    id: userRoleInSyses[0].deptId
                };
                this.$api.getDeptAndAllSubdivision(data).then(res => {
                    if (res.respCode == '0') {
                    this.companyList = res.data;
                    } else {
                    this.$Message.error(res.message);
                    }
                });
            },
            getCompanyEnableList(){
                let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
                let data = {
                    // enable: 0,
                    id: userRoleInSyses[0].deptId
                };
                this.$api.getDeptAndAllSubdivision(data).then(res => {
                    if (res.respCode == '0') {
                        this.companyEnableList = res.data;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            //重置密码
            resetPwd(row){
                let data = {
                    userId:row.id
                };
                this.$api.resetPassword(data).then(res => {
                    if (res.respCode == '0') {
                        this.$Message.success('重置密码成功');
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            }

        },
        filters: {

        },
        components: {
            userForm

        }
    }

</script>

<style lang='less'>
      #menu_index{

      }
       .v-transfer-dom .ivu-modal-wrap .ivu-modal .ivu-modal-content .ivu-modal-body .ivu-modal-confirm-body {
          height: auto!important;
          max-height: 350px!important;
          color: unset !important;
          overflow: auto;
      }
</style>

