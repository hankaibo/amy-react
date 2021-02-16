// https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/
import { useEffect, useRef } from 'react';

const useInterval = (callback, delay) => {
  const savedCallbackRef = useRef();

  // 保存新回调
  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallbackRef.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

export default useInterval;
