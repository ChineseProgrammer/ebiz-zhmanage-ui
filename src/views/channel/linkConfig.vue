<template>
  <div class="user-list">
    <div class="header">
      <div class="left">
        <Form ref="formValidate" :model="params" inline :label-width="100">
          <FormItem label="入口名称" prop='name' class="item-margin-left">
            <Input v-model="params.name"></Input>
          </FormItem>
          <FormItem label="一级渠道" prop='l2' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l2"
              @on-change="levelChange($event, 2)">
              <Option v-for="(item, index) in channelList1" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="二级渠道" prop='l3' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l3"
              @on-change="levelChange($event, 3)">
              <Option v-for="(item, index) in channelList2" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="三级渠道" prop='l4' class="item-margin-left">
            <Select clearable filterable style="width:162px" placeholder="请选择" v-model="params.l4">
              <Option v-for="(item, index) in channelList3" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <i-col class="float-right">
            <Button type="primary" @click="search(1)" style="margin-left:10px">{{ $t("query") }}</Button>
            <Button type="default" @click="reset">{{ $t("reset") }}</Button>
          </i-col>
          <div class="add-btns">
            <Button type="primary" style="margin-left:10px" @click="add">新增</Button>
          </div>
        </Form>
      </div>
    </div>
    <div class="m-table">
      <div>
        <primaryTable :columns="columns" :data="tableList" :total="total" :pageSize="params.pageSize" ref="primaryTable"
          @linkConfigDownloadQrcode="linkConfigDownloadQrcode" @linkConfigCopyUrl="linkConfigCopyUrl"
          @on-page-size-change="changeSize" @on-change="search">
        </primaryTable>
      </div>
    </div>

    <Modal v-model.trim="addVisible" :title="title" :loading="modalLoading" :closable="false" :width="800"
      :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="130">
        <Row class="user-row">
          <Col :span="12">
          <FormItem label="入口名称" prop='entranceId' class="item-margin-left" v-if="isMain">
            <Select clearable filterable placeholder="请选择" v-model="formData.entranceId">
              <Option v-for="(item, index) in entranceList" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col :span="12">
          <FormItem label="一级渠道" prop='l2' class="item-margin-left" v-if="isMain">
            <Select clearable filterable placeholder="请选择" v-model="formData.l2"
              @on-change="levelChange($event, 2, 'add')">
              <Option v-for="(item, index) in channelList1" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col :span="12">
          <FormItem label="二级渠道" prop='l3' class="item-margin-left" v-if="isMain">
            <Select clearable filterable placeholder="请选择" v-model="formData.l3"
              @on-change="levelChange($event, 3, 'add')">
              <Option v-for="(item, index) in addChannelList2" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col :span="12">
          <FormItem label="三级渠道" prop='l4' class="item-margin-left" v-if="isMain">
            <Select clearable filterable placeholder="请选择" v-model="formData.l4">
              <Option v-for="(item, index) in addChannelList3" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
