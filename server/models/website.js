var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WebsiteSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: "Kindly enter the name of the task",
  },
  icon: [
    {
      type: String,
    },
  ],
  url: {
    type: String,
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

WebsiteSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model("Website", WebsiteSchema);
