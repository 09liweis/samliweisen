const { sendRequest, sendResp, sendErr } = require("../helpers/request");
const { getFullMovieDetail } = require("../helpers/douban");

const IMDB_BOXOFFICE = "https://www.imdb.com/chart/boxoffice";

function getCurrencyFormat(value) {
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

function getIMDBBoxOffice(moviesData, req) {
  const movies = [];
  moviesData.forEach(({ node }) => {
    try {
      const movieNode = node.release.titles[0];
      const movie = {
        imdb_id: movieNode.id,
        title: movieNode.titleText?.text,
        original_title: movieNode.originalTitleText?.text,
        poster: movieNode.primaryImage?.url,
        imdb_rating: movieNode.ratingsSummary?.aggregateRating,
        vote_count: movieNode.ratingsSummary?.voteCount,
        summary: movieNode?.plot?.plotText?.plainText,
        totalGross: getCurrencyFormat(movieNode.lifetimeGross.total.amount),
        currentGross: getCurrencyFormat(node.gross.total.amount),
      };
      movies.push(getFullMovieDetail(movie, { req }));
    } catch (error) {
      console.log(e);
    }
  });
  return movies;
}

exports.getImdbBoxOffice = (req, resp) => {
  sendRequest({ url: IMDB_BOXOFFICE }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, err);
    }
    const boxOffice = {
      title: $(".chart-layout-specific-title-text").text(),
      date: $(".chart-layout-specific-title .ipc-title__description").text(),
    };
    const jsonLdInfo = $('script[type="application/json"]').text();
    const json = JSON.parse(jsonLdInfo);
    const moviesData =
      json?.props?.pageProps?.pageData?.topGrossingReleases?.edges;
    boxOffice.movies = getIMDBBoxOffice(moviesData, req);
    return sendResp(resp, boxOffice);
  });
};
