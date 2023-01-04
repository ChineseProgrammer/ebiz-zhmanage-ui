<template>
    <div id="modalLog">
        <div>
            <Row style="margin-bottom: 10px;">
                <Col span="24">
                    <h3 style="color:red">职级轨迹</h3>
                </Col>
            </Row>
            <br>
           <!--循环整理列表数据-->
            <span v-for="(item,i) in rankList">
                 <Row v-if="i===0">
                    <Col span="6" offset="1">
                        <div class="box font-size-14" :class="item.active?'bg-blue':'bg-gray'">{{item.rankName}}</div>
                    </Col>

                    <Col span="10" offset="1" style="margin-top: 5px">
                        <p class="font-size-14">
                            {{item.modifiedUser}} <span v-if="item.areaName">/  {{item.areaName}}</span> <span v-if="item.teamName">/  {{item.teamName}}</span><span v-if="item.groupName">/  {{item.groupName}}</span>
                        </p>
                    </Col>
                      <Col span="6" style="margin-top: 5px">
                        <p class="font-size-14">
                           时间：{{item.modifieDate}}
                        </p>
                    </Col>
                </Row>
                 <Row v-else>
                        <Col span="6" offset="1">
                            <div class="box font-size-14" :class="item.active?'bg-blue':'bg-gray'">{{item.name}}</div>
                        </Col>
                           <Col span="10" offset="1" style="margin-top: 5px">
                        {{item.modifiedUser}}<span v-if="item.areaName">/  {{item.areaName}}</span> <span v-if="item.teamName">/  {{item.teamName}}</span><span v-if="item.groupName">/  {{item.groupName}}</span>
                    </Col>

                     <Col span="6" style="margin-top: 5px">
                        <p class="font-size-14">
                             时间：{{item.modifieDate}}
                        </p>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span="7" style="text-align: center" v-if="i<rankList.length-1">
                        <Icon v-if="i==0 || (item.active==true && item.state==1)" style="color: #3399ff" type="ios-arrow-round-down" size="34"/>
                        <Icon v-else type="ios-arrow-round-down" size="34"/>
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
            rankList:{
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
