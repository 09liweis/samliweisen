const DOUBAN_SITE = "https://movie.douban.com/subject/";

exports.DOUBAN_SITE_API = "https://movie.douban.com/j/";

/** 
 * Get formated duration of a movie

 * @param {string} duration - movie duration
 * @returns {string} formated duration

 * @example
 * formatDuration('45') => '45:00'
 * formatDuration('125') // => '2:02:00'
*/
function formatDuration(duration) {
  if (!duration) return;
  try {
    duration = parseInt(duration);
  } catch (durationErr) {
    console.error(durationErr);
    return duration;
  }
  const defaultMins = ":00";
  if (duration < 60) {
    return duration + defaultMins;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}${defaultMins}`;
}

/** 
 * Get movie episodes or 1

 * @param {number|null} episodes - movie episodes
 * @returns {number} episodes or 1

 * @example
 * getDefaultEpisodes(3) => 3
 * getDefaultEpisodes(null) => 1
*/
exports.getDefaultEpisodes = getDefaultEpisodes = (episodes) => {
  return episodes || 1;
};

exports.getFullMovieDetail = (movie, { req }) => {
  movie.episodes = getDefaultEpisodes(movie?.episodes);
  if (movie?.poster?.includes("doubanio")) {
    movie.poster = getDoubanPoster(movie.poster, req);
  }

  const imdb_rating = movie.imdb_rating || 0;
  movie.imdb_rating = imdb_rating.toFixed(1);

  const douban_rating = movie.douban_rating || 0;
  if (typeof douban_rating === "number") {
    movie.douban_rating = douban_rating.toFixed(1);
  }

  if (movie.duration) {
    movie.duration = formatDuration(movie.duration);
  }

  if (movie?.douban_id) {
    movie.apis = getDoubanMovieAPIs({
      douban_id: movie.douban_id,
      protocol: req.protocol,
      host: req.hostname,
    });
  }
  return movie;
};

exports.getDoubanMovieAPIs = getDoubanMovieAPIs = ({
  protocol,
  host,
  douban_id,
}) => {
  return {
    summary: `https://${host}/api/movies/douban/${douban_id}`,
    reviews: `https://${host}/api/movies/douban/${douban_id}/reviews`,
    comments: `https://${host}/api/movies/douban/${douban_id}/comments`,
    casts: `https://${host}/api/movies/douban/${douban_id}/casts`,
    photos: `https://${host}/api/movies/douban/${douban_id}/photos`,
    videos: `https://${host}/api/movies/douban/${douban_id}/videos`,
  };
};

exports.getPhotos = ($) => {
  const photosMatch = $(".poster-col3 li");
  var photos = [];
  if (photosMatch) {
    for (let i = 0; i < photosMatch.length; i++) {
      const photo = $(photosMatch[i]);
      const href = photo.find("a").attr("href").split("/");
      if (href && href.length > 5) {
        var photo_id = href[5];
      }
      photos.push({
        thumb: photo.find("img").attr("src"),
        origin: `https://img9.doubanio.com/view/photo/l/public/p${photo_id}.jpg`,
        name: photo.find(".name").text().trim(),
        prop: photo.find(".prop").text().trim(),
        photo_id,
      });
    }
  }
  return photos;
};

/**
 * @param {string} douban_id
 * @param {object} opt
 * @return {string}
 */
exports.getDoubanUrl = (douban_id, opt = {}) => {
  let endPoint = opt.apiName || "";
  return `${DOUBAN_SITE}${douban_id}/${endPoint}`;
};

exports.getDoubanPoster = getDoubanPoster = (poster, opt = {}) => {
  //img2 domain works on browser without 403
  //not working for web browser, but work for app https://img2.doubanio.com/view/photo/s_ratio_poster/public/
  //https://img1.doubanio.com/view/photo/sqxs/public/
  // return poster;
  const imgServer = opt?.query?.imgserver;
  if (imgServer) {
    return poster.replace(/img[1-9]/g, imgServer);
  } else {
    return poster;
  }
};

function getAvtUrl(element) {
  var avtStyle = element.find("div.avatar").attr("style");
  var avtMatches = /url\((.*?)\)/g.exec(avtStyle);
  let avt = avtMatches ? avtMatches[1] : "";
  return avt;
}

exports.getCast = (cast, $) => {
  const worksMatch = cast.find(".works a");
  let works = [];
  if (worksMatch) {
    for (let i = 0; i < worksMatch.length; i++) {
      const work = $(worksMatch[i]);
      works.push({
        url: work.attr("href"),
        tl: work.attr("title"),
      });
    }
  }
  const name = cast.find("a.name");
  const href = name.attr("href");
  var id;
  if (href) {
    const hrefArray = href.split("/");
    id = hrefArray[hrefArray.length - 2];
  }
  return {
    id,
    name: name.text(),
    avt: getAvtUrl(cast),
    role: cast.find(".role").text(),
    works,
  };
};

exports.getReviews = ($) => {
  const reviewsMatch = $(".main.review-item");
  var reviews = [];
  if (!reviewsMatch) {
    return reviews;
  }
  reviewsMatch.toArray().forEach((item) => {
    var review = $(item);
    var rating = review.find(".main-title-rating").attr("class");
    if (typeof rating == "string") {
      try {
        rating = rating
          .replace("main-title-rating", "")
          .replace("allstar", "")
          .trim();
        rating = parseFloat(rating) / 10;
      } catch (error) {
        rating = "N/A";
        console.error(error);
      }
    }
    reviews.push({
      review_id: review.find(".review-short").attr("data-rid"),
      title: review.find("h2 a").text(),
      content: review.find(".short-content").text(),
      author: review.find(".name").text(),
      avt: review.find(".avator img").attr("src"),
      rating,
      date: review.find(".main-meta").text(),
      usefull_count: review.find(".action-btn.up span").text().trim(),
      useless_count: review.find(".action-btn.down span").text().trim(),
      reply_count: review.find(".reply").text(),
    });
  });
  return reviews;
};

exports.getComments = ($) => {
  const commentsMatch = $(".comment-item");
  var comments = [];
  if (!commentsMatch) {
    return comments;
  }
  for (var i = 0; i < commentsMatch.length; i++) {
    var comment = $(commentsMatch[i]);
    var rating = comment.find(".rating").attr("class");
    if (typeof rating == "string") {
      try {
        rating = rating.replace("rating", "").replace("allstar", "").trim();
        rating = parseFloat(rating) / 10;
      } catch (e) {
        console.error(e);
      }
    }
    const text = comment.find(".short").text();
    if (text) {
      comments.push({
        comment_id: comment.attr("data-cid"),
        text,
        author: comment.find(".comment-info a").text(),
        avt: comment.find("img").attr("src"),
        date: comment.find(".comment-time").text().trim(),
        rating,
        vote: comment.find(".votes").text(),
      });
    }
  }
  return comments;
};
