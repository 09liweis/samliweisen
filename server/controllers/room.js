var mongoose = require("mongoose"),
  Room = require("../models/room");
var { sendResp } = require("../helpers/request");

const STRINGS = {
  BAD_ID: "Invalid room id",
  STEP_NAME: "Missing step name",
};

const ROOM_FIELDS = ["nm", "isAvailable", "cmts", "lastChecked"];
function getRoomDetailFromObj(requestBody) {
  const roomDetail = {};
  ROOM_FIELDS.forEach((roomField) => {
    if (requestBody[roomField]) {
      roomDetail[roomField] = requestBody[roomField];
    }
  });
  return roomDetail;
}

const getTimeDiff = (lastChecked) => {
  const now = new Date();
  const lastCheckedTime = new Date(lastChecked);
  const timeDiff = now - lastCheckedTime;
  if (timeDiff < 1000) {
    return "now";
  } else if (timeDiff < 1000 * 60) {
    return timeDiff / (1000 * 60) + " mins";
  } else if (timeDiff < 1000 * 60 * 60) {
    return timeDiff / (1000 * 60 * 60) + " hrs";
  } else if (timeDiff < 1000 * 60 * 60 * 24) {
    return timeDiff / (1000 * 60 * 60 * 24) + " days";
  } else if (timeDiff < 1000 * 60 * 60 * 24 * 365) {
    return timeDiff / (1000 * 60 * 60 * 24 * 365) + " years";
  }
};

exports.findRoomList = findRoomList = ({ page, limit, status }, cb) => {
  let options = {};
  let query = {};
  if (status) {
    query.status = status;
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
  Room.find(query, "nm startDate endDate isAvailable lastChecked cmts", options)
    .sort("-mt")
    .then((rooms) => {
      rooms.forEach((room) => {
        if (room.lastChecked) {
          room.lastCheckedDiff = getTimeDiff(room.lastChecked);
        }
      });
      cb(null, rooms);
    })
    .catch((err) => {
      cb(err);
    });
};

exports.findList = (req, resp) => {
  findRoomList(req.query, (err, rooms) => {
    handleError(resp, err);
    return sendResp(resp, rooms);
  });
};

exports.createRoom = createRoom = (input, cb) => {
  if (!input.nm) {
    return cb("No Room Name");
  }
  const room = getRoomDetailFromObj(input);
  const newTodo = new Room(room);
  newTodo
    .save()
    .then((room) => {
      cb(null, room);
    })
    .catch((err) => {
      cb(err);
    });
};

exports.create = (req, res) => {
  createRoom(req.body, (err, room) => {
    if (err) {
      return handleError(res, err);
    }
    return sendResp(res, room);
  });
};

exports.findDetail = async (req, resp) => {
  const rendId = req.params.id;
  if (!rendId) {
    return resp.status(404).json({ msg: STRINGS.BAD_ID });
  }
  try {
    const room = await Room.findById(rendId);
    return sendResp(resp, room);
  } catch (err) {
    return handleError(resp, err);
  }
};

exports.update = (req, resp) => {
  let room = getRoomDetailFromObj(req.body);
  if (room.lastChecked) {
    room.lastChecked = Date.now();
  }
  room.update_at = new Date();
  Room.findOneAndUpdate({ _id: req.params.id }, room, {
    upsert: true,
    new: true,
  })
    .then((room) => {
      resp.status(200).json(room);
    })
    .catch((err) => {
      handleError(resp, err);
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
