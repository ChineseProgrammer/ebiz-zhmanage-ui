export const viewData1 = [
  {
    type: "index",
    width: 60,
    align: "center",
    title: "序号",
    fixed: "left",
  },
  {
    title: "客户名称(微信昵称)",
    key: "wechatNickname",
    width: 150,
  },
  {
    title: "原始邀请人",
    key: "originalInvitee",
    width: 120,
  },
  {
    title: "被邀层级",
    key: "invitedLevel",
    width: 120,
  },
  {
    title: "所属机构",
    key: "organization",
    width: 120,
  },
  {
    title: "俱乐部会员",
    key: "clubMember",
    width: 60,
    render: (h, params) => {
      let name = "";
      if (params.row.clubMember == 1) {
        name = "是";
      } else if (params.row.clubMember == 0 ) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "本次直播新增注",
    key: "newUser",
    width: 70,
    render: (h, params) => {
      let name = params.row.newUser;
      if (params.row.newUser === "1") {
        name = "是";
      } else if (params.row.newUser === "0"||params.row.newUser == 0) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "官方客服",
    key: "customerService",
    width: 40,
    render: (h, params) => {
      let name = "";
      if (params.row.customerService == 1) {
        name = "是";
      } else {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "直播观看时长",
    key: "viewingDuration",
    width: 150,
  },
  {
    title: "直播观看的秒数",
    key: "viewingSeconds",
    width: 150,
  },
  {
    title: "有效观看",
    key: "effectiveViewing",
    width: 50,
    render: (h, params) => {
      let name = "";
      if (params.row.effectiveViewing == "1") {
        name = "是";
      } else if (params.row.effectiveViewing === "0"||params.row.effectiveViewing == 0) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "邀请人数",
    key: "invitedNum",
    width: 50,
  },
  {
    title: "礼品资格邀约三人",
    key: "giftQualification",
    width: 80,
    render: (h, params) => {
      let name = "";
      if (params.row.giftQualification == 1 ) {
        name = "是";
      } else if (params.row.giftQualification == 0 ||params.row.giftQualification == 0) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "礼品资格邀请榜前5",
    key: "topFive",
    width: 80,
    render: (h, params) => {
      let name = ""
      if (params.row.topFive == 1) {
        name = "是";
      } else if (params.row.topFive == 0 ||params.row.topFive == 0) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "邮寄地址",
    key: "mailingAddress",
    width: 50,
    render: (h, params) => {
      let name = "";
      if (params.row.mailingAddress == "1" ) {
        name = "是";
      } else if (params.row.mailingAddress === "0" ||params.row.mailingAddress == 0) {
        name = "否";
      }
      return h("div", name);
    }
  },
  {
    title: "咨询",
    key: "consultingService",
    width: 40,
    render: (h, params) => {
      let name = "";
      if (params.row.consultingService == "1" ) {
        name = "是";
      } else if (params.row.consultingService === "0" ||params.row.consultingService === 0) {
        name = "否";
      }
      return h("div", name);
    }
  }
]