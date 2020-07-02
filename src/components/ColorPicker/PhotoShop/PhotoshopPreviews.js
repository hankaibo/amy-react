import React from 'react';
import styles from './PhotoshopPreviews.less';

const PhotoshopPreviews = ({ rgb, currentColor }) => {
  const newColor = {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
  };

  const current = {
    background: currentColor,
  };

  return (
    <>
      <div className={styles.label}>new</div>
      <div className={styles.swatches}>
        <div className={styles.new} style={newColor} />
        <div className={styles.current} style={current} />
      </div>
      <div className={styles.label}>current</div>
    </>
  );
};

export default PhotoshopPreviews;
