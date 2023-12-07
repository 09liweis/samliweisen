const { sendRequest, sendResp, sendErr } = require('../helpers/request');

const IMDB_BOXOFFICE = 'https://www.imdb.com/chart/boxoffice';

exports.getImdbBoxOffice = (req, resp) => {
  sendRequest({ url: IMDB_BOXOFFICE }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, err);
    }
    let boxOffice = {
      title: $('.chart-layout-specific-title-text').text(),
      date: $('.chart-layout-specific-title .ipc-title__description').text()
    }
    const jsonLdInfo = $('script[type="application/json"]').text();
    const json = JSON.parse(jsonLdInfo);
    const movies = json?.props?.pageProps?.pageData?.topGrossingReleases?.edges;
    boxOffice.movies = movies.map(({node})=>{
      const movie = node.release.titles[0];
      return {
        title: movie.titleText.text,
        original_title: movie.originalTitleText.text,
        poster: movie.primaryImage.url,
        imdb_rating: movie.ratingsSummary.aggregateRating,
        vote_count: movie.ratingsSummary.voteCount,
        summary: movie.plot.plotText.plainText,
        totalGross: movie.lifetimeGross.total.amount,
        currentGross: node.gross.total.amount
      }
    });
    return sendResp(resp, boxOffice);
  });
}