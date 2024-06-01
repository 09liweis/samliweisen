const { sendRequest, sendResp, sendErr } = require("../helpers/request");
const {
  getDoubanUrl,
  getReviews,
  getComments,
  getCast,
  getDoubanPoster,
  getFullMovieDetail,
  getMovieYear,
} = require("../helpers/douban");
const { getImdbSummary } = require("../helpers/imdb");
const Movie = require("../models/movie");
const ModelFacade = require("../models/modelFacade");
const movieModel = new ModelFacade(Movie);

const MISSING_DOUBAN_ID = "Missing Douban Id";
const MOVIE_NOT_FOUND = "Movie Not Found";
const DOUBAN_CHART_URL = "https://movie.douban.com/chart";
const DOUBAN_INTHEATRE_URL = "https://movie.douban.com/cinema/nowplaying/";

function getSearchQuery(query) {
  let {
    page = 1,
    limit = 10,
    current_episode,
    type,
    lang,
    genre,
    country,
    search,
  } = query;
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  if (lang) {
    filter.languages = lang;
  }
  if (genre) {
    filter.genres = genre;
  }
  if (country) {
    filter.countries = country;
  }
  if (current_episode) {
    filter.current_episode = current_episode;
  }
  if (type) {
    filter.visual_type = type;
  }
  return { filter, skip, limit, page };
}

