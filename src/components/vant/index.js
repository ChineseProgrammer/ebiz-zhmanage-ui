/*
 * @Author: 孙美方
 * @Date: 2021-01-12 13:08:39
 * @Last Modified by: 孙美方
 * @Last Modified time: 2021-1-13 09:26:54
 */

import { Row, 
    Col,
    Button,
    Toast ,
    Loading,
    Dialog ,
    Cell,
    CellGroup,
    Icon,
    Field,
    Lazyload,
    Form,  
    Cascader,Popup,Picker,Checkbox, CheckboxGroup,RadioGroup, Radio,Empty,List,DatetimePicker
} from 'vant';

import routerView from './routerView'
import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';
const components={
    install:function(Vue){
        Vue.component(Button.name,Button);
        Vue.component(Row.name,Row);
        Vue.component(Col.name,Col);
        Vue.component(Loading.name,Loading);
        Vue.component(Dialog.name,Dialog);
        Vue.component(Cell.name,Cell);
        Vue.component(CellGroup.name,CellGroup);
        Vue.component(Icon.name,Icon);
        Vue.component(Field.name,Field); 
        Vue.component(Form.name,Form); 
        Vue.component(Cascader.name,Cascader); 
        Vue.component(Popup.name,Popup); 
        Vue.component(Picker.name,Picker); 
        Vue.component(Checkbox.name,Checkbox); 
        Vue.component(CheckboxGroup.name,CheckboxGroup); 
        Vue.component(RadioGroup.name,RadioGroup); 
        Vue.component(Radio.name,Radio); 
        Vue.component(Empty.name,Empty); 
        Vue.component(List.name,List); 
        Vue.component(DatetimePicker.name,DatetimePicker); 
        Vue.component(routerView.name,routerView);
        Vue.use(Lazyload);
    },
    other:
         {
             toast:Toast,
             dialog:Dialog,
           
         }
    
}
export default components;