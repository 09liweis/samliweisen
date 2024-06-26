var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  name: {
    type: String,
    required: "Kindly enter the name of the task",
  },
  date: String,
  transaction: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  },
  steps: [
    {
      name: String,
      status: {
        type: String,
        default: "pending",
      },
      transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending", //working,done
  },
  is_done: {
    type: Boolean,
    default: false,
  },
});

TodoSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.update_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

TodoSchema.pre(
  ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"],
  (next) => {
    this.update_at = new Date();
    const data = this.getUpdate();
    if (data.status) {
      this.is_done = data.status === "done";
    }
    next();
  },
);

module.exports = mongoose.model("Todo", TodoSchema);
