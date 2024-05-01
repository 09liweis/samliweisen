const { sendRequest } = require("./request");

const IMDB_SITE = "https://www.imdb.com/title/";

/**
 * Get imdb url with imdb_id
 * @param {string} imdb_id
 * @returns string imdb url
 */
function getImdbUrl(imdb_id) {
  return `${IMDB_SITE}${imdb_id}`;
}

exports.getImdbSummary = async (imdb_id) => {
  var url = getImdbUrl(imdb_id);
  try {
    const { $ } = await sendRequest({ url });
    var imdbObj = {};
    const jsonLdInfo = $('script[type="application/ld+json"]').text();
    const parseJSONInfo = JSON.parse(jsonLdInfo);
    // console.log(parseJSONInfo);
    const { name, image, description, aggregateRating, genre } = parseJSONInfo;
    imdbObj.imdb_title = name;
    imdbObj.imdb_rating = aggregateRating?.ratingValue;
    imdbObj.imdb_poster = image;
    imdbObj.imdb_description = description;
    imdbObj.imdb_genres = genre;
    return imdbObj;
  } catch (err) {
    return err;
  }
};
