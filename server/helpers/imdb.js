const {sendRequest} = require('./request');

const IMDB_SITE = 'https://www.imdb.com/title/';

function getImdbUrl(imdb_id) {
  return `${IMDB_SITE}${imdb_id}`;
}

exports.getImdbSummary = (imdb_id,cb) => {
  var url = getImdbUrl(imdb_id);
  sendRequest({url},function(err,{$}) {
    if (err) {
      return cb(err,null);
    }
    var imdbObj = {};
    imdbObj.imdb_title = $('.title_wrapper h1').text().trim();
    imdbObj.imdb_rating = $('span[itemprop="ratingValue"]').text() || 0;
    imdbObj.imdb_rating_count = $('span[itemprop="ratingCount"]').text() || 0;
    imdbObj.poster = $('.poster a img').attr('src');
    cb(null, imdbObj);
  });
}