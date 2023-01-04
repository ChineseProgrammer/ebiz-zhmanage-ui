<template>
  <Form ref="fromValidate" id="form" :model="fromValidate" :rules="ruleValidate" :label-width="100">
    <FormItem prop="channelCode" label="推广渠道">
      <Select filterable v-model="fromValidate.channelCode" placeholder="请选择">
        <Option
          v-for="item in channelList"
          :value="item.channelCode"
          :key="item.channelCode"
        >{{item.channelName}}</Option>
      </Select>
    </FormItem>
    <FormItem label="推广人userid" prop="wxUserId">
      <Input v-model="fromValidate.wxUserId" placeholder="请选择" disabled>
        <Icon class="click-search" ref="searchUserId" @click="searchUserId" slot="suffix"></Icon>
      </Input>
    </FormItem>
    <Modal v-model="showSecond" width="800" :closable="false" @on-ok="selectOk">
      <div class="ivu-modal-confirm-head" style="line-height: 43px;">
        <div class="ivu-modal-confirm-head-title">人员选择</div>
      </div>
      <selectChannel
        ref="selected"
        :selectedArr="submitSelect"
        :userIdData="userIdData"
        :manageOrgList="manageOrgList"
        @selectedFun="selectedFun"
        :showSecond="showSecond"
      ></selectChannel>
    </Modal>
  </Form>
</template>
<script>
import selectChannel from "@/views/customer/form/selectChannel";
export default {
  props: {
    channelList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    userIdData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    manageOrgList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      fromValidate: {
        channelCode: null,
        wxUserId: null,
        // wxInfoList:[]
      },
      ruleValidate: {
        channelCode: [
          { required: true, message: "推广渠道不能为空", trigger: "change" }
        ],
        wxUserId: [
          {
            required: true,
            message: "推广人userid不能为空",
            trigger: "change"
          }
        ]
      },
      showSecond: false,
      selectedArr: [],
      submitSelect: []
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    searchUserId() {
      this.showSecond = true;
    },
    selectOk() {
      this.submitSelect = this.selectedArr;
      if (this.submitSelect.length > 0) {
        let useridArr = this.submitSelect.map(item => {
          item = item.userId;
          return item;
        });
        this.fromValidate.wxUserId = useridArr.join("、");
      }
    },
    selectedFun(data) {
      this.selectedArr = data;
    },
    handleSubmit() {
      this.$refs.fromValidate.validate(valid => {
        if (valid) {
          this.createdData();
        } else {
          this.$emit("error", "");
        }
      });
    },
    createdData() {
      //  保存数据
      let reqDate = JSON.parse(JSON.stringify(this.fromValidate));
      if (reqDate.wxUserId.constructor.toString().indexOf("Array") == -1) {
        reqDate.wxUserId = reqDate.wxUserId.split("、");
      }
      // reqDate.wxInfoList=this.selectedArr.map(item=>{
      //   let items={
      //     wxUserId:item.userId,
      //     manageOrgName:item.orgName,
      //     wxUserName:item.userName
      //   }
      //   return items
      // })
      this.$api
        .linkCreate(reqDate)
        .then(res => {
          if (res.result == "0") {
            this.$Message.success(
              res.resultMessage ? res.resultMessage : res.message
            );
            //  结束关闭
            this.$emit("finish", this.fromValidate);
          } else {
            this.$Message.error(
              res.resultMessage ? res.resultMessage : res.message
            );
            this.$emit("error", "");
          }
        })
        .catch(error => {
          this.$Message.error(
            error.resultMessage ? error.resultMessage : error.message
          );
        });
    }
  },
  computed: {},
  components: {
    selectChannel
  }
};
</script>
<style lang="less" scoped>
#form {
  .click-search {
    width: 22px;
    height: 22px;
    margin: 5px;
    display: inline-block;
    background: url(../../../assets/search-click.png) no-repeat;
    background-size: conver;
    background-size: 100% 100%;
  }
   /deep/.ivu-form-item-content {
        .ivu-select-dropdown{
          overflow: auto;
          width:100%;
        }
      }
}
</style>