// 参考地址 https://github.com/vuejs/vue-cli/blob/fb97646ee51d4fb9c95a01913377cdadf819b6cf/docs/guide/mode-and-env.md
// https://segmentfault.com/a/1190000015133974
// https://www.cnblogs.com/XHappyness/p/9337229.html
// VUE_APP_API='http://ebiz-fooge.320.io:30028'
// VUE_APP_BASE='http://ebiz-fooge.320.io:37006'
//teamAgent:process.env.VUE_APP_TEAMAGENT
let baseUrl = {
    encrypte_key:process.env.VUE_APP_KEY,
    encrypte_iv:process.env.VUE_APP_IV,
    encrypte:process.env.VUE_APP_ENCRYPTED,
    h5_eruda:process.env.VUE_APP_H5ERUDA,
    h5_verificationCode:process.env.VUE_APP_H5VER,
    base_appkey:process.env.VUE_APP_ZHUGEAPPKEY,
    base_appsrc:process.env.VUE_APP_ZHUGESRC,
    base_h5:process.env.VUE_APP_BASEH5,
    base:process.env.VUE_APP_BASE,
    api :process.env.VUE_APP_API,
    wx :process.env.VUE_APP_WX,
    img :process.env.VUE_APP_IMG,
    oms :process.env.VUE_APP_OMS,
    basiclaw :process.env.VUE_APP_BASICLAW,
    self:process.env.VUE_APP_LiTongSelf,
    selfch:process.env.VUE_APP_ChenHongSelf,
    selfwd:process.env.VUE_APP_WangDuoSelf
}
sessionStorage.setItem("encrypte",baseUrl.encrypte)
sessionStorage.setItem("h5_eruda",baseUrl.h5_eruda)
sessionStorage.setItem("encrypte_key",baseUrl.encrypte_key)
sessionStorage.setItem("encrypte_iv",baseUrl.encrypte_iv)
export default baseUrl;