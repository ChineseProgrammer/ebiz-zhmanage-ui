<template>
    <div id="productsetting" class="only-content">
        <iframe id="iframe" height="700" :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                modelId: this.$route.query.modelId,
                url: ""
                //url:this.$api.productSale + "&omssid=" + sessionStorage.getItem("sid")
            };
        },
        created: function () {
            if (this.modelId) {
                this.url = "http://47.92.92.36:50000//modeler.html?modelId=" + this.modelId;
            } else {
                this.url = "http://47.92.92.36:50000/model/create?modelName=esms1";
            }
        },
        mounted: function () {
            let w = document.getElementById("productsetting").offsetWidth
            console.log(w)
            document.getElementById("iframe").style.width = w+'px'
        },
        watch: {},
        methods: {

        }
    };
</script>

<style lang='less'>

</style>
