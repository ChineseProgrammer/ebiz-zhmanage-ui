<template>
  <div id="organization">
    <Tabs value="name1">
        <TabPane label="公司组织架构" name="name1">
          <Row>
            <Col span="7">
              <div>
                <Button type="primary" class="mb-10" style="width:100%" @click="addCompany" :disabled="isClick">新增总公司</Button>
                <div class="border box">
                  <Tree :data="treeData" @on-select-change="clickTree"></Tree>
                </div>
              </div>
            </Col>
            <Col span="16" offset="1">
              <div class="contextbox border" v-if="isShow">
                <div style="padding:20px">
                  <div class="text-right">
                    <Button type="primary" class="mb-10" @click="addDept">新增下级机构</Button>
                    <Button type="error" class="mb-10" @click="delDept">删除本级机构</Button>
                  </div>
                  <Row>
                    <Form
                      ref="formValidate"
                      :model="companyDate"
                      :label-width="100"
                      label-position="left"
                    >
                    <Col span="13" class="mb-10">
                      <FormItem label="机构代码" prop="deptNo">
                        <Input v-model="companyDate.deptNo" placeholder="请输入机构代码" />
                      </FormItem>
                    </Col>
                    <Col span="13" class="mb-10">
                      <FormItem label="机构名称" prop="title">
                        <Input v-model="companyDate.title" placeholder="请输入机构名称" />
                      </FormItem>
                      </Col>
                    <Col span="13" class="mb-10">
                      <FormItem label="是否有效" prop="status" >
                        <Select v-model="companyDate.status">
                          <Option value="0">是</Option>
                          <Option value="1">否</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span ="13" class="mb-10">
                      <FormItem label="级别" prop="level" >
                        <Select v-model="companyDate.level" style="width:180px" placeholder="请选择级别">
                          <Option value="0" >总公司</Option>
                          <Option value="1" >分公司</Option>
                          <Option value="2" >中心支公司</Option>
                          <Option value="3" >支公司</Option>
                          <Option value="4" >网点</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    </Form>
                  </Row>
                  <div>
                    <Button type="primary" @click="save">保存</Button>
                  </div>

                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="保司组织架构" name="name2">
          <Row>
            <Col span="7">
              <div>
                <Button type="primary" class="mb-10" style="width:100%" @click="addCompany" >新增总公司</Button>
                <div class="border box">
                  <Tree :data="treeDataInsurance" @on-select-change="clickTreeInsurance"></Tree>
                </div>
              </div>
            </Col>
            <Col span="16" offset="1">
              <div class="contextbox border" v-if="isShow">
                <div style="padding:20px">
                  <div class="text-right">
                    <Button type="primary" class="mb-10" @click="addDept">新增下级机构</Button>
                    <Button type="error" class="mb-10" @click="delDept">删除本级机构</Button>
                  </div>
                  <Row>
                    <Form
                      ref="formValidate"
                      :model="insuranceDate"
                      :label-width="100"
                      label-position="left"
                    >
                    <Col span="13" class="mb-10">
                      <FormItem label="机构代码" prop="deptNo">
                        <Input v-model="insuranceDate.deptNo" placeholder="请输入机构代码" />
                      </FormItem>
                    </Col>
                    <Col span="13" class="mb-10">
                      <FormItem label="机构名称" prop="title">
                        <Input v-model="insuranceDate.title" placeholder="请输入机构名称" />
                      </FormItem>
                      </Col>
                    <Col span="13" class="mb-10">
                      <FormItem label="是否有效" prop="status" >
                        <Select v-model="insuranceDate.status">
                          <Option value="0">是</Option>
                          <Option value="1">否</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span ="13" class="mb-10">
                      <FormItem label="级别" prop="level" >
                        <Select v-model="insuranceDate.level" style="width:180px" placeholder="请选择级别">
                          <Option value="0" >总公司</Option>
                          <Option value="1" >分公司</Option>
                          <Option value="2" >中心支公司</Option>
                          <Option value="3" >支公司</Option>
                          <Option value="4" >网点</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    </Form>
                  </Row>
                  <div>
                    <Button type="primary" @click="save">保存</Button>
                  </div>

                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
    </Tabs>
    
    <!-- 添加总公司 -->
    <Modal
      v-model="modalForm"
      title="新增总公司"
      :draggable="false"
      :loading="true"
      :closable="false"
      :width="700"
    >
      <Form
        ref="formValidate"
        :model="formData"
        :label-width="100"
        label-position="left"
      >
        <Row>
          <Col span="22" offset="1" >
          <FormItem label="公司编号" prop="deptNo" >
              <Input v-model="formData.deptNo" placeholder="请输入公司编号" />
            </FormItem>
            <FormItem label="公司名称" prop="deptName" >
              <Input v-model="formData.deptName" placeholder="请输入公司名称" />
            </FormItem>
            <FormItem label="是否有效" prop="status" >
              <Select v-model="formData.status">
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            </FormItem>
            <FormItem label="级别" prop="level" >
              <Select v-model="formData.level" style="width:180px" placeholder="请选择级别">
                <Option value="0" >总公司</Option>
                <Option value="1" >分公司</Option>
                <Option value="2" >中心支公司</Option>
                <Option value="3" >支公司</Option>
                <Option value="4" >网点</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="doAdd">确定</Button>
        <Button @click="close">取消</Button>
      </div>
    </Modal>
    <!-- 添加总公司 -->
    <Modal
      v-model="deptForm"
      title="新增下级机构"
      :draggable="false"
      :loading="true"
      :closable="false"
      :width="700"
    >
      <Form
        ref="formValidate"
        :model="deptData"
        :label-width="100"
        label-position="left"
      >
        <Row>
          <Col span="22" offset="1" >
          <FormItem label="机构代码" prop="deptNo" >
              <Input v-model="deptData.deptNo" placeholder="请输入机构代码" />
            </FormItem>
            <FormItem label="机构名称" prop="deptName" >
              <Input v-model="deptData.deptName" placeholder="请输入机构名称" />
            </FormItem>
            <FormItem label="是否有效" prop="status" >
              <Select v-model="deptData.status">
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            </FormItem>
            <FormItem label="级别" prop="level" >
              <Select v-model="deptData.level" style="width:180px" placeholder="请选择级别">
                <Option value="0" >总公司</Option>
                <Option value="1" >分公司</Option>
                <Option value="2" >中心支公司</Option>
                <Option value="3" >支公司</Option>
                <Option value="4" >网点</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="doAddDept">确定</Button>
        <Button @click="closeDept">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userForm from "./form/userForm";
