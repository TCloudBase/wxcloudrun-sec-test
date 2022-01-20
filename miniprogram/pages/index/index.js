const app = getApp()
const check = require('../../utils/check')
Page({
  data: {
		num: '-',
		now: '加载中',
		res: '准备完成',
		btndis: false
	},
  async startwss(){
    this.btndis(true)
		let sum = 0
		this.print('\n--------------')
    for (let i = 0; i <= 100; i++) {
      const start = new Date().getTime()
      await check.Check({
        content: encodeURIComponent('你真他妈是个小可爱')
      })
      const end = new Date().getTime()
      if(i>0) sum += end-start
      this.shownow('验证WSS链路｜' + i + '%【' + (end-start) + 'ms】' + '【平均：' + parseInt((sum) / i) + 'ms】')
    }
    this.print('微信云调用WSS链路平均耗时：' + parseInt(sum / 100) + 'ms；')
    this.btndis()
  },
  async starthttp(){
    this.btndis(true)
		let sum = 0
		this.print('\n--------------')
    for (let i = 0; i <= 100; i++) {
      console.log()
      const start = new Date().getTime()
      await check.httpCheck({
        content: encodeURIComponent('你真他妈是个小可爱')
      })
      const end = new Date().getTime()
      if(i>0) sum += end-start
      this.shownow('验证HTTP链路｜' + i + '%【' + (end-start) + 'ms】' + '【平均：' + parseInt(sum / i) + 'ms】')
    }
    this.print('微信云调用HTTP链路平均耗时：' + parseInt(sum / 100) + 'ms；')
    this.btndis()
  },
	btndis(flag = false) {
		this.setData({
			btndis: flag
		})
	},
  print(text) {
		this.setData({
			res: this.data.res + '\n' + text
		})
	},
	shownow(text) {
		this.setData({
			now: text
		})
	},
	copycallid() {
		wx.setClipboardData({
			data: callidlist,
		})
	}
})
