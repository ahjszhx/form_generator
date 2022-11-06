
export function socketConnect(_this,websocketUrl,CallMessage) {
  let ws = new WebSocket(websocketUrl);
  ws.onopen = function () {
    // Web Socket 已连接上，使用 send() 方法发送数据
    console.log('WebSocket连接成功')
  },
    ws.onmessage = function (e) {
      // 根据服务器推送的消息做自己的业务处理
      CallMessage(JSON.parse(e.data))
    },
    ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...')
    },
    // 组件销毁时调用，中断websocket链接
    _this.socketOver = () => {
      ws.close()
    }
  _this.websocket = ws;

}
