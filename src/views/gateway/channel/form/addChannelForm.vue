<template>
  <Form :label-width="120">
    <FormItem label="渠道名:">
      <Input v-model="formData.channelName" placeholder="渠道的中文名" />
    </FormItem>
    <FormItem label="渠道编码:">
      <Input v-model="formData.channelCode" placeholder="渠道的英文名(尽量使用缩写或简写),也是渠道的唯一标识" />
    </FormItem>
    <FormItem label="授权类型:">
      <RadioGroup v-model="formData.authType" size="large">
        <Radio label="token">token验证</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="请求类型:">
      <RadioGroup v-model="formData.reqType" size="large">
        <Radio label="json">json</Radio>
        <Radio label="xml">xml</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="返回类型:">
      <RadioGroup v-model="formData.resType" size="large">
        <Radio label="json">json</Radio>
        <Radio label="xml">xml</Radio>
      </RadioGroup>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        channelName: "",
        channelCode: "",
        authType: "token",
        reqType: "json",
        resType: "json"
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleSubmit() {
      this.addChannel();
    },
    addChannel() {
      let that = this;
      that.$api
        .channel_add(that.formData)
        .then(function(data) {
          if (data.data > 0) {
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