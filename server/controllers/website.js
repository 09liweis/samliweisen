var Website = require("../models/website");
var { sendResp, sendErr } = require("../helpers/request");

exports.findList = async (req, resp) => {
  try {
    const websites = await Website.find({}).sort("-mt");
    return sendResp(resp, {websites});
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.findDetail = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    res.json(website);
  } catch (err) {
    handleError(res, err);
  }
};

exports.create = async (req, resp) => {
  delete req.body._id;
  const newWebsite = new Website(req.body);
  await newWebsite.save();
  return sendResp(resp, { msg: "Created", website: newWebsite });
};

exports.update = async (req, resp) => {
  let updatedWebsite = req.body;
  updatedWebsite.mt = new Date();
  const website = await Website.findOneAndUpdate(
    { _id: req.params.id },
    updatedWebsite,
    { upsert: true },
  );
  return sendResp(resp, { msg: "Updated", website });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
