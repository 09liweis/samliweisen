const { sendRequest, sendResp, sendErr } = require('../helpers/request');
const biliAPI = require('bili-api');

exports.getBilibili = async (req, resp) => {
  const userId = '19524235';
  let up = await biliAPI({ mid: userId }, ['allVideos'])
  return sendResp(resp, up);
}