var mongoose = require("mongoose"),
  Rentee = require("../models/rentee");
var { sendResp } = require("../helpers/request");

const STRINGS = {
  BAD_ID: "Invalid rentee id",
  STEP_NAME: "Missing step name",
};

const RENTEE_FIELDS = [
  "nm",
  "startDate",
  "endDate",
  "deposits",
  "monthlyRent",
  "room",
];
function getRoomDetailFromObj(requestBody) {
  const renteeDetail = {};
  RENTEE_FIELDS.forEach((roomField) => {
    if (requestBody[roomField]) {
      renteeDetail[roomField] = requestBody[roomField];
    }
  });
  return renteeDetail;
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

exports.findRenteeList = findRenteeList = ({ page, limit, status }, cb) => {
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
  Rentee.find(
    query,
    "nm startDate endDate isAvailable lastChecked cmts",
    options,
  )
    .sort("-mt")
    .then((rentees) => {
      rentees.forEach((rentee) => {
        if (rentee.lastChecked) {
          rentee.lastCheckedDiff = getTimeDiff(rentee.lastChecked);
        }
      });
      cb(null, rentees);
    })
    .catch((err) => {
      cb(err);
    });
};

exports.findList = (req, resp) => {
  findRenteeList(req.query, (err, rentees) => {
    handleError(resp, err);
    return sendResp(resp, rentees);
  });
};

exports.createRoom = createRoom = (input, cb) => {
  if (!input.nm) {
    return cb("No Rentee Name");
  }
  const rentee = getRoomDetailFromObj(input);
  const newTodo = new Rentee(rentee);
  newTodo
    .save()
    .then((rentee) => {
      cb(null, rentee);
    })
    .catch((err) => {
      cb(err);
    });
};

exports.create = (req, res) => {
  createRoom(req.body, (err, rentee) => {
    if (err) {
      return handleError(res, err);
    }
    return sendResp(res, rentee);
  });
};

exports.findDetail = async (req, resp) => {
  const rendId = req.params.id;
  if (!rendId) {
    return resp.status(404).json({ msg: STRINGS.BAD_ID });
  }
  try {
    const rentee = await Rentee.findById(rendId);
    return sendResp(resp, rentee);
  } catch (err) {
    return handleError(resp, err);
  }
};

exports.update = (req, resp) => {
  let rentee = getRoomDetailFromObj(req.body);
  if (rentee.lastChecked) {
    rentee.lastChecked = Date.now();
  }
  rentee.mt = new Date();
  Rentee.findOneAndUpdate({ _id: req.params.id }, rentee, {
    upsert: true,
    new: true,
  })
    .then((rentee) => {
      resp.status(200).json(rentee);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};

exports.remove = (req, resp) => {
  Rentee.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    resp.status(200).json({ ok: 1 });
  });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
