<template>
  <Form :label-width="120">
    <FormItem label="接口名:">
      <Input v-model="formData.apiName" placeholder="接口的中文名" />
    </FormItem>
    <FormItem label="接口编码:">
      <Input v-model="formData.apiCode" placeholder="接口的英文名,也是接口的唯一标识" />
    </FormItem>
    <FormItem label="url:">
      <Input v-model="formData.url" placeholder="接口的访问路径" />
    </FormItem>

    <FormItem label="是否开启限流功能:">
      <i-switch v-model="formData.flowRuleStatus" size="large" true-value="1" false-value="0">
        <span slot="open">启用</span>
        <span slot="close">禁用</span>
      </i-switch>
    </FormItem>
    <FormItem label="限流方式:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleGrade" size="large">
        <Radio label="0">QPS限流</Radio>
        <Radio label="1">线程限流</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="限流阈值:" v-if="formData.flowRuleStatus == 1">
      <Input v-model="formData.flowRuleCount" placeholder="每秒访问量" />
    </FormItem>
    <FormItem label="流控效果:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleControlBehavior" size="large">
        <Radio label="0">直接拒绝</Radio>
        <Radio label="1" disabled>Warm Up(预热/冷启动)</Radio>
        <Radio label="2">排队等候(匀速排队)</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      label="排队超时时间:"
      v-if="formData.flowRuleStatus == 1 && formData.flowRuleControlBehavior == 1"
    >
      <Input v-model="formData.flowRuleMaxQueueingTimeout" placeholder="排队超时时间" />
    </FormItem>
    <FormItem label="额外允许的请求数:" v-if="formData.flowRuleStatus == 1">
      <Input v-model="formData.flowRuleBurst" placeholder="应对突发请求时额外允许的请求数目" disabled />
    </FormItem>
    <FormItem label="参数限流的策略:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleParseStrategy" size="large">
        <Radio label="IP" disabled>IP</Radio>
        <Radio label="Host" disabled>Host</Radio>
        <Radio label="Header" disabled>Header</Radio>
        <Radio label="URLParam" disabled>URL Param</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="参数限流字段名:" v-if="formData.flowRuleStatus == 1">
      <Input v-model="formData.flowRuleFieldName" placeholder="对应的 header 名称或 URL 参数字段名" disabled />
    </FormItem>
    <FormItem label="参数值的匹配模式:" v-if="formData.flowRuleStatus == 1">
      <Input v-model="formData.flowRuleFieldName" placeholder="参数值的匹配模式" disabled />
    </FormItem>
    <FormItem label="参数限流的策略:" v-if="formData.flowRuleStatus == 1">
      <RadioGroup v-model="formData.flowRuleParseStrategy" size="large">
        <Radio label="0" disabled>精确匹配</Radio>
        <Radio label="1" disabled>子串匹配</Radio>
        <Radio label="2" disabled>正则匹配</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="是否开启降级功能:">
      <i-switch v-model="formData.degradeRuleStatus" size="large" true-value="1" false-value="0">
        <span slot="open">启用</span>
        <span slot="close">禁用</span>
      </i-switch>
    </FormItem>
    <FormItem label="降级方式:" v-if="formData.degradeRuleStatus == 1">
      <RadioGroup v-model="formData.degradeRuleGrade" size="large">
        <Radio label="0">RT响应时间(降级阈值为毫秒数)</Radio>
        <Radio label="1">异常比例(降级阈值为闭区间[0.0-1.0])</Radio>
        <Radio label="2">异常数(降级阈值异常数量)</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="降级阈值:" v-if="formData.degradeRuleStatus == 1">
      <Input
        v-model="formData.degradeRuleCount"
        :placeholder="degradeRuleCountplaceholderWord()"
        class="red-placeholder"
      />
    </FormItem>
    <FormItem label="时间窗口:" v-if="formData.degradeRuleStatus == 1">
      <Input v-model="formData.degradeRuleTimeWindow" placeholder="单位/秒 必须大于0的整数" />
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    parentServiceId: {
      type: Number
    }
  },
  data() {
    return {
      serviceId: 0,
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
        flowRuleMaxQueueingTimeout: 500,
        flowRuleBurst: ""
      }
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.serviceId = that.parentServiceId;
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
    handleSubmit() {
      this.addServiceApi();
    },
    addServiceApi() {
      let that = this;
      let param = that.formData;
      that.$set(that.formData, "serviceId", that.serviceId);
      that.$api
        .service_api_add(param)
        .then(function(data) {
          if (data.respCode == 0) {
            that.$Message.success("新增成功！");
            that.$emit("finish", "");
          } else {
            that.$Message.error("新增失败," + data.message);
            that.$emit("error", "");
          }
        })
        .catch(function(error) {
          that.$Message.warning("调用接口失败！");
          that.$emit("error", "");
        });
    }
  }
};
</script>