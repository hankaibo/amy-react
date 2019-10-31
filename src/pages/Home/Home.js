import React, { memo } from 'react';
import _ from 'lodash';

const Home = () => {
  return (
    <>
      {/* {console.log('使用memo后，home只渲染一次。')} */}
      <h2>Hello! Welcome to My Ant Design Pro!</h2>
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
