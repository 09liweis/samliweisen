const {sendRequest,sendResp} = require('../helpers/request');
const {getDoubanUrl,DOUBAN_SITE_API,getPhotos} = require('../helpers/douban');

const CAST_DOUBAN_URL = 'https://movie.douban.com/celebrity/';
const SORTS = ['recommend','time','rank'];

const NUM_LIMIT = 30;

exports.getAlltimeBoxOffice = (req, resp) => {
  const url = 'https://www.douban.com/doulist/1641439/'
}

exports.getCurrentChinaBoxOffice = (req,resp) => {
  const url = 'https://www.endata.com.cn/BoxOffice/BO/RealTime/reTimeBO.html';
}

exports.getTags = (req, resp) => {
  var {type} = req.body;
  type = type || 'movie';
  const url = `${DOUBAN_SITE_API}search_tags?type=${type}&source=`;
  sendRequest({url},(err,{statusCode,$,body}) => {
    try {
      var tags = JSON.parse(body).tags;
    } catch (error) {
      var tags = [];
    }
    return sendResp(resp,{type,tags,sorts:SORTS});
  });
}

exports.getSubjects = (req, resp) => {
  var {type,tag,page,limit,sort} = req.body;
  
  sort = sort ||SORTS[0];
  type = type || 'movie';
  tag = encodeURIComponent(tag || '热门');
  const page_limit = limit || NUM_LIMIT;
  const page_start = ((page - 1) || 0) * page_limit;
  const url = `${DOUBAN_SITE_API}search_subjects?sort=${sort}&type=${type}&tag=${tag}&page_limit=${page_limit}&page_start=${page_start}`;
  sendRequest({url}, (err,{statusCode,$,body}) => {
    var visuals = JSON.parse(body).subjects;
    for (let i = 0; i < visuals.length; i++) {
      const {cover,rate,id,episodes_info} = visuals[i];
      visuals[i].poster = cover;
      visuals[i].douban_rating = rate;
      visuals[i].douban_id = id;
      visuals[i].episodes_info = episodes_info;
      delete visuals[i].cover;
      delete visuals[i].rate;
      delete visuals[i].id;
    }
    return sendResp(resp,{tag:decodeURIComponent(tag),visuals,page,limit});
  });
}

exports.getPhotos = (req,resp) => {
  //type S -> 剧照, R -> Poster
  const types = {
    S:'剧照',
    R:'海报',
    W:'壁纸'
  }
  var {douban_id,page,type,cast_id} = req.body;
  if (!(douban_id || cast_id)) {
    return resp.status(400).json({msg:MISSING_DOUBAN_ID});
  }
  page = page || 1;
  if (douban_id) {
    var url = `${getDoubanUrl(douban_id,{apiName:'photos'})}`;
    type = type || 'S';
  } else if (cast_id) {
    var url = `${CAST_DOUBAN_URL}${cast_id}/photos/`;
    type = type || 'C';
  }
  url += `?type=${type}&start=${(page - 1)*NUM_LIMIT}`;
  sendRequest({url}, (err,{statusCode, $}) => {
    const title = $('#content h1').text();
    const photos = getPhotos($);
    return sendResp(resp,{title,photos,types,page,type});
  });
}

exports.getVideos = (req, resp) => {
  const {douban_id} = req.body;
  const url = `https://movie.douban.com/subject/${douban_id}/trailer`;
  sendRequest({url},(err,{$}) => {
    const mods = $('.mod');
    var ret = mods.toArray().map((mod) => {
      var title = $(mod).find('h2').text()
      var videos = {title};
      videos.list = $(mod).find('.video-list li').toArray().map((v) => {
        var [protocol,a,domain,type,video_id,left] = $(v).find('.pr-video').attr('href').split('/');
        return {
          title:$(v).find('p:nth-child(2) a').text(),
          type,
          video_id,
          photo: $(v).find('.pr-video img').attr('src'),
          date: $(v).find('.trail-meta span').text()
        };
      });
      return videos;
    });
    sendResp(resp,ret);
  });
}

exports.getCast = (req, resp) => {
  const {cast_id} = req.body;
  const url = `${CAST_DOUBAN_URL}${cast_id}/`;
  sendRequest({url},(err,{statusCode,$,body}) => {
    const infoMatch = $('#headline .info li');
    const infos = {};
    if (infoMatch) {
      for (let i = 0; i < infoMatch.length; i++) {
        var [key,val] = $(infoMatch[i]).text().trim().split(': ');
        infos[key] = val;
      }
    }
    const photosMatch = $('#photos li a');
    if (photosMatch) {
      var photos = photosMatch.toArray().map(p => $(p).find('img').attr('src'));
    }
    const receWorksMatch = $('#recent_movies .list-s li');
    if (receWorksMatch) {
      var recent_works = receWorksMatch.toArray().map((r)=>{
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
    sendResp(resp,{
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