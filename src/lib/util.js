import { Modal, Spin } from "view-design";
import rules from "../validate/validateUtils";
let util = {
  rules: rules,
  openModelForm: (params) => {
    var self = params.self;
    var title = params.title;
    var width = params.width ? params.width : 600;
    var form = params.form;
    var props = params.props;
    var loading = true;
    var modelContext = null;
    var okstr = params.okstr ? params.okstr : "确定";
    var okDisable = params.okDisabled;
    Modal.confirm({
      title: title,
      ref: "model",
      scrollable: true,
      render: (h) => {
        return h(form, {
          //在此处使用引入的组件
          ref: "formModel",
          props: props,
          on: {
            finish: (res) => {
              self.$Modal.remove();
              params.success(res);
            },
            cancel: (res) => {
              self.$Modal.remove();
            },
            error: (res) => {
              modelContext.buttonLoading = false;
            },
          },
        });
      },
      width: width,
      closable: false,
      okText: okstr,
      cancelText: "取消",
      loading: true,
      onOk() {
        modelContext = this;
        this.$refs.formModel.handleSubmit();
      },
      onCancel() {
        params.cancel();
      },
    });
    //渲染完成后 将title的图标去掉
    self.$nextTick(function() {
      document.getElementsByClassName(
        "ivu-modal-confirm-head"
      )[0].style.lineHeight = "43px";
      document.getElementsByClassName(
        "ivu-modal-confirm-head-icon"
      )[0].style.display = "none";
      if (okstr != "确定" && okDisable == "1") {
        let buttonList = document.getElementsByClassName("ivu-btn-primary");
        for (let i = 0; i < buttonList.length; i++) {
          if (buttonList[i].innerText == okstr) {
            buttonList[i].disabled = true;
            return true;
          }
        }
      }
    });
  },
  datetimeFormat(longTypeDate) {
    var dateTypeDate = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateTypeDate += date.getFullYear(); //年
    dateTypeDate += "-" + this.getMonth(date); //月
    dateTypeDate += "-" + this.getDay(date); //日
    dateTypeDate += " " + this.getHours(date); //时
    dateTypeDate += ":" + this.getMinutes(date); //分
    dateTypeDate += ":" + this.getSeconds(date); //分
    return dateTypeDate;
  },
  /*
   * 时间格式化工具
   * 把Long类型的1527672756454日期还原yyyy-MM-dd格式日期
   */
  dateFormat(longTypeDate) {
    var dateTypeDate = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateTypeDate += date.getFullYear(); //年
    dateTypeDate += "-" + this.getMonth(date); //月
    dateTypeDate += "-" + this.getDay(date); //日
    return dateTypeDate;
  },
  dateFormat2(date, fmt) {
    // 如果是时间戳的话那么转换成Date类型
    if (typeof date === 'number') {
      date = new Date(date)
    } else if (typeof date === 'string') {
      date = new Date(parseInt(date))
    }

    let o = {
      // 月份
      'M+': date.getMonth() + 1,
      // 日
      'd+': date.getDate(),
      // 小时
      'h+': date.getHours(),
      // 分
      'm+': date.getMinutes(),
      // 秒
      's+': date.getSeconds(),
      // 季度
      'q+': Math.floor((date.getMonth() + 3) / 3),
      // 毫秒
      'S': date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt
  },
  dateToLong(date) {
    let moveInArray = date.split("-");
    let d = new Date();
    d.setFullYear(moveInArray[0]);
    d.setMonth(moveInArray[1] - 1);
    d.setDate(moveInArray[2]);
    return d.getTime();
  },
  //返回 01-12 的月份值
  getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
      month = "0" + month;
    }
    return month;
  },
  //返回01-30的日期
  getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    return day;
  },
  //小时
  getHours(date) {
    var hours = "";
    hours = date.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    return hours;
  },
  //分
  getMinutes(date) {
    var minute = "";
    minute = date.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }
    return minute;
  },
  //秒
  getSeconds(date) {
    var second = "";
    second = date.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }
    return second;
  },
  //获得两个时间区间的日期
  getDateSelection: (begin, end) => {
    var arr = [];
    var dateStart = new Date(begin).getTime();
    var dateEnd = new Date(end).getTime();
    for (var k = dateStart; k <= dateEnd; ) {
      //console.log((new Date(parseInt(k))).format());
      k = k + 24 * 60 * 60 * 1000;
      arr.push(util.getFormatOnlyDate(k));
    }
    return arr;
  },
  downloadFile: (href, name) => {
    var a = document.createElement("a");
    a.href = href;
    a.download = name ? name : "文件下载";
    document.body.append(a);
    a.click();
  },

  cityData: {
    上海: {
      上海: [
        "黄浦区",
        "卢湾区",
        "徐汇区",
        "长宁区",
        "静安区",
        "普陀区",
        "闸北区",
        "虹口区",
        "杨浦区",
        "闵行区",
        "宝山区",
        "嘉定区",
        "浦东新区",
        "金山区",
        "松江区",
        "青浦区",
        "奉贤区",
        "崇明县",
        "其他",
      ],
    },
    云南: {
      临沧: [
        "临翔区",
        "凤庆县",
        "云县",
        "永德县",
        "镇康县",
        "双江拉祜族佤族布朗族傣族自治县",
        "耿马傣族佤族自治县",
        "沧源佤族自治县",
        "其他",
      ],
      丽江: [
        "古城区",
        "玉龙纳西族自治县",
        "永胜县",
        "华坪县",
        "宁蒗彝族自治县",
        "其他",
      ],
      保山: ["隆阳区", "施甸县", "腾冲县", "龙陵县", "昌宁县", "其他"],
      大理: [
        "大理市",
        "漾濞彝族自治县",
        "祥云县",
        "宾川县",
        "弥渡县",
        "南涧彝族自治县",
        "巍山彝族回族自治县",
        "永平县",
        "云龙县",
        "洱源县",
        "剑川县",
        "鹤庆县",
        "其他",
      ],
      德宏: ["瑞丽市", "潞西市", "梁河县", "盈江县", "陇川县", "其他"],
      怒江: [
        "泸水县",
        "福贡县",
        "贡山独龙族怒族自治县",
        "兰坪白族普米族自治县",
        "其他",
      ],
      文山: [
        "文山县",
        "砚山县",
        "西畴县",
        "麻栗坡县",
        "马关县",
        "丘北县",
        "广南县",
        "富宁县",
        "其他",
      ],
      昆明: [
        "五华区",
        "盘龙区",
        "官渡区",
        "西山区",
        "东川区",
        "呈贡县",
        "晋宁县",
        "富民县",
        "宜良县",
        "石林彝族自治县",
        "嵩明县",
        "禄劝彝族苗族自治县",
        "寻甸回族彝族自治县",
        "安宁市",
        "其他",
      ],
      昭通: [
        "昭阳区",
        "鲁甸县",
        "巧家县",
        "盐津县",
        "大关县",
        "永善县",
        "绥江县",
        "镇雄县",
        "彝良县",
        "威信县",
        "水富县",
        "其他",
      ],
      普洱: [
        "思茅区",
        "宁洱镇",
        "墨江哈尼族自治县",
        "景东彝族自治县",
        "景谷傣族彝族自治县",
        "镇沅彝族哈尼族拉祜族自治县",
        "江城哈尼族彝族自治县",
        "孟连傣族拉祜族佤族自治县",
        "澜沧拉祜族自治县",
        "西盟佤族自治县",
        "其他",
      ],
      曲靖: [
        "麒麟区",
        "马龙县",
        "陆良县",
        "师宗县",
        "罗平县",
        "富源县",
        "会泽县",
        "沾益县",
        "宣威市",
        "其他",
      ],
      楚雄: [
        "楚雄市",
        "双柏县",
        "牟定县",
        "南华县",
        "姚安县",
        "大姚县",
        "永仁县",
        "元谋县",
        "武定县",
        "禄丰县",
        "其他",
      ],
      玉溪: [
        "红塔区",
        "江川县",
        "澄江县",
        "通海县",
        "华宁县",
        "易门县",
        "峨山彝族自治县",
        "新平彝族傣族自治县",
        "元江哈尼族彝族傣族自治县",
        "其他",
      ],
      红河: [
        "个旧市",
        "开远市",
        "蒙自县",
        "屏边苗族自治县",
        "建水县",
        "石屏县",
        "弥勒县",
        "泸西县",
        "元阳县",
        "红河县",
        "金平苗族瑶族傣族自治县",
        "绿春县",
        "河口瑶族自治县",
        "其他",
      ],
      西双版纳: ["景洪市", "勐海县", "勐腊县", "其他"],
      迪庆: ["香格里拉县", "德钦县", "维西傈僳族自治县", "其他"],
    },
  },
  //处理上面的数据
  formatCityData: (cityData) => {
    var result = [];
    for (let i in cityData) {
      var item = { name: i, value: i, children: [] }; //省，直辖市
      var value = cityData[i];
      for (let j in value) {
        if (j == i) {
          for (let one of value[j]) {
            //处理直辖市
            item.children.push({ name: one, label: one });
          }
        } else {
          var city = { name: j, label: j, children: [] };
          for (let county of value[j]) {
            city.children.push({ name: county, label: county });
          }
          item.children.push(city);
        }
      }
      result.push(item);
    }
    console.log(JSON.stringify(result));
  },
};

