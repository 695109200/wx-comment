
const app = getApp()
Page({
  data: {
    val: 60,
    value: '',
  },
  bindvalue(e) {
    this.setData({
      value: e.detail.value
    })
  }
})
