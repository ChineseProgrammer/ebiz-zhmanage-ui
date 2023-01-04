<template>
  <Form
    ref="formValidate"
    :model="formValidate"
    :rules="ruleValidate"
    :label-width="120"
  >
    <FormItem class="ivu-form-item-required" :label="$context.$t('rolename')" prop="roleName">
      <Input
        v-model="formValidate.roleName"
        :placeholder="$context.$t('pleaseEnter') + $context.$t('rolename')"
        :maxlength="50"
      />
    </FormItem>
    <FormItem class="ivu-form-item-required" label="角色描述" prop="remark">
      <Input
        v-model="formValidate.remark"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 100 }"
        :placeholder="$context.$t('pleaseEnter') + $context.$t('remarks')"
        :maxlength="200"
      />
    </FormItem>
     <FormItem label="数据权限" prop="otherInfo1">
           <RadioGroup v-model="formValidate.otherInfo1">
                <Radio label="0" >普通</Radio>
                <Radio label="1">高级</Radio>
            </RadioGroup>
        </FormItem>
  </Form>
</template>
<script>
export default {
  props: {
    // Formt:{
    //     type:Object,
    //     default:()=>{
    //         return {
    //             t_rolename: '',
    //             t_remark: '',
    //         }
    //     }
    // },
    formValidate: {
      type: Object,
      default: () => {
        return {
          roleName: "",
          remark: "",
          otherInfo1:'0'
        };
      },
    },
  },
  data() {
    return {
      edit: "edit",
      mark:false,
      ruleValidate: {
        roleName: [
         /*  {
            required: true,
            message:'请输入角色名称',
            trigger: "blur",
          }, */
          this.$util.rules.max(50, "输入限制50位")
        ],
        remark: [
          /* {
            required: true,
            message:'请输入角色描述',
            trigger: "blur",
          }, */
          // this.$util.rules.max(50, "输入限制50位")
        ],
        otherInfo1: [
          {
            required: true,
             message:'请选择数据权限',
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
  },
  computed: {},

  methods: {
    chooseMenu(data) {
      this.formValidate.parentId = data[0].id;
      this.parentMenuName = data[0].title;
    },
    /*
              提交
           */
    handleSubmit() {
      this.mark =true
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.saveRole();
        } else {
          this.$emit("error", "");
        }
      });
    },
    /*
               保存
            */
    saveRole() {
      //根据有无id判断是编辑还是添加
      let method = this.formValidate.id ? "updateRole" : "createRole";
      this.formValidate.systemType = 0;
      console.log(JSON.stringify(this.formValidate));
if(!this.formValidate.roleName){
    this.$emit("error", "");
return this.$Message.error("请输入角色名称");
} else if(!this.formValidate.remark){
    this.$emit("error", "");
return this.$Message.error("请输入角色描述");
}
      this.$api[method](this.formValidate)
        .then((res) => {
          if (res.respCode == 0 || res.result - 0 == 0) {
            this.$Message.success(this.$context.$t("success"));
            this.$emit("finish", "");
          } else {
            this.$emit("error", "");
            this.$Message.error(res.message);
          }
        })
        .catch((error) => {
          this.$emit("error", "");
        });
    },
    handleReset() {
      this.$refs.formValidate.resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.ivu-form-item-error {
  margin-bottom: 20px;
}


</style>
