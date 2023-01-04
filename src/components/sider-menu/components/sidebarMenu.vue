<style lang="less">
@import "../styles/menu.less";
</style>

<template>
  <Menu
    ref="sideMenu"
    :active-name="$route.name"
    :open-names="openNames"
    :theme="menuTheme"
    width="auto"
    @on-select="changeMenu"
  >
    <template v-for="(item,index) in menuList">
      <MenuItem :class='[{"only-menu--active":onlyActiveIndex==index}]' v-if="judgeMenu(item)" :name="item.name" :key="'menuitem' + item.name">
        <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
        <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
      </MenuItem>
      <Submenu
        v-if="!item.hidden&!item.hiddenChildren& item.children.filter(el=>!el.hidden).length > 0"
        :name="item.name"
        :key="item.name"
        >
        <template slot="title">
          <Icon :type="item.icon" :size="iconSize"></Icon>
          <span class="layout-text">{{ itemTitle(item) }}</span>
        </template>
        <template v-for="child in item.children">
          <MenuItem :name="child.name" :key="'menuitem' + child.name" v-if="judgeMenu(child)">
            <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
            <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
          </MenuItem>
          <Submenu
            v-if="!child.hidden&!child.hiddenChildren&child.children.filter(el=>!el.hidden).length >0"
            :name="child.name"
            :key="child.name"
          >
            <template slot="title">
              <Icon :type="child.icon" :size="iconSize"></Icon>
              <span class="layout-text">{{ itemTitle(child) }}</span>
            </template>
            <template v-for="thrChild in child.children">
              <MenuItem
                :name="thrChild.name"
                :key="'menuitem' + thrChild.name"
                v-if="!thrChild.hidden"
              >
                <Icon :type="thrChild.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                <span class="layout-text" :key="'title' + thrChild.name">{{ itemTitle(thrChild) }}</span>
              </MenuItem>
            </template>
          </Submenu>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
export default {
  name: "sidebarMenu",
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: "dark"
    },
    openNames: {
      type: Array
    }
  },
  data:_=>({
    onlyActiveIndex:-1,//没有子类的导航下标
  }),
  created: function() {},
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  },
  methods: {
    changeMenu(active) {
      let { menuList } = this
      this.onlyActiveIndex =  menuList.findIndex(el=>!el.children.length&&el.name==active)
      this.$emit("on-change", active);
    },
    itemTitle(item) {
      if (this.$t(item.name) != item.name) {
        return this.$t(item.name);
      } else {
        return item.title;
      }
    },
    judgeMenu(item) {
      //三个检验顺序不能改变
      if (item.hidden) {
        return false;
      }
      //需要显示，如果需要隐藏子路由
      else if (item.hiddenChildren) {
        return true;
      } else if (item.children.filter(el=>!el.hidden).length == 0 ) {
        return true;
      } 
    }
  },

  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  }
};
</script>

<style lang="less">
  .only-menu--active{
    background-color: #2d8cf0 !important;
    color:#fff !important;
  }
</style>
