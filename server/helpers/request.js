var axios = require("axios");
var cheerio = require("cheerio");

exports.getCheerio = getCheerio = (body) => {
  var body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, "");
  return cheerio.load(body.toString(), {
    normalizeWhitespace: true,
    decodeEntities: true,
  });
};

const headers = {
  "Accept-Language": "zh-CN,zh;q=0.8",
  "Accept-Charset": "utf-8, iso-8859-1;q=0.5",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
};

/**
 * @param {object} {url, method, body}
 * @param {function} cb
 */
exports.sendRequest = ({ url, method = "GET", body }, cb) => {
  requestOpt = { url, method, headers };
  if (body) {
    requestOpt.data = body;
    //for post method
  }
  axios(requestOpt).then((resp) => {
    try {
      var body = resp.data;
      let statusCode = 200;
      if (resp) {
        statusCode = resp.status;
      }
      //handle json api result
      if (body && typeof body == "object") {
        return cb(null, { body });
      }
      const $ = getCheerio(body);
      return cb(null, { statusCode, $, body });
    } catch (err) {
      return cb(err, {});
    }
  });
};

/**
 * @param {object} resp
 * @param {object} errObj
 */
exports.sendErr = (resp, errObj) => {
  return resp.status(400).json(errObj);
};

exports.sendResp = (resp, data) => {
  return resp.status(resp.statusCode).json(data);
};
