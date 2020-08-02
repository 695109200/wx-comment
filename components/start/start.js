Component({
  properties: {
    stateList: {
      type: Array,
      value: [],
    },
    start: {
      type: Number,
      value: [],
    }
  },
  data: {
    state: '',
    startL: [1,1,1,1,1]
  },
  lifetimes: {
    attached: function() {
    this.initStart(this.data.start)
    },
  },
  methods: {

    initStart(n){
      let tmp = this.data.startL
      this.setData({
        state: this.data.stateList[n - 1]
      })
      for (let i = 0; i < n; i++) {
        tmp[i] = 1
      }
      for (let j = 0; j < 5 - n; j++) {
        tmp[tmp.length - j - 1] = 0
      }
      this.setData({
        startL: tmp
      })
    },

    currStrat(e) {
      this.triggerEvent("get", { start: e.currentTarget.dataset.index, state: this.data.stateList[e.currentTarget.dataset.index == 0 ? e.currentTarget.dataset.index : e.currentTarget.dataset.index-1]})
      this.initStart(e.currentTarget.dataset.index)
    },
  }
})