const express = require('express')
const request = require('request')
const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', async (req, res) => {
  const { scene, content, nickname, title, signature } = req.query
  const start = new Date().getTime()
  const data = await callapi({
    openid: req.headers['x-wx-openid'],
    version: 2,
    scene: scene || 2,
    content: content,
    nickname: nickname,
    title: title,
    signature: signature
  })
  const end = new Date().getTime()
  res.send({
    api: data,
    time: end - start
  })
})

app.post('/', async (req, res) => {
  const { scene, content, nickname, title, signature } = req.body
  const start = new Date().getTime()
  const data = await callapi({
    openid: req.headers['x-wx-openid'],
    version: 2,
    scene: scene || 2,
    content: content,
    nickname: nickname,
    title: title,
    signature: signature
  })
  const end = new Date().getTime()
  res.send({
    api: data,
    time: end - start
  })
})

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
          console.log('请求结果：', response.body)
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

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('启动成功', port)
})
