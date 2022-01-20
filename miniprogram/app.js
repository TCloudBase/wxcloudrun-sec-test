App({
  log:wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null,
  onLaunch() {
    wx.cloud.init({
      traceUser: true
    })
  }
})
