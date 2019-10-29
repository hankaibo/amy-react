import React, { useEffect, memo } from 'react';
import Sockjs from 'sockjs-client';
import Stomp from 'stompjs';
import _ from 'lodash';

const Home = () => {
  let socket;
  let client;
  const connect = () => {
    socket = new Sockjs('http://127.0.0.1:8080/ws');
    client = Stomp.over(socket);
    client.heartbeat.outgoing = 5000;
    client.heartbeat.incoming = 0;

    client.connect({ 'username': 'a.b.c' }, data => {
      console.log('client connect success:', data);
      client.subscribe('/topic/sub/public', message => {
      });
      client.subscribe('/user/sub/msg', message => {
      });
    }, error => {
      console.log('-1-1-1-1-1-1--1-1-11-', error);
    });
  };
  const disconnect = () => {
    client.disconnect();
    console.log('client connect break.');
  };
  const send = () => {
    // client.send('destination', {}, 'body');
    client.send('/app/hello', {}, 'body');
    client.send('/app/hello1', {}, 'body1');
    // client.send('hello2', {}, 'body');
    // client.send('hello4', {}, 'body');
  };
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);
  return (
    <>
      {/* {console.log('使用memo后，home只渲染一次。')} */}
      <button onClick={send}>发送</button>
      <h2>Hello! Welcomse to FE!</h2>
      <section>
        <h3>
          admin/123456用户，拥有全部操作权限，为了保障大家的正常使用，请不要对其权限进行增减，更不要将其删除。
        </h3>
        <h3>add/123456用户，拥有基础功能的添加权限。</h3>
        <h3>delete/123456用户，拥有基础功能的删除权限。</h3>
        <h3>update/123456用户，拥有基础功能的修改权限。</h3>
        <strong>
          因为进入列表之后才能进行相应操作，所以各角色请分配进入【首页的权限】以及【各菜单列表】的权限。
        </strong>
        <h3>谢谢。</h3>
      </section>
    </>
  );
};

const areEqual = (prevProps, nextProps) => {
  /*
  通过对比两次props决定是否渲染。
  如果nextProps与prevProps相等，则为真，表示前后两次一样，不需要渲染；反之，为假，渲染。
  可手动硬编码查看其渲染次数。
  */
  return _.isEqual(prevProps, nextProps);
};

export default memo(Home, areEqual);
