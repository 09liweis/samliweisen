var mongoose = require('mongoose'),
Rent = require('../models/rent');
var {sendResp} = require('../helpers/request');

const STRINGS = {
  BAD_ID: 'Invalid rent id',
  STEP_NAME: 'Missing step name'
};

exports.findRentList = findRentList = ({page,limit,status},cb)=>{
  let options = {};
  let query = {};
  if (status) {
    query.status = status
  }
  //TODO: fix pagination
  if (page) {
    options.skip = parseInt(page);
  } else {
    options.skip = 0;
  }
  if (limit) {
    options.limit = parseInt(limit);
  }
  Rent.find(query, '_id nm startDate endDate isAvailable cmts', options).sort('-mt').exec((err, rents) => {
    cb(err,rents);
  });
}

exports.findList = (req, resp) => {
  findRentList(req.query,(err,rents)=>{
    handleError(resp, err);
    return sendResp(resp,rents);
  });
};

exports.createRent = createRent = (input,cb) => {
  const {nm,startDate,endDate,isAvailable,cmts} = input;
  const rent = {
    nm,
    startDate,
    endDate,
    isAvailable,
    cmts
  }
  const newTodo = new Rent(rent);
  newTodo.save((err, rent) => {
    cb(err,rent);
  });
}

exports.create = (req, res) => {
  createRent(req.body,(err,rent)=>{
    handleError(res, err);
    return sendResp(res,rent);
  });
};

exports.findDetail = (req, resp) => {
  const rendId = req.params.id;
  if (!rendId) {
    return resp.status(404).json({msg:STRINGS.BAD_ID});
  }
  Rent.findById(rendId, (err, rent) => {
    if (err) {
      return handleError(resp, err);
    }
    resp.status(200).json(rent);
  });
};

exports.update = (req, resp) => {
  const {steps,nm,date,isAvailable,cmts} = req.body;
  let rent = {
    nm,
    date,
    isAvailable,
    cmts
  }
  rent.update_at = new Date();
  Rent.findOneAndUpdate({_id: req.params.id}, rent, {upsert: true, new: true}, (err, rent) => {
    handleError(resp, err);
    resp.status(200).json(rent);
  });
};

exports.remove = (req, resp) => {
  Rent.remove({_id: req.params.id}, (err) => {
    handleError(resp, err);
    resp.status(200).json({ok:1});
  });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}