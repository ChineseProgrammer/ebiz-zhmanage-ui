<template>
  <Form :label-width="120">
    <FormItem label="id:">
      <Input v-model="id" disabled />
    </FormItem>
    <FormItem label="接口名:">
      <Input v-model="formData.apiName" placeholder="接口的中文名" disabled />
    </FormItem>
    <FormItem label="接口编码:">
      <Input v-model="formData.apiCode" placeholder="接口的英文名,也是接口的唯一标识" disabled />
    </FormItem>
    <FormItem label="url:">
      <Input v-model="formData.url" placeholder="接口的访问路径" disabled />
    </FormItem>

    <FormItem label="是否开启限流功能:">
      <i-switch v-model="formData.flowRuleStatus" size="large" true-value="1" false-value="0" disabled>
        <span slot="open">启用</span>
        <span slot="close">禁用</span>
      </i-switch>
    </FormItem>
    <FormItem label="限流方式:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleGrade" size="large" disabled>
        <Radio label="0" :disabled="formData.flowRuleGrade==0?false:true">QPS限流</Radio>
        <Radio label="1" :disabled="formData.flowRuleGrade==1?false:true">线程限流</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="限流阈值:" v-if="formData.flowRuleStatus == 1" >
      <Input v-model="formData.flowRuleCount" placeholder="每秒访问量" disabled/>
    </FormItem>
    <FormItem label="流控效果:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleControlBehavior" size="large" disabled>
        <Radio label="0" :disabled="formData.flowRuleControlBehavior==0?false:true">直接拒绝</Radio>
        <Radio label="1" :disabled="formData.flowRuleControlBehavior==1?false:true">Warm Up(预热/冷启动)</Radio>
        <Radio label="2" :disabled="formData.flowRuleControlBehavior==2?false:true">排队等候(匀速排队)</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label="排队超时时间:"
      v-if="formData.flowRuleStatus == 1 && formData.flowRuleControlBehavior == 1"
    >
      <Input v-model="formData.flowRuleMaxQueueingTimeout" placeholder="排队超时时间" />
    </FormItem>

    <FormItem label="是否开启降级功能:">
      <i-switch
        v-model="formData.degradeRuleStatus"
        size="large"
        true-value="1"
        false-value="0"
        disabled
      >
        <span slot="open">启用</span>
        <span slot="close">禁用</span>
      </i-switch>
    </FormItem>

    <FormItem label="降级方式:" v-if="formData.degradeRuleStatus == 1">
      <RadioGroup v-model="formData.degradeRuleGrade" size="large" disabled>
        <Radio label="0" :disabled="formData.degradeRuleGrade==0?false:true">RT响应时间(降级阈值为毫秒数)</Radio>
        <Radio label="1" :disabled="formData.degradeRuleGrade==1?false:true">异常比例(降级阈值为闭区间[0.0-1.0])</Radio>
        <Radio label="2" :disabled="formData.degradeRuleGrade==2?false:true">异常数(降级阈值异常数量)</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="降级阈值:" v-if="formData.degradeRuleStatus == 1">
      <Input
        v-model="formData.degradeRuleCount"
        :placeholder="degradeRuleCountplaceholderWord()"
        class="red-placeholder"
        disabled
      />
    </FormItem>
    <FormItem label="时间窗口:" v-if="formData.degradeRuleStatus == 1">
      <Input v-model="formData.degradeRuleTimeWindow" placeholder="单位/秒 必须大于0的整数" disabled />
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    serviceApi: {
      type: Object
    }
  },
  data() {
    return {
      id: 0,
      formData: {
        apiName: "",
        apiCode: "",
        url: "",
        degradeRuleStatus: "0",
        degradeRuleGrade: "0",
        degradeRuleCount: "",
        degradeRuleTimeWindow: "",
        flowRuleStatus: "0",
        flowRuleGrade: "0",
        flowRuleCount: 200,
        flowRuleControlBehavior: "0",
        flowRuleMaxQueueingTimeout: 500
      }
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.id = that.serviceApi.id;
    that.getServiceApiInfo(that.id);
  },
  methods: {
    degradeRuleCountplaceholderWord() {
      switch (this.formData.degradeRuleGrade) {
        case "0":
          return "响应时间超过本阈值,直接降级;单位/ms(毫秒)";
        case "1":
          return "异常比例超过本阈值,直接降级;应填写降级阈值为闭区间[0.0-1.0]数字";
        case "2":
          return "异常数量超过本阈值,直接降级;应该填写大于0的数字";
        default:
          break;
      }
    },
    getServiceApiInfo(id) {
      let that = this;
      that.$api
        .service_api_info({ id: id })
        .then(function(data) {
          if (data.respCode != 0) {
            that.$Message.error(data.message);
            that.$emit("error", "");
            return;
          }

          let serviceApi = data.data;
          // 返显到页面
          let formData = that.formData;

          formData.apiName = serviceApi.apiName;
          formData.apiCode = serviceApi.apiCode;
          formData.url = serviceApi.url;

          formData.flowRuleStatus = serviceApi.flowRuleStatus.toString();
          formData.flowRuleGrade = serviceApi.flowRuleGrade.toString();
          formData.flowRuleCount = serviceApi.flowRuleCount;
          formData.flowRuleControlBehavior = serviceApi.flowRuleControlBehavior.toString();
          formData.flowRuleMaxQueueingTimeout = serviceApi.flowRuleMaxQueueingTimeout.toString();

          formData.degradeRuleStatus = serviceApi.degradeRuleStatus.toString();
          formData.degradeRuleGrade = serviceApi.degradeRuleGrade.toString();
          formData.degradeRuleCount = serviceApi.degradeRuleCount;
          formData.degradeRuleTimeWindow = serviceApi.degradeRuleTimeWindow;
        })
        .catch(function(error) {});
    },
    handleSubmit() {
      this.$emit("finish", "");
    }
  }
};
</script>