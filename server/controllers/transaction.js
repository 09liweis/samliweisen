var Transaction = require('../models/transaction');
var Place = require('../models/place');
const {sendRequest, sendResp, sendErr} = require('../helpers/request');

exports.getStatistics = (req,resp)=> {
  const {date} = req.body;
  let filter = {};
  let statistics = {};
  if (date) {
    filter.date = new RegExp(date, 'i');
    statistics.date = date;
  }
  Transaction.find(filter, '_id title price date category').sort('-date').exec((err, transactions) => {
    statistics.categoryPrice = {}
    if (transactions.length == 0) {
      return sendResp(resp,statistics);
    }
    handleError(resp, err);
    transactions.forEach(({category,price}) => {
      if (statistics.categoryPrice[category]) {
        statistics.categoryPrice[category] += price;
      } else {
        statistics.categoryPrice[category] = price;
      }
    });
    sendResp(resp,statistics);
  });
}

exports.findList = (req, resp) => {
  const user = req.user;
  if (!user) {
    return resp.status(400).json({msg:'Login Required'});
  }
  let filter = {uid:user._id};
  const {category,date,place_id,limit,page,uid} = req.body;
  if (uid) {
    filter.uid = uid;
  }
  let opt = {limit:10};
  if (limit) {
    if (limit != 'all') {
      opt.limit = parseInt(limit);
    } else {
      delete opt.limit;
    }
  }
  if (page) {
    opt.skip = parseInt(page)*opt.limit;
  }
  if (category) {
    var inCate = category['$in'];
    var ninCate = category['$nin'];
    if ((inCate && inCate.length > 0) || (ninCate && ninCate.length > 0)) {
      filter.category = category;
    }
  }
  if (place_id) {
    filter.place = place_id;
  }
  if (date) {
    filter.date = new RegExp(date, 'i');
  }
  Transaction.find(filter, '_id title price date category',opt).populate('place', '_id name address lat lng icon').sort('-date').exec((err, transactions) => {
    handleError(resp, err);
    sendResp(resp,transactions);
  });
};

exports.category_list = (req, resp) => {
  Transaction.distinct('category', (err, categories) => {
    handleError(resp, err);
    sendResp(resp,categories);
  });
};
upsertTransaction = async (req,resp) =>{
  const user = req.user;
  if (!user) {
    return resp.status(400).json({msg:'Login Required'});
  }
  const {id,price,date,category,place,title,uid} = req.body;
  transactionData = {
    uid:user._id,
    price,
    date,
    category,
    title
  };
  if (uid) {
    transactionData.uid = uid;
  }
  let p;
  if (typeof place != 'undefined') {
    p = await Place.findOne({place_id: place.place_id});
    if (!p) {
      p = Place(place);
      await p.save();
    } else {
      p.name = place.name;
      p.address = place.address;
      p.lat = place.lat;
      p.lng = place.lng;
      await Place.findOneAndUpdate({_id: p._id}, p, {upsert: true});
    }
    transactionData.place = p._id;
  }
  let transaction;
  if (id) {
    transaction = transactionData;
    transaction.update_at = new Date();
    Transaction.findOneAndUpdate({_id: id}, transaction, {returnNewDocument: true,upsert: true},(err, t)=>{
      console.error(err);
      t.place = p;
      return sendResp(resp,t);
    });
  } else {
    transaction = new Transaction(transactionData);
    transaction.save(function(err, t) {
      handleError(resp, err);
      t.place = p;
      return sendResp(resp,t);
    });
  }
}
exports.create = (req, resp) => {
  upsertTransaction(req,resp);
};

exports.update = (req, resp) => {
  upsertTransaction(req,resp);
};

exports.detail = async function(req, resp) {
  const id = req.params.id;
  const t = await Transaction.findById(id,'title price date category').populate('place', '_id place_id name address lat lng');
  sendResp(resp, t);
};

exports.remove = (req, resp) => {
  //Delete transaction
  Transaction.remove({_id: req.params.id}, (err) => {
    handleError(resp, err);
    resp.status(200).json({ok:1,msg:'Transaction Deleted'});
  });
};

function handleError(res, err) {
  if (err) {
    return res.send(err);
  }
}