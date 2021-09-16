// app.js
export const dva = {
  config: {
    onError(e) {
      // 统一的错误处理，也可以在request中统一处理。
      // eslint-disable-next-line no-console
      console.error(e && e.error);
    },
  },
};
