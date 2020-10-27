const app = getApp();
// const mwx = require('../../utils/mwx.js');

Page({
  data: {},
  onLoad() {},
  onShow() {},
  onShareAppMessage() {
    return mwx.shareSetting();
  }
});
