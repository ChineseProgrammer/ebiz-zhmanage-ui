// 用户长时间未操作 退出登录
/* import store from '@/store'
import router from '@/router' */
import {
  router
} from "../router";
var timer = null
import {
  Modal
} from 'view-design'
import whiteList from '../lib/whiteList'
clearInterval(timer)

export function isOperateFun() {
  var lastTime = new Date().getTime() // 最后一次点击时间
  var currentTime = new Date().getTime() // 当前时间
  var timeOut = 1800 * 1000 // 允许最长未操作时间 30分钟
  var i = 1 // 辅助作用

  function handleReset() { // 重新赋值最后一次点击时间，清除定时器，重新开始定时器
    // console.log('又点击了！！！！！！')
    i = 1

    lastTime = new Date().getTime()

    if (timer) {
      clearInterval(timer)
      timer = null
    }

    if (!timer) {
      // console.log('真好！重新开始')
      handleInterval()
    }
  }

  document.onclick = () => { // 单击事件
    handleReset()
  }

  document.ondblclick = () => { // 双击事件
    handleReset()
  }

  document.onmousedown = () => { // 按下鼠标键时触发
    handleReset()
  }

  document.onmouseup = () => { // 释放按下的鼠标键时触发
    handleReset()
  }

  document.onmousemove = () => { // 鼠标移动事件
    handleReset()
  }

  document.onmouseover = () => { // 移入事件
    handleReset()
  }

  document.onmouseout = () => { // 移出事件
    handleReset()
  }

  document.onmouseenter = () => { // 移入事件
    handleReset()
  }

  document.onmouseleave = () => { // 移出事件
    handleReset()
  }
  function handleInterval() { // 定时器
    timer = setInterval(() => {
      currentTime = new Date().getTime() // 当前时间

      /*  console.log(`${i++}-currentTime`, currentTime)
       console.log('最后一次点击时间', lastTime) */
       if(!whiteList.includes(router.currentRoute.name)){
      // if (!((router.currentRoute.name == 'login') || (router.currentRoute.name == 'home') || (router.currentRoute.name == 'custom') || (router.currentRoute.name == 'appointment') || (router.currentRoute.name == 'submit') || (router.currentRoute.name == 'customerAssignment') || (router.currentRoute.name == 'homeCusttomer') || (router.currentRoute.name == 'customerAllot'))) {
        if (currentTime - lastTime > timeOut) {
          /*   console.log('长时间未操作') */

          clearInterval(timer) // 清除定时器
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
        }
      }
    }, 1000)
  }

  handleInterval() // 一开始程序 默认执行定制器
}