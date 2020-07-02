import React from 'react';
import classnames from 'classnames';
import styles from './PhotoshopPointerCircle.less';

const PhotoshopPointerCircle = ({ hsl }) => {
  const picker = classnames(styles.picker, {
    [styles.pickerDark]: hsl.l > 0.5,
  });

  return <div className={picker} />;
};

export default PhotoshopPointerCircle;
