/*
 * @Author: 于学文
 * @Date: 2019-04-02 11:47:36
 * @Last Modified by: 于学文
 * @Last Modified time: 2019-06-27 21:15:47
 */
/* eslint-disable indent */
// 引入axios
import $axios from 'axios';
// import qs from 'qs';
import baseUrl from './setBaseUrl'
// import {
//   EMSGSIZE
// } from 'constants';
import store from '../../store/index'
import {
  Message
} from 'view-design'
import {
  router
} from "../router";
// import util from '../lib/util.js';
// import logOutMsg from '../views/LogoutMsg'
import {
  Modal
} from 'view-design'
// import Utils from './utils.js'
import { decrypt, encrypt } from "./sm4";
// 跨域
$axios.defaults.withCredentials = false
//设置不同环境的baseUrl
$axios.defaults.baseURL = baseUrl.apiBaseUrl;
// 添加请求拦截器(需要根据不同系统接口返回格式修改)
$axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 塞header
  if (window.sessionStorage.getItem("sid")) {
    config.headers['sid'] = window.sessionStorage.getItem("sid");
  } else {
    // config.headers['sid'] = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyX2luZm8iLCJleHAiOjE2MTMxMjUzNDIsImlhdCI6MTYxMjUyMDU0Miwic2lkIjoiZTk3OTU3OGJjYzg3NGM2ZWIxMzBkN2IyMjliYzgwZjkifQ.Z6-tMeZT46qduQF-E5lMavivGjlH5GN0_1RZrDhZvPRu8zfUbdTXCmvswc-VVFy4nIoADYcGsDF6zkskCEi9UQ";
    // config.headers['sid'] = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyX2luZm8iLCJleHAiOjE2MTQ1NjI4NzMsImlhdCI6MTYxMzk1ODA3Mywic2lkIjoiZTk3OTU3OGJjYzg3NGM2ZWIxMzBkN2IyMjliYzgwZjkifQ.cZyl9pJZ4TdJSAJn36VMAHzDM4xXoeP7us-j7i2UP_TURAlNlhm4B7nLU2qgIw7mtiwxJJ_9gT-rzOeH6Bj1Vg";
  }
  if (window.sessionStorage.getItem("menu")) {
    config.headers['menu'] = window.sessionStorage.getItem("menu");
  }
  //static-resources-type: 0 代表绘画存档  1 代表业务查询 2 代表审核识别 3 队伍查询  图片接口类型responseType=="arraybuffer"
  if ((window.sessionStorage.getItem("menu") == 'businessmanagementDetail') && (config.responseType == "arraybuffer")) {
    config.headers['static-resources-type'] = '1';
  } else if ((window.sessionStorage.getItem("menu") == 'checkManagementDetail') && (config.responseType == "arraybuffer")) {
    config.headers['static-resources-type'] = '2';
  } else if ((window.sessionStorage.getItem("menu") == 'content-file') && (config.responseType == "arraybuffer")) {
    config.headers['static-resources-type'] = '0';
  } else if ((window.sessionStorage.getItem("menu") == 'team-list') && (config.responseType == "arraybuffer")) {
    config.headers['static-resources-type'] = '3';
  }
  let systemType = window.sessionStorage.getItem("systemType") || 0;
  /* post方法加密解密 get请求只是解密 */
  /* 队伍管理 个人查询的新增接口不用加密 */
  var a
  if (config.url) {
    a = config.url.split("/")[(config.url.split("/").length) - 1]
  }
  if ((sessionStorage.getItem("encrypte") == 1) && (config.method == 'post')) {
    if (config.data && (a != 'insertPersonnel') && (a != 'updatePersonnel') && a !== 'import') {
      config.data.systemType = systemType
      config.data = encrypt(JSON.stringify(config.data));
    } else if (config.params) {
      config.params.systemType = systemType
      config.params = encrypt(JSON.stringify(config.params));
    }
  }
  /*  */
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
$axios.interceptors.response.use(
  response => {
    if (typeof response.data == 'string') {
      response.data = JSON.parse(decrypt(response.data));
    }
    /*  let resp = Utils.DecryptData(response.data)
    /*  response.data = JSON.parse(resp) */
    // 扒皮 扒掉状态码
    response = response.data;
    if(response.code==402){
      Modal.error({
        title: "登录失效",
        content: response.message
      });
      if (sessionStorage.getItem("sid") == "timeout") {
        sessionStorage.setItem("sid", '');
      } else {
        sessionStorage.setItem("sid", 'timeout');
      }
      sessionStorage.removeItem("systemType");
      sessionStorage.removeItem("menu");
      router.push({
        path: '/login',
      });
      return
    }
    if (response.code == 0 && response.content) {
      // 以下代码纯属为了剔除外层数据结构
      if (response.content.result) {
        response.content.respCode = response.content.result;
        response.content.message = response.content.resultMessage;
      }
      if (response.content.content) {
        if (response.content.content.list) {
          response.content.content.records = response.content.content.list;
        } else if (typeof (response.content.content) == 'string') { }
        response.content.data = response.content.content;
      }
      return response.content;
    }

    if (response.respCode == 10002) {
      store.commit('setLoginState', new Date().getTime());

    } else {
      return response;
    }
  }, (error) => {
    handleError(error.response)
    // error.response
  })
