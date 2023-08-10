const { sendRequest, sendResp } = require('../helpers/request');
const { getDoubanUrl, getReviews, getComments, getCast } = require('../helpers/douban');
const { getImdbSummary } = require('../helpers/imdb');
const Movie = require('../models/movie');

const MISSING_DOUBAN_ID = 'Missing Douban Id';

exports.samVisuals = async (req, resp) => {
  let { page = 1, limit = 10, current_episode, type } = req.query;
  limit = parseInt(limit);
  const skip = (page - 1) * limit;
  let movies = [];
  const filter = {};
  if (current_episode) {
    filter.current_episode = current_episode;
  }
  if (type) {
    filter.visual_type = type;
  }
  try {
    movies = await Movie.find(filter).skip(skip).limit(limit).sort('-date_updated');
  } catch (err) {

  }
  movies.forEach((movie) => {
    if (movie.poster && movie.poster.includes('doubanio')) {
      //flutter app can only show img2 server somehow
      movie.poster = 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/' + movie.poster.split('/').slice(-1);
    }
  });
  return sendResp(resp, { movies });
}

exports.getMovieDetail = async (req, resp) => {
  let { douban_id } = req.params;
  if (douban_id) {
    douban_id = douban_id.trim();
  }
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const movie = await Movie.findOne({ douban_id });
  return sendResp(resp, { movie });
}

exports.getDoubanChart = (req, resp) => {
  const url = 'https://movie.douban.com/chart';
  sendRequest({ url }, function(err, { $ }) {
    const listItems = $('.item');
    const movies = [];
    if (listItems) {
      for (let i = 0; i < listItems.length; i++) {
        const item = $(listItems[i]);
        const linkArray = item.find('.nbg').attr('href').split('/');
        const movie = {
          douban_id: linkArray[4],
          poster: item.find('img').attr('src'),
          title: item.find('.pl2 a').text().trim(),
          douban_rating: item.find('.rating_nums').text()
        }
        movies.push(movie);
      }
    }
    return sendResp(resp, { movies });
  });
}

exports.inTheatre = (req, resp) => {
  let { city } = req.query;
  city = city?.trim();
  if (!city) {
    city = 'guangzhou';
  }
  const url = `https://movie.douban.com/cinema/nowplaying/${city}/`;
  sendRequest({ url }, function(err, { $ }) {
    const listItems = $('.list-item');
    const movies = [];
    if (listItems) {
      const dataNames = ['title', 'release', 'actors', 'director', 'duration', 'category'];
      for (let i = 0; i < listItems.length; i++) {
        const item = $(listItems[i]);
        const movie = {
          douban_id: item.attr('id'),
          poster: item.find('img').attr('src'),
          douban_rating: item.attr('data-score')
        };
        dataNames.forEach(name => {
          movie[name] = item.attr(`data-${name}`);
        });
        movies.push(movie);
      }
    }
    return sendResp(resp, { city, movies });
  });
}

exports.search = (req, resp) => {
  let { keyword } = req.query;
  keyword = keyword?.trim();
  if (!keyword) {
    return resp.status(400).json({ msg: 'No Keyword' });
  }
  const url = `https://m.douban.com/search/?query=${encodeURIComponent(keyword)}&type=movie`;
  sendRequest({ url }, function(err, { $ }) {
    const results = $('.search_results_subjects a');
    if (results) {
      var visuals = results.toArray().map((r) => {
        const visual = $(r);
        const [a, movie, subject, douban_id, b] = visual.attr('href').split('/');
        return {
          douban_id,
          poster: visual.find('img').attr('src'),
          title: visual.find('.subject-title').text(),
          douban_rating: visual.find('.rating span:nth-child(2)').text()
        };
      });
    }
    sendResp(resp, { keyword, visuals });
  });
}

exports.getCelebrities = (req, resp) => {
  const { douban_id } = req.body
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: 'celebrities' });
  sendRequest({ url: douban_url }, function(err, { statusCode, $, body }) {
    const castsMatches = $('.list-wrapper');
    let casts = castsMatches.toArray().map((c) => {
      const castSection = $(c);
      let castTl = castSection.find('h2').text()
      const celebritiesMatch = castSection.find('.celebrity');
      let celebrities = celebritiesMatch.toArray().map(c => getCast($(c), $));
      return { tl: castTl, celebrities };
    });
    sendResp(resp, { douban_url, casts });
  });
}

