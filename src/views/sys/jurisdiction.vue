<template>
    <div>
     <!-- <Form ref="params" :model="params" :label-width="80" >
         <Row>
             <Col span="6">
                <FormItem :label="$t('system.realName')" prop="realName">
                    <Input v-model="params.realName" :placeholder="$t('pleaseEnter')+$t('system.realName')" @on-enter="search()" :maxlength="50"></Input>
                </FormItem>
             </Col>
             <Col  span="6"  >
                 <FormItem ></FormItem>
             </Col>

         </Row>
     </Form> -->
       <div class="m-table">
           <!-- <div class="m-btn">
               <Row>
                   <Col span="12" >
                       <Button  type="dashed" icon="ios-search" @click="search()"  style="margin-left：10px">{{$t('query')}}</Button>
                       <Button type="primary" icon="md-refresh" @click="resertMo">{{$t('reset')}}</Button>

                   </Col>
                   <Col span="12" class="text-right">
                       <Button type="primary" icon="md-trash" @click="delUser()"      style="margin-bottom: 5px;">{{$t('batchdeletion')}}</Button>
                       <Button type="dashed" icon="md-add" @click="addUser()" class="marginRight3"      style="margin-bottom: 5px;">{{$t('newBuilt')}}</Button>
                   </Col>
               </Row>
           </div> -->
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
                params:{
                    query:false,
                    userName:'',
                    realName:'',
                    pageSize:10,
                    page:1,
                    systemType: 0
                },
                depTreeData:[],
                total:0,
                 selectIds:[],


                tableList:[
                    {
                        modellevel:"主模块",
                        modelname:"代理人管理",
                        permodel:"-",
                        version:"1.0",
                        updatadate:"2019/11/3 18:00:00",
                        mark:"中级权限，可分配给公司机构"
                    },
                    {
                        modellevel:"子模块",
                        modelname:"代理人基本信息",
                        permodel:"代理人管理",
                        version:"1.0",
                        updatadate:"2019/11/3 18:00:00",
                        mark:"中级权限，可分配给公司机构"
                    },
                    {
                        modellevel:"子模块",
                        modelname:"代理人异动",
                        permodel:"代理人管理",
                        version:"1.0",
                        updatadate:"2019/11/3 18:00:00",
                        mark:"中级权限，可分配给公司机构"
                    },

                ],
                roleList:[],
                columns:[
                        {
                            type: 'index',
                            width: 60,
                            align: 'center',
                            title:"序号"
                        },

                        {
                            title: '模块层级',
                            key: 'modellevel',
                            align: 'center',
                            slot:"alarm"//添加可实现表格edit
                        },

                        {
                            title: '模块名称',
                            key: 'modelname',
                            align: 'center',
                            slot:"alarm"//添加可实现表格edit
                        },
                        {
                            title: '上级模块',
                            slot:"alarm",
                            align: 'center',
                            key: 'permodel'
                        },
                        {
                            title: '权限版本',
                            slot:"alarm",
                            align: 'center',
                            key: 'version'
                        },
                        {
                            title: '修改日期',
                            slot:"alarm",
                            align: 'center',
                            key: 'updatadate'
                        },
                        {
                            title: '备注',
                            slot:"alarm",
                            align: 'center',
                            key: 'mark'
                        },

                    ]


            }
        },
        created: function () {
            this.getUserList();
            //调用部门
            // this.getOrgDepList();
            this.getRoleAllList();

        },
        mounted:function()
        {


        },
        watch: {

        },
        methods: {
            //重置
            resertMo(){
                this.params.userName=''
                this.params.realName=''
                this.getUserList();
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
                    var text = this.$t('prohibit');
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
            search(){
                this.query=true;
                this.params.page=1;
                this.getUserList()
            },

              //加载用户列表e
              getUserList() {
                if(this.query){
                    this.params.userName=this.params.userName.trim()
                    this.params.realName=this.params.realName.trim()
                    var option=this.params
                }else {
                    var option={};
                    option.page=this.params.page;
                    option.pageSize=this.params.pageSize;
                    option.systemType=0
                }

                 this.$api.getUserList(option).then(res=>{
                  if(res.respCode==0||(res.result)-0==0)
                    {
                       this.total=res.data.count;
                        this.tableList=res.data.list;
                        for(var i=0;i<this.tableList.length;i++){
                            if(this.tableList[i].userName=='adminCenter'){
                                this.tableList[i]._disabled=true
                            }

                        }
                    }
                    else{
                        this.$Message.error(res.message);
                    }


                })
            },
            //获得角色·
            getRoleAllList()
            {
                this.$api.getRoleAllList({}).then(res=>{

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
               this.getUserList();

           },

            addUser(formData)
            {
                let props={},title=this.$t('addUser');
                props.depTreeData=this.depTreeData;
                props.roleList=this.roleList;
                console.log(this.roleList)
                if(formData)
                {
                    console.log(formData)
                    props.formValidate=formData;
                    title=this.$t('editUser');
                }
                let self=this;
                  var params={
                      self:this,
                      title:title,
                      width:600,//默认600
                      props:props,
                      form:userForm,//弹窗中的表单
                      success:(res)=>{
                          if(res=1){
                              this.params.page=1;
                              this.params.userName=''
                              this.params.realName=''
                          }
                          this.getUserList();
                      },
                      cancel:()=>{
                      }
                }
                this.$util.openModelForm(params,this);


            },
            editUser(row){
                let {id,userNo,userName,realName,remark,phoneNo,userSex,userType,mobileNo,status,email}=row;
                let params={
                      id:id,
                      userNo:userNo,
                      userName:userName,
                      realName:realName,
                      remark:remark,
                      phoneNo:phoneNo,
                      userSex:userSex,
                      userType:userType,
                      mobileNo:mobileNo,
                      status:status,
                      email:email,
                      roleIds:[]
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
                             self.getUserList()
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

