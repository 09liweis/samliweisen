var mongoose = require("mongoose"),
  Project = require("../models/project");

exports.getList = (req, resp) => {
  Project.find({})
    .sort("-created_at")
    .then((projects) => {
      resp.json(projects);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};

exports.create = (req, resp) => {
  const newProject = new Project(req.body);
  newProject.save((err, project) => {
    handleError(resp, err);
    resp.json(project);
  });
};

exports.findDetail = (req, resp) => {
  Project.findById(req.params.id, (err, project) => {
    handleError(resp, err);
    resp.json(project);
  });
};

exports.update = (req, resp) => {
  let updateProject = req.body;
  updateProject.update_at = new Date();
  Project.findOneAndUpdate(
    { _id: req.params.id },
    updateProject,
    { upsert: true },
    (err, project) => {
      handleError(resp, err);
      resp.json(project);
    },
  );
};

exports.remove = (req, resp) => {
  Project.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    resp.json({ ok: 1, msg: "Project Deleted" });
  });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
