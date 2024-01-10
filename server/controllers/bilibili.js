const { sendResp, sendErr } = require("../helpers/request");
const biliAPI = require("bili-api");

exports.getBilibili = async (req, resp) => {
  try {
    const userId = "19524235";
    let up = await biliAPI({ mid: userId }, ["allVideos", "dynamics"]);
    return sendResp(resp, up);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};
