import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index';
import store from '../store/index.js'
import './zhugeCommon'
import api from './api/index'
import iView from 'iview';
import View from 'view-design';
import 'view-design/dist/styles/iview.css'
// import 'iview/dist/styles/iview.css';
import util from './lib/util.js';
import myComponents from './components/index.js'
import './my-theme/index.less'
import "../src/style/main.less";
import './directive/index'
import i18n from './locale'
// import echarts from 'echarts';
import myApi from './api/apibytls.js';
import treeSelect from './components/treeSelect/treeSelect'
import rankTrack from './components/rankTrack/rankTrack'
import modalLog from './views/modal/auditLog'
import modalAudit from './views/modal/auditModal'
import inputModal from './components/InputModal/inputModal'
import stopForm from './views/sys/form/companyListForm'
import 'babel-polyfill'
import components from './components/vant/index.js'
import Vconsole from 'vconsole';
Vue.prototype.$api = api;
Vue.prototype.$util = util;
// Vue.prototype.$echarts = echarts;
Vue.prototype.$apiTls = myApi;
Vue.use(myComponents);
Vue.config.productionTip = false
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(View, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(components)
// 注册一个全局自定义指令 v-focus
//此处是全局注册UI框架的工具方法（弹窗）
for (let name in components.other) {
  Vue.prototype[`$${name}`] = components.other[name]
}
if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
  if (process.env.VUE_APP_CONSOLE_ENV === 'uat') {
    new Vconsole()
  }
  setRem()
}

function setRem() {
  /* fix the code flash the page  */
  var globalWidth = window.innerWidth;
  var radixNO = 100 / 750 * globalWidth;
  document.documentElement.style.fontSize = radixNO + 'px';
  /* fit document fit the screen, get the radix */
  (function (doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
      };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);
}

//注册treeSelect组件
Vue.component('TreeSelect', treeSelect);
Vue.component('ModalLog', modalLog);
Vue.component('ModalAudit', modalAudit);
Vue.component('InputModal', inputModal);
Vue.component('RankTrack', rankTrack);
Vue.component('StopForm', stopForm);
Vue.prototype.$Fdate = function (UTCDateString, type) {
  if (!UTCDateString) {
    return '';
  }

  function formatFunc(str) {    //格式化显示
    return str > 9 ? str : '0' + str
  }

  var date2 = new Date(UTCDateString);     //这步是关键
  var year = date2.getFullYear();
  var mon = formatFunc(date2.getMonth() + 1);
  var day = formatFunc(date2.getDate());
  var hour = date2.getHours();
  var noon = hour >= 12 ? 'PM' : 'AM';
  // hour = hour>=12?hour-12:hour;
  hour = formatFunc(hour);
  var min = formatFunc(date2.getMinutes());
  var sec = formatFunc(date2.getSeconds());
  var dateStr
  if (type == 'sec') {
    dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  } else if (type == 'min') {
    dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;
  } else if (type == 'month') {
    dateStr = year + '-' + mon;
  } else {
    dateStr = year + '-' + mon + '-' + day;
  }

  return dateStr;
};
//下载文件  需要传递 name  文件名称   fileType 文件的类型   get 的url
// method: "GET",
//     url: this.$api.exportFileCompany,
//     fileName: "",
//     param: [],
//     name:"公司机构信息表",
//     fileType:'xlsx'
// 全局获取缓存数据
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'watchStorage') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
},
  Vue.prototype.exportFile = function (options) {
    let obj = options.data
    function params(obj) {
      let result = '';
      let item;
      for (item in obj) {
        if (obj[item] && String(obj[item])) {
          result += `&${item}=${obj[item]}`;
        }
      }
      if (result) {
        result = '?' + result.slice(1);
      }
      return result;
    }
    let xhr = new XMLHttpRequest();
    let a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
    a.download = options.fileName;
    xhr.open('get', `${options.url}${params(obj)}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // 设置请求头，必须在open后添加
    xhr.setRequestHeader('sid', sessionStorage.getItem('sid'));
    xhr.setRequestHeader('menu', sessionStorage.getItem('menu'));
    xhr.responseType = 'blob'; // 返回类型blob  blob 存储着大量的二进制数据
    xhr.onload = function (res) {
      if (this.status === 200) {
        let blob = new Blob([this.response]); // 转成文本存储
        let disposition, fileName;
        disposition = xhr.getResponseHeader('Content-Disposition');
        console.log(disposition)
        if (disposition) {
          fileName = decodeURI(disposition.split(';')[1]).replace(' filename="', '').replace('.xlsx"', '');
          // fileName = decodeURI(disposition.split(';')[1]).replace('filename=','');
          console.log(fileName)
        }
        // debugger
        let a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        a.download = (fileName ? fileName : options.name) + '.' + options.fileType;
        a.href = window.URL.createObjectURL(blob); // 转成本地连接到blob文本
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        a.dispatchEvent(evt);
      }
    };
    xhr.send();
  }

Vue.prototype.getChild = (code, list, self, call) => {

  if (code == undefined) {
    return false
  }
  self.$api.getChildrenByCode({ code: code }).then(res => {
    if (res.respCode == 0) {
      if (res.data.length >= 1) {
        call(res.data)
      } else {
        self.$Message.error('当前机构暂无下属部门')
        call([])
      }
    } else {
      call([])
      self.$Message.error(res.resultMessage)
    }
  })

},
  //深拷贝
  Vue.prototype.newData = function (data) {
    // var type = typeof data;
    // var obj;
    // if(type === 'array'){
    //     obj = [];
    // } else if(type === 'object'){
    //     obj = {};
    // } else {
    //     //不再具有下一层次
    //     return data;
    // }
    // if(type === 'array'){
    //     for(var i = 0, len = data.length; i < len; i++){
    //         obj.push(this.newData(data[i]));
    //     }
    // } else if(type === 'object'){
    //     for(var key in data){
    //         obj[key] = this.newData(data[key]);
    //     }
    // }
    // return obj;
    let object;
    object = JSON.parse(JSON.stringify(data));
    return object
  };
//打开对应的ivew 的confirmModal  传递title  标题 content 文字内容  row 表格对应的row， i 表格的下标 fun 回调函数调用者自己的方法
// type属于自定义字段   self 用来指向vue
Vue.prototype.confirmModal = function (title, content, row, i, type, fun, self) {
  // if(type==='del'){
  self.$util.confirmDialog(this, title, content, self => {
    // this.delRow(row,i)
    fun(row, i, type)

  });
};
// new Vue({
//   router,
//   store,
//   i18n,
//   render: h => h(App)
// }).$mount('#app')

let context = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
Vue.prototype.$context = context;
Vue.prototype.button = context.$store.state.app.button;


