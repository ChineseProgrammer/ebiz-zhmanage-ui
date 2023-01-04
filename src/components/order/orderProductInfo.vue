<template>
  <div class="order-section">
    <div class="order-section-header">
      <Icon type="ios-bookmark" size="26" />
      {{title}}
    </div>
    <div class="section-content">
      <Table width="800" border :columns="columnsGoods" :data="goodsData"></Table>
    </div>
  </div>
</template>
<style scoped >
.section-content {
  margin-left: 28px;
}
</style>
<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    columnsGoods: {
      type: Array,
      default: function() {
        return [
          {
            title: "商品名称",
            key: "list",
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    class: "subCol"
                  }
                },
                [
                  h(
                    "ul",
                    this.goodsData[params.index].list.map(item => {
                      return h("li", {}, item.goodsName);
                    })
                  )
                ]
              );
            }
          },
          {
            title: "分类",
            key: "list",
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    class: "subCol"
                  }
                },
                [
                  h(
                    "ul",
                    this.goodsData[params.index].list.map(item => {
                      return h("li", {}, item.classify);
                    })
                  )
                ]
              );
            }
          },
          {
            title: "售价",
            key: "list",
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    class: "subCol"
                  }
                },
                [
                  h(
                    "ul",
                    this.goodsData[params.index].list.map(item => {
                      return h("li", {}, "￥" + item.price);
                    })
                  )
                ]
              );
            }
          },
          {
            title: "数量",
            key: "list",
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    class: "subCol"
                  }
                },
                [
                  h(
                    "ul",
                    this.goodsData[params.index].list.map(item => {
                      return h("li", {}, item.number);
                    })
                  )
                ]
              );
            }
          },
          {
            title: "小计",
            key: "list",
            align: "center",
            render: (h, params) => {
              return h(
                "div",
                {
                  attrs: {
                    class: "subCol"
                  }
                },
                [
                  h(
                    "ul",
                    this.goodsData[params.index].list.map(item => {
                      return h("li", {}, "￥" + item.subtotal);
                    })
                  )
                ]
              );
            }
          },
          {
            title: "合计",
            key: "totalPrice",
            align: "center",
            render: (h, params) => {
              return h("span", "￥" + params.row.totalPrice);
            }
          }
        ];
      }
    },
    goodsData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  }
};
</script>