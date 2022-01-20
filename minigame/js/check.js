const app = {
  log:wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
}
app.wssfunction = {}
const config = {
  envid: 'wxrun-5g8wo2hgfcad8a9e',  // 云托管环境ID
  http: 'sec-new', // http链路的服务名称
  websocket: 'sec-wss' // wss链路的服务名称
}


async function Check(data){
  if(app.checkwssflag==null){
    console.log('首次触发建立连接')
    await connectWss()
  }
  if(app.checkwssflag === true){
    data.flag = new Date().getTime()
    app.checkwss.send({
      data: JSON.stringify(data)
    }) 
    return new Promise((resolve)=>{
      app.wssfunction[data.flag] = async function(result){
        if(result !== false) {
          const endtime = new Date().getTime()
          app.log.info(`WSS调用：${endtime - data.flag}ms`, result.time, endtime - data.flag-result.time)
          console.log(`WSS调用：${endtime - data.flag}ms`, result.time, endtime - data.flag-result.time)
          delete app.wssfunction[data.flag]
          resolve(result.api)
        } else {
          delete app.wssfunction[data.flag]
          resolve(await httpCheck(data))
        }
      }
    })
  } else {
    return httpCheck(data)
  }
}


async function httpCheck(data) {
  const start = new Date().getTime()
  const result = await wx.cloud.callContainer({
    config: {
      env: config.envid
    },
    path: '/',
    data: data,
    header: {
      "X-WX-SERVICE": config.http,
      "content-type": "application/json",
      "X-WX-EXCLUDE-CREDENTIALS": "unionid, cloudbase-access-token"
    },
    method: "POST"
  })
  const end = new Date().getTime()
  app.log.info(`HTTP调用：${end - start}ms`, result.callID, result.data.time)
  console.log(`HTTP调用：${end - start}ms`, result.callID, result.data.time)
  return result.data
}

async function connectWss(){
  if(config.websocket != null && config.websocket !== ''){
    await connectOpen()
  } else {
    app.checkwssflag = false
  }
}

async function connectOpen(){
  return new Promise(async (resolve)=>{
    app.checkwss = (await wx.cloud.connectContainer({
      config: {
        env: config.envid
      },
      service: config.websocket,
      path: '/'
    })).socketTask
    app.checkwss.onOpen(function (res) {
      app.checkwssflag = true
      console.log('连接成功')
      resolve()
    })
    app.checkwss.onClose(async function (res) {
      console.log(res)
      for(const i in app.wssfunction){
        console.log('降级重试')
        app.wssfunction[i](false)
      }
      if(app.checkwssflag === true){
        console.log('发起重连')
        app.checkwssflag = false
        await connectOpen()
      } else {
        app.checkwssflag = false
        console.log('连接有问题，取消连接')
        resolve()
      }
    })
    app.checkwss.onMessage(function (res) {
      const result = JSON.parse(res.data)
      app.wssfunction[result.flag](result)
    })
  })
}

module.exports = {
  Check,
  httpCheck
}