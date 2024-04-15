const Category = require("../models/category");
const Transaction = require("../models/transaction");

exports.category_list = (req, resp) => {
  Category.find()
    .then((categories) => {
      resp.json(categories);
    })
    .catch((err) => {
      handleError(resp, err);
    });
};
exports.category_detail = (req, res) => {
  res.json([]);
};
exports.category_import = async (req, res) => {
  console.log("Start importing at " + new Date());
  // Transaction.distinct("category", (err, categories) => {
  //   if (categories && categories.length > 0) {
  //     Category.remove({}, (err, ret) => {
  //       let count = categories.length;
  //       function saveCat() {
  //         const name = categories.pop();
  //         let category = new Category({ name });
  //         category.save((err, saved) => {
  //           if (--count) {
  //             saveCat();
  //           } else {
  //             console.log("Finish importing at " + new Date());
  //             res.json("ok");
  //           }
  //         });
  //       }
  //       saveCat();
  //     });
  //   }
  // });
};
function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
