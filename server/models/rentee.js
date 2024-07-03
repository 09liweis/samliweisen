var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  nm: String,
  startDate: String,
  endDate: String,
  cmts: String, //comments
  deposits: Number,
  monthlyRent: Number,
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  ts: {
    type: Date,
    default: Date.now,
  },
  mt: {
    type: Date,
    default: Date.now,
  },
});

RoomSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model("Rentee", RoomSchema);
