const { sendResp, sendErr } = require("../helpers/request");
const Stat = require("../models/statistics");

exports.findList = async (req, resp) => {
  try {
    const stats = await Stat.find({});
    if (!stats || stats?.length == 0) {
      return sendResp(resp, []);
    }
    return sendResp(resp, stats);
  } catch (error) {
    return sendErr(resp, { err: error.toString() });
  }
};
