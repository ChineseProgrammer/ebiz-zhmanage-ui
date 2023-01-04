<template>
  <div class="tree-wrapper">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="130" style="width:100%;"
      label-position="left">
      <Row>
        <Col span="12">
        <FormItem label="权重批次" prop="batch">
          <Input v-model="formData.batch" placeholder="请输入" :maxlength="20" :disabled="disabled" />
        </FormItem>
        </Col>
        <Col span="12">
        <FormItem label="权重起始时间" prop="start">
          <DatePicker type="datetime" :options="startOptions" format="yyyy-MM-dd HH:mm" placeholder="请选择"
            style="width:100%;" v-model="formData.start" :disabled="disabled"></DatePicker>
        </FormItem>
        </Col>
      </Row>
      <Row class="second-row">
        <Col span="12">
        <FormItem label="机构" prop="orgCode">
          <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="formData.orgCode"
            @on-change="orgChange" :disabled="disabled">
            <Option v-for="item in orgList" :value="item.creditCode" :key="item.creditCode">{{ item.orgName }}
            </Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="12">
        <div style="display:flex;text-align: right;" class="range-list-head">
          <div class="range-list-label">
            <p><span
                style="color:#ed4014;line-height: 1;margin-right: 4px;fonr-size:12px;display:inline-block;font-family: SimSun;">*</span>机构代理人权重
            </p>
            <div class="range-list-btn">注：所有代理人权重之和需为100%</div>
          </div>
          <div class="agent-list">
            <FormItem :label="item.userName" :prop="'agentsWeight.' + index + '.weight'"
              v-for="(item, index) in formData.agentsWeight" :key="index" :label-width="80">
              <Input v-model="item.weight" type="text" placeholder="请输入" :maxlength="20"
                :rules="{ required: true, message: '请输入代理人权重', trigger: 'blur' }" :disabled="item.disabled">
              <span slot="append">%</span>
              </Input>
            </FormItem>
          </div>
        </div>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>

export default {
  props: { getNewNumber: Number, molds: Array, batch: String,orgCode: String, orgList: Array },
  data() {
    return {
      modelShow: false,
      formData: {
        batch: "",
        start: undefined,
        orgCode: "",
        orgName: "",
        agentsWeight: []
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
        batch: [
          { required: true, message: "请输入权重批次", trigger: "blur" },
        ],
        orgCode: [
          { required: true, message: "请选择机构", trigger: "change" },
        ],
        start: [
          { required: true, type: 'date', message: "请选择权重起始时间", trigger: "change" },
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
      startOptions: {
        disabledDate(date) {
          console.log(date && date.valueOf() < Date.now())
          return date && date.valueOf() < Date.now();
        }
      },
      disabled: false
    }
  },
  watch: {
    getNewNumber: function (newVal, oldVal) {
      this.getOneWeight();
    },
  },
  created() {
  },
  mounted() { },
  methods: {
    orgChange(e) {
      if (e) {
        let index = this.orgList.findIndex(one => {
          return one.creditCode === e;
        })
        this.getAgentList(this.orgList[index].otherInfo10);
      }
    },
    getOneWeight() {
      if (this.batch && this.batch != 0) {
        this.disabled = true;
        this.$api.getOneWeight({ batch: this.batch,orgCode:this.orgCode }).then(res => {
          res.data.agentsWeight.map(one => {
            if (!one.weight) {
              one.weight = '0.00';
            } else {
              one.weight = this.toFixedTwo(one.weight / 100);
            }
          })
          this.formData = res.data
          this.orgChange(res.data.orgCode);
        })
      } else {
            let date = new Date();
            date.setDate(date.getDate() +1);
            let  year = date.getFullYear();
            let month = date.getMonth() + 1;
            if( month <10){
                month = '0' + month;
            }
            let day = date.getDate();
            if( day < 10){
                day = '0' + day;
            }
        this.formData.start = year + "-" + month + "-" + day +" 00:00:00";
        this.disabled = false;
      }
    },
    toFixedTwo(str) {
      const tails = 2;
      if (str === 0 || str === '0' || str === '0.0' || str === '0.00') {
        return '0.'.padEnd(tails + 2, '0');
      }
      if (!str) {
        return '-'
      }

      if (str) {
        str = str.toString();
        if (isNaN(Number(str))) {
          return '-'
        }
      }
      str = Math.round(Number(str) * 100) / 100 + '';
      let pointIndex = str.indexOf(".");
      if (pointIndex === -1) {
        return str + '.'.padEnd(tails + 1, '0');
      } else {
        let tailLength = str.split('.')[1].length;
        for (let i = 0; i < (tails - tailLength); i++) {
          str += '0';
        }
        return str;
      }
    },
    getAgentList(orgCode) {
      this.$api.getAgentList({ orgCode: orgCode }).then((res) => {
        if (res) {
          if(this.batch && this.batch != 0){
            this.formData.agentsWeight.map(one => {
              let has = false;
              for (let i = 0; i < res.data.length; i++) {
                const element = res.data[i];
                if(one.userId === element.userId){
                  has = true;
                  break;
                }
              }
              if(!has){
                one.disabled = true;
              }
            })
            this.formData.agentsWeight = [].concat(this.formData.agentsWeight);
          } else {
            res.data.map(one => {
              one.weight = '0.00';
            })
            this.formData.agentsWeight = res.data;
          }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    },
    init() {
    },
    reset() {
      this.formData = {
        batch: "",
        start: "",
        orgCode: "",
        orgName: "",
        agentsWeight: []
      }
    },
    handleSubmit(fn) {
      this.$refs.formData.validate((valid) => {
        let formData = JSON.parse(JSON.stringify(this.formData));
        if (valid) {
          formData.start = this.formatDate(formData.start);
          console.log("----",formData.start)
          let orgIndex = this.orgList.findIndex(one => {
            return one.creditCode === formData.orgCode;
          })
          formData.orgName = this.orgList[orgIndex].orgName;
          let totalPercent = 0;
          formData.agentsWeight.map(one => {
            delete one.id;
            totalPercent += parseFloat(one.weight);
            one.weight *= 100;
            return one;
          })
          if (totalPercent === 100) {
            if (this.batch && this.batch != 0) {
              this.$api.editWeight(formData).then(res => {
                fn(true)
                this.reset();
              })
            } else {
              this.$api.addWeight(formData).then(res => {
                fn(true)
                this.reset();
              })
            }
          } else {
            this.$Message.error('该机构下所有代理人权重之和需为100%');
            fn(false)
          }
        } else {
          fn(false)
        }
      });
    },
    cancel() {
      this.reset();
    },
    formatDate(date) {
      let d = new Date(date);
      let time = d.getFullYear()
        + "-" + (d.getMonth() + 1).toString().padStart(2, 0)
        + "-" + d.getDate().toString().padStart(2, 0)
        + " " + d.getHours().toString().padStart(2, 0)
        + ':' + d.getMinutes().toString().padStart(2, 0)
        + ':' + d.getSeconds().toString().padStart(2, 0)
      return time;
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

.range-list-btn {
  margin-top: 10px;
  color: #f40000;
}

.agent-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  overflow: auto;
  padding-right: 10px;
}
.second-row {
  display: flex;
  align-items: center;
}
.range-list-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 130px;
  padding: 10px 12px 10px 10px;
  flex-shrink: 0;
  text-align: left;
}
</style>
