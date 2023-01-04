<template>
  <div>
    <Modal
      v-model="modalFlag"
      title="审核"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="modalForm"
        :model="modalForm"
        inline
        :label-width="100"
        :rules="ruleValidate"
      >
        <FormItem label="审核结果" prop="auditResult">
          <Select
            clearable
            filterable
            placeholder="审核结果"
            v-model="modalForm.auditResult"
            @on-change="changeResult"
          >
            <Option
              v-for="item in auditResultList"
              :value="item.code"
              :key="item.code"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem
          prop="reason"
          label="原因描述"
          v-if="modalForm.auditResult == 1"
        >
          <Input
            placeholder="原因描述"
            v-model="modalForm.reason"
            type="textarea"
            :maxlength="200"
          />
        </FormItem>
      </Form>
      <p slot="footer" style="text-align: center">
        <Button @click="cancelModal()">取消 </Button>
        <Button type="primary" @click="sureSubmit()">确定 </Button>
      </p>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      modalFlag: false,
      auditResultList: [
        {
          code: '0',
          name: "通过",
        },
        {
          code: '1',
          name: "不通过",
        },
      ],
      modalForm: {
        auditResult: "",
        reason: "",
      },
      ruleValidate: {
        auditResult: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
      },
      paramData: {}, //携带参数
    };
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    changeResult(data) {
      this.modalForm.auditResult = data;
      this.modalForm.reason = "";
    },
    //打开
    openModal(paramData) {
      this.modalFlag = true;
      this.modalForm = {
        auditResult: "",
        reason: "",
      };
      this.$nextTick(() => {
        this.$refs.modalForm.resetFields();
      });
      this.paramData = paramData;
    },
    // 取消
    cancelModal() {
      this.modalFlag = false;
    },
    //确定
    sureSubmit() {
      this.$refs.modalForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.modalForm,
            ids: [this.paramData.id],
          };
          this.$api
            .sureAudit(data)
            .then((res) => {
              if (res.respCode == 0) {
                this.$Message.success("操作成功");
                this.cancelModal();
                this.$emit('sure')
              } else {
                this.$Message.error(res.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
</style>