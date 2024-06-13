var Transaction = require("../models/transaction");
var Place = require("../models/place");
const { sendRequest, sendResp, sendErr } = require("../helpers/request");

function getCurrentMonth() {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function getFormatPrice(price) {
  return `$${Math.abs(price).toFixed(2)}`;
}

function getFormatExpenses(inputExpenses) {
  return inputExpenses.map(({ _id, title, date, price, category, place }) => {
    return {
      id: _id,
      title,
      date,
      price: getFormatPrice(price),
      category,
      place,
    };
  });
}

exports.getStatistics = (req, resp) => {
  let { date } = req.body;
  const statistics = { total: 0 };
  if (!date) {
    date = getCurrentMonth();
  }
  const filter = { date: new RegExp(date, "i") };
  statistics.date = date;
  Transaction.find(filter, "_id title price date category")
    .populate("place")
    .sort("-date")
    .then((transactions) => {
      statistics.categoryPrice = {};
      if (transactions.length == 0) {
        statistics.total = getFormatPrice(0);
        statistics.categoryPrice = [];
        return sendResp(resp, statistics);
      }

      transactions.forEach((transaction) => {
        let { category, price } = transaction;
        price = Math.abs(price);
        statistics.total += price;
        if (statistics.categoryPrice[category]) {
          statistics.categoryPrice[category].total += price;
          statistics.categoryPrice[category].items.push(transaction);
        } else {
          statistics.categoryPrice[category] = {
            total: price,
            items: [transaction],
          };
        }
      });
      const categoryPrice = statistics.categoryPrice;
      const categoryPriceArr = Object.keys(categoryPrice).map((category) => {
        return {
          category,
          total: getFormatPrice(categoryPrice[category].total),
          items: getFormatExpenses(categoryPrice[category].items),
        };
      });
      statistics.total = getFormatPrice(statistics.total);
      statistics.categoryPrice = categoryPriceArr;
      sendResp(resp, statistics);
    })
    .catch((err) => {
      return sendErr(resp, { err: err.toString() });
    });
};

exports.findList = (req, resp) => {
  const user = req.user;
  if (!user) {
    return resp.status(400).json({ msg: "Login Required" });
  }
  let filter = { uid: user._id };
  const { category, date, place_id, limit, page, uid } = req.body;
  if (uid) {
    filter.uid = uid;
  }
  let opt = { limit: 10 };
  if (limit) {
    if (limit != "all") {
      opt.limit = parseInt(limit);
    } else {
      delete opt.limit;
    }
  }
  if (page) {
    opt.skip = parseInt(page) * opt.limit;
  }
  if (category) {
    var inCate = category["$in"];
    var ninCate = category["$nin"];
    if ((inCate && inCate.length > 0) || (ninCate && ninCate.length > 0)) {
      filter.category = category;
    }
  }
  if (place_id) {
    filter.place = place_id;
  }
  if (date) {
    filter.date = new RegExp(date, "i");
  }
  Transaction.find(filter, "_id title price date category", opt)
    .populate("place", "_id name address lat lng icon")
    .sort("-date")
    .then((transactions) => {
      sendResp(resp, transactions);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};

exports.category_list = (req, resp) => {
  Transaction.distinct("category")
    .then((categories) => {
      sendResp(resp, categories);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};
upsertTransaction = async (req, resp) => {
  const user = req.user;
  if (!user) {
    return resp.status(400).json({ msg: "Login Required" });
  }
  const { _id, price, date, category, place, title, uid } = req.body;
  const transactionData = {
    uid: user._id,
    price,
    date,
    category,
    title,
  };
  if (uid) {
    transactionData.uid = uid;
  }
  let p;
  if (typeof place != "undefined") {
    p = await Place.findOne({ place_id: place.place_id });
    if (!p) {
      p = Place(place);
      await p.save();
    } else {
      p.name = place.name;
      p.address = place.address;
      p.lat = place.lat;
      p.lng = place.lng;
      await Place.findOneAndUpdate({ _id: p._id }, p, { upsert: true });
    }
    transactionData.place = p._id;
  }
  let transaction;
  if (_id) {
    transaction = transactionData;
    transaction.update_at = new Date();
    Transaction.findOneAndUpdate({ _id }, transaction, {
      returnNewDocument: true,
      upsert: true,
    })
      .then((t) => {
        console.error(err);
        t.place = p;
        return sendResp(resp, t);
      })
      .catch((err) => {
        return sendErr(resp, { err: err.toString() });
      });
  } else {
    transaction = new Transaction(transactionData);
    transaction
      .save()
      .then((t) => {
        t.place = p;
        return sendResp(resp, t);
      })
      .catch((err) => {
        handleError(resp, err);
      });
  }
};
exports.create = (req, resp) => {
  upsertTransaction(req, resp);
};

exports.update = (req, resp) => {
  upsertTransaction(req, resp);
};

exports.detail = async function (req, resp) {
  const id = req.params.id;
  const t = await Transaction.findById(
    id,
    "title price date category",
  ).populate("place", "_id place_id name address lat lng");
  return sendResp(resp, t);
};

exports.remove = async (req, resp) => {
  //Delete transaction
  const user = req.user;
  if (!user) {
    return resp.status(400).json({ msg: "Login Required" });
  }
  try {
    await Transaction.remove({ _id: req.params.id });
    resp.status(200).json({ ok: 1, msg: "Transaction Deleted" });
  } catch (err) {
    handleError(resp, err);
  }
};

function handleError(res, err) {
  if (err) {
    return res.send(err);
  }
}