exports.getPhotoDetail = (req, resp) => {
  const { photo_id } = req.body;
  if (!photo_id) {
    return resp.json({ msg: 'No Photo Id' });
  }
  const douban_url = `https://movie.douban.com/photos/photo/${photo_id}`;
  sendRequest({ url: douban_url }, (err, { $ }) => {
    const commentsMatch = $('.comment-item');
    const uploader = $('.poster-info li:nth-child(5) a').text();
    const upload_date = $('.poster-info li:nth-child(6)').text();
    if (commentsMatch) {
      var comments = commentsMatch.toArray().map((c) => {
        const comment = $(c);
        return {
          pic: comment.find('img').attr('src'),
          date: comment.find('.author span').text(),
          author: comment.find('.author a').text(),
          content: comment.find('p').text()
        };
      });
    }
    sendResp(resp, { uploader, upload_date, comments });
  });
}

exports.getComments = (req, resp) => {
  const { douban_id } = req.body;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: 'comments' });
  sendRequest({ url: douban_url }, (err, { statusCode, $, body }) => {
    const comments = getComments($);
    return sendResp(resp, { comments });
  })
}

exports.getReviews = (req, resp) => {
  let { douban_id } = req.body;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  const douban_url = getDoubanUrl(douban_id, { apiName: 'reviews' });
  sendRequest({ url: douban_url }, (err, { statusCode, $, body }) => {
    const reviews = getReviews($);
    return sendResp(resp, { reviews });
  });
}

exports.getSummary = (req, resp) => {
  let { douban_id } = req.params;
  if (douban_id) {
    douban_id = douban_id.trim();
  }
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  getDoubanMovieSummary(douban_id, (err, visual) => {
    return sendResp(resp, visual);
  })
}

