const { sendRequest, sendResp, sendErr } = require("../helpers/request");
const {
  getDoubanUrl,
  DOUBAN_SITE_API,
  getPhotos,
  getComments,
  getDoubanPoster,
  getFullMovieDetail,
} = require("../helpers/douban");

const CAST_DOUBAN_URL = "https://www.douban.com/personage/";
const SORTS = ["recommend", "time", "rank"];

const NUM_LIMIT = 30;

exports.getAlltimeBoxOffice = (req, resp) => {
  let { page } = req.query;
  if (!page) {
    page = 1;
  }
  const start = 25 * (page - 1);
  const url = `https://www.douban.com/doulist/1641439/?start=${start}`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, { err: err.toString() });
    }
    const results = $.getNode(".doulist-item");
    const movies = results.toArray().map((movie) => {
      const movieNode = $.getNode(movie);
      return {
        title: movieNode.find(".title a").text(),
        douban_rating: movieNode.find(".rating_nums").text(),
        poster: getDoubanPoster(movieNode.find(".post img").attr("src")),
        release_date: movieNode.find(".abstract").html().split("<br>").pop(),
        totalGross: movieNode
          .find(".comment")
          .text()
          .replace("评语：", "")
          .trim(),
      };
    });
    return sendResp(resp, { movies });
  });
};

exports.getCurrentChinaBoxOffice = (req, resp) => {
  const url = "https://www.endata.com.cn/BoxOffice/BO/RealTime/reTimeBO.html";
};

exports.getCommingMovies = (req, resp) => {
  let { city } = req.query;
  city = city?.trim();
  if (!city) {
    city = "guangzhou";
  }
  const url = `https://movie.douban.com/cinema/later/${city}/`;
  sendRequest({ url }, function (err, { statusCode, $ }) {
    if (err) {
      return sendErr(resp, err);
    }
    const listItems = $.getNode("#showing-soon .item");
    var movies = [];
    if (listItems) {
      movies = listItems.toArray().map((item) => {
        const movieNode = $.getNode(item);
        var movieUrl = movieNode.find(".thumb").attr("href");
        var poster = movieNode.find(".thumb img").attr("src");
        let movie = {
          douban_id: movieUrl.split("/")[4],
          poster: getDoubanPoster(poster),
          title: movieNode.find(".intro h3 a").text(),
          release: movieNode.find("ul .dt:nth-child(1)").text(),
          category: movieNode.find("ul .dt:nth-child(2)").text(),
          country: movieNode.find("ul .dt:nth-child(3)").text(),
        };
        return getFullMovieDetail(movie, { req });
      });
    }
    return sendResp(resp, { city, movies });
  });
};

exports.getTags = (req, resp) => {
  let { type } = req.query;
  type = type || "movie";
  const url = `${DOUBAN_SITE_API}search_tags?type=${type}&source=`;
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    let tags = [];
    try {
      tags = body.tags;
    } catch (error) {
      console.error(error);
    }
    return sendResp(resp, { type, tags, sorts: SORTS });
  });
};

exports.getPopular = (req, resp) => {
  var { type, tag, page, limit = NUM_LIMIT, sort } = req.query;

  sort = sort || SORTS[0];
  type = type || "movie";
  tag = encodeURIComponent(tag || "热门");
  const page_start = (page - 1 || 0) * limit;
  const url = `${DOUBAN_SITE_API}search_subjects?sort=${sort}&type=${type}&tag=${tag}&page_limit=${limit}&page_start=${page_start}`;
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    var movies = body?.subjects || [];
    if (movies.length !== 0) {
      for (let i = 0; i < movies.length; i++) {
        const { cover, rate, id } = movies[i];
        movies[i].poster = getDoubanPoster(cover);
        movies[i].douban_rating = rate;
        movies[i].douban_id = id;
        delete movies[i].cover;
        delete movies[i].rate;
        delete movies[i].id;
        delete movies[i].cover_x;
        movies[i] = getFullMovieDetail(movies[i], { req });
      }
    }
    return sendResp(resp, {
      tag: decodeURIComponent(tag),
      movies,
      page,
      limit,
    });
  });
};

