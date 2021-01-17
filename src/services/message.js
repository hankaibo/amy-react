import Sockjs from 'sockjs-client';
import Stomp from 'stompjs';

let client;

export function connect(action) {
  // 后台配置的 StompEndpoints
  const socket = new Sockjs('/ws');
  client = Stomp.over(socket, null, { timeout: 15000 });
  const headers = {
    Authorization: localStorage.getItem('jwt'),
  };

  client.connect(
    headers,
    () => {
      client.send('/api/v1/messages/hello');
      client.subscribe(
        '/topic/message',
        (data) => {
          if (action) {
            action(data);
          }
        },
        { ack: 'client' },
      );
      // eslint-disable-next-line no-console
      console.log('websocket连接成功。');
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log('websocket连接失败: ', error);
    },
  );
}

export function disconnect() {
  if (client && client.connected) {
    client.disconnect(() => {
      // eslint-disable-next-line no-console
      console.log('关闭websocket连接。');
    });
  }
}

/**
 * 读取一条信息，不分已读未读。后台将相关信息返回，并将状态标示为已读。
 * @param payload
 * @returns {Promise<number>}
 */
export async function readNotices(payload) {
  const { id = Date.now() } = payload;
  return id;
}

/**
 * 清空所有未读信息。后台将所有信息状态标示为已读。
 * @returns {Promise<void>}
 */
export async function clearNotices() {
  client.send('destination', {}, 'body');
}
