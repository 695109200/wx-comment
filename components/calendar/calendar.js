
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
    selectDayTo: '', // 当前选择日期
    selectDayBack: '', // 当前选择日期
    canlender: {
      "weeks": []
    },
    canlenderTo: {
      "weeks": []
    },
    canlenderBack: {
      "weeks": []
    },
    _date: "",
    _dateTmp: "",
    selectDayAll: '',
    chooesItem: null,
    scrolltop: 400,
    selectDayFrist: '',
    selectDayScend: ''
  },
  created() {},
  attached() {
    let date = new Date()
    this.backtoday()
    // let time = util.dateFormat('YYYY-mm-dd', date)
    this.setData({
      _date: time
    })

  },
  methods: {
    getXmonthToday(type) {
      // type 0 是当天 -1 是上个月   1是下个月
      let years = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
      let _date = this.getDate(years, "month", 1);
      var now = new Date(_date); // 可以传值调式 now = new Date(2019,2,30); 今天是3月30号
      var year = now.getFullYear(); //getYear()+1900=getFullYear()
      var month = now.getMonth() + 1; //0-11表示1-12月
      var day = now.getDate(); // 当天日期
      if (parseInt(month) < 10) {
        month = "0" + month;
      }
      if (parseInt(day) < 10) {
        day = "0" + day;
      }
      now = year + '-' + month + '-' + day; // 如果取当月日期可直接 return 返回

      var preMonth = parseInt(month) - 1;
      preMonth = preMonth < 10 ? '0' + preMonth : preMonth; // 获取上个月的值
      var nextMonth = parseInt(month) + 1;
      nextMonth = nextMonth < 10 ? '0' + nextMonth : nextMonth; // 获取下个月个月的值

      if (parseInt(month) == 1 && type == -1) { //如果是1月份，要上个月 ，则取上一年的12月份
        return (parseInt(year) - 1) + '-12-' + day;
      } else if (parseInt(month) == 12 && type == 1) { // 如果是12月，要下个月，取下一年的1月
        return (parseInt(year) + 1) + '-01-' + day;
      }

      var preSize = new Date(year, parseInt(month) - 1, 0).getDate(); //上月总天数
      var nextSize = new Date(year, parseInt(month) + 1, 0).getDate(); //下月总天数
      if (preSize < parseInt(day) && type == -1) { // 取上个月，如果上个月总天数小于本月今天，取上个月最后一天    
        return year + '-' + preMonth + '-' + preSize;
      } else if (nextSize < parseInt(day) && type == 1) { // 如果下个月总天数小于本月今天，取下个月最后一天  
        return year + '-' + nextMonth + '-' + nextSize;
      }

      if (type == -1) {
        return year + '-' + preMonth + '-' + day;
      } else if (type == 1) {
        return year + '-' + nextMonth + '-' + day;
      } else if (type == 0) {
        return now;
      }
    },
    //滚动到底部
    bindscrolltolower(e) {
      let num = 0;
      let year, year2
      num = 1;
      year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
      year2 = this.data.canlenderTo.year + "-" + this.data.canlenderTo.month + "-" + this.data.canlenderTo.date
      let date = new Date()
      // let time = util.dateFormat('YYYY-m-d', date)
      if ('' + year2 > '' + time) {
        this.setData({
          toDataShow: false
        })
        return
      } else {
        this.setData({
          toDataShow: true
        })
        let _date = this.getDate(year, num, "month", 1);
        this.setData({
          _date: _date,
          scrolltop: 210
        })
        this.getWeek(_date, 1);
        this.getWeekTo(this.getXmonthToday(1), "month", 1);
        this.getWeekBack(this.getXmonthToday(-1), "month", 1);
      }
    },
    // bindScrollTop1: util.throttle(function(e) {

    //   if (e[0].detail.scrollTop < 10) {
    //     let num = 0;
    //     let year
    //     num = -1;
    //     year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
    //     let _date = this.getDate(year, num, "month", 1);
    //     this.setData({
    //       _date: _date,
    //       scrolltop: 214
    //     })
    //     this.getWeek(_date, 1);
    //     this.getWeekTo(this.getXmonthToday(1), "month", 1);
    //     this.getWeekBack(this.getXmonthToday(-1), "month", 1);
    //   }
    // }),
  
    getOleDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth() + 1;
      var tDate = today.getDate();
      return tYear + "/" + tMonth + "/" + tDate;
    },



    bindGetChooesDate(e) {
    
      if (e.currentTarget.dataset.index == this.data.chooesItem) {
        this.setData({
          selectDayFrist: '',
          selectDayScend: '',
          chooesItem:''
        })
      } else {
        this.setData({
          chooesItem: e.currentTarget.dataset.index,
          calShow: false
        })
        switch (e.currentTarget.dataset.index) {
          case '1':
            this.triggerEvent("get", this.getOleDay(-7));
            this.setData({
              selectDayFrist: this.getOleDay(-7),
              selectDayScend: this.getOleDay(0)
            })
            break;
          case '2':
            this.triggerEvent("get", this.getOleDay(-30));
            this.setData({
              selectDayFrist: this.getOleDay(-30),
              selectDayScend: this.getOleDay(0)
            })
            break;
          case '3':
            this.triggerEvent("get", this.getOleDay(-90));
            this.setData({
              selectDayFrist: this.getOleDay(-90),
              selectDayScend: this.getOleDay(0)
            })
            break;
          case '4':
            this.triggerEvent("get", this.getOleDay(-365));
            this.setData({
              selectDayFrist: this.getOleDay(-365),
              selectDayScend: this.getOleDay(0)
            })
            break;
        }
      }
    },



    hiddenCal() {
      this.setData({
        calShow: true
      })
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
      let type = e.currentTarget.dataset.type; //从上到下哪一行
      let canlender = type == 'now' ? canlender = this.data.canlender : (type == 'to' ? canlender = this.data.canlenderTo : canlender = this.data.canlenderBack)
      let month = canlender.weeks[week][index].month
      let date = canlender.weeks[week][index].date
      let dateTmp = canlender.year + "/" + month + "/" + date
      if (this.data.selectDayFrist == dateTmp || this.data.selectDayScend == dateTmp) {
        this.setData({
          selectDayFrist: '',
          selectDayScend: ''
        })
      } else if (this.data.selectDayFrist != '') {
        this.setData({
          selectDayScend: canlender.year + "/" + month + "/" + date
        })
      } else {
        this.setData({
          selectDayFrist: canlender.year + "/" + month + "/" + date
        })
      }
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
      // let time = util.dateFormat('YYYY-mm-dd', date)
      this.getWeek(time);
      this.getWeekTo(this.getXmonthToday(1), "month", 1);
      this.getWeekBack(this.getXmonthToday(-1), "month", 1);

      this.triggerEvent("MonthActive", time)
      if (this.data.calShow) {
        this.triggerEvent("get", time)
      }
    },

    // 获取日历内容
    getWeekTo(dateData, type) {
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
        'canlenderTo.dateTmp': year + "-" + month + "-" + date
      })
      if (dateB > dateA) {} else {
        this.setData({
          _dateTmp3: year + "-" + month + "-" + date
        })
      }
      this.setData({
        selectDayTo: year + "年" + month + "月" + date + "日",
        selectDayAll: year + "-" + month + "-" + date,
        "canlenderTo.weeks": dates.weeks,
        'canlenderTo.month': month,
        'canlenderTo.date': date,
        "canlenderTo.day": day,
        'canlenderTo.year': year
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

    getWeekBack(dateData, type) {
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
        'canlenderBack.dateTmp': year + "-" + month + "-" + date
      })
      if (dateB > dateA) {} else {
        this.setData({
          _dateTmp1: year + "-" + month + "-" + date
        })
      }
      this.setData({
        selectDayBack: year + "年" + month + "月" + date + "日",
        selectDayAll: year + "-" + month + "-" + date,
        "canlenderBack.weeks": dates.weeks,
        'canlenderBack.month': month,
        'canlenderBack.date': date,
        "canlenderBack.day": day,
        'canlenderBack.year': year
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
      if (dateB > dateA) {} else {
        this.setData({
          _dateTmp2: year + "-" + month + "-" + date
        })
      }
      this.setData({
        selectDay: year + "年" + month + "月" + date + "日",
        selectDayAll: year + "-" + month + "-" + date,
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