<template>
  <FullCalendar :options="calendarOptions" class="eventDeal-wrap"/>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

export default {
name: 'DEMO',
components: {
  FullCalendar
},
data () {
  return {
      calendarOptions: {
        // 引入的插件
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        // plugins: [dayGridPlugin],
        // 日历头部按钮位置
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth, timeGridWeek, timeGridDay'
        },
        // 日历头部按钮中文转换
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '天'
        },
        height: '640px',
        initialView: 'dayGridMonth', // 指定默认显示视图dayGridDay日视图dayGridWeek
        locale: 'zh-ch', // 切换语言，当前为中文
        firstDay: '1', // 设置一周中显示的第一天是周几，周日是0，周一是1，以此类推
        weekNumberCalculation: 'ISO', // 与firstDay配套使用
        eventCOlor: '#3d8eec', // 全部日历日程背景色
        timeGridEventMinHeight: '20', // 设置事件的最小高度
        aspectRatio: '1.5', // 设置日历单元格宽高比
        displayEventTime: false, // 是否显示事件时间
        allDaySlot: false, // 周、日视图时，all-day不显示
        eventLimit: true, // 设置月日程，与all-day slot 的最大显示数量，超过的通过弹窗展示
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时制
        },
        events: [], // 日程数组
        // 事件
        editable: true, // 是否可以进行（拖动、缩放）修改
        eventStartEditable: true, // Event日程开始时间可以改变，默认为true，若为false,则表示开始结束时间范围不能拉伸，只能拖拽
        eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认为true,若为false，则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        weekends: true,
        navLinks: true, // 天链接
        selectHelper: false,
        selectEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认为true，允许
        dayMaxEvents: true,
        dateClick: this.handleDateClick, // 日期点击
        eventsSet: this.handleEvents, // 事件点击
        eventClick: this.handleEventClick, // 日程点击信息展示
        eventDrop: this.handleEventDrop, // 日程拖动事件
        eventResize: this.eventResize // 日程缩放事件
      }
  }
},
mounted () {

},
created () {

},
methods: {
  // 日程保存
    saveEvent (val) {
      let eventsArr = this.calendarOptions.events
      try {
        if (eventsArr.length === 0) {
          eventsArr.push(val)
        } else {
          eventsArr.forEach((item, index, eventsArr) => {
            // 若为修改日程
            if (item.eventID === val.eventID) {
              throw new Error(index)
            }
          })
          // 若为新增日程
          eventsArr.push(val)
        }
      } catch (e) {
        // 若为修改日程
        eventsArr.splice(e.message, 1, val)
      }
    },
    // 日程删除
    deleteEvent (val) {
      let eventsArr = this.calendarOptions.events
      try {
        eventsArr.forEach((item, index, eventsArr) => {
          if (item.eventID === val) {
            throw new Error(index)
          }
        })
      } catch (e) {
        // 删除指定日程
        eventsArr.splice(parseInt(e.message), 1)
      }
    },
    // 日程事件点击
    handleEvents (info) {
      console.log('handleEvents.info:', info)
      // this.currentEvents = events
    },
    handleWeekendsToggle () {
      console.log('handleWeekendsToggle')
      this.calendarOptions.weekends = !this.calendarOptions.weekends
    },
    // 日期点击
    handleDateClick (selectInfo) {
      //需要一个弹窗 文本输入框 日期选择控件 输入事件内容 开始时间 结束时间
      if (confirm('您是否要在【' + selectInfo.dateStr + '】添加一个新的事件？')) {
        let params = {
          title : '飞哥结婚',  // 事件内容
          start : selectInfo.dateStr, // 事件开始时间
          end : selectInfo.dateStr,   // 事件结束时间
        }
        this.calendarOptions.events.push(params)
      }
      
    },
    // 日程点击信息展示
    handleEventClick (info) {
      console.log('handleEventClick.info:', info)
      info.el.style.borderColor = 'red'
    },
    // 日程事件触发
    eventClick (info) {
      console.log('eventClick.info:', info)
      info.el.style.borderColor = 'red'
    },
    // 日程拖动事件
    handleEventDrop (info) {
      this.$refs['eventDialogue'].eventFormModel.start = info.event.start
      this.$refs['eventDialogue'].eventFormModel.end = info.event.end
    },
    // 日程缩放事件
    eventResize (info) {
      this.$refs['eventDialogue'].eventFormModel.start = info.event.start
      this.$refs['eventDialogue'].eventFormModel.end = info.event.end
    }
}
}
</script>

<style lang="scss" scoped>
</style>