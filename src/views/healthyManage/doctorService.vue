<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="姓名" prop="userName">
            <Input v-model="params.userName" placeholder="请输入姓名" />
          </FormItem>
          <FormItem prop="cellPhoneNumber" label="手机号">
            <Input placeholder="请输入手机号" v-model="params.cellPhoneNumber" />
          </FormItem>
          <FormItem prop="email" label="预约时间">
             <DatePicker
                type="daterange"
                v-model.trim="searchTime"
                placement="bottom-end"
                placeholder="请选择"
                @on-change="timeChange"
              ></DatePicker>
          </FormItem>
          <FormItem  label="代理人机构">
            <Select
              clearable
              filterable
              style="width:162px"
              placeholder="请选择代理人机构"
              v-model="params.organizationCode"
            >
              <Option
                v-for="item in companyList"
                :value="item.creditCode"
                :key="item.creditCode"
                >{{ item.orgName }}</Option
              >
            </Select>
          </FormItem>
           <i-col class="float-right">
            <Button
              type="primary"
              @click="search(1)"
              style="margin-left:10px"
              >{{ $t("query") }}</Button
            >
            <Button type="default" @click="resertMo">{{ $t("reset") }}</Button>
          </i-col>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable
          :columns="columns"
          :data="tableList"
          :total="total"
          :pageSize="params.pageSize"
          ref="primaryTable"
          @on-edit="editUser"
          @on-del="delUser"
          @on-change="changePage"
          class="wholeTable"
          @on-page-size-change="changeSize"
        >
        </primaryTable>
      </div>

    </div>
  </div>
</template>

<script>
import { parse } from "path";

