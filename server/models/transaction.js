const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
    required: 'Price is required for transaction'
  },
  date: {
    type: String,
    required: 'Date is required for transaction'
  },
  uid: {
    type: Schema.Types.ObjectId
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place'
  },
  category: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);