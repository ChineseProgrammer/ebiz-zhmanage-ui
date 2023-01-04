<template>
    <div id="modalLog">
        <div>
            <Row style="margin-bottom: 20px;">
                <Col span="12">
                    <h3>审批项：{{checkLogType}}  </h3>
                </Col>
                <Col span="12">
                    <h3>审批编号：{{auditNo}}</h3>
                </Col>
            </Row>
           <!--循环整理列表数据-->
            <span v-for="(item,i) in auditList">
                 <Row v-if="i===0">
                    <Col span="6" offset="1">
                        <div class="box font-size-14" :class="item.active?'bg-blue':'bg-gray'">{{item.name}}</div>
                    </Col>
                    <Col span="2" class="font-size-14" >
                        <span v-if="item.state&&item.state==1" style="color: #009900;">发起审批</span>
                        <span v-else-if="item.state&&item.state==0" style="color: #3399ff;">审批中</span>
                        <span v-else-if="item.state&&item.state==2" style="color: #ff0000;">未通过</span>
                        <span v-else-if="item.state&&item.state==3" style="color: #ff0000;">撤回</span>
                        <div v-else style="width: 100%;height: 1px;"></div>
                    </Col>
                    <Col span="10" offset="2">
                        <p class="font-size-14">
                            提交人：<span>{{item.auditor}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            提交日期：<span>{{item.auditTime}}</span>
                        </p>
                    </Col>
                </Row>
                 <Row v-else>
                    <Col span="6" offset="1">
                        <div class="box font-size-14" :class="item.active?'bg-blue':'bg-gray'">{{item.name}}</div>
                    </Col>
                    <Col span="2" class="font-size-14" style="margin-top: 5px">
                        <span v-if="item.state&&item.state==1" style="color: #009900;">已通过</span>
                        <span v-else-if="item.state&&item.state==0" style="color: #3399ff;">审批中</span>
                        <span v-else-if="item.state&&item.state==2" style="color: #ff0000;">未通过</span>
                        <span v-else-if="item.state&&item.state==3" style="color: #ff0000;">撤回</span>
                        <div v-else style="width: 100%;height: 1px;"></div>
                    </Col>
                    <Col span="10" offset="2">
                        <p class="font-size-14">
                            <span style="float: left;">审批人：</span><span>{{item.auditor}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>审批时间：</span><span>{{item.auditTime}}</span>
                        </p>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span="7" style="text-align: center" v-if="i<auditList.length-1">
                        <Icon v-if="i==0 || (item.active==true && item.state&&item.state==1)" style="color: #3399ff" type="ios-arrow-round-down" size="34"/>
                        <Icon v-else type="ios-arrow-round-down" size="34"/>
                    </Col>
                    <Col span="7" style="text-align: center" v-else>
                          &nbsp;  &nbsp;  &nbsp;
                    </Col>
                     <Col span="1">
                          &nbsp;  &nbsp;  &nbsp;
                    </Col>
                    <Col span="13" offset="3" v-if="item.active || i===0">
                        <p>
                              <span class="font-size-14" style="float:left;margin-bottom: 14px;">审核意见： </span>
                              <span style="max-height: 50px;overflow: hidden">
                                      <div style="font-size: 14px;max-height: 50px;overflow: scroll">
                                      {{item.remarks}}
                                  </div>
                              </span>
                        </p>

                    </Col>
                </Row>

            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "auditLog",
        props:{
            auditList:{
                type:Array,
            },
            // modalLog:{
            //     type:Boolean,
            //     default:false
            // },
            // modalTitle2:{
            //     type: String,
            //     default: "审批记录"
            // },
            checkLogType:{
                type:String,
                default:""
            },
            state:{
                type:String,
                default:""
            },
            auditNo:{
                type:String,
                default:""
            },
            auditStatus:{
                type:String,
                default:""
            },
        }
    }
</script>

<style scoped>
    #modalLog{
        margin: 20px;
    }
    .header {
        margin-top: 20px;
        margin-bottom: 30px;
    }
    .box{
        width: 90%;
        height: 30px;
        line-height: 30px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
    }
    .bg-blue {
        background-color: #3399ff;
        color: #fff;
    }
    .bg-gray {
        background-color: #f2f2f2;
        color: #000;
    }
    .font-size-14 {
        font-size: 14px;
    }
</style>
