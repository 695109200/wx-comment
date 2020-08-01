
const app = getApp()
Page({
  data: {
    val: 160,
    value: 160,
  },
  bindvalue(e) {
    this.setData({
      value: e.detail.value
    })
  }
})
