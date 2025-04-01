var Transaction = require("../models/transaction");
var Place = require("../models/place");
const { sendResp, sendErr } = require("../helpers/request");

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
      _id,
      title,
      date,
      price: getFormatPrice(price),
      income: price > 0,
      category,
      place,
    };
  });
}

exports.getStatistics = async (req, resp) => {
  const user = req.user;
  let { date, categories } = req.body;
  if (!date) {
    date = getCurrentMonth();
  }
  const filter = { date: new RegExp(date, "i") };
  if (categories?.length > 0) {
    filter.category = { $in: categories };
  }
  const transactions = await Transaction.find(
    filter,
    "_id title price date category",
  )
    .populate("place")
    .sort("-date");

  const statistics = {
    date,
    total: 0,
    incomes: 0,
    expenses: 0,
    categoryPrice: {},
  };

  if (transactions.length == 0) {
    statistics.total = getFormatPrice(0);
    statistics.incomes = getFormatPrice(0);
    statistics.expenses = getFormatPrice(0);
    statistics.categoryPrice = [];
    return sendResp(resp, statistics);
  }

  transactions.forEach((transaction) => {
    let { category, price } = transaction;
    statistics.total += price;
    if (price > 0) {
      statistics.incomes += price;
    } else {
      statistics.expenses += price;
    }
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

  const { categoryPrice, incomes, expenses } = statistics;
  const categoryPriceArr = Object.keys(categoryPrice).map((category) => {
    const categoryTotal = categoryPrice[category].total;
    return {
      category,
      percentage: `${((categoryTotal / (categoryTotal > 0 ? incomes : expenses)) * 100).toFixed(2)}%`,
      total: getFormatPrice(categoryTotal),
      income: categoryTotal > 0,
      items: user ? getFormatExpenses(categoryPrice[category].items) : [],
    };
  });

  statistics.total = getFormatPrice(statistics.total);
  statistics.incomes = getFormatPrice(incomes);
  statistics.expenses = getFormatPrice(expenses);
  statistics.categoryPrice = categoryPriceArr;
  return sendResp(resp, statistics);
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
      return sendErr(resp, { err });
    });
};

exports.category_list = (req, resp) => {
  Transaction.distinct("category")
    .then((categories) => {
      sendResp(resp, categories);
    })
    .catch((err) => {
      return sendErr(resp, { err });
    });
};

const upsertTransaction = async (req, resp) => {
  const user = req.user;
  if (!user) {
    return sendErr(resp, { msg: "Login Required" });
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
      p = new Place(place);
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
  try {
    let transaction;
    if (_id) {
      transaction = await Transaction.findOneAndUpdate(
        { _id },
        { ...transactionData, update_at: new Date() },
        {
          returnNewDocument: true,
          upsert: true,
        },
      );
    } else {
      transaction = await new Transaction(transactionData).save();
    }
    transaction.place = p;
    return sendResp(resp, transaction);
  } catch (err) {
    console.error(err);
    return sendErr(resp, { err: err.toString() });
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
    return sendErr(resp, { msg: "Login Required" });
  }
  try {
    await Transaction.deleteOne({ _id: req.params.id });
    return sendResp(resp, { msg: "Transaction Deleted" });
  } catch (err) {
    return sendErr(resp, { err });
  }
};