util.getDayAll = function(begin, end) {
  var dateAllArr = new Array();
  var ab = begin.split("-");
  var ae = end.split("-");
  var db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  var de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  var unixDb = db.getTime();
  var unixDe = de.getTime();
  for (var k = unixDb; k <= unixDe; ) {
    dateAllArr.push(util.getFormatOnlyDate(k));
    k = k + 24 * 60 * 60 * 1000;
  }
  return dateAllArr;
};
util.confirmDialog = function(self, title, content, cb) {
  self.$Modal.confirm({
    title: title,
    content: content,
    onOk: () => {
      cb(self);
      //this.$Message.info('Clicked ok');
    },
    onCancel: () => {
      //this.$Message.info('Clicked cancel');
    },
  });
};
util.showToast = function(self, type, content) {
  self.$Message[type](content);
};
util.getFormatOnlyDate = function(time) {
  var date = new Date(time);
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate =
    date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
};
/*
   格式化时间
 */

util.getFormatDate = function(time) {
  var date = new Date(time);
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minute >= 0 && minute <= 9) {
    minute = "0" + minute;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    " " +
    hour +
    seperator2 +
    minute +
    seperator2 +
    seconds;
  return currentdate;
};
util.title = function(title) {
  title = title || "iView admin";
  window.document.title = title;
};

