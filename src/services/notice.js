import { stringify } from 'qs';
import request from '@/utils/request';
import Sockjs from 'sockjs-client';
import Stomp from 'stompjs';

let client;

export function connect() {
  // 后台配置的 StompEndpoints
  const socket = new Sockjs('http://127.0.0.1:8080/ws');
  client = Stomp.over(socket);

  client.connect(
    { Authorization: localStorage.getItem('jwt') },
    (data) => {
      // eslint-disable-next-line no-console
      console.log('client connect success: ', data);
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log('client lost connect: ', error);
    },
  );
}

export function disconnect() {
  if (client) {
    client.disconnect();
  }
}

export async function listen(action) {
  client.subscribe('/sub/public', () => {
    // 模拟后台服务器返回的数据
    const mockData = [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '你收到了 14 份新周报',
        datetime: '2017-08-09',
        type: 'notification',
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: '你推荐的 曲妮妮 已通过第三轮面试',
        datetime: '2017-08-08',
        type: 'notification',
      },
      {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: '这种模板可以区分多种通知类型',
        datetime: '2017-08-07',
        read: true,
        type: 'notification',
      },
      {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: '左侧图标用于区分不同的类型',
        datetime: '2017-08-07',
        type: 'notification',
      },
      {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: '内容不要超过两行字，超出时自动截断',
        datetime: '2017-08-07',
        type: 'notification',
      },
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '曲丽丽 评论了你',
        description: '描述信息描述信息描述信息',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '朱偏右 回复了你',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
        title: '标题',
        description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
        datetime: '2017-08-07',
        type: 'message',
        clickClose: true,
      },
      {
        id: '000000009',
        title: '任务名称',
        description: '任务需要在 2017-01-12 20:00 前启动',
        extra: '未开始',
        status: 'todo',
        type: 'event',
      },
      {
        id: '000000010',
        title: '第三方紧急代码变更',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '马上到期',
        status: 'urgent',
        type: 'event',
      },
      {
        id: '000000011',
        title: '信息安全考试',
        description: '指派竹尔于 2017-01-09 前完成更新并发布',
        extra: '已耗时 8 天',
        status: 'doing',
        type: 'event',
      },
      {
        id: '000000012',
        title: 'ABCD 版本发布',
        description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
        extra: '进行中',
        status: 'processing',
        type: 'event',
      },
    ];
    action(mockData);
  });
}

export async function listNotices() {
  return request(`/messages`);
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

/**
 * 根据主键删除一条信息。不分已读未读。
 * @param payload
 * @returns {Promise<string>}
 */
export async function deleteNotices(payload) {
  const { id = 'test' } = payload;
  return id;
}

/**
 * 删除所有信息。不分已读未读。
 * @returns {Promise<void>}
 */
export async function deleteBatchNotices() {
  return null;
}

/**
 * 按条件查询站内信列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageMessage(params) {
  return request(`/messages?${stringify(params)}`);
}

/**
 * 添加站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function addMessage(params) {
  return request.post('/messages', {
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条站内信数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getMessageById(id) {
  return request(`/messages/${id}`);
}

/**
 * 更新站内信。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateMessage(params) {
  const { id, plusReceiveIds, minusReceiveIds, ...rest } = params;
  return request.put(`/messages/${id}`, {
    data: {
      msg: {
        id,
        ...rest,
      },
      plusReceiveIds,
      minusReceiveIds,
    },
  });
}

/**
 * 发布站内信。
 *
 * @param id
 * @returns {Promise<void>}
 */
export async function publishMessage(id) {
  return request.patch(`/messages/${id}/publication`);
}

/**
 * 删除站内信。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteMessage(id) {
  return request.delete(`/messages/${id}`);
}

/**
 * 批量删除站内信。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchMessage(ids) {
  return request.delete('/messages', {
    data: [...ids],
  });
}
