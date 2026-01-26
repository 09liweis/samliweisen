const { sendRequest, sendResp, sendErr } = require("../../helpers/request");

exports.getCineplex = (req, resp) => {
  sendRequest(
    {
      url: "https://apis.cineplex.com/prod/cpx/theatrical/api/v1/movies/bookable?language=en",
      headers: {
        "Ocp-Apim-Subscription-Key": "dcdac5601d864addbc2675a2e96cb1f8",
      }
    },
    function (err, data) {
      if (err) return sendErr(resp, { err: err.toString() });
      const { body } = data;
      let movies = [];
      if (body && Array.isArray(body)) {
        movies = body.map((m) => {
          return {
            title: m.name,
            poster: m.mediumPosterImageUrl,
            release: m.releaseDate.substr(0, 10),
            genres: m.genres,
            original_url: `https://www.cineplex.com/en/movie/${m.filmUrl}`
          };
        });
      }
      return sendResp(resp, { movies });
    },
  );
};