import React, { useState } from 'react';
import DepartmentForm from './DepartmentForm';

const DepartmentModal = ({ children, ...restProps }) => {
  // 【模态框显示隐藏属性】
  const [visible, setVisible] = useState(false);

  // 【模态框显示隐藏函数】
  const showModalHandler = (e) => {
    if (e) e.stopPropagation();
    setVisible(true);
  };
  const hideModelHandler = () => {
    setVisible(false);
  };

  return (
    <>
      <span onClick={showModalHandler}>{children}</span>
      {visible && <DepartmentForm visible={visible} closeModal={hideModelHandler} {...restProps} />}
    </>
  );
};

export default DepartmentModal;
