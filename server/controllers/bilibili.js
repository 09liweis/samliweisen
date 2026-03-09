const { sendResp, sendErr, sendRequest } = require("../helpers/request");
const biliAPI = require("bili-api");

exports.getBilibili = async (req, resp) => {
  try {
    const userId = "19524235";
    // let up = await biliAPI({ mid: userId }, ["dynamicsRaw"]);
    const bilibiliResp = await sendRequest(
      {
        url: "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=&host_mid=19524235",
      }
    );
    return sendResp(resp, bilibiliResp);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};
