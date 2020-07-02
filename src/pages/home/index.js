import React, { useState } from 'react';
import { Steps } from 'intro.js-react';
import { getItem, setItem } from '@/utils/utils';
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

  const handleExit = () => {
    setIntro({
      ...intro,
      stepsEnabled: false,
    });
    setItem('stepsEnabled', false);
  };

  const { stepsEnabled, steps, initialStep } = intro;
  return (
    <>
      <Steps enabled={stepsEnabled} steps={steps} initialStep={initialStep} onExit={handleExit} />
      <h2>Hello!</h2>
    </>
  );
};

export default Home;