exports.getPhotos = (req, resp) => {
  //type S -> 剧照, R -> Poster
  const types = {
    S: "剧照",
    R: "海报",
    W: "壁纸",
  };
  const { douban_id } = req.params;
  var { page, type, cast_id } = req.query;
  if (!(douban_id || cast_id)) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  page = page || 1;
  if (douban_id) {
    var url = `${getDoubanUrl(douban_id, { apiName: "photos" })}`;
    type = type || "S";
  } else if (cast_id) {
    var url = `${CAST_DOUBAN_URL}${cast_id}/photos/`;
    type = type || "C";
  }
  url += `?type=${type}&start=${(page - 1) * NUM_LIMIT}`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    const title = $.getNodeText("#content h1");
    const photos = getPhotos($);
    return sendResp(resp, { title, photos, types, page, type });
  });
};

exports.getVideos = (req, resp) => {
  const { douban_id } = req.params;
  if (!douban_id) {
    return sendErr(resp, "No douban id");
  }
  const url = `https://movie.douban.com/subject/${douban_id}/trailer`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    const mods = $.getNode(".mod");
    const videos = mods.toArray().map((mod) => {
      const modNode = $.getNode(mod);
      const title = $.getNodeChildText(modNode, "h2");
      var videos = { title };
      videos.videos = $.getChildNodes(modNode, ".video-list li")
        .toArray()
        .map((v) => {
          const videoNode = $.getNode(v);
          var [, , , type, video_id] = $.getNodeChildAttr(
            videoNode,
            ".pr-video",
            "href",
          ).split("/");
          return {
            title: $.getNodeChildText(videoNode, "p:nth-child(2) a"),
            type,
            video_id,
            length: $.getNodeChildText(videoNode, ".pr-video em"),
            photo: $.getNodeChildAttr(videoNode, ".pr-video img", "src"),
            date: $.getNodeChildText(videoNode, ".trail-meta span"),
          };
        });
      return videos;
    });
    return sendResp(resp, { douban_id, videos });
  });
};

exports.getVideo = async (req, resp) => {
  var { video_id, tp } = req.params;
  if (!video_id) {
    return sendErr(resp, "No video id");
  }
  tp = tp || "trailer";
  var url = `https://movie.douban.com/${tp}/${video_id}`;
  try {
    const { $ } = await sendRequest({ url });
    var title = $.getNodeText("h1");
    console.log(title);
    var src = $.getAttr("video source", "src");
    var comments = getComments($);
    return sendResp(resp, { title, src, comments });
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

function getWorks($, worksName) {
  var works = [];
  const worksMatch = $(`#${worksName} .list-s li`);
  if (worksMatch) {
    works = worksMatch.toArray().map((r) => {
      const work = $(r);
      var workDoubanUrl = work.find(".info a").attr("href");
      if (workDoubanUrl) {
        var douban_id = workDoubanUrl.split("/")[4];
      }
      return {
        img: work.find(".pic img").attr("src"),
        title: work.find(".info a").text(),
        douban_id,
        rating: work.find(".info em").text(),
      };
    });
  }
  return works;
}

exports.getCast = (req, resp) => {
  const { cast_id } = req.params;
  const url = `${CAST_DOUBAN_URL}${cast_id}/`;
  sendRequest({ url }, (err, { $ }) => {
    const infoMatch = $(".subject-property li");
    const infos = {};
    if (infoMatch) {
      for (let i = 0; i < infoMatch.length; i++) {
        var [key, val] = $(infoMatch[i]).text().trim().split(": ");
        infos[key] = val;
      }
    }
    const photosMatch = $("#photos li a");
    if (photosMatch) {
      var photos = photosMatch
        .toArray()
        .map((p) => $(p).find("img").attr("src"));
    }

    sendResp(resp, {
      cast_id,
      infos,
      name: $("#content h1").text(),
      poster: $("#headline .pic a img").attr("src"),
      summary: $("#intro .all.hidden").text().trim(),
      photos,
      recent_works: getWorks($, "recent_movies"),
      best_works: getWorks($, "best_movies"),
    });
  });
};
