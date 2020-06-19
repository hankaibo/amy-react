import React, { useState } from 'react';
import { Steps } from 'intro.js-react';
import { getItem, setItem } from '@/utils/utils';
import { PhotoShopPicker } from '@/components/ColorPicker';
import 'intro.js/introjs.css';
import './index.less';

const Home = () => {
  const [intro, setIntro] = useState({
    stepsEnabled: getItem('stepsEnabled', true),
    steps: [
      {
        element: '.steps-search',
        intro: '全站搜索',
        position: 'left',
        tooltipClass: 'myTooltipClass',
      },
      {
        element: '.steps-reference',
        intro: '参考文档',
        position: 'left',
        tooltipClass: 'myTooltipClass',
      },
      {
        element: '.steps-avatar',
        intro: '用户',
        position: 'left',
        tooltipClass: 'myTooltipClass',
      },
      {
        element: '.steps-language',
        intro: '国际化',
        position: 'left',
        tooltipClass: 'myTooltipClass',
      },
    ],
    initialStep: 0,
  });
  const [color, setColor] = useState({
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 1,
  });

  const handleExit = () => {
    setIntro({
      ...intro,
      stepsEnabled: false,
    });
    setItem('stepsEnabled', false);
  };

  const handleChangeComplete = (data) => {
    // console.log(data);
    if (data.hsl !== color) {
      setColor(data.hsl);
    }
    // 可以调用父组件事件
    // props.onChange && props.onChange(data.hex);
  };

  const { stepsEnabled, steps, initialStep } = intro;
  return (
    <>
      <Steps enabled={stepsEnabled} steps={steps} initialStep={initialStep} onExit={handleExit} />
      <h2>Hello!</h2>
      <PhotoShopPicker color={color} onChangeComplete={handleChangeComplete} />
      <div className="label">PhotoShop</div>
    </>
  );
};

export default Home;
