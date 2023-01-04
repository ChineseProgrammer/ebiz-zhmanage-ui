// import wx from 'weixin-js-sdk'
// import store from '../../../store/index'
import $axios from 'axios'
import baseUrl from '../../api/setBaseUrl'
const wxSdk = () => import('weixin-js-sdk');
$axios.defaults.withCredentials = false
$axios.defaults.baseURL = baseUrl.apiBaseUrl;
export default {
    init(apiList = [], url) {
        return new Promise((resolve, reject) => {
            let appid = process.env.VUE_APP_APPID
            // let userId = JSON.parse(window.sessionStorage.getItem("userId")),
            //     channelMsg = JSON.parse(window.sessionStorage.getItem("wxState"));
            // let SharerId = userId.userid;
            let str = window.location.href.split('#')[0];
            let reqData = {
                url: str
            }
            $axios.get(baseUrl.base + "/api/weChatWork/getConfig/getCorpConfig", {
                params: reqData
            }).then(res => {
                if ("code" in res) {
                    this.$Message.error("服务器调用失败，请重新访问");
                } else if ("respCorp" in res) {
                    wxSdk().then(wx => {
                        setTimeout(() => {
                            wx.config({
                                beta: true,
                                debug: true,
                                appId: appid,
                                timestamp: res.timestamp,
                                nonceStr: res.noncestr,
                                signature: res.respCorp,
                                jsApiList: [
                                    "selectExternalContact",
                                    "onMenuShareAppMessage",
                                    "updateAppMessageShareData",
                                    "updateTimelineShareData",
                                    "onMenuShareTimeline",
                                    'hideMenuItems',
                                    'hideAllNonBaseMenuItem',
                                ]
                            })
                        }, 1000);

                        wx.ready(result => {
                            wx.hideMenuItems({
                                menuList: ["menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:QZone", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:copyUrl", "menuItem:openWithQQBrowser"], // 要隐藏的菜单项，所有menu项见附录3
                            });
                            wx.hideAllNonBaseMenuItem({
                                menuList: ["menuItem:exposeArticle", "menuItem:setFont", "menuItem:dayMode", "menuItem:nightMode", "menuItem:refresh", "menuItem:profile", "menuItem:addContact"], // 要隐藏的菜单项，所有menu项见附录3
                            })
                            wx.updateAppMessageShareData({
                                title: '保险咨询',
                                desc: '',
                                link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=http%3a%2f%2fwww.qixuesong.cn%2f%23%2fcustom&response_type=code&scope=www.qixuesong.cn&state=' + channelMsg + '/userid=' + SharerId + '#wechat_redirect', // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
                                imgUrl: '../../assets/logoImg2.png',
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });
                            wx.updateTimelineShareData({
                                title: '保险咨询',
                                link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx468c4feb3f113431&redirect_uri=http%3a%2f%2fwww.qixuesong.cn%2f%23%2fcustom&response_type=code&scope=www.qixuesong.cn&state=' + channelMsg + '/userid=' + SharerId + '#wechat_redirect', // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
                                imgUrl: '../../assets/logoImg2.png',
                                success: function () {
                                },
                                cancel: function () {
                                }
                            });

                        })
                        wx.error(function (res) {
                            this.$Message.error("服务器调用失败，请重新访问");
                        });
                    })

                } else {
                    reject(res)
                }
            }).catch((error) => {
            })
        });
    }
}