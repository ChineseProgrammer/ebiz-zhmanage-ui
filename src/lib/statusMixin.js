export default {
  data() {
    return {
      // 0 未生成试卷，1.已生成试卷，2.未开始，3进行中，4.已完成， 5.已撤回
      status: [
        {
          key: '-1',
          name: '未开始'
        },
        {
          key: '0',
          name: '未开始',
        },
        {
          key: '1',
          name: '未开始'
        },
        {
          key: '2',
          name: '未开始'
        },
        {
          key: '3',
          name: '进行中'
        },
        {
          key: '4',
          name: '已结束'
        },
        {
          key: '5',
          name: '已撤回'
        }
      ],
      // 0未开始,1进行中,2 已结束,3没参加
      peopleStatus: [
        {
          key: '0',
          name: '未开始'
        },
        {
          key: '1',
          name: '进行中',
        },
        {
          key: '2',
          name: '已结束',
        },
        {
          key: '3',
          name: '未参加',
        },
      ],
    }
  }
}