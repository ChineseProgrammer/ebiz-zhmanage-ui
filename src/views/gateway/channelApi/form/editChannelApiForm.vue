<template>
  <Form :label-width="120">
    <FormItem label="id:">
      <Input v-model="id" disabled />
    </FormItem>
    <FormItem label="所属服务:">
      <Select
        v-model="formData.serviceId"
        @on-change="serviceListChange"
        filterable
        placeholder="请选择服务"
      >
        <Option
          v-for="(service,index) in serviceList"
          :value="service.id"
          :key="index"
        >{{ service.serviceName }}</Option>
      </Select>
    </FormItem>
    <FormItem label="所属接口:">
      <Select v-model="formData.serviceApiId" filterable placeholder="请选择接口">
        <Option
          v-for="(serviceApi,index) in serviceApiList"
          :value="serviceApi.id"
          :key="index"
        >{{ serviceApi.apiName }}</Option>
      </Select>
    </FormItem>

    <FormItem label="是否需要验证:">
      <i-switch v-model="formData.needAuth" size="large" true-value="1" false-value="0">
        <span slot="open">需要</span>
        <span slot="close">无需</span>
      </i-switch>
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;本渠道的验证方式为:
        <font color="red">{{channelInfo.authType}}</font>
      </span>
    </FormItem>

    <FormItem label="接口编码:">
      <RadioGroup v-model="formData.charset" size="large">
        <Radio label="utf-8">utf-8</Radio>
        <Radio label="gbk">gbk</Radio>
        <Radio label="gb2312">gb2312</Radio>
        <Radio label="iso-8859-1">iso-8859-1</Radio>
      </RadioGroup>
    </FormItem>

    <FormItem label="加/解密方式:">
      <RadioGroup v-model="formData.decipherType" size="large">
        <Radio label="text">明文</Radio>
        <Radio label="Base64">Base64</Radio>
        <Radio label="MD5">MD5</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="请求报文模板:">
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;本渠道的请求方式为:
        <font color="red">{{channelInfo.reqType}}</font>
      </span>
      <Input
        v-model="formData.reqTemplate"
        type="textarea"
        :autosize="{minRows: 6,maxRows: 100}"
        placeholder="请输入请求报文模板,为空则视为不转换"
      />
    </FormItem>
    <FormItem label="返回报文模板:">
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;本渠道的返回方式为:
        <font color="red">{{channelInfo.resType}}</font>
      </span>
      <Input
        v-model="formData.resTemplate"
        type="textarea"
        :autosize="{minRows: 6,maxRows: 100}"
        placeholder="请输入返回报文模板,为空则视为不转换"
      />
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    channelApi: {
      type: Object
    }
  },
  data() {
    return {
      id: 0,
      channelId: 0,
      channelInfo: {},
      formData: {
        serviceId: "",
        serviceApiId: "",
        needAuth: "1",
        charset: "utf-8",
        decipherType: "text",
        reqTemplateType: "",
        reqTemplate: "",
        resTemplateType: "",
        resTemplate: ""
      },
      serviceList: [],
      serviceApiList: []
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.id = that.channelApi.id;

    // 获取所有的服务列表
    that.getServiceList();

    that.getChannelApiInfo(that.id);
  },
  methods: {
    getServiceList() {
      let that = this;
      that.$api
        .service_list({})
        .then(function(data) {
          if (data.respCode == 0) {
            that.serviceList = data.data;
          }
        })
        .catch(error => {});
    },
    serviceListChange(selectData) {
      let that = this;
      that.$api
        .service_api_list({ serviceId: selectData })
        .then(function(data) {
          if (data.respCode == 0) {
            that.serviceApiList = data.data;
          }
        })
        .catch(error => {});
    },
    getChannelInfo() {
      let that = this;
      that.$api
        .channel_info({ id: that.channelId })
        .then(function(data) {
          if (data.respCode == 0) {
            that.channelInfo = data.data;
          }
        })
        .catch(error => {});
    },
    getChannelApiInfo(id) {
      let that = this;
      that.$api
        .channel_api_info({ id: id })
        .then(function(data) {
          if (data.respCode != 0) {
            that.$Message.error(data.message);
            that.$emit("error", "");
            return;
          }

          let channelApi = data.data;
          // 返显到页面
          let formData = that.formData;

          formData.serviceId = channelApi.serviceId;
          formData.serviceApiId = channelApi.serviceApiId;
          formData.needAuth = channelApi.needAuth.toString();
          formData.charset = channelApi.charset.toString();
          formData.decipherType = channelApi.decipherType.toString();
          formData.reqTemplateType = channelApi.reqTemplateType.toString();
          formData.reqTemplate = channelApi.reqTemplate;
          formData.resTemplateType = channelApi.resTemplateType.toString();
          formData.resTemplate = channelApi.resTemplate;
          that.channelId = channelApi.channelId;
          that.serviceListChange(channelApi.serviceId);
          // 获取父渠道信息
          that.getChannelInfo();
        })
        .catch(function(error) {});
    },
    handleSubmit() {
      this.modifyChannelApi();
    },
    modifyChannelApi() {
      let that = this;
      let formData = that.formData;
      let requestParam = {
        id: that.id,
        serviceId: formData.serviceId,
        serviceApiId: formData.serviceApiId,
        needAuth: formData.needAuth,
        charset: formData.charset,
        decipherType: formData.decipherType,
        reqTemplateType: formData.reqTemplateType,
        reqTemplate: formData.reqTemplate,
        resTemplateType: formData.resTemplateType,
        resTemplate: formData.resTemplate
      };

      that.$api
        .channel_api_modify(requestParam)
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