util.isEmptyObject = (o = {}) => {
  let flag = true;
  for (const k in o) {
    if (k) {
      flag = false;
      break;
    }
  }
  return flag;
};

util.inOf = function(arr, targetArr) {
  let res = true;
  arr.forEach((item) => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};
util.convertObj = (obj) => {
  if (obj) {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return "";
  }
};

util.oneOf = function(ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.showThisRoute = function(itAccess, currentAccess) {
  if (typeof itAccess === "object" && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

util.getRouterObjByName = function(routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  // debugger;
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function(vm, item) {
  if (typeof item.title === "object") {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function(vm, name) {
  let title = "";
  let isOtherRouter = false;

  vm.$store.state.app.routers.forEach((item) => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === "otherRouter") {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach((child) => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === "otherRouter") {
            isOtherRouter = true;
          }
        }
      });
    }
  });

  var currentPathArr =
    name == "home"
      ? []
      : [
          {
            title: "首页",
            path: "/home",
            name: "home",
          },
        ];
  // var  currentPathArr=[];
  var currentPathObj = judge(vm.$store.state.app.routers, name);
  for (var i in currentPathObj) {
    var item = currentPathObj[i];
    currentPathArr.push({
      title: item.title,
      path: item.path,
      name: item.name,
    });
  }

  vm.$store.commit("setCurrentPath", currentPathArr);

  function judge(data, name, y) {
    console.log(data, name);
    var res = [];
    for (var item of data) {
      if (item.name == name) {
        res.push(item);
        return res;
      } else if (item.children) {
        for (let one of item.children) {
          if (one.name == name) {
            res.push(item);
            res.push(one);
            return res;
          } else if (one.children) {
            for (let child of one.children) {
              if (child.name == name) {
                res.push(item);
                res.push(one);
                res.push(child);
                return res;
              }
            }
          }
        }
      }
    }
  }

  return currentPathArr;
};

util.getAgeByValue = function(val) {
  var b = val.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  let today = new Date();
  if (b == null) {
    return null;
  } else {
    var month = b[3] * 1;
    var day = b[4] * 1;
    var nowY = today.getFullYear();
    var age = nowY - b[1];
    if (today.getMonth() + 1 < month) {
      age--;
    } else if (today.getMonth() + 1 == month && today.getDate() < day) {
      age--;
    }
    if (age < 1) {
      // var dayNum = this.getDateDiff(value, nowY + '-' + (today.getMonth() + 1) + '-' + today.getDate())
      // // if (dayNum <= 27) {
      // //   age--
      // // }
      // age = dayNum + 'D'
      age = 0;
    }
    return age;
  }
};
util.getOccupationData = function(data) {
  let arr = [];
  data.map((item) => {
    let obj = {
      label: item.name,
      value: item.code,
      children: item.subs,
    };
    if (item.subs) {
      obj.children = util.getOccupationData(item.subs);
    }
    arr.push(obj);
  });
  return arr;
};
util.getNowFormatDate = function(sdate,interval,caret) {
  interval = isNaN(parseInt(interval)) ? 0 : parseInt(interval);//若没有输入间隔，则使用当前日
  caret = (caret && typeof(caret) == "string") ? caret : "";
    var gdate = new Date(sdate).getTime();//获取指定年月日
    gdate = gdate + 1000*60*60*24*interval; //加减相差毫秒数
    var speDate = new Date(gdate);//获取指定好毫秒数时间
    var preYear = speDate.getFullYear();
    var preMonth = speDate.getMonth() + 1;
    var preDay = speDate.getDate();
    preMonth = (preMonth < 10) ? ("0" + preMonth) :preMonth;
    preDay = (preDay < 10) ? ("0" + preDay) :preDay;
    var preDate =  preYear + caret +  preMonth + caret + preDay;
    return preDate;
};

util.getAddDate = function(date, num) {
  var d = new Date(date);
  d.setDate(d.getDate() + num);
  var m = d.getMonth() + 1;
  // return d.getFullYear()+'-'+m+'-'+d.getDate();
  return util.getFormatOnlyDate(d);
};

let loadTimes = 0;
util.showLoading = () => {
  loadTimes++;
  if (loadTimes === 1) {
    Spin.show({
      render: (h) => {
        return h("div", [
          h("Icon", {
            class: "demo-spin-icon-load",
            props: {
              type: "ios-loading",
              size: 18,
            },
          }),
          h("div", "Loading"),
        ]);
      },
    });
  }
};

util.hideLoading = () => {
  //loadTimes为0时不进行任何操作
  if (loadTimes > 0) {
    loadTimes--;
    if (loadTimes === 0) {
      Spin.hide();
    }
  }
};

util.setSessionStorage = function(key, value) {
  var str = "";
  //增加对内容为空的判断，为空不进行序列化
  if (value) {
    str = JSON.stringify(value);
  }
  sessionStorage.setItem(key, str);
};

util.getSessionStorage = function(key) {
  var sessionObj = sessionStorage.getItem(key);
  try {
    sessionObj = JSON.parse(sessionObj);
  } catch (e) {}
  return sessionObj;
};

util.NoToChinese = function(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert("Number is wrong!");
    return "Number is wrong!";
  }
  var AA = new Array(
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九"
  );
  var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
  var a = ("" + num).replace(/(^0*)/g, "").split("."),
    k = 0,
    re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
          re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
      re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }
  return re;
};
export default util;
