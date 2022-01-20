# 微信云托管云调用代码示例

## 项目说明

此项目用于微信云托管以云调用形式访问「微信服务端API」

演示API：[文字安全检测V2版本](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.msgSecCheck.html)

## 使用方法

在使用前，请与架构师确认环境和小程序是否配置最优链路，然后再执行下述步骤：

1. 创建微信云托管环境，记住环境ID
2. 将 `/service` 目录中的 `http` 代码上传到微信云托管，建立服务，记住服务名称
3. 将 `/service` 目录中的 `websocket` 代码上传到微信云托管，建立新的服务，记住服务名称
4. 将上述信息填写到 `/miniprogram/utils/check.js` 中 `config`

``` js
const config = {
  envid: 'wxrun-id',  // 云托管环境ID，第一步创建的环境ID
  http: 'sec-new', // 第2步，http链路的服务名称
  websocket: 'sec-wss' // 第3步，wss链路的服务名称
}
```

4. 运行小程序，在真机中访问链路，查看耗时情况。
5. 降级策略，你可以在 WSS测试过程中，在调试器中输入如下命令断开链接，会有自动降级重试。

``` js
getApp().checkwss.close()
```

## 其他说明

- 微信小游戏相关的代码请参照 `/minigame` 中代码，只是演示，由于框架引擎不同，没有做真实演示，整体链路和小程序相同。
- 真实测试下，深圳客户端-上海服务，HTTP链路会在300ms以下，wss链路将比http链路减少20%，可以在充分测试后选择合适的形式接入业务。
