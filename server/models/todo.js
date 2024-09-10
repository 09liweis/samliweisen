var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  name: {
    type: String,
    required: "Kindly enter the name of the task",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  todoList: {
    type: Schema.Types.ObjectId,
    ref:"TodoList"
  },
  loc:{
    addr:String,
    lat:Number,
    lng:Number
  },
  date: String,
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
    // if (data.status) {
    //   this.is_done = data.status === "done";
    // }
    next();
  },
);

module.exports = mongoose.model("Todo", TodoSchema);
