<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
         <FormItem :label="$context.$t('menus.parentMenus')" prop="parentId">
         <!-- <Poptip title="菜单"  placement="bottom">


              <Input v-model="parentMenuName" placeholder="选择父级菜单"></Input>
              <template  slot="content">
                  <div>
                       <Tree :data="menuList" @on-select-change='chooseMenu'></Tree>
                  </div>
              </template>
        </Poptip> -->
          <treeSelect :treeData='menuData'
                      :modelData.sync='parentId'>
         </treeSelect>
        </FormItem>
        <FormItem :label="$context.$t('menus.number')" prop="menuNo">
            <Input    v-model="formValidate.menuNo" :placeholder="$context.$t('pleaseEnter')" :maxlength="50"/>
        </FormItem>
        <FormItem :label="$context.$t('menus.name')" prop="menuName">
            <Input v-model="formValidate.menuName" :placeholder="$context.$t('pleaseEnter')" :maxlength="50"/>
        </FormItem>
          <FormItem :label="$context.$t('menus.address')" prop="url">
            <Input v-model="formValidate.url" :placeholder="$context.$t('pleaseEnter')" :maxlength="200"/>
        </FormItem>
          <FormItem :label="$context.$t('menus.interfaceUrl')" prop="interfaceUrl">
            <Input v-model="formValidate.interfaceUrl" :placeholder="$context.$t('pleaseEnter')" :maxlength="200"/>
        </FormItem>
         <FormItem :label="$context.$t('menus.icon')" prop="img">
            <Input v-model="formValidate.img" :placeholder="$context.$t('pleaseEnter')" :maxlength="100"/>
        </FormItem>
         <FormItem :label="$context.$t('menus.hide')" prop="otherInfo1">
               <i-switch v-model='formValidate.otherInfo1' true-value='1'  false-value='0'>
                 <span slot="open" >{{$context.$t('yes')}}</span>
                 <span slot="close">{{$context.$t('no')}}</span>
              </i-switch>
         </FormItem>
          <FormItem :label="$context.$t('type')" prop="type">
           <RadioGroup v-model="formValidate.type">
                <Radio :label="0" >{{$context.$t('menus.menu')}}</Radio>
                <Radio :label="1">{{$context.$t('menus.button')}}</Radio>
            </RadioGroup>
        </FormItem>
    </Form>
</template>
<script>
    export default {
        props:{
            formValidate:{
                type:Object,
                default:()=>{
                    return {
                        menuName: '',
                        menuNo: '',
                        type: 0,
                        url:'',
                        img:'',
                        otherInfo1:0,
                        parentId:0
                    }
                }
            },
            menuList:{
                type:Array,
                default:()=>{
                    return [

                    ]
                }
            },

        },
        data () {
            return {
                parentId:0,//因为接口需要为顶级时候parentId 为null，
                            //但是组件传空报错,所以在提交时候讲parentId 赋值给formValidate的parentId
                menuData:[
                     {
                         title:'顶级菜单',
                         id:"0",
                         children:this.menuList
                     }
                ],
                ruleValidate: {
                    // parentId: [
                    //       this.$util.rules.required(),
                    // ],
                    menuNo: [
                          this.$util.rules.required(),
                          this.$util.rules.validateNumber()
                    ],
                    menuName: [
                         this.$util.rules.required(),
                    ],

                }
            }
        },
        created:function(){
              this.parentId=this.formValidate.parentId?this.formValidate.parentId:"0";
            console.log(this.parentId)
            console.log(this.menuData)

        },
        mounted(){

        },
        methods: {


             /*
               提交
            */
            handleSubmit () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.saveMenu();

                    } else {

                         this.$emit('error','');
                    }
                })
            },
            /*
               保存
            */
            saveMenu(){
                //根据有无id判断是编辑还是添加

                let method=this.formValidate.id?'updateMenu':'createMenu';
                this.formValidate.systemType=0;
                this.formValidate.parentId=this.parentId!=0?this.parentId:null;
                this.$api[method](this.formValidate).then(res=>{
                     if(res.respCode==0||(res.result)-0==0)
                    {
                        this.$Message.success(this.$context.$t('preservation')+ this.$context.$t('success'));
                        this.$emit('finish','');
                    }
                    else{
                        this.$emit('error','');
                        this.$Message.error(res.message);
                    }
                }).catch(error => {
                      this.$emit('error','');

                })
            },
            handleReset () {
                this.$refs.formValidate.resetFields();
            },



        }
    }
</script>