import { parse } from "path";
import treeInsurance from "../../../mock/tree.json";

export default {
  data() {
    return {
      treeData: [],
      deptName: "",
      deptNo: "",
      level: "",
      modalForm: false,
      formData: {},
      ruleValidate: [],
      type: "",
      companyDate: {},
      deptData: {},
      deptForm: false,
      parentId: "0",
      isClick: true,
      isShow: false,
      treeDataInsurance:[],
      insuranceDate:[]
    };
  },
  created: function() {
    this.getList();
  },
  mounted: function() {
    this.treeDataInsurance = treeInsurance.data
  },
  computed: {},
  watch: {},
  methods: {
    getList() {
      let data = {};
      this.$api.getDeptTreeList(data).then(res => {
        if (res.respCode == "0") {
          this.treeData = this.getTreeDate(res.data);
          console.log(this.treeData);
          if (this.treeData.length > 0) {
            this.isClick == false;
          }
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    addCompany() {
      this.modalForm = true;
    },
    doAdd() {
      let data = {
        parentId: this.parentId,
        deptName: this.formData.deptName,
        deptNo: this.formData.deptNo,
        otherInfo1: this.formData.status,
        otherInfo2: this.deptData.level
      };
      this.$api.createDept(data).then(res => {
        if (res.respCode == "0") {
          this.$Message.error("新增成功");
          this.getList();
          this.close();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    close() {
      this.modalForm = false;
    },
    clickTree(data) {
      console.log(data);
      this.companyDate = data[0];
      this.parentId = data[0].id;
      this.isShow = true;
    },
    clickTreeInsurance(data){
      console.log(data);
      this.insuranceDate = data[0];
      this.isShow = true;
    },
    addDept() {
      this.deptForm = true;
    },
    doAddDept() {
      let data = {
        parentId: this.parentId,
        deptName: this.deptData.deptName,
        deptNo: this.deptData.deptNo,
        otherInfo1: this.deptData.status,
        otherInfo2: this.deptData.level
      };
      this.$api.createDept(data).then(res => {
        if (res.respCode == "0") {
          this.$Message.success("新增成功");
          this.getList();
          this.closeDept();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    closeDept() {
      this.deptData.deptName = "";
      this.deptData.deptNo = "";
      (this.deptData.status = ""),
        (this.deptData.level = ""),
        (this.deptForm = false);
    },
    getTreeDate(data) {
      let arr = [];
      data.map((item, index) => {
        let obj = {
          title: item.deptName,
          expand: true,
          id: item.id,
          deptNo: item.deptNo,
          status: item.otherInfo1,
          level: item.otherInfo2,
          children: [],
          parentId: item.parentId
        };
        obj.children = this.getTreeDate(item.children);
        arr[index] = obj;
      });
      return arr;
    },
    save() {
      // let data =  this.companyDate
      // data.parentId = this.parentId
      let data = {
        parentId: this.companyDate.parentId,
        deptName: this.companyDate.title,
        deptNo: this.companyDate.deptNo,
        otherInfo1: this.companyDate.status,
        otherInfo2: this.companyDate.level,
        id: this.companyDate.id
      };
      console.log(data);
      this.$api.updateDept(data).then(res => {
        if (res.respCode == "0") {
          this.$Message.success("保存成功");
          this.getList();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    delDept() {
      let data = {
        deptIds: [],
        id: ""
      };
      // this.$api.deleteDept(data).then(res => {
      //   if (res.respCode == "0") {
      //     this.$Message.success("删除成功");
      //     this.getList()
      //   } else {
      //     this.$Message.error(res.message);
      //   }
      // })
    }
  },
  filters: {},
  components: {
    userForm
  }
};
</script>

<style lang='less'>
#organization {
  .ivu-form-item {
    margin-bottom: 0;
  }
  .border {
    border: 1px solid #d7dde4;
  }
  .box {
    height: 500px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .contextbox {
    height: 542px;
    overflow-y: auto;
  }
}
</style>

