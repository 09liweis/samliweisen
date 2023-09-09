const { sendRequest } = require('./request');

const IMDB_SITE = 'https://www.imdb.com/title/';

function getImdbUrl(imdb_id) {
  return `${IMDB_SITE}${imdb_id}`;
}

exports.getImdbSummary = (imdb_id, cb) => {
  var url = getImdbUrl(imdb_id);
  sendRequest({ url }, function(err, { $, body }) {
    if (err) {
      return cb(err, {});
    }
    var imdbObj = {};
    const jsonLdInfo = $('script[type="application/ld+json"]').text();
    try {
      const parseJSONInfo = JSON.parse(jsonLdInfo);
      // console.log(parseJSONInfo);
      const { name, image, description, aggregateRating } = parseJSONInfo;
      imdbObj.imdb_title = name;
      imdbObj.imdb_rating = aggregateRating?.ratingValue;
      imdbObj.imdb_poster = image;
      imdbObj.imdb_description = description;
    } catch (parseErr) {
      console.error(parseErr);
    }
    cb(null, imdbObj);
  });
}