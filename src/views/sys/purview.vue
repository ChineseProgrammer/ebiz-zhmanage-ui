<template>
    <div>
        <div style="width:50%">
            <Form ref="formInline" :model="params" inline :label-width="110">
                <!-- <FormItem prop="jdCompanyName" label="请选择公司机构">
                    <Select v-model="company" style="width:200px">
                        <Option value="1">隽天</Option>
                        <Option value="2">B公司机构</Option>
                    </Select>
                </FormItem> -->
                <FormItem prop="jdCompanyCode" label="请选择角色">
                    <Select v-model="role" style="width:200px" @on-change="roleChange">
                        <Option value="0">管理员</Option>
                        <Option value="1">内勤人员</Option>
                        <Option value="2">外勤人员</Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
        <div class="mb-10" style="height:400px;overflow-y:auto;width:50%">
            <Tree :data="data1" show-checkbox></Tree>
        </div>
        <div>
            <Button type="primary">保存</Button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import userForm from "./form/userForm";
import { parse } from "path";
import route from "../../../mock/route.json"

export default {
  data() {
    return {
        company:"",
        role:"",
        params: {
        query: false,
        userName: "",
        realName: "",
        pageSize: 10,
        page: 1,
        systemType: 0
        },
        depTreeData: [],
        total: 0,
        selectIds: [],
        tableList: [],
        roleList: [],
        data1:[]
    };
  },
  created: function() {

  },
  mounted: function() {

  },
  methods: {
    roleChange(){
        console.log(this.role)
        if(this.role == "0"){
            this.data1 = route.data1
        }else if(this.role == "1"){
            this.data1 = route.data2
        }else if(this.role == "2"){
            this.data1 = route.data3
        }
    },
    //加载用户列表e
    getUserList() {
      if (this.query) {
        this.params.userName = this.params.userName.trim();
        this.params.realName = this.params.realName.trim();
        var option = this.params;
      } else {
        var option = {};
        option.page = this.params.page;
        option.pageSize = this.params.pageSize;
        option.systemType = 0;
      }

      this.$api.getUserList(option).then(res => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.count;
          this.tableList = res.data.list;
          for (var i = 0; i < this.tableList.length; i++) {
            if (this.tableList[i].userName == "adminCenter") {
              this.tableList[i]._disabled = true;
            }
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    }
  },
  filters: {},
  components: {
    userForm
  }
};
</script>

<style lang='less'>
#menu_index {
}
</style>

