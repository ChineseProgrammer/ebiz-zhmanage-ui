<template>
  <Form :label-width="120">
    <FormItem label="渠道名:">
      <Input v-model="formData.channelName" placeholder="渠道的中文名" />
    </FormItem>
    <FormItem label="渠道编码:">
      <Input v-model="formData.channelCode" placeholder="渠道的英文名(尽量使用缩写或简写),也是渠道的唯一标识" disabled />
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
  props: {
    channel: {
      type: Object
    }
  },

  data() {
    return {
      id: 0,
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
  mounted() {
    let that = this;
    that.id = that.channel.id;
    that.getChannelInfo(that.id);
  },
  methods: {
    getChannelInfo(id) {
      let that = this;
      that.$api
        .channel_info({ id: id })
        .then(function(data) {
          if (null == data.data) {
            that.$Message.error("无法获取到服务信息");
            that.$emit("error", "");
          }

          let channel = data.data;
          // 返显到页面
          let formData = that.formData;

          formData.channelName = channel.channelName;
          formData.channelCode = channel.channelCode;
          formData.authType = channel.authType.toString();
          formData.reqType = channel.reqType.toString();
          formData.resType = channel.resType.toString();
        })
        .catch(function(error) {});
    },
    handleSubmit() {
      this.modifyChannel();
    },
    modifyChannel() {
      let that = this;
      let formData = that.formData;
      let requestParam = {
        id: that.id,
        channelName: formData.channelName,
        channelCode: formData.channelCode,
        authType: formData.authType,
        reqType: formData.reqType,
        resType: formData.resType
      };

      that.$api
        .channel_modify(requestParam)
        .then(function(data) {
          if (data.respCode == 0) {
            that.$Message.success("修改成功！");
            that.$emit("finish", "");
          } else {
            that.$Message.error("修改失败," + data.message);
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