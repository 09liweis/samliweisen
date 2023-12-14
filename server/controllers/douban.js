const { sendRequest, sendResp, sendErr } = require('../helpers/request');
const { getDoubanUrl, DOUBAN_SITE_API, getPhotos, getComments, getDoubanPoster } = require('../helpers/douban');

const CAST_DOUBAN_URL = 'https://movie.douban.com/celebrity/';
const SORTS = ['recommend', 'time', 'rank'];

const NUM_LIMIT = 30;

exports.getAlltimeBoxOffice = (req, resp) => {
  let {page} = req.query;
  if (!page) {
    page = 1;
  }
  const start = 25 * (page - 1);
  const url = `https://www.douban.com/doulist/1641439/?start=${start}`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, { err: err.toString() });
    }
    const results = $('.doulist-item');
    const movies = results.toArray().map((movie) => {
      return {
        title: $(movie).find('.title a').text(),
        douban_rating: $(movie).find('.rating_nums').text(),
        poster: $(movie).find('.post img').attr('src'),
        release_date: $(movie).find('.abstract').html().split('<br>').pop(),
        totalGross: $(movie).find('.comment').text()
      }
    })
    return sendResp(resp, { movies });
  })
}

exports.getCurrentChinaBoxOffice = (req, resp) => {
  const url = 'https://www.endata.com.cn/BoxOffice/BO/RealTime/reTimeBO.html';
}

exports.getCommingMovies = (req, resp) => {
  let { city } = req.query;
  city = city?.trim();
  if (!city) {
    city = 'guangzhou';
  }
  const url = `https://movie.douban.com/cinema/later/${city}/`;
  sendRequest({ url }, function(err, { statusCode, $ }) {
    if (err) {
      return sendErr(resp, err);
    }
    const listItems = $('#showing-soon .item');
    var movies = [];
    if (listItems) {
      movies = listItems.toArray().map((item) => {
        var movieUrl = $(item).find('.thumb').attr('href');
        var poster = $(item).find('.thumb img').attr('src');
        return {
          douban_id: movieUrl.split('/')[4],
          poster: getDoubanPoster(poster),
          title: $(item).find('.intro h3 a').text(),
          release: $(item).find('ul .dt:nth-child(1)').text(),
          category: $(item).find('ul .dt:nth-child(2)').text(),
          country: $(item).find('ul .dt:nth-child(3)').text()
        }
      });
    }
    return sendResp(resp, { city, movies });
  });
}

exports.getTags = (req, resp) => {
  var { type } = req.body;
  type = type || 'movie';
  const url = `${DOUBAN_SITE_API}search_tags?type=${type}&source=`;
  sendRequest({ url }, (err, { body }) => {
    try {
      var tags = JSON.parse(body).tags;
    } catch (error) {
      var tags = [];
    }
    return sendResp(resp, { type, tags, sorts: SORTS });
  });
}

exports.getPopular = (req, resp) => {
  var { type, tag, page, limit, sort } = req.query;

  sort = sort || SORTS[0];
  type = type || 'movie';
  tag = encodeURIComponent(tag || '热门');
  const page_limit = limit || NUM_LIMIT;
  const page_start = ((page - 1) || 0) * page_limit;
  const url = `${DOUBAN_SITE_API}search_subjects?sort=${sort}&type=${type}&tag=${tag}&page_limit=${page_limit}&page_start=${page_start}`;
  sendRequest({ url }, (err, { body }) => {
    if (err) return sendErr(resp, { err: err.toString() });
    var movies = body.subjects;
    for (let i = 0; i < movies.length; i++) {
      const { cover, rate, id, episodes_info } = movies[i];
      movies[i].poster = cover;
      movies[i].douban_rating = rate;
      movies[i].douban_id = id;
      movies[i].episodes_info = episodes_info;
      delete movies[i].cover;
      delete movies[i].rate;
      delete movies[i].id;
    }
    return sendResp(resp, { tag: decodeURIComponent(tag), movies, page, limit });
  });
}

