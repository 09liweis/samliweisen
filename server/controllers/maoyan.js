//Blocked by maoyan
const { sendRequest, sendResp, sendErr } = require('../helpers/request');

exports.getMaoyan = (req, resp) => {
  const url = 'https://piaofang.maoyan.com/dashboard-ajax';
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, err);
    return sendResp(resp, body);
  });
}