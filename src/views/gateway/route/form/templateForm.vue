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
        </FormItem>

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
<script>
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