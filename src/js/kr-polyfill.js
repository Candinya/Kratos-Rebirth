/**
 * 2024 年快结束了， iOS 18 也升级了， Safari (Webkit) 依然不支持 requestIdleCallback() 。
 *
 * 需要注意的是，这不是一个完整意义上的实现，只是一个类似功能的简陋包装，以使运行在和这个函数有仇的浏览器内核上的网页的评论区能正常加载。
 */
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    let startTime = Date.now();
    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50.0 - (Date.now() - startTime));
        },
      });
    }, 1);
  };
window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
