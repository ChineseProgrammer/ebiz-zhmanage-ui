<template>
  <div id="business-list" class="only-content">
    <!-- 顶部筛选 -->
    <div>
      <Form ref="searchBusiness" :rules="rules" :model="searchBusiness" inline :label-width="100">
        <FormItem prop='title' label="导入标题">
          <Input v-model.trim="searchBusiness.title" placeholder="请输入" style="width:160px" />
        </FormItem>
        <FormItem label="导入时间" prop="importTime">
          <DatePicker type="date" placeholder="请选择" v-model="timesDate" @on-change="onDatePickerChange" ></DatePicker>
        </FormItem> 
            <span style="margin-left:100px;">
              <Button @click="changeFormSearch" type="primary">查询</Button>
              <Button @click="reset()">重置</Button>
            </span>
      </Form>
    </div>
   <div>
    <!-- <Button v-if="isAdminCenter || button.importInfo" type="primary" style="margin-bottom: 10px">导入</Button> -->
    <Button @click="modal1 = true" type="primary" style="margin-bottom: 10px">导入</Button>
   </div>
    <!-- 列表 -->
    <div style="margin-top:15px">
      <primaryTable
        :columns="columns"
        :data="tableData"
        :current.sync="paginationPolicy.page"
        ref="teamTable"
        :total="paginationPolicy.total"
        :pageSize="paginationPolicy.pageSize"
        @on-page-size-change="changeSize"
        @on-change="changePage"
      ></primaryTable>
    </div>
    <Modal
      v-model="modal1"
      title="导入EXCEL"
      :width="700"
      :loading="true"
     >
      <UploadExcel ref="modal" @closeDialog="closeDialog"></UploadExcel>
      <div slot="footer">
        <Button  type="primary" @click="cancel">取消</Button>
      </div>

    </Modal>
     

  </div>
