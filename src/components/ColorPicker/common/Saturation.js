import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import * as saturation from '../helpers/saturation';
import styles from './Saturation.less';

const Saturation = (props) => {
  const { hsl, hsv, render, onChange } = props;
  const containerRef = useRef(null);

  const myThrottle = throttle((fn, data, e) => {
    fn(data, e);
  }, 50);

  const handleChange = (e) => {
    if (typeof onChange === 'function') {
      myThrottle(onChange, saturation.calculateChange(e, hsl, containerRef.current), e);
    }
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleChange);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e) => {
    handleChange(e);
    window.addEventListener('mousemove', handleChange);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      myThrottle.cancel();
      window.removeEventListener('mousemove', handleChange);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });

  const colorStyle = {
    background: `hsl(${hsl.h},100%, 50%)`,
  };
  const pointStyle = {
    top: `${-(hsv.v * 100) + 100}%`,
    left: `${hsv.s * 100}%`,
  };

  return (
    <div
      className={styles.color}
      style={colorStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchMove={handleChange}
      onTouchStart={handleChange}
    >
      <div className={styles.saturationWhite}>
        <div className={classnames(styles.saturationBlack, styles.black)} />
        <div className={styles.pointer} style={pointStyle}>
          {render ? props.render(hsl) : <div className={styles.circle} />}
        </div>
      </div>
    </div>
  );
};

export default Saturation;
