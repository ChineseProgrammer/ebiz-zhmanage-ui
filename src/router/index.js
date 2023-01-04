import Vue from 'vue';
import {
    Modal,
    LoadingBar
} from 'view-design';
import VueRouter from 'vue-router';
import {
    routers
} from './routers';
import store from '../../store/index'
import api from '../api/index'
import { Message } from 'iview';
import 'view-design/dist/styles/iview.css'
import whiteList from '../lib/whiteList';

Vue.component('Message', Message);
Vue.use(VueRouter);

// 路由配置(默认是哈希路由，可切换)
const RouterConfig = {
    mode: 'history',
    routes: routers
};
/**
 * @description: 解决路由重复
 * @Date: 2020-08-12 16:07:47
 * @Author: 周靖松
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export const router = new VueRouter(RouterConfig);
//拦截

router.beforeEach((to, from, next) => {
    if(to.meta.title=="考试人员列表"){
        to.meta.cardTitle = to.query.title+to.meta.title;
    }
    else if (to.meta.title == "保险咨询") {
        document.title = to.meta.title;
    } else {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        } else {
            document.title = "综合管理系统";
        }
    }
    //处理退出（加确认框和清除缓存）
    if (to.name == 'quitLogon') {
        var self = api;
        Modal.confirm({
            title: '退出登录',
            content: '您确认退出登录',
            onOk: () => {
                self.loginOut({
                    sid: sessionStorage.getItem('sid')
                }).then(res => {
                    if (res.respCode == 0) {
                        sessionStorage.setItem("sid", '');
                        sessionStorage.removeItem("systemType")
                        router.push({
                            path: '/login',
                        });
                    } else {
                        // alert(res.message);
                        Message.error(res.message)
                    }
                })

            },
            //不加 会出现左侧菜单上的退出依然被选中
            onCancel: () => {
                router.push({
                    path: from.name,
                });
            }
        });
    }

    LoadingBar.start();
    // next();

    let thisAuto = store.state.thisAuto;
    let menuList = store.state.menuList;
    // const whiteList = ['login', 'home', 'custom', 'appointment', 'submit', 'customerAssignment', 'homeCusttomer', 'customerAllot', 'mobileLogin', 'questionareHome', 'questionareResult', 'questionareQuestions', 'wxLogin'];
    if (window.sessionStorage.getItem("username") == "adminCenter" || whiteList.includes(to.name)) {
        next();
    } else {
        if (thisAuto && thisAuto.length != 0) {
            if (menuList && menuList.length != 0) {
                let isMenu = deepQuery(menuList, to.name);
                if (isMenu) {
                    next()
                } else {
                    Message.error({
                        content: "无权限访问",
                        duration: 5
                    });
                    next('/home');

                }
            }
        }
    }
});

function deepQuery(tree, name) {
    var isGet = false;
    var retNode = null;

    function deepSearch(tree, name) {
        for (var i = 0; i < tree.length; i++) {
            if (tree[i].children && tree[i].children.length > 0) {
                deepSearch(tree[i].children, name)
            }
            if (name === tree[i].name || isGet) {
                isGet || (retNode = tree[i]);
                isGet = true;
                break;
            }
        }
    }
    deepSearch(tree, name);
    return retNode;
}

router.afterEach((to) => {
    var cardTitle = false;
    var cardExtra = false;

    if (to.meta) {
        cardTitle = to.meta.cardTitle ? to.meta.cardTitle : false;
        cardExtra = to.meta.cardExtra ? to.meta.cardExtra : false;

    }
    //页面title
    store.commit('setCardTitle', cardTitle);
    //title右侧操作按钮
    store.commit('setCardExtra', cardExtra);
    LoadingBar.finish();
    window.scrollTo(0, 0);
});
