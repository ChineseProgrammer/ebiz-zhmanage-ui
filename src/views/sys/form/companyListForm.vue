<template>
    <div>
        <br>
        <Form :model="companyListForm"  ref="companyListForm_form" :label-width="80" :rules="validate_rule" style="min-height: 120px;margin-left: 80px">
            <FormItem label="生效日期" prop="dateTime">
                <DatePicker :disabled="disabled" 	 type="date" style="width: 200px"  :value="companyListForm.dateTime" @on-change="setTime"></DatePicker>
            </FormItem>

            <FormItem label="" prop="enable">
                <RadioGroup v-model="params.enable">
                    <radio label="0" disabled>启用</radio>
                    <radio label="1" disabled>停用</radio>
                </RadioGroup>
            </FormItem>
            <!--<FormItem label="是否启用" prop="enable">-->
               <!--<RadioGroup v-model="companyListForm.enable">-->
                   <!--<radio :label="1"  v-if="params.teamStatus==0">禁用</radio>-->
                   <!--<radio :label="0" v-if="params.teamStatus==1">启用</radio>-->
               <!--</RadioGroup>-->
            <!--</FormItem>-->
        </Form>
    </div>
</template>

<script>
    export default {
        name: "companyListForm",
        props:{
            // getModalValue:{
            //     type:Function
            // },
            disabled:{
                type:Boolean,
                default:true
            },
            params:{
                type:Object,
            }
        },
        destroyed () {
        },
        watch:{
            // params(o,v){
            //     console.log(o, v.teamStatus);
            //     if(v!==undefined){
            //         this.companyListForm.enable=v.teamStatus
            //     }else{
            //         this.companyListForm.enable=o.teamStatus
            //
            //     }
            // }
        },
        created(){
            // this.companyListForm=true

            console.log(this.params);
            // this.companyListForm.dateTime=this.TimeNow()

        },
        data(){
            return {
                companyListForm:{
                    enable:this.params.enable,
                    dateTime:this.TimeNow(),
                    IsStop:false
                },
                validate_rule:{
                    dateTime:[{required:!this.disabled,trigger:'blur',message:'请选择时间'}],
                    enable:[{required:true,message:'请选择是否禁用',trigger:'change'}],
                }
            }
        },
        methods:{
            TimeNow(){
                let time =new Date();
                let year =time.getFullYear();
                let month=time.getMonth()+1;
                let day=time.getDate();
                if(month<10){
                    month='0'+month;
                }
                if(day<10){
                    day='0'+day;
                }
                console.log(year ,month,day);
                return  year+'-'+month+'-'+day
                // return  year+'-'+month+'-'+day+' '+'00:00:00'
            },
            setTime(data){
                console.log(data);
                this.companyListForm.dateTime=data
            },
            handleSubmit(value){
                this.companyListForm.enable=this.params.enable;
                // debugger
                this.$refs.companyListForm_form.validate((valid) => {
                    console.log(this.companyListForm);
                    if(valid){
                        this.companyListForm.IsStop=true;
                        //callback 回调  校验是否通过以及表单数据
                        value(valid, this.companyListForm)
                        this.$refs.companyListForm_form.resetFields()
                    }else{
                        value(valid, this.companyListForm)
                    }
                })

            },

            //重置
            reset(){
                this.$refs.companyListForm_form.resetFields()
            },
        }
    }
</script>

<style scoped>

</style>
