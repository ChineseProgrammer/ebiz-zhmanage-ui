<template>
    <div id="log">
     <Form ref="params" :model="params" :label-width="80" inline >   
        <FormItem label="用户名称" prop="realName">
            <Input v-model="params.realName" placeholder="请输入用户名称"></Input>
        </FormItem>
        <FormItem label="操作名称" prop="actionName">
            <Input v-model="params.actionName" placeholder="请输入操作名称"></Input>
        </FormItem>
     </Form>
       <div class="m-table">
           <div class="m-btn">
               <Row>
                   <Col span="12" >
                       <Button  type="dashed" icon="ios-search" @click="search()"  style="margin-left：10px">{{$t('query')}}</Button>
                       <Button type="primary" icon="md-refresh" @click="resertMo">{{$t('reset')}}</Button>
                   </Col>
               </Row>
           </div>
           <div>
               <primaryTable
                :columns="columns" :data="tableList"
                :total='total'
                :pageSize='params.pageSize'
                ref='primaryTable'
                class="wholeTable"
               >
               </primaryTable>
           </div>
       </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import userForm from "./form/userForm";
import { parse } from "path";

export default {
  data() {
    return {
      //表头
      columns: [
        {
          title: "用户编号",
          key: "serialNumber",
          align: "center"
        },

        {
          title: "用户名称",
          key: "projectName",
          align: "center"
        },
        {
          title: "操作名称",
          key: "name",
          align: "center"
        },
        {
          title: "操作时间",
          key: "typeDesc",
          align: "center"
        },
        {
          title: "操作参数",
          key: "mobileNo",
          align: "center"
        }
      ],
      params: {
        realName: "",
        pageSize: 10,
        page: 1,
        actionName: ""
      },
      total: 0,
      tableList: []
    };
  },
  created: function() {
    this.getList();
  },
  mounted: function() {},
  computed: {},
  watch: {},
  methods: {
    //重置
    resertMo() {
      this.params.userName = "";
      this.params.realName = "";
      this.getList();
    },
    //查询
    search() {
      this.params.page = 1;
      this.getList();
    },

    //加载用户列表e
    getList() {
      let option = this.params;
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
    },

    changePage(page) {
      this.params.page = page;
      this.getUserList();
    }
  },
  filters: {},
  components: {
    userForm
  }
};
</script>

<style lang='less'>
#log {
    .ivu-form-item{
    margin-bottom: 0;
  }
}
</style>