exports.samVisuals = async (req, resp) => {
  const { filter, skip, limit, page } = getSearchQuery(req.query);
  let movies = [];
  let total = 0;
  try {
    total = await movieModel.countDocuments(filter);
    const options = { skip, limit, sort: "-date_updated" };
    movies = await movieModel.findList(filter, options);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
  movies = movies.map((m) => {
    const movie = { ...m._doc };
    return getFullMovieDetail(movie, { req });
  });
  const pages = Array(Math.ceil(total / limit))
    .fill()
    .map((v, i) => i + 1);
  return sendResp(resp, { total, page, pages, movies });
};

async function getMovieByDoubanId(douban_id) {
  return await movieModel.findOne({ douban_id });
}

exports.getMovieDetail = async (req, resp) => {
  let { douban_id } = req.params;
  douban_id = douban_id.trim();
  if (!douban_id) {
    return sendErr(resp, { msg: MISSING_DOUBAN_ID, douban_id });
  }
  try {
    const movie = await getMovieByDoubanId(douban_id);
    if (movie) {
      return sendResp(resp, { movie: getFullMovieDetail(movie, { req }) });
    } else {
      return sendErr(resp, { err: MOVIE_NOT_FOUND, douban_id });
    }
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

exports.updateSamMovie = async (req, resp) => {
  try {
    const { douban_id } = req.params;
    const foundMovie = await getMovieByDoubanId(douban_id);
    if (!foundMovie) {
      return sendErr(resp, { err: MOVIE_NOT_FOUND, douban_id });
    }

    const update = {
      date_updated: new Date(),
    };
    if (foundMovie.current_episode < foundMovie.episodes) {
      update.current_episode = foundMovie.current_episode + 1;
    } else {
      update.current_episode = getDefaultEpisodes(foundMovie.episodes);
    }
    const movie = await movieModel.updateOne({ douban_id }, update);
    return sendResp(resp, movie);
  } catch (updateSamMovieErr) {
    return sendErr(resp, {
      err: `updateSamMovieErr: ${updateSamMovieErr.toString()}`,
      douban_id,
    });
  }
};

exports.getDoubanChart = (req, resp) => {
  sendRequest({ url: DOUBAN_CHART_URL }, function (err, { $ }) {
    if (err) return sendErr(resp, { err: err.toString() });
    const listItems = $.getNode(".item");
    const movies = [];
    if (listItems) {
      for (let i = 0; i < listItems.length; i++) {
        const item = $.getNode(listItems[i]);
        const linkArray = item.find(".nbg").attr("href").split("/");
        const movie = {
          douban_id: linkArray[4],
          poster: getDoubanPoster(item.find("img").attr("src")),
          title: item.find(".pl2 a").text().trim(),
          douban_rating: item.find(".rating_nums").text(),
        };
        movies.push(getFullMovieDetail(movie, { req }));
      }
    }
    return sendResp(resp, { movies });
  });
};

exports.inTheatre = (req, resp) => {
  let { city } = req.query;
  city = city?.trim();
  if (!city) {
    city = "guangzhou";
  }
  sendRequest({ url: `${DOUBAN_INTHEATRE_URL}${city}` }, function (err, { $ }) {
    if (err) return sendErr(resp, { err: err.toString() });
    const listItems = $.getNode(".list-item");
    const movies = [];
    if (listItems) {
      const dataNames = [
        "title",
        "release",
        "actors",
        "director",
        "duration",
        "category",
      ];
      for (let i = 0; i < listItems.length; i++) {
        const item = $.getNode(listItems[i]);
        const movie = {
          douban_id: item.attr("id"),
          poster: item.find("img").attr("src"),
          douban_rating: parseFloat(item.attr("data-score")),
        };
        dataNames.forEach((name) => {
          movie[name] = item.attr(`data-${name}`);
        });
        movies.push(getFullMovieDetail(movie, { req }));
      }
    }
    return sendResp(resp, { city, movies });
  });
};

exports.getHongkong = (req, resp) => {
  let { name = "showing" } = req.params;
  if (!["showing", "coming"].includes(name)) {
    return sendErr(resp, { err: "Invalid api name" });
  }
  sendRequest({ url: `https://hkmovie6.com/${name}` }, function (err, { $ }) {
    if (err) return sendErr(resp, { err: err.toString() });
    const movieResults = $.getNode(".shows .movie.show");
    let movies = [];
    if (movieResults) {
      movies = movieResults.toArray().map((m) => {
        const movie = $.getNode(m);
        const poster = movie.find("img").attr("src");
        const video = movie.find("video").attr("src");
        const title = movie.find(".name").text();
        const release = movie.find(".comingTitle").text();
        if (video) {
          return { title, release, video };
        } else {
          return { title, release, poster };
        }
      });
    }
    return sendResp(resp, { movies });
  });
};

exports.getTaiwan = (req, resp) => {
  let { name } = req.params;
  name = name === "showing" ? "1" : "0";
  sendRequest(
    {
      url: "https://www.ambassador.com.tw/home/MovieList?Type=1",
    },
    function (err, { $ }) {
      let movies = [];
      const movieResults = $.getNode(".movie-list .cell");
      if (movieResults) {
        movies = movieResults.toArray().map((m) => {
          const movie = $.getNode(m);
          return {
            title: movie.find(".title h6").text(),
            original_title: movie.find(".show-for-large").text(),
            poster: movie.find("img").attr("src"),
            date: movie.find(".date").text(),
          };
        });
      }
      return sendResp(resp, { movies });
    },
  );
};

exports.getCineplex = (req, resp) => {
  sendRequest(
    {
      url: "https://apis.cineplex.com/prod/cpx/theatrical/api/v1/movies/bookable?language=en",
    },
    function (err, { body }) {
      if (err) return sendErr(resp, { err: err.toString() });
      let movies = [];
      if (body && Array.isArray(body)) {
        movies = body.map((m) => {
          return {
            title: m.name,
            poster: m.mediumPosterImageUrl,
          };
        });
      }
      return sendResp(resp, { movies });
    },
  );
};

exports.search = (req, resp) => {
  let { keyword } = req.query;
  keyword = keyword?.trim();
  if (!keyword) {
    return sendErr(resp, { msg: "No Keyword" });
  }
  const url = `https://m.douban.com/search/?query=${encodeURIComponent(
    keyword,
  )}&type=1002`;
  sendRequest({ url }, function (err, { $ }) {
    const results = $.getNode(".search_results_subjects a");
    if (results) {
      var movies = results.toArray().map((r) => {
        const visual = $.getNode(r);
        const [, , , douban_id] = visual.attr("href").split("/");
        const movie = {
          douban_id,
          poster: visual.find("img").attr("src"),
          title: visual.find(".subject-title").text(),
          douban_rating: visual.find(".rating span:nth-child(2)").text(),
        };
        return getFullMovieDetail(movie, { req });
      });
    }
    sendResp(resp, { keyword, movies });
  });
};

exports.getCelebrities = (req, resp) => {
  const { douban_id } = req.params;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: "celebrities" });
  sendRequest({ url: douban_url }, function (err, { statusCode, $, body }) {
    const castsMatches = $.getNode(".list-wrapper");
    let casts = castsMatches.toArray().map((c) => {
      const castSection = $.getNode(c);
      let castTl = castSection.find("h2").text();
      const castsMatch = castSection.find(".celebrity");
      let casts = castsMatch.toArray().map((c) => getCast($.getNode(c), $));
      return { tl: castTl, casts };
    });
    sendResp(resp, { douban_url, casts });
  });
};

exports.getPhotoDetail = (req, resp) => {
  const { photo_id } = req.params;
  if (!photo_id) {
    return resp.json({ msg: "No Photo Id" });
  }
  const douban_url = `https://movie.douban.com/photos/photo/${photo_id}`;
  sendRequest({ url: douban_url }, (err, { $ }) => {
    const commentsMatch = $.getNode(".comment-item");
    const uploader = $.getNodeText(".poster-info li:nth-child(5) a");
    const upload_date = $.getNodeText(".poster-info li:nth-child(6)");
    if (commentsMatch) {
      var comments = commentsMatch.toArray().map((c) => {
        const comment = $.getNode(c);
        return {
          src: comment.find("img").attr("src"),
          date: comment.find(".author span").text(),
          author: comment.find(".author a").text(),
          content: comment.find("p").text(),
        };
      });
    }
    sendResp(resp, { uploader, upload_date, comments });
  });
};

exports.getComments = (req, resp) => {
  const { douban_id } = req.params;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: "comments" });
  sendRequest({ url: douban_url }, (err, { statusCode, $, body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    const comments = getComments($);
    return sendResp(resp, { comments });
  });
};

