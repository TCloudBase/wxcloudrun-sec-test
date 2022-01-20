const ws = require('nodejs-websocket')
const request = require('request')

ws.createServer(connection => {
  console.log('建立新的链接')
  connection.on('text', async function (data) {
    const { scene, content, nickname, title, signature, flag } = JSON.parse(data)
    const starttime = new Date().getTime()
    const result = await callapi({
      openid: connection.headers['x-wx-openid'],
      version: 2,
      scene: scene || 2,
      content: content,
      nickname: nickname,
      title: title,
      signature: signature
    })
    const endtime = new Date().getTime()
    connection.sendText(JSON.stringify({
      api: result,
      time: endtime - starttime,
      flag
    }))
  })
  connection.on('close', function (code, reason) {
    console.log('服务关闭')
  })
  connection.on('error', () => {
    console.log('服务异常关闭')
  })
}).listen(3000)

function callapi (data) {
  return new Promise((resolve) => {
    request({
      method: 'POST',
      url: 'http://api.weixin.qq.com/wxa/msg_sec_check',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }, function (error, response) {
      if (error) {
        const err = error.toString()
        console.log('网络请求错误', err)
        resolve({
          errcode: -1,
          errmsg: err
        })
      } else {
        try {
          resolve(JSON.parse(response.body))
        } catch (e) {
          console.log('网络请求错误', e.toString())
          resolve({
            errcode: -1,
            errmsg: e.toString(),
            raw: response.body
          })
        }
      }
    })
  })
}
