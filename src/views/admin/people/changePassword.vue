<template>
  <div id="peopleList" class="only-content">
    <div>  
      <Form ref="form" :model="formData" :rules="ruleValidate" :label-width="100"
      >
        <Row :gutter="20">
            <Col span="12">
                <Col span="12">
                    <FormItem label="旧密码"  prop="id">
                        <Input type="password" placeholder="请输入旧密码" :disabled="isClick==0"/>
                    </FormItem>
                    <FormItem label="新密码" prop="bxCompanyName">
                        <Input type="password" placeholder="请输入新密码" :disabled="isClick==0"/>
                    </FormItem>
                    <FormItem label="再次输入密码" prop="agreementStartTime">
                      <Input type="password" placeholder="再次输入密码" :disabled="isClick==0"/>
                    </FormItem>
                </Col>
            </Col>
        </Row>
        <div id="button" class="mb-10">
          <Button
            @click="toHome()"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;margin-left: 3px"
          >取消
          </Button>
          <Button
            @click="handleSubmit('formCustom')"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;"
          >确定
          </Button>
        </div>
      </Form>
      
    </div>

  </div>
</template>

<script>
export default {
   data () {
    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        } else {
            if (this.formCustom.passwdCheck !== '') {
                // 对第二个密码框单独验证
                this.$refs.formCustom.validateField('passwdCheck');
            }
            callback();
        }
    };
    const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.formCustom.passwd) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
    };
    const validateAge = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('年龄不能为空'));
        }
        // 模拟异步验证效果
        setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            } else {
                if (value < 18) {
                    callback(new Error('必须年满18岁'));
                } else {
                    callback();
                }
            }
        }, 1000);
    };       
    return {
        formCustom: {
            passwd: '',
            passwdCheck: '',
            age: ''
        },
        ruleCustom: {
            passwd: [
                { validator: validatePass, trigger: 'blur' }
            ],
            passwdCheck: [
                { validator: validatePassCheck, trigger: 'blur' }
            ],
            age: [
                { validator: validateAge, trigger: 'blur' }
            ]
        }
    }
},
methods: {
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('提交成功!');
            } else {
                this.$Message.error('表单验证失败!');
            }
        })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    toChangePassword() {
      this.$router.push("change-Password");
    },
    toHome() {
      this.$router.push("home");
    }
  }
};
</script>

<style lang='less'>
#peopleList {
  .ivu-input-wrapper {
    width: 200px;
  }
  .ivu-select {
    width: 200px;
  }
  .border-bottom {
    border-bottom: 1px dashed #ddd;
  }
  margin-top: 10px;
  margin-left: 30%
}
#button
{
  margin-left: 9%
}

</style>
