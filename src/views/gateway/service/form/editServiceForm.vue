<template>
  <Form :label-width="120">
    <FormItem label="id:">
      <Input v-model="id" disabled />
    </FormItem>
    <FormItem label="服务名:">
      <Input v-model="formData.serviceName" placeholder="服务的中文名" />
    </FormItem>
    <FormItem label="服务编码:">
      <Input v-model="formData.serviceCode" placeholder="服务的英文名,也是服务的唯一标识" disabled />
    </FormItem>
    <FormItem label="服务Id(ServiceId):">
      <Input v-model="formData.serviceId" placeholder="注册中心里的服务名(也就是转发目标服务名)" />
    </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    service: {
      type: Object
    }
  },
  data() {
    return {
      id: 0,
      formData: {
        serviceName: "",
        serviceCode: "",
        serviceId: ""
      }
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.id = that.service.id;
    that.getServiceInfo(that.id);
  },
  methods: {
    getServiceInfo(id) {
      let that = this;
      that.$api
        .service_info({ id: id })
        .then(function(data) {
          if (null == data.data) {
            that.$Message.error("无法获取到服务信息");
            that.$emit("error", "");
          }

          let service = data.data;
          // 返显到页面
          let formData = that.formData;

          formData.serviceName = service.serviceName;
          formData.serviceCode = service.serviceCode;
          formData.serviceId = service.serviceId;
        })
        .catch(function(error) {});
    },
    handleSubmit() {
      this.modifyService();
    },
    modifyService() {
      let that = this;
      let formData = that.formData;
      let requestParam = {
        id: that.id,
        serviceName: formData.serviceName,
        serviceId: formData.serviceId
      };

      that.$api
        .service_modify(requestParam)
        .then(function(data) {
          if (data.data > 0) {
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