</template>
<script>
// import { dateTransfer} from "@/api/sm4";
import primaryTable from '@/components/table/primaryTable.vue'; //此组件为全局组件 测试开发用
import UploadExcel from './components/uploadExcel.vue'; //组件上传excel
//import { getTableList } from "@/api/data";  //mock.js 定义的接口
export default {
  data(){
    return{
      modal1:false,
      actionPerson:"",
      timesDate: null,
      rules:{},
      tableData:[],
      isAdminCenter: false,
      button: this.$store.state.app.button,
      personHeaders: { sid: window.sessionStorage.getItem("sid") },
      searchBusiness:{
        searchTime:null,
        title: null
      },
      // 分页数据--队伍查询
      paginationPolicy: {
        page: 1,
        pageSize: 10,
        total:100,
      },
      queryPageSize:10,//分页条数 无用
      userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
      columns: [
        {
          type: 'index',
          width: 80,
          align: 'center',
          title:'序号'
        },
         {
            title: '标题',
            key: 'title',
            align: 'center',
        },
        {
            title: '导入人',
            key: 'importUser',
            align: 'center',
        },
        {
            title: '导入条数',
            key: 'count',
            align: 'center',
        },
        {
            title: '导入时间',
            key: 'importTime',
            align: 'center',
        },
        {
            title: '操作',
            slot: 'action',
            width: 350,
            align: 'center',
            render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.getStatisticsData(params);
                    },
                  },
                },
                "数据统计"
              ),
               h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.getImportData(params);
                    },
                  },
                },
                "查看数据"
              )
            ]);
          }
        }
    ],
    }
  },
  //引入的组件 原项目挂在在全局了 放在原项目可以注掉primaryTable
  components:{
    primaryTable,
    UploadExcel
  },
   created: function() {
    //这个地方想判断是否是同一个人？ 
    this.isAdminCenter = (window.sessionStorage.getItem("username") == "adminCenter")
      if (!this.button.importInfo) {
        if (!this.isAdminCenter) {
          this.columns.pop();
        }
      }
    this.fetchData(); //查询列表   
  },
  /**
   * primaryTable详解
   * @columns 表头
   * @tableData 表格内容
   * @current 分页数
   * @total 总条数
   * @pageSize 分页条数
   * @on-page-size-change 切换分页的回调函数
   * @on-change 页码改变的回调函数
   */
  mounted: function() {
    
  },
  methods:{
    cancel(){
      this.$refs.modal.initUpload()
      this.modal1  =false
    },
    closeDialog(val){
      console.log(val)
      this.modal1 = val
    },
    //分页展示条数
    changeSize(size) {
      this.paginationPolicy.pageSize = size;
      this._getTableList();
    },
    //切换分页
    changePage(page) {
      this.paginationPolicy.page = page;
      this._getTableList();
    },
    //mock模拟表格数据
    _getTableList(){
      //params 为数据的查询条件 分页 导入标题 导入时间
      let params = {
        ...this.paginationPolicy,
        ...this.searchBusiness
      }
       this.fetchData(this.paginationPolicy.pagepage, this.paginationPolicy.pageSize);
    },
    // 获取分析详情
    getStatisticsData(val){
      this.$router.push({
        name: "statisticalData",
        params: { id: val.row.id },
      });
    },
    // 查看导入数据
    getImportData(val){
      this.$router.push({
        name: "viewData",
        params: { id: val.row.id },
      });
    },
    //重置
    reset() {
      this.searchBusiness.importTime = null
      this.searchBusiness.title = null
      this.fetchData(); 
    },
    //客户查询
    changeFormSearch() {
      //每次查询都从第一页开始查
      this.paginationPolicy.page = 1; //如果分页从0开始 可以填0
      this.fetchData();
    },
    // dateStartChange(date) {
    //   this.searchTeamView.beginDate = date;
    // },
    /**
     * @description: 分页伪装饰器,校验组件库本身事件
     * @Date: 2020-08-13 10:58:47
     * @Author: 周靖松
     */
    beForeFetchData(queryPage = 1, queryPageSize = 10){
        this.queryPageSize = queryPageSize
        let {teamTotal ,page} = this.paginationPolicy
        if((page - 1) * queryPageSize > teamTotal){
          this.$nextTick(()=>{
            this.fetchData(queryPage,queryPageSize)
          })
        }else{
            this.fetchData(queryPage,queryPageSize)
        }
    },
      //获取客户信息列表
    fetchData(page = 1, pageSize = 10) {
      //入参对象
      const reqData = {
        ...this.searchBusiness,
        page,
        pageSize:this.queryPageSize,
      };
      //调用接口
      // loading
      this.$util.showLoading();
      this.$api.liveBroadcastStatisticsList(reqData).then((res) => {
        // loading关闭
        this.$util.hideLoading();
        // 成功判断
        if (res.result === "0") {
          //表格数据
          this.tableData = res.content.list
          //分页数据
          this.paginationPolicy.total = res.content.total;
        } else {
          this.$Message.error(
            res.resultMessage ? res.resultMessage : res.message
          );
        }
      });
    },
    timeChange(time) {
      
    },
    //跳转统计页面 1统计 2查看
    viewBtn(value){
      let keysword = value == 1 ? 'statisticalData': 'viewData' 
      this.$router.push({
        name:keysword
      })
    },
    //导入
    handlePersonSuccess(res, file, fileList) {
    
    },
    // 日历控件时间发生改变
    onDatePickerChange(){
      //console.log("===sdfsdfjslkdfjsklj");
     let times = new Date(this.timesDate).getTime();
     this.searchBusiness.importTime = times
     console.log("===sdfsdfjslkdfjsklj",times);
    },
    beforePersonUpload(res) {
      // this.$util.showLoading();
    },
    handlePersonError(res, file) {
      this.$util.hideLoading();
      this.$Notice.warning({
        title: "上传文件",
        desc: "支持Excel格式"
      });
    },
  }         
  }
</script>

<style lang="less" scoped>
#business-list {
   /deep/ .ivu-table-cell-tooltip-content {
    margin-top: 10px;
  }
  /deep/ .ivu-radio-group {
    height: 32px;
  }
  .ivu-form-item{
    margin-right: 0;
    //margin-bottom: 30px ;
    .ivu-form-item-label{
      padding-right: 5px;
    }
    // width: 255px;
  }
}
</style>