<template>
    <div id="InputModal">
        <Form  :model="form" :label-wdith="80" >
            <FormItem style="margin-bottom: 0" :prop="value">
                <Input  clearable  @on-clear="clearData"  @click.native="ShowModal" v-model="form[value]" :placeholder="placeholder" :disabled="disabled" style="width: 100%"/>
            </FormItem>
        </Form>

        <Modal title="选择人员" v-model="InputModal" width="800px" class="Modal_html">
            <Form :label-width="120" inline  :model="InputTableForm" ref="inputForm">
                <Row>
                    <i-col span="12">
                        <FormItem label="姓名" prop="name">
                            <Input style="width: 250px" v-model="InputTableForm.name"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="编号" prop="code">
                            <Input style="width: 250px" v-model="InputTableForm.code"/>
                        </FormItem>
                    </i-col>
                    <i-col span="12">
                        <FormItem label="管理机构名称" prop="customerId">
                            <Select style="width: 250px" v-model="InputTableForm.customerId">
                                    <Option :value="item.deptCode" v-for="(item,index) in customList" :key="index">{{item.deptName}}</Option>
                            </Select>
                            <!--<Input v-model="InputTableForm.code"/>-->
                        </FormItem>
                    </i-col>
                    <i-col span="12" >
                        <FormItem >
                            <Button type="primary" @click="search">查询</Button>
                            <Button @click="reset">重置</Button>
                        </FormItem>
                    </i-col>
                </Row>




            </Form>
            <Row style="margin:0 20px 20px 20px">
                <i-col>
                    <primaryTable
                            :columns="columns"
                            :data="tableDate"
                            :page-size=10
                            :total="total"
                            @on-page-size-change="changePageSize"
                            @on-change="changePage"
                    />
                </i-col>
            </Row>

        </Modal>

    </div>
</template>

<script>
    export default {
        /**
         * @description: 这个name 用table  是不建议的  但是看用了很多
         * 就没有改，因为table 是html 内置的标签，以后可能会出错的
         * @Date: 2020-08-12 16:09:20
         * @Author: 周靖松
         */
        name: "table",
        //传递 val 对应绑定modal  data
        props:{
            //传递过来的key value 分别对应form 表单的 key 以及 需要从接口获取数据的key  可以查看agent 下的viewForm 的InputModal
            ApiList:{
                type:Array,
                default: ()=>{
                    return [{'agentCode':'agentCode'},{'agentName':'agentName'}]
                }
            },
            //是否校验
            rule:{
                type:Object,
            },
            //form 表示索要修改的表单
            form:{
                type:Object,
            },
            // value 对应form 表单对应想要的code
            value:{
                type:String,
            },
            // name 对应表单想要的 rankCode

            //是否禁用
            disabled:{
                type:Boolean,
                default:false
            },
            //placeholder
            placeholder:{
                type:String,
            },
        },

        data(){
            return{
                total:0,
                customList:[],//机构list
                InputTableForm:{}, //弹出框表单
                page:1,
                pageSize:10,
                tableDate:[],//table 数据
                InputModal:false,
                dataArray:[],
                inputForm:{},
                list:this.data,
                indexOfList:[],

            }
        },
        created(){
        },
        mounted(){
        },
        updated(){
        },
        methods:{
            //机构
            getDeptLists(){
                let userRoleInSyses = JSON.parse(window.sessionStorage.getItem("userRoleInSyses"));
                let deptId = userRoleInSyses[userRoleInSyses.length-1].deptId;
                this.$api.getDeptList({deptLevelId:'3',id:deptId}).then(res=>{
                    if(res.respCode==0){
                        this.customList=res.data
                    }else{
                        this.$Message.error(res.content)
                    }
                })
            },

            //获取业务员数据
            getAgentPage(params){
                this.$api.getAgentPage(params).then(res=>{
                    if(res.respCode==0){
                        this.$nextTick(()=>{
                            this.tableDate=this.newData(res.data.list);
                            this.total=res.data.total
                        })
                    }
                })
            },
            changePageSize(size){
                this.pageSize=size;
                this.page=1;
                this.search()
            },
            clearData(){
                this.disabled = true;
                this.ApiList.map(child=>{
                    for(let ch in child){
                        this.inputForm[ch] = '';
                    }
                    setTimeout(()=>{
                        this.disabled = false;
                    })
                    // this.inputForm[child]=item[child]
                })
            },
            //search
            search(page) {
                let params = {
                    page: this.page ? this.page : 1,
                    pageSize: this.pageSize,
                    agentName: this.InputTableForm.name,
                    agentCode: this.InputTableForm.code,
                    customerCode: this.InputTableForm.customerId,
                    agentStatus:1,
                };
                this.getAgentPage(params);
            },
            //重置
            reset(){
                this.$refs.inputForm.resetFields();
                this.page=1;
                this.search()
            },
            //打开modal 并渲染第一页数据
            ShowModal(){
                if(!this.disabled) {
                    this.InputModal = true;
                    this.list = this.data;
                    setTimeout(() => {
                      this.search(1);
                      this.getDeptLists();
                        this.inputForm= this.newData(this.form);
                    })
                }else{
                    return
                }


            },
            //按钮点击给临时表单赋值
            SelectRow(val,data){
                if(val){
                    this.tableDate.map(item => {
                        if(item.agentCode === val){
                            this.ApiList.map(child=>{
                                for(let ch in child){
                                    if(typeof ( item[child[ch]])==='number'){
                                        item[child[ch]]=item[child[ch]].toString()
                                    }
                                    this.inputForm[ch] =item[child[ch]];
                                }
                                // this.inputForm[child]=item[child]
                            })
                            // this.inputForm[this.name] = item[this.apiName];
                            // this.inputForm[this.value] = item[this.apiValue];
                            // this.inputForm[this.code] = item[this.apiCode]
                        }
                    })
                }
                this.inputForm=this.newData(this.inputForm);
                this.$emit('update:form',this.inputForm);
                this.InputModal=false
                // this.$emit("on-change")

            },
            //分页每页10调数据
            changePage(page){
                this.page=page;
                this.search()
            },
        },
        watch:{
            'disabled'(m,v){
            },
            //监听date
            'data'(m,v){
            },
            //监听表单并修改父页面的form
            'inputForm'(m,v){

            }
        },
        computed:{
            columns:(vm)=>{
                    return [
                        {
                            title:'业务员代码',
                            align:'center',
                            key:'agentCode'
                        },
                        {
                            title:'业务员姓名',
                            align:'center',
                            key:'agentName'
                        },
                        {
                            title:'管理机构名称',
                            align:'center',
                            key:'customerName'
                        },
                        {
                            title:'操作',
                            align:'center',
                            render:(h,p)=>{
                                return h('div',[
                                    h('Button',{
                                        props:{
                                            size:'small',
                                            type:'primary'
                                        },
                                        on:{
                                            click:()=>{
                                                vm.SelectRow(p.row.agentCode,vm.data,vm.modal)
                                            }
                                        }
                                    },'选择')
                                ])
                            }
                        }
                    ]
                },

        }
    }
</script>

<style  lang="less">
     #InputModal{
         .ivu-input{
             /*width:200px*/
         }
     }
</style>
