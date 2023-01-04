/*
* @Author: masiwei
* @Date: 2019-06-20 13:23:43
* @Last Modified by: masiwei
* @Last Modified time: 2019-06-24 13:33:37
*/
<template>
  <div id="menu_index" class="only-content">
    <Form ref="params" :model="params" inline>
      <FormItem>
        <!--<Button type="info" @click="addMenu()" v-has="'menu:add'">新建</Button>-->
        <!--<Button type="primary" @click="addMenu()">{{$t('newBuilt')}}</Button>-->
        <Button
          v-if="isAdminCenter || button.role_add"
          type="primary"
          @click="addMenu()"
          >新建菜单</Button
        >
      </FormItem>
    </Form>
    <tree-grid
      :items="treeData"
      :columns="treeColumns"
      :expanded="true"
      @on-edit="editMenu"
      @on-del="delMenu"
    ></tree-grid>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import menuForm from "./form/menuForm";
import { constants } from "crypto";

export default {
  data() {
    return {
      button: this.$store.state.app.button,
      isAdminCenter: false,
      params: {},

      treeData: [],
    };
  },
  created: function () {
    this.isAdminCenter =
      window.sessionStorage.getItem("username") == "adminCenter";
    this.getMenuList();
  },
  mounted: function () {},
  computed: {
    treeColumns() {
      return [
        //       {
        //        width:'60',
        //        align:'center',
        //        type: 'selection'
        // },
        {
          title: this.$t("menus.number"),
          key: "menuNo",
          minWidth: 130,
        },
        {
          title: this.$t("menus.name"),
          key: "menuName",
          align: "center",
          minWidth: 130,
        },
        {
          title: this.$t("menus.address"),
          key: "url",
          minWidth: 130,
        },
        {
          title: this.$t("menus.interfaceUrl"),
          key: "interfaceUrl",
          minWidth: 230,
        },
        {
          title: this.$t("menus.Type"),
          key: "typeName",
          minWidth: 130,
        },
        {
          title: this.$t("operation"),
          type: "action",
          align: "center",
          minWidth: 100,
          actions: [
            {
              type: "success",
              method: "on-edit",
              text: this.$t("edit"),
            },
            {
              type: "info",
              method: "on-del",
              text: this.$t("delete"),
            },
          ],
        },
      ];
    },
  },
  watch: {},
  methods: {
    /**
     * 获得菜单列表
     */
    getMenuList() {
      this.$api.getMenuList().then((res) => {
        if (res.respCode == 0 || res.result - 0 == 0) {
          this.handleMenuList(res.data);
          this.treeData = res.data;
          console.log(JSON.stringify(this.treeData));
          // this.treeData=this.getTreeMenu(res.content.data);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    /*
              生成树形菜单(适用于 返回不是树形数据)
            */
    getTreeMenu(list, treeData, id) {
      let itemArr = [];
      filter(itemArr, null);

      function get(array) {
        for (let item of array) {
          filter(item, item.id);
        }
      }

      function filter(tree, id) {
        let array = list.filter((item) => {
          return item.parentId == id;
        });
        if (id == null || id == 0) {
          itemArr = array;
        } else {
          tree.children = array;
        }
        if (array.length > 0) {
          get(array);
        }
      }

      return itemArr;
    },
    //如果返回的事树形数据
    handleMenuList(data) {
      for (let item of data) {
        item.title = item.menuName;
        item.parentId = item.parentId == null ? 0 : item.parentId;
        item.typeName =
          item.type == 0 ? this.$t("menus.menu") : this.$t("menus.button");
        if (item.children) {
          this.handleMenuList(item.children);
        }
      }
    },
    /*
                弹窗
            */
    addMenu(formData) {
      let props = {},
        title = this.$t("newBuilt") + this.$t("menus.menu");
      props.menuList = this.treeData;
      if (formData) {
        props.formValidate = formData;
        title = this.$t("edit") + this.$t("menus.menu");
      }
      let self = this;
      var params = {
        self: this,
        title: title,
        width: 600, //默认600
        props: props,
        form: menuForm, //弹窗中的表单
        success: (res) => {
          this.getMenuList();
        },
        cancel: () => {},
      };
      this.$util.openModelForm(params, this);
    },
    /**
     *
     * 编辑菜单
     */
    editMenu(row) {
      let {
        id,
        menuName,
        menuNo,
        children,
        interfaceUrl,
        url,
        type,
        parentId,
        otherInfo1,
        img,
      } = row;
      let params = {
        id: id,
        menuName: menuName,
        menuNo: menuNo + "",
        interfaceUrl:interfaceUrl,
        url: url,
        children: children,
        type: type - 0,
        parentId: parentId,
        img: img,
        otherInfo1: otherInfo1, //备用字段用于做是否是在左侧菜单栏显示
      };
      this.addMenu(params, this);
    },
    /**
     *
     * 删除菜单
     */
    delMenu(row) {
      let queryDta = { ids: [row.id], jurisdictionVOList: [{ systemType: 0 }] };
      this.$util.confirmDialog(
        this,
        this.$t("confirm"),
        this.$t("confirm") + this.$t("delete") + this.$t("menus.menu"),
        (self) => {
          self.$api.delMenu(queryDta).then((res) => {
            if (res.respCode == 0 || res.result - 0 == 0) {
              self.$Message.success(this.$t("delete") + this.$t("success"));
              self.getMenuList();
            } else {
              self.$Message.error(res.message);
            }
          });
        }
      );
    },
  },
  filters: {},
  components: {
    menuForm,
  },
};
</script>

<style lang='less'>
#menu_index {
}
</style>

