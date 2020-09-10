import React from 'react';
import { isValidHex } from '../helpers/color';
import styles from './PhotoshopFields.less';

import { EditableInput } from '../common';

const PhotoshopFields = ({ onChange, rgb, hsv, hex }) => {
  const handleChange = (data, e) => {
    if (data['#']) {
      if (isValidHex(data['#'])) {
        onChange(
          {
            hex: data['#'],
            source: 'hex',
          },
          e,
        );
      }
    } else if (data.r || data.g || data.b) {
      onChange(
        {
          r: data.r || rgb.r,
          g: data.g || rgb.g,
          b: data.b || rgb.b,
          source: 'rgb',
        },
        e,
      );
    } else if (data.h || data.s || data.v) {
      onChange(
        {
          h: data.h || hsv.h,
          s: data.s || hsv.s,
          v: data.v || hsv.v,
          source: 'hsv',
        },
        e,
      );
    }
  };

  return (
    <div className={styles.fields}>
      <EditableInput className={styles.wrap} label="h" value={Math.round(hsv.h)} onChange={handleChange} />
      <EditableInput className={styles.wrap} label="s" value={Math.round(hsv.s * 100)} onChange={handleChange} />
      <EditableInput className={styles.wrap} label="v" value={Math.round(hsv.v * 100)} onChange={handleChange} />
      <div className={styles.divider} />
      <EditableInput className={styles.wrap} label="r" value={rgb.r} onChange={handleChange} />
      <EditableInput className={styles.wrap} label="g" value={rgb.g} onChange={handleChange} />
      <EditableInput className={styles.wrap} label="b" value={rgb.b} onChange={handleChange} />
      <div className={styles.divider} />
      <EditableInput className={styles.wrapHex} label="#" value={hex.replace('#', '')} onChange={handleChange} />
      <div className={styles.fieldSymbols}>
        <div className={styles.symbol}>°</div>
        <div className={styles.symbol}>%</div>
        <div className={styles.symbol}>%</div>
      </div>
    </div>
  );
};

export default PhotoshopFields;
