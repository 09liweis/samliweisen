const {router} = require('../helpers/router');

var request = require('request');
var cheerio = require('cheerio');

router.route('/yorkbbs').get((req, res) => {
  // x('http://news.yorkbbs.ca/local/', 'title')(function(err, title) {
  //     console.log(title);
  // });
  let type = req.query.type;
  type = type ? type : 'local';

  request({
    url:    'https://news.yorkbbs.ca/' + type,   // 请求的URL
    method: 'GET',                   // 请求方法
    headers: {                       // 指定请求头
        'Accept-Language': 'zh-CN,zh;q=0.8',         // 指定 Accept-Language
        'Accept-Charset': 'utf-8, iso-8859-1;q=0.5'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body.toString());
      var newslist = [];
      $('#content-list li').each(function() {
        const title = $(this).find('.title a').text();
        const link = $(this).find('.title a').attr('href');
        const image = $(this).find('.ig img').attr('src');
        const summary = $(this).find('dd .newslist-summary p').text();
        const date = $(this).find('.times').text();
        newslist.push({title,link,image,summary,date});
      });
      res.send(newslist);
    }
  });
});

module.exports = router;