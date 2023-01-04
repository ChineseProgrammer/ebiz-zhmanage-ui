<template>
  <div class="tree-wrapper">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="130" style="width:100%;"
      label-position="left">
      <Col span="12">
      <FormItem prop="clueOrgCode" label="机构">
        <Select filterable clearable v-model.trim="formData.clueOrgCode" style="width: 100%" placeholder="请选择"
          @on-change="orgChange">
          <Option v-for="(item, index) in orgList" :value="item.creditCode" :key="index">{{ item.orgName }}</Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="机构代理人" prop="agentId">
        <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="formData.agentId">
          <Option v-for="item in agents" :value="item.userId" :key="item.userId" :disabled="item.disabled">{{ item.userName }}
          </Option>
        </Select>
      </FormItem>
      </Col>
    </Form>
  </div>
</template>
<script>

export default {
  props: { getNewNumber: Number, molds: Array, id: Number, orgList: Array, agentId: String },
  data() {
    return {
      modelShow: false,
      formData: {
        clueOrgCode: "",
        agentId: "",
        id: ""
      },
      // 多选题、判断题、单选题
      subjects: [
        {
          type: '单选题',
          name: '单选题'
        },
        {
          type: '多选题',
          name: '多选题'
        },
        {
          type: '判断题',
          name: '判断题'
        },
      ],
      ruleValidate: {
        clueOrgCode: [
          { required: true, message: "请选择机构", trigger: "blur" },
        ],
        agentId: [
          { required: true, message: "请选择代理人", trigger: "change" },
        ],
      },
      name: '',
      data5: [
      ],
      buttonProps: {
        type: 'default',
        size: 'small',
      },
      listStyle: {
        width: '302px',
        height: '300px'
      },
      agents: []
    }
  },
  watch: {
    getNewNumber: function (newVal, oldVal) {
      console.log("===",this.id);
      this.formData.id = this.id;
    },
  },
  created() {
  },
  updated() {
    console.log(this.orgList);
  },
  mounted() {
  },
  methods: {
    reset() {
      this.formData = {
        clueOrgCode: "",
        agentId: "",
        id: ""
      }
    },
    handleSubmit(fn) {
      this.$refs.formData.validate((valid) => {
        console.log(valid, this.formData);
        if (valid) {
          let index = this.agents.findIndex(one => {
            return one.userId === this.formData.agentId;
          })

          console.log(index);
          this.formData.agentName = this.agents[index].userName;
          this.$api.reallocate(this.formData).then(res => {
            fn && fn(true)
            this.reset();
          }).cartch(() => {
            fn && fn(false)
          })
        } else {
          fn && fn(false)
        }
      });
    },
    cancel() {
      this.reset();
    },
    orgChange(e) {
      console.log(e);
      if (e) {
        let index = this.orgList.findIndex(one => {
          return one.creditCode === e;
        })
        this.getAgentList(this.orgList[index].otherInfo10);
      }
    },
    getAgentList(orgCode) {
      this.$api.getAgentList({ orgCode: orgCode }).then((res) => {
        console.log(res,this.agentId);
        if (res) {
          res.data.map(one => {
            if(one.userId === this.agentId){
              one.disabled = true;
            }
          })
          this.agents = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
  }
}
</script>
<style scoped>
.tree-wrapper {
  display: flex;
}

.tree-wrapper >>> .ivu-form-item-label {
  padding-left: 10px;
}
</style>
