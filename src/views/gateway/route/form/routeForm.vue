<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="路由名:" prop="realName">
            <Input v-model="formValidate.realName" placeholder="请输路由名" style="width:60%"></Input>
        </FormItem>
       <FormItem label="路由编码:" prop="userName">
            <Input v-model="formValidate.userName" placeholder="请输入路由编码" style="width:60%"></Input>
        </FormItem>
        <FormItem label="服务编码" prop="mobileNo">
            <Input v-model="formValidate.mobileNo" placeholder="请输入服务编码(serviceId)" style="width:60%"></Input>
        </FormItem>
        <FormItem label="拦截规则:" prop="email">
            <Input v-model="formValidate.email" placeholder="请输拦截规则(path)" style="width:60%"></Input>
        </FormItem>
        <FormItem label="簇点id:" prop="otherInfo2">
            <Input v-model="formValidate.otherInfo2" placeholder="请输入路由簇点id" style="width:60%"></Input>
        </FormItem>
        <FormItem label="url:" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入url" style="width:60%"></Input>
        </FormItem>
        <FormItem label="转发前缀:" prop="stripPrefix">
            <i-switch v-model="switchStatus" size="large" >
                <span slot="open">使用</span>
                <span slot="close">不用</span>
            </i-switch>
        </FormItem>
        <FormItem label="是否重试:" prop="stripPrefix">
            <i-switch :value="false" size="large" >
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
        <FormItem label="是否启用:" prop="stripPrefix">
            <i-switch :value="true" size="large" >
                <span slot="open">启用</span>
                <span slot="close">停用</span>
            </i-switch>
        </FormItem>
        <FormItem label="需要认证:" prop="stripPrefix">
            <i-switch :value="false" size="large" >
                <span slot="open">需要</span>
                <span slot="close">无需</span>
            </i-switch>
        </FormItem>
        <FormItem label="认证方式:" prop="stripPrefix">
            <RadioGroup :value="'token'">
                <Radio label="token">token</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="请求类型:" prop="stripPrefix">
            <RadioGroup :value="'json'">
                <Radio label="json">json</Radio>
                <Radio label="xml">xml</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="请求模板:" prop="stripPrefix">
            <Input v-model="formValidate.remark" type="textarea" placeholder="" style="width:60%"/>
            <Button type="primary" size="small" @click="showtempLateForm">编辑模板</Button>
        </FormItem>
         <Tree :data="tree" :render="renderContent" style="font-size:30px;">


         </Tree>
        {{tree}}


        <!-- {{template}} -->
            <div style="display:flex;justify-content: center;align-content: center;width:100%;">
                
                <div>
                    <div :key="index" v-for="(node,index) in template.childNodes" style="width:50%;">
                        <div class="row" v-if="index == 0">
                            <div class="col">节点名</div>
                            <div class="col">属性值</div>
                            <div class="col">状态</div>
                        </div>
                        <div class="row" @click="chooseNode=node">
                            <div class="col">{{node.code}}</div>
                            <div class="col">{{node.value}}</div>
                            <div class="col">{{node.childNodes.length>0?"父":""}}  {{node.childNodes.length>0?"循环":""}}</div>
                        </div>
                        <div class="row" :key="cni" v-for="(cn,cni) in node.childNodes">
                            <div class="col">{{cn.code}}</div>
                            <div class="col">{{cn.value}}</div>
                        </div>
                    </div>
                </div>
                <!--  -->
                
                <div style="width:50%">
                    <div>
                        <Input v-model="rootNodeEdit.code" />
                        <Input v-model="rootNodeEdit.value"/>
                        <Button type="primary" size="small" @click="addRootNode()">新增根属性</Button>
                    </div>
                    
                    <div>
                        <p>当前选择的节点:{{chooseNode}}</p>
                        <Input v-model="addCN.code" />
                        <Input v-model="addCN.value"/>
                        <Button type="primary" size="small" @click="addCN()">新增子属性</Button> <Button type="error" size="small" @click="template.childNodes.shift(node)">删除</Button>
                    </div>
                </div>
            </div>
           
            <!-- <tr>
                <td colspan="3">
                    <table>
                        <tr>
                            <td>节点名</td>
                            <td>属性值</td>
                            <td>操作</td>
                        </tr>
                        <tr>
                            <td>{{node.code}}</td>
                            <td>{{node.value}}</td>
                            <td><Button type="primary" size="small">新增子属性</Button> <Button type="error" size="small">删除</Button></td>
                        </tr>
                    </table>
                </td>
            </tr> -->
            <!-- 
            <tr v-if="template.childNodes.length<=0">
                <td><Input /></td>
                <td><Input /></td>
                <td><Button type="primary" size="small">新增子属性</Button> <Button type="warning" size="small">添加循环节点</Button> <Button type="error" size="small">删除</Button></td>
            </tr>
            <tr>
                <td><Input v-model="code"/></td>
                <td><Input v-model="value"/></td>
                <td ><Button type="primary" size="small" @click="add">新增同级属性</Button></td>
            </tr> 
        </table>
        -->
        <FormItem label="返回类型:" prop="stripPrefix">
            <RadioGroup :value="'json'">
                <Radio label="json">json</Radio>
                <Radio label="xml">xml</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="返回模板:" prop="stripPrefix">
            <Input v-model="formValidate.remark" type="textarea" placeholder="" style="width:60%"/>
        </FormItem>
    </Form>
