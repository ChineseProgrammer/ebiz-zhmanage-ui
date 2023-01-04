<template>
  <Form :label-width="120">
    <FormItem label="服务名:">
      <Input v-model="formData.serviceName" placeholder="服务的中文名" />
    </FormItem>
    <FormItem label="服务编码:">
      <Input v-model="formData.serviceCode" placeholder="服务的英文名,也是服务的唯一标识" />
    </FormItem>
    <FormItem label="服务Id(ServiceId):">
      <Input v-model="formData.serviceId" placeholder="注册中心里的服务名(也就是转发目标服务名)" />
    </FormItem>
    
  </Form>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        serviceName: "",
        serviceCode: "",
        serviceId: ""
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleSubmit() {
      this.addService();
    },
    addService() {
      let that = this;
      that.$api
        .service_add(that.formData)
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