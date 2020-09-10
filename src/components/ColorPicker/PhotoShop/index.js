import React, { useState } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { ColorWrap, Saturation, Hue } from '../common';
import PhotoshopFields from './PhotoshopFields';
import PhotoshopPointerCircle from './PhotoshopPointerCircle';
import PhotoshopPointer from './PhotoshopPointer';
import PhotoshopPreviews from './PhotoshopPreviews';
import styles from './index.less';

const Photoshop = (props) => {
  const { rgb, hex, hsl, hsv, header, onChange, onAccept, onCancel } = props;
  const [currentColor] = useState(hex);

  const { className = '' } = props;

  const headerClass = classnames(styles.picker, 'photoshop-picker', className);

  return (
    <div className={headerClass}>
      <header className={styles.head}>{header}</header>
      <main className={styles.body}>
        <div className={styles.saturation}>
          <Saturation
            hsl={hsl}
            hsv={hsv}
            onChange={onChange}
            render={(hslColor) => <PhotoshopPointerCircle hsl={hslColor} />}
          />
        </div>

        <div className={styles.hue}>
          <Hue direction="vertical" hsl={hsl} onChange={onChange} render={() => <PhotoshopPointer />} />
        </div>

        <div className={styles.controls}>
          <div className={styles.top}>
            <div className={styles.previews}>
              <PhotoshopPreviews rgb={rgb} currentColor={currentColor} />
            </div>
            <div className={styles.actions}>
              <Button type="primary" onClick={onAccept}>
                OK
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
              <PhotoshopFields onChange={onChange} rgb={rgb} hsv={hsv} hex={hex} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorWrap(Photoshop);
