/*
 * @Author: 孙美方
 * @Date: 2021-01-12 14:08:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */
 <template>
    <div class="main">
        <transition :name="transitionName">
            <router-view :isHidden="isHidden"></router-view>
        </transition>
    </div>
</template>
<script>

    export default {
        name:'my-router-view',
        props:{
            isHidden:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                transitionName: '',

            }
        },
        
        created(){
        },
        mounted() {

        },
        methods: {
        },
        watch: {
        },

        components: {
     
          }
    }
</script>
<style lang="less" scoped>
    .slide-left-leave-active, .slide-left-enter-active, .slide-right-leave-active, .slide-right-enter-active {
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        transition: all 0.2s ease;
    }
    .slide-left-enter, .slide-right-leave-to {
        transform: translateX(100%);
    }
    .slide-left-enter-to, .slide-left-leave, .slide-right-enter-to, .slide-right-leave {
        transform: translateX(0);
    }
    .slide-left-leave-to, .slide-right-enter {
        transform: translateX(-100%);
    }
</style>