exports.getPhotos = (req, resp) => {
  //type S -> 剧照, R -> Poster
  const types = {
    S: '剧照',
    R: '海报',
    W: '壁纸'
  }
  var { douban_id, page, type, cast_id } = req.body;
  if (!(douban_id || cast_id)) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  page = page || 1;
  if (douban_id) {
    var url = `${getDoubanUrl(douban_id, { apiName: 'photos' })}`;
    type = type || 'S';
  } else if (cast_id) {
    var url = `${CAST_DOUBAN_URL}${cast_id}/photos/`;
    type = type || 'C';
  }
  url += `?type=${type}&start=${(page - 1) * NUM_LIMIT}`;
  sendRequest({ url }, (err, { $ }) => {
    const title = $('#content h1').text();
    const photos = getPhotos($);
    return sendResp(resp, { title, photos, types, page, type });
  });
}

exports.getVideos = (req, resp) => {
  const { douban_id } = req.body;
  if (!douban_id) {
    return sendErr(resp, 'No douban id');
  }
  const url = `https://movie.douban.com/subject/${douban_id}/trailer`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, err);
    }
    const mods = $('.mod');
    var sections = mods.toArray().map((mod) => {
      var title = $(mod).find('h2').text()
      var videos = { title };
      videos.videos = $(mod).find('.video-list li').toArray().map((v) => {
        var [protocol, a, domain, type, video_id, left] = $(v).find('.pr-video').attr('href').split('/');
        return {
          title: $(v).find('p:nth-child(2) a').text(),
          type,
          video_id,
          length: $(v).find('.pr-video em').text(),
          photo: $(v).find('.pr-video img').attr('src'),
          date: $(v).find('.trail-meta span').text()
        };
      });
      return videos;
    });
    return sendResp(resp, { douban_id, sections });
  });
}

exports.getVideo = (req, resp) => {
  var { video_id, tp } = req.body;
  if (!video_id) {
    return sendErr(resp, 'No video id');
  }
  tp = tp || 'trailer';
  var url = `https://movie.douban.com/${tp}/${video_id}`;
  sendRequest({ url }, (err, { $ }) => {
    if (err) {
      return sendErr(resp, err);
    }
    var title = $('h1').text();
    var src = $('video source').attr('src');
    var comments = getComments($);
    return sendResp(resp, { title, src, comments });
  });
}

exports.getCast = (req, resp) => {
  const { cast_id } = req.body;
  const url = `${CAST_DOUBAN_URL}${cast_id}/`;
  sendRequest({ url }, (err, { $ }) => {
    const infoMatch = $('#headline .info li');
    const infos = {};
    if (infoMatch) {
      for (let i = 0; i < infoMatch.length; i++) {
        var [key, val] = $(infoMatch[i]).text().trim().split(': ');
        infos[key] = val;
      }
    }
    const photosMatch = $('#photos li a');
    if (photosMatch) {
      var photos = photosMatch.toArray().map(p => $(p).find('img').attr('src'));
    }
    const receWorksMatch = $('#recent_movies .list-s li');
    if (receWorksMatch) {
      var recent_works = receWorksMatch.toArray().map((r) => {
        const work = $(r);
        var workDoubanUrl = work.find('.info a').attr('href');
        if (workDoubanUrl) {
          var douban_id = workDoubanUrl.split('/')[4]
        }
        return {
          img: work.find('.pic img').attr('src'),
          title: work.find('.info a').text(),
          douban_id,
          rating: work.find('.info em').text()
        };
      });
    }
    sendResp(resp, {
      cast_id,
      infos,
      name: $('#content h1').text(),
      poster: $('#headline .pic a img').attr('src'),
      intro: $('#intro .all.hidden').text().trim(),
      photos,
      recent_works
    })
  });
}