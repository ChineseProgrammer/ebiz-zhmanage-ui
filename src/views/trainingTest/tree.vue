<template>
  <div class="tree-wrapper">
    <div class="add-root" @click="preappend">+</div>
    <Tree :data="data5" :render="renderContent" class="demo-tree-render"></Tree>
    <Modal v-model.trim="modelShow" title="题库类名" :loading="true" :closable="false" :width="900"
      :mask-closable="false">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="130">
        <Row class="user-row">
          <Col span="11">
          <FormItem label="题库类型名称" prop="name">
            <Input v-model.trim="formData.name" placeholder="请输入" :maxlength="20" />
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit">确认</Button>
        <Button @click="handleReset">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import GPI from "get-parent";
export default {
  props: { getNewNumber: Number },
  data() {
    return {
      modelShow: false,
      formData: {
        name: "",
      },
      ruleValidate: {
        name: [
          { required: true, message: "请输入题库名称", trigger: "blur" },
        ],
      },
      name: '',
      parentNameList: [],
      data5: [
      ],
      buttonProps: {
        type: 'default',
        size: 'small',
      },
      addArray: [],
      activeArray: [],
    }
  },
  watch: {
    getNewNumber() {
      this.getTree();
    }
  },
  created() {
  },
  methods: {
    getTree() {
      this.$api.questionBankTree({}).then(res => {
        if (res.data) {
          res.data.map(one => {
            one.level = 1;
            if (one.children) {
              one.children.map(two => {
                two.level = 2;
                if (two.children) {
                  two.children.map(three => {
                    three.level = 3;
                    if (three.children) {
                      three.children.map(four => {
                        four.level = 4;
                      })
                    }
                  })
                }
              })
            }
          })
          this.data5 = res.data;
        } else {
          this.data5 = [];
        }
        GPI.init('obj', this.data5);
        console.log(this.data5);
      })
    },
    renderContent(h, { root, node, data }) {
      let contentH = h('span', [
        h('span', {
          style: {
            // '-webkit-user-modify': 'read-write-plaintext-only'
            fontSize: '14px'
          },
          on: {
            click: () => { this.editThis(root, node, data) }
          }
        }, data.name)
      ]);
      let removeH = (node && node.children && node.children.length > 0) ? '' : h('Button', {
        props: Object.assign({}, this.buttonProps, {
          icon: 'ios-remove'
        }),
        style: {
          padding: 0,
          width: '20px',
          height: '20px'
        },
        on: {
          click: () => {
            this.remove(root, node, data)
          }
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
          }, [])
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
                marginLeft: '8px',
                padding: 0,
                width: '20px',
                height: '20px'
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
      this.modelShow = true;
      this.formData = {
        name: '',
        id: 0,
        level: data.level + 1,
        pid: data.id
      };
      data.expand = true;
      if(!data.children){
        this.$set(data, 'children', []);
      }
      this.activeArray = data.children;
    },
    preappend() {
      this.modelShow = true;
      this.formData = {
        name: '',
        id: 0,
        level: 1,
        pid: 0
      };
      this.activeArray = this.data5;
    },
    editThis(root, node, data) {
      this.modelShow = true;
      this.formData = data;
      console.log(data);
      this.activeArray = data.getParent();
      this.formData.oldName = data.name;
      // delete this.formData.children;
    },
    remove(root, node, data) {
      console.log(root, node, data);

      this.$api.deleteQuestionBankType({ id: data.id }).then((res) => {
        const parentKey = root.find(el => el === node).parent;
        if (parentKey) {
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          console.log(index);
          parent.children.splice(index, 1);
        } else {
          const index = this.data5.findIndex(one => { return one.nodeKey === node.nodeKey });
          console.log(index);
          this.data5.splice(index, 1);
        }
        this.data5 = [].concat(this.data5)
      });
    },
    handleSubmit() {
      this.$refs.formData.validate((valid) => {
        console.log(valid);
        if (valid) {
          console.log(this.formData);

          // 校验是否重复
          console.log(this.activeArray);
          if (this.activeArray && this.activeArray.length > 0) {
            let sameName = false;
            for (let i = 0; i < this.activeArray.length; i++) {
              let friend = this.activeArray[i];
              if (friend.id !== this.formData.id && friend.name === this.formData.name) {
                sameName = true;
                this.$util.showToast(this, 'error', '该类型已存在，请勿重复添加!')
                break;
              }
            }
            console.log(sameName);
            if (!sameName) {
              this.editName();
            }
          } else {
            this.editName();
          }

        } else {
          this.$emit("error", "");
        }
      });
    },
    editName() {
      let formData = JSON.parse(JSON.stringify(this.formData));
      delete formData.children;
      if (this.formData.id) {
        this.$api.editQuestionBankType(formData).then(res => {
          console.log(res);
          this.modelShow = false;
          this.data5 = [].concat(this.data5)
        })
      } else {
        this.$api.addQuestionBankType(formData).then(res => {
          let one = {
            name: res.data.name,
            expand: true,
            level: res.data.level,
            id: res.data.id,
            pid: res.data.pid
          }
          this.activeArray.push(one)
          this.data5 = [].concat(this.data5)
          this.modelShow = false;
          this.addArray.push(one)
        })
      }
    },
    handleReset() {
      if (this.formData.oldName) {
        this.formData.name = this.formData.oldName;
      }
      this.modelShow = false;
    },
    cancel() {
      this.addArray.map(one => {
        let params = { id: one.id };
        this.$api.deleteQuestionBankType(params).then(res => {
        })
      })
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
  margin: 8px 20px 0 50px;
  font-size: 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
