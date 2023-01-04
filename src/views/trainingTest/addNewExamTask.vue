<template>
  <div class="tree-wrapper">
    <Form ref="formData" :model="formData" :disabled="scanFlag" :rules="ruleValidate" :label-width="130" style="width:100%;"
      label-position="left">
      <Col span="12">
      <FormItem label="考试主题" prop="title">
        <Input v-model="formData.title" placeholder="请输入" :maxlength="20" />
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="考试时长(min)" prop="mins">
        <Input v-model="formData.mins" placeholder="请输入" type="number" :maxlength="20"
          @input="inputChange($event, 'mins')" />
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="及格分数" prop="pass">
        <Input v-model="formData.pass" placeholder="请输入" type="number" :maxlength="20"
          @input="inputChange($event, 'pass')" />
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="是否上架" prop="enable">
        <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="formData.enable">
          <Option v-for="item in enables" :value="item.id" :key="item.id">{{ item.name }}
          </Option>
        </Select>
      </FormItem>
      </Col>
      <Col span="24">
      <div style="display:flex;text-align: right;" class="range-list-head">
        <div style="width:130px;" class="range-list-label"><span
            style="color:#ed4014;line-height: 1;margin-right: 4px;fonr-size:12px;display:inline-block;font-family: SimSun;">*</span>题目范围
        </div>
        <div class="range-list-btn"><Button @click="addQuestion" type="primary">新增题目</Button>注：试卷满分需为100分</div>
      </div>
      <table class="range-table">
        <thead>
          <tr>
            <th>题型</th>
            <th>大类</th>
            <th>二类</th>
            <th>三类</th>
            <th>四类</th>
            <th>题目数量</th>
            <th>单题分值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in formData.rangeList" :key="index">
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.subject'"
                :rules="{ required: true, message: '请选择题型', trigger: 'change' }">
                <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="item.subject">
                  <Option v-for="item in subjects" :value="item.type" :key="item.type">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.type1'">
                <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="item.type1"
                  @on-change="getQuestionBankList($event, item, 2)">
                  <Option v-for="item in questionBank1" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.type2'">
                <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="item.type2"
                  @on-change="getQuestionBankList($event, item, 3)">
                  <Option v-for="item in item.questionBank2" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.type3'">
                <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="item.type3"
                  @on-change="getQuestionBankList($event, item, 4)">
                  <Option v-for="item in item.questionBank3" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.type4'">
                <Select clearable filterable style="width:100%;" placeholder="请选择" v-model="item.type4">
                  <Option v-for="item in item.questionBank4" :value="item.id" :key="item.id">{{ item.name }}
                  </Option>
                </Select>
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.total'">
                <Input v-model="item.total" type="number" placeholder="请输入" :maxlength="20" />
              </FormItem>
            </td>
            <td>
              <FormItem label="" :label-width="0" :prop="'rangeList.' + index + '.point'">
                <Input v-model="item.point" type="number" placeholder="请输入" :maxlength="20" />
              </FormItem>
            </td>
            <td>
              <Button type="primary" @click="delQuestionBank(item, index)" v-if="formData.rangeList.length > 0"
                style="margin: 0 0 24px 10px;">删除</Button>
            </td>
          </tr>
        </tbody>
      </table>
      </Col>
    </Form>
  </div>