export default {
  data() {
    return {
       searchTime: [],
        button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {
        phoneNo: "",
        userName: "",
        realName: "",
        status: "",
        idLst: "",
        customerId:"",
        pageSize: 10,
        page: 1,
      },
      depTreeData: [],
      total: 0,
      selectIds: [],
      tableList: [],
      roleList: [],
      companyList: [],
      searchData: [],
      deptList: [],
      columns:[
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "客户id",
          align: "center",
          minWidth: 100,
          key: "userId",
        },
        {
          title: "姓名",
          align: "center",
          minWidth: 100,
          key: "userName",
        },
        {
           title: "手机号",
          align: "center",
          minWidth: 100,
          ellipsis: true,
          key: "cellPhoneNumber",
        },
        {
          title: "预约时间",
          align: "center",
          minWidth: 120,
          key: "subscribeTime",
          width: 150,
        },
        {
          title: "预约内容",
          align: "center",
          minWidth: 110,
          key: "subscribeText",
        },
        {
          title: "常驻地点",
          align: "center",
          minWidth: 100,
          key: "addressDetail",
        },
        {
          title: "注册管家",
          align: "center",
          minWidth: 90,
          key: "serviceReferrerName",
        },
        {
          title: "推广代理人",
          align: "center",
          minWidth: 100,
          key: "transpondAgent",
        },
        {
          title: "代理人所属机构",
          align: "center",
          minWidth: 100,
          key: "organizationName"
        }
      ]
    };
  },
  created: function() {
     this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
      if (!this.isAdminCenter) {
        this.columns.pop();
      }
    }
    this.search(1);
    //调用部门
    // this.getOrgDepList();
    this.getRoleAllList();
    this.getCompanyList();
    this.getDeptList();
  },
  mounted: function() {},
  watch: {},
  methods: {
     timeChange(val) {
       console.log(val)
      this.params.subscribeTimeStart =val[0];
      this.params.subscribeTimeEnd = val[1];
    },
    //重置
    resertMo() {
      this.params.userName = "";
     this.params.cellPhoneNumber='';
     this.params.organizationCode="";
     this.params.subscribeTimeEnd=null;
        this.params.subscribeTimeStart=null
        this.searchTime=[]
      this.search(1);
    },

    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
//       zhuge.track('713操作', {
//   '操作1' : '222',
// });  
// console.log("9----------")
      this.params.page = page ? page : 1;
      let idList = []
      if(this.params.customerId != ""){
        idList.push(this.params.customerId)
      }
      
      let searchData = {
        cellPhoneNumber: this.params.cellPhoneNumber,
        userName: this.params.userName,
        organizationCode: this.params.organizationCode,
        subscribeTimeEnd: this.params.subscribeTimeEnd,
        subscribeTimeStart:this.params.subscribeTimeStart
      };
      console.log(searchData)
      this.thedoctorList(searchData);
      this.searchData = searchData;
      // this.query=true;
      // this.params.page=1;
    },

    //加载用户列表e
    thedoctorList(option) {
      this.$api.thedoctorList(option).then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.total = res.data.total;
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
    },
    //获得角色·
    getRoleAllList() {
      this.$api.getRoleAllList({ roleStatus: 0 }).then((res) => {
        if (res.respCode == "0") {
          this.roleList = res.data;
        }
      });
    },
    changePage(page) {
      this.params.page = page;
      this.searchData.page = page;
      this.thedoctorList(this.searchData);
    },
    async editUser(row) {
      let params = row;
      let result = await this.$api.user_info_uu({userId:row.id})
      console.log(result);
      for (let item of result.content.userRoleInSyses) {
        params.roleId = item.roleId;
        params.deptId = item.deptId;
        params.customerId = item.customerId;
      }
      this.$set(params,"customerIdAnd",params.otherInfo20+"/"+params.customerId);
    },
    delUser(row) {
      let content = this.$t("deleteTit");
      let params = { ids: [], systemType: 0 };
      if (row) {
        params.ids.push(row.id);
      }
      this.$util.confirmDialog(this, this.$t("confirm"), content, (self) => {
        self.$api.delUser(params).then((res) => {
          if (res.respCode == 0) {
            self.$Message.success(this.$t("delete") + this.$t("success"));
            self.search(1);
          } else {
            self.$Message.error(res.message);
          }
        });
      });
    },
    getOrgDepList() {
      this.$api.getOrgDepList({ systemType: 0 }).then((res) => {
        if (res.respCode == 0 || res.result == 0) {
          this.depTreeData = this.getTreeOrgDept(res.data);
        } else {
          this.$Message.error(res.message ? res.message : res.resultMessage);
        }
      });
    },
    /*
              生成树形组织结构(适用于 返回不是树形数据)
            */

    getTreeOrgDept(list, treeData, id) {
      let itemArr = [];
      let that = this;
      filter(itemArr, null);
      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }
      //遍历过滤
      function filter(tree, id) {
        let array = list.filter((item) => {
          //第一次递归 ：赋值为了新建和编辑时候tree插件使用title
          if (id == null) {
            item.title = item.deptName;
          }
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        //依次遍历
        if (array.length > 0) {
          get(array);
        }
      }

      return itemArr;
    },
    //获取公司机构
    getCompanyList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getCompanyList({}).then((res) => {
        if (res.respCode == "0") {
          this.companyList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //获取部门
    getDeptList() {
      let userRoleInSyses = JSON.parse(sessionStorage.userRoleInSyses);
      let data = {
        // enable: 0,
        id: userRoleInSyses[0].deptId,
      };
      this.$api.getDeptController({}).then((res) => {
        if (res.respCode == "0") {
          this.deptList = res.data;
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    //重置密码
    resetPwd(row) {
      let data = {
        userId: row.id,
      };
      let that = this
      this.$Modal.confirm({
          title: '确认重置',
          content: '<p>确认对当前帐号重置密码？重置后恢复为随机密码！</p>',
          onOk: () => {
              that.$api.resetPassword(data).then((res) => {
                if (res.respCode == "0") {
                  that.$Message.success({
                    content: "重置密码成功，初始密码是"+res.content,
                    duration: 100,
                    closable: true
                });
                } else {
                  that.$Message.error(res.message);
                }
              });
          }
      });
    },
  },
  filters: {},
};
</script>

<style lang="less">
.v-transfer-dom
  .ivu-modal-wrap
  .ivu-modal
  .ivu-modal-content
  .ivu-modal-body
  .ivu-modal-confirm-body {
  height: auto !important;
  max-height: 350px !important;
  color: unset !important;
  overflow: auto;
}
</style>
