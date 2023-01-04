<template>
        <Form ref="formData"
              :model="formData"
              :label-width="150">
            <FormItem label="场次名称" prop="actPersonNum">
                <Input v-model="formData.actPersonNum" style="width: 200px"/>
            </FormItem>
            <FormItem label="场次时间" prop="actPersonNum">
                <DatePicker
                        transfer
                        style="width: 200px"
                        type="datetime"
                        v-model="dateList"
                        @on-change="onDatePickerChange"
                        placement="bottom-end"
                        placeholder="请选择时间阶段"
                ></DatePicker>
            </FormItem>
            <FormItem prop="fileName" label="内容类型">
                <Select clearable
                        filterable
                        placeholder="内容类型" style="width: 200px"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem prop="fileName" label="活动类型">
                <Select clearable
                        filterable
                        placeholder="活动类型" style="width: 200px"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem prop="fileName" label="机构">
                <Select clearable
                        filterable
                        placeholder="机构" style="width: 200px"
                >
                    <Option>北京分公司</Option>
                    <Option>天津分公司</Option>
                </Select>
            </FormItem>
            <FormItem label="备注" prop="actPersonNum">
                <Input v-model="formData.actPersonNum" style="width: 200px"/>
            </FormItem>
        </Form>
</template>

<script>
    export default {
        name: "Activity",
        methods:{

        },
        data(){
            return {
                formData:{},
        }
        }
    }
</script>

<style scoped>

</style>