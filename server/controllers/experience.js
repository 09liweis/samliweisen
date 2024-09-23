var Experience = require("../models/experience");
var { sendResp, sendErr } = require("../helpers/request");

exports.findList = async (req, resp) => {
  try {
    const experiences = await Experience.find({}).sort("-start_date");
    return sendResp(resp, experiences);
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.findDetail = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    res.json(experience);
  } catch (err) {
    handleError(res, err);
  }
};

exports.create = async (req, resp) => {
  delete req.body._id;
  const newExperience = new Experience(req.body);
  await newExperience.save();
  return sendResp(resp, { msg: "Created", experience: newExperience });
};

exports.update = async (req, resp) => {
  let updateExperience = req.body;
  updateExperience.update_at = new Date();
  const updatedExperience = await Experience.findOneAndUpdate(
    { _id: req.params.id },
    updateExperience,
    { upsert: true },
  );
  return sendResp(resp, { msg: "Updated", experience: updatedExperience });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
