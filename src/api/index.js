import {
  post,
  post2,
  get,
  put,
  put2,
  put3,
  del,
  postLogin,
  postAndGet,
  download,
  downloadGet,
  postImg
} from "./api.js";
import baseUrl from "./setBaseUrl";

const h5base = process.env.NODE_ENV === 'development' ? baseUrl.base : process.env.VUE_APP_CALLBACKURL

export default {
  //查看图片的网络资源地址
  imgLoadUrl: baseUrl.api,
  //问题列表
  getQuestionList: (params) =>
    get(baseUrl.api + "/api/customer/question/list", params),
  // 拿code换取微信信息
  getWxUserInfo: (params) => get(baseUrl.base_h5 + "/api/customer/wechat/getUserInfo", params),
  //获取关联的问题列表
  sharedQuestionList: (params) =>
    get(baseUrl.api + "/api/customer/shared/questions", params),
  //获取用户足迹列表
  sharedTracksList: (params) =>
    get(baseUrl.api + "/api/customer/shared/tracks", params),
  //获取用户参与的活动列表
  sharedaActivitiesList: (params) =>
    get(baseUrl.api + "/api/customer/shared/activities", params),
  //客户分配列表
  customerSharedList: (params) =>
    post(baseUrl.api + "/api/customer/shared/page", params),
  //产品广告
  product_promotion: (params) => post(baseUrl.api + "/api/internet_promotion/product_promotion/page", params),
  //数据查询
  queryData: (params) => post(baseUrl.api + "/api/internet_promotion/product_promotion/queryData", params),
  productAdvertisementChannel: (params) => post(baseUrl.base + "/api/cms/productAdvertisementChannel/page", params),
  productAdvertisementActivity: (params) => post(baseUrl.base + "/api/cms/productAdvertisementActivity/page", params),
  //新增
  productAdvertisementChannelCreate: (params) => post(baseUrl.base + "/api/cms/productAdvertisementChannel/create", params),
  productAdvertisementChannelUpdate: (params) => post(baseUrl.base + "/api/cms/productAdvertisementChannel/update", params),
  productAdvertisementChannelDelete: (params) => post(baseUrl.base + "/api/cms/productAdvertisementChannel/batchDelete", params),
  productAdvertisementChannelList: (params) => post(baseUrl.base + "/api/cms/productAdvertisementChannel/list", params),
  //新增
  productAdvertisementActivityCreate: (params) => post(baseUrl.base + "/api/cms/productAdvertisementActivity/create", params),
  productAdvertisementActivityUpdatee: (params) => post(baseUrl.base + "/api/cms/productAdvertisementActivity/update", params),
  productAdvertisementActivityDelete: (params) => post(baseUrl.base + "/api/cms/productAdvertisementActivity/batchDelete", params),
  //产品名称
  productAdvertisementInfoList: (params) => post(baseUrl.base + "/api/cms/productAdvertisementInfo/list", params),
  //通过产品编码获取版本列表
  getByProductCode: (params) => get(baseUrl.base + "/api/cms/productAdvertisementInfo/getByProductCode", params),
  //新增广告链接
  productAdvertisementUrlCreate: (params) => post(baseUrl.base + "/api/cms/productAdvertisementUrl/create", params),
  //活动列表不分页
  productAdvertisementActivityList: (params) => post(baseUrl.base + "/api/cms/productAdvertisementActivity/list", params),
  //产品链接
  productAdvertisementUrlList: (params) => post(baseUrl.base + "/api/cms/productAdvertisementUrl/page", params),
  productAdvertisementUrlbatchDelete: (params) => post(baseUrl.base + "/api/cms/productAdvertisementUrl/batchDelete", params),
  //导出
  product_promotionExport: (params) => download(baseUrl.base + "/api/internet_promotion/product_promotion/export", params), //导出
  //导出
  queryDataExport: (params) => download(baseUrl.base + "/api/internet_promotion/product_promotion/queryDataExport", params), //导出
  //留子管理
  retainedcapital: (params) =>
    post(baseUrl.api + "/api/mall/retainedcapital/page", params),
  //分配客户
  pushShared: (params) =>
    postAndGet(baseUrl.api + "/api/customer/shared/pushShared", params),
  //登录接口
  //login: (params) => post(baseUrl.base + "/api/user/login", params),
  login: (params) => postLogin(baseUrl.base + "/api/user/login", params),//账号密码的验证码登录接口
  mobileLogin: (params) => postLogin(baseUrl.base + "/api/user/mobile/login", params),//手机验证码登录接口
  getCompnayByUserName: (params) =>
    get(baseUrl.base + "/dept-info/getDeptCodeAndNameByUsername", params),
  loginOut: (params) => post(baseUrl.base + "/api/user/loginOut", params), //登出接口
  getUserInfo: (params) =>
    get(baseUrl.base + "/api/user/getUserBySid?sid=" + params), //获取用户userId
  thedoctorList: (params) =>
    post(baseUrl.base + "/api/thedoctor/page", params), //御医服务-列表查询
  checkPasswordSecurity: (params) =>
    post(baseUrl.base + "/api/user/checkPasswordSecurity", params),
  // user_info: (params) => get(baseUrl.base + '/api/user/getUserLogin/', params),
  user_info: (params) => get(baseUrl.base + "/api/user/getSelfInfo", params), //获取用户信息
  user_info_uu: (params) => get(baseUrl.base + "/api/user/getUser", params), //获取用户信息

  // personal_change_password: (params) => post(baseUrl.base + '/api/user/updatePassword', params),
  personal_change_password: (params) =>
    post(baseUrl.base + "/api/user/updatePassword", params), //个人中心 中 修改密码
  personal_complete: (params) =>
    post(baseUrl.base + "/api/user/update", params), //个人中心 中 完成

  //获取菜单接口
  getUserMenu: (params) =>
    post(baseUrl.base + "/api/RoleMenuController/getRoleMenuVOByRoles", params),
  getMenuList: (params) =>
    get(baseUrl.base + "/api/JurisdictionController/menuList", params), //获得菜单列表
  createMenu: (params) =>
    post(baseUrl.base + "/api/JurisdictionController/create", params), //新建菜单
  updateMenu: (params) =>
    post(baseUrl.base + "/api/JurisdictionController/update", params), //编辑菜单
  delMenu: (params) =>
    post(baseUrl.base + "/api/JurisdictionController/delete", params), //删除菜单

  //角色
  getRoleList: (params) =>
    post(baseUrl.base + "/api/RoleController/page", params), //获得分页列表
  getRoleAllList: (params) =>
    post(baseUrl.base + "/api/RoleController/list", params), //获得全部列表
  createRole: (params) =>
    post(baseUrl.base + "/api/RoleController/add", params), //新建
  updateRole: (params) =>
    post(baseUrl.base + "/api/RoleController/update", params), //编辑
  delRole: (params) =>
    post(baseUrl.base + "/api/RoleController/batchDeleteRole", params), //删除角色
  enablePeople: (params) =>
    get(baseUrl.base + "/api/RoleController/enable", params), //启用角色
  disablePeople: (params) =>
    get(baseUrl.base + "/api/RoleController/disable", params), //停用角色
  setAuthsForRole: (params) =>
    post(baseUrl.base + "/api/roleAuth/setAuthsForRole", params),
  queryAuthsByRole: (params) =>
    get(baseUrl.base + "/api/roleAuth/queryAuthsByRole", params),
  test_post: (params) =>
    post(baseUrl.base + "/api/cms/docking/test_post", params),
  test_get: (params) =>
    get(baseUrl.base + "/api/cms/docking/test_get", params),
  queryAuthsByRoleList: (params) =>
    get(baseUrl.base + "/api/roleAuth/queryAuthsDataByRole", params),
  //违规词库
  //删除
  tabooWordsDelete: (params) => post(baseUrl.base + "/api/weChatWork/tabooWords/delete", params),
  //导入
  tabooWordsImport: baseUrl.base + "/api/weChatWork/tabooWords/import",
  //导入
  channelImport: baseUrl.base + "/api/cms/channel/import",
  // 下载模板
  exportChannelTemplate: (params) =>
    downloadGet(baseUrl.base + "/api/cms/channel/template", params),
  // 下载模板
  exportTemplate: (params) =>
    download(baseUrl.base + "/api/weChatWork/tabooWords/exportTemplate", params),
  tabooWordsCreate: (params) => post(baseUrl.base + "/api/weChatWork/tabooWords/create", params),
  tabooWordsPage: (params) => post(baseUrl.base + "/api/weChatWork/tabooWords/page", params),
  //字典配置 
  dictionaryList: (params) => post(baseUrl.base + "/api/dictionary/page", params),
  //活动类别查询
  // queryRelationInfo: (params) => post(baseUrl.base + "/api/dictionary/queryRelationInfo", params),
  //细分类别和活动主题查询
  queryChildInfo: (params) => post(baseUrl.base + "/api/dictionary/queryChildInfo", params),
  //子集列表
  dictionaryPageChild: (params) => post(baseUrl.base + "/api/dictionary/pageChild", params),
  //不分页查询
  dictionaryListNoPage: (params) => post(baseUrl.base + "/api/dictionary/list", params),
  //根据关联代码查询关联字典
  queryByRelationCode: (params) => post(baseUrl.base + "/api/dictionary/queryByRelationCode", params),
  //不分页查询子集
  dictionaryChildListNoPage: (params) => post(baseUrl.base + "/api/dictionary/childList", params),
  createUser: (params) => post(baseUrl.base + "/api/user/create", params),
  updateUser: (params) => post(baseUrl.base + "/api/user/update", params),
  delUser: (params) => post(baseUrl.base + "/api/user/deleteBatch", params),
  //用户管理
  getUserList: (params) => post(baseUrl.base + "/api/user/pageByDept", params),
  dictionarycreate: (params) => post(baseUrl.base + "/api/dictionary/create", params),
  dictionaryupdate: (params) => post(baseUrl.base + "/api/dictionary/update", params),
  dictionarydelete: (params) => post(baseUrl.base + "/api/dictionary/delete", params),
  channeldelete: (params) => get(baseUrl.base + "/api/cms/channel/delete", params),
  //数据字典的子集
  dictionarycreateChild: (params) => post(baseUrl.base + "/api/dictionary/createChild", params),
  dictionaryupdateChild: (params) => post(baseUrl.base + "/api/dictionary/updateChild", params),
  //
  resetPassword: (params) =>
    post(baseUrl.base + "/api/user/resetPassword", params),
  //所属公司机构
  getCompanyList: (params) =>
    post(baseUrl.api + "/CustomerController/list", params),
  //活动量数据
  //图表
  statistics: (params) =>
    post(baseUrl.api + "/api/activity/statistics", params),
  getActivityList: (params) => post(baseUrl.base + "/api/activity/page", params),
  signIn:(params) => post(baseUrl.base + "/api/activity/signIn", params),//活动签到
  exportSignInData:(params) => download(baseUrl.base + "/api/activity/exportSignInData", params),//活动签到下载
  activityexport: (params) =>
    download(baseUrl.base + "/api/activity/export", params),
  customerSharExport: (params) =>
    download(baseUrl.base + "/api/customer/shared/export", params), //客户分配导出
  retainedcapitalExport: (params) =>
    download(baseUrl.base + "/api/mall/retainedcapital/export", params), //导出
  exportTracks: (params) =>
    download(baseUrl.base + "/api/customer/shared/exportTracks", params), //客户分配轨迹导出
  //所属部门
  getDeptController: (params) =>
    post(baseUrl.api + "/DeptController/list", params),

  //队伍管理---队伍查询
  getSalesTeamPage: (params) =>
    post(baseUrl.base + "/api/teamManage/salesTeam/page", params), //队伍管理--队伍查询分页
  recoverWxCode: (params) =>
    post(baseUrl.base + "/api/teamManage/salesman/recoverWxCode", params), //微信二维码重新获取
  getManageOrgList: (params) =>
    get(baseUrl.base + "/api/teamManage/salesTeam/manageOrgList", params), //管理机构不分页查询
  getSalesTeamList: (params) =>
    get(baseUrl.base + "/api/teamManage/salesTeam/salesTeamList", params), //销售团队不分页查询
  batchImportSalesTeam: baseUrl.api + "/api/teamManage/salesTeam/import", //批量导入

  //队伍管理---个人查询
  getSalesmanPage: (params) =>
    post(baseUrl.base + "/api/teamManage/salesman/page", params), //队伍管理--队伍查询分页
  getSalesmanManageOrgList: (params) =>
    get(baseUrl.base + "/api/teamManage/salesman/manageOrgList", params), //管理机构不分页查询
  getSalesmaSalesTeamList: (params) =>
    get(baseUrl.base + "/api/teamManage/salesman/salesTeamList", params), //销售机构不分页查询
  batchImportSalesMam: baseUrl.api + "/api/teamManage/salesman/import", //批量导入
  salesMamImportImage: baseUrl.api + "/api/teamManage/salesman/saveImage", //上传头像
  personDownTemplate: (params) => download(baseUrl.base + "/api/teamManage/salesman/exportTemplate", params), //个人查询下载模板
  getSalesInfo: (params) => post(baseUrl.base + "/api/teamManage/salesman/getSalesInfo", params), //企业微信userid
  getDepartment: (params) => get(baseUrl.base + "/api/teamManage/salesman/getDeptList", params), //部门接口
  callScheduleMission: (params) => get(baseUrl.base + "/api/weChatWork/chat/callScheduleMission", params),
  //队伍管理---业绩查询
  getAchievementTeamPage: (params) =>
    post(baseUrl.base + "/api/mall/achievement/teamPage", params), //队伍管理--一业绩查询分页

  //队伍管理---个人业绩查询
  getAchievementPersonPage: (params) =>
    post(baseUrl.base + "/api/mall/achievement/personPage", params), //队伍管理--一个人业绩查询分页
  // addPerson:baseUrl.api+'/api/teamManage/salesman/insertPersonnel',//新增人员
  addPerson: (params) =>
    postImg(baseUrl.base + '/api/teamManage/salesman/insertPersonnel', params), //新增人员
  editPerson: (params) =>
    postImg(baseUrl.base + '/api/teamManage/salesman/updatePersonnel', params), //编辑人员  

  //客户管理
  getCustomerPage: (params) =>
    post(baseUrl.base + "/api/mall/customer/page", params), //客户管理分页查询
  getCityList: (params) =>
    get(baseUrl.base + "/api/mall/customer/cityList", params), //地域
  childCityList: (params) =>
    get(baseUrl.base + "/api/mall/customer/childCityList", params), //下级地域
  userSourceList: (params) =>
    get(baseUrl.base + "/api/mall/customer/userSourceList", params), //来源
  getHobbiesList: (params) =>
    get(baseUrl.base + "/api/mall/customer/hobbies", params), //爱好
  getPortrayal: (params) =>
    get(baseUrl.base + "/api/mall/customer/portrayal", params), //画像分析
  postExport: (params) =>
    post(baseUrl.base + "/api/mall/customer/export", params), //导出

  //未审核分页数据查询
  notApprovalPage: (params) =>
    post(baseUrl.base + "/api/approval/notApprovalPage", params),
  //网销未审核
  notApprovalOnlineSalesPage: (params) =>
    post(baseUrl.base + "/api/approval/notApprovalOnlineSalesPage", params), 
  approvalPage: (params) =>
    post(baseUrl.base + "/api/approval/approvalPage", params),
  getApprovalData: (params) =>
    get(baseUrl.base + "/api/approval/getApprovalData", params),//已审批详情
  getNotApprovalDetail: (params) =>
    get(baseUrl.base + "/api/approval/getNotApprovalDetail", params),//待审批详情
  onlineSalesDetail: (params) =>
    get(baseUrl.base + "/api/approval/onlineSalesDetail", params),//待审批详情
  //未审核导出
  exportNotApprovalTemplate: (params) =>
    download(baseUrl.base + "/api/approval/exportNotApprovalTemplate", params),
  checkOnlineSalesExport: (params) =>
    download(baseUrl.base + "/api/approval/checkOnlineSalesExport", params),
  //已审核导出
  exportApprovalTemplate: (params) =>
    download(baseUrl.base + "/api/approval/exportApprovalTemplate", params),
  //审批 
  approvalCommit: (params) =>
    post(baseUrl.base + "/api/approval/approvalCommit", params),
  onlineSalesCommit: (params) =>
    post(baseUrl.base + "/api/approval/onlineSalesCommit", params),
  getImage: (params) =>
    get(baseUrl.base + "/api/approval/getImage", params), //获取图片base64信息

  //业务管理
  getPolicyPage: (params) =>
    post(baseUrl.base + "/api/mall/policy/page", params), //网销业务管理查询分页
  getAgentPolicyPage: (params) =>
    post(baseUrl.base + "/api/mall/agentPolicy/page", params), //代理人管理查询分页
  getPolicyByIdList: (params) =>
    get(baseUrl.base + "/api/mall/policy/query", params), //网销查询机构列表
  getAgentPolicyByIdList: (params) =>
    get(baseUrl.base + "/api/mall/agentPolicy/query", params), //代理人查询机构列表
  getLiabilityList: (params) =>
    get(baseUrl.base + "/api/mall/policy/queryLiabilityList", params), //网销查询险种列表
  getAgentLiabilityList: (params) =>
    get(baseUrl.base + "/api/mall/agentPolicy/queryLiabilityList", params), //代理人查询险种列表
  getOrgList: (params) =>
    get(baseUrl.base + "/api/mall/policy/queryOrgList", params), //查询机构列表
  getAgentOrgList: (params) =>
    get(baseUrl.base + "/api/mall/agentPolicy/queryOrgList", params), //查询代理人机构列表
  // batchExportPolicy: baseUrl.api + "/api/mall/policy/export", //批量导出
  batchAgentExportPolicy: (params) =>
    download(baseUrl.base + "/api/mall/agentPolicy/export", params),//代理人导出数据
  batchExportPolicy: (params) =>
    download(baseUrl.base + "/api/mall/policy/export", params),//网销导出数据
  dropdownBox: (params) => get(baseUrl.base + "/api/mall/channelInfo/dropdownBox", params), //销售渠道

  //审核管理
  getExaminePage: (params) =>
    post(baseUrl.base + "/api/mall/examine/page", params), //业务管理查询分页
  getExamineList: (params) =>
    get(baseUrl.base + "/api/mall/examine/query", params), //查询机构列表
  getExamineProductList: (params) =>
    get(baseUrl.base + "/api/mall/examine/productList", params), //查询机构列表

  // 会话管理
  getChatDetail: (params) =>
    post(baseUrl.base + "/api/weChatWork/chat/chatDetail", params), //用户会话详情
  getDeptUserList: (params) =>
    get(baseUrl.base + "/api/weChatWork/chat/deptUserList", params), //部门用户列表
  getUserChatList: (params) => post(baseUrl.base + "/api/weChatWork/chat/userChatList", params), //用户会话列表
  tabooWordsList: (params) => post(baseUrl.base + "/api/weChatWork/tabooWords/list", params), //关键字列表
  // 驾驶舱
  // 驾驶舱-保险业务
  getProductData: (params) =>
    post(baseUrl.base + "/insurance/getProductData", params), //驾驶舱-产品相关数据
  getTotalByDate: (params) =>
    post(baseUrl.base + "/insurance/getTotalByDate", params), //驾驶舱-根据时间,查询保单件数和新单保费
  getAgeBySource: (params) =>
    post(baseUrl.base + "/insurance/getAgeBySource", params), //驾驶舱-各来源新单用户年龄分布
  getSexBySource: (params) =>
    post(baseUrl.base + "/insurance/getSexBySource", params), //驾驶舱-各来源新单用户性别分布
  getPayPeriodBySource: (params) => post(baseUrl.base + "/insurance/getPayPeriodBySource", params), //驾驶舱-各来源新单交费年期分布
  getProductBySource: (params) => post(baseUrl.base + "/insurance/getProductBySource", params), //驾驶舱-各来源产品分布
  getAvgPremiumBySource: (params) => post(baseUrl.base + "/insurance/getAvgPremiumBySource", params), //驾驶舱-各来源件均分布
  getNewPolicyBySource: (params) => post(baseUrl.base + "/insurance/getNewPolicyBySource", params), //驾驶舱-各来源保单件数占比
  getNewPremiumBySource: (params) =>
    post(baseUrl.base + "/insurance/getNewPremiumBySource", params), //驾驶舱-各来源新单保费占比
  getNewUserBySource: (params) =>
    post(baseUrl.base + "/insurance/getNewUserBySource", params), //驾驶舱-各来源新单用户占比(保单客户来源占比)
  getBusinessIndicators: (params) =>
    post(baseUrl.base + "/insurance/getBusinessIndicators", params), //驾驶舱-年度业务指标达成率（页面累计）
  //根据时间,查询各个地区的新单保费
  getRegionPremiumByDate: (params) =>
    post(baseUrl.base + "/insurance/getRegionPremiumByDate", params),
  //根据时间,查询各个地区的保单件数
  getRegionTotalByDate: (params) =>
    post(baseUrl.base + "/insurance/getRegionTotalByDate", params),
  getAgeByProduct: (params) => post(baseUrl.base + "/insurance/getAgeByProduct", params), //各产品年龄分布
  getSexByProduct: (params) => post(baseUrl.base + "/insurance/getSexByProduct", params), //各产品性别分布
  getSourceFromByProduct: (params) => post(baseUrl.base + "/insurance/getSourceFromByProduct", params), //各产品来源分布
  getPayPeriodByProduct: (params) => post(baseUrl.base + "/insurance/getPayPeriodByProduct", params), //各产品年期分布
  getAvgPremiumByProduct: (params) => post(baseUrl.base + "/insurance/getAvgPremiumByProduct", params), //各产品均件保费分布
  getGroupChatStatistic: (params) => post(baseUrl.base + "/customerManage/getGroupChatStatistic", params), //社群活跃度指标
  // 驾驶舱-客户经营
  getCumulativeUser: (params) =>
    get(baseUrl.base + "/customerManage/getCumulativeUser", params), //驾驶舱-累计用户接口
  getCustomerData: (params) =>
    post(baseUrl.base + "/customerManage/getCustomerData", params), //驾驶舱-客户经营-根据时间,获取获客数据     
  getCustomerIndicators: (params) =>
    post(baseUrl.base + "/customerManage/getCustomerIndicators", params), //驾驶舱-客户经营-获取年度客户指标达成率
  getOverallDataByDate: (params) =>
    post(baseUrl.base + "/customerManage/getOverallDataByDate", params), //驾驶舱-客户经营-私域用户中间页面接口
  getUserActivity: (params) =>
    post(baseUrl.base + "/customerManage/getUserActivity", params), //驾驶舱-客户经营-根据时间,获取用户活动数据
  getUserLevel: (params) =>
    post(baseUrl.base + "/customerManage/getUserLevel", params), //驾驶舱-客户经营-根据时间,获取用户等级数据
  getUserSource: (params) =>
    post(baseUrl.base + "/customerManage/getUserSource", params), //驾驶舱-客户经营-根据时间,获取用户来源数据

  // 推广链接
  channelCreate: (params) => post(baseUrl.base + "/api/customer/popularize/channel/create", params), //渠道推广创建
  channelDelete: (params) => post(baseUrl.base + "/api/customer/popularize/channel/delete", params), //渠道推广删除
  channelPage: (params) => post(baseUrl.base + "/api/customer/popularize/channel/page", params), //渠道推广分页
  channelList: (params) => get(baseUrl.base + "/api/customer/popularize/channel/list", params), //新增链接下的推广渠道list
  userIdData: (params) => post(baseUrl.base + "/api/teamManage/salesman/getSalesmanPage", params), //获取推广
  linkCreate: (params) => post(baseUrl.base + "/api/customer/popularize/link/create", params), //推广链接创建
  linkDelete: (params) => post(baseUrl.base + "/api/customer/popularize/link/delete", params), //推广链接删除
  linkPage: (params) => post(baseUrl.base + "/api/customer/popularize/link/page", params), //推广链接分页查询
  linkExport: (params) => download(baseUrl.base + "/api/customer/popularize/link/export", params), //推广链接列表导出
  linkOrg: (params) => post(baseUrl.base + "/CustomerController/list", params), //推广人员管理机构
  qrCode: (params) => get(baseUrl.base + '/api/teamManage/salesman/getSalesmanByUserId', params), //二维码
  downQr: (params) => get(baseUrl.base + '/api/teamManage/salesman/downloadWxCode', params),//下载二维码
  downQrCode: (url, params) => downloadGet(url, params), //二维码下载
  updateChannelLink: (params) => post(baseUrl.base + '/api/customer/popularize/link/updateChannel', params),//更新推广渠道的链接

  // h5相关接口
  getSelectList: (params) => get(baseUrl.base_h5 + "/api/customer/question/list", params), //多选接口
  getArea: (params) => post(baseUrl.base_h5 + "/api/dictionary/childList", params), //地区接口
  getVerifi: (params) => get(baseUrl.base_h5 + "/api/weChatWork/getConfig/getVerificationCode", params),// 获取验证码
  checkValifi: (params) => get(baseUrl.base_h5 + "/api/weChatWork/getConfig/validateCode", params),// 校验验证码是否正确
  checkRepeat: (params) => get(baseUrl.base_h5 + "/api/customer/shared/checkRepeat", params), // 校验是否已预约
  submitAppointment: (params) => post(baseUrl.base_h5 + "/api/customer/shared/create", params), //提交预约
  // 测试接口
  ceshi: (params) => get(baseUrl.base_h5 + "/api/weChatWork/getConfig/getServerUserId", params),
  // 获取微信个人信息
  getWXInfo: (params) => get(baseUrl.wx + "/weixin", params),

  // 建议书统计模块接口
  proposalDetail: (params) => post(baseUrl.base + "/api/recommendation/detail", params),//明细查询
  proposalPushDetail: (params) => post(baseUrl.base + "/api/recommendation/pushDetail", params),//推送明细查询
  proposalExportDerail: (params) => download(baseUrl.base + "/api/recommendation/exportDetail", params),//导出明细表
  proposalExportSummary: (params) => download(baseUrl.base + "/api/recommendation/exportSummary", params),//导出汇总表
  proposalSummarySearch: (params) => post(baseUrl.base + "/api/recommendation/summary", params),//汇总记录查询
  proposalSummaryDetailSearch: (params) => post(baseUrl.base + "/api/recommendation/summaryDetail", params),//建议书统计模块推送明细记录查询

  // 轮播图管理
  BannerList: (params) => post(baseUrl.base + "/api/cms/banner/BannerList", params),//banner列表
  photoPage: (params) => post(baseUrl.base + "/api/cms/banner/photoPage", params),//图片信息分页查询
  updateBannerStatus: (params) => get(baseUrl.base + "/api/cms/banner/updateBannerStatus", params),//更新状态
  updateBannerData: (params) => post(baseUrl.base + "/api/cms/banner/batchUpdateBanner", params),//更新轮播图
  updateSort: (params) => post(baseUrl.base + "/api/cms/banner/updateSort", params),//排序
  newBannerData: (params) => post(baseUrl.base + "/api/cms/banner/batchAddBanner", params),//新增轮播图
  deleteBannerData: (params) => post(baseUrl.base + "/api/cms/banner/batchdeleteBanner", params),//批量删除
  uploadImage: baseUrl.api + "/api/common/file/upload",//上传图片

  // 内容管理
  updateSortContent: (params) => post(baseUrl.base + "/api/cms/content/updateSort", params),//排序
  contentPage: (params) => post(baseUrl.base + "/api/cms/content/page", params),//分页数据查询
  contentCreate: (params) => post(baseUrl.base + "/api/cms/content/create", params),//创建
  contentDelete: (params) => post(baseUrl.base + "/api/cms/content/delete", params),//删除
  releasedStatus: (params) => post(baseUrl.base + "/api/cms/content/released", params),//发布
  removedStatus: (params) => post(baseUrl.base + "/api/cms/content/removed", params),//下架
  advanceNotice: (params) => post(baseUrl.base + "/api/cms/content/advanceNotice", params),//预告
  lineStreaming: (params) => post(baseUrl.base + "/api/cms/content/lineStreaming", params),//直播中
  playback: (params) => post(baseUrl.base + "/api/cms/content/playback", params),//回放

  draft: (params) => post(baseUrl.base + "/api/cms/content/draft", params),//草稿
  homeAdvert: (params) => post(baseUrl.base + "/api/cms/content/homeAdvert", params),//首推
  cancelHomeAdvert: (params) => post(baseUrl.base + "/api/cms/content/cancelHomeAdvert", params),//取消首推
  contentTop: (params) => post(baseUrl.base + "/api/cms/content/top", params),//置顶
  contentCancelTop: (params) => post(baseUrl.base + "/api/cms/content/cancelTop", params),//取消置顶
  contentUpdate: (params) => post(baseUrl.base + "/api/cms/content/update", params),//更新
  updatePageViews: (params) => post(baseUrl.base + "/api/cms/content/updatePageViews", params),//修改阅读量
  themeAdvert: (params) => post(baseUrl.base + "/api/cms/content/themeAdvert", params),//主题推
  cancelThemeAdvert: (params) => post(baseUrl.base + "/api/cms/content/cancelThemeAdvert", params),//取消主题推
  //contentQuery:(params)=>post(baseUrl.base+"/api/cms/content/query",params),//查询
  contentQuery: (params) => get(baseUrl.base + "/api/cms/content/query", params),//查询
  // contentQuery:(params)=>post(baseUrl.base+"/api/cms/content/query",params),//查询
  cmsCreate: (params) => post(baseUrl.base + "/api/cms/content/create", params),//cms创建
  channelTree: (params) => get(baseUrl.base + "/api/cms/channel/channelTree", params),//栏目查询
  addOrEdit: (params) => post(baseUrl.base + "/api/cms/channel/addOrEdit", params),//栏目查询
  queryRelationInfo: (params) => post(baseUrl.base + "/api/dictionary/queryRelationInfo", params),//朝智讲堂角标查询
  getLabelTree: (params) => get(baseUrl.base + "/api/cms/label/labelTree", params),//查询栏目树形结构
  getInsideTheme: (params) => get(baseUrl.base + "/api/cms/channel/getInsideTheme", params),//获取一级主题
  //获取主题下的栏目
  getInsideColumn: (params) => get(baseUrl.base + "/api/cms/channel/getInsideColumn", params),
  channelView: (params) => get(baseUrl.base + "/api/cms/channel/view", params),
  getContentList: (params) => post(baseUrl.base + "/api/cms/content/list", params),//不分页查询内容管理
  getCalendarList: (params) => post(baseUrl.base + "/api/cms/content/calendar/page", params),//日历配置列表
  updateMarkDate: (params) => post(baseUrl.base + "/api/cms/content/calendar/create", params),//日历配置列表--选择日期
  getMarkDate: (params) => get(baseUrl.base + "/api/cms/content/calendar/getMarkDays", params),//日历配置列表--获取禁选日期
  clearMarkDate: (params) => post(baseUrl.base + "/api/cms/content/calendar/delete", params),//日历配置列表--清空日期

  // 角色管理
  getAllChannelOneLevel: (params) => get(baseUrl.base + "/api/cms/roleChannel/getAllChannelOneLevel", params),//获取所有第一级主题
  getChannelByRole: (params) => get(baseUrl.base + "/api/cms/roleChannel/getChannelByRole", params),//通过角色主键获取主题信息
  saveChannel: (params) => post(baseUrl.base + "/api/cms/roleChannel/save", params),//保存权限
  // pc端登陆验证码获取接口
  getVerifiPC: (params) => get(baseUrl.base + "/api/weChatWork/getConfig/getVerificationCode", params),// 获取验证码
  getUserInfoByUserName: (params) => get(baseUrl.base + "/api/user/getUserInfoByUserName", params),// 获取手机号
  statusToPreview: (params) => get(baseUrl.base + "/api/cms/content/status_to_preview", params),// 内容管理--更改内容状态为预览
  auditRecord: (params) => get(baseUrl.base + "/api/cms/contentAudit/audit_record", params),// 内容管理--审核记录
  contentAuditList: (params) => post(baseUrl.base + "/api/cms/contentAudit/page", params),// 内容管理--审核列表
  sureAudit: (params) => post(baseUrl.base + "/api/cms/contentAudit/audit", params),// 内容管理--审核确定
  commitAudit: (params) => get(baseUrl.base + "/api/cms/content/commit_to_audit", params),// 内容管理--提交审核--列表只传一个id
  commitAuditCon: (params) => post(baseUrl.base + "/api/cms/content/edit_commit", params),// 内容管理--提交审核--内容
  batchAddAndCommit: (params) => post(baseUrl.base + "/api/cms/banner/batchAddAndCommit", params),// 轮播图管理--提交审核--新增内容
  batchUpdateAndCommit: (params) => post(baseUrl.base + "/api/cms/banner/batchUpdateAndCommit", params),// 轮播图管理--提交审核--修改内容
  bannerViewDetail: (params) => get(baseUrl.base + "/api/cms/banner/view", params),// 轮播图管理--详情编辑查询

  //直播统计
  liveBroadcastStatisticsList: (params) => post(baseUrl.base + "/api/operationSupport/liveBroadcastStatisticsList", params), //直播统计--上传数据批次列表
  getImportDataInviteTalent: (params) => post(baseUrl.base + "/api/operationSupport/getImportDataInviteTalent", params), //直播统计--查看导入数据详情-邀请达人榜
  getImportDataInviteUserInfo: (params) => post(baseUrl.base + "/api/operationSupport/getImportDataInviteUserInfo", params), //直播统计--查看导入数据详情-邀请用户信息
  getStatisticalData: (params) => post(baseUrl.base + "/api/operationSupport/getStatisticalData", params), //直播统计-- 查看统计数据
  postImportInfo: (params) => post(baseUrl.base + "/api/operationSupport/importInfo", params), //上传数据批次列表
  exportStatisticalData: (params) => download(baseUrl.base + "/api/operationSupport/exportAll", params),  //统计结果导出
  wxSessionStatistics: (params) => post(baseUrl.base + "/api/operationSupport/wxSessionStatistics", params),  //会话统计列表
  wxSessionStatisticsExport: (params) => download(baseUrl.base + "/api/operationSupport/export", params),  //会话统计导出
  // 培训考试
  questionBankList: (params) => get(baseUrl.base + "/api/examType/queryListPage", params),//题库列表
  questionBankTree: (params) => get(baseUrl.base + "/api/examType/tree", params),//题库树
  questionBankTypeList: (params) => get(baseUrl.base + "/api/examType/list", params),//题库类型列表，按等级
  deleteQuestionBankType: (params) => get(baseUrl.base + "/api/examType/del", params),//删除一个题库
  addQuestionBankType: (params) => post(baseUrl.base + "/api/examType/add", params),//增加一个题库
  editQuestionBankType: (params) => post(baseUrl.base + "/api/examType/edit", params),//更新一个题库
  importFile: (params) => post(baseUrl.base + "/api/examQuestions/import", params),//上传试题
  questionList: (params) => get(baseUrl.base + "/api/examQuestions/queryByPage", params),//试题列表
  examPeopleList: (params) => get(baseUrl.base + "/api/examUserLog/queryByPage", params),//考试人员列表
  peopleList: (params) => get(baseUrl.base + "/api/examUser/queryByPage", params),//代理人列表
  examTaskList: (params) => get(baseUrl.base + "/api/examTask/queryByPage", params),//考试任务列表
  addExamTask: (params) => post(baseUrl.base + "/api/examTask/add", params),//添加考试任务
  addNewExamTask: (params) => post(baseUrl.base + "/api/examTask/new", params),//添加新人考试任务
  updateExamTask: (params) => post(baseUrl.base + "/api/examTask/edit", params),//添加考试任务
  delExamTask: (params) => get(baseUrl.base + "/api/examTask/deleteById", params),//删除考试任务
  getExamTask: (params) => get(baseUrl.base + "/api/examTask/queryByPage", params),//获取考试任务
  recallExamTask: (params) => post(baseUrl.base + "/api/examTask/status", params),//撤回考试任务
  getPeopleAnswers: (params) => get(baseUrl.base + "/api/examUserQuestions/queryAll", params),//获取考卷详情
  getQrCode: (params) => download(baseUrl.base + "/api/examTask/qrcode", params),//二维码
  downloadQuestionModule: (params) => download(baseUrl.base + "/api/examQuestions/download", params),// 下载实体模板
  // h5端接口
  mobileLogin: (params) => post(h5base + "/api/exam/join", params),//登录 userName,mobile,
  taskList: (params) => get(h5base + "/api/exam/task/list", params),//用户的可考列表 logId

  questionStart: (params) => get(h5base + "/api/exam/question/start", params),//开始答题 taskId,logId 并返回题目列表
  questionUpdate: (params) => post(h5base + "/api/exam/question/update", params),//提交一道题 taskId,logId，quesitons（题目id）, submit(答案)
  logSubmit: (params) => post(h5base + "/api/exam/log/submit", params),//提交试题 
  answerDetails: (params) => get(h5base + "/api/exam/examUserQuestions", params),//答题详情, 同 getPeopleAnswers
  oneTask: (params) => get(h5base + "/api/exam/task/info", params),// 获取一个任务，不需要登录验证的
  questionResult: (params) => get(h5base + "/api/exam/question/result", params),// 获取问题结果详情，不需要登录验证的
  wxworkInfoByCode: (params) => get(h5base + "/api/exam/wxLogin", params),// 根据code获取登录人员信息
  // 线索
  addWeight: (params) => post(baseUrl.base + "/api/clue/weight/add", params),//添加权重
  editWeight: (params) => post(baseUrl.base + "/api/clue/weight/edit", params),//更新权重
  getWeightList: (params) => get(baseUrl.base + "/api/clue/weight/list", params),//权重列表
  getOneWeight: (params) => get(baseUrl.base + "/api/clue/weight/batch", params),//获取一个权重
  getAgentList: (params) => get(baseUrl.base + "/api/clue/weight/detp/users", params),//代理人
  deleteWeight: (params) => get(baseUrl.base + "/api/clue/weight/delete", params),//删除权重
  getClueList: (params) => get(baseUrl.base + "/api/clue/list", params),//线索列表
  reallocate: (params) => post(baseUrl.base + "/api/clue/reallocate", params),//重新分配
  export: (params) => download(baseUrl.base + "/api/clue/export", params),//导出线索列表
  getProductList: (params) => get(baseUrl.base + "/api/clue/product/list", params),//产品列表
  clueDetails: (params) => get(baseUrl.base + "/api/clue/detail", params),//线索跟进详情


  // 移动端接口
  getClueStatusList: (params) => post(h5base + "/api/clueMobile/pageChild", params), //产品状态
  getApiClueList: (params) => get(h5base + "/api/clueMobile/list", params),//线索列表
  getOneApiClue: (params) => get(h5base + "/api/clueMobile/one", params),//线索详情
  addApiClue: (params) => post(h5base + "/api/clueMobile/log/add", params),//线索详情保存
  apiProductList: (params) => get(h5base + "/api/clueMobile/product/list", params),//产品列表
  externalContact: (params) => get(h5base + "/api/clueMobile/wx/externalContact", params),//外部联系人
  
  // 渠道推广
  channelList: (params) => get(baseUrl.base + "/api/channelType/queryListPage", params),//渠道列表
  channelTypeList: (params) => get(baseUrl.base + "/api/channelType/list", params),//渠道类型列表
  channelTypeGetCode: (params) => get(baseUrl.base + "/api/channelType/getCode", params),//渠道编码生成
  channelTypeTree: (params) => get(baseUrl.base + "/api/channelType/tree", params),//渠道树
  addChannelType: (params) => post(baseUrl.base + "/api/channelType/add", params),//增加一个渠道
  editChannelType: (params) => post(baseUrl.base + "/api/channelType/edit", params),//更新一个渠道
  deleteChannelType: (params) => get(baseUrl.base + "/api/channelType/del", params),//删除一个渠道

  // 入口管理
  channelEntranceList: (params) => get(baseUrl.base + "/api/channelEntrance/list", params),//入口管理列表
  addChannelEntrance: (params) => post(baseUrl.base + "/api/channelEntrance/add", params),//增加一个入口管理
  editChannelEntrance: (params) => post(baseUrl.base + "/api/channelEntrance/edit", params),//编辑一个入口管理
  deleteChannelEntrance: (params) => get(baseUrl.base + "/api/channelEntrance/delete", params),//删除一个入口管理
  oneChannelEntrance: (params) => get(baseUrl.base + "/api/channelEntrance/one", params),//一个渠道

  // 连接配置
  channelLinkList: (params) => get(baseUrl.base + "/api/channelLink/list", params),//链接配置列表
  addChannelLink: (params) => post(baseUrl.base + "/api/channelLink/add", params),//增加一个链接配置
  editChannelLink: (params) => post(baseUrl.base + "/api/channelLink/edit", params),//编辑一个链接配置
  deleteChannelLink: (params) => get(baseUrl.base + "/api/channelLink/delete", params),//删除一个链接配置
  oneChannelLink: (params) => get(baseUrl.base + "/api/channelLink/one", params),//一个链接配置
  getChannelLinkQrCode: (params) => download(baseUrl.base + "/api/channelLink/qrcode", params),//下载二维码
  getOperateList: (params) => post(baseUrl.base + "/api/operate/page", params),//一个链接配置
  downloadLogList:(params) => post(baseUrl.base + "/api/download/Information/page",params),//导出记录列表
  downloadLogFile: (params) => download(baseUrl.base + "/api/download/Information/export", params),// 下载中心下载文件

  activityTypeList: (params) => post(baseUrl.base + "/api/scene/activityType/page", params),//活动类型列表
  addActivity:(params)=>post(baseUrl.base + "/api/scene/activityType/addNew", params),//活动类型新增
  deleteActivityById: (params) => get(baseUrl.base + "/api/scene/activityType/deleteById", params),//活动类型列表
  updateActivity:(params)=>post(baseUrl.base + "/api/scene/activityType/update", params),//活动类型新增

  contentTypeList: (params) => post(baseUrl.base + "/api/scene/contentType/page", params),//内容类型列表
  addContentType: (params) => post(baseUrl.base + "/api/scene/contentType/addNew", params),//增加一个内容类型
  deleteContentType: (params) => post(baseUrl.base + "/api/scene/contentType/deleteById", params),//内容类型列表
  updateContentType: (params) => post(baseUrl.base + "/api/scene/contentType/update", params),//内容类型列表

};