// 请求方法 get
let get = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  // if (params) {
  //     params.systemType=systemType;
  // } else {
  let cons = '?'
  if (url.indexOf('?') != -1) {
    cons = '&'
  }
  url += cons + "systemType=" + systemType;
  return new Promise((success, error) => {
    $axios.get(url, {
      params: params
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
// 请求方法 post但是拼接参数
let postAndGet = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  let cons = '?'
  if (url.indexOf('?') != -1) {
    cons = '&'
  }
  url += cons + "systemType=" + systemType + "&id=" + params.id + "&sharedDesc=" + params.sharedDesc;
  return new Promise((success, error) => {
    $axios.post(url, {
      params: params
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
// 请求方法 put
let put = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  params.systemType = systemType;
  //  params.Serialize = false;
  return new Promise((success, error) => {
    $axios.put(url, {
      params: params
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
// 请求方法 put
let put2 = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  params.systemType = systemType;
  console.log(params);
  //  params.Serialize = false;
  return new Promise((success, error) => {
    $axios({
      method: "put",
      url: url,
      params: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
let put3 = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  params.systemType = systemType;
  //  params.Serialize = false;
  return new Promise((success, error) => {
    $axios({
      method: "put",
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
// 请求方法 delete
let del = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  params.systemType = systemType;
  //  params.Serialize = false;
  return new Promise((success, error) => {
    $axios.delete(url, {
      params: params
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
        error(err);
      });
  });
};
let postLogin = (url, params) => {
  return new Promise((success, error) => {
    $axios({
      method: "post",
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};
// post
let post = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  if (params && params.data) {
    if (!params.data.systemType) {
      params.data.systemType = systemType;
    }
  } else if (!params) {
    params = {
      systemType: systemType
    }
  } else {
    if (params && !params.systemType) {
      params.systemType = systemType;
    }
  }
  return new Promise((success, error) => {
    $axios({
      method: "post",
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};
let post2 = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  if (params && params.data) {
    if (!params.data.systemType) {
      params.data.systemType = systemType;
    }
  } else if (!params) {
    params = {
      systemType: systemType
    }
  } else {
    if (params && !params.systemType) {
      params.systemType = systemType;
    }
  }
  console.log(params);
  return new Promise((success, error) => {
    $axios({
      method: "post",
      url: url,
      params: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {

        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};
// post
let postImg = (url, params) => {
  let systemType = window.sessionStorage.getItem("systemType");
  if (params && params.data) {
    if (!params.data.systemType) {
      params.data.systemType = systemType;
    }
  } else if (!params) {
    params = {
      systemType: systemType
    }
  } else {
    if (params && !params.systemType) {
      params.systemType = systemType;
    }
  }
  return new Promise((success, error) => {
    $axios({
      method: "post",
      url: url,
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        success(res);
      })
      .catch(err => {
        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};

//对接不同后台此处会有所变更，特别是登出
let handleError = (errRes) => {
  if (!errRes) return
  //登录失效 需要退出
  // if(errRes.data&&(errRes.data.status==-6)){
  //   router.push({
  //     path: '/home',
  //   });
  //   return true;
  // }else
  if (errRes.status == 401) {
    store.commit('setLoginState', new Date().getTime());
    // Vue.$Message.error("登录会话过期，请重新登录");
    Modal.error({
      title: "登录失效",
      content: "登录会话超时，请重新登录"
    });
    if (sessionStorage.getItem("sid") == "timeout") {
      sessionStorage.setItem("sid", '');
    } else {
      sessionStorage.setItem("sid", 'timeout');
    }
    sessionStorage.removeItem("systemType");
    sessionStorage.removeItem("menu");
    router.push({
      path: '/login',
    });
    return true;
  } else if (errRes.status == 500) {
    Message.error(`服务器内部错误：${errRes.data}`);
    return false;

  } else if (errRes.status == 404) {
    Message.error('访问接口路径不存在');
    return false
  }
}
// let download = (url, params, filenames) => {
//   // debugger
//   let filename = "file.xlsx"
//   return post(url, params, {
//     transformRequest: [(params) => {
//       let result = ''
//       Object.keys(params).forEach((key) => {
//         if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
//           result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
//         }
//       })
//       return result
//     }],
//     responseType: 'blob'
//   }).then((r) => {
//     // debugger
//     const content = r
//     const blob = new Blob([content])
//     if ('download' in document.createElement('a')) {
//       const elink = document.createElement('a')
//       elink.download = filename
//       elink.style.display = 'none'
//       elink.href = URL.createObjectURL(blob)
//       document.body.appendChild(elink)
//       elink.click()
//       URL.revokeObjectURL(elink.href)
//       document.body.removeChild(elink)
//     } else {
//       navigator.msSaveBlob(blob, filename)
//     }
//   }).catch((r) => {
//     message.error('下载失败')
//   })
// }

//文件下载请求
let download = (url, params) => {
  return new Promise((success, error) => {
    $axios({
      method: "post",
      url: url,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      data: params,
      responseType: "blob",
    })
      .then((res) => {
        // Blob转为json进行是否成功的判断
        var reader = new FileReader();
        reader.readAsText(res);
        reader.onload = (e) => {
          try {
            // result可以转化成json说明后台报错了
            Message.error(JSON.parse(e.target.result).message);
          } catch (err) {
            // result未转化成json说明返回的为blob，正常进行下载操作
            success(res);
          }
        };
      })
      .catch((err) => {
        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};
let downloadGet = (url, params) => {
  return new Promise((success, error) => {
    $axios({
      method: "get",
      url: url,
      data: params,
      responseType: "blob",
    })
      .then((res) => {
        // Blob转为json进行是否成功的判断
        var reader = new FileReader();
        reader.readAsText(res);
        reader.onload = (e) => {
          try {
            // result可以转化成json说明后台报错了
            Message.error(JSON.parse(e.target.result).message);
          } catch (err) {
            // result未转化成json说明返回的为blob，正常进行下载操作
            success(res);
          }
        };
      })
      .catch((err) => {
        if (!handleError(err.response)) {
          error(err);
        }
      });
  });
};
export {
  post,
  post2,
  get,
  del,
  put,
  put2,
  put3,
  download,
  downloadGet,
  postAndGet,
  postImg,
  postLogin
}