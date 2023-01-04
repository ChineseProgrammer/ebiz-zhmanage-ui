<template>
    <div>
        <Row style="margin-bottom: 10px;">
            <Col>
                <h3>审批编号：{{auditNo}}</h3>
            </Col>
        </Row>
        <Row>
            <Col span="10" offset="1">
                <FormItem :label=label.code prop="code" >
                    <Input type="text" v-model="form.code"/>
                </FormItem>
            </Col>
            <Col span="10" offset="2">
                <FormItem :label=label.name prop="name" >
                    <Input type="text" v-model="form.name"/>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="22" offset="1">
                <FormItem :label=label.opinion prop="opinion" >
                    <Input type="textarea" v-model="form.remarks" maxlength="200"/>
                </FormItem>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "auditModal",
        props:{
            auditNo:{
                type:String,
                default:""
            },
            label:{
                type:Object,
                default:{}
            },
            form:{
                type:Object,
                default:{}
            }
        }
    }
</script>

<style scoped>

</style>
