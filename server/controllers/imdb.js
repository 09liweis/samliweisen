const { sendRequest, sendResp, sendErr } = require("../helpers/request");
const { getCurrencyFormat } = require("../helpers/imdb");
const { getFullMovieDetail } = require("../helpers/douban");

const IMDB_BOXOFFICE = "https://www.imdb.com/chart/boxoffice";

function getBoxOfficeMovie(moviesData, req) {
  const movies = [];
  moviesData.forEach(({ node }) => {
    try {
      const movieNode = node?.release?.titles[0];
      if (!movieNode) {
        return;
      }
      const movie = {
        imdb_id: movieNode.id,
        original_url: `https://www.imdb.com/title/${movieNode.id}`,
        title: movieNode.titleText?.text,
        original_title: movieNode.originalTitleText?.text,
        poster: movieNode.primaryImage?.url,
        imdb_rating: movieNode.ratingsSummary?.aggregateRating,
        vote_count: movieNode.ratingsSummary?.voteCount,
        summary: movieNode?.plot?.plotText?.plainText,
        totalGross: getCurrencyFormat(movieNode.lifetimeGross?.total?.amount),
        currentGross: getCurrencyFormat(node.gross?.total?.amount),
      };
      movies.push(getFullMovieDetail(movie, { req }));
    } catch (error) {
      console.error(e);
    }
  });
  return movies;
}

const getPopularMovie = (moviesData, req) => {
  return moviesData.map(({ node }) => {
    return {
      imdb_id: node.id,
      original_url: `https://www.imdb.com/title/${node.id}`,
      title: node.titleText?.text,
      original_title: node.originalTitleText?.text,
      poster: node.primaryImage?.url,
      imdb_rating: node.ratingsSummary?.aggregateRating,
      vote_count: node.ratingsSummary?.voteCount,
      release: getPoularMovieReleaseDate(node.releaseDate),
    }
  });
}

const getPoularMovieReleaseDate = (releaseDate) => {
  if (!releaseDate) return "";
  const {day, month, year} = releaseDate;
  return `${year}-${month}-${day}`;
}

const getCalendarMovie = (moviesData, req) => {
  const movies = [];
  moviesData.forEach(({group, entries}) => {
    entries.forEach((entry) => {
      movies.push({
        imdb_id: entry.id,
        original_url: `https://www.imdb.com/title/${entry.id}`,
        title: entry.titleText,
        poster: entry.imageModel?.url,
        release: new Date(entry.releaseDate).toDateString(),
      });
    })
  });
  return movies;
}

exports.getImdbBoxOffice = async (req, resp) => {
  let { name } = req.params;
  const map = {
    boxoffice: IMDB_BOXOFFICE,
    popular: "https://www.imdb.com/chart/moviemeter/",
    calendar: "https://www.imdb.com/calendar/"
  };

  const { $ } = await sendRequest({ url: map[name] });
  const boxOffice = {
    title: $.getNodeText(".chart-layout-specific-title-text"),
    date: $.getNodeText(".chart-layout-specific-title .ipc-title__description"),
  };
  const jsonLdInfo = $.getNodeText('script[type="application/json"]');
  const json = JSON.parse(jsonLdInfo);

  let moviesData = [];
  if (name === "boxoffice") {
    moviesData = json?.props?.pageProps?.pageData?.topGrossingReleases?.edges;
    boxOffice.movies = getBoxOfficeMovie(moviesData, req);
  } else if (name === "popular") {
    moviesData = json?.props?.pageProps?.pageData?.chartTitles?.edges;
    boxOffice.movies = getPopularMovie(moviesData, req);
  } else if (name === "calendar") {
    moviesData = json?.props?.pageProps?.groups;
    boxOffice.movies = getCalendarMovie(moviesData, req);
  }
  
  return sendResp(resp, boxOffice);
};