var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TodoListSchema = new Schema({
  name: {
    type: String,
    required: "Kindly enter the name of the task",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
  ts: {
    type: Date,
    default: Date.now,
  },
  mt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending", //working,done
  },
});

TodoListSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

TodoListSchema.pre(
  ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"],
  (next) => {
    this.mt = new Date();
    const data = this.getUpdate();
    // if (data.status) {
    //   this.is_done = data.status === "done";
    // }
    next();
  },
);

module.exports = mongoose.model("TodoList", TodoListSchema);
