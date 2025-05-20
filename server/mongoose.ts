
import mongoose from "mongoose";

class Mongoose {
  constructor() {
    mongoose.Promise = global.Promise;

    const dbUrl = process.env["MONGODB_URL"];
    if (!dbUrl) {
      console.error("MONGODB_URL is not set");
      return;
    }
    mongoose.connect(dbUrl);

    mongoose.connection.on("connected", function () {
      console.info("Connected to db");
    });

    mongoose.connection.on("error", function () {
      console.error("connected fail");
      //TODO: add email notification
    });

    mongoose.connection.on("disconnected", function () {
      console.error("Mongoose connection disconnected");
      //TODO: add email notification
    });
  }
}

export default Mongoose;
