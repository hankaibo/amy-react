import React, { useEffect, useRef } from 'react';

const Eraser = ({ width, height, radius = 10, qrSrc }) => {
  const eraserRef = useRef(null);

  const init = () => {
    const canvas = eraserRef.current;
    const context = canvas.getContext('2d');

    let isPress = false;
    let old = null;

    const image = new Image();
    // eslint-disable-next-line global-require
    image.src = require('@/assets/foo.png');
    image.onload = () => {
      context.drawImage(image, 0, 0, width, height);
    };

    canvas.addEventListener('mousedown', (e) => {
      const { x, y } = windowToCanvas(canvas, e.clientX, e.clientY);
      isPress = true;
      old = { x, y };
    });
    canvas.addEventListener('mousemove', (e) => {
      const { x, y } = windowToCanvas(canvas, e.clientX, e.clientY);
      if (isPress) {
        context.globalCompositeOperation = 'destination-out';

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        context.lineWidth = radius * 2;
        context.beginPath();
        context.moveTo(old.x, old.y);
        context.lineTo(x, y);
        context.stroke();

        old = { x, y };
      }
    });
    canvas.addEventListener('mouseup', () => {
      isPress = false;
    });

    function windowToCanvas(dom, x, y) {
      const bbox = dom.getBoundingClientRect();
      const style = window.getComputedStyle(dom);
      return {
        x:
          (x - bbox.left - parseInt(style.paddingLeft, 10) - parseInt(style.borderLeft, 10)) *
          (dom.width / parseInt(style.width, 10)),
        y:
          y -
          bbox.top -
          parseInt(style.paddingTop, 10) -
          parseInt(style.borderTop, 10) * (dom.height / parseInt(style.height, 10)),
      };
    }
  };

  useEffect(() => {
    init();
  }, []);

  const canvasStyle = {
    backgroundImage: `url(${qrSrc})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  };
  return <canvas ref={eraserRef} width={width} height={height} style={canvasStyle} />;
};

export default Eraser;
