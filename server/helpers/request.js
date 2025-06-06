var cheerio = require("cheerio");
var ParseSelector = require("./parseSelector");

const getCheerio = (body) => {
  var body = body.replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, "");
  return cheerio.load(body.toString(), {
    normalizeWhitespace: true,
    decodeEntities: true,
  });
};

const REQUEST_HEADERS = {
  "Accept-Language": "en-CA,en;q=0.8",
  "Accept-Charset": "utf-8, iso-8859-1;q=0.5",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
};

const handleRequestResp = (body) => {
  try {
    const statusCode = 200;
    //handle json api result
    try {
      const parseBody = JSON.parse(body);
      return { body: parseBody };
    } catch (err) {
      const $ = new ParseSelector(getCheerio(body));
      return { statusCode, $, body };
    }
  } catch (err) {
    return err;
  }
};

/**
 * @param {object} {url, method, body}
 * @param {function} cb
 */
exports.sendRequest = async (
  { url, method = "GET", body, headers = {} },
  cb,
) => {
  const requestOpt = { method, headers: { ...REQUEST_HEADERS, ...headers } };
  if (body) {
    requestOpt.body = JSON.stringify(body);
    //for post method
  }
  try {
    const resp = await fetch(url, requestOpt);
    if (resp.ok) {
      const respData = await resp.text();
      const result = handleRequestResp(respData);
      return cb ? cb(null, result) : result;
    } else {
      console.error(resp);
      return cb ? cb({ err: "Fetch Err" }) : { err: "Fetch Err" };
    }
  } catch (err) {
    console.error(err);
    return cb ? cb(err) : err;
  }
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