</template>
<style lang="less" scoped>
.row{
    display: flex;
    justify-content: center;
    align-content: center;
    height: 30px;
    line-height: 30px;
    width: 200px;
    .col{
        width: 200px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
    }
}
</style>

<script>
import templateForm from './templateForm'
    export default {
        props:{
            // 传入的值
            formValidate:{
                type:Object,
                default:()=>{
                    return {
                        realName:'',
                        userName:'',
                        mobileNo:'',
                        email:'',
                        otherInfo2:'',
                        otherInfo1:'1',
                        remark:'',
                        id:'',
                        stripPrefix:false
                    }
                },
              
            },
              
        },
        data () {
            return {
                tree:[{
                    title:"/",
                    expand: true,
                    children:[{
                        title:"PackageList"
                    }],
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            }, [
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        type: 'primary'
                                    }),
                                    style: {
                                        width: '128px'
                                    },
                                    on: {
                                        click: () => { this.append(data) }
                                    }
                                },"新增子节点"),
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        type: 'success'
                                    }),
                                    style: {
                                        width: '64px'
                                    },
                                    on: {
                                        click: () => { this.append(data) }
                                    }
                                },"循环")
                            ])
                        ]);
                    }
                }],
                


                rootNodeEdit:{
                    code:"",
                    value:""
                },
                chooseNode:{

                },
                template:{ 
                    code:"",
                    value:"",
                    path:"/",
                    childNodes:[
                        
                    ]
                },
                switchStatus:false,
                //权限的select
                permissionsList: [
                    {
                        value: '0',
                        label: '管理员'
                    },
                    {
                        value: '1',
                        label: '普通'
                    },   
                ],
                // 验证字段
                ruleValidate: {
                    realName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        {max:20,message: '姓名应为不超过20位，中英文',rigger:'blur'}
                    ],
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { pattern:"^[a-zA-Z0-9]{1,20}$", message: '请输入1-20位字符，包含数字、字母（区分大小写）',trigger:'blur'}
                    ],
                    mobileNo: [
                        { required: true, message: '电话不能为空', trigger: 'blur' },
                        { pattern:"^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$", message: '请输入正确的电话',trigger:'blur'}
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type:'email', message: '请输入正确的邮箱',trigger:'blur' }
                    ],
                    otherInfo2: [
                        { required: true, message: '部门不能为空', trigger: 'blur' },
                        {max:20,message: '请输入正确的部门',rigger:'blur'}
                    ],
                    otherInfo1: [
                        { required: true, message: '请选择！', trigger: 'blur' }
                    ],
                    remark: [
                        { required: false, message: '', trigger: 'blur' },
                        {max:500,message: '不超过500位字符',trigger:'blur'}
                    ],
                  
                }
            }
        },
        created:function(){
           
        },
        mounted(){
           
        },
        methods: {
             renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-add'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-remove'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ]);
            },
            append (data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },

            addCN(){
                let that = this
                that.chooseNode.childNodes.push({
                    code:that.addCN.code,
                    value:that.addCN.value,
                    path:"/"+that.addCN.code,
                    childNodes:[
                        
                    ]
                });
            },
            addRootNode(){
                let that = this
                // that.$set(that.template.childNodes, that.rootNodeEdit.code, that.rootNodeEdit.value)
                that.template.childNodes.push({
                    code:that.rootNodeEdit.code,
                    value:that.rootNodeEdit.value,
                    path:"/"+that.rootNodeEdit.code,
                    childNodes:[
                        
                    ]
                });
            },
            add(){
                
            },
            showtempLateForm(){
                
            },
            handleSubmit () {            
                var self = this;
                self.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // this.$Message.success('新增成功!');
                        self.formValidate.systemType=0;
                        self.formValidate.roleId=0;
                   
                        self.formValidate.userRoleInSyses=[{systemType:0}];                        
                        if(self.formValidate.id){
                            self.$api.employees_editor(self.formValidate).then(res => {
                                if(res.respCode==0)
                                {
                                    self.$Message.success('编辑成功');
                                    self.$emit('finish','');
                                }
                                else
                                {
                                    self.$Message.error('编辑失败');
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        }else {
                            roleId: 0

                                self.formValidate.otherInfo3='0';
                                self.formValidate.t=1559360125;
                            self.$api.employees_increase(self.formValidate).then(res => {
                                if(res.respCode==0)
                                {
                                    self.$Message.success('添加成功');
                                    self.$emit('finish','');
                                }
                                else
                                {
                                    self.$Message.error(res.message);
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                        }                        
                    } else {
                        //  this.$Message.error('新增失败!');
                         this.$emit('error','');
                    }
                })
            },
            handleReset () {
                this.$refs.formValidate.resetFields();
            },
        }
    }
</script>