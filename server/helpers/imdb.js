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
    imdbObj.imdb_title = $('.cMYixt .fbOhB').text().trim();
    imdbObj.imdb_rating = $('.cMYixt .sc-7ab21ed2-1.jGRxWM').text() || 0;
    imdbObj.imdb_rating_count = $('.cMYixt .dPVcnq').text() || 0;
    imdbObj.poster = $('.ipc-image').attr('src');
    cb(null, imdbObj);
  });
}