import Vue from 'vue'
let scroll = {
    bind: function (el, binding) {
        el.addEventListener('scroll', () => {
            if (el.scrollTop==0) {
                (binding.value)()
            }
        })
    }
}
Vue.directive('scroll', scroll)