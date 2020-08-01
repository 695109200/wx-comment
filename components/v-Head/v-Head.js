
Component({
  properties: {
    type: {
      type: String,
      value:'',
      observer(newVal, oldVal) {
        this.setData({
          modifyTitle: newVal
        })
      }
    }
  },
  data: {
    userHead:'',
    modifyTitle:''
  },
  attached() {
    this.setData({
      userHead: wx.getStorageSync('userInfo').avatarUrl
    })
  }
})