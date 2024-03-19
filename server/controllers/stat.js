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

exports.findByName = async (req, resp) => {
  const name = req.params.name;
  try {
    const stat = await Stat.findOne({ name: name });
    return sendResp(resp, stat)
  } catch (error) {
    return sendErr(resp, { err: error.toString() });
  }
}