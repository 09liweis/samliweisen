var mongoose = require('mongoose'),
  Room = require('../models/room');
var { sendResp } = require('../helpers/request');

const STRINGS = {
  BAD_ID: 'Invalid room id',
  STEP_NAME: 'Missing step name'
};

const ROOM_FIELDS = ['nm', 'startDate', 'endDate', 'isAvailable', 'cmts', 'lastChecked'];
function getRoomDetailFromObj(requestBody) {
  const roomDetail = {};
  ROOM_FIELDS.forEach((roomField) => {
    if (requestBody[roomField]) {
      roomDetail[roomField] = requestBody[roomField];
    }
  });
  return roomDetail;
}

exports.findRoomList = findRoomList = ({ page, limit, status }, cb) => {
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
  Room.find(query, 'nm startDate endDate isAvailable lastChecked cmts', options).sort('-mt').exec((err, rooms) => {
    cb(err, rooms);
  });
}

exports.findList = (req, resp) => {
  findRoomList(req.query, (err, rooms) => {
    handleError(resp, err);
    return sendResp(resp, rooms);
  });
};

exports.createRoom = createRoom = (input, cb) => {
  if (!input.nm) {
    return cb('No Room Name');
  }
  const room = getRoomDetailFromObj(input);
  const newTodo = new Room(room);
  newTodo.save((err, room) => {
    cb(err, room);
  });
}

exports.create = (req, res) => {
  createRoom(req.body, (err, room) => {
    if (err) {
      return handleError(res, err);
    }
    return sendResp(res, room);
  });
};

exports.findDetail = (req, resp) => {
  const rendId = req.params.id;
  if (!rendId) {
    return resp.status(404).json({ msg: STRINGS.BAD_ID });
  }
  Room.findById(rendId, (err, room) => {
    if (err) {
      return handleError(resp, err);
    }
    resp.status(200).json(room);
  });
};

exports.update = (req, resp) => {
  let room = getRoomDetailFromObj(req.body);
  if (room.lastChecked) {
    room.lastChecked = Date.now()
  }
  room.update_at = new Date();
  Room.findOneAndUpdate({ _id: req.params.id }, room, { upsert: true, new: true }, (err, room) => {
    handleError(resp, err);
    resp.status(200).json(room);
  });
};

exports.remove = (req, resp) => {
  Room.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    resp.status(200).json({ ok: 1 });
  });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}