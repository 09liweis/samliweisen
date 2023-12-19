//Blocked by maoyan
const { sendRequest, sendResp, sendErr } = require('../helpers/request');

exports.getMaoyan = (req, resp) => {
  const url = 'https://piaofang.maoyan.com/dashboard-ajax';
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    const movies = body.movieList.data.list.map((movie) => {
      return {
        title: movie.movieInfo.movieName,
        totalGross: movie.sumBoxDesc
      };
    })
    return sendResp(resp, { movies });
  });
}