const getDoubanMovieSummary = (douban_id, cb) => {
  const douban_url = getDoubanUrl(douban_id);
  sendRequest({ url: douban_url }, function(err, { statusCode, $, body }) {
    if (err) {
      return cb(err);
    }
    const title = $('span[property="v:itemreviewed"]').text();
    const douban_poster = $('img[rel="v:image"]').attr('src');
    const douban_rating = $('strong[property="v:average"]').text() || 0;
    const summary = $('span[property="v:summary"]').text().trim();
    const douban_vote_count = $('span[property="v:votes"]').text();

    const genresMatch = $('span[property="v:genre"]');
    if (genresMatch) {
      var genres = genresMatch.toArray().map(g => $(g).text());
    }

    const recommendsMatch = $('.recommendations-bd dl');
    if (recommendsMatch) {
      var recommends = recommendsMatch.toArray().map((r) => {
        var recommend = $(r);
        var url = recommend.find('dd a').attr('href');
        if (url) {
          var douban_id = url.split('/')[4];
        }
        return {
          poster: recommend.find('dt img').attr('src'),
          title: recommend.find('dd a').text(),
          douban_id
        };
      });
    }

    const comments = getComments($);

    const photosMatch = $('.related-pic-bd li');
    if (photosMatch) {
      var photos = photosMatch.toArray().map((p) => {
        const media = $(p);
        let tp = 'photo';
        let src = media.find('img').attr('src');
        let href = media.find('a').attr('href');
        if (media.attr('class') == 'label-trailer') {
          tp = 'trailer';
          var imgStyle = media.find('a').attr('style');
          var imgMatches = /url\((.*?)\)/g.exec(imgStyle);
          if (imgMatches) {
            src = imgMatches[1];
          }
        }
        return { tp, src, href };
      })
    }

    const awardsMatch = $('.award');
    if (awardsMatch) {
      var awards = awardsMatch.toArray().map((a) => {
        return {
          nm: $(a).find('li:first-child a').text(),
          award: $(a).find('li:nth-child(2)').text()
        }
      });
    }

    const reviews = getReviews($);

    const castMatches = $('.celebrity');
    if (castMatches) {
      var casts = castMatches.toArray().map(c => getCast($(c), $));
    }

    var websiteMatch = /官方网站:<\/span>(.*?)<br\/>/g.exec(body);
    if (websiteMatch) {
      var website = $(websiteMatch[1]).text().trim();
      if (website.indexOf('http') == -1) {
        website = `https://${website}`;
      }
    }
    var originalTitleMatch = /又名:<\/span>(.*?)<br\/>/g.exec(body);
    if (originalTitleMatch) {
      var original_title = originalTitleMatch[1].trim();
    }

    var episodesMatch = /集数:<\/span>(.*?)<br\/>/g.exec(body);
    const episodes = episodesMatch ? parseInt(episodesMatch[1].trim()) : 1;

    var durationMatch = /单集片长:<\/span>(.*?)<br\/>/g.exec(body);
    let duration = $('span[property="v:runtime"]').attr('content');
    if (durationMatch) {
      duration = durationMatch[1].trim();
      if (/分钟/.test(duration)) {
        duration = duration.replace('分钟', '');
      }
    }

    var langsMatch = /语言:<\/span>(.*?)<br\/>/g.exec(body);
    if (langsMatch) {
      var languages = langsMatch[1].trim().split(' / ');
    }

    var countryMatch = /制片国家\/地区:<\/span>(.*?)<br\/>/g.exec(body);
    if (countryMatch) {
      var countries = countryMatch[1].trim().split(' / ');
    }

    const imdbMatches = body.match(/tt[\d]{7,8}/g);
    let imdb_id = '';
    if (imdbMatches && imdbMatches.length > 0) {
      imdb_id = imdbMatches[0];
    }

    const dateMatches = body.match(/[\d]{4}-[\d]{2}-[\d]{2}\([\u4e00-\u9fff]+\)/g);
    let dates = [];
    for (let i in dateMatches) {
      if (dates.indexOf(dateMatches[i]) == -1) {
        dates.push(dateMatches[i]);
      }
    }

    visual = {
      douban_id,
      // douban_url,
      title,
      original_title,
      douban_poster,
      douban_rating,
      douban_vote_count,
      genres,
      website,
      duration,
      episodes,
      visual_type: (episodes > 1) ? 'tv' : 'movie',
      photos,
      awards,
      languages,
      countries,
      summary,
      casts,
      release_dates: dates,
      recommends,
      reviews,
      comments,
      imdb_id,
    };
    if (!imdb_id) {
      return cb(null, visual);
    }
    //handle scraping imdb data
    getImdbSummary(imdb_id, (err, imdbObj) => {
      if (err) {
        return cb(err);
      }
      visual = Object.assign(visual, imdbObj);
      visual.poster = douban_poster;
      return cb(null, visual);
    })
  });
}

exports.upsertVisual = async (req, resp) => {
  //35376457
  var { douban_id } = req.body;
  if (!douban_id) {
    return resp.status(400).json({ msg: MISSING_DOUBAN_ID });
  }
  getDoubanMovieSummary(douban_id, (err, movie) => {
    if (!movie.douban_id) {
      return resp.status(400).json({ msg: 'Can not get movie' });
    }
    Movie.findOne({ douban_id }, (err, oldMovie) => {
      if (!oldMovie) {
        movie.date_watched = new Date();
        movie.date_updated = new Date();
      }
      Movie.findOneAndUpdate({ douban_id }, movie, { upsert: true }, (err, newMovie) => {
        if (err) {
          return resp.status(400).json({ err });
        }
        return sendResp(resp, movie);
      })
    });
  });
}

exports.updateRandomMovie = (req, resp) => {
  Movie.countDocuments().exec((err, count) => {
    var random = Math.floor(Math.random() * count);
    Movie.findOne().skip(random).exec((err, movie) => {
      if (err || !movie) {
        console.error(err);
        return resp.status(404).json({ msg: 'Movie not found' });
      }
      getDoubanMovieSummary(movie.douban_id, (err, latestMovie) => {
        Movie.updateOne({ douban_id: movie.douban_id }, latestMovie, (err, result) => {
          if (err) return resp.status(400).json({ msg: err.toString() });
          if (result.ok) {
            return sendResp(resp, latestMovie);
          }
        })
      });
    });
  });
}