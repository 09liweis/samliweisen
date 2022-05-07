const {sendRequest, sendResp, sendErr} = require('../helpers/request');

exports.getBilibili = (req,resp) => {
  const userId = '19524235';
  const url = `https://api.bilibili.com/x/space/arc/search?mid=${userId}&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp`;
  sendRequest({url},(err,{body}) => {
    var bVideos = [];
    if (body.data.list) {
      bVideos = body.data.list.vlist;
    }
    return sendResp(resp,bVideos);
  });
}