<template>
    <div class="tree-wrapper">
        <div class="add-root" @click="preappend">+</div>
        <Tree :data="data5" :render="renderContent" class="demo-tree-render"></Tree>
        <Modal
                v-model.trim="modelShow"
                title="内容类型管理"
                :loading="modalLoading"
                :closable="false"
                :width="500"
                :mask-closable="false"
        >
            <Form
                    ref="formData"
                    :model="formData"
                    :rules="ruleValidate"
                    :label-width="130"
            >
                <Row class="user-row">
                    <Col span="24">
                        <FormItem label="类型名称" prop="name">
                            <Input
                                    v-model.trim="formData.name"
                                    placeholder="请输入"
                                    :maxlength="20"
                            />
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="上级目录" prop="upLevel">
                            <treeselect
                                    v-model="formData.upLevel"
                                    :options="orgOptions"
                                    :show-count="true"
                                    placeholder="请选择上级目录"
                                    :load-options="() => {}"
                                    @select="treeChange"
                            />
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="目录级别" prop="levelName">
                            <Input
                                    v-model="levelName"
                                    :disabled="true"
                                    placeholder="请输入"
                                    :maxlength="20"
                            />
                        </FormItem>
                    </Col>
                    <!--          <Col span="24">-->
                    <!--            <FormItem label="编码" prop="code">-->
                    <!--              <Input-->
                    <!--                v-model.trim="formData.code"-->
                    <!--                placeholder="请输入"-->
                    <!--                :maxlength="20"-->
                    <!--              />-->
                    <!--            </FormItem>-->
                    <!--          </Col>-->
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit">确认</Button>
                <Button @click="handleReset">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import GPI from "get-parent";
    import Treeselect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    export default {
        props: { getNewNumber: Number },
        components: {
            Treeselect,
        },
        data() {
            return {
                modelShow: false,
                modalLoading: true,
                formData: {
                    name: "",
                    code: "",
                },
                ruleValidate: {
                    name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
                    code: [{ required: true, message: "请输入编码", trigger: "blur" }],
                },
                name: "",
                parentNameList: [],
                data5: [],
                buttonProps: {
                    type: "default",
                    size: "small",
                },
                activeArray: [],
                // 机构树选项
                orgOptions: [],
            };
        },
        computed: {
            levelName: function () {
                this.$api
                    .channelTypeGetCode({ level: this.formData.level })
                    .then((res) => {
                        this.formData.code = res.data;
                    });
                // 设置默认编码 获取当前等级中数据中编码最大的一个，然后在基础上加1
                if (this.formData.level === 1) {
                    return "零级";
                } else if (this.formData.level === 2) {
                    return "一级";
                } else if (this.formData.level === 3) {
                    return "二级";
                } else if (this.formData.level === 4) {
                    return "三级";
                } else if (this.formData.level === 5) {
                    return "四级";
                } else {
                    return "一级";
                }
            },
        },
        watch: {
            getNewNumber() {
                this.getTree();
            },
        },
        created() {},
        methods: {
            treeChange(e) {
                if (e.parentId === 0) {
                    this.activeArray = this.data5;
                } else {
                    this.activeArray = this.getActiveArray(e);
                }
                this.formData.level = e.level + 1;
                this.formData.pid = e.id;
            },
            getActiveArray(e) {
                let arr = this.getSameLevel(e.level, this.data5)
                let index = arr.findIndex(one => {
                    return one.id === e.id
                })
                if(!arr[index].children){
                    this.$set(arr[index], "children", []);
                }
                return arr[index].children
            },
            getSameLevel(level, array) {
                let arr = [];
                if (array[0] && array[0].level < level) {
                    for (let i = 0; i < array.length; i++) {
                        arr = arr.concat(array[i].children);
                    }
                    return this.getSameLevel(level, arr);
                } else {
                    return array;
                }
            },
            getTree() {
                this.$api.channelTypeTree({}).then((res) => {
                    console.log(res);
                    if (res.data) {
                        res.data.map((one) => {
                            one.level = 1;
                            one.label = one.name;
                            if (one.children) {
                                one.children.map((two) => {
                                    two.level = 2;
                                    two.label = two.name;
                                    if (two.children) {
                                        two.children.map((three) => {
                                            three.level = 3;
                                            three.label = three.name;
                                            if (three.children) {
                                                three.children.map((four) => {
                                                    four.level = 4;
                                                    four.label = four.name;
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        this.data5 = res.data;
                        this.getOrgOptions();
                    } else {
                        this.data5 = [];
                    }
                    GPI.init("obj", this.data5);
                });
            },
            getOrgOptions() {
                let options = JSON.parse(JSON.stringify(this.data5));
                options.map((one) => {
                    if (one.children) {
                        one.children.map((two) => {
                            if (two.children) {
                                two.children.map((three) => {
                                    delete three.children;
                                });
                            }
                        });
                    }
                });
                this.orgOptions = [
                    { id: -1, label: "根目录", level: 0, children: options },
                ];
                this.orgOptions = options;
            },
            renderContent(h, { root, node, data }) {
                let removeH =
                    node && node.children && node.children.length > 0
                        ? ""
                        : h("Button", {
                            props: Object.assign({}, this.buttonProps, {
                                icon: "ios-remove",
                            }),
                            style: {
                                padding: 0,
                                width: "20px",
                                height: "20px",
                            },
                            on: {
                                click: () => {
                                    this.remove(root, node, data);
                                },
                            },
                        });
                let contentH = h("span", [
                    h(
                        "span",
                        {
                            style: {
                                // '-webkit-user-modify': 'read-write-plaintext-only'
                                fontSize: "14px",
                            },
                            on: {
                                click: () => {
                                    this.editThis(root, node, data);
                                },
                            },
                        },
                        data.name
                    ),
                ]);

                if (data.level >= 4) {
                    return h(
                        "span",
                        {
                            style: {
                                display: "inline-block",
                                width: "100%",
                            },
                        },
                        [
                            contentH,
                            h(
                                "span",
                                {
                                    style: {
                                        display: "inline-block",
                                        float: "right",
                                        marginLeft: "32px",
                                    },
                                },
                                [removeH]
                            ),
                        ]
                    );
                } else {
                    return h(
                        "span",
                        {
                            style: {
                                display: "inline-block",
                                width: "100%",
                            },
                        },
                        [
                            contentH,
                            h(
                                "span",
                                {
                                    style: {
                                        display: "inline-block",
                                        float: "right",
                                        marginLeft: "32px",
                                    },
                                },
                                [
                                    h("Button", {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: "ios-add",
                                        }),
                                        style: {
                                            marginLeft: "8px",
                                            padding: 0,
                                            width: "20px",
                                            height: "20px",
                                        },
                                        on: {
                                            click: () => {
                                                this.append(data);
                                            },
                                        },
                                    }),
                                    removeH,
                                ]
                            ),
                        ]
                    );
                }
            },
            append(data) {
                this.modelShow = true;
                this.formData = {
                    name: "",
                    id: 0,
                    level: data.level + 1,
                    pid: data.id,
                    code: "",
                };
                this.formData.upLevel = data.id;
                data.expand = true;
                if (!data.children) {
                    this.$set(data, "children", []);
                }
                this.activeArray = data.children;
                console.log(this.activeArray);
            },
            preappend() {
                this.modelShow = true;
                this.formData = {
                    name: "",
                    id: 0,
                    code: "",
                    level: 1,
                    pid: 0,
                };
                // this.formData.upLevel = ;
                this.activeArray = this.data5;
            },
            editThis(root, node, data) {
                this.modelShow = true;
                this.formData = data;
                this.activeArray = data.getParent();
                this.formData.oldName = data.name;
                if(data.parentId !== 0){
                    this.formData.upLevel = data.parentId
                }
                // delete this.formData.children;
            },
            remove(root, node, data) {
                this.$api.deleteContentType({ id: data.id }).then((res) => {
                    console.log(res);
                    const parentKey = root.find((el) => el === node).parent;
                    if (parentKey) {
                        const parent = root.find((el) => el.nodeKey === parentKey).node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1);
                    } else {
                        const index = this.data5.findIndex((one) => {
                            return one.nodeKey === node.nodeKey;
                        });
                        this.data5.splice(index, 1);
                    }
                    this.data5 = [].concat(this.data5);
                });
            },
            handleSubmit() {
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        // 校验是否重复
                        if (this.activeArray && this.activeArray.length > 0) {
                            let sameName = false;
                            for (let i = 0; i < this.activeArray.length; i++) {
                                let friend = this.activeArray[i];
                                if (
                                    friend.id !== this.formData.id &&
                                    friend.name === this.formData.name
                                ) {
                                    sameName = true;
                                    this.$util.showToast(
                                        this,
                                        "error",
                                        "该类型已存在，请勿重复添加!"
                                    );
                                    break;
                                }
                            }
                            if (!sameName) {
                                this.editName();
                            }
                        } else {
                            this.editName();
                        }
                    } else {
                        this.$emit("error", "");
                    }
                });
            },
            editName() {
                let formData = JSON.parse(JSON.stringify(this.formData));
                delete formData.children;
                if (this.formData.id) {
                    this.$api.updateContentType(formData).then((res) => {
                        this.modelShow = false;
                        this.data5 = [].concat(this.data5);
                        this.getOrgOptions();
                    });
                } else {
                    console.log(formData);
                    this.$api
                        .addContentType(formData)
                        .then((res) => {
                            if (res.message === "失败") {
                                this.$util.showToast(this, "error", "编码重复，请更换！");
                            } else {
                                let one = {
                                    name: res.data.name,
                                    label: res.data.name,
                                    code: res.data.code,
                                    expand: true,
                                    level: res.data.level,
                                    id: res.data.id,
                                    pid: res.data.pid,
                                    parentId: res.data.pid,
                                };
                                this.activeArray.push(one);
                                this.data5 = [].concat(this.data5);
                                this.getOrgOptions();
                                this.modelShow = false;
                                this.$nextTick(() => {
                                    this.$forceUpdate();
                                });
                            }
                        })
                        .catch((err) => {
                            this.$util.showToast(this, "error", err.message);
                            this.modalLoading = false;
                            setTimeout(() => {
                                this.modalLoading = true;
                            }, 0);
                        });
                }
            },
            handleReset() {
                if (this.formData.oldName) {
                    this.formData.name = this.formData.oldName;
                }
                this.modelShow = false;
            },
        },
    };
</script>
<style scoped>
    .tree-wrapper {
        display: flex;
    }

    .add-root {
        border: 1px solid #ccc;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        margin: 8px 20px 0 50px;
        font-size: 20px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
