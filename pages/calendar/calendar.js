Page({
  data: {

  },
  onLoad: function (options) {

  },
   bindselect:function (e) {
    this.setData({
      chooes: !e.detail.ischeck
    })
  },
  GetToady: function (time) {
    if (time.detail) {
      time = time.detail
    }
    console.log(time)
  }
})