var Website = require("../models/website");
var { sendResp, sendErr } = require("../helpers/request");

exports.findList = async (req, resp) => {
  const user = req.user;
  try {
    const websites = await Website.find({uid:user._id}).sort("-mt");
    return sendResp(resp, {websites});
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.create = async (req, resp) => {
  if (!req.user) {
    return sendErr(resp, { msg: "Login Required" });
  }
  delete req.body._id;
  req.body.uid = req.user._id;
  const newWebsite = new Website(req.body);
  await newWebsite.save();
  return sendResp(resp, { msg: "Created", website: newWebsite });
};

exports.update = async (req, resp) => {
  if (!req.user) {
    return sendErr(resp, { msg: "Login Required" });
  }
  let updatedWebsite = req.body;
  updatedWebsite.uid = req.user._id;
  updatedWebsite.mt = new Date();
  const website = await Website.findOneAndUpdate(
    { _id: req.params.id },
    updatedWebsite,
    { upsert: true },
  );
  return sendResp(resp, { msg: "Updated", website });
};
