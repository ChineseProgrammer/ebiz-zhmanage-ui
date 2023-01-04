//全局注册自定义组件

import primaryTableComponents from './table/primaryTable.vue'
import editTableComponents from './table/editTable.vue'
import treeGrid from './table/treeGrid.vue'
import urlTable from './table/urlTable.vue'
import InputTree from './InputTree.vue'
import treeSelect from './treeSelect/treeSelect'
import normalStep from './step/normalStep.vue'
import orderBasicInfo from './order/orderBasicInfo.vue'
import orderProductInfo from './order/orderProductInfo.vue'
import salePersonInfo from './order/salePersonInfo.vue'
import shippmentInfo from './order/shippmentInfo.vue'
import eCode from './order/eCode.vue'
const myComponent={
    install:function(Vue){
        Vue.component('primaryTable',primaryTableComponents);
        Vue.component('editTable',editTableComponents);
        Vue.component('treeGrid',treeGrid);
        Vue.component('urlTable',urlTable);
        Vue.component('InputTree',InputTree);
        Vue.component('treeSelect',treeSelect);
        Vue.component('normalStep',normalStep);
        Vue.component('orderBasicInfo',orderBasicInfo);
        Vue.component('orderProductInfo',orderProductInfo);
        Vue.component('salePersonInfo',salePersonInfo);
        Vue.component('shippmentInfo',shippmentInfo);
        Vue.component('eCode',eCode);
    }
}
export default myComponent
    
