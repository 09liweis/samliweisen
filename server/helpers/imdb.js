const { sendRequest } = require("./request");

const IMDB_SITE = "https://www.imdb.com/title/";

/**
 * @param {number} value
 * @return {string} Return formatted amount
 */
exports.getCurrencyFormat = (value) => {
  if (!value) return value;
  if (typeof value !== "number") {
    return value;
  }
  var suffixes = ["", "K", "M", "B", "T"];
  var suffixNum = Math.floor(("" + value).length / 3);
  var shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2),
  );
  if (shortValue % 1 != 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
}

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
    const imdbObj = {};
    const jsonLdInfo = $.getNodeText("#__NEXT_DATA__");
    const parseJSONInfo = JSON.parse(jsonLdInfo);
    const { aboveTheFoldData, mainColumnData } = parseJSONInfo.props.pageProps;
    const {
      titleText: { text },
      // certificate: { rating = "" },
      ratingsSummary: { aggregateRating },
      primaryImage: { url: image },
      plot: {
        plotText: { plainText },
      },
      genres: { genres },
    } = aboveTheFoldData;
    const imdbVideos = mainColumnData?.videoStrip?.edges;
    imdbObj.budget = mainColumnData?.productionBudget?.budget?.amount;
    imdbObj.imdb_title = text;
    imdbObj.imdb_rating = aggregateRating;
    imdbObj.imdb_poster = image;
    imdbObj.imdb_description = plainText;
    imdbObj.imdb_genres = genres.map((genre) => genre.text);
    imdbObj.totalGross = mainColumnData?.worldwideGross?.total?.amount;
    return imdbObj;
  } catch (err) {
    throw err;
  }
};
