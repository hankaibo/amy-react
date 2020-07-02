import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import * as hue from '../helpers/hue';
import styles from './Hue.less';

const Hue = (props) => {
  const { direction = 'horizontal', hsl, render, onChange } = props;
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const change = hue.calculateChange(e, direction, hsl, containerRef.current);
    if (change) {
      if (typeof onChange === 'function') {
        onChange(change, e);
      }
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
      window.removeEventListener('mousemove', handleChange);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const hueDirection = classnames(styles.container, {
    [styles.hueHorizontal]: direction === 'horizontal',
    [styles.hueVertical]: direction === 'vertical',
  });

  const pointerDirection =
    direction === 'vertical'
      ? {
          left: 0,
          top: `${-((hsl.h * 100) / 360) + 100}%`,
        }
      : {
          left: `${(hsl.h * 100) / 360}%`,
        };
  return (
    <div className={styles.hue}>
      <div
        className={hueDirection}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange}
        onTouchStart={handleChange}
      >
        <div className={styles.pointer} style={pointerDirection}>
          {render ? props.render() : <div className={styles.slider} />}
        </div>
      </div>
    </div>
  );
};

export default Hue;
