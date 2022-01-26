const {sendRequest} = require('./request');

const IMDB_SITE = 'https://www.imdb.com/title/';

function getImdbUrl(imdb_id) {
  return `${IMDB_SITE}${imdb_id}`;
}

exports.getImdbSummary = (imdb_id,cb) => {
  var url = getImdbUrl(imdb_id);
  sendRequest({url},function(err,{$,body}) {
    if (err) {
      return cb(err,{});
    }
    var imdbObj = {};
    imdbObj.imdb_title = $('.TitleHeader__TitleText-sc-1wu6n3d-0').text().trim();
    imdbObj.imdb_rating = $('.Hero__MetaContainer__Video-sc-kvkd64-4 .AggregateRatingButton__RatingScore-sc-1ll29m0-1').text() || 0;
    imdbObj.imdb_rating_count = $('.Hero__MetaContainer__Video-sc-kvkd64-4 .AggregateRatingButton__TotalRatingAmount-sc-1ll29m0-3').text() || 0;
    imdbObj.poster = $('.ipc-image').attr('src');
    cb(null, imdbObj);
  });
}