const { sendRequest, sendResp, sendErr } = require('../helpers/request');

exports.getMaoyan = (req, resp) => {
  const url = 'https://piaofang.maoyan.com/dashboard-ajax';
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    const maoyanMovies = body?.movieList?.data?.list;
    if (!maoyanMovies) return sendErr(resp, { err: 'No Maoyan movies found' });
    const movies = maoyanMovies.map((movie) => {
      return {
        title: movie.movieInfo.movieName,
        totalGross: movie.sumBoxDesc
      };
    })
    return sendResp(resp, { movies });
  });
}