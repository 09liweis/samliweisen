const { sendRequest, sendResp, sendErr } = require('../helpers/request');

exports.getBilibili = (req, resp) => {
  const userId = '19524235';
  const url = `https://api.bilibili.com/x/space/wbi/arc/search?mid=${userId}&ps=30&tid=0&pn=1&keyword=&order=pubdate&platform=web&web_location=1550101&order_avoided=true&w_rid=f528bdb22436fc1377cc3100038122aa&wts=1686749932`;
  sendRequest({ url }, (err, { body }) => {
    var bVideos = [];
    if (body.data?.list) {
      bVideos = body.data?.list?.vlist;
    }
    return sendResp(resp, bVideos);
  });
}