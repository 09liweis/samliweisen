const { sendRequest, sendResp, sendErr } = require('../helpers/request');

exports.getXiaohongshu = (req, resp) => {
  const url = `https://edith.xiaohongshu.com/api/sns/web/v1/user_posted?num=30&cursor=647915f400000000130093e6&user_id=5f70ce7d000000000101e90b&image_scenes=FD_PRV_WEBP,FD_WM_WEBP`;
  sendRequest({ url }, (err, ret) => {
    console.log(err);
    console.log(url);
    console.log(ret);
    return sendResp(resp, ret);
  });
}