// 任务状态
import uuidv1 from 'uuid/v1';
export default {
  data() {
    let self = this;
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      modalLoading: true,
      params: {
        name: "",
        l1: "",
        l2: "",
        l3: "",
        l4: "",
        pageSize: 10,
        page: 1,
      },
      formData: {
        entranceId: '',
        l1: '',
        l2: '',
        l3: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: "请输入入口名称", trigger: "blur" },
        ],
      },
      total: 0,
      tableList: [],
      columns: [
        {
          type: "index",
          align: "center",
          width: 80,
          title: "序号",
        },
        {
          title: "入口名称",
          align: "center",
          minWidth: 100,
          key: "name",
        },
        {
          title: "一级渠道",
          align: "center",
          minWidth: 150,
          key: "n2",
        },
        {
          title: "二级渠道",
          align: "center",
          minWidth: 150,
          key: "n3",
        },
        {
          title: "三级渠道",
          align: "center",
          minWidth: 150,
          key: "n4",
        },
        {
          title: "推广链接",
          align: "center",
          minWidth: 150,
          key: "link"
        },
        {
          title: "操作",
          align: "center",
          minWidth: 120,
          key: "selfBtn",
          slot: "action",
          selfBtn: [{
            name: "下载二维码",
            type: "primary",
            method: "linkConfigDownloadQrcode",
            permission: 'linkConfigDownloadQrcode',
            show: function () {
              if (self.isAdminCenter || self.button.linkConfigDownloadQrcode) {
                return true;
              }
              return false;
            }
          }, {
            name: "复制链接",
            type: "primary",
            method: "linkConfigCopyUrl",
            permission: 'linkConfigCopyUrl',
            show: function () {
              if (self.isAdminCenter || self.button.linkConfigCopyUrl) {
                return true;
              }
              return false;
            }
          }]
        }
      ],
      title: '',
      addVisible: false,
      editId: 0,
      entranceList: [],
      channelList1: [],
      channelList2: [],
      channelList3: [],
      addChannelList2: [],
      addChannelList3: [],
      isMain: true
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    if ((!this.button.user_edit) && (!this.button.user_resetPassword) && (!this.button.user_OutOfService) && (!this.button.user_delete)) {
    }
    this.isMain = this.$store.state.app.userInfo.otherInfo20 === "860000"
    if (!this.isMain) {
      this.columns = this.columns.filter(one => {
        if (one.notMain) {
          return false;
        }
        return true;
      })
    }
    this.search(1);
    this.levelChange(-1, 1);
    this.getEntranceList();
  },
  mounted: function () {
  },
  methods: {
    getEntranceList() {
      this.$api.channelEntranceList({ pageSize: 10000 }).then(res => {
        console.log(res);
        this.entranceList = res.data.list;
      })
    },
    add() {
      this.title = "新增推广链接"
      this.addVisible = true;
    },
    linkConfigDownloadQrcode(row) {
      console.log({ url: encodeURIComponent(row.link) });
      this.$api.getChannelLinkQrCode({ url: row.link }).then(res => {
        console.log(res);
        let elink = document.createElement("a");
        let uuid = uuidv1();
        elink.download = uuid+"_pr.jpg";
        elink.style.display = "none";
        let blob = new Blob([res]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      })
    },
    linkConfigCopyUrl(row) {
      var input = document.createElement("input"); // js创建一个input输入框

      input.value = row.link; // 将需要复制的文本赋值到创建的input输入框中

      document.body.appendChild(input); // 将输入框暂时创建到实例里面

      input.select(); // 选中输入框中的内容

      document.execCommand("Copy"); // 执行复制操作

      document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
      alert("复制成功！")
    },
    levelChange(e, level, type) {
      this.getChannelTypeList(e, level + 1, type);
    },
    getChannelTypeList(pid, level, type) {
      let params = {
        level: level
      }
      if (pid !== -1 && pid !== undefined) {
        params.pid = pid;
      }
      console.log(pid, level, type);
      if (pid === undefined) {
        if (level === 3) {
          if (type === 'add') {
            this.addChannelList2 = [];
            this.addChannelList3 = [];
            this.formData.l3 = undefined;
            this.formData.l4 = undefined;
          } else {
            this.channelList2 = [];
            this.channelList3 = [];
            this.params.l3 = undefined;
            this.params.l4 = undefined;
          }
        } else if (level === 4) {
          if (type === 'add') {
            this.addChannelList3 = [];
            this.formData.l4 = undefined;
          } else {
            this.channelList3 = [];
            this.params.l4 = undefined;
          }
        }
      } else {
        this.$api.channelTypeList(params).then(res => {
          console.log(res);
          if (level === 2) {
            if (type === 'add') {
              // 新增
              this.channelList1 = res.data;
              this.addChannelList2 = [];
              this.addChannelList3 = [];
              this.formData.l3 = undefined;
              this.formData.l4 = undefined;
            } else {
              // 查询
              this.channelList1 = res.data;
              this.channelList2 = [];
              this.channelList3 = [];
              this.params.l3 = undefined;
              this.params.l4 = undefined;
            }
          } else if (level === 3) {
            if (type === 'add') {
              // 新增
              this.addChannelList2 = res.data;
              this.addChannelList3 = [];
              this.formData.l3 = undefined;
              this.formData.l4 = undefined;
            } else {
              // 查询
              this.channelList2 = res.data;
              this.channelList3 = [];
              this.params.l3 = undefined;
              this.params.l4 = undefined;
            }
          } else if (level === 4) {
            if (type === 'add') {
              // 新增
              this.addChannelList3 = res.data;
              this.formData.l4 = undefined;
            } else {
              // 查询
              this.channelList3 = res.data;
              this.params.l4 = undefined;
            }
          }
        })
      }
    },
    //重置
    reset() {
      this.params.name = "";
      this.params.l1 = "";
      this.params.l2 = "";
      this.params.l3 = "";
      this.params.l4 = "";
      this.search(1);
    },

    changeSize(size) {
      this.params.pageSize = size;
      this.search();
    },
    //查询
    search(page) {
      console.log(page);
      this.params.page = page ? page : 1;

      this.getList();
    },
    formatDate(date) {
      let d = new Date(date);
      let time = d.getFullYear()
        + "-" + (d.getMonth() + 1).toString().padStart(2, 0)
        + "-" + d.getDate().toString().padStart(2, 0)
      // + " " + d.getHours().toString().padStart(2, 0)
      // + ':' + d.getMinutes().toString().padStart(2, 0)
      // + ':' + d.getSeconds().toString().padStart(2, 0)
      return time;
    },
    //获得题库类型列表·
    getList() {
      console.log(this.params);

      this.$api.channelLinkList(this.params).then(res => {
        console.log(res);
        if (res) {
          this.tableList = res.data.list;
          this.total = res.data.total;
        } else {
          this.tableList = [];
          this.total = 0;
        }
      })
    },
    ok() {
      this.$refs.formData.validate((valid) => {
        console.log(valid, this.formData, '__--')
        if (valid) {
          this.$api.addChannelLink(this.formData).then(res => {
            console.log(res);
            this.addVisible = false;
            this.getList();
            this.modalLoading = false;
            this.reset();
            this.$nextTick(() => {
              this.modalLoading = true;
            })
          }).catch(err => {
            this.modalLoading = false;
          })
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    cancel() {
      this.addVisible = false;
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

.header {
  padding-top: 10px;
}

.add-btns {
  display: flex;
  margin-bottom: 10px;
}

.form-item .ivu-form-item-label {
  white-space: nowrap;
}
</style>
