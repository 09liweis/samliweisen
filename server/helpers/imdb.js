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
    const jsonLdInfo = $("#__NEXT_DATA__").text();
    const parseJSONInfo = JSON.parse(jsonLdInfo);
    const { aboveTheFoldData, mainColumnData } = parseJSONInfo.props.pageProps;
    const {
      titleText: { text },
      certificate: { rating },
      ratingsSummary: { aggregateRating },
      primaryImage: { url: image },
      plot: {
        plotText: { plainText },
      },
      genres: { genres },
    } = aboveTheFoldData;
    imdbObj.imdb_title = text;
    imdbObj.imdb_rating = aggregateRating;
    imdbObj.imdb_poster = image;
    imdbObj.imdb_description = plainText;
    imdbObj.imdb_genres = genres.map((genre) => genre.text);
    imdbObj.certificate = rating;
    return imdbObj;
  } catch (err) {
    return err;
  }
};
