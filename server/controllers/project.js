var mongoose = require('mongoose'),
Project = require('../models/project');

exports.getList = (req, resp) => {
  Project.find({}).sort('-created_at').exec((err, projects) => {
    handleError(resp, err);
    resp.json(projects);
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

exports.update = (req, res) => {
  let updateProject = req.body;
  updateProject.update_at = new Date();
  Project.findOneAndUpdate({_id: req.params.id}, updateProject, {upsert: true}, (err, project) => {
    handleError(res, err);
    res.json(project);
  });
};

exports.remove = (req, res) =>{
  Project.remove({_id: req.params.id}, (err) =>{
    handleError(res, err);
    res.json({ok:1,msg:'Project Deleted'});
  });
};


function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}