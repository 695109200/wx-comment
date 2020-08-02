let util = {
   dateFormat(fmt, date) {
    let ret;
const opt = {
  "Y+": date.getFullYear().toString(), // 年
  "m+": (date.getMonth() + 1).toString(), // 月
  "d+": date.getDate().toString(), // 日
  "H+": date.getHours().toString(), // 时
  "M+": date.getMinutes().toString(), // 分
  "S+": date.getSeconds().toString(), // 秒
  "s+": date.getMilliseconds().toString() // 毫秒
  // 有其他格式化字符需求可以继续添加，必须转化成字符串
};
for (let k in opt) {
  ret = new RegExp("(" + k + ")").exec(fmt);
  if (ret) {
    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
  };
};
return fmt;
},
  showToast(title, duration) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: duration,
      mask: true
    })
  }
}
Component({
  properties: {
    date: {
      type: null,
      value: new Date()
    },
    CompoentsDay: {
      type: String,
      value: '',
      observer(newVal, oldVal) {
        this.setData({
          _date: newVal
        })
      }
    },
    selected: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.getWeek(this.data._date)
      }
    },
    isOpen: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    calShow: true, // 日历组件是否打开
    dateShow: false, // 日期是否选择
    selectDay: '', // 当前选择日期
    canlender: {
      "weeks": []
    },
    _date: "",
    _dateTmp: "",
    selectDayAll:'',
    selectDayFrist: '',
    selectDayScend: ''
  },
  created(){

  },
  attached(){
    let date = new Date()
    let time = util.dateFormat('YYYY-mm-dd', date)
    this.setData({
      _date: time
    })
    this.backtoday()
  },
  methods: {
    hiddenCal() {
      this.setData({
        calShow: true
      })
      this.backtoday()
    },
    dateSelection() {
      if (this.data.isOpen) {
        return
      }
      let self = this;
      if (self.data.calShow) {
        self.setData({
          calShow: false
        }, () => {
          setTimeout(() => {
            self.setData({
              dateShow: true
            }, () => {
              self.triggerEvent('select', {
                ischeck: !self.data.calShow
              })
            })
          }, 100)
        })
      }
    },
    selectDay(e) {
      let index = e.currentTarget.dataset.index; //每一行从左到右下标
      let week = e.currentTarget.dataset.week; //从上到下哪一行
      let canlender = this.data.canlender;
      let month = canlender.weeks[week][index].month < 10 ? "0" + canlender.weeks[week][index].month : canlender.weeks[week][index].month
      let date = canlender.weeks[week][index].date < 10 ? "0" + canlender.weeks[week][index].date : canlender.weeks[week][index].date
      
      //判断是否是未来的天数
      let dateA = new Date(this.data._date)
      let dateB = new Date(canlender.year + "-" + month + "-" + date)
      if (dateB > dateA) {
        util.showToast('这是未来的日子',1000)
        return false
      }

      this.getWeek(canlender.year + "-" + month + "-" + date);
    },
    packup() {
      let self = this;
      var year
      var years
      if (this.data.isOpen) {
        let year = self.data.canlender.year + "-" + self.data.canlender.month + "-" + self.data.canlender.date
        let _date = self.getDate(year, 0);
        self.getWeek(_date);
        return
      }
      self.setData({
        dateShow: false
      }, () => {
        setTimeout(() => {
          self.setData({
            calShow: true
          }, () => {
            year = self.data.canlender.year + "-" + self.data.canlender.month + "-" + self.data.canlender.date
            let _dates = self.getDate(year, 0);
            this.triggerEvent("get", _dates)
            self.getWeek(_dates);
            self.triggerEvent('select', {
              ischeck: !self.data.calShow
            })
          })
        }, 300)
      })
    },
    // 返回今天
    backtoday() {
      let date = new Date()
      let time = util.dateFormat('YYYY-mm-dd', date)
      this.getWeek(time);
      this.triggerEvent("MonthActive", time)
      if (this.data.calShow){
        this.triggerEvent("get", time)
      }
    },
    //上一天下一天
    dataBefor(e) {
      let num = 0;
      let year
      let types = e.currentTarget.dataset.type;
      if (e.currentTarget.dataset.id === "0") {
        num = -1;
      } else {
        num = 1
      }
      year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
      let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
      if (this.data.calShow) {
        this.triggerEvent("get", _date)
      }
      this.getWeek(_date);
    },
    // 获取日历内容
    getWeek(dateData, type) {
      let dateA = new Date(dateData);
      let dateB = new Date(this.data._date)
      let that = this
      let selected = this.data.selected
      // 判断当前是 安卓还是ios ，更改日期格式
      dateData = dateData.replace(/-/g, "/")
      
      let _date = new Date(dateData);
      let year = _date.getFullYear(); //年
      let month = _date.getMonth() + 1; //月
      let date = _date.getDate(); //日
      let day = _date.getDay(); // 天
      let canlender = [];
      let dates = {
        firstDay: new Date(year, month - 1, 1).getDay(),
        lastMonthDays: [], // 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: new Date(year, month, 0).getDay(),
        weeks: []
      }
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay; i > 0; i--) {
        dates.lastMonthDays.push({
          'date': new Date(year, month, -i).getDate() + '',
          'month': month - 1
        })
      }
      // 循环本月天数添加到数组
      for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
        let have = false;
        for (let j = 0; j < selected.length; j++) {
          let selDate = selected[j].date.split('-');
          if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
            have = true;
          }
        }
        dates.currentMonthDys.push({
          'date': i + "",
          'month': month,
          have
        })
      }
      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < 7 - dates.endDay; i++) {
        dates.nextMonthDays.push({
          'date': i + '',
          'month': month + 1
        })
      }
      canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      for (let i = 0; i < canlender.length; i++) {
        if (i % 7 == 0) {
          dates.weeks[parseInt(i / 7)] = new Array(7);
        }
        dates.weeks[parseInt(i / 7)][i % 7] = canlender[i]
      }
      this.setData({
        'canlender.dateTmp': year + "-" + month + "-" + date
      })
      if (dateB > dateA) {
      }else{
        this.setData({
          _dateTmp: year + "-" + month + "-" + date
        })
      }
      this.setData({
        selectDay: month + "月" + date + "日",
        selectDayAll:year+"-"+ month + "-" + date ,
        "canlender.weeks": dates.weeks,
        'canlender.month': month,
        'canlender.date': date,
        "canlender.day": day,
        'canlender.year': year
      })
      month = month < 10 ? "0" + month : month
      date = date < 10 ? "0" + date : date
      this.setData({
        selectDayAll: year + "-" + month + "-" + date,
      })
      this.triggerEvent('getdate', {
        year,
        month,
        date
      })
    },
    getDate(date, AddDayCount, str = 'day', type) {
      date = date.replace(/-/g, "/")
      let dd = new Date(date)
      switch (str) {
        case 'day':
          dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'month':
          dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'year':
          dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
          break;
      }
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) // 获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
      if (type == 1) {
        this.triggerEvent("MonthActive", y + "-" + m + "-" + d)
      }
      return y + '-' + m + '-' + d
    }
  }
})