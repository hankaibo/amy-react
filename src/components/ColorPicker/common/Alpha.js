import React, { useEffect, useRef } from 'react';
import Checkboard from './Checkboard';
import * as alpha from '../helpers/alpha';
import styles from './Alpha.less';

const Alpha = (props) => {
  const { direction = 'horizontal', hsl, a, rgb, render, renderers, onChange } = props;
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const change = alpha.calculateChange(e, hsl, direction, a, containerRef.current);
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

  const gradientDirection =
    direction === 'vertical'
      ? {
          background: `linear-gradient(to bottom, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
        }
      : {
          background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0) 0%,rgba(${rgb.r},${rgb.g},${rgb.b}, 1) 100%)`,
        };

  const pointerDirection =
    direction === 'vertical'
      ? {
          left: 0,
          top: `${rgb.a * 100}%`,
        }
      : {
          left: `${rgb.a * 100}%`,
        };

  return (
    <div className={styles.alpha}>
      <div className={styles.checkboard}>
        <Checkboard renderers={renderers} />
      </div>
      <div className={styles.gradient} style={gradientDirection} />
      <div
        className={styles.container}
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

export default Alpha;
