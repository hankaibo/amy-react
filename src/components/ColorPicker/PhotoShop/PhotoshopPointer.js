import React from 'react';
import styles from './PhotoshopPointer.less';

const PhotoshopPointerCircle = () => (
  <>
    <div className={styles.left}>
      <div className={styles.leftInside} />
    </div>

    <div className={styles.right}>
      <div className={styles.rightInside} />
    </div>
  </>
);

export default PhotoshopPointerCircle;
