var Experience = require("../models/experience");

exports.findList = async (req, resp) => {
  try {
    const experiences = await Experience.find({}).sort("-start_date");
    resp.json(experiences);
  } catch (err) {
    resp.json({ err });
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

exports.create = (req, res) => {
  delete req.body._id;
  const newExperience = new Experience(req.body);
  newExperience.save((err, experience) => {
    handleError(res, err);
    res.json(experience);
  });
};

exports.update = (req, res) => {
  let updateExperience = req.body;
  updateExperience.update_at = new Date();
  Experience.findOneAndUpdate(
    { _id: req.params.id },
    updateExperience,
    { upsert: true },
    (err, experience) => {
      handleError(res, err);
      res.json(experience);
    },
  );
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
