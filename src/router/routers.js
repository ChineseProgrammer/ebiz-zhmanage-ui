/*
 * @Author: 于学文
 * @Date: 2019-04-02 11:08:39
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-02-18 15:33:13
 */
import Main from "../views/Main";
// 不作为Main组件的子页面展示的页面单独写，如下
//home.vue 一级菜单容器  secMenurouter.vue 二级菜单容器  thrMenuRouter.vue 三级菜单容器
//如果子路由需要自定义父容器 在相应目录下了新增index.vue
//icon是菜单图标，可查看iview、
// button 是admin按钮权限
export const button = {
  contract_add: true,
  contract_delay: true,
  contract_export: true,
  contract_exportTemplate: true,
  contract_file: true,
  contract_import: true,
  joinCheck_approval: true,
  joinCheck_check: true,
  joinCheck_record: true,
  menu_add: true,
  menu_del: true,
  menu_edit: true,
  people_editPassword: true,
  rankManage_add: true,
  rankManage_del: true,
  rankManage_delRank: true,
  rankManage_start: true,
  rankManage_stop: true,
  rankMange_addRank: true,
  remind_delay: true,
  remind_export: true,
  remind_exportTemplate: true,
  remind_file: true,
  remind_import: true,
  role_add: true,
  role_authSet: true,
  role_edit: true,
  role_start: true,
  role_stop: true,
  user_add: true,
  user_edit: true,
  user_resetPassword: true,
  user_start: true,
  user_stop: true,
  push_proposal: true,
  open_proposal: true,
  businessProposal: true,
  calendarConfig: true,
  clearDateButton: true,
  operationSupportExport: true
};
export const adminCenterRouter = [
  {
    path: "/home",
    title: "首页",
    icon: "md-home",
    name: "home",
    children: [],
    iviewIcon: true,
    component: () => import("../views/Home.vue"),
    hidden: false,
  },
  {
    path: "/sys",
    title: "系统管理",
    icon: "md-settings",
    name: "sys",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/manage",
      title: "数据字典",
      name: "manage",
      component: () => import("../views/activity/manage.vue"),
      children: [],
      meta: {
        cardTitle: "数据字典",
      },
      hidden: false,
    },
    {
      path: "/user",
      title: "用户管理",
      name: "user",
      // icon: 'ios-contact-outline',
      component: () => import("../views/sys/user.vue"),
      children: [],
      meta: {
        cardTitle: "用户管理", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/role",
      title: "角色管理",
      name: "role",
      // icon: 'ios-contact-outline',
      component: () => import("../views/sys/role.vue"),
      children: [],
      meta: {
        cardTitle: "角色管理", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: '/menu',
      title: '菜单管理',
      name: 'menu',
      // icon: 'ios-contact-outline',
      component: () => import('../views/sys/menu.vue'),
      children: [],
      meta: {
        cardTitle: '菜单管理' //页面中card的标签
      },
      hidden: false
    },
    // {
    //     path: '/organization',
    //     title: '组织架构',
    //     name: 'organization',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/sys/organization.vue'),
    //     children: [],
    //     meta: {
    //         cardTitle: '组织架构' //页面中card的标签
    //     },
    //     hidden: true
    // },
    // {
    //     path: '/approve-set',
    //     title: '审批配置',
    //     name: 'approve-set',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/sys/approveSetList.vue'),
    //     children: [],
    //     meta: {
    //         cardTitle: '审批配置' //页面中card的标签
    //     },
    //     hidden: false
    // },
    // {
    //     path: '/approve-set',
    //     title: '审批配置',
    //     name: 'approve-set',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/secMenurouter.vue'),
    //     children: [{
    //         path: '/approve-new',
    //         title: '新建审批模板',
    //         // icon: 'ios-contact-outline',
    //         name: 'approve-new',
    //         component: () => import('../views/sys/approveSetNew.vue'),
    //         children: [],
    //         meta: {
    //             cardTitle: '新建审批模板' //页面中card的标签
    //         },
    //         // hidden: false
    //         hidden: true
    //     }],
    //     meta: {
    //         cardTitle: '审批配置' //页面中card的标签
    //     },
    //     hidden: true
    // },
    ],
    meta: {
      cardTitle: "系统管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/auditLog",
    title: "审计管理",
    icon: "md-settings",
    name: "auditLog",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: '/batchLog',
      title: '审计记录',
      name: 'batchLog',
      // icon: 'ios-contact-outline',
      component: () => import('../views/sys/BatchLog.vue'),
      children: [],
      meta: {
        cardTitle: '审计记录' //页面中card的标签
      },
      hidden: false
    }],
    meta: {
      cardTitle: "审计管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/downloadLog",
    title: "下载中心",
    icon: "md-settings",
    name: "downloadLog",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [
      {
        path: '/downloadLog',
        title: '下载中心',
        name: 'downloadLog',
        // icon: 'ios-contact-outline',
        component: () => import('../views/sys/downloadLogList.vue'),
        children: [],
        meta: {
          cardTitle: '下载中心' //页面中card的标签
        },
        hidden: false
      },
    ],
    meta: {
      cardTitle: "下载中心", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/people",
    title: "个人中心",
    name: "people",
    icon: "md-person",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/people",
      title: "个人中心",
      name: "people",
      // icon: 'ios-contact-outline',
      component: () => import("../views/people/people.vue"),
      children: [],
      meta: {
        cardTitle: "个人中心", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/change-Password",
      title: "修改密码",
      name: "change-Password",
      // icon: 'ios-contact-outline',
      component: () => import("../views/people/changePassword.vue"),
      children: [],
      meta: {
        cardTitle: "修改密码", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/quitLogon",
      title: "退出",
      name: "quitLogon",
      // icon: 'ios-power',
      children: [],
      meta: {
        cardTitle: "退出", //页面中card的标签,
      },
      hidden: false,
    },
    ],
    meta: {
      cardTitle: "个人中心", //页面中card的标签,
    },
    hidden: false,
  }
];

export const mainRouter = [
  {
    path: "/home",
    title: "首页",
    icon: "md-home",
    name: "home",
    children: [],
    iviewIcon: true,
    component: () => import("../views/Home.vue"),
    hidden: false,
  },
  {
    path: "/cockpit",
    // path: "/cockpit-cockpitlist",
    title: "驾驶舱",
    icon: "md-cube",
    // name: "cockpit",
    name: "cockpit-cockpitlist",
    redirect: "/cockpit-cockpitlist",
    component: () => import("../views/secMenurouter.vue"),
    // component: () => import("../views/cockpit/CockpitList.vue"),
    children: [{
      path: "/cockpit-cockpitlist",
      title: "驾驶舱",
      // icon: 'ios-list-box',
      name: "cockpit-cockpitlist",
      component: () => import("../views/cockpit/CockpitList.vue"),
      children: [

      ],
      meta: {
        cardTitle: "驾驶舱", //页面中card的标签,
      },
      hidden: false,
    },],
    meta: {
      cardTitle: "驾驶舱", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/team",
    title: "队伍管理",
    icon: "md-people",
    name: "team",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/team-list",
    children: [{
      path: "/team-list",
      title: "队伍查询",
      name: "team-list",
      component: () => import("../views/team/teamlist.vue"),
      children: [],
      meta: {
        cardTitle: "队伍查询", //页面中card的标签,
      },
      hidden: false,
    },
    {
      path: "/person-add",
      title: "新增人员",
      name: "personal_add",
      component: () => import("../views/team/addPerson.vue"),
      children: [],
      meta: {
        cardTitle: "新增人员", //页面中card的标签,
      },
      hidden: true,
    }, {
      path: '/person-edit',
      title: "编辑人员",
      name: "personal_edit",
      component: () => import("../views/team/addPerson.vue"),
      children: [],
      meta: {
        cardTitle: "编辑人员",
      },
      hidden: true
    },
    {
      path: "/team-achievement",
      title: "业绩查询",
      name: "team-achievement",
      component: () => import("../views/team/Achievement.vue"),
      children: [],
      meta: {
        cardTitle: "业绩查询", //页面中card的标签,
      },
      hidden: false,
    },
    ],
    meta: {
      cardTitle: "队伍管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/customer",
    title: "客户管理",
    icon: "md-contacts",
    name: "customer",
    redirect: "/customer-list",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/customer-list",
      title: "客户信息",
      // icon: 'ios-list-box',
      name: "customer-list",
      component: () => import("../views/customer/customerList.vue"),
      children: [],
      meta: {
        cardTitle: "客户信息", //页面中card的标签,
      },
      hidden: false,
    },
    {
      path: "/customer-detail",
      title: "画像分析",
      // icon: 'ios-list-box',
      name: "customer-detail",
      component: () => import("../views/customer/detail.vue"),
      children: [],
      meta: {
        cardTitle: "", //页面中card的标签,
      },
      hidden: false,
    },

    ],
    meta: {
      cardTitle: "客户管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/expand",
    title: "互联网推广",
    icon: "md-contacts",
    name: "expand",
    redirect: "/customer-assignment",
    component: () => import("../views/secMenurouter.vue"),
    children: [
      {
        path: "/retention-management",
        title: "留资管理",
        name: "retention-management",
        component: () => import("../views/customer/retentionManagement.vue"),
        children: [],
        meta: {
          cardTitle: "留资管理", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/product",
        title: "产品广告",
        name: "product",
        redirect: "/product_advertising",
        component: () => import("../views/secMenurouter.vue"),
        children: [
          {
            path: "/product_advertising",
            title: "数据查询",
            name: "product_advertising",
            component: () => import("../views/customer/productAdvertising.vue"),
            children: [],
            meta: {
              cardTitle: "数据查询", //页面中card的标签,
            },
            hidden: false,
          },
          {
            path: "/queryData",
            title: "咨询数据",
            name: "queryData",
            component: () => import("../views/customer/queryData.vue"),
            children: [],
            meta: {
              cardTitle: "咨询数据", //页面中card的标签,
            },
            hidden: false,
          },
          {
            path: "/channel_activity",
            title: "渠道活动码表",
            name: "channel_activity",
            component: () => import("../views/customer/channelacti.vue"),
            children: [],
            meta: {
              cardTitle: "渠道活动码表", //页面中card的标签,
            },
            hidden: false,
          },
          {
            path: "/product_link",
            title: "产品链接配置",
            name: "product_link",
            component: () => import("../views/customer/link.vue"),
            children: [],
            meta: {
              cardTitle: "产品链接配置", //页面中card的标签,
            },
            hidden: false,
          }
        ],
        meta: {
          cardTitle: "产品广告", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/checkManagementDetail",
        title: "审批详情",
        // icon: 'ios-list-box',
        name: "checkManagementDetail",
        component: () =>
          import("../views/checkManagement/checkManagementDetail.vue"),
        children: [],
        meta: {
          cardTitle: "审批详情", //页面中card的标签,
        },
        hidden: true,
      },
      {
        path: "/customer-assignment",
        title: "客户分配",
        name: "customer-assignment",
        component: () => import("../views/customer/customerAssignment.vue"),
        children: [],
        meta: {
          cardTitle: "客户分配", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/customer-promotion",
        title: "推广链接",
        name: "customer-promotion",
        component: () => import("../views/customer/promotion.vue"),
        children: [],
        meta: {
          cardTitle: "", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: '/customerChannel',
        title: "渠道推广",
        name: "customerChannel",
        component: () => import("../views/customer/channel.vue"),
        children: [],
        meta: {
          cardTitle: "",
        },
        hidden: true
      }
    ],
    meta: {
      cardTitle: "互联网推广",
    },
    hidden: false,
  },
  {
    // path: "/businessmanagement-businessList",
    // icon: 'ios-list-box',
    // name: "businessmanagement-businessList",
    // component: () => import("../views/businessmanagement/BusinessList.vue"),

    path: "/businessmanagement",
    title: "业务管理",
    icon: "md-list-box",
    name: "businessmanagement",
    redirect: "/businessmanagement-businessList",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/businessmanagement-businessList",
      title: "网销业务查询",
      // icon: 'ios-list-box',
      name: "businessmanagement-businessList",
      component: () => import("../views/businessmanagement/BusinessList.vue"),
      children: [],
      meta: {
        cardTitle: "业务查询", //页面中card的标签,
      },
      hidden: false,
    },
    {
      path: "/agentBusinessList",
      title: "代理人业务查询",
      // icon: 'ios-list-box',
      name: "agentBusinessList",
      component: () => import("../views/businessmanagement/AgentBusinessList.vue"),
      children: [],
      meta: {
        cardTitle: "业务查询", //页面中card的标签,
      },
      hidden: false,
    },
    {
      path: "/businessmanagementDetail/:policyId",
      title: "保单详情",
      // icon: 'ios-list-box',
      name: "businessmanagementDetail",
      component: () =>
        import("../views/businessmanagement/BusinessDetail.vue"),
      children: [],
      meta: {
        cardTitle: "保单详情", //页面中card的标签,
      },
      hidden: true,
    },
    {
      path: "/agentDetail/:policyId",
      title: "保单详情",
      // icon: 'ios-list-box',
      name: "agentDetail",
      component: () =>
        import("../views/businessmanagement/AgentDetail.vue"),
      children: [],
      meta: {
        cardTitle: "保单详情", //页面中card的标签,
      },
      hidden: true,
    },
    {
      path: "/businessmanagement-proposal",
      title: "建议书统计",
      name: "businessmanagement-proposal",
      component: () => import("../views/businessmanagement/BusinessProposal.vue"),
      children: [

      ],
      meta: {
        cardTitle: "建议书统计",
      },
      hidden: false,
    },
    {
      path: "/businessmanagement-proposal",
      title: "建议书统计",
      name: "businessmanagementProposal",
      component: () => import("../views/thrMenuRouter.vue"),
      children: [{
        path: "/businessProposal/:proposalId/:yearDate/:type",
        title: "推送明细",
        name: "businessProposalDetail",
        component: () => import("../views/businessmanagement/proposalDetail.vue"),
        children: [],
        meta: {
          cardTitle: "推送明细",
        },
        hidden: true,
      }],
      meta: {
        cardTitle: "建议书统计",
      },
      hidden: true,
    },

    ],
    meta: {
      cardTitle: "业务管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/checkManagement",
    title: "面部识别人工审核",
    icon: "md-list-box",
    name: "checkManagement",
    redirect: "/checkManagementNot",
    component: () => import("../views/secMenurouter.vue"),
    children: [
      {
        path: "/checkManagementNot",
        title: "代理人未审核",
        name: "checkManagementNot",
        component: () => import("../views/checkManagement/checkManagementNot.vue"),
        children: [],
        meta: {
          cardTitle: "代理人未审核", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/OnlineSalesCheckNot",
        title: "网销未审核",
        name: "OnlineSalesCheckNot",
        component: () => import("../views/checkManagement/OnlineSalesCheckNot.vue"),
        children: [],
        meta: {
          cardTitle: "网销未审核", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/checkManagementAlready",
        title: "已审核列表",
        name: "checkManagementAlready",
        component: () => import("../views/checkManagement/checkManagementAlready.vue"),
        children: [],
        meta: {
          cardTitle: "已审核列表", //页面中card的标签,
        },
        hidden: false,
      },
      {
        path: "/checkManagementDetail/:policyId",
        title: "审批详情",
        // icon: 'ios-list-box',
        name: "checkManagementDetail1",
        component: () =>
          import("../views/checkManagement/checkManagementDetail.vue"),
        children: [],
        meta: {
          cardTitle: "审批详情", //页面中card的标签,
        },
        hidden: true,
      },
      {
        path: "/checkOnlineSalesDetail/:policyId",
        title: "审批详情",
        // icon: 'ios-list-box',
        name: "checkOnlineSalesDetail",
        component: () =>
          import("../views/checkManagement/checkOnlineSalesDetail.vue"),
        children: [],
        meta: {
          cardTitle: "审批详情", //页面中card的标签,
        },
        hidden: true,
      }
    ],
    meta: {
      cardTitle: "面部识别人工审核", //页面中card的标签,
    },
    hidden: false,
  },
  {
    title: "活动管理",
    icon: "md-analytics",
    path: "/activityData",
    name: "activityData",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/activityData",
    // component: () => import("../views/secMenurouter.vue"),
    // redirect: "/activityData",
    children: [{
      path: "/activityData",
      title: "活动数据查询",
      name: "activityData",
      component: () => import("../views/activity/activityData.vue"),
      children: [],
      meta: {
        cardTitle: "活动数据查询",
      },
      hidden: false,
    },
    {
      path: "/signIn",
      title: "签到数据",
      name: "signIn",
      component: () => import("../views/activity/signIn.vue"),
      children: [],
      meta: {
        cardTitle: "签到数据查询",
      },
      hidden: false,
    }
  ],
    meta: {
      cardTitle: "活动管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    title: "内容存档",
    icon: "ios-chatbubbles",
    path: "/content-file",
    name: "conversation",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/content-file",
    // component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/content-file",
      title: "内容存档",
      name: "content-file",
      component: () => import("../views/conversation/contentFile.vue"),
      children: [],
      meta: {
        cardTitle: "内容存档",
      },
      hidden: false,
    },
    {
      path: "/Illegal",
      title: "违规词库",
      name: "Illegal",
      component: () => import("../views/conversation/Illegal.vue"),
      children: [],
      meta: {
        cardTitle: "违规词库",
      },
      hidden: false,
    },
    ],
    meta: {
      cardTitle: "违规词库", //页面中card的标签,
    },
    hidden: false,
  },
  {
    title: "内容管理",
    icon: "ios-chatbubbles",
    path: "/content-manage",
    name: "contentManage",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/content-management",
    meta: {
      cardTitle: "内容管理",
    },
    hidden: false,
    children: [
      {
        title: "栏目管理",
        path: "/column",
        name: "column",
        component: () => import("../views/contentManage/column.vue"),
        children: [],
        meta: {
          cardTitle: "栏目管理",
        },
        hidden: false
      },
      {
        title: "内容管理",
        path: "/content-management",
        name: "contentManagement",
        component: () => import("../views/contentManage/contentManagement.vue"),
        children: [],
        meta: {
          cardTitle: "内容管理",
        },
        hidden: false
      },
      {
        title: "内容管理",
        path: "/content-management",
        name: "contentManagement",
        component: () => import("../views/thrMenuRouter.vue"),
        redirect: "/addContentManage",
        children: [
          {
            title: "新增内容",
            path: "/addContentManage",
            name: "addContentManage",
            component: () => import("../views/contentManage/form/addContent.vue"),
            meta: {
              cardTitle: "新增内容",
            },
            hidden: true,
            children: []
          },
          {
            title: "日历配置",
            path: "/calendarConfige",
            name: "calendarConfige",
            component: () => import("../views/contentManage/form/calendarConfige.vue"),
            meta: {
              cardTitle: "日历配置",
            },
            hidden: true,
            children: []
          },
          {
            title: "编辑内容",
            path: "/editContentManage",
            name: "editContentManage",
            component: () => import("../views/contentManage/form/addContent.vue"),
            meta: {
              cardTitle: "编辑内容",
            },
            hidden: true,
            children: []
          }],
        meta: {
          cardTitle: "内容管理",
        },
        hidden: true
      },
      {
        title: "轮播图管理",
        path: "/slidesshow",
        name: "slidesshow",
        component: () => import("../views/contentManage/slidesshow.vue"),
        children: [],
        meta: {
          cardTitle: "轮播图管理",
        },
        hidden: false
      },
      {
        title: "轮播图管理",
        path: "/slidesshow",
        name: "slidesshow",
        component: () => import("../views/thrMenuRouter.vue"),
        redirect: "/slidesshowImg",
        children: [{
          title: "新增图片",
          path: "/slidesshowImg",
          name: "slidesshowImg",
          component: () => import("../views/contentManage/form/addImg.vue"),
          meta: {
            cardTitle: "新增图片",
          },
          hidden: true,
          children: []
        }, {
          title: "编辑图片",
          path: "/slidesshowEditImg",
          name: "slidesshowEditImg",
          component: () => import("../views/contentManage/form/addImg.vue"),
          meta: {
            cardTitle: "编辑图片",
          },
          hidden: true,
          children: []
        }],
        meta: {
          cardTitle: "轮播图管理",
        },
        hidden: true
      },
      {
        title: "审核记录",
        path: "/auditRecordList",
        name: "auditRecordList",
        component: () => import("../views/contentManage/auditRecordList.vue"),
        children: [],
        meta: {
          cardTitle: "审核记录",
        },
        hidden: false
      },
    ]
  },
  {
    title: "健康管理",
    icon: "ios-pulse",
    path: "/healthy-manage",
    name: "healthyManage",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/doctorService",
    meta: {
      cardTitle: "健康管理",
    },
    hidden: false,
    children: [
      {
        title: "御医服务",
        path: "/doctorService",
        name: "doctorService",
        component: () => import("../views/healthyManage/doctorService.vue"),
        children: [],
        meta: {
          cardTitle: "御医服务",
        },
        hidden: false
      }
    ]
  },
  {
    title: "运营支持",
    icon: "ios-pulsoperationSupporte",
    path: "/operationSupport",
    name: "operationSupport",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/importList",
    meta: {
      cardTitle: "运营支持",
    },
    hidden: false,
    children: [
      {
        title: "直播统计",
        path: "/importList",
        name: "importList",
        component: () => import("../views/operationSupport/importList.vue"),
        children: [],
        meta: {
          cardTitle: "直播统计",
        },
        hidden: false
      },
      {
        title: "会话统计",
        path: "/wxSessionStatistics",
        name: "wxSessionStatistics",
        component: () => import("../views/operationSupport/wxSessionStatistics.vue"),
        children: [],
        meta: {
          cardTitle: "会话统计",
        },
        hidden: false
      },
      {
        title: "统计数据",
        path: "/statisticalData",
        name: "statisticalData",
        component: () => import("../views/operationSupport/components/statisticalData.vue"),
        children: [],
        meta: {
          cardTitle: "统计数据",
        },
        hidden: true
      },
      {
        title: "查看数据",
        path: "/viewData",
        name: "viewData",
        component: () => import("../views/operationSupport/components/viewData.vue"),
        children: [],
        meta: {
          cardTitle: "查看数据",
        },
        hidden: true
      }
    ]
  },
  {
    path: "/sys",
    title: "系统管理",
    icon: "md-settings",
    name: "sys",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/manage",
      title: "数据字典",
      name: "manage",
      component: () => import("../views/activity/manage.vue"),
      children: [],
      meta: {
        cardTitle: "数据字典",
      },
      hidden: false,
    },
    {
      path: "/user",
      title: "用户管理",
      name: "user",
      // icon: 'ios-contact-outline',
      component: () => import("../views/sys/user.vue"),
      children: [],
      meta: {
        cardTitle: "用户管理", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/role",
      title: "角色管理",
      name: "role",
      // icon: 'ios-contact-outline',
      component: () => import("../views/sys/role.vue"),
      children: [],
      meta: {
        cardTitle: "角色管理", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: '/menu',
      title: '菜单管理',
      name: 'menu',
      // icon: 'ios-contact-outline',
      component: () => import('../views/sys/menu.vue'),
      children: [],
      meta: {
        cardTitle: '菜单管理' //页面中card的标签
      },
      hidden: false
    },
    // {
    //     path: '/organization',
    //     title: '组织架构',
    //     name: 'organization',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/sys/organization.vue'),
    //     children: [],
    //     meta: {
    //         cardTitle: '组织架构' //页面中card的标签
    //     },
    //     hidden: true
    // },
    // {
    //     path: '/approve-set',
    //     title: '审批配置',
    //     name: 'approve-set',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/sys/approveSetList.vue'),
    //     children: [],
    //     meta: {
    //         cardTitle: '审批配置' //页面中card的标签
    //     },
    //     hidden: false
    // },
    // {
    //     path: '/approve-set',
    //     title: '审批配置',
    //     name: 'approve-set',
    //     // icon: 'ios-contact-outline',
    //     component: () => import('../views/secMenurouter.vue'),
    //     children: [{
    //         path: '/approve-new',
    //         title: '新建审批模板',
    //         // icon: 'ios-contact-outline',
    //         name: 'approve-new',
    //         component: () => import('../views/sys/approveSetNew.vue'),
    //         children: [],
    //         meta: {
    //             cardTitle: '新建审批模板' //页面中card的标签
    //         },
    //         // hidden: false
    //         hidden: true
    //     }],
    //     meta: {
    //         cardTitle: '审批配置' //页面中card的标签
    //     },
    //     hidden: true
    // },
      {
        path: '/downloadCenter',
        title: '下载中心',
        name: 'downloadCenter',
        // icon: 'ios-contact-outline',
        component: () => import('../views/sys/downloadLogList.vue'),
        children: [],
        meta: {
          cardTitle: '下载中心' //页面中card的标签
        },
        hidden: false
      },
    ],
    meta: {
      cardTitle: "系统管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/auditLog",
    title: "审计管理",
    icon: "md-settings",
    name: "auditLog",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
        path: '/batchLog',
        title: '审计记录',
        name: 'batchLog',
        // icon: 'ios-contact-outline',
        component: () => import('../views/sys/BatchLog.vue'),
        children: [],
        meta: {
          cardTitle: '审计记录' //页面中card的标签
        },
        hidden: false
    }],
    meta: {
      cardTitle: "审计管理", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/downloadCenter",
    title: "下载中心",
    icon: "md-settings",
    name: "downloadCenter",
    redirect: "/user",
    component: () => import("../views/secMenurouter.vue"),
    children: [
      {
        path: '/downloadLog',
        title: '下载中心',
        name: 'downloadLog',
        // icon: 'ios-contact-outline',
        component: () => import('../views/sys/downloadLogList.vue'),
        children: [],
        meta: {
          cardTitle: '下载中心' //页面中card的标签
        },
        hidden: false
      },
    ],
    meta: {
      cardTitle: "下载中心", //页面中card的标签,
    },
    hidden: false,
  },
  {
    path: "/people",
    title: "个人中心",
    name: "people",
    icon: "md-person",
    component: () => import("../views/secMenurouter.vue"),
    children: [{
      path: "/people",
      title: "个人中心",
      name: "people",
      // icon: 'ios-contact-outline',
      component: () => import("../views/people/people.vue"),
      children: [],
      meta: {
        cardTitle: "个人中心", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/change-Password",
      title: "修改密码",
      name: "change-Password",
      // icon: 'ios-contact-outline',
      component: () => import("../views/people/changePassword.vue"),
      children: [],
      meta: {
        cardTitle: "修改密码", //页面中card的标签
      },
      hidden: false,
    },
    {
      path: "/quitLogon",
      title: "退出",
      name: "quitLogon",
      // icon: 'ios-power',
      children: [],
      meta: {
        cardTitle: "退出", //页面中card的标签,
      },
      hidden: false,
    },
    ],
    meta: {
      cardTitle: "个人中心", //页面中card的标签,
    },
    hidden: false,
  }, {
    title: "培训考试",
    icon: "ios-pulse",
    path: "/training-test",
    name: "trainingTest",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/questionBank",
    meta: {
      cardTitle: "培训考试",
    },
    hidden: false,
    children: [
      {
        title: "题库管理",
        path: "/questionBank",
        name: "questionBank",
        component: () => import("../views/trainingTest/questionBank.vue"),
        meta: {
          title: "题库管理",
          cardTitle: "题库管理",
        },
        hidden: false
      },
      {
        title: "试题列表",
        path: "/questionList",
        name: "questionList",
        component: () => import("../views/trainingTest/questionList.vue"),
        meta: {
          title: "试题列表",
          cardTitle: "试题列表",
        },
        hidden: false
      },
      {
        title: "常规考试管理",
        path: "/regularExamManage",
        name: "regularExamManage",
        component: () => import("../views/trainingTest/regularExamManage.vue"),
        meta: {
          title: "常规考试管理",
          cardTitle: "常规考试管理",
        },
        hidden: false
      },
      {
        title: "考试人员列表",
        path: "/examPeopleList",
        name: "examPeopleList",
        component: () => import("../views/trainingTest/examPeopleList.vue"),
        meta: {
          title: "考试人员列表",
          cardTitle: "考试人员列表",
        },
        hidden: false
      },
      {
        title: "答卷详情",
        path: "/questionareDetails",
        name: "questionareDetails",
        component: () => import("../views/trainingTest/questionareDetails.vue"),
        meta: {
          title: "答卷详情",
          cardTitle: "答卷详情",
        },
        hidden: false
      },
      {
        title: "新人考试管理",
        path: "/newExamManage",
        name: "newExamManage",
        component: () => import("../views/trainingTest/newExamManage.vue"),
        meta: {
          title: "新人考试管理",
          cardTitle: "新人考试管理",
        },
        hidden: false
      },
    ]
  }, {
    title: "投放线索",
    icon: "ios-pulse",
    path: "/post-clue",
    name: "postClue",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/clueTable",
    meta: {
      cardTitle: "投放线索",
    },
    hidden: false,
    children: [
      {
        title: "线索报表",
        path: "/clueTable",
        name: "clueTable",
        component: () => import("../views/clue/clueTable.vue"),
        meta: {
          title: "线索报表",
          cardTitle: "线索报表",
        },
        hidden: false
      },
      {
        title: "详情说明",
        path: "/reDistributionDetails",
        name: "reDistributionDetails",
        component: () => import("../views/clue/reDistributionDetails.vue"),
        meta: {
          title: "详情说明",
          cardTitle: "详情说明",
        },
        hidden: false
      },
      {
        title: "权重配置",
        path: "/weightConfig",
        name: "weightConfig",
        component: () => import("../views/clue/weightConfig.vue"),
        meta: {
          title: "权重配置",
          cardTitle: "权重配置",
        },
        hidden: false
      },
      {
        title: "代理人权重",
        path: "/agentWeight",
        name: "agentWeight",
        component: () => import("../views/clue/agentWeight.vue"),
        meta: {
          title: "代理人权重",
          cardTitle: "代理人权重",
        },
        hidden: false
      },
    ]
  }, {
    title: "渠道推广",
    icon: "ios-pulse",
    path: "/channel-popularize",
    name: "channelPopularize",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/channelManage",
    meta: {
      cardTitle: "渠道管理",
    },
    hidden: false,
    children: [
      {
        title: "渠道管理",
        path: "/channelManage",
        name: "channelManage",
        component: () => import("../views/channel/index.vue"),
        meta: {
          title: "渠道管理",
          cardTitle: "渠道管理",
        },
        hidden: false
      },
      {
        title: "渠道目录",
        path: "/channelMenu",
        name: "channelMenu",
        component: () => import("../views/channel/channelMenu.vue"),
        meta: {
          title: "渠道目录",
          cardTitle: "渠道目录",
        },
        hidden: false
      },
      {
        path: "/popularizeConfig",
        title: "推广配置",
        name: "popularizeConfig",
        redirect: "/entranceManagement",
        component: () => import("../views/secMenurouter.vue"),
        children: [
          {
            title: "入口管理",
            path: "/entranceManagement",
            name: "entranceManagement",
            component: () => import("../views/channel/entranceManagement.vue"),
            meta: {
              title: "入口管理",
              cardTitle: "入口管理",
            },
            hidden: false
          },
          {
            title: "链接配置",
            path: "/linkConfig",
            name: "linkConfig",
            component: () => import("../views/channel/linkConfig.vue"),
            meta: {
              title: "链接配置",
              cardTitle: "链接配置",
            },
            hidden: false
          },
        ]
      }
    ]
  },{
    title: "场景管理",
    icon: "ios-pulse",
    path: "/sceneManagement",
    name: "sceneManagement",
    component: () => import("../views/secMenurouter.vue"),
    redirect: "/sceneManagement",
    meta: {
      cardTitle: "场景管理",
    },
    hidden: false,
    children: [
      {
        path: "/contentTypeList",
        title: "内容类型管理",
        name: "contentTypeList",
        component: () => import("../views/sceneManagement/dictionaries/ContentTypeList.vue"),
        meta: {
          title: "内容类型管理",
          cardTitle: "内容类型管理",
        },
        hidden: false
      },{
        path: "/activityTypeList",
        title: "活动类型管理",
        name: "activityTypeList",
        component: () => import("../views/sceneManagement/dictionaries/ActivityTypeList.vue"),
        meta: {
          title: "活动类型管理",
          cardTitle: "活动类型管理",
        },
        hidden: false
      },{
        path: "/signInLinkList",
        title: "签到链接管理",
        name: "signInLinkList",
        component: () => import("../views/sceneManagement/dictionaries/SignInLinkList.vue"),
        meta: {
          title: "签到链接管理",
          cardTitle: "签到链接管理",
        },
        hidden: false
      },{
        path: "/applicationList",
        title: "活动申请",
        name: "applicationList",
        component: () => import("../views/sceneManagement/ApplicationList.vue"),
        meta: {
          title: "活动申请",
          cardTitle: "活动申请",
        },
        hidden: false
      },{
        path: "/activityList",
        title: "场次管理",
        name: "activityList",
        component: () => import("../views/sceneManagement/ActivityList.vue"),
        meta: {
          title: "场次管理",
          cardTitle: "场次管理",
        },
        hidden: false
      },{
        path: "/monthlyCalendar",
        title: "活动日程表",
        name: "monthlyCalendar",
        component: () => import("../views/sceneManagement/MonthlyCalendar.vue"),
        meta: {
          title: "活动日程表",
          cardTitle: "活动日程表",
        },
        hidden: false
      }
    ]
  }
];

export const projectRouter = [
  {
    // path: "/",
    path: "*",
    redirect: "/login",
    // redirect: "/custom",
  },
  {
    path: "/login",
    title: "登录",
    name: "login",
    component: () => import("../views/login"),
  },
  {
    path: "/main",
    title: "首页",
    name: "main",
    component: Main,
    redirect: "/home",
    icon: "ios-contact-outline",
    children: mainRouter,
  },
  {
    path: "/custom",
    title: "定制保障方案",
    name: "custom",
    component: () => import("../views/h5/index.vue"),
    meta: {
      title: "保险咨询",
    },
    children: [{
      path: "/custom",
      title: "定制保障方案",
      name: "custom",
      meta: {
        title: "保险咨询",
      },
      component: () => import("../views/h5/home.vue"),
    },
    {
      path: "/appointment",
      title: "定制保障方案",
      name: "appointment",
      meta: {
        title: "保险咨询",
      },
      component: () => import("../views/h5/appointment.vue"),
    },
    {
      path: "/submit",
      title: "定制保障方案",
      name: "submit",
      meta: {
        title: "保险咨询",
      },
      component: () => import("../views/h5/submit.vue"),
    },
    ]
  },
  {
    path: "/customerAssignment",
    title: "客户分配",
    name: "customerAssignment",
    component: () => import("../views/h5/indexCustomer.vue"),
    meta: {
      title: "保险咨询",
    },
    children: [
      // {
      //   path: "/customerAssignment",
      //   title: "客户分配",
      //   name: "customerAssignment",
      //   meta: {
      //     title: "保险咨询",
      //   },
      //   component: () => import("../views/h5/homeCusttomer.vue"),
      // },
      {
        path: "/customerAllot",
        title: "客户分配",
        name: "customerAllot",
        meta: {
          title: "保险咨询",
        },
        component: () => import("../views/h5/customerAllot.vue"),
      },
    ]
  },
  {
    path: "/mobileLogin",
    title: "注册登录",
    name: "mobileLogin",
    component: () => import("../views/h5/questionare/login.vue"),
    meta: {
      title: "注册登录",
    },
  },
  {
    path: "/wxLogin",
    title: "登陆",
    name: "wxLogin",
    component: () => import("../views/h5/questionare/wxLogin.vue"),
    meta: {
      title: "登陆",
    },
  },
  {
    path: "/questionareHome",
    title: "首页",
    name: "questionareHome",
    component: () => import("../views/h5/questionare/home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/questionareQuestions",
    title: "考试",
    name: "questionareQuestions",
    component: () => import("../views/h5/questionare/questions.vue"),
    meta: {
      title: "考试",
    },
  },
  {
    path: "/questionareResult",
    title: "考试",
    name: "questionareResult",
    component: () => import("../views/h5/questionare/result.vue"),
    meta: {
      title: "考试",
    },
  },
  {
    path: "/clueList",
    title: "线索详情",
    name: "clueList",
    component: () => import("../views/h5/clue/list.vue"),
    meta: {
      title: "线索详情",
    },
  },
  {
    path: "/clueDetails",
    title: "线索详情",
    name: "clueDetails",
    component: () => import("../views/h5/clue/details.vue"),
    meta: {
      title: "线索详情",
    },
  },
];

export const routers = [...projectRouter];