</template>
<script>
export default {
  props: { getNewNumber: Number, enables: Array, id: Number, scanFlag: Boolean },
  data() {
    const oneRange = {
      subject: '',
      type1: '',
      type2: '',
      type3: '',
      type4: '',
      total: '',
      point: '',
      questionBank2: [],
      questionBank3: [],
      questionBank4: [],
    };
    return {
      modelShow: false,
      formData: {
        title: "",
        mins: '',
        enable: '',
        pass: '',
        rangeList: [JSON.parse(JSON.stringify(oneRange))]
      },
      oneRange: oneRange,
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
        title: [
          { required: true, message: "请输入考试主题", trigger: "blur" },
        ],
        enable: [
          { required: true, message: "请选择是否上架", trigger: "change" },
        ],
        mins: [
          { required: true, message: "请输入考试时长", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "请输入及格分数", trigger: "blur" },
        ],
        rangeList: [
          { required: true, message: "请选择题目范围", trigger: "change" },
        ],
      },
      name: '',
      buttonProps: {
        type: 'default',
        size: 'small',
      },
      loadNum: 0,
      questionBank1: [],
    }
  },
  watch: {
    getNewNumber: function (newVal, oldVal) {
      this.init();
    },
    loadNum: function (newVal) {
      if (newVal === 1) {
        if (this.id) {
          this.$api.getExamTask({ id: this.id }).then(res => {
            let data = res.data.list[0];
            if (data) {
              this.formData = data;
              console.log(this.formData);
              this.formData.enable += '';
              this.formData.mins += '';
              this.formData.score += '';
              this.formData.pass += '';
              this.formData.rangeList.map(one => {
                this.getQuestionBankList(one.type1, one, 2, true, () => {
                  this.getQuestionBankList(one.type2, one, 3, true, () => {
                    this.getQuestionBankList(one.type3, one, 4, true, () => {
                      this.formData.rangeList = [].concat(this.formData.rangeList)
                    });
                  });
                });
              })
            }
          })
        }
      }
    }
  },
  created() {
    this.init();
  },
  mounted() { },
  methods: {
    init() {
      this.loadNum = 0;
      this.getQuestionBankList(0, this.formData.rangeList[0], 1);
    },
    inputChange(e, key) {
      e = e.replace(/[^0-9]/gi, "");
      this.formData[key] = e.replace(/^0?/g, '');
    },
    reset() {
      console.log("---");
      this.formData = {
        title: "",
        mins: '',
        mold: '',
        start: '',
        end: '',
        rangeList: [JSON.parse(JSON.stringify(this.oneRange))]
      }
    },
    getQuestionBankList(pid, item, level, doNotClear, fn) {
      pid = pid || 0;
      this.$api.questionBankTypeList({ pid: pid, level: level }).then(res => {
        console.log(res);
        if (level === 1) {
          this.questionBank1 = res.data;
          if (!doNotClear) {
            item.questionBank2 = [];
            item.questionBank3 = [];
            item.questionBank4 = [];
            item.type2 = '';
            item.type3 = '';
            item.type4 = '';
          }
          this.loadNum++;
        } else if (level === 2) {
          item.questionBank2 = res.data;
          if (!doNotClear) {
            item.questionBank3 = [];
            item.questionBank4 = [];
            item.type2 = '';
            item.type3 = '';
            item.type4 = '';
          }
        } else if (level === 3) {
          item.questionBank3 = res.data;
          if (!doNotClear) {
            item.questionBank4 = [];
            item.type3 = '';
            item.type4 = '';
          }
        } else if (level === 4) {
          item.questionBank4 = res.data;
          if (!doNotClear) {
            item.type4 = '';
          }
        }
        this.formData.rangeList = [].concat(this.formData.rangeList)
        fn && fn();
      })
    },
    render3(item) {
      return item.label + ' - ' + item.mobile;
    },
    renderContent(h, { root, node, data }) {
      let contentH = h('span', [
        h('span', {
          // style: {
          //   '-webkit-user-modify': 'read-write-plaintext-only'
          // },
          on: {
            click: () => { this.editThis(root, node, data) }
          }
        }, data.name)
      ]);
      let removeH = h('Button', {
        props: Object.assign({}, this.buttonProps, {
          icon: 'ios-remove'
        }),
        on: {
          click: () => { this.remove(root, node, data) }
        }
      })
      if (data.level >= 4) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          contentH,
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginLeft: '32px'
            }
          }, [
            removeH
          ])
        ]);
      } else {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
          contentH,
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginLeft: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add'
              }),
              style: {
                marginLeft: '8px'
              },
              on: {
                click: () => { this.append(data) }
              }
            }),
            removeH
          ])
        ]);
      }
    },
    append(data) {
      const children = data.children || [];
      let name = '';
      if (data.level === 1) {
        name = '题库二类'
      } else if (data.level === 2) {
        name = '题库三类'
      } else if (data.level === 3) {
        name = '题库四类'
      }
      this.$api.addQuestionBankType({
        name: name,
        expand: true,
        level: data.level + 1,
        pid: data.id
      }).then(res => {
        children.push({
          id: res.data.id,
          pid: res.data.pid,
          name: res.data.name,
          expand: true,
          level: res.data.level
        });
        this.$set(data, 'children', children);
        this.modelShow = false;
      })
    },
    editThis(root, node, data) {
      this.modelShow = true;
      this.formData = JSON.parse(JSON.stringify(data));
      delete this.formData.children;
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    handleSubmit(fn) {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          let totalScore = 0;

          for (let i = 0; i < this.formData.rangeList.length; i++) {
            const element = this.formData.rangeList[i];
            totalScore += parseFloat(element.total) * parseFloat(element.point);
            let targetNum = 0;
            for (let j = 0; j < element.questionBank4.length; j++) {
              const element2 = element.questionBank4[j];
              if (element2.id == element.type4) {
                if (element2.subjectMap[element.subject]) {
                  targetNum = element2.subjectMap[element.subject];
                }
                break;
              }
            }
            if (element.total > targetNum) {
              alert('第 ' + (i + 1) + ' 行题库里面只有 ' + targetNum + ' 道' + element.subject);
              fn(false)
              return;
            }
          }

          // 检查题目范围多行不能有相同的题目和题库
          for (let i = 0; i < this.formData.rangeList.length - 1; i++) {
            let one = this.formData.rangeList[i]
            for (let j = i + 1; j < this.formData.rangeList.length; j++) {
              let two = this.formData.rangeList[j];
              if(one.subject === two.subject && one.type4 === two.type4){
                this.$util.showToast(this, 'warning', '第 ' + (i + 1) + ' 行和第 '+ (j + 1) +' 行的题型、题库类型相同，请修改！')
                fn(false)
                return;
              }
            }
          }

          if (totalScore != 100) {
            fn(false)
            alert("试卷满分需为100分")
          } else {
            let formData = JSON.parse(JSON.stringify(this.formData));
            formData.rangeList.map(one => {
              delete one.questionBank2;
              delete one.questionBank3;
              delete one.questionBank4;
            })
            formData.type = 'new';
            console.log(formData);
            if (formData.id) {
              this.$api.updateExamTask(formData).then(res => {
                fn(true)
                this.reset();
              })
            } else {
              this.$api.addNewExamTask(formData).then(res => {
                fn(true)
                this.reset();
              })
            }
          }
        } else {
          fn(false)
          this.$emit("error", "");
        }
      });
    },
    cancel() {
      this.reset();
    },
    addQuestion() {
      this.formData.rangeList.push(JSON.parse(JSON.stringify(this.oneRange)));
    },
    formatDate(date) {
      let d = new Date(date);
      return d.getFullYear()
        + "-" + (d.getMonth() + 1).toString().padStart(2, 0)
        + "-" + d.getDate().toString().padStart(2, 0)
        + " " + d.getHours().toString().padStart(2, 0)
        + ':' + d.getMinutes().toString().padStart(2, 0)
        + ':' + d.getSeconds().toString().padStart(2, 0);
    },
    delQuestionBank(item, index) {
      this.formData.rangeList.splice(index, 1);
    }
  }
}
</script>
<style scoped>
.tree-wrapper {
  display: flex;
}

.add-root {
  border: 1px solid #ccc;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-top: 8px;
  margin-right: 10px;
}

.tree-wrapper>>>.ivu-transfer-operation {
  margin: 0 26px;
  width: 82px;
}

.tree-wrapper>>>.ivu-transfer-operation .ivu-btn {
  margin: 0 auto 12px;
}

.range-list-head {
  display: flex;
  margin-bottom: 24px;
}

.range-list-label {
  width: 130px;
  text-align: right;
  padding: 10px 12px 10px 10px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 1;
}

.range-list-btn {
  display: flex;
  align-items: center;
}

.range-table td {
  padding: 5px;
}

.tree-wrapper>>>.ivu-form-item-label {
  padding-left: 10px;
}
</style>
