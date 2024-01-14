import { httpPost } from "@/utils/request";
import Taro from "@tarojs/taro";
import { SOCKET_URL } from "@/utils/config";
import { useStore } from "@/stores";

let reconnect = false;

let socketTask: Taro.SocketTask | null;

const getSocketTask = (token: string) => {
  if (socketTask) socketTask.close({ code: 1000 });
  return Taro.connectSocket({
    url: `${SOCKET_URL}/hubs/message?id=${token}&access_token=${
      useStore().accessToken
    }`,
  });
};

setInterval(() => {
  if (reconnect) {
    startSocketTask();
  }
}, 5000);

const TaskHandler = (socket: Taro.SocketTask) => {
  socketTask = socket;
  socketTask.onOpen(() => {
    reconnect = false;
    socket.send({
      data: `{"protocol":"json", "version":1}${String.fromCharCode(0x1e)}`,
    });
    console.log("连接成功");
  });
  socketTask.onMessage((res) => {
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
  socketTask.onClose((res) => {
    const { code } = res;
    if (code === 1006) {
      reconnect = true;
      console.log("服务器异常关闭，正在尝试重新连接...");
    } else if (code === 3000) {
      console.log("退出登录，连接关闭", res);
    } else {
      if (socketTask) reconnect = true;
      console.log("连接关闭", res);
    }
  });
  socketTask.onError((res) => {
    console.log("连接错误", res);
  });
};

export const startSocketTask = () => {
  httpPost("/hubs/message/negotiate?negotiateVersion=1", {}, (res) => {
    const { connectionToken } = res.data;
    getSocketTask(connectionToken).then(TaskHandler);
  });
};

export const stopSocketTask = () => {
  socketTask?.close({
    code: 3000,
  });
  socketTask = null;
};
