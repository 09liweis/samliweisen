const DOUBAN_SITE = 'https://movie.douban.com/subject/';

exports.DOUBAN_SITE_API = 'https://movie.douban.com/j/';

exports.getPhotos = ($) => {
  const photosMatch = $('.poster-col3 li');
  var photos = [];
  if (photosMatch) {
    for (let i = 0; i < photosMatch.length; i++) {
      const photo = $(photosMatch[i]);
      const href = photo.find('a').attr('href').split('/');
      if (href && href.length > 5) {
        var photo_id = href[5];
      }
      photos.push({
        thumb: photo.find('img').attr('src'),
        origin: `https://img9.doubanio.com/view/photo/l/public/p${photo_id}.jpg`,
        name: photo.find('.name').text().trim(),
        prop: photo.find('.prop').text().trim(),
        photo_id
      })
    }
  }
  return photos;
}

/**
 * @param {string} douban_id
 * @param {object} opt
 * @return {string}
*/
exports.getDoubanUrl = (douban_id, opt = {}) => {
  let endPoint = opt.apiName || '';
  return `${DOUBAN_SITE}${douban_id}/${endPoint}`;
}

function getAvtUrl(element) {
  var avtStyle = element.find('div.avatar').attr('style');
  var avtMatches = /url\((.*?)\)/g.exec(avtStyle);
  let avt = avtMatches ? avtMatches[1] : '';
  return avt;
}

exports.getCast = (cast, $) => {
  const worksMatch = cast.find('.works a');
  let works = [];
  if (worksMatch) {
    for (let i = 0; i < worksMatch.length; i++) {
      const work = $(worksMatch[i]);
      works.push({
        url: work.attr('href'),
        tl: work.attr('title')
      })
    }
  }
  const name = cast.find('a.name');
  const href = name.attr('href');
  var id;
  if (href) {
    const hrefArray = href.split('/');
    id = hrefArray[hrefArray.length - 2];
  }
  return {
    id,
    name: name.text(),
    avt: getAvtUrl(cast),
    role: cast.find('.role').text(),
    works
  }
}

exports.getReviews = ($) => {
  const reviewsMatch = $('.main.review-item');
  var reviews = [];
  if (!reviewsMatch) {
    return reviews;
  }
  reviewsMatch.toArray().forEach(item => {
    var review = $(item);
    var rating = review.find('.main-title-rating').attr('class');
    if (typeof rating == 'string') {
      try {
        rating = rating.replace('main-title-rating', '').replace('allstar', '').trim();
        rating = parseFloat(rating) / 10;
      } catch (error) {
        rating = 'N/A';
        console.error(error);
      }
    }
    reviews.push({
      review_id: review.find('.review-short').attr('data-rid'),
      title: review.find('h2 a').text(),
      content: review.find('.short-content').text(),
      author: review.find('.name').text(),
      avt: review.find('.avator img').attr('src'),
      rating,
      date: review.find('.main-meta').text(),
      usefull_count: review.find('.action-btn.up span').text().trim(),
      useless_count: review.find('.action-btn.down span').text().trim(),
      reply_count: review.find('.reply').text()
    });
  });
  return reviews;
}

exports.getComments = ($) => {
  const commentsMatch = $('.comment-item');
  var comments = [];
  if (!commentsMatch) {
    return comments;
  }
  for (var i = 0; i < commentsMatch.length; i++) {
    var comment = $(commentsMatch[i]);
    var rating = comment.find('.rating').attr('class');
    if (typeof rating == 'string') {
      try {
        rating = rating.replace('rating', '').replace('allstar', '').trim();
        rating = parseFloat(rating) / 10;
      } catch (e) {
        console.error(e)
      }
    }
    const text = comment.find('.short').text();
    if (text) {
      comments.push({
        text,
        author: comment.find('.comment-info a').text(),
        avt: comment.find('img').attr('src'),
        date: comment.find('.comment-time').text().trim(),
        rating,
        vote: comment.find('.votes').text()
      });
    }
  }
  return comments;
}