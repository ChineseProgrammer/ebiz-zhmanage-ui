<template>
  <div id="peopleList" class="only-content">
    <div>
      <Form ref="form" :model="formData" :label-width="100"
      >
        <Row :gutter="20">
            <Col span="12">
                <Col span="12">
                    <FormItem label="用户账号" prop="userName">
                        <Input v-model="formData.userName" disabled/>
                    </FormItem>
                    <FormItem label="用户角色" prop="roleName">
                        <Input v-model="formData.roleName" disabled/>
                    </FormItem>
                    <FormItem label="联系电话" prop="phoneNo">
                      <Input v-model="formData.phoneNo" disabled/>
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input v-model="formData.email" disabled/>
                    </FormItem>
                </Col>
            </Col>
        </Row>
        <div id="button" class="mb-10">
          <Button
            @click="toChangePassword()"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;margin-left: 3px"
          >修改密码
          </Button>
          <!-- <Button
            @click="toHome()"
            class="ivu-btn ivu-btn-primary"
            style="margin-bottom: 10px;width: 100px;"
          >确定
          </Button> -->
        </div>
      </Form>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
          userName: '',
          roleName:'',
          phoneNo: '',
          email: '',
      },
      roleList:[]
    };
  },
  created: function() {
    this.getRoleList()
      // this.geUserInfo()
  },
  mounted: function() {},
  watch: {},
  methods: {
    geUserInfo() {
      let userId = window.sessionStorage.getItem("userId")
      //调用接口
      this.$api.user_info({userId:userId}).then(res => {
        if (res.respCode == "0") {
          this.formData = res.data;
          let roleid = res.data.userRoleInSyses[0].roleId
          if(roleid == "0"){
            this.formData.roleName = "超级管理员"
          }else{
            this.roleList.map(item=>{
              if(item.id == roleid){
                this.formData.roleName = item.roleName
              }
            })
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    getRoleList(){
      this.$api.getRoleAllList({}).then(res=>{
        if(res.respCode=='0')
        {
          this.roleList=res.data;
          this.geUserInfo()

        }
      })
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

<style lang='less' scoped>
#peopleList {
  .ivu-input-wrapper {
    width: 200px;
  }
  .ivu-select {
    width: 200px;
  }
  /deep/ .ivu-input-disabled {
    color: black;
  }
  .border-bottom {
    border-bottom: 1px dashed #ddd;
  }
    .ivu-form-item-error-tip {
        width: 365px;
    }
  margin-top: 10px;
  margin-left: 30%

}
#button
{
  margin-left: 9%
}

</style>
