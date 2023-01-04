/*
 * @Author: 于学文 
 * @Date: 2019-04-14 14:09:16 
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-24 14:41:11
 */
 
<template>
     <div>
         <Button type="warning" @click="openModel()"  >通过render函数弹窗表单</Button>
         <Button type="info" style="margin-left:10px" @click="textModelForm()">自定义footer弹窗表单</Button>
         <Button type="info" style="margin-left:10px" @click="modelCropImage=true">测试图片裁剪上传</Button>
      
         <Button type="warning" style="margin-left:10px" v-has="btnPermission">v-has="btnPermission"（测试按钮权限）</Button>

         <span>自定义指令v-has,用户所有权限按钮放在store中（一般接口请求后存在store，自己修改v-has值刷新查看效果）</span>

          
        <div style="display:flex">
          
               <Card style="width:350px">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                树形下拉插件
             </p>
              <div>
             <p>依赖iview中 tree和Select 封装的树形下拉组件</p>
             
                 <span>单选</span>
                 <treeSelect :treeData='treeData' 
                         :modelData.sync='params.parentId'>
                </treeSelect>

                 <span>多选</span>

                 <treeSelect 
                        :treeData='treeData'
                         :multiple='true'
                         :modelData.sync='params.parentIds'>
                </treeSelect>
            </div>

          </Card>
            <Card style="width:350px">
            <p slot="title">
                <Icon type="ios-film-outline"></Icon>
                 国际化实例
             </p>
              <div>

                   显示实例： <span v-text="$t('route.home')"></span>
                   <RadioGroup  vertical @on-change='changeLocal' style='margin-left:30px'>
                    <Radio label="zh-CN">
                       
                        <span>中文简体</span>
                    </Radio>
                    <Radio label="zh-TW">
                      
                        <span>中文繁体</span>
                    </Radio>
                    <Radio label="en-US">
                        <span>英文</span>
                    </Radio>
                </RadioGroup>

            
            </div>

          </Card>
        </div>
        <div>
            
       
        </div>
         
         <p style="line-height:40px">
             悬浮提示，封装编辑，删除，查看按钮,根据column 的btn参数配置显示与隐藏<br>
             同时可以自定义按钮如重置密码<br>
             如果需要校验按钮权限 结合自定义指令 v-has 方法(表格组件已经集成)。写法如下(permission:传true或不传默认不校验权限)：   <br>
             {name:'重置密码',type:'info',method:'on-reset',premission:"reset:password"},,
             <br>注意：可编辑表格和属性表格也支持
             </p>
             <div>
                  <Button type="warning" @click="chooseAll(true)">全选</Button>
                  <Button type="info" style="margin-left:10px" @click="chooseAll(false)">取消全选</Button>
             </div>
        <primaryTable 
           
            border :columns="columns7" :data="data6"
            ref='primaryTable'
            @on-edit='editTable'
            @on-del='del'
            @on-check='check'
            @on-reset='resetPassword'
            :total='100'
            @on-change='changePage'
            @on-selection-change='getSelectData'
            
            >
        </primaryTable>
        <p style="line-height:40px">可行内编辑表格 </p>
        <p style="color：red">
           角色权限:  v-permission="rolePermisson",可修改rolePermisson中权限设置表格显示或隐藏
        </p>
        <editTable border :columns="columnsEdit" :data="data6"
            @on-edit='editTable'
            @on-del='del'
            @on-check='check'
            @on-save='save'
            :total='100'
            :add='true'
            @on-change='changePage'
             v-permission="rolePermisson"
            >
        </editTable>


           <tree-grid 
           :items='treeData' 
           :columns='treeColumns'
      ></tree-grid>
       
        
     <Modal
        v-model="modelCropImage"
        title="图片裁剪上传"
        :draggable='true'
         :loading="true"
        :closable="true"
         @save-success='refresh'
         :width='650'
       >
       <!-- imageWidth，imageHeight就是要求最后压缩的图片狂傲  比例 proportion可不传默认就是16/9 -->
         <cropper 
         :imageWidth='200' 
         :imageHeight='120' 
         :proportion='16/9'
         @upload-success='uploadSuccess' 
         @upload-error='uploadError'></cropper>
         <div slot="footer" style="display:none">
             
        </div>
    </Modal>

    <Modal
         v-model="modelform"
         title="表单弹窗"
         :draggable='true'
         :loading="true"
        :closable="false"
       >
          <sysForm ref='sysForm' v-if="modelform" ></sysForm>
         <div slot="footer" >
              <Button type="success" @click="saveFormInfo">保存</Button>
              <Button type="warning" @click="resetForm">重置</Button>
              <Button @click='cancelSave'>取消</Button>
        </div>
    </Modal>
     </div>
  
