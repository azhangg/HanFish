import { httpPost } from "@/utils/request";
import Taro from "@tarojs/taro";
import { SOCKET_URL } from "@/utils/config";
import { useStore } from "@/stores";

let reconnect = false;

const getSocketTask = (token: string) =>
  Taro.connectSocket({
    url: `${SOCKET_URL}/hubs/message?id=${token}&access_token=${
      useStore().accessToken
    }`,
  });

setInterval(() => {
  if (reconnect) {
    startSocketTask();
  }
}, 5000);

const TaskHandler = (socket: Taro.SocketTask) => {
  socket.onOpen(() => {
    reconnect = false;
    socket.send({
      data: `{"protocol":"json", "version":1}${String.fromCharCode(0x1e)}`,
    });
    console.log("连接成功");
  });
  socket.onMessage((res) => {
    let msg = res.data.split(String.fromCharCode(0x1e));
    for (let item in msg) {
      if (msg[item] != "") {
        let data = JSON.parse(msg[item]);
        if (data.type === 1 && data.target && data.arguments?.length > 0) {
          Taro.eventCenter.trigger(data.target, data.arguments);
        }
      }
    }
  });
  socket.onClose((res) => {
    const { code } = res;
    if (code === 1006) {
      reconnect = true;
      console.log("连接异常关闭，正在尝试重新连接...");
    } else {
      reconnect = true;
      console.log("连接关闭", res);
    }
  });
  socket.onError((res) => {
    console.log("连接错误", res);
  });
};

export const startSocketTask = () => {
  httpPost("/hubs/message/negotiate?negotiateVersion=1", {}, (res) => {
    const { connectionToken } = res.data;
    getSocketTask(connectionToken).then(TaskHandler);
  });
};
