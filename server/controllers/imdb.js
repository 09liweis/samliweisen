const { sendRequest, sendResp, sendErr } = require('../helpers/request');

const IMDB_BOXOFFICE = 'https://www.imdb.com/chart/boxoffice';

exports.getImdbBoxOffice = (req, resp) => {
  sendRequest({ url: IMDB_BOXOFFICE }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, err);
    }
    const chart = $('.ipc-metadata-list-summary-item');
    let boxOffice = {
      title: $('.chart-layout-specific-title-text').text(),
      date: $('.chart-layout-specific-title .ipc-title__description').text()
    }
    const jsonLdInfo = $('script[type="application/json"]').text();
    const json = JSON.parse(jsonLdInfo);
    boxOffice.movies = json?.props?.pageProps?.pageData?.topGrossingReleases;
    return sendResp(resp, boxOffice);
  });
}