exports.getReviews = async (req, resp) => {
  let { douban_id } = req.params;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: "reviews" });
  try {
    const { $ } = await sendRequest({ url: douban_url });
    const reviews = getReviews($);
    return sendResp(resp, { reviews });
  } catch (err) {
    return sendErr(resp, { err: er.toString() });
  }
};

exports.getSummary = async (req, resp) => {
  let { douban_id } = req.params;
  if (douban_id) {
    douban_id = douban_id.trim();
  }
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  try {
    const visual = await getDoubanMovieSummary(douban_id);
    return sendResp(resp, getFullMovieDetail(visual, { req }));
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

const handleDoubanMovieSummary = ({ $, body }) => {
  const genresMatch = $.getNode('span[property="v:genre"]');
  if (genresMatch) {
    var genres = genresMatch.toArray().map((g) => $.getNodeText(g));
  }

  const recommendsMatch = $.getNode(".recommendations-bd dl");
  if (recommendsMatch) {
    var recommends = recommendsMatch.toArray().map((r) => {
      var recommend = $.getNode(r);
      var url = recommend.find("dd a").attr("href");
      if (url) {
        var douban_id = url.split("/")[4];
      }
      return {
        douban_rating: recommend.find(".subject-rate").text(),
        poster: recommend.find("dt img").attr("src"),
        title: recommend.find("dd a").text(),
        douban_id,
      };
    });
  }

  const photosMatch = $.getNode(".related-pic-bd li");
  if (photosMatch) {
    var photos = photosMatch.toArray().map((p) => {
      const media = $.getNode(p);
      let tp = "photo";
      let src = media.find("img").attr("src");
      let href = media.find("a").attr("href");
      const mediaType = media.attr("class");
      if (mediaType) {
        tp = mediaType.replace("label-", "");
        var imgStyle = media.find("a").attr("style");
        var imgMatches = /url\((.*?)\)/g.exec(imgStyle);
        if (imgMatches) {
          src = imgMatches[1];
        }
      }
      return { tp, src, href };
    });
  }

  const awardsMatch = $.getNode(".award");
  if (awardsMatch) {
    var awards = awardsMatch.toArray().map((a) => {
      return {
        nm: $.getNode(a).find("li:first-child a").text(),
        award: $.getNode(a).find("li:nth-child(2)").text(),
      };
    });
  }

  const castMatches = $.getNode(".celebrity");
  if (castMatches) {
    var casts = castMatches.toArray().map((c) => getCast($.getNode(c), $));
  }

  var websiteMatch = /官方网站:<\/span>(.*?)<br\/>/g.exec(body);
  if (websiteMatch) {
    var website = $.getNodeText(websiteMatch[1]).trim();
    if (website.indexOf("http") == -1) {
      website = `https://${website}`;
    }
  }
  var originalTitleMatch = /又名:<\/span>(.*?)<br\/>/g.exec(body);
  if (originalTitleMatch) {
    var original_title = originalTitleMatch[1].trim();
  }

  const seasonMatch = /季数:<\/span>(.*?)<br\/>/g.exec(body);
  if (seasonMatch) {
    var season = seasonMatch[1].trim();
    //if season is null, try to get select tag of season
    if (isNaN(season)) {
      season = $.getNodeText("#season option[selected]");
    }
    try {
      season = parseInt(season);
    } catch (seasonError) {
      console.error(`Season parse error: ${seasonError}`);
    }
  }

  var episodesMatch = /集数:<\/span>(.*?)<br\/>/g.exec(body);
  if (episodesMatch) {
    var episodes = parseInt(episodesMatch[1].trim());
  }

  var durationMatch = /单集片长:<\/span>(.*?)<br\/>/g.exec(body);
  let duration = $.getAttr('span[property="v:runtime"]', "content");
  if (durationMatch) {
    duration = durationMatch[1].trim();
  }

  var langsMatch = /语言:<\/span>(.*?)<br\/>/g.exec(body);
  if (langsMatch) {
    var languages = langsMatch[1].trim().split(" / ");
  }

  var countryMatch = /制片国家\/地区:<\/span>(.*?)<br\/>/g.exec(body);
  if (countryMatch) {
    var countries = countryMatch[1].trim().split(" / ");
  }

  const imdbMatches = body.match(/tt[\d]{7,8}/g);
  const imdb_id = imdbMatches?.length ? imdbMatches[0] : "";

  //2018-03-16(美国/中国大陆)
  const dateMatches = body.match(
    /[\d]{4}-[\d]{2}-[\d]{2}\([\u4e00-\u9fff\/]+\)/g,
  );
  const dates = [...new Set(dateMatches)];

  return {
    // douban_url,
    title: $.getNodeText('span[property="v:itemreviewed"]'),
    original_title,
    poster: $.getAttr('img[rel="v:image"]', "src"),
    douban_rating: parseFloat(
      $.getNodeText('strong[property="v:average"]') || 0,
    ),
    douban_vote_count: parseInt($.getNodeText('span[property="v:votes"]')),
    genres,
    website,
    duration,
    episodes: getDefaultEpisodes(episodes),
    season,
    visual_type: episodes > 1 ? "tv" : "movie",
    photos,
    awards,
    languages,
    countries,
    summary: $.getNodeText('span[property="v:summary"]').trim(),
    casts,
    release_dates: dates,
    year: getMovieYear(dates),
    recommends,
    reviews: getReviews($),
    comments: getComments($),
    imdb_id,
  };
};

const getDoubanMovieSummary = async (douban_id) => {
  const douban_url = getDoubanUrl(douban_id);
  try {
    const resp = await sendRequest({ url: douban_url });
    let visual = handleDoubanMovieSummary(resp);
    visual.douban_id = douban_id;
    const imdb_id = visual.imdb_id;
    if (!imdb_id) {
      return visual;
    }
    //handle scraping imdb data
    const imdbObj = await getImdbSummary(imdb_id);
    visual = Object.assign(visual, imdbObj);
    return visual;
  } catch (err) {
    return err;
  }
};

exports.upsertVisual = async (req, resp) => {
  //35376457
  var { douban_id } = req.body;
  if (!douban_id) {
    return sendErr(resp, { msg: MISSING_DOUBAN_ID, body: req.body });
  }
  try {
    const movie = await getDoubanMovieSummary(douban_id);
    if (!movie.douban_id) {
      return sendErr(resp, { msg: "Can not get movie" });
    }
    const oldMovie = await movieModel.findOne({ douban_id });
    if (!oldMovie) {
      movie.date_watched = new Date();
    }
    movie.date_updated = new Date();
    const newMovie = await movieModel.findOneAndUpdate({ douban_id }, movie, {
      upsert: true,
    });
    return sendResp(resp, movie);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

async function getRandomMovieDB() {
  try {
    const count = await movieModel.countDocuments();
    var random = Math.floor(Math.random() * count);
    const movie = await movieModel.findOne(null, { skip: random });
    return movie;
  } catch (err) {
    return err;
  }
}

exports.getRandomMovie = async (req, resp) => {
  try {
    const movie = await getRandomMovieDB();
    return sendResp(resp, movie);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

exports.updateRandomMovie = async (req, resp) => {
  try {
    const movie = await getRandomMovieDB();
    const latestMovie = await getDoubanMovieSummary(movie.douban_id);
    const result = await movieModel.updateOne(
      { douban_id: movie.douban_id },
      latestMovie,
    );
    if (result.acknowledged) {
      console.info(movie.title, movie.douban_id, "updated");
      return sendResp(resp, latestMovie);
    } else {
      console.error(result, movie.douban_id);
      return sendResp(resp, result);
    }
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};