</template>
<script>
    import sysForm from '../form/sysForm.vue'
     import cropper from '../../components/cropper/index.js'
    export default {
        data () {
            return {
                modelform:false,
                modelCropImage:false,
                btnPermission:'userList:add',//用于测试按钮权限（所有按钮权限放在store app中）
                rolePermisson:['admin'],//用于测试角色权限（有权限的角色放在store app中）
                params:{
                    parentId:'asd',
                     parentIds:['asd','zxc']
                },
                columns7: [
                     {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        slot:"alarm"//添加这一行可实现悬浮提示
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        slot:"alarm",
                        key: 'address'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 300,
                        align: 'center',
                         btn:{edit:true,del:true},
                        selfBtn:[
                             {name:'重置密码',type:'',method:'on-reset'},
                              {name:'验证权限',type:'info',method:'on-reset',premission:true},
                             ]
                        //如果按钮不符合需求 ，可以自定义按钮 
                        //method：点击回调  同时在table加 @on-reset='resetPassword' 
                        //method:方法名自定义 但是前后和表格上要一致
                        //type是按钮类型
                    }
                ],
                  columnsEdit: [
                    {
                        title: 'Name',
                        key: 'name',
                        slot:"edit"//添加可实现表格edit
                    },
                    {
                        title: 'Age',
                        slot:"edit",
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 200,
                        align: 'center',
                        btn:{edit:true,del:true}
                    }
                ],
                data6: [
                    
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park'
                    }
                ],

          treeColumns: [{
                       width:'60',
                       align:'center',
                    type: 'selection'
                }, {
                    title: '编码',
                    key: 'code',
                    align:'center',
                    sortable: true
                }, {
                    title: '名称',
                    key: 'name'
                }, {
                    title: '状态',
                    key: 'status'
                }, {
                    title: '备注',
                    key: 'remark'
                }, {
                    title: '操作',
                    type: 'action',
                    align:'center',
                    actions: [
                        {
                        type: 'primary',
                        method:'on-edit',
                        text: '编辑'
                    },
                    {
                        type: 'error',
                        method:'on-del',
                        text: '删除'
                    }
                    ]
                }],
                treeData: [{
                    id: '11111',
                    code: '0001',
                    title: '测试数据1',
                    status: '启用',
                    expanded:false,
                    remark: '测试数据测试数据'
                }, {
                    id: 'asd',
                    code: '0002',
                    title: '测试数据2',
                    status: '启用',
                    remark: '测试数据测试数据',
                  
                    children: [{
                        id: 'zxc',
                        code: '00001',
                        title: '测试数据01',
                        status: '启用',
                        remark: '测试数据测试数据',
                        expanded:true,
                        children:[{
                             id: '0121321311',
                                code: '00001',
                                title: '测试数据01',
                                status: '启用',
                                remark: '测试数据测试数据',

                        }],
                    }, {
                        id: '02313132',
                        code: '00002',
                        title: '测试数据02',
                        status: '启用',
                        remark: '测试数据测试数据',
                    }]
                }, {
                    id: '3qeqwe',
                    code: '0003',
                    title: '测试数据3',
                    status: '启用',
                    remark: '测试数据测试数据'
                }, {
                    id: '12121212',
                    code: '0004',
                    title: '测试数据4',
                    status: '启用',
                    remark: '测试数据测试数据'
                }]
            }
        },
        methods: {
            
            editTable (params,index) {
                  alert(this.$refs.myTable)
            
                 alert('来编辑');
            },
            check (params,index) {
            
                 alert('来查看');
            },
            
            del (params,index) {
                
                this.$util.confirmDialog(this,"确认",'您确认删除',self=>{
                     
                  })
               
            },
            getSelectData(row)
            {
               this.$util.formatCityData(this.$util.cityData);

            },
             save (params,index) {
                 console.log(JSON.stringify(params))
                
                this.$util.confirmDialog(this,"确认",'行内编辑，数据保存',self=>{
                     
                  })
               
            },
            //表格全选
            chooseAll(state)
            {
                console.log("this.$refs",this.$refs.primaryTable);
                this.$refs.primaryTable.handleSelectAll(state);
            },
            resetPassword(row,index)
            {
                alert('表格自定义按钮重置密码');
            },
            /*
                params:{name:1,id:1}
            */

          
            changePage(page)
            {
                alert('点击页码'+page);
            },
            openModel()
            {

                var params={
                      self:this,
                      title:"测试表单弹窗",
                      width:800,//默认600
                      props:{},//向表单传递的参数 一般为表单绑定的数据 可不传
                      form:sysForm,//弹窗中的表单
                      success:(res)=>{
                          alert('成功');

                      },
                      cancel:()=>{
                            alert('取消');

                      }
                }
                this.$util.openModelForm(params);

            },
            /*
              测试按钮权限
            */ 

      
           textModelForm(){
            
                 this.modelform=true;
               
            },
            //保存
            saveFormInfo(){
                 
                this.$refs.sysForm.handleSubmit();
            },
            //重置
            resetForm()
            {
                this.$refs.sysForm.handleReset();

            },
            //取消
            cancelSave()
            {
               this.modelform=false;
            },
            //保存成工后刷新
            refresh()
            {
                this.modelform=false;

            },

            uploadSuccess(res)
            {
                alert('上传成功'+JSON.stringify(res));
                this.modelCropImage=false;
              
                                
                
            },
            uploadError()
            {

            },

            changeLocal(value)
            {
                this.$i18n.locale = value
            }

        },
        components: {
        
            sysForm,
            cropper
         
        }

    }
</script>
<style lang='less'>
      
      .content{
        
      }
</style>